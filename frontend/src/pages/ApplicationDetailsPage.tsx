import { useEffect, useState } from 'react';
import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';

import { EventForm } from '../components/EventForm';
import { ApplicationEditForm } from '../components/ApplicationEditForm';
import { InterviewForm } from '../components/InterviewForm';
import { CompleteInterview } from '../components/CompleteInterview';
import { InterviewEditForm } from '../components/InterviewEditForm';

import {
    deleteApplication,
    deleteInterview,
    deleteApplicationEvent,
    getApplication,
    updateApplication,
    type ApplicationDetails,
    type ApplicationStatus,
} from '../api/applications';

export function ApplicationDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] =
        useState<ApplicationDetails | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isPlanningInterview, setIsPlanningInterview] =
        useState(false);
    const [editingInterviewId, setEditingInterviewId] =
        useState<number | null>(null);


    useEffect(() => {
        if (!id) {
            setError('Identifiant manquant');
            setLoading(false);
            return;
        }

        getApplication(Number(id))
            .then(setApplication)
            .catch(() =>
                setError('Candidature introuvable'),
            )
            .finally(() => setLoading(false));
    }, [id]);

    async function reloadApplication() {
        if (!application) {
            return;
        }

        try {
            const updatedApplication =
                await getApplication(application.id);

            setApplication(updatedApplication);
        } catch {
            setError(
                'Impossible de recharger la candidature',
            );
        }
    }

    async function handleDeleteInterview(interviewId: number) {
        if (!application) {
            return;
        }

        const confirmed = window.confirm(
            'Supprimer définitivement cet entretien ?',
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteInterview(
                application.id,
                interviewId,
            );

            await reloadApplication();
        } catch {
            setError(
                "Impossible de supprimer l'entretien",
            );
        }
    }

    async function handleDeleteApplication() {
        if (!application) {
            return;
        }

        const confirmed = window.confirm(
            `Supprimer définitivement la candidature chez ${application.company} ?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteApplication(application.id);
            navigate('/');
        } catch {
            setError(
                'Impossible de supprimer la candidature',
            );
        }
    }

    async function handleDeleteEvent(eventId: number) {
        if (!application) {
            return;
        }

        try {
            await deleteApplicationEvent(
                application.id,
                eventId,
            );

            await reloadApplication();
        } catch {
            setError(
                "Impossible de supprimer l'événement",
            );
        }
    }

    async function handleStatusChange(
        status: ApplicationStatus,
    ) {
        if (!application) {
            return;
        }

        try {
            await updateApplication(
                application.id,
                { status },
            );

            await reloadApplication();
        } catch {
            setError(
                'Impossible de modifier le statut',
            );
        }
    }

    if (loading) {
        return (
            <main>
                <p>Chargement...</p>
            </main>
        );
    }

    if (error || !application) {
        return (
            <main>
                <Link to="/">← Retour</Link>

                <p className="text-danger">
                    {error ?? 'Candidature introuvable'}
                </p>
            </main>
        );
    }

    return (
        <main>
            <Link to="/">← Retour</Link>

            {/* En-tête */}
            <div className="application-header">
                <div>
                    <h1>{application.company}</h1>
                    <h2>{application.position}</h2>
                </div>

                <div className="application-status">
                    <span className="detail-label">
                        Statut
                    </span>

                    {application.status ===
                    'INTERVIEW' ? (
                        <span className="status-badge status-badge--interview">
                            Entretien
                        </span>
                    ) : (
                        <select
                            id="status"
                            value={application.status}
                            onChange={(event) =>
                                void handleStatusChange(
                                    event.target
                                        .value as ApplicationStatus,
                                )
                            }
                        >
                            <option value="TO_APPLY">
                                À postuler
                            </option>

                            <option value="SENT">
                                Envoyée
                            </option>

                            <option value="FOLLOW_UP">
                                À relancer
                            </option>

                            <option value="WAITING_RESPONSE">
                                En attente de réponse
                            </option>

                            <option value="REJECTED">
                                Refusée
                            </option>

                            <option value="OFFER">
                                Offre reçue
                            </option>

                            <option value="ABANDONED">
                                Abandonnée
                            </option>
                        </select>
                    )}
                </div>
            </div>

            <div className="application-details-grid">

                {/* COLONNE GAUCHE */}
                <div className="application-main-column">

                    {/* Informations */}
                    <section className="detail-card">
                        <h2>Informations</h2>

                        <div className="details-list">

                            <div>
                                <span className="detail-label">
                                    Entreprise
                                </span>

                                <span>
                                    {application.company}
                                </span>
                            </div>

                            <div>
                                <span className="detail-label">
                                    Poste
                                </span>

                                <span>
                                    {application.position}
                                </span>
                            </div>

                            {application.location && (
                                <div>
                                    <span className="detail-label">
                                        Localisation
                                    </span>

                                    <span>
                                        {application.location}
                                    </span>
                                </div>
                            )}

                            {application.contractType && (
                                <div>
                                    <span className="detail-label">
                                        Type de contrat
                                    </span>

                                    <span>
                                        {application.contractType}
                                    </span>
                                </div>
                            )}

                            {application.salary && (
                                <div>
                                    <span className="detail-label">
                                        Salaire
                                    </span>

                                    <span>
                                        {application.salary}
                                    </span>
                                </div>
                            )}

                            {application.contactEmail && (
                                <div>
                                    <span className="detail-label">
                                        Email du contact
                                    </span>

                                    <a
                                        href={`mailto:${application.contactEmail}`}
                                    >
                                        {
                                            application.contactEmail
                                        }
                                    </a>
                                </div>
                            )}

                            {application.contactPhone && (
                                <div>
                                    <span className="detail-label">
                                        Téléphone
                                    </span>

                                    <a
                                        href={`tel:${application.contactPhone}`}
                                    >
                                        {
                                            application.contactPhone
                                        }
                                    </a>
                                </div>
                            )}

                            {application.sourceUrl && (
                                <div>
                                    <span className="detail-label">
                                        Offre
                                    </span>

                                    <a
                                        href={
                                            application.sourceUrl
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Voir l'offre
                                    </a>
                                </div>
                            )}

                            <div>
                                <span className="detail-label">
                                    Date de candidature
                                </span>

                                <span>
                                    {new Date(
                                        application.appliedAt,
                                    ).toLocaleDateString(
                                        'fr-FR',
                                    )}
                                </span>
                            </div>

                            {application.followUpAt && (
                                <div>
                                    <span className="detail-label">
                                        Prochaine relance
                                    </span>

                                    <span>
                                        {new Date(
                                            application.followUpAt,
                                        ).toLocaleDateString(
                                            'fr-FR',
                                        )}
                                    </span>
                                </div>
                            )}

                            {application.jobDescription && (
                                <div className="details-description">
                                    <span className="detail-label">
                                        Description de
                                        l'offre
                                    </span>

                                    <p>
                                        {
                                            application.jobDescription
                                        }
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                setIsEditing(
                                    (current) =>
                                        !current,
                                )
                            }
                        >
                            {isEditing
                                ? 'Annuler'
                                : 'Modifier la candidature'}
                        </button>

                        {isEditing && (
                            <ApplicationEditForm
                                application={
                                    application
                                }
                                onUpdated={() => {
                                    void reloadApplication();
                                    setIsEditing(false);
                                }}
                            />
                        )}
                    </section>
                </div>

                {/* COLONNE DROITE */}
                <div className="application-activity-column">

                    {/* Ajouter un événement manuel */}
                    <section className="detail-card">
                        <EventForm
                            applicationId={
                                application.id
                            }
                            onEventCreated={() =>
                                void reloadApplication()
                            }
                        />
                    </section>

                    {/* Entretiens */}
                    <section className="detail-card">
                        <div className="section-header">
                            <h2>Entretiens</h2>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    setIsPlanningInterview(
                                        (current) =>
                                            !current,
                                    )
                                }
                            >
                                {isPlanningInterview
                                    ? 'Annuler'
                                    : '+ Planifier un entretien'}
                            </button>
                        </div>

                        {/* Formulaire de création */}
                        {isPlanningInterview && (
                            <InterviewForm
                                applicationId={
                                    application.id
                                }
                                onCreated={() => {
                                    void reloadApplication();

                                    setIsPlanningInterview(
                                        false,
                                    );
                                }}
                            />
                        )}

                        {/* Aucun entretien */}
                        {application.interviews.length ===
                        0 ? (
                            <p className="text-muted">
                                Aucun entretien planifié.
                            </p>
                        ) : (
                            <div className="interviews-list">

                                {application.interviews.map((interview) => (
                                    <div
                                        className="interview-card"
                                        key={interview.id}
                                    >
                                        {editingInterviewId === interview.id ? (
                                            <InterviewEditForm
                                                applicationId={application.id}
                                                interview={interview}
                                                onUpdated={() => {
                                                    void reloadApplication();
                                                    setEditingInterviewId(null);
                                                }}
                                                onCancel={() =>
                                                    setEditingInterviewId(null)
                                                }
                                            />
                                        ) : (
                                            <>
                                                <div className="interview-card__header">
                                                    <strong>
                                                        {interview.type === 'HR' &&
                                                            'Entretien RH'}

                                                        {interview.type === 'TECHNICAL' &&
                                                            'Entretien technique'}

                                                        {interview.type === 'MANAGER' &&
                                                            'Entretien manager'}

                                                        {interview.type === 'OTHER' &&
                                                            'Entretien'}
                                                    </strong>

                                                    <div className="interview-card__actions">
                                                        <button
                                                            type="button"
                                                            className="secondary-button"
                                                            onClick={() =>
                                                                setEditingInterviewId(interview.id)
                                                            }
                                                        >
                                                            Modifier
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="danger-button"
                                                            onClick={() =>
                                                                void handleDeleteInterview(interview.id)
                                                            }
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </div>

                                                <p>
                                                    {new Date(
                                                        interview.scheduledAt,
                                                    ).toLocaleString('fr-FR', {
                                                        dateStyle: 'long',
                                                        timeStyle: 'short',
                                                    })}
                                                </p>

                                                {interview.location && (
                                                    <p>
                                                        <strong>Lieu : </strong>
                                                        {interview.location}
                                                    </p>
                                                )}

                                                {interview.notes && (
                                                    <p className="text-muted">
                                                        {interview.notes}
                                                    </p>
                                                )}

                                                {!interview.completedAt && (
                                                    <CompleteInterview
                                                        applicationId={application.id}
                                                        interviewId={interview.id}
                                                        onCompleted={(outcome) => {
                                                            void reloadApplication();

                                                            if (
                                                                outcome ===
                                                                'NEXT_INTERVIEW'
                                                            ) {
                                                                setIsPlanningInterview(
                                                                    true,
                                                                );
                                                            }
                                                        }}
                                                    />
                                                )}

                                                {interview.completedAt && (
                                                    <div className="interview-completed">
                        <span>
                            Terminé le{' '}
                            {new Date(
                                interview.completedAt,
                            ).toLocaleDateString(
                                'fr-FR',
                            )}
                        </span>

                                                        {interview.outcome && (
                                                            <strong>
                                                                {interview.outcome ===
                                                                    'WAITING_RESPONSE' &&
                                                                    'En attente de réponse'}

                                                                {interview.outcome ===
                                                                    'NEXT_INTERVIEW' &&
                                                                    'Nouvel entretien prévu'}

                                                                {interview.outcome ===
                                                                    'REJECTED' &&
                                                                    'Candidature refusée'}

                                                                {interview.outcome ===
                                                                    'OFFER' &&
                                                                    'Offre reçue'}
                                                            </strong>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Historique */}
                    <section className="detail-card">
                        <h2>Historique</h2>

                        {application.events.length ===
                        0 ? (
                            <p>
                                Aucun événement.
                            </p>
                        ) : (
                            <div className="timeline">

                                {application.events.map(
                                    (event) => (
                                        <div
                                            className={`timeline-item timeline-item--${event.type.toLowerCase()}`}
                                            key={
                                                event.id
                                            }
                                        >
                                            <div className="timeline-marker" />

                                            <div className="timeline-content">

                                                <div className="timeline-header">
                                                    <strong>
                                                        {
                                                            event.title
                                                        }
                                                    </strong>

                                                    <span className="timeline-date">
                                                        {new Date(
                                                            event.eventDate,
                                                        ).toLocaleDateString(
                                                            'fr-FR',
                                                        )}
                                                    </span>
                                                </div>

                                                {event.description && (
                                                    <p>
                                                        {
                                                            event.description
                                                        }
                                                    </p>
                                                )}

                                                {/* Uniquement les événements manuels */}
                                                {event.type !==
                                                    'CREATED' &&
                                                    event.type !==
                                                    'STATUS_CHANGED' &&
                                                    event.type !==
                                                    'INTERVIEW' && (
                                                        <button
                                                            type="button"
                                                            className="timeline-delete"
                                                            onClick={() =>
                                                                void handleDeleteEvent(
                                                                    event.id,
                                                                )
                                                            }
                                                        >
                                                            Supprimer
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Suppression candidature */}
            <button
                type="button"
                className="danger-button"
                onClick={() =>
                    void handleDeleteApplication()
                }
            >
                Supprimer la candidature
            </button>
        </main>
    );
}