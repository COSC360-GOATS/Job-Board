import { useLocation } from "react-router-dom";
import JobForm from "./JobForm";

function JobOverview() {
    const location = useLocation();
    const job = location.state?.job;

    return (
        <>
            <JobForm job={job} />
        </>
    )
}

export default JobOverview;