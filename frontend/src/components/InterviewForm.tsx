import { useState, type FormEvent } from 'react';

import {
    createInterview,
    type InterviewType,
} from '../api/applications';

type InterviewFormProps = {
    applicationId: number;
    onCreated: () => void;
};

export function InterviewForm({
                                  applicationId,
                                  onCreated,
                              }: InterviewFormProps) {
    const [type, setType] =
        useState<InterviewType>('HR');

    const [scheduledAt, setScheduledAt] = useState('');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await createInterview(applicationId, {
                type,
                scheduledAt,
                location: location || undefined,
                notes: notes || undefined,
            });

            onCreated();

            setScheduledAt('');
            setLocation('');
            setNotes('');
        } catch {
            setError("Impossible d'ajouter l'entretien");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="interviewType">
                    Type d'entretien
                </label>

                <select
                    id="interviewType"
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
                <label htmlFor="scheduledAt">
                    Date et heure
                </label>

                <input
                    id="scheduledAt"
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(event) =>
                        setScheduledAt(event.target.value)
                    }
                    required
                />
            </div>

            <div>
                <label htmlFor="interviewLocation">
                    Lieu / visioconférence
                </label>

                <input
                    id="interviewLocation"
                    value={location}
                    onChange={(event) =>
                        setLocation(event.target.value)
                    }
                    placeholder="Teams, Nantes..."
                />
            </div>

            <div>
                <label htmlFor="interviewNotes">
                    Notes
                </label>

                <textarea
                    id="interviewNotes"
                    value={notes}
                    onChange={(event) =>
                        setNotes(event.target.value)
                    }
                    placeholder="Informations sur l'entretien..."
                />
            </div>

            {error && (
                <p className="text-danger">{error}</p>
            )}

            <button type="submit" disabled={loading}>
                {loading
                    ? 'Ajout...'
                    : "Ajouter l'entretien"}
            </button>
        </form>
    );
}