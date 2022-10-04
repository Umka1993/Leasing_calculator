import React, {FC} from 'react';
import s from "./errorMessage.module.scss";


interface IErrorMessage {
    errorMessage: string,
}

export const ErrorMessage:FC<IErrorMessage> = ({ errorMessage}) => {
    return (
        <>
            <p className={s.errorMessage}>{errorMessage}</p>
        </>
    );
};

