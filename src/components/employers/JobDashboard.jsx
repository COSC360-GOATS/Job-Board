import JobCard from './JobCard';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JobDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    let isMounted = true;

    async function fetchJobs() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/jobs`);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        if (isMounted) setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setError('Could not load jobs');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [API_BASE]);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 px-6 py-3">
        {loading && <p className="text-white">Loading jobs...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && jobs.map((job) => (
          <div key={job._id || job.id} className="mb-4">
            <JobCard job={job} />
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/jobs/new')} className="cursor-pointer rounded-lg text-black bg-gray-200 px-4 py-2 hover:bg-gray-50">Create Job</button>
    </>
  );
}

export default JobDashboard;