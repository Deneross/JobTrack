import { useState } from 'react';
import type {
    Application,
    ApplicationStatus,
} from '../api/applications';
import { ApplicationCard } from './ApplicationCard';

type ApplicationListProps = {
    applications: Application[];
};

export function ApplicationList({
                                    applications,
                                }: ApplicationListProps) {
    const [search, setSearch] = useState('');
    const [status, setStatus] =
        useState<ApplicationStatus | 'ALL'>('ALL');

    const filteredApplications = applications.filter((application) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            application.company.toLowerCase().includes(searchValue) ||
            application.position.toLowerCase().includes(searchValue);

        const matchesStatus =
            status === 'ALL' || application.status === status;

        return matchesSearch && matchesStatus;
    });

    return (
        <section>
            <h2>Mes candidatures</h2>

            <div>
                <input
                    type="search"
                    placeholder="Rechercher une entreprise ou un poste..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(
                            event.target.value as ApplicationStatus | 'ALL',
                        )
                    }
                >
                    <option value="ALL">Tous les statuts</option>
                    <option value="TO_APPLY">À postuler</option>
                    <option value="SENT">Envoyée</option>
                    <option value="FOLLOW_UP">À relancer</option>
                    <option value="INTERVIEW">Entretien</option>
                    <option value="REJECTED">Refusée</option>
                    <option value="OFFER">Offre reçue</option>
                    <option value="ABANDONED">Abandonnée</option>
                </select>
            </div>

            <p>
                {filteredApplications.length} candidature(s)
            </p>

            {filteredApplications.length === 0 ? (
                <p>Aucune candidature trouvée.</p>
            ) : (
                <div className="applications-grid">
                    {filteredApplications.map((application) => (
                        <ApplicationCard
                            key={application.id}
                            application={application}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}