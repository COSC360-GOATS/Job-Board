import { useLocation, useNavigate } from "react-router-dom";
import { ApplicationCard } from "./ApplicationCard";
import { useEffect, useMemo, useState } from "react";

function toTimestamp(value) {
    if (!value) return 0;
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getAppliedTimestamp(application) {
    return toTimestamp(application?.submittedAt || application?.date || application?.['date:'] || application?.appliedAt || application?.createdAt);
}

function ApplicantList() {
    const location = useLocation();
    const navigate = useNavigate();
    const job = location.state?.job;
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const lastViewedAt = job?.applicationInboxLastViewedAt || null;
    const lastViewedTimestamp = toTimestamp(lastViewedAt);

    useEffect(() => {
        let isMounted = true;

        async function fetchApplications() {
            try {
                setLoading(true);
                await fetch(`${API_BASE}/jobs/${job._id}/applications/read`, {
                    method: 'POST',
                });

                const res = await fetch(`${API_BASE}/jobs/${job._id}/applications`);
                if (!res.ok) throw new Error('Failed to fetch applications');
                const data = await res.json();
                if (isMounted) setApplications(Array.isArray(data) ? data : []);
            } catch (err) {
                if (isMounted) {
                    console.error("Failed to fetch applications", err);
                    setError('Could not load applications');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        if (job?._id) {
            fetchApplications();
        }

        return () => {
            isMounted = false;
        };
    }, [job?._id, API_BASE]);

    const decoratedApplications = useMemo(() => {
        const list = Array.isArray(applications) ? applications : [];

        return [...list]
            .map((application) => {
                const appliedTimestamp = getAppliedTimestamp(application);
                const isUnread = lastViewedTimestamp === 0
                    ? appliedTimestamp > 0
                    : appliedTimestamp > lastViewedTimestamp;

                return {
                    ...application,
                    __appliedTimestamp: appliedTimestamp,
                    __isUnread: isUnread,
                };
            })
            .sort((a, b) => {
                if (a.__isUnread !== b.__isUnread) {
                    return a.__isUnread ? -1 : 1;
                }

                return b.__appliedTimestamp - a.__appliedTimestamp;
            });
    }, [applications, lastViewedTimestamp]);

    return (
        <div className="mx-auto w-full max-w-7xl px-6 py-6">
            <button
                className="mb-6 text-sm text-violet-600 hover:underline"
                onClick={() => navigate('/jobs/employers')}
            >
                ← Back to dashboard
            </button>

            <h1 className="mb-6 text-3xl font-bold text-slate-900">
                {job?.title ? `Applications for ${job.title}` : 'Applications'}
            </h1>

            {loading && <p className="text-slate-600">Loading applications...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="grid w-full mx-auto grid-cols-[repeat(auto-fit,minmax(max(300px,calc((100%-3rem)/3)),1fr))] gap-6 py-3 cursor-default">
                    {applications.length === 0 ? (
                        <p>No applications found for this job.</p>
                    ) : (
                        decoratedApplications.map((application) => (
                            <ApplicationCard
                                key={application._id}
                                application={application}
                                job={job}
                                isUnread={application.__isUnread}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}



export default ApplicantList;