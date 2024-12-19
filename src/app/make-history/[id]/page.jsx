'use client'
import { useState, useEffect } from 'react'
import { useParams,useRouter } from 'next/navigation'

export default function MakeHistory() {
  const router = useRouter()
  const [history, setHistory] = useState({ title: '', content: [], text: '', author: '' })
  const [message, setMessage] = useState('')
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  const fetchHistory = async () => {
    if (id) {
      try {
        const response = await fetch(`https://just-write-it.onrender.com/history/${id}`)
        const data = await response.json()

        if (response.ok) {
          const combinedText = data.content.map((item) => item.text).join('\n\n')

          setHistory({
            title: data.title || '',
            content: data.content || [],
            text: combinedText,
            author: data.author?.username || 'Anonimo',
          })
          setTitle(data.title || '')
        } else {
          setMessage('Historia no encontrada')
        }
      } catch (error) {
        setMessage('Error al cargar la historia.')
      }
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!text) {
      setMessage('Por favor, ingresa un texto')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('No tienes acceso. Por favor, inicia sesión.')
      localStorage.removeItem('token')  
      router.push('/')
      return
    }

    try {
      const response = await fetch(`https://just-write-it.onrender.com/history/${id}/add-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, title }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Contenido agregado con éxito');
        setText('')
        setHistory((prev) => {
          const updatedContent = [...prev.content, { text, author: prev.author }] // Agregamos el nuevo contenido al array
          const updatedText = updatedContent.map((item) => item.text).join('\n\n') // Volver a crear el texto combinado

          return {
            ...prev,
            content: updatedContent, // Actualizamos el contenido
            text: updatedText, // Actualizamos el texto combinado
          }
        })
      }
      
    } catch (error) {
      setMessage('Error al conectar con el servidor.')
      router.push('/')
    }
  }

  return (
    <div className="max-w-[1250px] m-auto">
      <div className="mt-8 p-4">
        <h2 className="text-3xl font-semibold text-orange-500 mb-4">Preview History:</h2>
        <div className="mb-4">
          <p><strong className='text-orange-500'>Author:</strong> {history.author}</p>
        </div>
        <div className="flex">
          {history.content && history.content.length > 0 ? (
            <p className='font-sans'>{history.text + " " + text}</p>
          ) : (
            <p>No hay contenido disponible.</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 mt-14 w-full p-4">
        <div className="flex flex-col items-start w-full max-w-[800px]">
          <label htmlFor="title" className="text-left font-semibold mb-2 text-3xl">
            Title:
          </label>
          <input
            type="text"
            name="title"
            id="title"
            maxLength={30}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-solid border-black border w-full p-2.5"
          />
        </div>
        
        <div className="flex flex-col items-start w-full max-w-[800px]">
          <label htmlFor="text" className="text-left font-semibold mb-2 text-2xl">
            Add your History:
          </label>
          <textarea
            name="text"
            id="text"
            value={text}
            maxLength={150}
            onChange={(e) => setText(e.target.value)}
            className="border-solid border-black border w-full p-2.5 min-h-44"
          ></textarea>
        </div>

        <button type="submit" className="bg-orange-500 px-12 py-3 font-sans text-white mb-20">
          Agregar Contenido
        </button>
      </form>

      {message && <p className="mt-6 text-center text-red-500">{message}</p>}
    </div>
  )
}
