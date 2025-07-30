import { BASE_URL_NESTJS } from '../utils/constants';
import { APIRequests } from '../utils/requests';
import { InterceptorType } from '../utils/requests';
import { Interceptor } from '../utils/requests';
import { InterceptorReturnType } from '../utils/requests';
import { JWTStrategy } from '../utils/requests';

// const interceptor1 : Interceptor<InterceptorType.REQUEST> = new Interceptor<InterceptorType.REQUEST>((arg)=>{
//     console.log("Interceptor 1",arg)
//     return arg
// },InterceptorReturnType.RETURN_ARG)

// const interceptor2 : Interceptor<InterceptorType.RESPONSE> = new Interceptor<InterceptorType.RESPONSE>(
//     async (response)=>{
//         console.log("Interceptor 2",response)
//         return response
//     },
//     InterceptorReturnType.RETURN_INTERCEPTED
// )

export const requests = new APIRequests({
    baseUrl:BASE_URL_NESTJS,
    authStrategy:new JWTStrategy(()=>{
        const user = JSON.parse(localStorage.getItem("Auth") || "{}");
        return user.Authorization || ""
    }),
});
// requests.interceptorManager.addInterceptor(interceptor1,InterceptorType.REQUEST);
// requests.interceptorManager.addInterceptor(interceptor2,InterceptorType.RESPONSE);

export function useRequests(){
    return requests
};

export default useRequests;
