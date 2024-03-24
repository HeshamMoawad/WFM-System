import type { FC } from 'react';
import type { IconType } from 'react-icons';

interface SidebarItemProps {
    Icon?:IconType,
    name?:string

}

const SidebarItem: FC<SidebarItemProps> = ({Icon , name="" } : SidebarItemProps) => {
    return (<>
        <li className='block w-full text-center border-t-[1px] pt-2 border-[gray] overflow-hidden'>
            <a href='#s' >
                {
                    Icon?
                    <Icon className='w-full h-8 md:h-8 fill-[red]' />
                    : null
                }
                <span>{name}</span>
            </a>
            
        </li>

    
    
    </>);
}

export default SidebarItem;
