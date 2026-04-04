import { useLocation } from "react-router-dom";
import JobForm from "./JobForm";

function JobOverview() {
    const location = useLocation();
    const job = location.state?.job;

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-4">
            <JobForm job={job} />
        </div>
    )
}

export default JobOverview;