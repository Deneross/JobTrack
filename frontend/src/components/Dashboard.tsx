import type { DashboardStats } from '../api/applications';
import { StatsCard } from './StatsCard';

type DashboardProps = {
    stats: DashboardStats;
};

export function Dashboard({
                              stats,
                          }: DashboardProps) {
    return (
        <section>
            <h2>Tableau de bord</h2>

            <div className="stats-grid">
                <StatsCard
                    title="Candidatures"
                    value={stats.total}
                />

                <StatsCard
                    title="Actives"
                    value={stats.active}
                />

                <StatsCard
                    title="À relancer"
                    value={stats.dueFollowUps}
                />

                <StatsCard
                    title="Entretiens"
                    value={stats.interviews}
                />
            </div>
        </section>
    );
}