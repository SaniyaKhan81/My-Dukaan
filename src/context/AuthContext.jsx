import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [registeredEmails, setRegisteredEmails] = useState(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem('registeredEmails')
    return stored ? JSON.parse(stored) : []
  })

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  // Save registered emails to localStorage
  useEffect(() => {
    localStorage.setItem('registeredEmails', JSON.stringify(registeredEmails))
  }, [registeredEmails])

  const signup = (userData) => {
    // Check if email already exists
    if (registeredEmails.includes(userData.email)) {
      throw new Error('This email is already in use. Please use a different email or login.')
    }

    // Add email to registered list
    setRegisteredEmails([...registeredEmails, userData.email])

    // Create user object
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      studentId: userData.studentId,
      createdAt: new Date().toISOString(),
    }

    // Save user
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(newUser))

    return newUser
  }

  const login = (email, password) => {
    // Check if email is registered
    if (!registeredEmails.includes(email)) {
      throw new Error('Email not found. Please sign up first.')
    }

    // In a real app, you'd verify the password here
    // For now, we'll just check if email exists
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      if (user.email === email) {
        setUser(user)
        setIsAuthenticated(true)
        return user
      }
    }

    // If no stored user, create a temporary one
    const tempUser = {
      id: Date.now().toString(),
      email: email,
      name: email.split('@')[0], // Use email prefix as name
      createdAt: new Date().toISOString(),
    }
    setUser(tempUser)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(tempUser))
    return tempUser
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    isAuthenticated,
    signup,
    login,
    logout,
    registeredEmails,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


