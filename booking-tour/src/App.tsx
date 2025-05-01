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
import UserList from './pages/AdminPages/UserList'
import UserInfoPage from './pages/UserPages/UserInfoPage'
import ViewUser from './pages/AdminPages/ViewUser'
import TourMienBacPage from './pages/TourMienBacPage/TourMienBacPage'
import TourDetailPage from './pages/TourDetailPage/TourDetailPage'
import TourMienTrungPage from './pages/TourMienTrungPage/TourMienTrungPage'
import TourMienNamPage from './pages/TourMienNamPage/TourMienNamPage'
import TourPage from './components/TourPage/TourPages'
import TravelDestinationsDetail from './pages/PageTravelDestinations/TravelDestinationsDetail'
import CustomerInfoForm from './pages/CustomerInfoForm/CustomerInfoForm'
import PassengerInformation from './pages/PassengerInformation/PassengerInformation'
import PaymentPage from './pages/PaymentPage/PaymentPage'
import SuccessPaymentPage from './pages/SuccessPaymentPage/SuccessPaymentPage'
import AdminBookingsPage from './pages/AdminPages/AdminBookingsPage'
import BookingDetailPage from './pages/AdminPages/BookingDetailPage'
import SearchResults from './pages/SearchResults/SearchResults'
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
            <Route path="/tour-mien-bac" element={<TourMienBacPage />} />
            <Route path="/tour/:id" element={<TourDetailPage />} />
            <Route path="/dat-tour/:id" element={<CustomerInfoForm />} />
            <Route path="/passenger-info/:id" element={<PassengerInformation />} />
            <Route path="/thanh-toan/:id" element={<PaymentPage />} />
            <Route path="/hoan-tat/:id" element={<SuccessPaymentPage />} />
            <Route path="/tour/:region/:item" element={<TourPage />} />
            <Route path="/tour-mien-trung" element={<TourMienTrungPage />} />
            <Route path="/tour-mien-nam" element={<TourMienNamPage />} />
            <Route path="/:slug" element={<TravelDestinationsDetail />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>
          <Route path="/users/:id" element={<UserInfoPage />} />
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="tours" element={<TourManagement />} />
            <Route path="users" element={<UserList />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="/admin/bookings/view/:id" element={<BookingDetailPage />} />
            <Route path="users/view/:id" element={<ViewUser />} />
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
