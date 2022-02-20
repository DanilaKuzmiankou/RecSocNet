import {Auth0Provider} from '@auth0/auth0-react'
import {Children} from '../types/index.d'
import {useNavigate} from "react-router-dom";


const Auth0ProviderWithNavigate = ({children}: Children) => {
    const navigate = useNavigate()


    const onRedirectCallback =  (appState: { returnTo?: string }) => {
        //the path to redirect is specified in the `returnTo` property
        // by default the user is returned to the current page
        navigate(appState?.returnTo || window.location.pathname)
    }


    return (
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
            audience={process.env.REACT_APP_AUTH0_AUDIENCE}
            redirectUri={window.location.origin}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    )
}


export default Auth0ProviderWithNavigate