import { normalizeApplicationStatus } from "../../utils/applicationStatus";

const STATUS_STYLES = {
    pending: "bg-slate-100 text-slate-700 border-slate-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    interview: "bg-blue-100 text-blue-800 border-blue-200",
};

const STATUS_LABELS = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    interview: "Interview",
};

export function ApplicationStatusBadge({ status }) {
    const key = normalizeApplicationStatus(status);
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[key]}`}
        >
            {STATUS_LABELS[key]}
        </span>
    );
}
