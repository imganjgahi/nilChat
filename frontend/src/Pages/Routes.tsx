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
        <div>
            <h1>Nili Chat</h1>
            <BrowserRouter>
            <Routes>
                <Route path='/meeting/:meetingId' element={<MeetingRoom />} />
                <Route path='/' element={<Home />} />
            </Routes>
            </BrowserRouter>
        </div>
    )
}

export default MainRoutes