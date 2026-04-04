import JobCard from './JobCard';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JobDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('postedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const sortedJobs = useMemo(() => {
    const normalizedOrder = sortOrder === 'asc' ? 1 : -1;

    const getPostedTime = (job) => {
      const value = job?.postedAt || job?.createdAt || job?.date;
      const timestamp = new Date(value).getTime();
      return Number.isNaN(timestamp) ? 0 : timestamp;
    };

    const getLocation = (job) => (job?.location || '').toString().toLowerCase();

    const getPayRange = (job) => {
      const low = Number(job?.payRange?.low);
      const high = Number(job?.payRange?.high);

      if (!Number.isNaN(high)) return high;
      if (!Number.isNaN(low)) return low;
      return 0;
    };

    return [...jobs].sort((a, b) => {
      if (sortBy === 'location') {
        return getLocation(a).localeCompare(getLocation(b)) * normalizedOrder;
      }

      if (sortBy === 'payRange') {
        return (getPayRange(a) - getPayRange(b)) * normalizedOrder;
      }

      return (getPostedTime(a) - getPostedTime(b)) * normalizedOrder;
    });
  }, [jobs, sortBy, sortOrder]);

  useEffect(() => {
    let isMounted = true;

    async function fetchJobs() {
      try {
        setLoading(true);

        // ###########################################
        // TEMPORARY Test employer in database to 
        // filter jobs by employer until authentication 
        // is implemented.

        const EMPLOYER_ID = import.meta.env.VITE_TEMP_EMPLOYER_ID;

        // ###########################################

        const res = await fetch(`${API_BASE}/jobs/employer/${EMPLOYER_ID}`);
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
    <div className="mx-auto w-full max-w-7xl px-6 py-6 text-slate-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate('/jobs/new')}
          className="cursor-pointer rounded-lg bg-violet-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          Create Job
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="job-sort-by" className="text-sm font-medium text-slate-700">Sort by</label>
          <select
            id="job-sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          >
            <option value="postedAt">Posted date</option>
            <option value="location">Location</option>
            <option value="payRange">Pay range</option>
          </select>

          <label htmlFor="job-sort-order" className="text-sm font-medium text-slate-700">Order</label>
          <select
            id="job-sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <div className="grid w-full mx-auto grid-cols-[repeat(auto-fit,minmax(max(300px,calc((100%-3rem)/3)),1fr))] items-stretch gap-6 py-3">
        {loading && <p className="text-slate-600">Loading jobs...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && sortedJobs.map((job) => (
          <div key={job._id || job.id} className="h-full">
            <JobCard
              job={job}
              onDelete={(deletedJobId) => {
                setJobs((prevJobs) => prevJobs.filter((j) => j._id !== deletedJobId));
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobDashboard;