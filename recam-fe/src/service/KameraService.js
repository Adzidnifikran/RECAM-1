import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:9988/users';

export const listCamera = () => axios.get(REST_API_BASE_URL + '/getUsers');
export const createCamera = (camera) => axios.post(REST_API_BASE_URL + '/addCamera',camera);
export const getCameraById = (id) => axios.get(`${REST_API_BASE_URL}/getCamera/${id}`);
export const updateCamera = (camera, id) => axios.put(`${REST_API_BASE_URL}/updateCamera/${id}`, camera);
export const deleteCamera = (id,camera) => axios.delete(`${REST_API_BASE_URL}/deleteCamera/${id}`,camera);