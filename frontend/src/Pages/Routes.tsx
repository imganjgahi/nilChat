import React from 'react'
import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom";
import Home from './Home'
import MeetingRoom from './MeetingRoom';

function MainRoutes() {
    return (
            <BrowserRouter>
            <Routes>
                <Route path='/meeting/:meetingId' element={<MeetingRoom />} />
                <Route path='/' element={<Home />} />
            </Routes>
            </BrowserRouter>
    )
}

export default MainRoutes