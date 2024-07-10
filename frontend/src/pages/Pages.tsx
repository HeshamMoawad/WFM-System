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
import DevicesAccess from "./DevicesAccess/DevicesAccess";
import SalaryAll from "./SalaryAll/SalaryAll";
import Basic from "./Basic/Basic";
import UserBasic from "./UserBasic/UserBasic";
import CoinChanger from "./CoinChanger/CoinChanger";
import Leads from "./Leads/Leads";
import Notifications from "./Notifications/Notifications";
import Teams from "./Teams/Teams";
import NotFound from "./NotFound/NotFound";

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
                                            <Route path="/dashboard" element={<DashBoard/>}/>
                                            <Route path="/requests" element={<Requests/>}/>
                                            <Route path="/profile" element={<Profile/>}/>
                                            <Route path="/add-user" element={<AddUser/>}/>
                                            <Route path="/edit-user/:user_uuid" element={<EditUser/>}/>
                                            <Route path="/users-list" element={<UsersList/>}/>
                                            <Route path="/devices-access" element={<DevicesAccess/>}/>
                                            <Route path="/attendance-details" element={<AttendanceDetails/>}/>
                                            <Route path="/treasury" element={<Treasury/>}/>
                                            <Route path="/advances" element={<Advances/>}/>
                                            <Route path="/salary-all" element={<SalaryAll/>}/>
                                            <Route path="/basic" element={<Basic/>}/>
                                            <Route path="/user-basic/:user_uuid/:date" element={<UserBasic/>}/>
                                            <Route path="/coin-changer" element={<CoinChanger/>}/>
                                            <Route path="/leads" element={<Leads/>}/>
                                            <Route path="/notifications" element={<Notifications/>}/>
                                            <Route path="/teams" element={<Teams/>}/>

                                            <Route path="/" element={<DashBoard/>}/>
                                            <Route path="*" element={<NotFound/>}/>

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
