import { useLocation } from "react-router-dom";

function JobOverview() {
    const location = useLocation();
    const job = location.state?.job;

    return (
        <div className="text-white p-8 rounded-lg border border-gray-300 max-w-lg flex flex-col gap-3">
            <h3 className="text-3xl font-semibold">{job?.title}</h3>
            <h6 className="text-lg">${job?.payRange.low.toLocaleString()} - ${job?.payRange.high.toLocaleString()}</h6>
            <p className="text-gray-400">{job?.description}</p>
        </div>
    )
}

export default JobOverview;