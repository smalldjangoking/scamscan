import { Button } from "./Button.jsx";

export default function Pagination({ page, totalPages, isFetching, onPageChange }) {
    if (!totalPages || totalPages <= 1) return null;
    if (isFetching) return null;

    return (
        <div className="flex justify-center items-center mt-10 gap-2">
            <Button
                onClick={() => onPageChange(Math.max(page - 1, 1))}
                disabled={page === 1 || isFetching}
            >
                {Math.max(page - 1, 1)}
            </Button>

            <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
            </span>

            <Button
                onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                disabled={page === totalPages || isFetching}
            >
                {Math.min(page + 1, totalPages)}
            </Button>
        </div>
    );
}