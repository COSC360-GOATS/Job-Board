import JobCard from './JobCard';
import { useNavigate } from 'react-router-dom';

function JobDashboard() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 px-6 py-3">
        {
            [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="mb-4">
                    <JobCard />
                </div>
            ))
        }
        <button onClick={() => navigate('/jobs/new')} className="text-white cursor-pointer rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-800">Create Job</button>
    </div>
  );
}

export default JobDashboard;