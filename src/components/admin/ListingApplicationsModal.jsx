import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function ListingApplicationsModal({ listing, onClose }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!listing) return

    const fetchApplications = async () => {
      try {
        setLoading(true)
        
        const res = await fetch(`${API_BASE}/jobs/${listing._id}/applications`)
        if (!res.ok) throw new Error('Failed to load applications')
        
        const appData = await res.json()
        setApplications(Array.isArray(appData) ? appData : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [listing])

  const formatStatus = (status) => {
    switch (status) {
      case 'rejected': return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded font-medium">Rejected</span>
      case 'accepted': return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">Accepted</span>
      case 'interview': return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">Interview</span>
      default: return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-medium capitalize">{status || 'Pending'}</span>
    }
  }

  const getApplicantName = (application) => {
    const applicant = application?.applicant || {}
    if (typeof applicant.name === 'string') return applicant.name

    const first = applicant?.name?.first ?? applicant?.firstName ?? ''
    const last = applicant?.name?.last ?? applicant?.lastName ?? ''
    return `${first} ${last}`.trim() || 'Unknown Applicant'
  }
  
  const getAppliedTime = (application) => {
      const value = application?.date || application?.['date:'] || application?.appliedAt || application?.createdAt;
      const timestamp = new Date(value).getTime();
      if (Number.isNaN(timestamp) || timestamp === 0) return 'Unknown Date';
      return new Date(timestamp).toLocaleDateString();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Applications for {listing?.title || 'Job'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl self-end sm:self-auto">✕</button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded">{error}</p>}

        <div className="overflow-y-auto flex-1 pr-2">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
          ) : (
            applications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No applications found for this listing.</p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">Job: {listing?.title || 'Job'}</h3>
                        <h4 className="font-medium text-gray-800 mt-1">Applicant: {getApplicantName(app)}</h4>
                        <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-1">
                          Applied {getAppliedTime(app)}
                        </p>
                      </div>
                      {formatStatus(app.status)}
                    </div>
                    {app.skills && app.skills.length > 0 && (
                      <div className="mt-3">
                        <span className="font-semibold text-gray-700 text-sm block mb-1">Applicant Skills:</span>
                        <div className="flex flex-wrap gap-2">
                          {app.skills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-violet-50 text-violet-700 text-xs rounded-md font-medium border border-violet-100">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {app.additionalAnswers && app.additionalAnswers.length > 0 && (
                      <div className="flex flex-col gap-2 mt-3">
                        <span className="font-semibold text-gray-700 text-sm">Additional Answers:</span>
                        {app.additionalAnswers.map((answer, i) => (
                          <div key={i} className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-600">
                            {answer || <span className="text-gray-400 italic">No answer provided</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    {(app.resume || app.applicant?.resume) && (
                      <div className="mt-4 border-t border-gray-100 pt-3">
                        <a
                          href={`${API_BASE}${app.resume || app.applicant?.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                          View Resume
                        </a>
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

export default ListingApplicationsModal