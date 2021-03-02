import axios from './basicRequest';

export function Login({ Username, Password }: any) {
  return axios.appPost('/user/login', {
    user_phonenumber: Username,
    user_password: Password,
  });
}

export function Logout() {
  return axios.appPost('/logout');
}
