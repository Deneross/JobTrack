import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ApplicationDetailsPage } from './pages/ApplicationDetailsPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
                path="/applications/:id"
                element={<ApplicationDetailsPage />}
            />
        </Routes>
    );
}

export default App;