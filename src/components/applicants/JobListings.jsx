import { useState, useEffect, useMemo } from "react";
import ApplicantJobCard from "./ApplicantJobCard";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function JobListings() {
    const [jobs, setJobs] = useState([]);
    const [employerMap, setEmployerMap] = useState({});
    const [avgRatingMap, setAvgRatingMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    useEffect(() => {
        async function load() {
            try {
                const [jobsRes, employersRes] = await Promise.all([
                    fetch(`${API_BASE}/jobs`),
                    fetch(`${API_BASE}/employers`),
                ]);

                if (!jobsRes.ok || !employersRes.ok) throw new Error("Failed to load data");

                const [jobsData, employersData] = await Promise.all([
                    jobsRes.json(),
                    employersRes.json(),
                ]);

                const openJobs = jobsData.filter((j) => !j.isClosed);
                setJobs(openJobs);

                const map = {};
                for (const emp of employersData) {
                    map[emp._id] = emp.companyName || emp.name || "Unknown Employer";
                }
                setEmployerMap(map);

                // Fetch avg ratings for each unique employer
                const employerIds = [...new Set(openJobs.map((j) => j.employerId).filter(Boolean))];
                const ratingResults = await Promise.all(
                    employerIds.map((id) =>
                        fetch(`${API_BASE}/ratings/employer/${id}/avg`)
                            .then((r) => (r.ok ? r.json() : null))
                            .catch(() => null)
                    )
                );
                const ratingMap = {};
                employerIds.forEach((id, i) => {
                    const result = ratingResults[i];
                    if (result?.avg != null) ratingMap[id] = result.avg;
                });
                setAvgRatingMap(ratingMap);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filteredJobs = useMemo(() => {
        const q = search.toLowerCase();
        const loc = location.toLowerCase();

        return jobs
            .filter((job) => {
                const matchesSearch =
                    !q ||
                    job.title?.toLowerCase().includes(q) ||
                    job.description?.toLowerCase().includes(q) ||
                    (job.skills ?? []).some((s) => s.toLowerCase().includes(q));
                const matchesLocation =
                    !loc || job.location?.toLowerCase().includes(loc);
                return matchesSearch && matchesLocation;
            })
            .sort((a, b) => {
                const dateA = new Date(a.postedAt || a.createdAt || 0).getTime();
                const dateB = new Date(b.postedAt || b.createdAt || 0).getTime();
                return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
            });
    }, [jobs, search, location, sortOrder]);

    if (loading) {
        return <p className="mt-12 text-center text-slate-500">Loading jobs…</p>;
    }

    if (error) {
        return <p className="mt-12 text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold text-slate-900">Get Employed</h1>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Search by title, description, or skill…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 min-w-48 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none focus:border-violet-500"
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-48 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none focus:border-violet-500"
                />
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none focus:border-violet-500"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {filteredJobs.length === 0 ? (
                <p className="mt-12 text-center text-slate-400">No jobs match your search.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job) => (
                        <ApplicantJobCard
                            key={job._id}
                            job={job}
                            employerName={employerMap[job.employerId]}
                            avgRating={avgRatingMap[job.employerId]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default JobListings;