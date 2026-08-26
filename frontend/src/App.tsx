import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ApplicationDetailsPage } from './pages/ApplicationDetailsPage';

function App() {
    return (
        <>
            <Header />

            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route
                    path="/applications/:id"
                    element={<ApplicationDetailsPage />}
                />
            </Routes>
        </>
    );
}

export default App;