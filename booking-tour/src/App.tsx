import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import RouteSignIn from './layouts/LayoutLogin/LayoutLogin'
import Login from './pages/Login/Login'
import RouteRegister from './layouts/LayoutRegister/LayoutRegister'
import Register from './pages/Register/Register'
import DefaultLayout from './layouts/DefaultLayout/layout'
import HomePage from './pages/HomePage'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from './layouts/LayoutAdmin'
import AdminDashboard from './pages/AdminPages/AdminDashboard'
import TourManagement from './pages/AdminPages/TourManagers'
import AddTourForm from './pages/AdminPages/AddTourForm'
import EditTourForm from './pages/AdminPages/EditTourForm'
import ViewTour from './pages/AdminPages/ViewTour'
function App() {
  return (
    <>
    <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Login and Register */}
          <Route path='/login' element={<RouteSignIn />}>
            <Route path='login' element={<Login url={`login`} />} />
          </Route>
          <Route path='/register' element={<RouteRegister />}>
            <Route path='register' element={<Register url={`register`} />} />
          </Route>
          <Route path='/' element={<DefaultLayout />}>
            <Route index element={<HomePage />}/>  
          </Route>
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="tours" element={<TourManagement />} />
            <Route path="tours/add" element={<AddTourForm />} />
            <Route path="tours/view/:id" element={<ViewTour/>} />
            <Route path="tours/edit/:id" element={<EditTourForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App
