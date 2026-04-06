import { useNavigate } from "react-router-dom";
import { Skill } from "../Skills";
import { formatTimeAgo } from "../../utils/formatTimeAgo";

function StarRating({ rating }) {
    const rounded = Math.round(rating * 2) / 2;
    return (
        <span className="flex items-center gap-0.5 text-sm text-amber-400" title={`${rating?.toFixed(1) ?? 'No'} stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                    {rounded >= star ? "★" : rounded >= star - 0.5 ? "⯨" : "☆"}
                </span>
            ))}
        </span>
    );
}

function ApplicantJobCard({ job, employerName, avgRating }) {
    const navigate = useNavigate();
    const postedTimeAgo = formatTimeAgo(job.postedAt || job.date || job.createdAt);

    return (
        <div className="flex h-full w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
            <div className="flex justify-between items-start gap-3">
                <h3 className="wrap-break-word min-w-0 flex-1 text-xl font-semibold">
                    {job.title}
                </h3>
            </div>

            <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-violet-700">{employerName || "Unknown Employer"}</span>
                    {avgRating != null && <StarRating rating={avgRating} />}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">
                    ${job.payRange?.low?.toLocaleString()} – ${job.payRange?.high?.toLocaleString()} &middot; {job.location}
                </p>
                {postedTimeAgo && (
                    <p className="text-xs text-slate-400 mt-0.5">Posted {postedTimeAgo}</p>
                )}
            </div>

            <p className="line-clamp-3 min-h-[4.5rem] text-slate-600 text-sm">{job.description}</p>

            <ul className="w-full flex justify-start items-center flex-nowrap overflow-x-auto overflow-y-hidden [&>li]:shrink-0">
                {(job.skills ?? []).map((skill, i) => (
                    <Skill key={i} name={skill} />
                ))}
            </ul>

            <button
                className="mt-auto w-full cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
                onClick={() => navigate(`/listings/${job._id}`, { state: { job, employerName } })}
            >
                Apply
            </button>
        </div>
    );
}

export default ApplicantJobCard;