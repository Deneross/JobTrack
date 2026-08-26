import { useEffect, useState } from 'react';

import { Dashboard } from '../components/Dashboard';
import { ApplicationList } from '../components/ApplicationList';
import { ApplicationForm } from '../components/ApplicationForm';
import { DueFollowUps } from '../components/DueFollowUps';
import { Link } from 'react-router-dom';

import {
    getApplications,
    getDashboardStats,
    getDueFollowUps,
    type Application,
    type DashboardStats,
} from '../api/applications';

export function HomePage() {
    const [dueFollowUps, setDueFollowUps] = useState<Application[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    async function loadData() {
        setError(null);

        try {
            const [
                applicationsData,
                statsData,
                dueFollowUpsData,
            ] = await Promise.all([
                getApplications(),
                getDashboardStats(),
                getDueFollowUps(),
            ]);

            setApplications(applicationsData);
            setStats(statsData);
            setDueFollowUps(dueFollowUpsData);
        } catch {
            setError('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadData();
    }, []);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <main>
            <h1>JobTrack</h1>

            {stats && <Dashboard stats={stats} />}

            <section className="follow-ups-section">
                <div className="section-header">
                    <h2>Relances à effectuer</h2>

                    {dueFollowUps.length > 0 && (
                        <span className="follow-ups-count">
                {dueFollowUps.length}
            </span>
                    )}
                </div>

                {dueFollowUps.length === 0 ? (
                    <div className="empty-state">
                        <p>Aucune relance à effectuer.</p>
                    </div>
                ) : (
                    <div className="due-follow-ups">
                        {dueFollowUps.map((application) => (
                            <Link
                                key={application.id}
                                to={`/applications/${application.id}`}
                                className="due-follow-up"
                            >
                                <div>
                                    <strong>{application.company}</strong>

                                    <span>{application.position}</span>
                                </div>

                                <div className="due-follow-up__date">
                                    À relancer

                                    {application.followUpAt && (
                                        <small>
                                            {new Date(
                                                application.followUpAt,
                                            ).toLocaleDateString('fr-FR')}
                                        </small>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <ApplicationList applications={applications} />
            <section className="create-application-section">
                <button
                    type="button"
                    onClick={() => setIsCreating(true)}
                >
                    + Nouvelle candidature
                </button>

                {isCreating && (
                    <div
                        className="modal-backdrop"
                        onClick={() => setIsCreating(false)}
                    >
                        <div
                            className="modal"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>Nouvelle candidature</h2>

                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={() => setIsCreating(false)}
                                    aria-label="Fermer"
                                >
                                    ×
                                </button>
                            </div>

                            <ApplicationForm
                                onApplicationCreated={async () => {
                                    await loadData();
                                    setIsCreating(false);
                                }}
                            />
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
