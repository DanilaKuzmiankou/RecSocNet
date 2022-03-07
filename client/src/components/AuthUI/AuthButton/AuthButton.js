import {useAuth0} from '@auth0/auth0-react'
import LogoutButton from "../LogOutButton/LogOutButton";
import LogInButton from "../LogInButton/LogInButton";

export const AuthButton = () => {
    const {isAuthenticated} = useAuth0()

    return isAuthenticated ? <LogoutButton/> : <LogInButton/>
}
export default AuthButton;