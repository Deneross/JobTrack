import { useState } from 'react';

import {
    completeInterview,
    type InterviewOutcome,
} from '../api/applications';

type CompleteInterviewProps = {
    applicationId: number;
    interviewId: number;
    onCompleted: (outcome: InterviewOutcome) => void;
};

export function CompleteInterview({
                                      applicationId,
                                      interviewId,
                                      onCompleted,
                                  }: CompleteInterviewProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleOutcome(outcome: InterviewOutcome) {
        setLoading(true);
        setError(null);

        try {
            await completeInterview(
                applicationId,
                interviewId,
                outcome,
            );

            setIsOpen(false);
            onCompleted(outcome);
        } catch {
            setError("Impossible de terminer l'entretien");
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
            >
                Entretien terminé
            </button>
        );
    }

    return (
        <div className="interview-outcomes">
            <p>Quelle est la suite ?</p>

            <div className="interview-outcomes__actions">
                <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                        void handleOutcome('WAITING_RESPONSE')
                    }
                >
                    En attente de réponse
                </button>

                <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                        void handleOutcome('NEXT_INTERVIEW')
                    }
                >
                    Nouvel entretien
                </button>

                <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                        void handleOutcome('OFFER')
                    }
                >
                    Offre reçue
                </button>

                <button
                    type="button"
                    className="danger-button"
                    disabled={loading}
                    onClick={() =>
                        void handleOutcome('REJECTED')
                    }
                >
                    Refus
                </button>

                <button
                    type="button"
                    className="secondary-button"
                    disabled={loading}
                    onClick={() => setIsOpen(false)}
                >
                    Annuler
                </button>
            </div>

            {error && (
                <p className="text-danger">{error}</p>
            )}
        </div>
    );
}