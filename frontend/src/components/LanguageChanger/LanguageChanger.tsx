import  {type FC ,useContext} from 'react';
import { TRANSLATIONS } from '../../utils/constants';
import {  saveLang} from '../../utils/storage';
import { LanguageContext } from '../../contexts/LanguageContext';
import { Language } from '../../types/base';

interface LanguageChangerProps {}


const LanguageChanger: FC<LanguageChangerProps> = () => {
    const {lang,setLang} = useContext(LanguageContext)

    const onChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLang(e.target.value as Language)
        saveLang(e.target.value as Language)
      };
      
    return (<div className='opacity-80 font-bold'>
        <select defaultValue={lang} onChange={onChangeLang} className='bg-[transparent] border-none'>
          {
          TRANSLATIONS.Labels.map((label)=>{
            return (                
                <option className='dark:bg-dark-colors-login-secondry-bg'  key={label.value} value={label.value}>{label.label}</option>
            )
          })
        }
          


      </select>
    </div>);
}

export default LanguageChanger;
