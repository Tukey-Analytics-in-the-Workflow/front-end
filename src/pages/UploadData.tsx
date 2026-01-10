import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle2, X, FileJson, Table, AlertCircle } from 'lucide-react';
import { useUploadPos } from '@/Apis/hooks';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import type { HTTPValidationError } from '@/Apis/types';
import { getErrorMessage } from '@/Apis/utils/errorHandler';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: 'csv' | 'json';
  status: 'processing' | 'completed' | 'error';
  uploadedAt: string;
  rows?: number;
  errorMessage?: string;
}

export default function UploadData() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { mutate: uploadFile, isPending: isUploading } = useUploadPos({
    onSuccess: (data) => {
      toast({
        title: 'Upload successful',
        description: `File uploaded successfully. ${data.rows} rows and ${data.columns.length} columns processed.`,
      });
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      setUploadError(null);
    },
    onError: (error: AxiosError<HTTPValidationError>) => {
      const errorMessage = getErrorMessage(error);
      setUploadError(errorMessage);
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileType = (fileName: string): 'csv' | 'json' => {
    return fileName.toLowerCase().endsWith('.json') ? 'json' : 'csv';
  };

  const handleFileUpload = useCallback((file: File) => {
    if (!isAdmin) {
      toast({
        title: 'Permission denied',
        description: 'Only admins can upload files.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    const fileType = getFileType(file.name);
    if (fileType !== 'csv' && fileType !== 'json') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload CSV or JSON files only.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'File size must be less than 50MB.',
        variant: 'destructive',
      });
      return;
    }

    // Create file entry
    const fileId = Date.now().toString();
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: formatFileSize(file.size),
      type: fileType,
      status: 'processing',
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    setFiles((prev) => [newFile, ...prev]);
    setUploadError(null);

    // Upload file
    uploadFile(file, {
      onSuccess: (data) => {
        // Update file status to completed
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, status: 'completed', rows: data.rows } as UploadedFile
              : f
          )
        );
      },
      onError: () => {
        // Update file status to error
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, status: 'error', errorMessage: 'Upload failed' }
              : f
          )
        );
      },
    });
  }, [isAdmin, uploadFile, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles[0]);
    }
  }, [handleFileUpload]);

  const handleFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileUpload(selectedFiles[0]);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Upload POS Data</h1>
        <p className="text-muted-foreground mt-1">
          Import your point-of-sale data to power AI-driven insights
        </p>
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="text-green-600" size={20} />
          <p className="text-green-800 font-medium">File uploaded successfully! Processing complete.</p>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-800 font-medium">{uploadError}</p>
        </div>
      )}

      {/* Upload Zone */}
      <Card className="shadow-sm">
        <CardContent className="p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="text-primary" size={28} />
              </div>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Drag and drop your files here
            </h3>
            <p className="text-muted-foreground mb-4">
              Supports CSV and JSON formats up to 50MB
            </p>
            <div className="flex justify-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button onClick={handleFileInput} disabled={!isAdmin || isUploading}>
                {isUploading ? 'Uploading...' : 'Select Files'}
              </Button>
            </div>
            {!isAdmin && (
              <p className="text-sm text-muted-foreground mt-4">
                Contact an admin to upload new data files
              </p>
            )}
          </div>

          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Table size={16} />
              <span>CSV files</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileJson size={16} />
              <span>JSON files</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Recent Uploads</CardTitle>
          <CardDescription>Your uploaded data files and their processing status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-card flex items-center justify-center border">
                    {file.type === 'csv' ? (
                      <Table className="text-green-600" size={20} />
                    ) : (
                      <FileJson className="text-orange-600" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.uploadedAt}</span>
                      {file.rows && (
                        <>
                          <span>•</span>
                          <span>{file.rows.toLocaleString()} rows</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={file.status === 'completed' ? 'default' : file.status === 'error' ? 'destructive' : 'secondary'}
                    className={file.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                  >
                    {file.status === 'processing' ? (
                      <span className="flex items-center gap-1">
                        <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                        Processing
                      </span>
                    ) : file.status === 'completed' ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Completed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <AlertCircle size={12} />
                        Error
                      </span>
                    )}
                  </Badge>
                  {file.errorMessage && (
                    <p className="text-xs text-red-600 mt-1">{file.errorMessage}</p>
                  )}
                  {isAdmin && (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
