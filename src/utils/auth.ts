import { Base64 } from 'js-base64';

// app 认证token
const USER_TOKEN = '_ami_USER_token';

export function GET_USER_TOKEN() {
  return localStorage.getItem(USER_TOKEN) || '';
}

export function SET_USER_TOKEN(token: string) {
  localStorage.setItem(USER_TOKEN, token || '');
}

export function REMOVE_USER_TOKEN() {
  localStorage.removeItem(USER_TOKEN);
}

export function Check_USER_TOKEN(token?: string): boolean {
  let authToken = token;
  if (!authToken) {
    authToken = GET_USER_TOKEN();
  }
  if (authToken) {
    return true;
  }
  return false;
}

const IDENTITY = 'identity';

export function GET_IDENTITY() {
  return localStorage.getItem(IDENTITY) || '';
}

export function SET_IDENTITY(identity: string) {
  localStorage.setItem(IDENTITY, identity || '');
}

export function REMOVE_IDENTITY() {
  localStorage.removeItem(IDENTITY);
}

export function Check_IDENTITY(identity?: string): boolean {
  let authIdentity = identity;
  if (!authIdentity) {
    authIdentity = GET_IDENTITY();
  }
  if (authIdentity) {
    return true;
  }
  return false;
}
// const currentTimeMs = new Date().getTime();
// // const currentTime = Math.floor(currentTimeMs / 1000);
// const currentTime = 1605288110;
// const tokenArr = authToken.split('.');

// if (tokenArr.length > 1) {
//   const tokenPayload = tokenArr[1];
//   try {
//     console.log(tokenPayload, 'tokenPayload');
//     // 使用uuid进行鉴权  header Authorizatoin 使用Basic + Base64编码后的uuid
//     const tokenPayloadObj = JSON.parse(Base64.decode(tokenPayload));
//     console.log(tokenPayloadObj, 'objToken');

//     const expireTime = tokenPayloadObj['exp'];
//     if (currentTime < Number(expireTime)) {
//       return true;
//     }
//   } catch (e) {
//     console.error('illegal token ');
//   }
// }
