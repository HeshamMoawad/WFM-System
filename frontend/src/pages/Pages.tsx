import type { FC } from "react";
import Login from "./Login/Login";
import DarkModeButton from "../components/DarkModeButton/DarckModeButton";

interface PagesProps {}

const Pages: FC<PagesProps> = () => {
    return (
        <div className="text-light-colors-text dark:text-dark-colors-text">
            <div className="h-screen w-screen  dark:bg-pr">
                <Login />
            </div>
            <DarkModeButton/>
        </div>
    );
};

export default Pages;
