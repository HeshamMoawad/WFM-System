import  {type FC , useContext, FormEvent, useState} from 'react';
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

interface LoginProps {}

const Login: FC<LoginProps> = () => {
    const {lang} = useContext(LanguageContext)
    const [loading , setLoading] = useState(false)
    const {setAuth} = useAuth()
    return (
        <div className='login-card-container'>
            {
                loading ? <LoadingPage/> : null
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
