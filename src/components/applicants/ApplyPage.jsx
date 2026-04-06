import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Skills from "../Skills";
import { formatTimeAgo } from "../../utils/formatTimeAgo";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function StarRating({ rating }) {
    if (rating == null) return <span className="text-sm text-slate-400">No ratings yet</span>;
    const rounded = Math.round(rating * 2) / 2;
    return (
        <span className="flex items-center gap-0.5 text-amber-400" title={`${rating.toFixed(1)} stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                    {rounded >= star ? "★" : rounded >= star - 0.5 ? "⯨" : "☆"}
                </span>
            ))}
            <span className="ml-1 text-sm text-slate-500">{rating.toFixed(1)}</span>
        </span>
    );
}

function ApplyPage() {
    const { jobId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [job, setJob] = useState(state?.job || null);
    const [employer, setEmployer] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [avgRating, setAvgRating] = useState(null);
    const [loading, setLoading] = useState(!state?.job);
    const [error, setError] = useState(null);

    const [skills, setSkills] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Auth guard — redirect to login if not logged in
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user) navigate("/login", { replace: true });
    }, []);

    // Fetch job if not passed via state
    useEffect(() => {
        if (job) return;
        fetch(`${API_BASE}/jobs/${jobId}`)
            .then((r) => { if (!r.ok) throw new Error("Job not found"); return r.json(); })
            .then(setJob)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [jobId]);

    // Fetch employer + ratings once we have the job
    useEffect(() => {
        if (!job?.employerId) return;

        Promise.all([
            fetch(`${API_BASE}/employers/${job.employerId}`).then((r) => r.ok ? r.json() : null),
            fetch(`${API_BASE}/ratings/employer/${job.employerId}`).then((r) => r.ok ? r.json() : []),
            fetch(`${API_BASE}/ratings/employer/${job.employerId}/avg`).then((r) => r.ok ? r.json() : null),
        ]).then(([emp, ratingsList, avgData]) => {
            setEmployer(emp);
            setRatings(Array.isArray(ratingsList) ? ratingsList : []);
            setAvgRating(avgData?.avg ?? null);
        });
    }, [job?.employerId]);

    // Initialise answer fields when job loads
    useEffect(() => {
        if (job?.additionalQuestions) {
            setAnswers(job.additionalQuestions.map(() => ""));
        }
    }, [job]);

    async function handleSubmit(e) {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user) { navigate("/login"); return; }

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/applications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobId,
                    applicantId: user.id,
                    skills,
                    answers,
                    appliedAt: new Date().toISOString(),
                }),
            });
            if (!res.ok) throw new Error("Submission failed");
            setSubmitted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <p className="mt-12 text-center text-slate-500">Loading…</p>;
    if (error) return <p className="mt-12 text-center text-red-500">Error: {error}</p>;
    if (!job) return null;

    if (submitted) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-slate-900">Application Submitted!</h2>
                <p className="mt-2 text-slate-500">Good luck with your application for <strong>{job.title}</strong>.</p>
                <button
                    className="mt-6 rounded-lg bg-violet-600 px-6 py-2 text-sm font-medium text-white hover:bg-violet-700"
                    onClick={() => navigate("/listings")}
                >
                    Back to Job Listings
                </button>
            </div>
        );
    }

    const employerName = state?.employerName || employer?.companyName || employer?.name || "Unknown Employer";
    const postedTimeAgo = formatTimeAgo(job.postedAt || job.createdAt);

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            <button
                className="mb-6 text-sm text-violet-600 hover:underline"
                onClick={() => navigate("/listings")}
            >
                ← Back to listings
            </button>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left: Job details + form */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
                        <p className="mt-1 text-lg font-medium text-violet-700">{employerName}</p>
                        <p className="mt-1 text-sm text-slate-500">
                            {job.location} &middot; ${job.payRange?.low?.toLocaleString()} – ${job.payRange?.high?.toLocaleString()}
                            {postedTimeAgo && <> &middot; Posted {postedTimeAgo}</>}
                        </p>
                    </div>

                    <p className="text-slate-700 leading-relaxed">{job.description}</p>

                    {/* Application form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                        <h2 className="text-lg font-semibold text-slate-900">Your Application</h2>

                        {/* Skills */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Your Skills
                            </label>
                            <Skills
                                skills={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="border-slate-300 bg-white"
                            />
                        </div>

                        {/* Additional questions */}
                        {(job.additionalQuestions ?? []).length > 0 && (
                            <div className="flex flex-col gap-4">
                                <p className="text-sm font-medium text-slate-700">Employer Questions</p>
                                {job.additionalQuestions.map((q, i) => (
                                    <div key={i}>
                                        <label className="mb-1 block text-sm text-slate-600">{q}</label>
                                        <textarea
                                            rows={3}
                                            value={answers[i] || ""}
                                            onChange={(e) => {
                                                const next = [...answers];
                                                next[i] = e.target.value;
                                                setAnswers(next);
                                            }}
                                            placeholder="Your answer…"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 resize-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                        >
                            {submitting ? "Submitting…" : "Submit Application"}
                        </button>
                    </form>
                </div>

                {/* Right: Employer info + reviews */}
                <div className="flex flex-col gap-6">
                    {/* Employer card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="font-semibold text-slate-900">{employerName}</h3>
                        {employer?.bio && <p className="mt-2 text-sm text-slate-600">{employer.bio}</p>}
                        <div className="mt-3">
                            <StarRating rating={avgRating} />
                        </div>
                    </div>

                    {/* Reviews */}
                    {ratings.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <h3 className="font-semibold text-slate-700">Reviews</h3>
                            {ratings.map((r, i) => (
                                <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                                            {r.applicantName?.[0]?.toUpperCase() ?? "?"}
                                        </div>
                                        <span className="text-sm font-medium text-slate-800">{r.applicantName || "Applicant"}</span>
                                    </div>
                                    <StarRating rating={r.rating} />
                                    {r.comment && <p className="mt-2 text-sm text-slate-600">{r.comment}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ApplyPage;