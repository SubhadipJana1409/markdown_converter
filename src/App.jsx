import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Check, AlertCircle, Loader2, Download, Trash2, FileJson } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { convertDocxToMd, convertPdfToMd } from './utils/converter';
import './App.css';


function App() {
  const [files, setFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);

  // Handle File Drop
  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending', // pending, converting, done, error
      markdown: null,
      error: null,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  // Remove File
  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Convert All Files
  const convertAll = async () => {
    setIsConverting(true);
    
    // Process files sequentially or allow parallel (parallel is better for speed, but JS single thread limits it slightly, async works fine)
    const updatedFiles = [...files]; // deep copy logic needed if we mutate, but we'll map

    // We only convert pending files
    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status === 'pending' || updatedFiles[i].status === 'error') {
        // Update to converting
        setFiles(prev => prev.map(f => f.id === updatedFiles[i].id ? { ...f, status: 'converting' } : f));
        
        // Convert
        let result;
        if (updatedFiles[i].file.type === 'application/pdf') {
             result = await convertPdfToMd(updatedFiles[i].file);
        } else {
             result = await convertDocxToMd(updatedFiles[i].file);
        }
        
        // Update result
        setFiles(prev => prev.map(f => f.id === updatedFiles[i].id ? {
          ...f,
          status: result.success ? 'done' : 'error',
          markdown: result.markdown,
          error: result.error
        } : f));
      }
    }
    
    setIsConverting(false);
  };

  // Download Single File
  const downloadOne = (fileItem) => {
    if (!fileItem.markdown) return;
    const blob = new Blob([fileItem.markdown], { type: 'text/markdown;charset=utf-8' });
    const ext = fileItem.file.name.split('.').pop();
    const name = fileItem.file.name.replace(`.${ext}`, '.md');
    saveAs(blob, name);
  };

  // Download All as Zip
  const downloadAll = async () => {
    const zip = new JSZip();
    const convertedFiles = files.filter(f => f.status === 'done' && f.markdown);
    
    if (convertedFiles.length === 0) return;

    convertedFiles.forEach(f => {
      const ext = f.file.name.split('.').pop();
      const name = f.file.name.replace(`.${ext}`, '.md');
      zip.file(name, f.markdown);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'converted_files.zip');
  };

  const clearAll = () => {
    setFiles([]);
  };

  const hasPending = files.some(f => f.status === 'pending');
  const hasConverted = files.some(f => f.status === 'done');

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">DOCX to Markdown</h1>
        <p className="app-subtitle">Convert your documents to clean, formatted Markdown instantly.</p>
      </header>

      <div className={`glass-panel dropzone-container`}>
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <Upload className="upload-icon" />
          <p className="dropzone-text">
            {isDragActive ? "Drop the files here..." : "Drag & drop DOCX or PDF files"}
          </p>
          <p className="dropzone-subtext">or click to browse from your computer</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="glass-panel" style={{ padding: '0' }}>
          <div className="file-list">
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Files ({files.length})</h3>
              <button className="remove-btn" onClick={clearAll} title="Clear All">
                <Trash2 size={16} /> <span style={{ marginLeft: '4px' }}>Clear</span>
              </button>
            </div>
            
            {files.map((f) => (
              <div key={f.id} className="file-item">
                <div className="file-info">
                  <FileText className="file-icon" />
                  <div className="file-details">
                    <span className="file-name">{f.file.name}</span>
                    <span className="file-size">{(f.file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                <div className="file-status">
                  {f.status === 'pending' && <span className="status-badge status-pending">Pending</span>}
                  {f.status === 'converting' && (
                    <span className="status-badge status-converting" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <Loader2 size={12} className="animate-spin" /> Converting
                    </span>
                  )}
                  {f.status === 'done' && <span className="status-badge status-done">Success</span>}
                  {f.status === 'error' && <span className="status-badge status-error">Error</span>}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {f.status === 'done' && (
                    <button className="btn-secondary" style={{ padding: '8px' }} onClick={() => downloadOne(f)} title="Download Markdown">
                      <Download size={18} />
                    </button>
                  )}
                  <button className="remove-btn" onClick={() => removeFile(f.id)}>
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="actions-bar" style={{ padding: '1.5rem' }}>
             {hasPending && (
               <button className="btn-primary" onClick={convertAll} disabled={isConverting}>
                 {isConverting ? 'Converting...' : 'Convert All Files'}
               </button>
             )}
             
             {hasConverted && (
               <button className="btn-primary" style={{  background: 'linear-gradient(135deg, #10b981, #059669)' }} onClick={downloadAll}>
                 Download All (ZIP)
               </button>
             )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
