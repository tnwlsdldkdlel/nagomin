import axios from 'axios';
import Cookies from 'js-cookie';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: '/v1',
    timeout: 5000, // 요청 타임아웃 설정
});

// Request Interceptor: 모든 요청에 JWT를 추가
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('jwt');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
