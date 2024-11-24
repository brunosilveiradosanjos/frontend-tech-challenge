import { useNavigate } from 'react-router-dom';

export function Error() {

    const navigate = useNavigate();

    const handleGoToTrainerPage = () => {
        navigate('/trainer');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-lg mb-8">The page you're looking for doesn't exist.</p>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleGoToTrainerPage}
            >
                Go to Trainer Page
            </button>
        </div>
    );
};