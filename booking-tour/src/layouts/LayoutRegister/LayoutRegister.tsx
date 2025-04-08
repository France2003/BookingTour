import Register from "../../pages/Register/Register";

const RouteRegister = () => {
    console.log("RouteSignIn");
  return (
    <div>
        <div className='container mx-auto'>
            <Register url={`register`}/>
        </div>
    </div>
  )
}
export default RouteRegister