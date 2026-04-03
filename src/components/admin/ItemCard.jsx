function ItemCard({ item, onDelete, onEdit, itemType = 'applicant' }) {
  const getFirstName = () => {
    if (itemType === 'employer') {
      return item.name || 'Unknown Company'
    }
    if (itemType === 'listing') {
      return item.title || 'Untitled Job'
    }
    
    if (typeof item.firstName === 'string') return item.firstName
    if (typeof item.firstName === 'object' && item.firstName?.first) return String(item.firstName.first)
    return 'Unknown'
  }

  const getLastName = () => {
    if (itemType === 'employer' || itemType === 'listing') {
      return ''
    }
    
    if (typeof item.lastName === 'string') return item.lastName
    if (typeof item.lastName === 'object' && item.lastName?.last) return String(item.lastName.last)
    return ''
  }

  const firstName = String(getFirstName())
  const lastName = String(getLastName())
  const name = lastName.trim() ? `${firstName} ${lastName}`.trim() : firstName.trim()
  
  let email = item.email || 'No email provided'
  let description = ''
  
  if (itemType === 'employer') {
    description = item.location && item.industry ? `${item.location} • ${item.industry}` : item.industry || 'Employer account'
  } else if (itemType === 'listing') {
    const payRange = item.payRange ? `$${item.payRange.low.toLocaleString()} - $${item.payRange.high.toLocaleString()}` : 'Salary N/A'
    const skillsList = item.skills?.slice(0, 3).join(', ') || 'No skills listed'
    description = `${item.location} • ${payRange} • ${skillsList}`
    email = 'Job Listing'
  } else {
    description = item.description || 'Applicant registering for job opportunities'
  }
  
  const firstInitial = firstName?.[0] || ''
  const lastInitial = itemType === 'listing' ? item.location?.[0] || '' : lastName?.[0] || ''

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex gap-6 hover:shadow-md transition">
      {itemType !== 'listing' && (
        <div className="shrink-0">
          <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">
              {firstInitial}{lastInitial}
            </span>
          </div>
        </div>
      )}

      <div className="grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-600 text-sm mb-2">{email}</p>
        <p className="text-gray-500 text-sm mb-4">{description}</p>

        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
            Explore
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-red-100 hover:text-red-700 rounded-lg transition"
          >
            {itemType === 'listing' ? 'Close' : 'Deactivate'}
          </button>
          <button
            onClick={() => onEdit(item._id)}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

export default ItemCard
