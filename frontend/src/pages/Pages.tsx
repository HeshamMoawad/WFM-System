import { type FC } from "react";
import { BrowserRouter,Routes, Route} from 'react-router-dom';
import MainLayout from "../layouts/MainLayout/MainLayout";
import DarkModeButton from "../components/DarkModeButton/DarkModeButton";
import DashBoard from "./Dashboard/Dashboard";
import { useAuth } from "../hooks/auth";
import Login from "./Login/Login";
import Requests from "./Requests/Requests";
import Profile from "./Profile/Profile";
import AddUser from "./AddUser/AddUser";
import AttendanceDetails from "./AttendanceDetails/AttendanceDetails";
import UsersList from "./UsersList/UsersList";
import Treasury from "./Treasury/Treasury";
import EditUser from "./EditUser/EditUser";
import Advances from "./Advances/Advances";

interface PagesProps {}

const Pages: FC<PagesProps> = () => {
    // const {auth} = useAuth();
    return (<>
            <div className={`
                overflow-x-hidden
                transition 
                ease-linear 
                duration-500 
                text-light-colors-text 
                dark:text-dark-colors-text 
                bg-light-colors-dashboard-primary-bg 
                dark:bg-dark-colors-dashboard-primary-bg
                `}>
                    <div className={``}>
                        <BrowserRouter>
                            
                                    <Routes>
                                        <Route path="/login" element={<Login/>}/>
                                    </Routes>
                                    
                                    <MainLayout>
                                        <Routes>
                                            <Route path="/" element={<DashBoard/>}/>
                                            <Route path="/dashboard" element={<DashBoard/>}/>
                                            <Route path="/requests" element={<Requests/>}/>
                                            <Route path="/profile" element={<Profile/>}/>
                                            <Route path="/add-user" element={<AddUser/>}/>
                                            <Route path="/edit-user/:user_uuid" element={<EditUser/>}/>
                                            <Route path="/users-list" element={<UsersList/>}/>
                                            <Route path="/attendance-details" element={<AttendanceDetails/>}/>
                                            <Route path="/treasury" element={<Treasury/>}/>
                                            <Route path="/advances" element={<Advances/>}/>
                                        </Routes>
                                    </MainLayout>
                            
                        </BrowserRouter>
                    </div>  
                    <DarkModeButton/>
            </div>
    </>
    );
};

export default Pages;
