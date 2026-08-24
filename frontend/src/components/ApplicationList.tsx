import type { Application } from '../api/applications';

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
                <ul>
                    {applications.map((application) => (
                        <li key={application.id}>
                            <strong>{application.company}</strong>
                            {' — '}
                            {application.position}
                            {' — '}
                            {application.status}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}