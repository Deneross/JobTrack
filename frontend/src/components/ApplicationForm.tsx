import { useState, type FormEvent } from 'react';

type ApplicationFormProps = {
    onApplicationCreated: () => void;
};

type ContractType =
    | 'APPRENTICESHIP'
    | 'INTERNSHIP'
    | 'CDD'
    | 'CDI'
    | 'FREELANCE'
    | 'OTHER';

export function ApplicationForm({
                                    onApplicationCreated,
                                }: ApplicationFormProps) {
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [location, setLocation] = useState('');
    const [contractType, setContractType] = useState<ContractType | ''>('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [salary, setSalary] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [appliedAt, setAppliedAt] = useState(
        new Date().toISOString().slice(0, 10),
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);
        setError(null);

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
                        contractType: contractType || undefined,
                        sourceUrl: sourceUrl || undefined,
                        salary: salary || undefined,
                        contactEmail: contactEmail || undefined,
                        contactPhone: contactPhone || undefined,
                        jobDescription: jobDescription || undefined,
                        appliedAt,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error('Erreur lors de la création');
            }

            onApplicationCreated();
        } catch {
            setError('Impossible de créer la candidature');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="application-create-form">
            <div className="form-grid">
                <div>
                    <label htmlFor="company">Entreprise *</label>
                    <input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="position">Poste *</label>
                    <input
                        id="position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="location">Localisation</label>
                    <input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="contractType">Type de contrat</label>
                    <select
                        id="contractType"
                        value={contractType}
                        onChange={(e) =>
                            setContractType(
                                e.target.value as ContractType | '',
                            )
                        }
                    >
                        <option value="">Non renseigné</option>
                        <option value="APPRENTICESHIP">Alternance</option>
                        <option value="INTERNSHIP">Stage</option>
                        <option value="CDD">CDD</option>
                        <option value="CDI">CDI</option>
                        <option value="FREELANCE">Freelance</option>
                        <option value="OTHER">Autre</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="sourceUrl">URL de l'offre</label>
                    <input
                        id="sourceUrl"
                        type="url"
                        value={sourceUrl}
                        onChange={(e) => setSourceUrl(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="salary">Salaire</label>
                    <input
                        id="salary"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="contactEmail">Email du contact</label>
                    <input
                        id="contactEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="contactPhone">Téléphone</label>
                    <input
                        id="contactPhone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="appliedAt">Date de candidature</label>
                    <input
                        id="appliedAt"
                        type="date"
                        value={appliedAt}
                        onChange={(e) => setAppliedAt(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="jobDescription">
                    Description de l'offre
                </label>

                <textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
            </div>

            {error && <p className="text-danger">{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? 'Ajout...' : 'Ajouter la candidature'}
            </button>
        </form>
    );
}