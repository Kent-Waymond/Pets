export interface PetVaccineRecord {
  petId: string;
  petName: string;
  vaccineId: string;
  vaccineName: string;
  vaccineType: number;
  vaccinePetType: string;
  vaccineStatus: string;
  injectTime: number;
}

export interface VaccineProfile extends PetVaccineRecord {}

export interface VaccineRecord {
  vaccineId: string;
  vaccineName: string;
  vaccineType: string;
  vaccinePetType: string;
  createTime: string;
  remarks: string;
}
