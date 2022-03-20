import {Route, Routes} from 'react-router-dom'
import {AdminPage, NotFoundPage, ProfilePage, RecommendationsPage, SearchPage} from '../components/index.components'
import React from "react";


export const AppRoutes = () => (

    <Routes>
        <Route path='/' element={<RecommendationsPage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/profile/:id' element={<ProfilePage/>}/>
        <Route path='/search' element={<SearchPage/>}/>
        <Route path='/admin' element={<AdminPage/>}/>>
    </Routes>

)
