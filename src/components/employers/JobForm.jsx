import { useState } from "react";
import { useLocation } from "react-router-dom";
import Skills from "../Skills";

function JobForm({ job }) {
    const [title, setTitle] = useState(job?.title || "");
    const [description, setDescription] = useState(job?.description || "");
    const [payRangeLow, setPayRangeLow] = useState(job?.payRange.low || "");
    const [payRangeHigh, setPayRangeHigh] = useState(job?.payRange.high || "");
    const [location, setLocation] = useState(job?.location || "");
    const [additionalQuestions, setAdditionalQuestions] = useState(job?.additionalQuestions || []);
    const [skills, setSkills] = useState(job?.skills || []);
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const loc = useLocation();
    const creating = loc.pathname === "/jobs/new";

    const inputStyle = "rounded-lg border border-gray-300 px-4 py-2 mb-4"
    const addQuestion = () => {
        setAdditionalQuestions([...additionalQuestions, undefined]);
    };
    const removeQuestion = (i) => {
        setAdditionalQuestions(additionalQuestions.filter((_, index) => index !== i));
    };

    async function handleSubmit(e) {
        e.preventDefault();

        if (!creating && !job?._id) {
            console.error("Missing job id for update");
            return;
        }

        const payload = {
            title,
            description,
            location,
            payRange: {
                low: Number(payRangeLow),
                high: Number(payRangeHigh)
            },
            additionalQuestions: additionalQuestions.filter(q => q !== undefined),
            skills,
        }

        const url = creating ? `${API_BASE}/jobs` : `${API_BASE}/jobs/${job._id}`;
        const method = creating ? "POST" : "PATCH";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                console.error("Something went wrong creating/updating the job", res.status);
                return;
            }

            const saved = await res.json();
            console.log("Saved job", saved);
        } catch (err) {
            console.error("Request failed", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="text-white p-8 rounded-lg border border-gray-300 max-w-lg flex flex-col gap-3 min-w-3/4 mx-auto">
            <label htmlFor="job-title">Job Title</label>
            <input onChange={(e) => setTitle(e.target.value)} id="job-title" type="text" placeholder={job?.title || "Job Title"} className={inputStyle} />

            <label htmlFor="job-description">Job Description</label>
            <textarea onChange={(e) => setDescription(e.target.value)} id="job-description" placeholder={job?.description || "Job Description"} className={inputStyle} rows={5} />

            <label htmlFor="pay-range">Pay Range</label>
            <div className="flex gap-4" id="pay-range">
                <input onChange={(e) => setPayRangeLow(e.target.value)} id="pay-range-low" type="numeric" placeholder={job ? `$${job.payRange.low}` : "Low"} className={`${inputStyle} w-full`} />
                <input onChange={(e) => setPayRangeHigh(e.target.value)} id="pay-range-high" type="numeric" placeholder={job ? `$${job.payRange.high}` : "High"} className={`${inputStyle} w-full`} />
            </div>

            <label htmlFor="location">Location</label>
            <input onChange={(e) => setLocation(e.target.value)} id="location" type="text" placeholder={job?.location || "Location"} className={inputStyle} />
            {
                (additionalQuestions).map((q, i) => (
                    <div key={`additional-questions-${i}`} className="flex flex-col gap-2">
                        <div className="inline-flex justify-between">
                            <label htmlFor={`additional-question-${i}`}>Additional Question {i + 1}</label>
                            <button type="button" onClick={() => removeQuestion(i)} className="cursor-pointer mr-1" title={`Remove Question ${i + 1}`}>✕</button>
                        </div>
                        <input
                            type="text"
                            placeholder={q === undefined ? `Additional Question ${i + 1}` : q}
                            className={inputStyle}
                            onChange={(e) => {
                                const newQuestions = [...additionalQuestions];
                                newQuestions[i] = e.target.value;
                                setAdditionalQuestions(newQuestions);
                            }}
                        />
                    </div>
                ))
            }
            <button type="button" onClick={() => addQuestion()} className={`${inputStyle} cursor-pointer hover:bg-gray-800`}>+ Add Additional Question</button>

            <label htmlFor="job-skills">Required Skills</label>
            <Skills id="job-skills" onChange={(e) => setSkills(e.target.value)} skills={skills} />

            <button type="submit" className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-800">{creating ? "Create Job" : "Update Job"}</button>
        </form >
    )
}

export default JobForm;