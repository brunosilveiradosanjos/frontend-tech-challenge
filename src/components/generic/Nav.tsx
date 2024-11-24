import { Link } from 'react-router-dom';

export function Nav() {
    return (
        <nav className="fixed w-full flex justify-between h-12 items-center px-4 bg-gray-800 text-white">
            <h1 className="text-2xl">Nav</h1>
            <div className="flex space-x-2">
                <Link to="/" className="hover:text-gray-300">Home</Link>
                <Link to="/trainer" className="hover:text-gray-300">Trainer</Link>
                <Link to="/arena" className="hover:text-gray-300">Arena</Link>
            </div>
        </nav>
    );
}