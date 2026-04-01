import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Skills from "../Skills";
import FormField from "./FormField";

function validateJobForm({ title, description, payRangeLow, payRangeHigh, location, additionalQuestions }) {
    const errors = {};

    title = title.trim();
    description = description.trim();
    location = location.trim();

    if (!title) {
        errors.title = "Job title is required.";
    }
    else if (title.length < 3 || title.length > 100) {
        errors.title = "Job title must be between 3 and 100 characters.";
    }

    if (!description) {
        errors.description = "Job description is required.";
    }
    else if (description.length < 10 || description.length > 1500) {
        errors.description = "Job description must be between 10 and 1500 characters.";
    }

    if (!location) {
        errors.location = "Location is required.";
    }
    else if (location.length < 2 || location.length > 100) {
        errors.location = "Location must be between 2 and 100 characters.";
    }

    const low = Number(payRangeLow);
    const high = Number(payRangeHigh);

    if (!Number.isFinite(low) || low < 0 || !low) {
        errors.payRangeLow = "Enter a valid minimum pay.";
    }

    if (!Number.isFinite(high) || high < 0 || !high) {
        errors.payRangeHigh = "Enter a valid maximum pay.";
    }

    if (Number.isFinite(low) && Number.isFinite(high) && high < low) {
        errors.payRangeHigh = "Maximum pay must be greater than or equal to minimum pay.";
    }

    const additionalQuestionErrors = (additionalQuestions || []).map((q) => {
        if (q.trim() === "") {
            return "Additional question cannot be blank.";
        }
        if (q.trim().length < 3 || q.trim().length > 200) {
            return "Additional question must be between 3 and 200 characters.";
        }
        return null;
    });

    if (additionalQuestionErrors.some(Boolean)) {
        errors.additionalQuestions = additionalQuestionErrors;
    }

    return errors;
}

function JobForm({ job }) {
    const [title, setTitle] = useState(job?.title || "");
    const [description, setDescription] = useState(job?.description || "");
    const [payRangeLow, setPayRangeLow] = useState(job?.payRange?.low ?? "");
    const [payRangeHigh, setPayRangeHigh] = useState(job?.payRange?.high ?? "");
    const [location, setLocation] = useState(job?.location || "");
    const [additionalQuestions, setAdditionalQuestions] = useState(job?.additionalQuestions || []);
    const [additionalQuestionsTouched, setAdditionalQuestionsTouched] = useState((job?.additionalQuestions || []).map(() => false));
    const [skills, setSkills] = useState(job?.skills || []);
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const navigate = useNavigate();
    const loc = useLocation();
    const creating = loc.pathname === "/jobs/new";

    const inputStyle = "rounded-lg border border-gray-300 px-4 py-2";
    const errors = validateJobForm({ title, description, payRangeLow, payRangeHigh, location, additionalQuestions });

    const shouldShow = (name) => Boolean((touched[name] || submitted) && errors[name]);
    const markTouched = (name) => setTouched((prev) => ({ ...prev, [name]: true }));

    const addQuestion = () => {
        setAdditionalQuestions([...additionalQuestions, ""]);
        setAdditionalQuestionsTouched([...additionalQuestionsTouched, false]);
    };
    const removeQuestion = (i) => {
        setAdditionalQuestions(additionalQuestions.filter((_, index) => index !== i));
        setAdditionalQuestionsTouched(additionalQuestionsTouched.filter((_, index) => index !== i));
    };

    const markAdditionalQuestionTouched = (i) => {
        setAdditionalQuestionsTouched((prev) => prev.map((touchedValue, index) => (index === i ? true : touchedValue)));
    };

    const additionalQuestionErrors = errors.additionalQuestions || [];

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);

        if (Object.keys(errors).length > 0) {
            return;
        }

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
            additionalQuestions: additionalQuestions.map((q) => q.trim()).filter((q) => q !== ""),
            skills,
            employerId: import.meta.env.VITE_TEMP_EMPLOYER_ID // TEMPORARY until authentication is implemented
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

            navigate('/jobs');
        } catch (err) {
            console.error("Request failed", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="text-white p-8 rounded-lg border border-gray-300 max-w-lg flex flex-col gap-3 min-w-3/4 mx-auto">
            <div className="flex items-center justify-between">
                <legend className="text-2xl font-semibold mb-4">{creating ? "Create New Job" : `Editing "${job.title}"`}</legend>
            </div>

            <FormField label="Job Title" htmlFor="job-title" error={errors.title} showError={touched.title || submitted}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => markTouched("title")}
                    id="job-title"
                    type="text"
                    placeholder="Job Title"
                    className={inputStyle}
                />
            </FormField>

            <FormField
                error={errors.description}
                showError={touched.description || submitted}
                labelContent={
                    <label htmlFor="job-description">
                        Job Description <span className={description.length > 1500 ? "text-red-400" : "text-gray-400"}>({description.length}/1500)</span>
                    </label>
                }
            >
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={() => markTouched("description")}
                    id="job-description"
                    placeholder="Job Description"
                    className={inputStyle}
                    rows={5}
                />
            </FormField>

            <label htmlFor="pay-range">Pay Range</label>
            <div className="flex gap-4" id="pay-range">
                <FormField htmlFor="pay-range-low" error={errors.payRangeLow} showError={shouldShow("payRangeLow")}>
                    <input
                        value={payRangeLow}
                        onChange={(e) => setPayRangeLow(e.target.value)}
                        onBlur={() => markTouched("payRangeLow")}
                        id="pay-range-low"
                        type="number"
                        min="0"
                        placeholder="Low"
                        className={`${inputStyle} w-full`}
                    />
                </FormField>
                <FormField htmlFor="pay-range-high" error={errors.payRangeHigh} showError={shouldShow("payRangeHigh")}>
                    <input
                        value={payRangeHigh}
                        onChange={(e) => setPayRangeHigh(e.target.value)}
                        onBlur={() => markTouched("payRangeHigh")}
                        id="pay-range-high"
                        type="number"
                        min="0"
                        placeholder="High"
                        className={`${inputStyle} w-full`}
                    />
                </FormField>
            </div>

            <FormField label="Location" htmlFor="location" error={errors.location} showError={touched.location || submitted}>
                <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onBlur={() => markTouched("location")}
                    id="location"
                    type="text"
                    placeholder="Location"
                    className={inputStyle}
                />
            </FormField>
            {
                (additionalQuestions).map((q, i) => (
                    <FormField
                        key={`additional-questions-${i}`}
                        htmlFor={`additional-question-${i}`}
                        error={additionalQuestionErrors[i]}
                        showError={additionalQuestionsTouched[i] || submitted}
                        labelContent={(
                            <div className="inline-flex justify-between">
                                <label htmlFor={`additional-question-${i}`}>Additional Question {i + 1}</label>
                                <button type="button" onClick={() => removeQuestion(i)} className="cursor-pointer mr-1" title={`Remove Question ${i + 1}`}>✕</button>
                            </div>
                        )}
                    >
                        <input
                            id={`additional-question-${i}`}
                            type="text"
                            value={q}
                            placeholder={`Additional Question ${i + 1}`}
                            className={inputStyle}
                            onBlur={() => markAdditionalQuestionTouched(i)}
                            onChange={(e) => {
                                const newQuestions = [...additionalQuestions];
                                newQuestions[i] = e.target.value;
                                setAdditionalQuestions(newQuestions);
                            }}
                        />
                    </FormField>
                ))
            }
            <button type="button" onClick={() => addQuestion()} className={`${inputStyle} cursor-pointer bg-gray-200 text-black hover:bg-gray-50`}>+ Add Additional Question</button>

            <div className="flex flex-col gap-1">
                <label htmlFor="job-skills">Skills</label>
                <Skills id="job-skills" onChange={(e) => setSkills(e.target.value)} skills={skills} />
            </div>

            <button type="submit" className="cursor-pointer rounded-lg text-black bg-gray-200 px-4 py-2 hover:bg-gray-50 mt-4">{creating ? "Create Job" : "Update Job"}</button>
        </form >
    )
}

export default JobForm;