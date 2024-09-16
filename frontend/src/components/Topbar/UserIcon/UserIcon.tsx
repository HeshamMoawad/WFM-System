import { useState, type FC } from 'react';
import DefaultProfilePic from '../DefaultProfilePic/DefaultProfilePic';
import { CgProfile , CgLogOut  } from "react-icons/cg";
import { AUTH_KEY } from '../../../utils/storage';
import { useAuth } from '../../../hooks/auth';
import { getFullURL } from '../../../utils/converter';
import { Link, useNavigate } from 'react-router-dom';
import { sendRequest } from '../../../calls/base';
import Swal from 'sweetalert2';

interface UserIconProps {}

const UserIcon: FC<UserIconProps> = () => {
    const [showMenu , setShowMenu] = useState<boolean>(false)

    const navigate = useNavigate()
    const {auth} = useAuth()
    return (
    <div className='user-icon w-5/12 h-full md:w-[15%] md:mr-5  cursor-pointer' onClick={e=>setShowMenu(!showMenu)}>
        <div className='container flex flex-row-reverse justify-center w-full h-full'>
            <div className="info flex flex-col justify-center px-2 text-xs md:text-lg md:w-[100%]">
                    <span >{auth?.first_name} {auth?.last_name}</span>
                    <span className='block opacity-55'>{auth?.department?.name}</span>
            </div>
            <div className="icon flex flex-col justify-center items-center  w-full md:w-5/12">
                {
                    auth?.profile?.picture ?
                    (
                        <div className="flex justify-center items-center rounded-full h-12 w-12 md:w-14 md:h-14 bg-[#c4cce3]">
                            <img src={getFullURL(auth?.profile?.picture)} alt='' className="w-full h-full rounded-full" />
                        </div>
                    ):
                    (
                        <div className="flex justify-center items-center rounded-full h-12 w-12 md:w-14 md:h-14 bg-[#c4cce3]">
                            <DefaultProfilePic width={'38'}/>
                        </div>

                    )
                }
            </div>
        </div>
        <div  className={`${showMenu ? '' : 'hidden'} mt-1 mr-0 z-10 w-28 md:w-52 rounded-lg bg-[white] shadow-md dark:bg-dark-colors-login-secondry-bg`}>
            <ul className="py-2 text-base flex flex-col justify-center items-center"> 
                <li>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 ">
                        <CgProfile />
                        <span>Profile</span>
                    </Link>
                </li>
                <span className='block w-10/12 h-[1px] px-3 bg-[gray] opacity-30'></span>
                <li onClick={(e)=>{
                    e.preventDefault();
                    sendRequest({url:"api/users/logout"})
                        .then(data=>{
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Logout Successfully",
                                text: `Goodbye`,
                                showConfirmButton: false,
                                timer: 1500,
                            }).then(() => {
                                
                            });
                            localStorage.removeItem(AUTH_KEY)
                            document.cookie.split(';').forEach(cookie => {
                                document.cookie = cookie
                                    .replace(/^ +/,"")
                                    .replace(/=.*/,"=;expires=" + new Date().toUTCString() + ";path=/");
                            })
                            window.location.reload();
                        })
                        .catch((err) => {
                            Swal.fire({
                                icon: "error",
                                title: "Can't Logout",
                                text: "Please Try again later",
                                showConfirmButton: false,
                                timer: 1000,
                            });
                        })
                
                }}>
                    <a href="#s" className="flex  items-center gap-3 px-4 py-2">
                        <CgLogOut />
                        <span>Logout</span>
                    </a>
                </li>


            </ul>
        </div>
    </div>
    );
}

export default UserIcon;
