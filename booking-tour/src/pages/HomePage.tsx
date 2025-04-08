
import { Helmet } from "react-helmet";
import TourNew from "../components/Tour2025";
import Border from "../components/boder";
const HomePage = () => {
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Home Page</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <div className="mt-[590px]">
                <TourNew />
            </div>
            <div>
                <Border />
                
            </div>
        </>
    );
};
export default HomePage;