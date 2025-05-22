import type { FC } from 'react';

interface LoadingComponentProps {}

const LoadingComponent: FC<LoadingComponentProps> = () => {
    return (        
    <div className="loading absolute inset-0 w-full h-full bg-[rgba(0,0,0,0.5)]  flex justify-center items-center">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
            width={200}
            height={200}
            style={{
                shapeRendering: "auto",
                display: "block",
                background: "transparent",
            }}
            xmlnsXlink="http://www.w3.org/1999/xlink"
            >
            <g>
                <path
                d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
                fill="#35bfbf"
                stroke="none"
                >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    dur="0.819672131147541s"
                    repeatCount="indefinite"
                    keyTimes="0;1"
                    values="0 50 51;360 50 51"
                />
                </path>
                <g />
            </g>
            </svg>
    </div>

    );
}

export default LoadingComponent;
