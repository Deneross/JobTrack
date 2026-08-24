/**
 * Retourne la date du jour sans heure, en UTC.
 */
export function todayUtc(): Date {
    const now = new Date();

    return new Date(
        Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
        ),
    );
}

/**
 * Retourne une date située à X jours à partir d'aujourd'hui.
 */
export function addDaysToToday(days: number): Date {
    const today = todayUtc();

    today.setUTCDate(today.getUTCDate() + days);

    return today;
}