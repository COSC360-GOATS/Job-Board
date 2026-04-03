import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bcrypt from 'bcryptjs'

function RegisterForm() {
  const navigate = useNavigate()
  const [accountType, setAccountType] = useState('Applicant')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAccountTypeChange = (type) => {
    setAccountType(type)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const endpoint = accountType === 'Applicant' ? '/api/applicants' : '/api/employers'
      
      // Hash password
      const hashedPassword = await bcrypt.hash(formData.password, 10)
      
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: hashedPassword,
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const rawBody = await response.text()
      let payload_response = null

      if (rawBody) {
        try {
          payload_response = JSON.parse(rawBody)
        } catch {
          throw new Error('Server returned a non-JSON response.')
        }
      }

      if (!response.ok) {
        throw new Error(payload_response?.message || 'Registration failed')
      }

      localStorage.setItem('user', JSON.stringify(payload_response))
      navigate(accountType === 'Applicant' ? '/applicant' : '/employer')
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during registration')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-white p-5">
      <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-md text-center">
        <div className="flex justify-center mb-8">
          <svg className="w-16 h-16 text-purple-200 stroke-purple-300" viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>

        <h1 className="text-3xl font-semibold mb-10 text-gray-800">Create an Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all"
          />

          <div className="flex gap-3 mt-6 mb-6">
            <button
              type="button"
              onClick={() => handleAccountTypeChange('Applicant')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                accountType === 'Applicant'
                  ? 'bg-gray-800 text-white border-2 border-gray-800'
                  : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-purple-500 hover:text-purple-500'
              }`}
            >
              Applicant
            </button>
            <button
              type="button"
              onClick={() => handleAccountTypeChange('Employer')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                accountType === 'Employer'
                  ? 'bg-gray-800 text-white border-2 border-gray-800'
                  : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-purple-500 hover:text-purple-500'
              }`}
            >
              Employer
            </button>
          </div>

          {errorMessage && (
            <div className="bg-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-linear-to-r from-purple-500 to-purple-700 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4"
          >
            {isSubmitting ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-purple-500 font-semibold hover:text-purple-700 hover:underline cursor-pointer transition-colors">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  )
}

export default RegisterForm
