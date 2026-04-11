import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getUserRole } from "../../utils/user";
import { formatTimeAgo } from "../../utils/formatTimeAgo";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function MyApplications() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [employerMap, setEmployerMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = getCurrentUser();

    useEffect(() => {
        if (!user) { navigate("/login", { replace: true }); return; }
        if (getUserRole(user) !== "applicant") { navigate("/", { replace: true }); return; }

        async function load() {
            try {
                const [appsRes, employersRes] = await Promise.all([
                    fetch(`${API_BASE}/applications/applicant/${user.id}`),
                    fetch(`${API_BASE}/employers`),
                ]);

                if (!appsRes.ok) throw new Error("Failed to load applications");
                if (!employersRes.ok) throw new Error("Failed to load employers");

                const [appsData, employersData] = await Promise.all([
                    appsRes.json(),
                    employersRes.json(),
                ]);

                setApplications(appsData);

                const map = {};
                for (const emp of employersData) {
                    map[emp._id] = emp.companyName || emp.name || "Unknown Company";
                }
                setEmployerMap(map);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    if (loading) return <p className="mt-12 text-center text-slate-500">Loading applications…</p>;
    if (error) return <p className="mt-12 text-center text-red-500">Error: {error}</p>;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold text-slate-900">My Applications</h1>

            {applications.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
                    <p className="text-slate-500">You haven't applied to any jobs yet.</p>
                    <button
                        className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                        onClick={() => navigate("/jobs")}
                    >
                        Browse Jobs
                    </button>
                </div>
            ) : (
                <ul className="flex flex-col gap-4">
                    {applications.map((app) => {
                        const job = app.job;
                        const companyName = employerMap[job?.employerId] ?? "Unknown Company";
                        const appliedDate = app.submittedAt || app.date || app.createdAt;

                        return (
                            <li
                                key={app._id}
                                className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            {job?.title ?? "Job no longer available"}
                                        </h2>
                                        <p className="text-sm text-slate-500">{companyName}</p>
                                    </div>
                                    {appliedDate && (
                                        <p className="shrink-0 text-sm text-slate-400">
                                            Applied {formatTimeAgo(appliedDate)}
                                        </p>
                                    )}
                                </div>

                                {job && (
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                        {job.location && <span>{job.location}</span>}
                                        {job.payRange && (
                                            <span>
                                                ${job.payRange.low?.toLocaleString()} – ${job.payRange.high?.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default MyApplications;
