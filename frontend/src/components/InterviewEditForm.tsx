import { useState, type FormEvent } from 'react';

import {
    updateInterview,
    type Interview,
    type InterviewOutcome,
    type InterviewType,
} from '../api/applications';

type InterviewEditFormProps = {
    applicationId: number;
    interview: Interview;
    onUpdated: () => void;
    onCancel: () => void;
};

export function InterviewEditForm({
                                      applicationId,
                                      interview,
                                      onUpdated,
                                      onCancel,
                                  }: InterviewEditFormProps) {
    const localDate = new Date(interview.scheduledAt);

    const [type, setType] =
        useState<InterviewType>(interview.type);

    const [scheduledAt, setScheduledAt] = useState(
        new Date(
            localDate.getTime() -
            localDate.getTimezoneOffset() * 60000,
        )
            .toISOString()
            .slice(0, 16),
    );

    const [location, setLocation] =
        useState(interview.location ?? '');

    const [notes, setNotes] =
        useState(interview.notes ?? '');

    const [outcome, setOutcome] =
        useState<InterviewOutcome | ''>(
            interview.outcome ?? '',
        );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await updateInterview(
                applicationId,
                interview.id,
                {
                    type,
                    scheduledAt,
                    location: location || undefined,
                    notes: notes || undefined,

                    ...(interview.completedAt &&
                        outcome && {
                            outcome,
                        }),
                },
            );

            onUpdated();
        } catch {
            setError(
                "Impossible de modifier l'entretien",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            className="interview-edit-form"
            onSubmit={handleSubmit}
        >
            <div>
                <label>Type</label>

                <select
                    value={type}
                    onChange={(event) =>
                        setType(
                            event.target.value as InterviewType,
                        )
                    }
                >
                    <option value="HR">RH</option>
                    <option value="TECHNICAL">
                        Technique
                    </option>
                    <option value="MANAGER">
                        Manager
                    </option>
                    <option value="OTHER">
                        Autre
                    </option>
                </select>
            </div>

            <div>
                <label>Date et heure</label>

                <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(event) =>
                        setScheduledAt(event.target.value)
                    }
                    required
                />
            </div>

            <div>
                <label>Lieu / visioconférence</label>

                <input
                    value={location}
                    onChange={(event) =>
                        setLocation(event.target.value)
                    }
                />
            </div>

            <div>
                <label>Notes</label>

                <textarea
                    value={notes}
                    onChange={(event) =>
                        setNotes(event.target.value)
                    }
                />
            </div>

            {interview.completedAt && (
                <div>
                    <label>Résultat</label>

                    <select
                        value={outcome}
                        onChange={(event) =>
                            setOutcome(
                                event.target
                                    .value as InterviewOutcome,
                            )
                        }
                    >
                        <option value="">
                            Non renseigné
                        </option>

                        <option value="WAITING_RESPONSE">
                            En attente de réponse
                        </option>

                        <option value="NEXT_INTERVIEW">
                            Nouvel entretien
                        </option>

                        <option value="REJECTED">
                            Refus
                        </option>

                        <option value="OFFER">
                            Offre reçue
                        </option>
                    </select>
                </div>
            )}

            {error && (
                <p className="text-danger">
                    {error}
                </p>
            )}

            <div className="form-actions">
                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? 'Enregistrement...'
                        : 'Enregistrer'}
                </button>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={onCancel}
                >
                    Annuler
                </button>
            </div>
        </form>
    );
}