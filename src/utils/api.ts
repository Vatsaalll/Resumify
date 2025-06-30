// API utilities for n8n workflow integration

export interface JobSearchRequest {
  user_id: string;
  resume_text: string;
  suggested_roles: string[];
  keywords: string[];
}

export interface JobSearchResponse {
  success: boolean;
  workflow_id: string;
  download_url: string;
  message: string;
}

export interface ResumeData {
  resume_text: string;
  suggested_roles: string[];
  user_id: string;
}

export interface SheetStorageRequest {
  user_id: string;
  sheet_id: string;
  sheet_name: string;
  download_url: string;
}

// Trigger n8n workflow for job search
export const triggerJobSearchWorkflow = async (data: JobSearchRequest): Promise<JobSearchResponse> => {
  try {
    // In a real implementation, this would call your n8n webhook
    // For now, we'll simulate the API call
    const response = await fetch('/api/trigger-job-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error triggering job search workflow:', error);
    throw new Error('Failed to trigger job search workflow');
  }
};

// Get resume data for n8n workflow
export const getResumeData = async (userId: string): Promise<ResumeData> => {
  try {
    const response = await fetch(`/api/resume?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching resume data:', error);
    throw new Error('Failed to fetch resume data');
  }
};

// Store sheet information
export const storeSheetData = async (data: SheetStorageRequest): Promise<void> => {
  try {
    const response = await fetch('/api/store-sheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error storing sheet data:', error);
    throw new Error('Failed to store sheet data');
  }
};

// Download job sheet
export const downloadJobSheet = async (userId: string): Promise<string> => {
  try {
    const response = await fetch(`/api/download-sheet?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.download_url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw new Error('Failed to get download URL');
  }
};