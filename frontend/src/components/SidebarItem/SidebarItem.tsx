import type { FC } from 'react';
import type { IconType } from 'react-icons';

interface SidebarItemProps {
    Icon?:IconType,
    name?:string,
    href?:string

}

const SidebarItem: FC<SidebarItemProps> = ({Icon , name="" , href='#s' } : SidebarItemProps) => {
    return (<>
        <li className='block w-full text-center overflow-hidden'>
            <a href={href} >
                {
                    Icon?
                    <Icon className='w-full h-7' />
                    : null
                }
                <span className='text-sm opacity-80'>{name}</span>
            </a>
            
        </li>

    
    
    </>);
}

export default SidebarItem;
