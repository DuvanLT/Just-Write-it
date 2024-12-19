'use client'
import { useState, createContext, useContext, useEffect } from "react"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [userInitial, setUserInitial] = useState(null)
  const [userLogged, setUserLogged] = useState(null)
  const [color, setColor] = useState('#1C1C1C')
  const colors = ['#40E0D0', '#DA70D6', '#FFD700','#50C878','#D4553A','#101010']

  const changeColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    setColor(colors[randomIndex])
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const username = payload?.username || 'User'
        setUserLogged(username)
        setUserInitial(username.charAt(0).toUpperCase())
        changeColor()
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])


  const login = (token) => {
    localStorage.setItem('token', token)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const username = payload?.username || 'User'
      setUserLogged(username)
      setUserInitial(username.charAt(0).toUpperCase())
      changeColor()
    } catch (error) {
      console.error('Error decoding token:', error)
    }
  }


  const logout = () => {
    localStorage.removeItem('token')
    setUserLogged(null)
    setUserInitial(null)
    setColor('#000000')
  }



  return (
    <UserContext.Provider value={{ userInitial, userLogged, color, setUserInitial, setUserLogged,login,logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)
