import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
    deleteApplicationEvent,
    getApplication,
    updateApplication,
    type ApplicationDetails,
    type ApplicationStatus,
} from '../api/applications';

export function ApplicationDetailsPage() {
    const { id } = useParams();

    const [application, setApplication] =
        useState<ApplicationDetails | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError('Identifiant manquant');
            setLoading(false);
            return;
        }

        getApplication(Number(id))
            .then(setApplication)
            .catch(() => setError('Candidature introuvable'))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleDeleteEvent(eventId: number) {
        if (!application) {
            return;
        }

        try {
            await deleteApplicationEvent(application.id, eventId);

            const updatedApplication =
                await getApplication(application.id);

            setApplication(updatedApplication);
        } catch {
            setError("Impossible de supprimer l'événement");
        }
    }

    async function handleStatusChange(status: ApplicationStatus) {
        if (!application) {
            return;
        }

        try {
            await updateApplication(application.id, { status });

            const updatedApplication =
                await getApplication(application.id);

            setApplication(updatedApplication);
        } catch {
            setError('Impossible de modifier le statut');
        }
    }

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error || !application) {
        return <p>{error ?? 'Candidature introuvable'}</p>;
    }

    return (
        <main>
            <Link to="/">← Retour</Link>

            <h1>{application.company}</h1>
            <h2>{application.position}</h2>

            <div>
                <label htmlFor="status">Statut : </label>

                <select
                    id="status"
                    value={application.status}
                    onChange={(event) =>
                        void handleStatusChange(
                            event.target.value as ApplicationStatus,
                        )
                    }
                >
                    <option value="TO_APPLY">À postuler</option>
                    <option value="SENT">Envoyée</option>
                    <option value="FOLLOW_UP">À relancer</option>
                    <option value="INTERVIEW">Entretien</option>
                    <option value="REJECTED">Refusée</option>
                    <option value="OFFER">Offre reçue</option>
                    <option value="ABANDONED">Abandonnée</option>
                </select>
            </div>

            {application.location && (
                <p>Localisation : {application.location}</p>
            )}

            {application.contactEmail && (
                <p>Email : {application.contactEmail}</p>
            )}

            {application.contactPhone && (
                <p>Téléphone : {application.contactPhone}</p>
            )}

            <h2>Historique</h2>

            {application.events.length === 0 ? (
                <p>Aucun événement.</p>
            ) : (
                <ul>
                    {application.events.map((event) => {
                        const canDelete =
                            event.type !== 'CREATED' &&
                            event.type !== 'STATUS_CHANGED';

                        return (
                            <li key={event.id}>
                                <strong>{event.title}</strong>
                                {' — '}
                                {new Date(event.eventDate).toLocaleDateString('fr-FR')}

                                {event.description && (
                                    <p>{event.description}</p>
                                )}

                                {canDelete && (
                                    <button
                                        type="button"
                                        onClick={() => void handleDeleteEvent(event.id)}
                                    >
                                        Supprimer
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </main>
    );
}