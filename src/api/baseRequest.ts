import axios from 'axios';

const defaultConfig = {
    baseURL: 'https://hookb.in/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
};

export const api = axios.create(defaultConfig);
