import type { FC } from 'react';
import { Link } from 'react-router-dom';

interface NotFoundProps {}

const NotFound: FC<NotFoundProps> = () => {
    return (
    <>
    <div className="flex justify-center w-full h-[70%] my-12 px-4 ">
        <div className="flex flex-col justify-center items-center w-[70%]  gap-8 ">
            <h1 className="text-8xl md:text-16xl text-center">
            404 Not Found
            </h1>
            <p className="text-3xl font-semibold text-center">
            You have discovered a secret path
            </p>
            <div className="flex flex-row justify-between gap-8">
            <Link
                to="/"
                className="flex justiy-center items-center px-5 py-2 text-xl rounded-md text-black border border-indigo-500 hover:bg-indigo-500 hover:text-white 
                bg-gradient-to-tr 
                from-btns-colors-primary 
                to-btns-colors-secondry 
                via-[transparent] 
                dark:to-btns-colors-secondry 
                via-70% 
                dark:via-30% 
                "
            >
                Dashboard Page
            </Link>
            </div>
        </div>
    </div>

    </>
    );
}

export default NotFound;
