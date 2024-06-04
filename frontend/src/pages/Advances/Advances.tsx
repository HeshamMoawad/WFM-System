import  {type FC } from 'react';
import { Link  } from 'react-router-dom';
interface AdvancesProps {}

const Advances: FC<AdvancesProps> = () => {
    return (
    <>
    <Link  to={"/treasury"}>Return</Link>
    </>

);
}

export default Advances;
