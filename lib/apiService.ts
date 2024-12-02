import axios, { AxiosRequestConfig, Method,AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const baseUrl = 'https://rare-finds.vercel.app/api/';

const setToken =async (token: string | null) => {
  if (token) {
   await AsyncStorage.setItem('token', token);
  } else {
   await AsyncStorage.clear();
  }
};

const request = async <T>(endpoint: string, method: Method = 'GET', data?: any): Promise<AxiosResponse<T>> => {
  try {
    const url = `${baseUrl}${endpoint}`;
    const token = await AsyncStorage.getItem('token');
    console.log(token)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: AxiosRequestConfig = {
      url,
      method,
      headers,
      data,
    };

    const response = await axios(config);

    return response;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

const exec = async <T>(endpoint: string, data?: any, method: Method = 'POST'): Promise<AxiosResponse<T>> => {
  return request<T>(endpoint, method, data);
};
const getUser =async  ()=>{
  try {
      const res = await request("users/profile","GET")
      console.log(res.data)
      return res.data    
  } catch (error) {
      console.log(error)
      return null
  }
}
export { setToken, request, exec,getUser };
