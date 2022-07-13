import { useContext } from "react"
import { Navigate } from "react-router-dom"

import { Outlet } from "react-router-dom"
import { AuthContext, DefaultAuthValue } from "../../context/auth"

const PrivateRoute = () => {
    const { logged } = useContext(AuthContext) as DefaultAuthValue

    return logged ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoute