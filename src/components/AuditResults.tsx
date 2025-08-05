import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, AlertTriangle, XCircle, FileText, Download } from 'lucide-react';

interface AuditResult {
  id: string;
  type: 'success' | 'warning' | 'error';
  category: string;
  message: string;
  details?: string;
  recommendation?: string;
}

interface AuditResultsProps {
  results: AuditResult[];
  fileName: string;
  onDownloadReport?: () => void;
}

export const AuditResults = ({ results, fileName, onDownloadReport }: AuditResultsProps) => {
  const successCount = results.filter(r => r.type === 'success').length;
  const warningCount = results.filter(r => r.type === 'warning').length;
  const errorCount = results.filter(r => r.type === 'error').length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <CheckCircle className="h-5 w-5 text-success" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-card to-accent border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-card-foreground">Audit Results</h3>
              <p className="text-muted-foreground">{fileName}</p>
            </div>
          </div>
          {onDownloadReport && (
            <Button variant="outline" onClick={onDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          )}
        </div>

        {/* Summary */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="text-sm font-medium">{successCount} Passed</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span className="text-sm font-medium">{warningCount} Warnings</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <span className="text-sm font-medium">{errorCount} Issues</span>
          </div>
        </div>
      </Card>

      {/* Results */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4 text-card-foreground">Detailed Analysis</h4>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {results.map((result) => (
              <Card key={result.id} className="p-4 border border-border">
                <div className="flex items-start gap-3">
                  {getIcon(result.type)}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getBadgeVariant(result.type)} className="text-xs">
                        {result.category}
                      </Badge>
                    </div>
                    <p className="font-medium text-card-foreground">{result.message}</p>
                    {result.details && (
                      <p className="text-sm text-muted-foreground">{result.details}</p>
                    )}
                    {result.recommendation && (
                      <div className="p-3 bg-accent rounded-lg">
                        <p className="text-sm text-accent-foreground">
                          <strong>Recommendation:</strong> {result.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};