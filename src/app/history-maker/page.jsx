'use client';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function HistoryMaker() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        const token = localStorage.getItem('token')
    
        if (!token) {
            setMessage('No tienes acceso. Por favor, inicia sesión.')
            localStorage.removeItem('token')
            router.push('/')
            return;
        }
    
        try {
            const response = await fetch('https://just-write-it.onrender.com/protected', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.ok) {
                setMessage('No tienes acceso a esta ruta.')
                localStorage.removeItem('token')
                router.push('/')
                return;
            }
                const submitResponse = await fetch('https://just-write-it.onrender.com/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, 
                },
                body: JSON.stringify({ title, text }),
            });
    
            const data = await submitResponse.json()
    
            if (submitResponse.ok) {
                setMessage(data.message)
                setTitle('')
                setText('')
            } else {
                setMessage(data.error)
            }
        } catch (error) {
            setMessage('Error al conectar con el servidor. Inténtalo de nuevo.')
            router.push('/')
        }
    };
    
    return (
        <div className="max-w-[1250px] m-auto">
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 mt-10 w-full p-4">
            
                <div className="flex flex-col items-start w-full max-w-[800px]">
                    <label htmlFor="title" className="text-left font-semibold mb-2 text-3xl">
                        Title:
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        maxLength={20}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border-solid border-black border w-full p-2.5"
                        placeholder="The big Theory"
                    />
                </div>
                
                <div className="flex flex-col items-start w-full max-w-[800px]">
                    <label htmlFor="text" className="text-left font-semibold mb-2 text-2xl">
                        Make your History:
                    </label>
                    <textarea
                        name="text"
                        id="text"
                        value={text}
                        maxLength={200}
                        onChange={(e) => setText(e.target.value)}
                        className="border-solid border-black border w-full p-2.5 min-h-48"
                        placeholder="Había una vez..."
                    ></textarea>
                </div>
                
                <button type="submit" className="bg-orange-500 font-medium font-sans px-12 py-3 text-white">
                    Publicar
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
