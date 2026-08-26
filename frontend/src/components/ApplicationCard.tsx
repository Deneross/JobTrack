import type { Application } from '../api/applications';
import { Link } from 'react-router-dom';

function getStatusLabel(status: Application['status']) {
    const labels = {
        TO_APPLY: 'À postuler',
        SENT: 'Envoyée',
        FOLLOW_UP: 'À relancer',
        INTERVIEW: 'Entretien',
        REJECTED: 'Refusée',
        OFFER: 'Offre reçue',
        ABANDONED: 'Abandonnée',
    };

    return labels[status];
}

function getFollowUpInfo(followUpAt: string | null) {
    if (!followUpAt) {
        return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const followUpDate = new Date(followUpAt);
    followUpDate.setHours(0, 0, 0, 0);

    const differenceInDays = Math.round(
        (followUpDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (differenceInDays < 0) {
        const daysLate = Math.abs(differenceInDays);

        return {
            label: `En retard de ${daysLate} jour${daysLate > 1 ? 's' : ''}`,
            className: 'follow-up--late',
        };
    }

    if (differenceInDays === 0) {
        return {
            label: "À relancer aujourd'hui",
            className: 'follow-up--today',
        };
    }

    if (differenceInDays === 1) {
        return {
            label: 'Relance demain',
            className: 'follow-up--soon',
        };
    }

    return {
        label: `Relance dans ${differenceInDays} jours`,
        className: 'follow-up--future',
    };
}

type ApplicationCardProps = {
    application: Application;
};

export function ApplicationCard({
                                    application,
                                }: ApplicationCardProps) {
    const followUpInfo = getFollowUpInfo(application.followUpAt);

    return (
        <Link to={`/applications/${application.id}`}>
            <article>
                <h3>{application.company}</h3>

                <p>{application.position}</p>

                <span
                    className={`status-badge status-badge--${application.status.toLowerCase()}`}
                >
                    {getStatusLabel(application.status)}
                </span>

                {application.location && (
                    <p>Localisation : {application.location}</p>
                )}

                {followUpInfo && (
                    <div
                        className={`follow-up-indicator ${followUpInfo.className}`}
                    >
                        <span>{followUpInfo.label}</span>

                        <small>
                            {new Date(
                                application.followUpAt!,
                            ).toLocaleDateString('fr-FR')}
                        </small>
                    </div>
                )}
            </article>
        </Link>
    );
}