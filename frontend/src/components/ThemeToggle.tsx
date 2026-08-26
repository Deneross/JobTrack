import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme');

        return savedTheme === 'light' ? 'light' : 'dark';
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    function toggleTheme() {
        setTheme((currentTheme) =>
            currentTheme === 'dark' ? 'light' : 'dark',
        );
    }

    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Changer de thème"
        >
            {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        </button>
    );
}