import React, {FC, useEffect, useReducer, useState} from 'react';
import s from './leasingForm.module.scss'
import {InputRange} from "./inputRange/InputRange";
import {ErrorMessage} from "./errorMessage/ErrorMessage";
import {addSpacesToValue, deleteSpacesOfValue, reducer} from "../helpers";
import {Actions, IFieldHandler} from "../types";
import {api} from "../api/baseRequest";
import {logDOM} from "@testing-library/react";

interface ILeasingForm {
    headline: string
}

 export const initialData = {
    price: '3300000',
    firstPay:"13",
    term: '60'
}

const errorData = {
    errorValue: '',
    rightValue: '',
    errorMessage: '',
    errorFieldName: ''
}


export const LeasingForm: FC<ILeasingForm> = ({headline}) => {
    const [firstPayCounted, setFirstPayCounted] = useState(0)
    const [monthPayCounted, setMonthPayCounted] = useState(0)
    const [amount, setAmount] = useState(0)
    const [error, setError]= useState(errorData)
    const [isPending, setIsPending] = useState(false)
    const [isFulfilled, setIsFulfilled] = useState(false)
    const [data, dispatch] = useReducer( reducer, initialData );



    useEffect( ()=>{
        firstPayHandler()
        monthPayHandler()
        contractAmountHandler()
    },[data.price,data.firstPay,data.term,monthPayCounted])




    const errorFieldHandler =({min,max,action}:IFieldHandler):void =>{
        const {type, payload} = action
        const handledValue = Math.min(Math.max(Number(deleteSpacesOfValue(payload)), min), max)
        if(payload !== handledValue.toString()){
            dispatch({type: type,payload: handledValue.toString()})
        }else {
            dispatch({type: type,payload: payload.toString()})

        }
    }

    const firstPayHandler = () =>{
        let payCounted
        payCounted = (+data.price)*(+data.firstPay)/100
        setFirstPayCounted(payCounted)
    }

    const monthPayHandler = () => {
        const monthPay = (+data.price - firstPayCounted) * ((0.035 * Math.pow((1 + 0.035), Number(data.term)))
            / (Math.pow((1 + 0.035), Number(data.term)) - 1));

        isFinite(monthPay) ? setMonthPayCounted(Math.ceil(monthPay)) : setMonthPayCounted(0)
    }

    const contractAmountHandler = () => {
        const amount = Math.ceil(firstPayCounted + (+data.term) * monthPayCounted)
        isFinite(amount) ? setAmount(amount) : setAmount(0)
    }
    const sendData = async () =>{
        const readyData = {
            "car_coast": +data.price,
            "initail_payment": +firstPayCounted,
            "initail_payment_percent": +data.firstPay,
            "lease_term": +data.term,
            "total_sum": +amount,
            "monthly_payment_from": +monthPayCounted
        }
        try {
            setIsPending(true)
            const res = await api.post('eK160jgYJ6UlaRPldJ1P', readyData);
            if(res.data.success){
                setIsPending(false)
                setIsFulfilled(true)
                setTimeout(()=>setIsFulfilled(false),2000)
            }
        }catch (e) {
            alert('ошибка')
            setIsPending(false)
            error.errorMessage = 'error'

        }
    }
    return (
        <div className={s.calculator}>
            <p className={s.headline}>{headline}</p>
            <form action="#" onSubmit={sendData}>
                <div className={`${s.inputItem} ${(isPending || isFulfilled) && s.inputItem__disabled}`}>
                    <label htmlFor="price">Стоимость автомобиля</label>
                    <div className={s.inputWrapper}>
                        {Object.values(error).includes('price') && <ErrorMessage errorMessage={error.errorMessage}/>}
                        <input
                            type="text"
                            name={'price'}
                            id={'price'}
                            value={addSpacesToValue(data.price.toString())}
                            onChange={(e)=>dispatch({type: Actions.PRICE, payload: deleteSpacesOfValue(e.target.value)})}
                            className={s.inputField}
                            disabled={isPending || isFulfilled}
                            maxLength={9}
                            onBlur={(e)=>errorFieldHandler({
                                    min:1000000, max:6000000, action: {type: Actions.PRICE, payload: e.target.value}})}
                        />
                    </div>
                    <InputRange
                        name={'price'}
                        id={'price'}
                        min={'1000000'}
                        max={'6000000'}
                        value={data.price}
                        dispatch={dispatch}
                        isPending={isPending}
                        actionType={Actions.PRICE}
                        isFulfilled={isFulfilled}
                    />
                </div>
                <div className={`${s.inputItem} ${(isPending || isFulfilled) && s.inputItem__disabled}`}>
                    <label htmlFor="firstPay">Первоначальный взнос</label>
                    <div className={s.inputWrapper }>
                        {Object.values(error).includes('firstPay') && <ErrorMessage errorMessage={error.errorMessage}/>}
                        <span className={s.firstPay}>{addSpacesToValue(firstPayCounted.toString())} ₽</span>
                        <div className={s.firstPayWrapper}>
                            <input
                                type="text"
                                name={'firstPay'}
                                id={'firstPay'}
                                value={data.firstPay.concat('%')}
                                onChange={(e)=>dispatch({type: Actions.FIRSTPAY, payload: e.target.value.replace(/[^0-9]/g,"")})}
                                className={s.firstPayInput}
                                onBlur={()=>errorFieldHandler({min:10,max:60, action: {type: Actions.FIRSTPAY, payload: data.firstPay}})}
                                disabled={isPending || isFulfilled}
                                maxLength={3}
                            />
                        </div>
                    </div>

                    <InputRange
                        name={'firstPay'}
                        id={'firstPay'}
                        min={'10'}
                        max={'60'}
                        value={data.firstPay}
                        dispatch={dispatch}
                        isPending={isPending}
                        actionType={Actions.FIRSTPAY}
                        isFulfilled={isFulfilled}
                    />
                </div>
                <div className={`${s.inputItem} ${(isPending || isFulfilled) && s.inputItem__disabled}`}>
                    <label htmlFor="term">Срок лизинга</label>
                    <div className={s.inputWrapper}>
                        {Object.values(error).includes('term') && <ErrorMessage errorMessage={error.errorMessage}/>}
                        <input
                            type="text"
                            name={'term'}
                            id={'term'}
                            value={data.term}
                            onChange={(e)=>dispatch({type:Actions.TERM, payload:e.target.value})}
                            onBlur={()=>errorFieldHandler({ min:1, max: 60, action:{type:Actions.TERM, payload:data.term}})}
                            className={s.inputField}
                            disabled={isPending || isFulfilled}
                            maxLength={2}
                        />
                        <span className={s.naming}>мес.</span>
                    </div>

                    <InputRange
                        name={'term'}
                        id={'term'}
                        min={'1'}
                        max={'60'}
                        value={data.term}
                        dispatch={dispatch}
                        isPending={isPending}
                        actionType={Actions.TERM}
                        isFulfilled={isFulfilled}
                    />
                </div>

                <div className={s.amount}>
                    <span className={s.label}>Сумма договора лизинга</span>
                    <span>{addSpacesToValue(amount.toString()) || 0} ₽</span>
                </div>
                <div className={s.monthPay}>
                    <span className={s.label}>Ежемесячный платеж от</span>
                    <span>{addSpacesToValue(monthPayCounted.toString())} ₽</span>
                </div>

                <div className={`${s.sendButton} ${error.errorMessage !== '' && s.sendButton__disabled}`}>
                    {isFulfilled && <span>Готово!</span>}
                    {!isPending && !isFulfilled && <button disabled={error.errorMessage !== ''}>Оставить заявку</button>}
                    {isPending && <div className={s.loader}></div>}
                </div>
            </form>
        </div>
    );
};

