'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { useUserContext } from '../../context/UserContext'

export default function Nav() {
  const router = useRouter()
  const [nav, setNav] = useState(false)
  const { userInitial, color, userLogged} = useUserContext()

  const handleClick = () => {
    setNav(!nav)
  }

  const handleMakeHistory = () => {
    handleClick()
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/history-maker')
    } else {
      router.push('/login')
    }
  }

  return (
    <>
      <header className="flex justify-between h-24 items-center z-40 bg-white border-b">
        <nav className="flex md:justify-between max-w-[1250px] m-auto w-screen items-center">
          <div className="text-black text-lg md:text-xl font-semibold italic z-50 flex items-center ml-4 lg:ml-0">
            <Link href="/" className="z-50">Just Write It </Link>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><g fill="none" stroke="#ea580c" strokeLinejoin="round" strokeWidth="4"><path d="M5.325 43.5h8.485l31.113-31.113l-8.486-8.485L5.325 35.015z"/><path strokeLinecap="round" d="m27.952 12.387l8.485 8.485"/></g></svg>
          </div>
          <ul className={`flex flex-col justify-center items-center absolute bg-white w-screen h-screen z-50 gap-4 text-xl md:text-lg transition-all duration-300 md:flex-row md:relative md:w-fit md:h-fit ${nav ? "closeNav" : "openNav"}`}>
            <li>
              <Link href="/" onClick={handleClick} className="hover:text-orange-500 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -2 24 24"><path fill="#ea580c" d="M18 18V7.132l-8-4.8l-8 4.8V18h4v-2.75a4 4 0 1 1 8 0V18zm-6 2v-4.75a2 2 0 1 0-4 0V20H2a2 2 0 0 1-2-2V7.132a2 2 0 0 1 .971-1.715l8-4.8a2 2 0 0 1 2.058 0l8 4.8A2 2 0 0 1 20 7.132V18a2 2 0 0 1-2 2z"/></svg>
                Home
              </Link>
            </li>
            <li onClick={handleMakeHistory} className="cursor-pointer hover:text-orange-500 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#ea580c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" color="#ea580c"><path d="M10.55 3c-3.852.007-5.87.102-7.159 1.39C2 5.783 2 8.022 2 12.5s0 6.717 1.391 8.109C4.783 22 7.021 22 11.501 22c4.478 0 6.717 0 8.108-1.391c1.29-1.29 1.384-3.307 1.391-7.16"/><path d="M11.056 13C10.332 3.866 16.802 1.276 21.98 2.164c.209 3.027-1.273 4.16-4.093 4.684c.545.57 1.507 1.286 1.403 2.18c-.074.638-.506.95-1.372 1.576c-1.896 1.37-4.093 2.234-6.863 2.396"/><path d="M9 17c2-5.5 3.96-7.364 6-9"/></g></svg>
              Make History
            </li>
            {userLogged ? (
            <li></li>) : (
              <li>
                <Link href="/login" onClick={handleClick} className="hover:text-orange-500 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ea580c" d="M10.47 8.47a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H4a.75.75 0 0 1 0-1.5h8.19l-1.72-1.72a.75.75 0 0 1 0-1.06" opacity=".5"/><path fill="#ea580c" d="M11.768 3.25h2.464c.813 0 1.469 0 2 .043c.546.045 1.026.14 1.47.366a3.75 3.75 0 0 1 1.64 1.639c.226.444.32.924.365 1.47c.043.531.043 1.187.043 2v6.464c0 .813 0 1.469-.043 2c-.045.546-.14 1.026-.366 1.47a3.75 3.75 0 0 1-1.639 1.64c-.444.226-.924.32-1.47.365c-.531.043-1.187.043-2 .043h-2.464c-.813 0-1.469 0-2-.043c-.546-.045-1.026-.14-1.47-.366a3.75 3.75 0 0 1-1.64-1.639c-.226-.444-.32-.924-.365-1.47c-.043-.531-.043-1.187-.043-2V15a.75.75 0 0 1 1.5 0v.2c0 .852 0 1.447.038 1.91c.037.453.107.714.207.912c.216.423.56.767.984.983c.197.1.458.17.912.207c.462.037 1.056.038 1.909.038h2.4c.853 0 1.447 0 1.91-.038c.453-.038.714-.107.912-.207a2.25 2.25 0 0 0 .983-.983c.1-.198.17-.459.207-.913c.037-.462.038-1.057.038-1.909V8.8c0-.852 0-1.447-.038-1.91c-.038-.453-.107-.714-.207-.911a2.25 2.25 0 0 0-.983-.984c-.198-.1-.459-.17-.913-.207c-.462-.037-1.057-.038-1.909-.038h-2.4c-.853 0-1.447 0-1.91.038c-.453.037-.714.107-.911.207a2.25 2.25 0 0 0-.984.984c-.1.197-.17.458-.207.912c-.037.462-.038 1.057-.038 1.909V9a.75.75 0 0 1-1.5 0v-.232c0-.813 0-1.469.043-2c.045-.546.14-1.026.366-1.47a3.75 3.75 0 0 1 1.639-1.64c.444-.226.924-.32 1.47-.365c.531-.043 1.187-.043 2-.043"/></svg>
                Sign In
              </Link>
              </li>
            )}
            {userInitial ? (
              <li 
                onClick={() => {router.push(`/user-config/${userLogged}`); handleClick()}}
                style={{ backgroundColor: color }}
                className="py-2 px-4 rounded-full text-white cursor-pointer mr-4 lg:mr-2" 
              >
                {userInitial}
              </li>
            ) : (<li className=""></li>)}
          </ul>
        </nav>
        <div className="menu block text-black z-50 m-8 cursor-pointer mr-4 lg:mr-2  md:hidden" onClick={handleClick}>
          <div className="h-1 w-10 bg-black rounded"></div>
          <div className="h-1 w-10 mt-1.5 bg-black rounded"></div>
          <div className="h-1 w-10 mt-1.5 bg-black rounded"></div>
        </div>
      </header>
    </>
  )
}
