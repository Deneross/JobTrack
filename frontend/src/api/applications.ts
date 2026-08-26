export type ApplicationStatus =
    | 'TO_APPLY'
    | 'SENT'
    | 'FOLLOW_UP'
    | 'INTERVIEW'
    | 'REJECTED'
    | 'OFFER'
    | 'ABANDONED';

export type ContractType =
    | 'APPRENTICESHIP'
    | 'INTERNSHIP'
    | 'CDD'
    | 'CDI'
    | 'FREELANCE'
    | 'OTHER';

export type EventType =
    | 'FOLLOW_UP'
    | 'RESPONSE'
    | 'INTERVIEW'
    | 'NOTE';

export type InterviewType =
    | 'HR'
    | 'TECHNICAL'
    | 'MANAGER'
    | 'OTHER';

export type InterviewOutcome =
    | 'WAITING_RESPONSE'
    | 'NEXT_INTERVIEW'
    | 'REJECTED'
    | 'OFFER';

export type Interview = {
    id: number;
    type: InterviewType;
    scheduledAt: string;
    location: string | null;
    notes: string | null;
    completedAt: string | null;
    outcome: InterviewOutcome | null;
    applicationId: number;
    createdAt: string;
};

export type Application = {
    id: number;
    company: string;
    position: string;
    status: ApplicationStatus;
    sourceUrl: string | null;
    location: string | null;
    contractType: ContractType | null;
    salary: string | null;
    jobDescription: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    appliedAt: string;
    followUpAt: string | null;
    createdAt: string;
    updatedAt: string;
};

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
    interviews: Interview[];
};

export type DashboardStats = {
    total: number;
    active: number;
    dueFollowUps: number;
    interviews: number;
    byStatus: Record<string, number>;
};

export type UpdateApplicationData = {
    company?: string;
    position?: string;
    status?: ApplicationStatus;
    sourceUrl?: string;
    location?: string;
    contractType?: ContractType;
    salary?: string;
    jobDescription?: string;
    contactEmail?: string;
    contactPhone?: string;
    appliedAt?: string;
    followUpAt?: string;
};

export type UpdateInterviewData = {
    type?: InterviewType;
    scheduledAt?: string;
    location?: string;
    notes?: string;
    outcome?: InterviewOutcome;
};

export async function deleteInterview(
    applicationId: number,
    interviewId: number,
): Promise<void> {
    const response = await fetch(
        `${API_URL}/applications/${applicationId}/interviews/${interviewId}`,
        {
            method: 'DELETE',
        },
    );

    if (!response.ok) {
        throw new Error("Impossible de supprimer l'entretien");
    }
}

export async function updateInterview(
    applicationId: number,
    interviewId: number,
    data: UpdateInterviewData,
): Promise<Interview> {
    const response = await fetch(
        `${API_URL}/applications/${applicationId}/interviews/${interviewId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    );

    if (!response.ok) {
        throw new Error("Impossible de modifier l'entretien");
    }

    return response.json();
}

export type CreateEventData = {
    type: EventType;
    title: string;
    description?: string;
};

const API_URL = 'http://localhost:3000';

export async function getApplications(): Promise<Application[]> {
    const response = await fetch(`${API_URL}/applications`);

    if (!response.ok) {
        throw new Error('Impossible de récupérer les candidatures');
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

export async function getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(
        `${API_URL}/applications/dashboard/stats`,
    );

    if (!response.ok) {
        throw new Error('Impossible de récupérer les statistiques');
    }

    return response.json();
}

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

export async function createApplicationEvent(
    applicationId: number,
    data: CreateEventData,
): Promise<ApplicationEvent> {
    const response = await fetch(
        `${API_URL}/applications/${applicationId}/events`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    );

    if (!response.ok) {
        throw new Error("Impossible d'ajouter l'événement");
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
        throw new Error("Impossible de supprimer l'événement");
    }
}
export async function getDueFollowUps(): Promise<Application[]> {
    const response = await fetch(
        `${API_URL}/applications/follow-ups/due`,
    );

    if (!response.ok) {
        throw new Error('Impossible de récupérer les relances');
    }

    return response.json();
}

export async function deleteApplication(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/applications/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Impossible de supprimer la candidature');
    }
}

export type CreateInterviewData = {
    type: InterviewType;
    scheduledAt: string;
    location?: string;
    notes?: string;
};

export async function createInterview(
    applicationId: number,
    data: CreateInterviewData,
): Promise<Interview> {
    const response = await fetch(
        `${API_URL}/applications/${applicationId}/interviews`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    );

    if (!response.ok) {
        throw new Error("Impossible de créer l'entretien");
    }

    return response.json();
}

export async function completeInterview(
    applicationId: number,
    interviewId: number,
    outcome: InterviewOutcome,
): Promise<void> {
    const response = await fetch(
        `${API_URL}/applications/${applicationId}/interviews/${interviewId}/complete`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ outcome }),
        },
    );

    if (!response.ok) {
        throw new Error("Impossible de terminer l'entretien");
    }
}