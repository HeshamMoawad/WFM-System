import { useEffect, type FC } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Topbar from '../../components/Topbar/Topbar';
import { ChildrenType } from '../../types/base';
import SidebarContextProvider from '../../contexts/SidebarContext';
import { useAuth } from '../../hooks/auth';
import { useNavigate } from 'react-router-dom';
import Azkar from '../../components/Azkar/Azkar';

interface MainLayoutProps extends ChildrenType{

}


const MainLayout: FC<MainLayoutProps> = ({children}:MainLayoutProps) => {
    const {auth, loading} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        if (!loading && !auth.Authorization) {
            navigate('/login');
        }
    }, [auth, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        auth.username ?
            <div className='flex flex-row' id='main-layout'>
                <SidebarContextProvider>
                    <Sidebar/>
                </SidebarContextProvider>
                <div className="flex flex-col gap-5 min-h-screen w-screen">
                    <Topbar/>
                    <div className="w-full h-full z-0">
                        <Azkar/>
                        {children}
                    </div>
                </div>
            </div>
        : null
    );
};

export default MainLayout;