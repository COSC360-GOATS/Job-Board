import { useNavigate } from "react-router-dom";

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
    ]
};

function JobCard({ job = defaultJob }) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/jobs/${job._id}`, { state: { job } })} className="text-white p-8 rounded-lg border border-gray-300 max-w-lg flex flex-col gap-3 cursor-pointer hover:bg-gray-800">
            <h3 className="text-3xl font-semibold">{job.title}</h3>
            <h6 className="text-lg">${job.payRange.low} - ${job.payRange.high}</h6>
            <p className="text-gray-400 line-clamp-3">{job.description}</p>
        </div>
    )
}

export default JobCard;