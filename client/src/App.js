import './App.css';
import React from "react";
import {BrowserRouter} from "react-router-dom";
import Auth0ProviderWithNavigate from "./auth/Auth0ProviderWithNavigate";
import {AppRoutes} from './router/AppRoutes'

function App() {
  return (
      <BrowserRouter>
          <div className='app'>
              <Auth0ProviderWithNavigate>
                  <AppRoutes/>
              </Auth0ProviderWithNavigate>
          </div>
      </BrowserRouter>
  );
}

export default App;
