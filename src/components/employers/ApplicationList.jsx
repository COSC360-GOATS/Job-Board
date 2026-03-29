import { useLocation } from "react-router-dom";
import { ApplicationCard } from "./ApplicationCard";
import { useEffect, useState } from "react";

function ApplicantList() {
    const location = useLocation();
    const job = location.state?.job;
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        let isMounted = true;

        async function fetchApplications() {
            try {
                setLoading(true);
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

    if (loading) return <p className="text-white">Loading applications...</p>;
    if (error) return <p className="text-red-400">{error}</p>;

    return (
        <div className="grid w-full mx-auto grid-cols-[repeat(auto-fit,minmax(max(300px,calc((100%-3rem)/3)),1fr))] gap-6 px-6 py-3 cursor-default">
            {applications.map((application) => (
                <ApplicationCard key={application._id} application={application} job={job} />
            ))}
        </div>
    );
}



export default ApplicantList;