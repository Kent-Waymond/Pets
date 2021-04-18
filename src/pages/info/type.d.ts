export interface PetRecord {
  petId: string;
  petUserId: string;
  petName: string;
  petSpecies: string;
  petImage: string;
  age: string;
  gender: string;
  status: string;
  petTypeId: string;
  vaccineImage: string;
}

export interface PetProfile extends PetRecord {}

export interface UserRecord {
  userId: string;
  userName: string;
  password: string;
  nickname: string;
  locationId: string;
  type: number;
  phone: string;
  avatar: string;
  detailAddress: string;
  times: number;
  email: string;
}
export interface UserPetsRecord {
  petName: string;
  petSpecies: string;
  petImage: string;
  age: string;
  gender: string;
  status: string;
  petTypeId: string;
}
export interface UserProfile extends UserRecord {}
