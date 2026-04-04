import RatingStars from './RatingStars';

function ReviewCard({
    reviewerName,
    avatarSrc,
    avatarAlt = 'Reviewer avatar',
    rating = 0,
    comment,
    className = ''
}) {

    return (
        <article className={`flex items-start gap-3 ${className}`.trim()}>
            {avatarSrc ? (
                <img
                    src={avatarSrc}
                    alt={avatarAlt}
                    className="h-14 w-14 shrink-0 rounded-full border border-violet-200 bg-violet-50 object-cover"
                />
            ) : (
                <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-lg font-semibold text-violet-300"
                    role="img"
                >
                    {avatarAlt?.[0]?.toUpperCase() ?? '?'}
                </div>
            )}

            <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">{reviewerName}</h3>
                <RatingStars value={rating} readOnly size="sm" className="mt-1" />
                {comment && (
                    <p className="mt-2 text-sm leading-5 text-slate-700">{comment}</p>
                )}
            </div>
        </article>
    );
}

export default ReviewCard;
