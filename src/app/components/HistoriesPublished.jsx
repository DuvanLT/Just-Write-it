'use client'
import { useState, useEffect } from 'react'
import RecentHistories from './RecentHistories'

export default function HistoriesPublished() {
    const [histories, setHistories] = useState([])

    useEffect(() => {
        const fetchHistories = async () => {
            try {
                const response = await fetch('https://just-write-it.onrender.com/histories-published')
                const data = await response.json()

                if (response.ok) {
                    const processedHistories = data.map(history => ({
                        ...history,
                        text: history.content.map(item => item.text).join('\n\n'),
                        author: history.author?.username || 'Anónimo',
                    }));

                    setHistories(processedHistories)
                }
            } catch (error) {
                console.error('Error fetching histories:', error)
            }
        }
        fetchHistories()
    }, [])

    return (
        <div className='flex justify-center items-center flex-col bg-white p-4 mt-2'>
            <h2 className='font-extralight text-xl lg:text-3xl'>Histories to contribute</h2>
            <RecentHistories />
             <div className='max-w-[1250px] m-auto'>
            {histories.map(h => (
                <div key={h._id} className="py-4 border-2 bg-[#faf8f8]   p-4 my-4  min-w-[300px] max-w-[800px]">
                  <div className="flex justify-between">
                    <div className="">
                    <h2 className="text-xl font-bold">{h.title}</h2>
                    <span className="text-md text-gray-500">@{h.author}</span>
                    </div>
                    <span className='text-lg'>4h</span>
                  </div>
                    <div className="mt-4 font-sans">
                        {h.text}
                    </div>
                    <div className="flex gap-3 mt-4">
                    <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ea580c" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"/></svg>
                    Like
                    </div>
                    <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20"><path fill="#ea580c" d="M5 2h9c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2h-2l-5 5v-5H5c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2"/></svg>
                    Comment
                    </div>
                    <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 42 42"><path fill="#ea580c" d="M30.5 18.5v6l10-9.929L30.5 4.5v5c-15.3.1-15 15-15 15s5.45-7.49 15-6m-8-13h-19c-2.46 0-3 .7-3 3v24c0 2.49.6 3 3 3h29c2.41 0 3-.451 3-3v-8l-5 4.289V30.5h-25v-20h12z"/></svg>
                    Share
                    </div>
                    </div>
                </div>
            ))}
        </div>
        </div>
    )
}
