import { useState } from "react";
import { useLocation } from "react-router-dom";

function JobForm({ job }) {
    const location = useLocation();
    const creating = location.pathname === "/jobs/new";

    const inputStyle = "rounded-lg border border-gray-300 px-4 py-2 mb-4"
    const [additionalQuestions, setAdditionalQuestions] = useState(job?.additionalQuestions || []);
    const addQuestion = () => {
        setAdditionalQuestions([...additionalQuestions, undefined]);
    };
    const removeQuestion = (i) => {
        setAdditionalQuestions(additionalQuestions.filter((_, index) => index !== i));
    };

    return (
        <form className="text-white p-8 rounded-lg border border-gray-300 max-w-lg flex flex-col gap-3 min-w-3/4 mx-auto">
            <label htmlFor="job-title">Job Title</label>
            <input id="job-title" type="text" placeholder={job?.title || "Job Title"} className={inputStyle} />

            <label htmlFor="job-description">Job Description</label>
            <textarea id="job-description" placeholder={job?.description || "Job Description"} className={inputStyle} rows={5} />

            <label htmlFor="pay-range">Pay Range</label>
            <div className="flex gap-4" id="pay-range">
                <input id="pay-range-low" type="numeric" placeholder={job ? `$${job.payRange.low}` : "Low"} className={`${inputStyle} w-full`} />
                <input id="pay-range-high" type="numeric" placeholder={job ? `$${job.payRange.high}` : "High"} className={`${inputStyle} w-full`} />
            </div>

            <label htmlFor="location">Location</label>
            <input id="location" type="text" placeholder={job?.location || "Location"} className={inputStyle} />

            {
                (additionalQuestions).map((q, i) => (
                    <div className="flex flex-col gap-2">
                        <div className="inline-flex justify-between">
                            <label htmlFor={`additional-question-${i}`}>Additional Question {i + 1}</label>
                            <button onClick={() => removeQuestion(i)} className="cursor-pointer mr-1" title={`Remove Question ${i + 1}`}>✕</button>
                        </div>
                        <input
                            key={`additional-questions-${i}`}
                            type="text"
                            placeholder={q === undefined ? `Additional Question ${i + 1}` : q}
                            className={inputStyle}
                        />
                    </div>
                ))
            }
            <button type="button" onClick={() => addQuestion()} className={`${inputStyle} cursor-pointer hover:bg-gray-800`}>+ Add Additional Question</button>

            <label htmlFor="job-skills">Required Skills</label>
            {/* Placeholder until Skills component gets merged */}
            <input id="job-skills" type="text" placeholder={job?.skills || "Required Skills"} className={inputStyle} />

            <button type="submit" className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-800">{creating ? "Create Job" : "Update Job"}</button>
        </form >
    )
}

export default JobForm;