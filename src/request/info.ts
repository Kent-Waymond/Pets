import axios from './basicRequest';

// CreateUser
export function CreateUser({
  email,
  code,
  phone,
  detailAddress,
  userName,
}: any) {
  return axios.appPost(`/admin/register/${code}`, {
    email,
    phone,
    detailAddress,
    userName,
  });
}
// CreatePet
export function CreatePet({
  petName,
  petSpecies,
  petImage,
  age,
  gender,
  status,
}: any) {
  return axios.appPost('/user/claim', {
    petName,
    petSpecies,
    petImage,
    age,
    gender,
    status,
  });
}
// GetPetProfile
export function GetPetProfile({ petId }: any) {
  return axios.appPost(`/pet/detail/${petId}`);
}
// RemovePet
export function RemovePet({ petId }: any) {
  return axios.appPost(`/pet/del/${petId}`);
}
// UpdatePet
export function UpdatePet({ petId, petName, petImage, age, status }: any) {
  return axios.appPost('/pet/modifyPetMessage', {
    petId,
    petName,
    petImage,
    age,
    status,
  });
}

// ListPetRecords
export function ListPetRecords({ Keyword, PageNumber, PageSize }: any) {
  return axios.appGet('/admin/allPets');
}

// SearchPetRecords
export function SearchPetRecords({ species }: any) {
  return axios.appGet(`/admin/findPet/${species}`);
}

// ListAllUsers
export function ListAllUsers({ Keyword, PageNumber, PageSize }: any) {
  return axios.appGet('/admin/allUsers');
}
// sendCode
export function sendCode({ email }: any) {
  return axios.appGet(`/admin/isUserRegistered/${email}`);
}

// 删除实例 /v1/instance/removeInstance
export function StartInstances({ id }: any) {
  return axios.appPost('/instance/startInstance', { id });
}

// 删除实例 /v1/instance/removeInstance
export function RemoveInstances({ Ids }: any) {
  return axios.appPost('/instance/removeInstance', { Ids });
}
