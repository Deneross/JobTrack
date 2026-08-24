export type ApplicationStatus =
    | 'TO_APPLY'
    | 'SENT'
    | 'FOLLOW_UP'
    | 'INTERVIEW'
    | 'REJECTED'
    | 'OFFER'
    | 'ABANDONED';

export type Application = {
    id: number;
    company: string;
    position: string;
    status: ApplicationStatus;
    sourceUrl: string | null;
    location: string | null;
    contractType: string | null;
    salary: string | null;
    jobDescription: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    appliedAt: string;
    followUpAt: string | null;
    createdAt: string;
    updatedAt: string;
};

const API_URL = 'http://localhost:3000';

export async function getApplications(): Promise<Application[]> {
    const response = await fetch(`${API_URL}/applications`);

    if (!response.ok) {
        throw new Error('Impossible de récupérer les candidatures');
    }

    return response.json();
}

export type DashboardStats = {
    total: number;
    active: number;
    dueFollowUps: number;
    interviews: number;
    byStatus: Record<string, number>;
};

export async function getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(
        `${API_URL}/applications/dashboard/stats`,
    );

    if (!response.ok) {
        throw new Error('Impossible de récupérer les statistiques');
    }

    return response.json();
}
