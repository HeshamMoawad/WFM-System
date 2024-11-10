import { TargetSlice } from "../types/auth"


const isIntger = (string_int:string)=>{
    const parsed = parseInt(string_int)
    return !isNaN(parsed) && parsed.toString() === string_int.trim()
}

const isFloat = (string_float:string)=>{
    const parsed = parseFloat(string_float)
    return !isNaN(parsed) && parsed.toString() === string_float.trim()
}


const calc_target_from_array = (count:number , targets:TargetSlice[] , percentageCost:number=1)=>{
    let result = 0
    for (let index = 0; index < targets.length; index++) {
        const element = targets[index];
        if (element.min_value <= count && count <= element.max_value){
            if(element.is_money_percentage){
                result = (+element.money/100)*count * percentageCost
            } 
            else if (isIntger(element.money) || isFloat(element.money)) {
                result = +element.money;
            }
            else {
                result = eval(element.money.replaceAll("$var",String(count)))
            }
            break;
        }else if (index === targets.length - 1 && count >= element.max_value){
            if(element.is_money_percentage){
                result = (+element.money/100)*count * percentageCost
            } 
            else if (isIntger(element.money) || isFloat(element.money)) {
                result = +element.money;
            }
            else {
                result = eval(element.money.replaceAll("$var",String(count)))
            }
        }
    }
    return Math.round(result);
}


export {
    calc_target_from_array,
}