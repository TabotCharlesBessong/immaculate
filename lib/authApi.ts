const FAKE_LATENCY = 1500 // 1.5 seconds

interface User {
  id: string
  email: string
}

// In-memory "database"
const users: User[] = [{ id: '1', email: 'test@example.com' }]

export const authApi = {
  login: async (
    email: string,
    pass: string
  ): Promise<{ token: string; user: User }> => {
    console.log(`Attempting login for ${email} with password ${pass}`) // Pass is unused in mock
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        )
        if (user) {
          console.log('Login successful')
          const fakeToken = `fake-jwt-token-for-${user.id}`
          resolve({ token: fakeToken, user })
        } else {
          console.log('Login failed: User not found')
          reject(new Error('Invalid email or password.'))
        }
      }, FAKE_LATENCY)
    })
  },

  register: async (
    email: string,
    pass: string
  ): Promise<{ token: string; user: User }> => {
    console.log(`Attempting registration for ${email} with password ${pass}`)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
          console.log('Registration failed: Email already exists')
          reject(new Error('An account with this email already exists.'))
        } else {
          const newUser: User = {
            id: String(Math.random()),
            email,
          }
          users.push(newUser)
          const fakeToken = `fake-jwt-token-for-${newUser.id}`
          console.log('Registration successful')
          resolve({ token: fakeToken, user: newUser })
        }
      }, FAKE_LATENCY)
    })
  },

  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Logout successful')
        resolve()
      }, 500)
    })
  },
}
