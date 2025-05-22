import  { useState, useEffect, useCallback } from 'react';
import { sendRequest , sendRequestKwargs } from '../calls/base';


// interface useRequestProps extends sendRequestKwargs{
//     dependency?:[]
// }
interface ListData<T> {
    count: number;
    total_count: number;
    next: string|null;
    previous: string|null;
    results: T[]|[];
}

function useRequest<ResultsType>(reqConfig: sendRequestKwargs, dependency:any[] = [],intervalTimer?:number , debounceTime?:number){
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<ListData<ResultsType>|null>(null); 
    const [error, setError] = useState<any>(null);
    
    const runner = useCallback(() => {
            setLoading(true);
            sendRequest(reqConfig)
                .then(responseData => setData(responseData))
                .catch(err => setError(err))
                .finally(() => setLoading(false)); // Set loading to false after request completion
        }, [reqConfig]);
            
    useEffect(() =>{
        if (intervalTimer){
            runner()
        }
    },dependency)

    useEffect(() => {
        let interval:NodeJS.Timer|undefined
        let handler:NodeJS.Timer
        if (intervalTimer){
            interval =  setInterval(runner, intervalTimer)
        }else if (debounceTime){
            handler = setTimeout(() => {
                runner();
            }, debounceTime);
        }
        else {
            runner()
        }
        return () => {
            if (interval) clearInterval(interval)
            if (handler) clearInterval(handler)
        }
    }, dependency);

    return {
        loading,
        data,
        error
    };
};

export default useRequest;
