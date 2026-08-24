import { useState, type FormEvent } from 'react';

type ApplicationFormProps = {
    onApplicationCreated: () => void;
};

export function ApplicationForm({
                                    onApplicationCreated,
                                }: ApplicationFormProps) {
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:3000/applications',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        company,
                        position,
                        location: location || undefined,
                        status: 'SENT',
                    }),
                },
            );

            if (!response.ok) {
                throw new Error('Erreur lors de la création');
            }

            setCompany('');
            setPosition('');
            setLocation('');

            onApplicationCreated();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section>
            <h2>Ajouter une candidature</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="company">Entreprise</label>

                    <input
                        id="company"
                        value={company}
                        onChange={(event) => setCompany(event.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="position">Poste</label>

                    <input
                        id="position"
                        value={position}
                        onChange={(event) => setPosition(event.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="location">Localisation</label>

                    <input
                        id="location"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Ajout...' : 'Ajouter'}
                </button>
            </form>
        </section>
    );
}