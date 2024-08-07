import { TargetSlice } from "../types/auth"



const calc_target_from_array = (count:number , targets:TargetSlice[] , percentageCost:number=1)=>{
    let result = 0
    for (let index = 0; index < targets.length; index++) {
        const element = targets[index];
        if (element.min_value <= count && count <= element.max_value){
            if(element.is_money_percentage){
                result = (+element.money/100)*count * percentageCost
            } else {
                result = +element.money;
            }
            break;
        }else if (index === targets.length - 1 && count >= element.max_value){
            if(element.is_money_percentage){
                result = (+element.money/100)*count * percentageCost
            } else {
                result = +element.money;
            }
        }
        
        
    }
    return Math.round(result);
}


export {
    calc_target_from_array,
}