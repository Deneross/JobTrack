import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
    return (
        <header className="app-header">
            <div className="app-header__content">
                <Link to="/" className="app-logo">
                    JobTrack
                </Link>

                <ThemeToggle />
            </div>
        </header>
    );
}