import {Actions, IAction} from "../types"
import {IInitialData} from "../types";

export const addSpacesToValue=(e:string)=>{
    return e.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}


export const deleteSpacesOfValue=(e:string)=>{
    return e.toString().replace(/[a-zа-яё]/gi, '').replace(/\s/g, '')
}

export const reducer =(data: IInitialData,action: IAction)=>{
    const {type, payload} = action
    switch (type){
        case Actions.PRICE:
            return {
                ...data,
                price: payload
            }
        case Actions.FIRSTPAY:
            return {
                ...data,
                firstPay: payload
            }
        case  Actions.TERM:
            return {
                ...data,
                term: payload
            }
    }
}