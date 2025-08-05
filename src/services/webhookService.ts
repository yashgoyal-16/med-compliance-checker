const WEBHOOK_URL = 'https://simplifygenai.app.n8n.cloud/webhook/88b0276b-4320-4d1d-956f-1c374cc484b4';

export interface WebhookPayload {
  file: File;
  fileName: string;
  timestamp: string;
  source: string;
}

export interface WebhookResponse {
  success: boolean;
  results?: string;
  error?: string;
  message?: string;
}

export const sendToWebhook = async (file: File, fileName: string): Promise<WebhookResponse> => {
  try {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('timestamp', new Date().toISOString());
    formData.append('source', 'Antishtraf AI - Medical Report Audit');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout for medical report processing

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    const data = await response.text();
    
    return {
      success: true,
      results: data || 'No output received from webhook',
      message: 'Analysis completed successfully'
    };
  } catch (error) {
    console.error('Webhook error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Processing timeout (5 minutes exceeded) - please try again with a smaller file or contact support'
        };
      }
      
      if (error.message.includes('CORS')) {
        return {
          success: false,
          error: 'Network configuration error - please contact support'
        };
      }
      
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: false,
      error: 'Failed to connect to audit service'
    };
  }
};