'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserContext } from '../../context/UserContext'
export default function RecentHistories() {
    const [histories, setHistories] = useState([])
    const {userLogged} = useUserContext()

    const router = useRouter()
    useEffect(() => {
        const token = localStorage.getItem('token')

           
        if (!token) {
            router.push('/')
            return
        }
        
        const fetchHistories = async () => {
            try {
                const response = await fetch('https://just-write-it.onrender.com/histories')
                const data = await response.json()

                setHistories(data)
            } catch (error) {
                console.error('Error fetching histories:', error)
            }
        }
        
        
        fetchHistories()
    }, []) 

    return (
        <div className='flex flex-row justify-start items-cente py-10 mt-2'>
        <div className='max-w-[1250px] m-auto'>
            {userLogged ? (
                <ul className='flex gap-2 flex-wrap mt-5'>
                    {histories.slice(0,8).map((history) => (
                        <li 
                            key={history._id} 
                            className='p-4 rounded-xl bg-orange-400 text-white font-sans cursor-pointer' 
                            onClick={() => router.push(`/make-history/${history._id}`)}
                        >
                            <h2>{history.title}</h2>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className='m-3 text-center'>You cannot Contribute to histories you may <span className='text-orange-500 cursor-pointer' onClick={() => {router.push('/login')}}>Sign in</span></p>
            )}
        </div>
        </div>
    )
}
