import {jwtDecode} from 'jwt-decode';

export const decodeToken = (token) => {
  try {
    if(token===null){
      return null
    }
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return null;
  }
};
