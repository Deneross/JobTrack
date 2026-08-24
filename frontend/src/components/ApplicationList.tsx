import type { Application } from '../api/applications';
import { ApplicationCard } from './ApplicationCard';

type ApplicationListProps = {
    applications: Application[];
};

export function ApplicationList({
                                    applications,
                                }: ApplicationListProps) {
    return (
        <section>
            <h2>Mes candidatures</h2>

            {applications.length === 0 ? (
                <p>Aucune candidature.</p>
            ) : (
                <div>
                    {applications.map((application) => (
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