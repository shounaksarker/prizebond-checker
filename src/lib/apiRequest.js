import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiRequest = async ({
  method = 'GET',
  url,
  data,
  headers = {},
  requiresAuth = true,
  ...rest
}) => {
  try {
    const token = localStorage.getItem('token');
    
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...(requiresAuth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      ...rest,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};