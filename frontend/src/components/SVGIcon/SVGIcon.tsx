import type { FC } from "react";
import { SVGProps } from 'react';

interface SVGIconProps extends SVGProps<SVGSVGElement> {
    pathFilling:string
}

const SVGIcon: FC<SVGIconProps> = (props:SVGIconProps) => {
    const {pathFilling} = props;
    return (
        <>
            <svg
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 151.49 144.16"
                {...props}
            >
                <circle className="cls-5" cx="115.33" cy="19.03" r="19.03" />
                <circle className="cls-6" cx="36.09" cy="19.03" r="19.03" />
                <circle className="cls-4 fill-none" cx="75.74" cy="46.89" r="18.27" />
                <path
                    className="cls-3"
                    d="m75.74,21.63c26.73-.51,24.57,24.52,24.57,24.52h11.57v4.86h7.94v-4.7h11.29c9.3,6.69,11.81,17.88,11.81,17.88,0,0,6.59,20.8,8.05,31.26,1.78,10.87-1.46,13.8-3.76,16.2s-25.82,16.2-25.82,16.2l.1,9.83c-1.88,4.29-7.32,6.48-7.32,6.48l-11.81-55.3c-3.55-12.18-11.81-15.31-14.43-15.68l-8.96.03.08,5.61h-3.31v-13.51c25.68-1.38,23.02-36.18,0-36.38v-7.3Z"
                />
                <path
                    className="cls-2"
                    d="m75.74,21.63c-26.73-.51-24.57,24.52-24.57,24.52h-11.57s0,4.86,0,4.86h-7.94v-4.7s-11.29,0-11.29,0c-9.3,6.69-11.81,17.88-11.81,17.88,0,0-6.59,20.8-8.05,31.26-1.78,10.87,1.46,13.8,3.76,16.2s25.82,16.2,25.82,16.2l-.1,9.83c1.88,4.29,7.32,6.48,7.32,6.48l11.81-55.3c3.55-12.18,11.81-15.31,14.43-15.68,1.78,0,8.96.03,8.96.03l-.08,5.61h3.31s0-13.51,0-13.51c-25.23-1.59-23.66-35.5,0-36.38v-7.3Z"
                />
                <path
                    className="cls-1"
                    d="m75.74,28.62c10.09,0,18.27,8.18,18.27,18.27s-8.18,18.27-18.27,18.27-18.27-8.18-18.27-18.27,8.18-18.27,18.27-18.27m0-5c-12.83,0-23.27,10.44-23.27,23.27s10.44,23.27,23.27,23.27,23.27-10.44,23.27-23.27-10.44-23.27-23.27-23.27h0Z"
                />
                <path
                    className="cls-7"
                    d="m75.74,139.56s5.61-12.23,7.39-31.15c0-9.62-2.55-24.46-2.55-24.46h-4.84"
                />
                <path
                    className="cls-8"
                    d="m75.74,139.56s-5.61-12.23-7.39-31.15c0-9.62,2.55-24.46,2.55-24.46h4.84"
                />
                <path
                    className={`cls-4 ${pathFilling}`}
                    d="m115.33,112.38s5.61-12.23,7.39-31.15c0-9.62-2.55-24.46-2.55-24.46h-4.84"
                />
                <path
                    className={`cls-4 ${pathFilling}`}
                    d="m115.33,112.38s-5.61-12.23-7.39-31.15c0-9.62,2.55-24.46,2.55-24.46h4.84"
                />
                <path
                    className={`cls-4 ${pathFilling}`}
                    d="m36.09,112.38s5.61-12.23,7.39-31.15c0-9.62-2.55-24.46-2.55-24.46h-4.84"
                />
                <path
                    className={`cls-4 ${pathFilling}`}
                    d="m36.09,112.38s-5.61-12.23-7.39-31.15c0-9.62,2.55-24.46,2.55-24.46h4.84"
                />
            </svg>
        </>
    );
};

export default SVGIcon;
