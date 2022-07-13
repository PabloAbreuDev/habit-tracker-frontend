import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext, DefaultAuthValue } from "../../context/auth"
import { LoginStyled } from "./styled"

const Login: React.FC = () => {
    const { doLogin, logged, loginError } = useContext(AuthContext) as DefaultAuthValue

    const signIn = async () => {
        try {
            doLogin("agostinho.carrara@email.com", "123")

        } catch (err: any) {
            console.log(err.message)
        }
    }


    return logged ? <Navigate to="/home" /> : <LoginStyled>Login <button onClick={() => signIn()}>Logar</button>  {loginError}</LoginStyled>
}

export default Login