import {createBrowserRouter,Navigate} from 'react-router-dom';
import Landing from './views/landing.jsx';
import Login from './views/login.jsx';
import Signup from './views/signup.jsx';
import Users from './views/users.jsx';
import NotFound from './views/notFound.jsx';
import Dashboard from './views/dashboard.jsx';
import DefaultLayout from './components/DefaultLayout.jsx';
import GuestLayout from './components/GuestLayout.jsx';
import RestaurantInfo from './views/RestaurantInfo';


const router = createBrowserRouter([
    {
        path: '/',
        element : <DefaultLayout />,
        children: [
            {
                path: '/',
                element : <Navigate to ="/users" />
            },
            {
                path: '/dashboard',
                element : <Dashboard />
            },
            {
                path: '/users',
                element : <Users />
            },
            {
                path: '/restaurants/:id', // Define the route for restaurant information
                element: <RestaurantInfo />,
            },
        ]
    },
    {
        path: '/',
        element : <GuestLayout />,
        children : [
            {
                path: '/',
                element : <Navigate to ="/landing" />
            },
            {
                path: '/landing',
                element : <Landing />
            },
            {
                path: '/login',
                element : <Login />
            },
            {
                path: '/signup',
                element : <Signup />
            },

        ]
    },
    {
        path: '*',
        element : <NotFound />
    }

])

export default router;