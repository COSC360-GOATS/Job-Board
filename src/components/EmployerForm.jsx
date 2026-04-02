import { useState } from 'react'

const FIELDS = [
  { name: 'name', label: 'Company Name', type: 'text', placeholder: 'Technooooooology' },
  { name: 'email', label: 'Contact Email', type: 'email', placeholder: 'email@company.com' },
  { name: 'location', label: 'Location', type: 'text', placeholder: 'Kelowna, BC' },
  { name: 'industry', label: 'Industry', type: 'text', placeholder: 'SaaaaS' },
  { name: 'username', label: 'Username', type: 'text', placeholder: 'username' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'password' },
]

const INITIAL_FORM = FIELDS.reduce((values, field) => {
  values[field.name] = ''
  return values
}, {})

function EmployerForm() {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/employers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const rawBody = await response.text()
      let payload = null

      if (rawBody) {
        try {
          payload = JSON.parse(rawBody)
        } catch {
          throw new Error('Server returned a non-JSON response.')
        }
      }

      if (!response.ok) {
        throw new Error(payload?.error || `Request failed with status ${response.status}.`)
      }

      setFormData(INITIAL_FORM)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto mt-6 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <h1 className="text-3xl font-bold tracking-tight">Employer Signup Form</h1>
      <p className="mt-2 mb-5 text-slate-600">
        Submit employer information to the server using an Express POST route.
      </p>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        {FIELDS.map((field) => (
          <label key={field.name} className="grid gap-1 font-semibold text-slate-700">
            {field.label}
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none ring-0 placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              required
            />
          </label>
        ))}

        <button
          className="mt-1 rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Employer'}
        </button>
      </form>

      {errorMessage && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 font-semibold text-red-700">
          Error: {errorMessage}
        </p>
      )}
    </section>
  )
}

export default EmployerForm
