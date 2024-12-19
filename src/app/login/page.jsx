'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useUserContext } from "../../context/UserContext"
export default function Login() {
    const router = useRouter()
    const {login} = useUserContext()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message,setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:7000/signin',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                
                
            }) 
            const data = await response.json()

            if (response.ok) {
                login(data.token) 
                router.push('/')  
              } else {
                setMessage(data.error)
              }
        } catch (error) {
            setMessage('Error de conexion. Intenta nuevamente.')
        }
      
    }

   return(
    <>
    <form action="" onSubmit={handleSubmit} className="flex flex-col items-center gap-2 mt-32">
        <h2 className="text-2xl font-bold text-orange-500 mb-2">SIGN IN</h2>
        <label htmlFor="username" className="font-bold">Usarname</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} name="username" id="username" placeholder="Lord Farquaad" className="border p-2 border-black" required />
        <label htmlFor="password" className="font-bold">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" id="password" placeholder="password" className="border p-2 border-black" required />
        <button type="submit" className="bg-orange-600 px-8 py-2 font-sans text-white hover:bg-orange-700 transition-all duration-300">Login</button>
    <p>any account? <span className="text-orange-600 cursor-pointer" onClick={() => router.push('register')}>Create one</span></p>
    {message && <p>{message}</p>}
    </form>
    </>
   ) 
}