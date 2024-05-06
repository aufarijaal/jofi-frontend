import { AxiosError } from 'axios'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from '@/lib/axios'

type User = {
  id: number
  email?: string
  username?: string
  role: string
}

type SignIn = ({
  email,
  password,
}: {
  email: string
  password: string
}) => Promise<void | boolean>

type SignUp = ({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) => Promise<void>

type SignOut = (afterSignout?: () => void) => Promise<void>

type EmployerSignUp = ({
  name,
  email,
  password,
  companyId,
}: {
  name: string
  email: string
  password: string
  companyId: number
}) => Promise<void>

type AdminSignIn = ({
  username,
  password,
}: {
  username: string
  password: string
}) => Promise<void>

type GetUser = () => Promise<void>

interface AuthContextValue {
  signIn: SignIn
  signUp: SignUp
  signOut: SignOut
  employerSignIn: SignIn
  employerSignUp: EmployerSignUp
  adminSignIn: AdminSignIn
  user: User | undefined
  isLoading: boolean
  getUser: GetUser
}

export const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = React.useState<User>()
  const [loading, setLoading] = React.useState(true)

  const getUser: GetUser = async () => {
    try {
      setLoading(true)
      const result = await axios.get(`/account/me`)
  
      if (result.status === 200) {
        setUser(result.data.data)
      } else {
        console.log(`error occurred`)
        setUser(undefined)
      }
    } catch (error) {
      // console.log(error)
      throw error;
    } finally {
      setLoading(false)
    }
  }

  const signIn: SignIn = async ({ email, password }) => {
    try {
      const result = await axios.post(`/auth/signin`, { email, password })

      if (result.status === 200) {
        getUser()
        return true
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
    }
  }

  const employerSignIn: SignIn = async ({ email, password }) => {
    const result = await axios.post(`/employers/auth/signin`, {
      email,
      password,
    })

    if (result.status === 200) {
      getUser()
    }
  }

  const signUp: SignUp = async ({ name, email, password }) => {
    const result = await axios.post(`/auth/signup`, {
      name,
      email,
      password,
    })

    if (result.status < 400) {
      getUser()
    }
  }

  const employerSignUp: EmployerSignUp = async ({
    name,
    email,
    password,
    companyId,
  }) => {
    try {
    } catch (error) {
      console.error(error)

      if (error instanceof AxiosError) {
        console.log(error.response?.data.message)
      }
    }
  }

  const adminSignIn: AdminSignIn = async ({ username, password }) => {
    try {
    } catch (error) {
      console.error(error)

      if (error instanceof AxiosError) {
        console.log(error.response?.data.message)
      }
    }
  }

  const signOut: SignOut = async (afterSignout) => {
    try {
      await axios.post(`/auth/signout`)

      setUser(undefined)

      afterSignout?.()
    } catch (error) {
      console.error(error)

      if (error instanceof AxiosError) {
        console.log(error.response?.data.message)
      }
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        getUser,
        signIn,
        signUp,
        signOut,
        employerSignUp,
        adminSignIn,
        employerSignIn,
        isLoading: loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => React.useContext(AuthContext)
