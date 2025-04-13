import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import CustomCursor from "../../components/CustomCursor/CustomCursor";
import { useEffect, useState } from "react";
import Loader from "../../components/LoadingScreen/LoadingScreen"; // Import Loader component

const DefaultLayout = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 1200);
    return () => clearTimeout(timer); 
  }, [location]);

  console.log("DefaultLayout");
  return (
    <div className="container mx-auto">
      <CustomCursor />
      {loading && <Loader />}
      {!loading && (
        <>
          <Header />
          <main>
            <Outlet /> 
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default DefaultLayout;
