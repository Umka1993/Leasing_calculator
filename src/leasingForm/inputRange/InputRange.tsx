import React, {FC} from 'react';
import s from './inputRange.module.scss'

interface IInputRange {

    name:string,
    id:string,
    min:string,
    max:string,
    value:string,
    inputHandler: (arg: string)=>void
}

export const InputRange:FC<IInputRange> = ({name,id,min,max,value,inputHandler}) => {
    return (
        <>
            <input
                type="range"
                name={name}
                id={id}
                min={min}
                max={max}
                value={value}
                onChange={(e)=>inputHandler(e.target.value)}
                className={s.inputRange}
            />
        </>
    );
};

