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
        <section className="text-white p-8 rounded-lg border border-gray-300 w-full flex justify-between items-start gap-3">

            <div className="flex flex-col gap-2 flex-1 min-w-0 max-w-full overflow-hidden grow">
                <div className="flex items-center">
                    <img src={applicant.profile} alt={`${applicant.name.first} ${applicant.name.last}`} className="w-40 h-40 rounded-full object-cover text-center flex justify-center items-center text-gray-300" />
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
                <ul className="flex justify-start items-start flex-wrap">
                    {orderedSkills.map((skill, i) => (
                        <Skill
                            key={i}
                            name={skill}
                            className="max-w-full break-all"
                            style={!requiredSkillSet.has(skill.toLowerCase()) ? nonMatchStyle : undefined} />
                    ))}
                </ul>
            </div>
            <div className="grow">
                <h4 className="font-semibold">Additional Questions:</h4>
                {application.additionalAnswers?.map((answer, i) => (
                    <p key={`answer-${application._id}-${i}`}><strong>{job.additionalQuestions[i]}</strong> {answer}</p>
                ))}
            </div>
        </section>
    );
}
