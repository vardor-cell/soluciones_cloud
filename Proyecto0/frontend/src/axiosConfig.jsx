import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
});

axiosInstance.interceptors.response.use(
    
    (response) => response,
    (error) => {
        console.log(error.response.status);
        if (error.response && error.response.status === 401) {
            console.log("Invalid token")
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
