import useAuth from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

export const BlockLogin = () => {
    const {loggedIn, role} = useAuth()

    return(
        loggedIn? <Navigate to={`${role}/home`}/> : <Outlet /> 
    )
}