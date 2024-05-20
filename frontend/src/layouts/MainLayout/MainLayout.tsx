import { type FC } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Topbar from '../../components/Topbar/Topbar';
import { ChildrenType } from '../../types/base';
import SidebarContextProvider from '../../contexts/SidebarContext';

interface MainLayoutProps extends ChildrenType{

}

const MainLayout: FC<MainLayoutProps> = ({children}:MainLayoutProps) => {
        // console.log('re-render MainLayout')
        return (
            <div className='flex flex-row' id='main-layout'>
                <SidebarContextProvider>
                    <Sidebar/>
                </SidebarContextProvider>
                <div className="flex flex-col gap-5 min-h-screen w-screen">
                    <Topbar/>
                    <div className="empty h-28 md:h-32"></div>
                    <div className="w-full h-full z-0">
                        {children}
                    </div>
                </div>
            </div>
    );
}

export default MainLayout;
