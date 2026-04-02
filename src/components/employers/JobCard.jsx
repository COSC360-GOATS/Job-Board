import { useNavigate } from "react-router-dom";
import { Skill } from "../Skills";
import { formatTimeAgo } from "../../utils/formatTimeAgo";

const defaultJob = {
    id: 1,
    title: 'Software Engineer',
    description: 'We are looking for a skilled software engineer to join our team. The ideal candidate will have experience with JavaScript, React, and Node.js. You will be responsible for developing and maintaining our web applications. This is a great opportunity to work on exciting projects and grow your career.',
    payRange: {
        low: 70000,
        high: 120000
    },
    location: 'Kelowna, BC',
    additionalQuestions: [
        'What is your experience with JavaScript?',
        'Have you worked with React before?',
        'Do you have experience with Node.js?'
    ],
    skills: ['JavaScript', 'React', 'Node.js']
};

function JobCard({ job = defaultJob, onDelete }) {
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const postedDate = job.postedAt || job.date || job.createdAt;
    const postedTimeAgo = formatTimeAgo(postedDate);


    const buttonStyle = "cursor-pointer rounded-lg bg-gray-200 text-sm text-black px-2 py-1 hover:bg-gray-50";

    async function deleteJob() {
        confirm("Are you sure you want to delete this job? This action cannot be undone.") && await fetch(`${API_BASE}/jobs/${job._id}`, {
            method: "DELETE",
        }).then(res => {
            if (!res.ok) {
                console.error("Something went wrong deleting the job", res.status);
                return;
            }

            console.log("Deleted job");
            onDelete?.(job._id);
        }).catch(err => {
            console.error("Request failed", err);
        });
    }

    return (
        <div className="cursor-default text-white p-8 rounded-lg border border-gray-300 w-full h-full flex flex-col gap-3">

            <div className="flex justify-between items-start gap-3 grow">
                <h3 
                    className="text-3xl cursor-pointer font-semibold flex-1 min-w-0 wrap-break-word hover:underline"
                    onClick={() => navigate(`/jobs/${job._id}/applications`, { state: { job } })}
                    title={`View applications for ${job.title}`}
                    >
                        {job.title}
                    </h3>

                <div className="flex justify-end gap-2 shrink-0">
                    <button
                        className={buttonStyle}
                        onClick={() => navigate(`/jobs/${job._id}`, { state: { job } })}
                    >
                        Edit
                    </button>
                    <button
                        className={`${buttonStyle} bg-red-500 hover:bg-red-400`}
                        onClick={deleteJob}
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="wrap-break-word">
                <h6 className="text-lg">${job.payRange.low} - ${job.payRange.high}, <span className="text-gray-400">{job.location}</span></h6>
                {postedTimeAgo && (
                    <p className="text-sm text-gray-400">Posted {postedTimeAgo}</p>
                )}
            </div>


            <p className="text-gray-400 line-clamp-3 min-h-18">{job.description}</p>

            <ul className="w-full mt-auto flex justify-start items-center flex-nowrap overflow-x-auto overflow-y-hidden [&>li]:shrink-0">
                {(job.skills ?? []).map((skill, i) => (
                    <Skill
                        key={i}
                        name={skill}
                    />
                ))}
            </ul>
        </div>
    )
}

export default JobCard;