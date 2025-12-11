import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@fortawesome/fontawesome-free/css/all.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Menu from './components/Menu/Menu.jsx';
import Reservation from './components/Reservation/Reservation.jsx';
import Contact from './components/Contact/Contact.jsx';
import UserDashBoard from './components/Login/UserDashBoard.jsx';
import Login from './components/Login/Login.jsx';
import SignUp from './components/Login/SignUp.jsx'
import Account from './components/Account/Account.jsx';
import Layout from './components/Layout/Layout.jsx';
import Cart from './components/Cart/Cart.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Menu />
      },
      {
        path: "reservation",
        element: <Reservation />
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "dashboard",
        element: <UserDashBoard />
      },
      {
        path: "account",
        element: <Account />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "signup",
        element: <SignUp />
      },
      {
        path: "cart",
        element: <Cart/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
