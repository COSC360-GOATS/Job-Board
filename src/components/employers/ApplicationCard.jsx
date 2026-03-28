import { Skill } from "../Skills";

export function ApplicationCard({ application, job }) {
    const applicant = application.applicant || {};

    const applicantSkills = applicant.skills ?? [];
    const requiredSkillSet = new Set((job?.skills ?? []).map((skill) => skill.toLowerCase()));
    const nonMatchStyle = {
        backgroundColor: 'hsl(0, 0%, 16%)',
        borderColor: 'hsl(0, 0%, 60%)',
        color: 'hsl(0, 0%, 78%)',
        opacity: 0.5
    };

    const matchedSkills = applicantSkills.filter((skill) => requiredSkillSet.has(skill.toLowerCase()));
    const otherSkills = applicantSkills.filter((skill) => !requiredSkillSet.has(skill.toLowerCase()));
    const orderedSkills = [...matchedSkills, ...otherSkills];

    return (
        <section className="text-white p-8 rounded-lg border border-gray-300 w-full flex items-start gap-4">

            <div className="flex flex-col gap-2 basis-1/3 max-w-1/3 min-w-0 overflow-hidden p-4">
                <div className="flex justify-between items-end gap-3 flex-wrap">
                    <div className="flex items-center">
                        <img src={applicant.profile} alt={`${applicant.name.first} ${applicant.name.last}`} className="w-36 h-36 rounded-full border border-gray-300 object-cover text-center flex justify-center items-center text-gray-300" />
                        <div className="ml-4 flex flex-col gap-1 min-w-0">
                            <h3 className="text-3xl font-semibold">{applicant.name.last}, {applicant.name.first}</h3>
                            <a href={`mailto:${applicant.email}`} className="text-blue-500 hover:underline">
                                {applicant.email}
                            </a>
                            <a href={`tel:${applicant.phone}`} className="text-blue-500 hover:underline">
                                {applicant.phone}
                            </a>
                            <p>{applicant.location}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        disabled={!applicant.resume}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-red-300/50 bg-red-950/30 px-3 py-2 text-sm font-medium text-red-200 hover:bg-red-900/40 disabled:cursor-not-allowed disabled:opacity-50"
                        title={applicant.resume ? 'Download resume PDF' : 'No resume uploaded'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                            <path d="M14.25 2.25a.75.75 0 0 1 .53.22l4.75 4.75a.75.75 0 0 1 .22.53v11.5A2.75 2.75 0 0 1 17 22H7a2.75 2.75 0 0 1-2.75-2.75V4.75A2.75 2.75 0 0 1 7 2h7.25Zm-.75 1.81V8h3.94L13.5 4.06ZM8.5 13a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5h-7Zm0 3.5a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5h-4Z" />
                        </svg>
                        <span>Resume.pdf</span>
                    </button>
                </div>
                <ul className="flex justify-start items-start flex-wrap mt-2">
                    {orderedSkills.map((skill, i) => (
                        <Skill
                            key={i}
                            name={skill}
                            className="max-w-full break-all"
                            style={!requiredSkillSet.has(skill.toLowerCase()) ? nonMatchStyle : undefined} />
                    ))}
                </ul>
            </div>
            <div className="basis-2/3 max-w-2/3 min-w-0 wrap-break-word">
                <h4 className="font-semibold text-xl mb-2">Additional Questions:</h4>
                {job.additionalQuestions?.map((question, i) => (
                    <p key={`question-${application._id}-${i}`}>
                        <strong>{question}</strong> 
                        <br />
                        {application.additionalAnswers?.[i] ||
                            <span className="text-gray-400">
                                Answer not provided.
                            </span>
                        }
                        <br />
                        <br />
                    </p>
                ))}
            </div>
        </section>
    );
}
