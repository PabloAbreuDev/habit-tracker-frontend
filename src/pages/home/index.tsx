import { useContext } from "react"
import { Navigate, useNavigate, } from "react-router-dom"
import { AuthContext, DefaultAuthValue } from "../../context/auth"

const Home: React.FC = () => {
    const navigate = useNavigate()
    const { user, doLogout } = useContext(AuthContext) as DefaultAuthValue
    return <>Home {user?.email} <button onClick={() => doLogout()}>Logout</button></>
}

export default Home