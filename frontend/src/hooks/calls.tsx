import  { useState, useEffect } from 'react';
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

function useRequest<ResultsType>(reqConfig: sendRequestKwargs, dependency:any[] = [],intervalTimer?:number){
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<ListData<ResultsType>|null>(null); 
    const [error, setError] = useState<any>(null);
    const runner = ()=>{
                setLoading(true);
                sendRequest(reqConfig)
                    .then(responseData => setData(responseData))
                    .catch(err => setError(err))
                    .finally(() => setLoading(false)); // Set loading to false after request completion
            }
    useEffect(() => {
        runner()
        let interval:NodeJS.Timer|undefined
        if (intervalTimer){
            interval =  setInterval(runner, intervalTimer)
        }else {
            runner()
        }
        return () => {
            clearInterval(interval)
        }
    }, dependency);

    return {
        loading,
        data,
        error
    };
};

export default useRequest;
