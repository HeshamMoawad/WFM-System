import { type FC } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';


interface MainLayoutProps {
    children?: string | JSX.Element | JSX.Element[] ;

}

const MainLayout: FC<MainLayoutProps> = ({children}:MainLayoutProps) => {
        return (
        <div className='main-layout'>
            <Sidebar/>
            {children}
        </div>
    );
}

export default MainLayout;
