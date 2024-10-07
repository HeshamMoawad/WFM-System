import { useEffect, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import { azkar, getRandomElement } from '../../utils/azkar';
import { GiPrayerBeads } from "react-icons/gi";

interface AzkarProps {}

const Azkar: FC<AzkarProps> = () => {
    const [show, setShow] = useState<boolean>(true);
    const [zekr , setZekr] = useState<string>("")

    useEffect(()=>{
        let zekrInterval : NodeJS.Timer
        if (show){
            setZekr(getRandomElement(azkar))
            zekrInterval = setInterval(()=>{
                setZekr(getRandomElement(azkar))
            },60000)
        }
        return ()=>{
            if (zekrInterval){
                clearInterval(zekrInterval)
            }
        }
    },[])
    return (
    <div className='w-full flex justify-center'>

        <Container onDoubleClick={()=>{setShow(prev=>!prev)}} className='h-fit w-fit font-bold p-5 pt-5 text-center border border-[rgb(255,215,0)] text-btns-colors-primary' onClick={()=>{setZekr(getRandomElement(azkar))}}>
            {show ? zekr : <GiPrayerBeads className='w-[30px] h-[30px]'/> }
        </Container>
    </div>
    );
}

export default Azkar;
