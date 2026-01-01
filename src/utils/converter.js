import mammoth from 'mammoth';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
// Using CDN for simplicity in Vite without complex build config
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export async function convertDocxToMd(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Convert docx to HTML using Mammoth
    // Mammoth is excellent at preserving semantic structure
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value;
    const messages = result.messages; // warnings, etc.

    if (messages && messages.length > 0) {
      console.warn('Mammoth conversion messages:', messages);
    }

    // Convert HTML to Markdown using Turndown with GFM (GitHub Flavored Markdown)
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      emDelimiter: '*',
    });

    // Use GFM plugin for tables, strikethrough, etc.
    turndownService.use(gfm);

    const markdown = turndownService.turndown(html);
    return { success: true, markdown };
  } catch (error) {
    console.error('Conversion Failed', error);
    return { success: false, error: error.message };
  }
}

export async function convertPdfToMd(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullMarkdown = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Simple heuristic to reconstruct text
        // This is "best effort" as PDF doesn't have semantic structure
        let pageText = "";
        let lastY = -1;
        let lastHeight = -1;

        // Sort items by Y (top to bottom) then X (left to right)
        // PDF coordinates: (0,0) is usually bottom-left, so higher Y is higher on page.
        // But textContent.items usually come in reading order.
        // We'll trust the order mostly but use Y to detect line breaks.
        
        const items = textContent.items;

        for (const item of items) {
            // item.transform[5] is the Y position
            // item.transform[4] is the X position
            // item.height is font height (approx)
            
            const txt = item.str;
            const height = item.height; // Font size roughly
            
            // If it's a big font, treat as header
            // This is a rough heuristic. Standard text ~12px.
            
            if (txt.trim() === '') { 
               continue; 
            }

             // Detect simple headers
            if (height > 14 && height !== lastHeight) {
                pageText += `\n\n## ${txt} \n`;
            } else {
                 // formatting: bold/italic is hard to detect without font inspection map
                 pageText += txt + " ";
            }
            
            lastHeight = height;
        }
        
        fullMarkdown += pageText + "\n\n---\n\n"; // Page break
    }

    return { success: true, markdown: fullMarkdown };

  } catch (error) {
      console.error('PDF Conversion Failed', error);
      return { success: false, error: error.message };
  }
}
