import { useState, useEffect } from 'react'
import ItemCard from './ItemCard'

const TABS = ['Applicants', 'Reviews', 'Employers', 'Listings']

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Applicants')
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch('/api/applicants')
        
        if (!response.ok) {
          throw new Error('Failed to fetch applicants')
        }
        
        const data = await response.json()
        setItems(data)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching applicants:', err)
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === 'Applicants') {
      fetchApplicants()
    }
  }, [activeTab])

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/applicants/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete applicant')
      }
      
      setItems(items.filter(item => item._id !== id))
    } catch (err) {
      console.error('Error deleting applicant:', err)
      setError(err.message)
    }
  }

  const handleEdit = (id) => {
    console.log('Edit item:', id)
  }

  const filteredItems = items.filter(item => {
    // Handle nested name objects like { first: "John", last: "Doe" }
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
    
    const name = firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName || 'Unknown')
    const email = item.email || ''
    const searchLower = searchQuery.toLowerCase()
    return name.toLowerCase().includes(searchLower) || email.toLowerCase().includes(searchLower)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}

          {!loading && !error && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No applicants found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
