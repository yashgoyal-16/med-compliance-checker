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
  results: any;
  fileName: string;
  onDownloadReport?: () => void;
}

export const AuditResults = ({ results, fileName, onDownloadReport }: AuditResultsProps) => {
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
              <h3 className="text-xl font-semibold text-card-foreground">Webhook Response</h3>
              <p className="text-muted-foreground">{fileName}</p>
            </div>
          </div>
          {onDownloadReport && (
            <Button variant="outline" onClick={onDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Response
            </Button>
          )}
        </div>
      </Card>

      {/* Raw Response */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4 text-card-foreground">Raw Response Data</h4>
        <ScrollArea className="h-[400px] pr-4">
          <pre className="bg-muted p-4 rounded-lg text-sm text-muted-foreground whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </ScrollArea>
      </Card>
    </div>
  );
};