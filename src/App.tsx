import React from 'react';
import './assets/styles/main.scss';
import './assets/styles/variables.scss';
import {LeasingForm} from "./leasingForm/LeasingForm";

export const App = () => {
  return (
      <div className={'container'}>
            <LeasingForm
                headline={'Рассчитайте стоимость автомобиля в лизинг'}
            />
      </div>
  );
}


