import { type FC } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Topbar from '../../components/Topbar/Topbar';
import { ChildrenType } from '../../types/base';
import SidebarContextProvider from '../../contexts/SidebarContext';

interface MainLayoutProps extends ChildrenType{

}

const MainLayout: FC<MainLayoutProps> = ({children}:MainLayoutProps) => {
        return (
            <div className='main-layout flex flex-row'>
                <SidebarContextProvider>
                    <Sidebar/>
                </SidebarContextProvider>
                <div className="flex flex-col gap-5 min-h-screen w-screen">
                    <Topbar/>
                    <div className="empty h-24 md:h-28"></div>
                    <div className="w-full h-full ">
                        {children}
                    </div>
                </div>
            </div>
    );
}

export default MainLayout;
