import React, {useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import Auth0ProviderWithNavigate from "./auth/Auth0ProviderWithNavigate";
import {AppRoutes} from './router/AppRoutes'
import {CustomNav} from "./components/index.components"

function App() {

    return (
      <BrowserRouter>
          <div>
              <Auth0ProviderWithNavigate>
                  <CustomNav/>
                  <AppRoutes/>
              </Auth0ProviderWithNavigate>
          </div>
      </BrowserRouter>
  );
}

export default App;
