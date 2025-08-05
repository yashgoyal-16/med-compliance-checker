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
    
    return {
      success: true,
      results: data,
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