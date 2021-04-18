import axios from './basicRequest';

export function Login({ phone, password }: any) {
  return axios.appPost('/user/login', {
    phone,
    password,
  });
}

export function Logout() {
  return axios.appPost('/logout');
}
