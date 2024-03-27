import type { FC } from 'react';
import { ChildrenType } from '../../types/base';

interface ContainerProps extends ChildrenType{
    className?:string
}

const Container: FC<ContainerProps> = ({children , className}:ContainerProps) => {
    return (
        <div className={`container transition-all duration-500 rounded-lg shadow-md m-2 px-3 pt-2 hover:mt-0 bg-light-colors-dashboard-secondry-bg dark:bg-dark-colors-dashboard-secondry-bg ${className}`}>
            {children}
        </div>
    );
}

export default Container;
