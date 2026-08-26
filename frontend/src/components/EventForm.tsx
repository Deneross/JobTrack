import { useState, type FormEvent } from 'react';

import {
    createApplicationEvent,
    type EventType,
} from '../api/applications';

type EventFormProps = {
    applicationId: number;
    onEventCreated: () => void;
};

export function EventForm({
                              applicationId,
                              onEventCreated,
                          }: EventFormProps) {
    const [type, setType] = useState<EventType>('FOLLOW_UP');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await createApplicationEvent(applicationId, {
                type,
                title,
                description: description || undefined,
            });

            setTitle('');
            setDescription('');

            onEventCreated();
        } catch {
            setError("Impossible d'ajouter l'événement");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section>
            <h2>Ajouter un événement</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="eventType">Type</label>

                    <select
                        id="eventType"
                        value={type}
                        onChange={(event) =>
                            setType(event.target.value as EventType)
                        }
                    >
                        <option value="FOLLOW_UP">Relance</option>
                        <option value="RESPONSE">Réponse</option>
                        <option value="NOTE">Note</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="eventTitle">Titre</label>

                    <input
                        id="eventTitle"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="eventDescription">
                        Description
                    </label>

                    <textarea
                        id="eventDescription"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Ajout...' : 'Ajouter'}
                </button>
            </form>
        </section>
    );
}