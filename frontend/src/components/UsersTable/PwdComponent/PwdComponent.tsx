import { useRef, useState, type FC } from 'react';
import { FiEye , FiEyeOff , FiCopy } from "react-icons/fi";



interface PwdComponentProps {
    content: any;
}

const PwdComponent: FC<PwdComponentProps> = ({content}) => {
    const [blur,setBlur] = useState<boolean>(true)
    const pwdRef = useRef<HTMLInputElement>(null)
    const onCopy = ()=>{
        if (pwdRef.current){
            pwdRef.current.select();
            document.execCommand('copy');
            pwdRef.current.selectionEnd = 0;
        }
    }
    return (
    <>
        <td className={``} >
            <button className='w-10 m-2' onClick={e=>setBlur(prev=>!prev)}>
                {
                    blur? <FiEyeOff className='stroke-btns-colors-primary'/> : <FiEye className='stroke-btns-colors-primary'/>
                }
            </button>
            <button className='w-fit mr-2 inline'>
                <FiCopy className='stroke-btns-colors-primary' onClick={e=>{onCopy()}}/> 
            </button>
            <input type='text' readOnly ref={pwdRef} className={`${blur ? "blur-md": ""} text-center w-fit h-fit outline-none     bg-[transparent]`} value={content} />
            </td>    
    </>
    );
}

export default PwdComponent;
