import  {type FC , useContext, FormEvent, useState, useEffect, useRef} from 'react';
import './Login.css';
import { TRANSLATIONS } from '../../utils/constants';
import { LanguageContext } from '../../contexts/LanguageContext';
// import { sendRequest } from '../../calls/base';
import LoadingPage from '../LoadingPage/LoadingPage';
// import { parseObject } from '../../utils/converter';
import { useAuth } from '../../hooks/auth';
// import Swal from 'sweetalert2';
// import { saveLogin } from '../../utils/storage';
import { onSubmitLoginForm , onForgetPassword } from '../../calls/Login/Login';
import { getFingerprint } from '../../utils/fingerprint';
import { load, loadID, save, saveID } from '../../utils/storage';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
    const {lang} = useContext(LanguageContext)
    const [loading , setLoading] = useState(false)
    const [clientID , setClientID] = useState<string|null>(loadID())
    const {setAuth} = useAuth()
    useEffect(()=>{
        if (!clientID){
            getFingerprint()
                .then(

                    fingerprint => {
                        console.log("generated fingerprint")
                        saveID(fingerprint as string)
                        setClientID(fingerprint as string)
                    }
                )
                .catch(error =>setClientID(null))
        }
    },[])
    return (
        <div className='login-card-container'>
            {
                loading ? <LoadingPage/> : null
            }
                {
                    clientID ? 
                    (
                    <div className='flex justify-center items-center p-1 m-1 w-5/6 md:w-3/12' >
                        <input 
                            readOnly 
                            className='text-center w-full block border border-[gray] p-1 rounded-lg bg-light-colors-login-secondry-bg dark:bg-dark-colors-login-secondry-bg'
                            value={clientID} 
                            onClick={e=>{
                                e.preventDefault();
                                e.currentTarget.select()
                                document.execCommand('copy');
                                e.currentTarget.selectionEnd = 0;
                        }}/>
                    </div>
                    ) : null
                }

            <div className="login-card dark:text-[white]" dir={TRANSLATIONS.Direction[lang]}>

                <label className='sign'>{TRANSLATIONS.Login.SignIn[lang]}</label>
                <div className="form">
                    
                    <form action="" method='' className='form' onSubmit={(e)=>{e.preventDefault();onSubmitLoginForm(e,lang,setLoading,setAuth)}}>
                        <div className="section">
                            <label htmlFor="username">{TRANSLATIONS.Login.username[lang]}</label>
                            <input name='username' type="text" placeholder={TRANSLATIONS.Login.username[lang]} required/>
                        </div>
                        <div className="section">
                            <label htmlFor="password">{TRANSLATIONS.Login.password[lang]}</label>
                            <input name='password' type="password" placeholder={TRANSLATIONS.Login.password[lang]} required/>
                        </div>
                            {/* <input name='unique_id' type="hidden" required value={clientID as string}/> */}
                        <button type='submit'>{TRANSLATIONS.Login.Login[lang]}</button>
                        <div className="section">
                            <a href='#forget_password' onClick={(e)=>{e.preventDefault();onForgetPassword(lang,setLoading)}}>{TRANSLATIONS.Login.ForgetPassword[lang]} ?</a>
                        </div>

                    </form>
                        

                    
                </div>
            </div>
        </div>
    );
}

export default Login;
