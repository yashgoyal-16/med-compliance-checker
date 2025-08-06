import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full p-6 text-center">
        <div className="mb-4 p-3 bg-destructive/10 rounded-full mx-auto w-fit">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Application Error</h2>
        <p className="text-muted-foreground mb-4">
          The application encountered an error. Please try refreshing or return to the homepage.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-muted rounded text-left text-sm max-h-32 overflow-auto">
            <code className="text-xs">{error.message}</code>
          </div>
        )}
        <div className="space-y-2">
          <Button onClick={resetError} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" onClick={handleReload} className="w-full">
            Reload Page
          </Button>
          <Button variant="ghost" onClick={handleGoHome} className="w-full">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </Card>
    </div>
  );
};