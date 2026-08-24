type StatsCardProps = {
    title: string;
    value: number;
};

export function StatsCard({ title, value }: StatsCardProps) {
    return (
        <article>
            <h3>{title}</h3>
            <strong>{value}</strong>
        </article>
    );
}