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

export async function getApplication(
    id: number,
): Promise<ApplicationDetails> {
    const response = await fetch(`${API_URL}/applications/${id}`);

    if (!response.ok) {
        throw new Error('Candidature introuvable');
    }

    return response.json();
}

export type ApplicationEvent = {
    id: number;
    type:
        | 'CREATED'
        | 'STATUS_CHANGED'
        | 'FOLLOW_UP'
        | 'RESPONSE'
        | 'INTERVIEW'
        | 'NOTE';
    title: string;
    description: string | null;
    eventDate: string;
    createdAt: string;
    applicationId: number;
};

export type ApplicationDetails = Application & {
    events: ApplicationEvent[];
};
export type UpdateApplicationData = {
    status?: ApplicationStatus;
    company?: string;
    position?: string;
    location?: string;
    contactEmail?: string;
    contactPhone?: string;
    followUpAt?: Date;
};

export async function updateApplication(
    id: number,
    data: UpdateApplicationData,
): Promise<Application> {
    const response = await fetch(`${API_URL}/applications/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Impossible de modifier la candidature');
    }

    return response.json();
}

export async function deleteApplicationEvent(
    applicationId: number,
    eventId: number,
): Promise<void> {
    const response = await fetch(
        `${API_URL}/applications/${applicationId}/events/${eventId}`,
        {
            method: 'DELETE',
        },
    );

    if (!response.ok) {
        throw new Error('Impossible de supprimer cet événement');
    }
}
