import { ChangeEvent, useContext, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import { useAuth } from '../../hooks/auth';
import { TRANSLATIONS } from '../../utils/constants';
import { LanguageContext } from '../../contexts/LanguageContext';
import { onSubmitProfileForm } from '../../calls/Profile/Profile';
import LoadingPage from '../LoadingPage/LoadingPage';
import { getFullURL } from '../../utils/converter';

interface ProfileProps {}

const Profile: FC<ProfileProps> = () => {
    const{lang} = useContext(LanguageContext);
    const [disabled , setDisabled] = useState(true);
    const [loading , setLoading] = useState(false);
    const {auth} = useAuth()
    const [profile,setProfile] = useState({...auth.profile})
    const onChangeInputs = (e:any)=>{setProfile((prev)=>{
                            return {
                               ...prev,
                                [e.target.name] : e.target.value
                            }
                        })}
    return (
    <div className='flex justify-center'>
        {
            loading ? <LoadingPage/> : null
        }
        <Container className='h-fit md:h-[75vh] flex flex-col md:flex-row gap-7'>
            <div className='flex justify-center items-center md:justify-start mt-4 md:mx-4 md:mt-0'>
                <div className='flex flex-col md:flex-row  rounded-full w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-btns-colors-primary'>
                    <img src={getFullURL(profile.picture)} alt='profile' className='rounded-full w-[100%] h-[100%] p-1'/>
                </div>
            </div>
            <div className='w-full h-full md:p-3'>
                <h1 className='text-3xl md:text-5xl font-bold text-center'>Profile</h1>
                <form action="" method="post" className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-3 content-start' onSubmit={(e)=>{onSubmitProfileForm(e,lang,auth.profile.uuid,setLoading)}}>
                    <div className='flex flex-row md:p-3 gap-5 md:col-span-2'>
                        <label htmlFor="picture" className='text-xl w-[55%] md:w-[65%]'>{TRANSLATIONS.Profile.Picture[lang]} : </label>
                        <input disabled={disabled} type="file" name="picture" id="picture"  className='w-[100%] outline-none px-4 rounded-lg bg-[transparent] '/>
                    </div>
                    <div className='flex flex-row md:p-3 gap-5'>
                        <label htmlFor="phone" className='text-xl w-[55%] md:w-[65%]'>{TRANSLATIONS.Profile.Phone[lang]} : </label>
                        <input onChange={onChangeInputs} value={profile.phone} disabled={disabled} type="text" name="phone" id="phone" placeholder={TRANSLATIONS.Profile.Phone[lang]} dir={TRANSLATIONS.Direction[lang]} className='w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>
                    </div>
                    <div className='flex flex-row md:p-3 gap-5'>
                        <label htmlFor="telegram_id" className='text-l w-[55%] md:w-[65%]'>{TRANSLATIONS.Profile.TelegramID[lang]} : </label>
                        <input onChange={onChangeInputs} value={profile.telegram_id ? profile.telegram_id : undefined} disabled={disabled} type="number" name="telegram_id" id="telegram_id" dir={TRANSLATIONS.Direction[lang]} placeholder={TRANSLATIONS.Profile.TelegramID[lang]} className='w-full outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>
                    </div>
                    <div className='flex flex-row md:p-3 gap-5 md:col-span-2'>
                        <label htmlFor="about" className='text-xl w-[55%] md:w-[20%]'>{TRANSLATIONS.Profile.About[lang]} : </label>
                        <textarea onChange={onChangeInputs} value={profile.about ? profile.about : ""} disabled={disabled} name="about" id="about" placeholder={TRANSLATIONS.Profile.About[lang]} dir={TRANSLATIONS.Direction[lang]} className='w-[100%] h-60 md:h-80 outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>
                    </div>
                    <div className='flex justify-around items-center h-14 md:col-span-2'>
                        <button className='bg-btns-colors-secondry w-24 h-8 md:w-36 md:h-12 rounded-lg' onClick={(e)=>{
                            e.preventDefault();
                            window.location.reload();
                            }}> Cancel </button>
                        <button type="submit" className='bg-btns-colors-primary w-24 h-8 md:w-36 md:h-12 rounded-lg'> Save </button>

                        <button className={`${disabled?"bg-[gray]":null} w-24 h-8 md:w-36 md:h-12 rounded-lg`} onClick={(e)=>{
                            e.preventDefault();
                            setDisabled(!disabled)
                        }}> {disabled ? "View":"Edit"} </button>

                    </div>
                </form>
            </div>
        </Container>
    </div>
    );
}

export default Profile;
