import React from 'react';
import { BASE_URL } from './constants';
import { Base } from '../types/base';


export const parseObject = (e:React.FormEvent)=> {
    e.preventDefault()
    return Object.fromEntries(new FormData(e.target as HTMLFormElement).entries())
}

export const parseFormData = (e:React.FormEvent):FormData => {
    e.preventDefault()
    return new FormData(e.target as HTMLFormElement)
}

export const parseDateFromParams = (dateString:string) => {
    const [monthStr , yearStr] = dateString.split("-")
    const month = parseInt(monthStr,10)
    const year = parseInt(yearStr,10)
    return new Date(year,month-1,getLastDayOfMonth(new Date(year,month-1)))
}


export const getFullURL = (url:string|null):string=>{
    return url ? `${BASE_URL}${url}` : ""
}



interface TableValues{
    key:string | string[],
    method:((item:(string|number|Array<any>))=>any)|null,

}

function convertArray(item:any, neededArrayString:(string | string[])[] , neededArrayMethods:any[]){
    return neededArrayString.map((key,index)=>{ 
        if (typeof key === 'string'){
            return neededArrayMethods[index] ? neededArrayMethods[index](item[key]) : item[key]
        }else if (Array.isArray(key)){
            const objs = Object.keys(item).filter(k => key.includes(k)).map(
                k => ({[k]:item[k]})
            )
            return neededArrayMethods[index] ? neededArrayMethods[index](concatDicts(objs)) : item
        }
        else {
            return key
        }
    })
}


export function convertObjectToArrays<T extends object>(arrayOfObjects:T[] , neededValues:TableValues[]){
    let subArrays:any[] = [];
    const neededArrayString = neededValues.map(v => v.key)
    const neededArrayMethods = neededValues.map(v => v.method)


    arrayOfObjects.map((item, index)=>{
        subArrays.push(convertArray(item,neededArrayString , neededArrayMethods));
    })
    // console.log(subArrays)
    return subArrays
}


function convertEmptyArray(neededArrayString:string[]){
    return Array.from(neededArrayString , (item,index)=>"-")
}


function getDaysInMonthExcludingFriSat(year: number, month: number): number[] {
    const daysInMonth: number[] = [];
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Last day of the month

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
        if (dayOfWeek !== 5 && dayOfWeek !== 6) { // Exclude Friday (5) and Saturday (6)
            daysInMonth.push(date.getDate());
        }
    }

    return daysInMonth;
}


export function formatTime(seconds:number) {
    let hours:string|number = Math.floor(seconds / 3600);
    let minutes:string|number = Math.floor((seconds % 3600) / 60);
    let remainingSeconds:string|number = Math.floor(seconds % 60);

    // Adding leading zeros if necessary
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    remainingSeconds = (remainingSeconds < 10) ? '0' + remainingSeconds : remainingSeconds;

    return hours + ':' + minutes + ':' + remainingSeconds;
}

export function getLastDayOfMonth(date:Date) {
    // Create a Date object for the next month's first day
    const nextMonthFirstDay = new Date(date.getFullYear(), date.getMonth() + 1 , 1);
    // Subtract one day from the next month's first day to get the last day of the current month
    var lastDayOfMonth = new Date(nextMonthFirstDay.getTime() - 1);
    // Return the date of the last day of the month
    return lastDayOfMonth.getDate();
}


export function getDateDifference(date1: Date, date2: Date): number {
    // Calculate the difference in milliseconds
    const differenceMs = date2.getTime() - date1.getTime();
    
    // Convert milliseconds to hours
    const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60));
    
    return differenceDays;
}



interface Dict {
    [key: string]: any;
}

function concatDicts(dictList: Dict[]): Dict {
    return dictList.reduce((result, currentDict) => {
        return { ...result, ...currentDict };
    }, {});
}


export function Convert(data:any,keys:string[]){
    let newD  = keys.map(k=>{
        const values : Base[]|Base = data[String(k)]
        return {
            [k]: Array.isArray(values)? values.map(val=> val.uuid) : values.uuid
        }
    })
    let newData = newD as Dict[]
    return {
        ...data,
        ...concatDicts(newData)
    }

}

// export function Convert(data:any,key:string[]){
//     let newD  = key.map(k=>({[k]: data[k].uuid}))
//     let newData = newD as Dict[]
//     return {
//         ...data,
//         ...concatDicts(newData)
//     }

// }

export function getArgsFrom(obj:any,args:string[]|string){
    if (typeof args === "string"){
        return obj[args]
    }
    return args.map(arg => obj[arg]);
}





