const STATUS_KEYS = ["pending", "accepted", "rejected", "interview"];

export function normalizeApplicationStatus(status) {
    const key = String(status || "pending").toLowerCase();
    return STATUS_KEYS.includes(key) ? key : "pending";
}

export const APPLICATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "interview", label: "Interview" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
];
