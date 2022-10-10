export enum Actions {
    PRICE= 'price',
    FIRSTPAY = 'firstPay',
    TERM='term'
}
export interface IAction {
    type: Actions;
    payload: string;
}
export interface IInitialData {
    price: string,
    firstPay:string,
    term: string
}

export interface IFieldHandler {
    min: number,
    max: number,
    action: IAction
}

