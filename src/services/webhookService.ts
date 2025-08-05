const WEBHOOK_URL = 'https://simplifygenai.app.n8n.cloud/webhook-test/88b0276b-4320-4d1d-956f-1c374cc484b4';

export interface WebhookPayload {
  file: File;
  fileName: string;
  timestamp: string;
  source: string;
}

export interface WebhookResponse {
  success: boolean;
  results?: any[];
  error?: string;
  message?: string;
}

export const sendToWebhook = async (file: File, fileName: string): Promise<WebhookResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('timestamp', new Date().toISOString());
    formData.append('source', 'Antishtraf AI - Medical Report Audit');

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the backend response format
    let results = [];
    if (data.output) {
      try {
        // Extract JSON from the output string (remove markdown formatting)
        const jsonString = data.output.replace(/```json\n|\n```/g, '');
        const parsedData = JSON.parse(jsonString);
        
        // Convert backend format to frontend format
        if (parsedData.audit_results) {
          results = parsedData.audit_results.map((item: any, index: number) => ({
            id: (index + 1).toString(),
            type: item.status === 'Non-compliant' ? 'error' : 
                  item.status === 'Compliant' ? 'success' : 'warning',
            category: item.rule.split('.')[0] + '.' || 'General',
            message: item.rule,
            details: `Status: ${item.status}`,
            recommendation: item.evidence
          }));
        }
      } catch (parseError) {
        console.error('Failed to parse backend response:', parseError);
      }
    }
    
    return {
      success: true,
      results: results,
      message: 'Analysis completed successfully'
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to connect to audit service'
    };
  }
};