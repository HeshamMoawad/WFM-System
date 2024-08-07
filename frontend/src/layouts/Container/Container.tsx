import type { FC } from 'react';
import { ChildrenType } from '../../types/base';

interface ContainerProps extends ChildrenType {
    className?:string;
    disabled?:boolean;
    onClick?:()=>void;
    onDoubleClick?:()=>void;
}

const Container: FC<ContainerProps> = ({children , className , onClick , onDoubleClick , disabled = false}:ContainerProps) => {
    return (
        <div 
        onDoubleClick={onDoubleClick}
        onClick={onClick}
        className={`container max-w-[93vw] transition-all duration-600 rounded-lg shadow-md m-2 px-3 pt-2 hover:mt-0 bg-light-colors-dashboard-secondry-bg dark:bg-dark-colors-dashboard-secondry-bg overflow-auto ${className}`}
        aria-disabled={disabled}
        >
            {children}
        </div>
    );
}

export default Container;
