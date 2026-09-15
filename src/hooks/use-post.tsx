import axios from "axios";

const usePost = async (url: string, body: any) => {
  url = import.meta.env['VITE_CURVI_API_BASE_URL'] + url;
  console.log('Debug: url >> ', url);
  let data: object = {};
  let error: string = '';
  let status: number = 0;

  try {
    const response = await axios.post(url, body, {
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
  
  return { data, error, status };
};

export default usePost;