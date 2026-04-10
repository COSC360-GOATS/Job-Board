import { useState, useEffect } from 'react'
import ItemCard from './ItemCard'
import EditJobModal from './EditJobModal'
import EditApplicantModal from './EditApplicantModal'
import EditEmployerModal from './EditEmployerModal'
import ApplicantApplicationsModal from './ApplicantApplicationsModal'
import { useNavigate } from 'react-router-dom'

const TABS = ['Applicants', 'Reviews', 'Employers', 'Listings']

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Applicants')
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingJob, setEditingJob] = useState(null)
  const [editingApplicant, setEditingApplicant] = useState(null)
  const [editingEmployer, setEditingEmployer] = useState(null)
  const [exploringApplicant, setExploringApplicant] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')
        
        let endpoint = '/api/applicants'
        if (activeTab === 'Employers') {
          endpoint = '/api/employers'
        } else if (activeTab === 'Listings') {
          endpoint = '/api/jobs'
        } else if (activeTab === 'Reviews') {
          endpoint = '/api/ratings'
        }
        
        const response = await fetch(endpoint)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${activeTab.toLowerCase()}`)
        }
        
        const data = await response.json()
        setItems(data)
      } catch (err) {
        setError(err.message)
        console.error(`Error fetching ${activeTab}:`, err)
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === 'Applicants' || activeTab === 'Employers' || activeTab === 'Listings' || activeTab === 'Reviews') {
      fetchData()
    }
  }, [activeTab])

  const handleToggleStatus = async (id) => {
    try {
      let endpoint = '/api/applicants'
      let statusField = 'isDeactivated'
      
      if (activeTab === 'Employers') {
        endpoint = '/api/employers'
        statusField = 'isDeactivated'
      } else if (activeTab === 'Listings') {
        endpoint = '/api/jobs'
        statusField = 'isClosed'
      } else if (activeTab === 'Reviews') {
        const response = await fetch(`/api/ratings/${id}`, {
          method: 'DELETE'
        })
        if (!response.ok) {
          throw new Error('Failed to delete review')
        }
        setItems(items.filter(item => item._id !== id))
        return
      }
      
      const item = items.find(i => i._id === id)
      const currentStatus = statusField === 'isClosed' ? item.isClosed : item.isDeactivated
      const newStatus = !currentStatus
      
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [statusField]: newStatus })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update ${activeTab.toLowerCase().slice(0, -1)}`)
      }
      
      const updatedItem = await response.json()
      setItems(items.map(item => item._id === id ? updatedItem : item))
    } catch (err) {
      console.error(`Error updating item:`, err)
      setError(err.message)
    }
  }

  const handleExplore = (id) => {
    if (activeTab === 'Applicants') {
      const applicant = items.find(item => item._id === id)
      setExploringApplicant(applicant)
    } else if (activeTab === 'Employers') {
      navigate('/jobs?employerId=' + id) 
    }
  }

  const handleEdit = (id) => {
    if (activeTab === 'Listings') {
      const job = items.find(item => item._id === id)
      setEditingJob(job)
    } else if (activeTab === 'Applicants') {
      const applicant = items.find(item => item._id === id)
      setEditingApplicant(applicant)
    } else if (activeTab === 'Employers') {
      const employer = items.find(item => item._id === id)
      setEditingEmployer(employer)
    }
  }

  const handleSaveJob = async (jobData) => {
    try {
      const response = await fetch(`/api/jobs/${editingJob._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      })

      if (!response.ok) {
        throw new Error('Failed to save job')
      }

      const updatedJob = await response.json()
      setItems(items.map(item => item._id === editingJob._id ? updatedJob : item))
      setEditingJob(null)
      setError('')
    } catch (err) {
      console.error('Error saving job:', err)
      setError(err.message)
    }
  }

  const filteredItems = items.filter(item => {
    let searchableText = ''
    
    if (activeTab === 'Employers') {
      searchableText = item.name || item.companyName || 'Unknown'
    } else if (activeTab === 'Listings') {
      searchableText = `${item.title || ''} ${item.description || ''} ${item.location || ''}`
    } else if (activeTab === 'Reviews') {
      searchableText = `${item.comment || ''} ${item.rating || ''} ${item.employerName || ''} ${item.applicantName || ''}`
    } else {
      let firstName = item.firstName
      let lastName = item.lastName
      
      if (typeof firstName === 'object' && firstName?.first) {
        firstName = firstName.first
      } else if (typeof firstName !== 'string') {
        firstName = ''
      }
      
      if (typeof lastName === 'object' && lastName?.last) {
        lastName = lastName.last
      } else if (typeof lastName !== 'string') {
        lastName = ''
      }
      
      searchableText = firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName || 'Unknown')
    }
    
    const email = String(item.email || '')
    const searchLower = String(searchQuery).toLowerCase()
    return String(searchableText).toLowerCase().includes(searchLower) || email.toLowerCase().includes(searchLower)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Admin Dashboard</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setLoading(true)
                  setItems([])
                  setActiveTab(tab)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === tab
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading...</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-red-700 font-medium">Error: {error}</p>
            </div>
          )}

          {!loading && !error && filteredItems.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              itemType={
                activeTab === 'Employers' ? 'employer' :
                activeTab === 'Listings' ? 'listing' :
                activeTab === 'Reviews' ? 'review' : 'applicant'
              }
              onDelete={handleToggleStatus}
              onEdit={handleEdit}
              onExplore={handleExplore}
            />
          ))}

          {!loading && !error && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No {activeTab.toLowerCase()} found</p>
            </div>
          )}
        </div>
      </div>

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleSaveJob}
        />
      )}
      
      {editingApplicant && (
        <EditApplicantModal
          applicant={editingApplicant}
          onClose={() => setEditingApplicant(null)}
          onSave={(updatedApplicant) => {
            setItems(items.map(item => item._id === editingApplicant._id ? updatedApplicant : item))
            setEditingApplicant(null)
          }}
        />
      )}

      {editingEmployer && (
        <EditEmployerModal
          employer={editingEmployer}
          onClose={() => setEditingEmployer(null)}
          onSave={(updatedEmployer) => {
            setItems(items.map(item => item._id === editingEmployer._id ? updatedEmployer : item))
            setEditingEmployer(null)
          }}
        />
      )}

      {exploringApplicant && (
        <ApplicantApplicationsModal
          applicant={exploringApplicant}
          onClose={() => setExploringApplicant(null)}
        />
      )}
    </div>
  )
}

export default AdminDashboard
