'use client'
import { useRouter,useParams } from "next/navigation"
import { useUserContext } from "../../../context/UserContext"
import { useState,useEffect } from "react"
import {jwtDecode} from "jwt-decode"

export default function Config() {
  const router = useRouter()
  const { userLogged, logout,color} = useUserContext()
  const [message,setMessage] = useState('')
  const [histories,setHistories] = useState([])
  const {user} = useParams()

  const deleteHistory = async (id) => {
    const token = localStorage.getItem("token")
  
    if (!token) {
      router.push('/login')
      return
    }
  
    try {
      const response = await fetch(`https://just-write-it.onrender.com/delete-history/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`, 
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage('History deleted successfully!')
        setHistories((prevHistories) =>
          prevHistories.filter((history) => history._id !== id)
        )
      } else {
        setMessage(data.error || "Error deleting the history.")
      }
    } catch (error) {
      setMessage('Cannot delete the history')
    }
  }
  
  const deleteAccount = async () => {
    const token = localStorage.getItem("token")
    const decodedToken = jwtDecode(token)
    const userId = decodedToken.id
  
    if (!token) {
      router.push('/login')
      return
    }
  
    try {
      const response = await fetch(`https://just-write-it.onrender.com/delete-account/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`, 
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        logout()
        router.push('/')
      } else {
        setMessage(data.error || "Error deleting the account.")
      }
    } catch (error) {
      setMessage('Cannot delete the account')
    }
  }


  const changeStatus = async (id) => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push('/login')
      return;
    }

    try {
      
      const response = await fetch(`https://just-write-it.onrender.com/history/${id}/change-status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`, 
        },
    })
    const data = await response.json()

    if(response.ok){
      setMessage('Status updated successfully!')
    }else{
      setMessage(data.error || "Error changing the status.")
    }
    } catch (error) {
          setMessage("Error changing the status.")
    }
  }

  const fetchHistoriesByAuthor = async () => {
    if (user) {
      try {
        const token = localStorage.getItem("token")
  
        if (!token) {
            router.push('/login')
          return;
        }
  
        const response = await fetch(`https://just-write-it.onrender.com/myhistories/${user}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, 
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setHistories(data.histories);
        } else {
          setMessage(data.error || "Error fetching your histories.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setMessage("Error fetching your histories.");
      }
    }
  };
  

  useEffect(() => {
    fetchHistoriesByAuthor()
  },[user])

  

  return (
    <main className="max-w-[740px] m-auto mt-10 px-4">
      <div className="sesion text-white p-3 rounded-lg"  style={{ backgroundColor: color }}>
        {userLogged ? (
          <div className="flex gap-2 justify-between items-center">
            <span className="text-xl font-extralight">{userLogged}</span>
            <span
              onClick={() => { 
                logout()
                router.push('/')
              }}
              className="cursor-pointer p-2 bg-white text-black rounded-xl"
            >
              Logout
            </span>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div>
        <h2 className="mt-10 text-center text-2xl">My Histories</h2>
      </div>
      {histories.length > 0 ? (
        <ul className="">
          {histories.map((history) => (
            <li key={history._id} className="text-black text-xl p-4 my-4 rounded-lg flex items-center justify-between" style={{ backgroundColor: color }}
            >
              <h5 onClick={() => router.push(`/make-history/${history._id}`)} className="cursor-pointer bg-white  p-2 rounded-xl font-sm lg:font-normal">Title: {history.title}</h5>
              <div className="flex gap-2 items-center">
              <h6 
              className="bg-white p-2 rounded-xl cursor-pointer font-sm lg:font-normal" 
              onClick={async () => {
                await changeStatus(history._id)
                setHistories((prevHistories) =>
                  prevHistories.map((h) =>
                    h._id === history._id
                      ? { ...h, status: h.status === "completed" ? "in progress" : "completed" }
                      : h
                  )
                )
              }}
            >{history.status}</h6>
              <span className=" bg-white p-2 ml-1 rounded-lg cursor-pointer" onClick={() => {deleteHistory(history._id)}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="25" viewBox="0 0 24 24"><path fill="none" stroke="#dc2626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></svg>
              </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No histories found for this user.</p>
      )}
      <h2 className="mt-10 text-center text-2xl">Danger zone</h2>
      <button className="bg-red-500 text-white p-4 rounded-xl my-10" onClick={() => {deleteAccount()}}>Delete account</button>

      {message && <p className="mt-6 text-center text-red-500">{message}</p>}
    </main>
  )
}
