'use client'
import { useUserContext } from '../../context/UserContext'
import { useRouter } from 'next/navigation'
export default function Write() {
    const {userLogged} = useUserContext()
    const router = useRouter()
    return(
        <>
        {userLogged ? (
        <div className=' bg-white p-4 py-10 mt-2'>
        <div className='max-w-[1250px] m-auto'>
            <p className='font-extralight text-xl lg:text-3xl'>Welcome <span className='font-normal text-orange-500'>{userLogged}</span> Wanna write today?</p>
            <div className='p-2 border rounded-xl border-gray-300 w-fit text-gray-400 mt-4 cursor-pointer' onClick={() => {router.push('history-maker')}}>
                <p className='mr-14 text-sm lg:text-lg'>The amazing world of spider-man</p>
            </div>
            </div>
            </div>
        ):(
        <p></p>
        )}
        </>
    )
}