import { type FC } from "react";
import { BrowserRouter,Routes, Route} from 'react-router-dom';
// import Login from "./Login/Login";
import MainLayout from "../layouts/MainLayout/MainLayout";
// import {useAuth} from "../hooks/auth";
// import DashBoard from "./Dashboard/Dashboard";
import DarkModeButton from "../components/DarkModeButton/DarkModeButton";
import DashBoard from "./Dashboard/Dashboard";
import { useAuth } from "../hooks/auth";
import Login from "./Login/Login";

interface PagesProps {}

const Pages: FC<PagesProps> = () => {
    const {auth} = useAuth({})
    return (<>
    {
        auth.Authorization ? 
        (
            <div className="
                overflow-x-hidden
                transition 
                ease-linear 
                duration-500 
                text-light-colors-text 
                dark:text-dark-colors-text 
                bg-light-colors-dashboard-primary-bg 
                dark:bg-dark-colors-dashboard-primary-bg
                ">
                    <div className="h-[screen] w-screen">
                        <MainLayout>
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/dashboard" element={<DashBoard/>}/>
                                </Routes>
                            </BrowserRouter>
                        </MainLayout>
                    </div>  
                    <DarkModeButton/>
            </div>
        ):(
            <Login/>
        )
    }
    </>);
};

export default Pages;
