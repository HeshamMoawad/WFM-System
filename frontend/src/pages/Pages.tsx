import { type FC } from "react";
import Login from "./Login/Login";
import DarkModeButton from "../components/DarkModeButton/DarkModeButton";
import MainLayout from "../layouts/MainLayout/MainLayout";
// import { AuthContext } from "../hooks/auth";

interface PagesProps {}

const Pages: FC<PagesProps> = () => {
    // const {auth} = useContext(AuthContext)
    return (
        <div className="transition ease-linear duration-500 text-light-colors-text dark:text-dark-colors-text bg-light-colors-dashboard-primary-bg dark:bg-dark-colors-dashboard-primary-bg">
            <div className="h-screen w-screen">
                <MainLayout>
                </MainLayout>
                {/* <Login/> */}
            </div>  
            
            <DarkModeButton/>
        </div>
    );
};

export default Pages;
