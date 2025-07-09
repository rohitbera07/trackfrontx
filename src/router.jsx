import {createBrowserRouter} from 'react-router-dom'
import App from './pages/App'


import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDash from './pages/UserDash';
import ProjectDash from './pages/ProjectDash';
const router = createBrowserRouter([
    {
        path:'/',
        element:<App/>
    },
    {
        path:'/login',
        element: <Login/>
    },
    {
        path:'/signup',
        element: <Signup/> 
    },{
        path:'/userdash',
        element:<UserDash/>
    },{
        path:'/projects/:projectId',
        element:<ProjectDash/>
    }
]);

export default router;