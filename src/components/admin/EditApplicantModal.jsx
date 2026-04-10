import { useState, useEffect } from 'react'
import Skills from '../Skills'
import { formatPhoneNumber } from '../../utils/phone'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function EditApplicantModal({ applicant, onClose, onSave }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [skills, setSkills] = useState([])
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (applicant) {
      if (applicant.name && typeof applicant.name === 'object') {
        setFirstName(applicant.name.first || '')
        setLastName(applicant.name.last || '')
      } else {
        setFirstName(applicant.firstName || applicant.name || '')
        setLastName(applicant.lastName || '')
      }
      setEmail(applicant.email || '')
      setPhone(formatPhoneNumber(applicant.phone) || '')
      setLocation(applicant.location || '')
      setSkills(applicant.skills || [])
      setDescription(applicant.description || '')
    }
  }, [applicant])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
        
    const updatedData = {
      name: { first: firstName, last: lastName },
      email,
      phone,
      location,
      skills,
      description
    }

    try {
      const response = await fetch(`${API_BASE}/applicants/${applicant._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      if (!response.ok) {
        throw new Error('Failed to update applicant details')
      }

      const updatedApplicant = await response.json()
      onSave(updatedApplicant)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500"
  const labelClass = "mb-1 block text-sm font-medium text-slate-700"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Applicant</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input className={inputClass} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input className={inputClass} value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                placeholder="(250) 555-0199"
              />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kelowna, BC" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Skills</label>
            <Skills skills={skills} onChange={(e) => setSkills(e.target.value)} className="border-slate-300" />
          </div>

          <div>
            <label className={labelClass}>Profile Summary / Description</label>
            <textarea
              className={`${inputClass} min-h-[100px]`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief summary of the applicant..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 transition"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditApplicantModal