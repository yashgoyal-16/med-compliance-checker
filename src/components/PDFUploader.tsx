import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface PDFUploaderProps {
  onFileProcessed: (file: File, fileName: string) => void;
  isProcessing?: boolean;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onFileProcessed, isProcessing }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsComplete(true);
    
    onFileProcessed(file, file.name);
    
    toast({
      title: "PDF uploaded successfully",
      description: `Ready to process ${file.name}`,
    });
  }, [onFileProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: isProcessing || uploadedFile !== null
  });

  const removeFile = () => {
    setUploadedFile(null);
    setIsComplete(false);
  };

  if (uploadedFile) {
    return (
      <div className="p-4 bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
            {uploadedFile.name}
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
        
        {isComplete && (
          <div className="flex items-center justify-center text-sm text-green-600">
            <CheckCircle className="mr-2 h-4 w-4" />
            PDF ready for analysis
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={removeFile}
          className="mt-2 w-full"
          disabled={isProcessing}
        >
          <X className="mr-2 h-4 w-4" />
          Remove file
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50 hover:bg-accent/50'
        }
        ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <div className="mb-4 p-3 bg-primary/10 rounded-full">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {isDragActive ? 'Drop PDF here...' : 'Upload PDF Document'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {isDragActive 
            ? 'Release to upload your PDF file'
            : 'Drag & drop a PDF file here, or click to browse'
          }
        </p>
        <div className="text-xs text-muted-foreground">
          <p>• Accepted format: PDF</p>
          <p>• Maximum size: 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default PDFUploader;