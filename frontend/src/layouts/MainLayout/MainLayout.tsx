import { type FC } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Topbar from '../../components/Topbar/Topbar';


interface MainLayoutProps {
    children?: string | JSX.Element | JSX.Element[] ;

}

const MainLayout: FC<MainLayoutProps> = ({children}:MainLayoutProps) => {
        return (
        <div className='main-layout flex flex-row'>
            <Sidebar/>
            <div className="flex flex-col gap-5 h-screen w-full">
                <Topbar/>
                <div className="">
                    {children}
                </div>

            </div>
            
        </div>
    );
}

export default MainLayout;
