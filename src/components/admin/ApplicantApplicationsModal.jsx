import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function ApplicantApplicationsModal({ applicant, onClose }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!applicant) return

    const fetchApplications = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE}/applications/applicant/${applicant._id}`)
        if (!response.ok) throw new Error('Failed to load applications')
        const data = await response.json()
        setApplications(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [applicant])

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{getApplicantName()}&apos;s Applications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded">{error}</p>}

        <div className="overflow-y-auto flex-1 pr-2">
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading applications...</p>
          ) : applications.length === 0 ? (
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