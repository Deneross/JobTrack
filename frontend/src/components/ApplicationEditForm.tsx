import { useState, type FormEvent } from 'react';

import {
    updateApplication,
    type ApplicationDetails,
    type ContractType,
} from '../api/applications';

type ApplicationEditFormProps = {
    application: ApplicationDetails;
    onUpdated: () => void;
};

export function ApplicationEditForm({
                                        application,
                                        onUpdated,
                                    }: ApplicationEditFormProps) {
    const [contractType, setContractType] = useState<ContractType | ''>(
        application.contractType ?? '',
    );

    const [jobDescription, setJobDescription] = useState(
        application.jobDescription ?? '',
    );

    const [appliedAt, setAppliedAt] = useState(
        application.appliedAt.slice(0, 10),
    );


    const [company, setCompany] = useState(application.company);
    const [position, setPosition] = useState(application.position);
    const [location, setLocation] = useState(application.location ?? '');
    const [sourceUrl, setSourceUrl] = useState(application.sourceUrl ?? '');
    const [contactEmail, setContactEmail] =
        useState(application.contactEmail ?? '');
    const [contactPhone, setContactPhone] =
        useState(application.contactPhone ?? '');
    const [salary, setSalary] = useState(application.salary ?? '');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await updateApplication(application.id, {
                company,
                position,
                location: location || undefined,
                sourceUrl: sourceUrl || undefined,
                contactEmail: contactEmail || undefined,
                contactPhone: contactPhone || undefined,
                salary: salary || undefined,
                contractType: contractType || undefined,
                jobDescription: jobDescription || undefined,
                appliedAt,
            });

            onUpdated();
        } catch {
            setError('Impossible de modifier la candidature');
        } finally {
            setLoading(false);
        }
    }

    return (
        <section>
            <h2>Modifier la candidature</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="editCompany">Entreprise</label>
                    <input
                        id="editCompany"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="editPosition">Poste</label>
                    <input
                        id="editPosition"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="editLocation">Localisation</label>
                    <input
                        id="editLocation"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="editUrl">URL de l'offre</label>
                    <input
                        id="editUrl"
                        type="url"
                        value={sourceUrl}
                        onChange={(e) => setSourceUrl(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="editEmail">Email du contact</label>
                    <input
                        id="editEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="editPhone">Téléphone</label>
                    <input
                        id="editPhone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="editSalary">Salaire</label>
                    <input
                        id="editSalary"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="editContractType">Type de contrat</label>
                    <select
                        id="editContractType"
                        value={contractType}
                        onChange={(e) =>
                            setContractType(e.target.value as ContractType | '')
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
                    <label htmlFor="editDescription">Description de l'offre</label>
                    <textarea
                        id="editDescription"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="editAppliedAt">Date de candidature</label>
                    <input
                        id="editAppliedAt"
                        type="date"
                        value={appliedAt}
                        onChange={(e) => setAppliedAt(e.target.value)}
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </form>
        </section>
    );
}