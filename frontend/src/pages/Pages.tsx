import type { FC } from 'react';
import Login from './Login/Login';

interface PagesProps {

}

const Pages: FC<PagesProps> = () => {
    return (
        <div className='text-light-colors-text dark:text-dark-colors-text'>
            <div className="h-screen w-screen">
                <Login/>
            </div>
        </div>
    );
}

export default Pages;
