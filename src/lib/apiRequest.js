import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const apiRequest = async ({
  method = 'GET',
  url,
  data,
  headers = {},
  requiresAuth = true,
  ...rest
}) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      withCredentials: true, // Important: This sends cookies with requests
      ...rest,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};