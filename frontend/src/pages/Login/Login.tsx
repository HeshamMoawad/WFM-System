import type { FC } from 'react';
import './Login.css';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
    return (
        <div className='login-card-container'>
            <div className="login-card ">
                <label className='sign'>Sign In</label>
                <div className="form ">
                    <form action="" className='form'>
                        <div className="section">
                            <label htmlFor="username">Username</label>
                            <input type="text" placeholder='username'/>
                        </div>
                        <div className="section">
                            <label htmlFor="password">Password</label>
                            <input type="password" placeholder='password'/>
                        </div>
                    

                        <button type='submit'>Login</button>
                        
                        <div className="section">
                            <a href='#'>Forgot password ?</a>
                        </div>

                    </form>
                    
                </div>
            </div>
        </div>
    );
}

export default Login;
