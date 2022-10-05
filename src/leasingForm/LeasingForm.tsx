import React, {FC, useEffect, useReducer, useState} from 'react';
import s from './leasingForm.module.scss'
import {InputRange} from "./inputRange/InputRange";
import {ErrorMessage} from "./errorMessage/ErrorMessage";
import axios from "axios";

interface ILeasingForm {
    headline: string
}

interface IFieldHandler {
    value: string,
    min: number,
    max: number,
    setStateFunc: (arg:string)=>void,
    fieldName: 'price'| 'firstPay' | 'term'| ''
}

export enum Actions {
    PRISE= 'prise',
    FIRSTPAY = 'firstPay',
    TERM='term'
}
export interface IAction {
    type: Actions;
    payload: string;
}

interface IInitialData {
    prise: string,
    firstPay:string,
    term: string
}
// export interface IError {
//     errorValue: string,
//     rightValue: string,
//     errorMessage:string
//     errorFieldName: 'price'| 'firstPay' | 'term'| ''
// }

export const LeasingForm: FC<ILeasingForm> = ({headline}) => {
    const [firstPay, setFirstPay] = useState("13")
    const [term, setTerm] = useState("60")
    const [firstPayCounted, setFirstPayCounted] = useState(0)
    const [monthPayCounted, setMonthPayCounted] = useState(0)
    const [price, setPrice] = useState("3300000")
    const [amount, setAmount] = useState(0)
    const [error, setError]= useState({errorValue: '',
        rightValue: '',
        errorMessage: '',
        errorFieldName: ''
    })
    const initialData = {
        prise: '3300000',
        firstPay:"13",
        term: '60'
    }

    const [isPending, setIsPending] = useState<boolean>(false)
    const [isFulfilled, setIsFulfilled] = useState<boolean>(false)
    const [data, dispatch] = useReducer( reducer, initialData );

    function reducer(data: IInitialData,action: IAction){
        const {type, payload} = action
        // debugger
        switch (type){
            case Actions.PRISE:
                return {
                    ...data,
                    prise: payload
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




    useEffect( ()=>{
        firstPayHandler()
        monthPayHandler()
        contractAmountHandler()
    },[price,firstPay,term,monthPayCounted])

    const addSpacesToValue=(e:string)=>{
        return e.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }
    const deleteSpacesOfValue=(e:string)=>{
        return e.toString().replace(/[a-zа-яё]/gi, '').replace(/\s/g, '')
    }

    const fieldHandler =({value,min,max,fieldName,setStateFunc}:IFieldHandler):void =>{
        const handledValue = Math.min(Math.max(Number(value), min), max)
        setStateFunc(handledValue.toString())
        if(value !== handledValue.toString()){
            setError({
                rightValue: handledValue.toString(),
                errorValue: value,
                errorMessage: `Введенное вами значение автоматически было округлено до ${addSpacesToValue(handledValue.toString())}`,
                errorFieldName: fieldName
            })

            setTimeout( ()=>setError({errorValue: '',
                rightValue: '',
                errorMessage: '',
                errorFieldName: ''
            }), 5000)
        }
    }

    const firstPayHandler = () =>{
        let payCounted = 0
        payCounted = (+price)*(+firstPay)/100
        setFirstPayCounted(payCounted)
    }

    const monthPayHandler = () => {
        const monthPay = (+price - firstPayCounted) * ((0.035 * Math.pow((1 + 0.035), Number(term)))
            / (Math.pow((1 + 0.035), Number(term)) - 1));

        isFinite(monthPay) ? setMonthPayCounted(Math.ceil(monthPay)) : setMonthPayCounted(0)
    }

    const contractAmountHandler = () => {
        const amount = Math.ceil(firstPayCounted + (+term) * monthPayCounted)
        isFinite(amount) ? setAmount(amount) : setAmount(0)
    }


    const sendData = async () =>{
        const data = {
            "car_coast": +price,
            "initail_payment": +firstPayCounted,
            "initail_payment_percent": +firstPay,
            "lease_term": +term,
            "total_sum": +amount,
            "monthly_payment_from": +monthPayCounted
        }
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            setIsPending(true)
            const res =  await axios.post('https://hookb.in/eK160jgYJ6UlaRPldJ1P', data, { headers })
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
                        {/*<input*/}
                        {/*    type="text"*/}
                        {/*    name={'price'}*/}
                        {/*    id={'price'}*/}
                        {/*    value={addSpacesToValue(price.toString())}*/}
                        {/*    onChange={(e)=>setPrice(deleteSpacesOfValue(e.target.value))}*/}
                        {/*    onBlur={()=>fieldHandler({value: price, min:1000000, max:6000000, fieldName:'price', setStateFunc:setPrice})}*/}
                        {/*    className={s.inputField}*/}
                        {/*    disabled={isPending}*/}
                        {/*/>*/}
                        <input
                            type="text"
                            name={'price'}
                            id={'price'}
                            value={addSpacesToValue(data.prise.toString())}
                            onChange={(e)=>dispatch({type: Actions.PRISE, payload: e.target.value})}
                            onBlur={()=>fieldHandler({value: price, min:1000000, max:6000000, fieldName:'price', setStateFunc:setPrice})}
                            className={s.inputField}
                            disabled={isPending}
                        />
                        <span className={s.naming}>₽</span>
                    </div>

                    <InputRange
                        name={'price'}
                        id={'price'}
                        min={'1000000'}
                        max={'6000000'}
                        value={data.prise}
                        dispatch={dispatch}
                        isPending={isPending}
                        actionType={Actions.PRISE}
                    />
                </div>
                <div className={`${s.inputItem} ${(isPending || isFulfilled) && s.inputItem__disabled}`}>
                    <label htmlFor="firstPay">Первоначальный взнос</label>
                    <div className={s.inputWrapper }>
                        {Object.values(error).includes('firstPay') && <ErrorMessage errorMessage={error.errorMessage}/>}
                        <span className={s.firstPay}>{addSpacesToValue(firstPayCounted.toString())} ₽</span>
                        <div className={s.firstPayWrapper}>
                            {/*<input*/}
                            {/*    type="text"*/}
                            {/*    name={'firstPay'}*/}
                            {/*    id={'firstPay'}*/}
                            {/*    value={firstPay.concat('%')}*/}
                            {/*    onChange={(e)=>setFirstPay((e.target.value.replace(/[^0-9]/g,"")))}*/}
                            {/*    className={s.firstPayInput}*/}
                            {/*    onBlur={()=>fieldHandler({value:firstPay,min:10,max:60,fieldName:'firstPay',setStateFunc:setFirstPay})}*/}
                            {/*    disabled={isPending}*/}
                            {/*/>*/}
                            <input
                                type="text"
                                name={'firstPay'}
                                id={'firstPay'}
                                value={data.firstPay.concat('%')}
                                onChange={(e)=>dispatch({type: Actions.FIRSTPAY, payload: e.target.value.replace(/[^0-9]/g,"")})}
                                className={s.firstPayInput}
                                onBlur={()=>fieldHandler({value:firstPay,min:10,max:60,fieldName:'firstPay',setStateFunc:setFirstPay})}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <InputRange
                        name={'firstPay'}
                        id={'firstPay'}
                        min={'10'}
                        max={'60'}
                        value={firstPay}
                        dispatch={dispatch}
                        isPending={isPending}
                        actionType={Actions.FIRSTPAY}
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
                            value={term}
                            onChange={(e)=>setTerm(e.target.value)}
                            onBlur={()=>fieldHandler({value:term, min:1, max: 60, fieldName: 'term',setStateFunc: setTerm})}
                            className={s.inputField}
                            disabled={isPending}
                        />
                        <span className={s.naming}>мес.</span>
                    </div>

                    <InputRange
                        name={'term'}
                        id={'term'}
                        min={'1'}
                        max={'60'}
                        value={term}
                        inputHandler={setTerm}
                        isPending={isPending}
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

