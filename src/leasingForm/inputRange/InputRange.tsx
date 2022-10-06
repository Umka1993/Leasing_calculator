import React, {FC, useEffect, useState} from 'react';
import s from './inputRange.module.scss'
import {Actions, IAction} from "../../types";

interface IInputRange {
    name:string,
    id:string,
    min:string,
    max:string,
    value:string,
    actionType: Actions
    dispatch: (arg:IAction)=>void,
    isPending: boolean
    isFulfilled: boolean
}

export const InputRange:FC<IInputRange> = ({isFulfilled, name,id,min,max,value,dispatch, isPending, actionType}) => {
    const [rangeTrackSize, setRangeTrackSize] = useState(((+value - +min) * 100 / (+max - +min)))

    const inputRangeHandler = (val:string)=>{
        setRangeTrackSize(((+value - +min) * 100 / (+max - +min)))
        dispatch({type:actionType, payload:val})
    }

    useEffect( ()=>{
        inputRangeHandler(value)
    },[value])

    return (
        <>
            <input
                type="range"
                name={name}
                id={id}
                min={min}
                max={max}
                value={value}
                onChange={(e)=>inputRangeHandler(e.target.value)}
                className={s.inputRange}
                disabled={isPending || isFulfilled}
                style={{
                     backgroundSize: `${rangeTrackSize}% 100%`
                }}

            />
        </>
    );
};

