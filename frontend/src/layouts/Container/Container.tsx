import type { FC } from 'react';
import { ChildrenType } from '../../types/base';
import React from 'react';

interface ContainerProps extends ChildrenType {
    className?:string;
    disabled?:boolean;
    onClick?:()=>void;
    onDoubleClick?:()=>void;
    ref?:React.RefObject<HTMLDivElement>;
}

const Container: FC<ContainerProps> = ({children , className , onClick , onDoubleClick ,ref, disabled = false}:ContainerProps) => {
    return (
        <div 
        onDoubleClick={onDoubleClick}
        onClick={onClick}
        ref={ref}
        className={`container relative max-w-[93vw] transition-all duration-600 rounded-lg shadow-md dark:shadow-[gray] dark:shadow-sm  m-2 px-3 pt-2 hover:-translate-y-1 bg-light-colors-dashboard-secondry-bg dark:bg-dark-colors-dashboard-secondry-bg overflow-auto ${className}`}
        aria-disabled={disabled}
        >
            {children}
        </div>
    );
}

export default Container;
