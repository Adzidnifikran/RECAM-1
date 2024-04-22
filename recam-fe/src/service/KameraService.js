import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:9988/users';

export const listCamera = () => axios.get(REST_API_BASE_URL + '/getCameras');
export const createCamera = (camera) => axios.post(REST_API_BASE_URL + '/addCamera',camera);
export const getCameraById = (id) => axios.get(`${REST_API_BASE_URL}/getCamera/${id}`);
export const updateCamera = (camera) => axios.post(`${REST_API_BASE_URL}/updateCamera`, camera);
export const deleteCamera = (camera) => axios.post(`${REST_API_BASE_URL}/deleteCamera`, camera);
