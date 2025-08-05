import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { FileText, Upload, X, CheckCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

interface PDFUploaderProps {
  onFileProcessed: (text: string, fileName: string) => void;
  isProcessing?: boolean;
}

export const PDFUploader = ({ onFileProcessed, isProcessing = false }: PDFUploaderProps) => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // Set worker path for pdfjs
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;
      
      // Convert file to array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine text items with spaces
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n\n';
      }
      
      if (!fullText.trim()) {
        throw new Error('No text content found in PDF');
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
      }
      throw new Error('Failed to extract text from PDF');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setProgress(0);

    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const extractedText = await extractTextFromPDF(file);
      onFileProcessed(extractedText, file.name);
      
      toast({
        title: "PDF processed successfully",
        description: `Extracted text from ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Failed to extract text from PDF",
        variant: "destructive",
      });
      setUploadedFile(null);
      setProgress(0);
    }
  }, [onFileProcessed, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: isProcessing
  });

  const removeFile = () => {
    setUploadedFile(null);
    setProgress(0);
  };

  if (uploadedFile) {
    return (
      <Card className="p-6 bg-gradient-to-br from-card to-accent border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/20 rounded-lg">
              <FileText className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium text-card-foreground">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {progress === 100 && (
              <CheckCircle className="h-5 w-5 text-success" />
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={removeFile}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {progress < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing PDF...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {progress === 100 && !isProcessing && (
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle className="h-4 w-4" />
            <span>Ready for audit analysis</span>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card 
      {...getRootProps()} 
      className={`p-8 border-2 border-dashed transition-all duration-300 cursor-pointer
        ${isDragActive 
          ? 'border-primary bg-primary/5 shadow-[var(--shadow-medical)]' 
          : 'border-border hover:border-primary/50 hover:bg-accent/50'
        }
        ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-card-foreground">
          Upload Medical Report
        </h3>
        <p className="text-muted-foreground mb-4">
          {isDragActive 
            ? 'Drop your PDF file here...'
            : 'Drag & drop a PDF file here, or click to select'
          }
        </p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Supported format: PDF</p>
          <p>• Maximum file size: 10MB</p>
          <p>• Files are processed securely</p>
        </div>
      </div>
    </Card>
  );
};