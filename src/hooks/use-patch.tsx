import { TOKEN_KEY } from "@/enums/token";
import axios from "axios";

async function usePatch<T = any>(url: string, body: any) {
  url = import.meta.env['VITE_CURVI_API_BASE_URL'] + url;
  console.log('Debug: url >> ', url);
  let data: T = {} as T;
  let error: boolean = false;
  let errorMessage: string = '';

  try {
    const response = await axios.patch(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      },
    });
    data = response.data;
    error = false;
    errorMessage = '';
  } catch (err: any) {
    error = true;
    errorMessage = err.response?.data?.message || 'An error occurred';
  }
  
  return { data, error, errorMessage };
};

export default usePatch;