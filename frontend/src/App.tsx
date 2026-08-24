import { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ApplicationList } from './components/ApplicationList';
import { ApplicationForm } from './components/ApplicationForm';

import {
    getApplications,
    getDashboardStats,
    type Application,
    type DashboardStats,
} from './api/applications';

function App() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadData() {
        setError(null);

        try {
            const [applicationsData, statsData] = await Promise.all([
                getApplications(),
                getDashboardStats(),
            ]);

            setApplications(applicationsData);
            setStats(statsData);
        } catch {
            setError('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadData();
    }, []);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <main>
            <h1>JobTrack</h1>

            {stats && <Dashboard stats={stats} />}

            <ApplicationList applications={applications} />
            <ApplicationForm onApplicationCreated={loadData} />
        </main>
    );
}

export default App;