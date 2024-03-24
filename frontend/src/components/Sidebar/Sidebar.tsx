import type { FC } from 'react';
import './Sidebar.css'
import logo from '../../assets/images/logo.svg';
import { FaAccusoft} from 'react-icons/fa';
import SidebarItem from '../SidebarItem/SidebarItem';
// import { IconType} from 'react-icons/';



interface SidebarProps {

}

const Sidebar: FC<SidebarProps> = () => {
    return (
        <div className='side-bar'>
            <div className="project-logo">
                <img src={logo} alt="" />
            </div>
            <nav>
                <SidebarItem name='home' Icon={FaAccusoft}/>

            </nav>
        </div>
    );
}

export default Sidebar;
