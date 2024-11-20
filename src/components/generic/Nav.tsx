export function Nav() {
    return (
        <nav className="fixed w-full flex justify-between h-12 items-center px-4 bg-gray-800 text-white">
            <h1 className="text-2xl">Nav</h1>
            <div className="flex space-x-2">
                <button>Home</button>
                <button >Trainer</button>
                <button >Arena</button>
            </div>
        </nav>
    );
}
