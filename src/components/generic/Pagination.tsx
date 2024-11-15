interface PaginationProps {
    page: number;
    totalPages: number;
    onNext: () => void;
    onPrev: () => void;
}

export function Pagination({ page, totalPages, onNext, onPrev }: PaginationProps) {
    return (
        <div>
            <button onClick={onPrev} disabled={page === 1} className="w-32 mr-2 p-2 bg-gray-300 rounded">
                Previous
            </button>
            <span className="mx-2">
                Page {page} of {totalPages}
            </span>
            <button onClick={onNext} disabled={page === totalPages} className="w-32 ml-2 p-2 bg-gray-300 rounded">
                Next
            </button>
        </div>
    );
}
