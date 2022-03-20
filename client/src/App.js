import React, {useEffect, useMemo, useState} from "react";
import {AppRoutes} from './router/AppRoutes'
import {CustomNav, LoadingComponent} from "./components/index.components"
import {useRegisterNewUser} from "./auth/useRegisterNewUser";


const App = () => {

    const {isLoadingCompleted} = useRegisterNewUser()

    return (
      <div>
          {isLoadingCompleted ?
          <div>
                  <CustomNav/>
                  <AppRoutes/>
          </div>
              :
              <LoadingComponent />
              }
      </div>
  );
}

export default App;
