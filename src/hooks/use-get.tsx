import axios from "axios";

const useGet = async (url: string) => {
    url = import.meta.env['VITE_CURVI_API_BASE_URL'] + url;
    let data: object = {};
    let error = '';
    let status = 0;

    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        data = response.data;
        status = response.status;
    } catch (err: any) {
        error = err.response?.data?.message;
        status = err.response?.status || 0;
    }

    return { data, error, status }
};

export default useGet;