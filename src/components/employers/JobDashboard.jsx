import JobCard from './JobCard';

function JobDashboard() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 px-6 py-3">
        {
            [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="mb-4">
                    <JobCard />
                </div>
            ))
        }
    </div>
  );
}

export default JobDashboard;