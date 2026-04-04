import ReviewSummary from './ReviewSummary';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { useEffect, useState } from 'react';

function ReviewSection({
    employerId,
    className = ''
}) {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const [employer, setEmployer] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formRating, setFormRating] = useState(4);
    const [formComment, setFormComment] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError('');

                const employerRes = await fetch(`${API_BASE}/employers/${employerId}`);
                if (!employerRes.ok) throw new Error('Failed to fetch employer');
                const employerData = await employerRes.json();
                setEmployer(employerData);

                const ratingsRes = await fetch(`${API_BASE}/ratings/employer/${employerId}`);
                if (!ratingsRes.ok) throw new Error('Failed to fetch ratings');
                const ratingsData = await ratingsRes.json();
                
                const avgRes = await fetch(`${API_BASE}/ratings/employer/${employerId}/avg`);
                if (avgRes.ok) {
                    const avgData = await avgRes.json();
                    setAverageRating(avgData.avgRating);
                }
                
                const formattedRatings = ratingsData.map((r) => {
                    
                    const applicant = r.applicant;                    
                    const applicantName = applicant?.name ? `${applicant.name.first} ${applicant.name.last}` : 'Anonymous';
                    
                    const review = {
                        id: r._id,
                        reviewerName: applicantName,
                        avatarSrc: applicant?.profile || '',
                        avatarAlt: applicantName,
                        rating: r.rating,
                        comment: r.comment
                    };
                    return review;
                });

                setRatings(formattedRatings);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to load ratings');
            } finally {
                setLoading(false);
            }
        }

        if (employerId) {
            fetchData();
        }
    }, [employerId, API_BASE]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch(`${API_BASE}/ratings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employerId,
                    applicantId: import.meta.env.VITE_TEMP_APPLICANT_ID,
                    rating: formRating,
                    comment: formComment
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Failed to submit review');
            }

            const newRating = await res.json();
            
            setRatings([
                {
                    id: newRating._id,
                    reviewerName: 'You',
                    avatarSrc: '',
                    avatarAlt: 'Your avatar',
                    rating: newRating.rating,
                    comment: newRating.comment
                },
                ...ratings
            ]);

            setFormRating(4);
            setFormComment('');
        } catch (err) {
            console.error('Error submitting review:', err);
            setError(err.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <section className={`w-full rounded-2xl bg-white text-slate-900 shadow-sm ${className}`.trim()}>
                <div className="p-4 text-center md:p-5">
                    <p className="text-slate-600">Loading reviews...</p>
                </div>
            </section>
        );
    }

    if (error && !employer) {
        return (
            <section className={`w-full rounded-2xl bg-white text-slate-900 shadow-sm ${className}`.trim()}>
                <div className="p-4 text-center md:p-5">
                    <p className="text-red-600">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className={`w-full rounded-2xl bg-white text-slate-900 shadow-sm ${className}`.trim()}>
            <div className="grid gap-6 p-4 md:p-5 lg:grid-cols-[minmax(220px,1fr)_minmax(280px,1.2fr)_minmax(260px,1fr)] lg:items-start">
                <ReviewSummary
                    title={employer?.name || 'Employer'}
                    description={employer?.description}
                    avatarSrc={employer?.logo}
                    avatarAlt={employer?.name || 'Employer avatar'}
                    averageRating={averageRating}
                />

                <ReviewForm
                    heading="Tell Us About Your Experience"
                    rating={formRating}
                    onRatingChange={setFormRating}
                    comment={formComment}
                    onCommentChange={setFormComment}
                    onSubmit={handleSubmitReview}
                    submitLabel="Submit"
                    placeholder="Write a review here..."
                    disabled={submitting}
                />

                <ReviewList title="Reviews" reviews={ratings} />
            </div>
        </section>
    );
}

export default ReviewSection;
