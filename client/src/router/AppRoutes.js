import {Route, Routes} from 'react-router-dom'
import {HomePage, ProfilePage} from '../pages/index.pages'
import React from "react";


export const AppRoutes = () => (

    <Routes>

        <Route path='/' element={<HomePage/>}/>
        <Route path="*" element={<HomePage />} />
        <Route path='/profile' element={<ProfilePage/>}/>>
        <Route path='/profile/:id' element={<ProfilePage /> }/>>
    </Routes>

)
