import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import useAuthStore from "../../../stores/AuthStore.ts";
import AdminContentLayout from "../../../layouts/Admin/ContentLayout.tsx";
import { useImportSocket } from "../../../hooks/useImportSocket.ts";

interface UploadData {
  id: string;
  name: string;
  totalRecords: number;
  createdAt: string;
}

interface UploadStatus {
  type: 'success' | 'error';
  data?: UploadData;
  message?: string;
}

const ImportProductsBulk: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'logs'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Use socket hook
  const {
    logs,
    isProcessing,
    isDone,
    connectSocket,
    disconnectSocket,
    addLog,
    clearLogs
  } = useImportSocket();

  // Auto scroll to bottom when new logs arrive
  useEffect(() => {
    if (logs.length > 0 && activeTab === 'logs') {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  // Switch to logs tab when upload is successful
  useEffect(() => {
    if (uploadStatus?.type === 'success') {
      setActiveTab('logs');
    }
  }, [uploadStatus]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    }
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus(null);
    setActiveTab('upload');
    clearLogs();
    disconnectSocket();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (): Promise<void> => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);
    clearLogs();

    try {
      const token = useAuthStore.getState().accessToken;
      const formData = new FormData();
      formData.append('file', file);

      // First API call - upload file
      const uploadResponse = await fetch('https://api.tdcosmetics.beauty/api/v1/eco/import-file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      const uploadData: UploadData = await uploadResponse.json();

      if (uploadData) {
        setUploadStatus({
          type: 'success',
          data: uploadData
        });

        // Add initial log
        addLog({
          type: 'success',
          message: `File uploaded successfully! Import ID: ${uploadData.id}`,
          timestamp: new Date()
        });

        // Connect to socket for real-time updates
        connectSocket(uploadData.id);

        // Second API call - start import process
        const importFormData = new FormData();
        importFormData.append('file', file);
        importFormData.append('importFileId', uploadData.id);

        try {
          const importResponse = await fetch('https://api.tdcosmetics.beauty/api/v1/eco/import-products', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: importFormData
          });

          if (!importResponse.ok) {
            throw new Error(`Import failed: ${importResponse.statusText}`);
          }

          addLog({
            type: 'info',
            message: 'Import process started. Waiting for real-time updates...',
            timestamp: new Date()
          });

        } catch (importError) {
          const errorMessage = importError instanceof Error ? importError.message : 'Unknown error';
          console.error('Import process failed:', importError);
          addLog({
            type: 'error',
            message: `Import process failed: ${errorMessage}`,
            timestamp: new Date()
          });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      console.error('Upload failed:', error);
      setUploadStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimestamp = (timestamp: Date): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <AdminContentLayout title="Import Products Bulk" subtitle="Import products in bulk using a CSV file">
      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'upload'
                  ? 'border-primary-dark text-primary-dark'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              File Upload
              {file && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary-dark/80 text-white ">
                  1 file
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'logs'
                  ? 'border-primary-dark text-primary-dark'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Logs
              {logs.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary-dark/80   text-white">
                  {logs.length}
                </span>
              )}
              {isProcessing && (
                <Loader2 className="inline-block ml-1 h-3 w-3 animate-spin text-yellow-500" />
              )}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`relative drop-shadow-lg border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : file
                    ? 'border-green-900 bg-primary-dark/05'
                    : 'bg-primary border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              style={{ cursor: 'pointer' }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!file ? (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Drop your CSV file here
                  </h3>
                  <p className="text-gray-500 mb-4">
                    or click to browse and select a file
                  </p>
                  <p className="text-sm text-gray-400">
                    Only CSV files are supported
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-center space-x-4">
                  <FileText className="h-8 w-8 text-primary-dark" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Upload Button */}
            {file && !uploadStatus && (
              <div className="flex justify-center">
                <button
                  onClick={uploadFile}
                  disabled={isUploading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-light cursor-pointer hover:scale-110  transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Uploading...
                    </>
                  ) : (
                    'Upload and Import'
                  )}
                </button>
              </div>
            )}

            {/* Upload Status */}
            {uploadStatus && (
              <div className={`p-5 rounded-xl ${
                uploadStatus.type === 'success' ? 'bg-gradient-to-br  from-white/10 to-emerald-200/20 shadow-primary' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start">
                  {uploadStatus.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-primary-dark mt-0.5 mr-3" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                  )}
                  <div className="flex-1">
                    {uploadStatus.type === 'success' ? (
                      <div>
                        <h3 className="text-xl font-medium text-primary-dark">File uploaded successfully! </h3>
                        <div className="mt-2 text-sm emerald-950">
                          <p><strong>ID:</strong> {uploadStatus.data?.id}</p>
                          <p><strong>Name:</strong> {uploadStatus.data?.name}</p>
                          <p><strong>Total Records:</strong> {uploadStatus.data?.totalRecords}</p>
                          <p><strong>Created:</strong> {uploadStatus.data?.createdAt ? new Date(uploadStatus.data.createdAt).toLocaleString() : 'N/A'}</p>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => setActiveTab('logs')}
                            className="rounded-4xl text-sm text-primary-dark underline  font-medium cursor-pointer hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-light"
                          >
                            View import logs →
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-sm font-medium text-red-800">Upload failed</h3>
                        <p className="mt-1 text-sm text-red-700">{uploadStatus.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-primary/10 shadow-primary rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-primary-dark border-b border-white flex items-center justify-between">
              <h3 className="font-medium text-white text- font-bold">Import Logs</h3>
              {isProcessing && (
                <div className="flex items-center text-yellow-400">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  <span className="text-sm">Processing...</span>
                </div>
              )}
              {isDone && (
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-400 " />
                  <span className="text-sm text-green-400">Done</span>
                </div>
              )}
            </div>
            <div className="p-4 h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-primary-dark text-sm">No logs available. Upload a file to see import logs.</p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-xs text-primary-dark mt-0.5 w-20 flex-shrink-0 font-mono">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 font-medium ${
                        log.type === 'error' ? 'bg-red-900 text-red-200' :
                          log.type === 'success' ? 'bg-green-700 text-green-100' :
                            'bg-blue-900 text-blue-200'
                      }`}>
                        {log.type?.toUpperCase() || 'INFO'}
                      </span>
                      <span className={`text-sm ${
                        log.type === 'error' ? 'text-red-900 ' :
                          log.type === 'success' ? 'text-green-700 ' :
                            'text-primary-dark'
                      } break-words flex-1`}>{log.message}</span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminContentLayout>
  );
};

export default ImportProductsBulk;