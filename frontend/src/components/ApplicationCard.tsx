import type { Application } from '../api/applications';
import { Link } from 'react-router-dom';

type ApplicationCardProps = {
    application: Application;
};

export function ApplicationCard({
                                    application,
                                }: ApplicationCardProps) {
    return (
        <Link to={`/applications/${application.id}`}>
            <article>
                <h3>{application.company}</h3>

                <p>{application.position}</p>

                <p>Statut : {application.status}</p>

                {application.location && (
                    <p>Localisation : {application.location}</p>
                )}

                {application.followUpAt && (
                    <p>
                        Prochaine relance :{' '}
                        {new Date(application.followUpAt).toLocaleDateString('fr-FR')}
                    </p>
                )}
            </article>
        </Link>
    );
}