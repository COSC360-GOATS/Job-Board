import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function ApplicantApplicationsModal({ applicant, onClose }) {
  const [applications, setApplications] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('applications')

  useEffect(() => {
    if (!applicant) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const [appRes, revRes] = await Promise.all([
          fetch(`${API_BASE}/applications/applicant/${applicant._id}`),
          fetch(`${API_BASE}/ratings/applicant/${applicant._id}`)
        ])

        if (!appRes.ok || !revRes.ok) throw new Error('Failed to load applicant data')
        
        const appData = await appRes.json()
        const revData = await revRes.json()
        
        setApplications(appData)
        setReviews(revData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [applicant])

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const res = await fetch(`${API_BASE}/ratings/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete review');
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete review');
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'rejected': return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded font-medium">Rejected</span>
      case 'accepted': return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">Accepted</span>
      case 'interview': return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">Interview</span>
      default: return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-medium capitalize">{status || 'Pending'}</span>
    }
  }

  const getApplicantName = () => {
    if (applicant.name && typeof applicant.name === 'object' && applicant.name.first) return String(applicant.name.first)
    if (typeof applicant.name === 'string') return applicant.name
    if (typeof applicant.firstName === 'string') return applicant.firstName
    return 'Applicant'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{getApplicantName()}&apos;s Activity</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl self-end sm:self-auto">✕</button>
        </div>

        <div className="flex gap-2 mb-4 border-b border-gray-200 pb-2">
          <button 
            onClick={() => setTab('applications')}
            className={`px-4 py-2 font-medium rounded-lg transition ${tab === 'applications' ? 'bg-slate-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Applications
          </button>
          <button 
            onClick={() => setTab('reviews')}
            className={`px-4 py-2 font-medium rounded-lg transition ${tab === 'reviews' ? 'bg-slate-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Reviews
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded">{error}</p>}

        <div className="overflow-y-auto flex-1 pr-2">
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading...</p>
          ) : tab === 'applications' ? (
            applications.length === 0 ? (
              <p className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-lg">No job applications found.</p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{app.jobTitle || 'Job'}</h3>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">
                          Applied On: {new Date(app.submittedAt || app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {formatStatus(app.status)}
                    </div>
                    {app.coverLetter && (
                      <div className="mt-2 bg-white p-3 rounded border border-gray-100 text-sm text-gray-600 italic">
                        &quot;{app.coverLetter}&quot;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            reviews.length === 0 ? (
              <p className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-lg">No reviews left by this applicant.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm flex flex-col gap-2 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg pr-12">Employer: {rev.employerName || 'Unknown Employer'}</h3>
                        <p className="text-xs text-gray-500 font-medium tracking-wide mt-1">
                          Rating: <span className="text-yellow-500 text-sm">{'★'.repeat(rev.rating)}{'☆'.repeat(5-rev.rating)}</span> ({rev.rating}/5)
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDeleteReview(rev._id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded transition absolute top-4 right-4"
                        title="Delete Review"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                    </div>
                    {rev.comment && (
                      <div className="mt-2 bg-white p-3 rounded border border-gray-100 text-sm text-gray-600">
                        &quot;{rev.comment}&quot;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        <div className="mt-6 flex justify-end shrink-0 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApplicantApplicationsModal