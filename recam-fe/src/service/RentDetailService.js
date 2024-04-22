import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:9988/rentdetails';

export const listRentDetailByRentId = (id) => axios.get(`${REST_API_BASE_URL}/getRentDetailsByRentId/${id}`);
export const listRentDetail = () => axios.get(REST_API_BASE_URL + '/getRentDetails/');
export const addRentDetail = (rent) => axios.post(REST_API_BASE_URL + '/addRentDetail',rent);