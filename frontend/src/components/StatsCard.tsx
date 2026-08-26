type StatsCardProps = {
    title: string;
    value: number;
};

export function StatsCard({
                              title,
                              value,
                          }: StatsCardProps) {
    return (
        <article className="stats-card">
            <span className="stats-card__label">{title}</span>
            <strong className="stats-card__value">{value}</strong>
        </article>
    );
}