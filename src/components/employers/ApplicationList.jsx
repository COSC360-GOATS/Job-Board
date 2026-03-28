import { useLocation } from "react-router-dom";
import { ApplicationCard } from "./ApplicationCard";

const testApplicants = [
    {
        _id: 1,
        jobId: 1,
        applicant: {
            name: {
                first: "John",
                last: "Doe"
            },
            email: "jdoe@email.com",
            phone: "555-555-5555",
            resume: "https://example.com/resume.pdf",
            location: "Kelowna, BC",
            profile: "https://example.com/profile.jpg",
            skills: ["JavaScript", "React", "Node.js"],
        },
        additionalAnswers: [
            "I am passionate about software development and have experience with React and Node.js.",
            "I am available to start immediately and am open to relocation."
        ]
    },
    {
        _id: 2,
        jobId: 1,
        applicant: {
            name: {
                first: "Jane",
                last: "Smith"
            },
            email: "jsmith@email.com",
            phone: "222-222-2222",
            resume: "https://example.com/resume.pdf",
            location: "Vancouver, BC",
            profile: "https://example.com/profile.jpg",
            skills: ["JavaScript", "React", "Express", "MongoDB", "AWS", "Docker", "TypeScript", "NextJS", "MySQL", "Python", "Go", "Rust", "Node.js"],
        },
        additionalAnswers: [
            "I have 5 years of experience in software development and have worked with React and Node.js on several projects.",
            "I am currently employed but am open to new opportunities and can start with a 2-week notice."
        ]
    }
];

function ApplicantList() {
    const location = useLocation();
    const job = location.state?.job;

    return (
        <div className="flex flex-col gap-4 px-6 py-3 cursor-default">
            {testApplicants.map((application) => (
                <ApplicationCard key={application._id} application={application} job={job} />
            ))}
        </div>
    );
}



export default ApplicantList;