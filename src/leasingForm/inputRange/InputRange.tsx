import React, {FC} from 'react';
import s from './inputRange.module.scss'
import {Actions, IAction} from "../LeasingForm";

interface IInputRange {
    name:string,
    id:string,
    min:string,
    max:string,
    value:string,
    actionType: Actions
    dispatch: (arg:IAction)=>void,
    isPending: boolean
}

export const InputRange:FC<IInputRange> = ({name,id,min,max,value,dispatch, isPending, actionType}) => {
    return (
        <>
            <input
                type="range"
                name={name}
                id={id}
                min={min}
                max={max}
                value={value}
                onChange={(e)=>dispatch({type:actionType, payload:e.target.value})}
                className={s.inputRange}
                disabled={isPending}
            />
        </>
    );
};

