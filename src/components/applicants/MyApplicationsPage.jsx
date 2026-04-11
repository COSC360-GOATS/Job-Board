import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, getUserRole } from "../../utils/user";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { normalizeApplicationStatus } from "../../utils/applicationStatus";
import { formatTimeAgo } from "../../utils/formatTimeAgo";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function normalizeId(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
        if (typeof value.$oid === "string") return value.$oid;
        if (typeof value.id === "string") return value.id;
        if (typeof value._id === "string") return value._id;
    }
    return String(value);
}

function MyApplicationsPage() {
    const navigate = useNavigate();
    const session = getCurrentUser();
    const userId = session?.id ?? "";
    const role = session ? getUserRole(session) : null;

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sseDebounceRef = useRef(null);

    const load = useCallback(
        async (opts = { silent: false }) => {
            if (!userId) return;
            if (!opts.silent) {
                setLoading(true);
                setError(null);
            }
            try {
                const res = await fetch(`${API_BASE}/applications/applicant/${userId}`);
                if (!res.ok) throw new Error("Failed to load your applications");
                const data = await res.json();
                setApplications(Array.isArray(data) ? data : []);
            } catch (err) {
                if (!opts.silent) setError(err.message || "Something went wrong");
            } finally {
                if (!opts.silent) setLoading(false);
            }
        },
        [userId]
    );

    useEffect(() => {
        if (!userId) {
            navigate("/login", { replace: true });
            return;
        }
        if (role !== "applicant") {
            navigate("/", { replace: true });
            return;
        }
        load({ silent: false });
    }, [userId, role, navigate, load]);

    useEffect(() => {
        if (!userId) return;

        const scheduleRefresh = () => {
            if (sseDebounceRef.current) clearTimeout(sseDebounceRef.current);
            sseDebounceRef.current = setTimeout(() => {
                sseDebounceRef.current = null;
                load({ silent: true });
            }, 400);
        };

        const events = new EventSource(`${API_BASE}/events`);
        const refresh = (event) => {
            try {
                const payload = JSON.parse(event.data || "{}");
                if (normalizeId(payload?.applicantId) === userId) scheduleRefresh();
            } catch {
                // ignore
            }
        };
        events.addEventListener("application-updated", refresh);
        events.addEventListener("application-created", refresh);
        return () => {
            events.removeEventListener("application-updated", refresh);
            events.removeEventListener("application-created", refresh);
            events.close();
            if (sseDebounceRef.current) clearTimeout(sseDebounceRef.current);
        };
    }, [userId, load]);

    useEffect(() => {
        const previous = document.title;
        document.title = "Applied Jobs";
        return () => {
            document.title = previous;
        };
    }, []);

    const sorted = useMemo(() => {
        return [...applications].sort((a, b) => {
            const ta = new Date(a.submittedAt || a.createdAt || a.date || 0).getTime();
            const tb = new Date(b.submittedAt || b.createdAt || b.date || 0).getTime();
            return tb - ta;
        });
    }, [applications]);

    if (!userId || role !== "applicant") return null;

    if (loading) {
        return <p className="mt-12 text-center text-slate-500">Loading your applications…</p>;
    }

    if (error) {
        return <p className="mt-12 text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Applied Jobs</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Track the status of jobs you have applied to. Employers update your status here.
                    </p>
                </div>
                <Link
                    to="/jobs"
                    className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                    Explore jobs
                </Link>
            </div>

            {sorted.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                    <p className="mb-4">You have not applied to any jobs yet.</p>
                    <Link
                        to="/jobs"
                        className="inline-flex rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
                    >
                        Browse open roles
                    </Link>
                </div>
            ) : (
                <ul className="flex flex-col gap-4">
                    {sorted.map((app) => {
                        const when = formatTimeAgo(app.submittedAt || app.createdAt || app.date);
                        const st = normalizeApplicationStatus(app.status);
                        return (
                            <li
                                key={app._id}
                                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between"
                            >
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        {app.jobTitle || "Job"}
                                    </h2>
                                    {app.employerName && (
                                        <p className="mt-0.5 text-sm font-medium text-violet-700">{app.employerName}</p>
                                    )}
                                    {app.jobLocation && (
                                        <p className="mt-1 text-sm text-slate-500">{app.jobLocation}</p>
                                    )}
                                    {when && (
                                        <p className="mt-2 text-xs text-slate-400">Submitted {when}</p>
                                    )}
                                </div>
                                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                                    <ApplicationStatusBadge status={st} />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default MyApplicationsPage;
