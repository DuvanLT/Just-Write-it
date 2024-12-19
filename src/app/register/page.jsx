'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Signup() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch('https://just-write-it.onrender.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage('Usuario creado con éxito.')
                router.push('/login')
            } else {
                setMessage(data.error)
            }
        } catch (error) {
            setMessage('Error de conexión. Intenta nuevamente.')
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 mt-32">
                <h2 className="text-2xl font-bold text-orange-500 mb-2">SIGN UP</h2>
                <label htmlFor="username" className="font-bold">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    name="username"
                    id="username"
                    maxLength={18}
                    placeholder="Your Username"
                    className="border p-2 border-black"
                    required
                />
                <label htmlFor="password" className="font-bold">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="border p-2 border-black"
                    minLength={8}
                    required
                />
                <button type="submit" className="bg-orange-600 px-8 py-2 font-sans text-white hover:bg-orange-700 transition-all duration-300">
                    Sign Up
                </button>
                {message && <p>{message}</p>}
            </form>
        </>
    )
}
