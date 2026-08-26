import { Link } from 'react-router-dom';
import type { Application } from '../api/applications';

type DueFollowUpsProps = {
    applications: Application[];
};

export function DueFollowUps({
                                 applications,
                             }: DueFollowUpsProps) {
    if (applications.length === 0) {
        return (
            <section>
                <h2>Relances à effectuer</h2>
                <p>Aucune relance à effectuer.</p>
            </section>
        );
    }

    return (
        <section>
            <h2>Relances à effectuer</h2>

            <ul>
                {applications.map((application) => (
                    <li key={application.id}>
                        <Link to={`/applications/${application.id}`}>
                            <strong>{application.company}</strong>
                            {' — '}
                            {application.position}
                            {' — '}
                            {application.followUpAt &&
                                new Date(
                                    application.followUpAt,
                                ).toLocaleDateString('fr-FR')}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}