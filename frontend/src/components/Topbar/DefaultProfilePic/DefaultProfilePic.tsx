import type { FC } from 'react';
import { SVGProps } from 'react';

interface DefaultProfilePicProps extends SVGProps<SVGSVGElement> {


}

const DefaultProfilePic: FC<DefaultProfilePicProps> = (props:DefaultProfilePicProps) => {
    return (
    <>
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 497.35 664.92" {...props}>
        <path className="cls-1 fill-[#f6f7f9]" d="m245.02,157.9c-11.91,0-24.39,1.66-37.32,8.6-40,21.5-38,40-38,58s-1.5,53.5-1.5,53.5c-10.01-4.58-5,6-5,23s9.5,22.5,9.5,22.5c1.5,35,18.67,44.67,18.67,44.67l-3.33,35.67c-15,.33-6.67,12.67-11.67,15.33-5,2.67-5.67,16.33-5.67,16.33-146,55-132,77-132,77h412.64s14-22-132-77c0,0-.67-13.67-5.67-16.33-5-2.67,3.33-15-11.67-15.33l-3.33-35.67s17.17-9.67,18.67-44.67c0,0,9.5-5.5,9.5-22.5s5.01-27.58-5-23c0,0-1.5-35.5-1.5-53.5s2-36.5-38-58c-12.92-6.95-25.41-8.6-37.32-8.6Z"/>
        </svg>

    </>);
}

export default DefaultProfilePic;
