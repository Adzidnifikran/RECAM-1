import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:9988/rents';

export const listRent = () => axios.get(REST_API_BASE_URL + '/getRents');
export const addRent = (rent) => axios.post(REST_API_BASE_URL + '/addRent',rent);
export const updateRent = (rent) => axios.post(`${REST_API_BASE_URL}/updateRent`, rent);
