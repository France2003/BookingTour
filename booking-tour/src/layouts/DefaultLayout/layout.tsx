import { Outlet } from "react-router-dom";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
const DefaultLayout = () => {
    console.log("DefaultLayout");
    return (
        <div className="container mx-auto">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default DefaultLayout;