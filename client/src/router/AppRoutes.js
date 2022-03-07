import {Route, Routes} from 'react-router-dom'
import {RecommendationsPage, ProfilePage} from '../pages/index.pages'
import React from "react";


export const AppRoutes = () => (

    <Routes>

        <Route path='/' element={<RecommendationsPage/>}/>
        <Route path="*" element={<RecommendationsPage />} />
        <Route path='/profile' element={<ProfilePage/>}/>>
        <Route path='/profile/:id' element={<ProfilePage /> }/>>
    </Routes>

)
