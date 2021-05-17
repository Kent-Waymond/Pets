import axios from './basicRequest';

// CreateVaccine
export function CreateVaccine({
  vaccineName,
  vaccineType,
  vaccinePetType,
  comment,
}: any) {
  return axios.appPost('/admin/addVaccine', {
    vaccineName,
    vaccineType,
    vaccinePetType,
    comment,
  });
}
// ListVaccine
export function ListVaccines({ PageNumber, PageSize }: any) {
  return axios.appGet(`/pet/allVaccine/${PageNumber}/${PageSize}`);
}

// ListAuditVaccines
export function ListAuditVaccines({ PageNumber, PageSize }: any) {
  return axios.appGet(`/admin/injectList/${PageNumber}/${PageSize}`);
}
// SearchVaccine
export function SearchVaccine({ Keyword, species }: any) {
  return axios.appGet(`/admin/findVaccine/${Keyword}`);
}
// DeleteVaccine
export function DeleteVaccine({ vaccineId }: any) {
  return axios.appGet(`/admin/delVaccine/${vaccineId}`);
}
// AuditVaccine
export function AuditVaccine({ vaccineId, status }: any) {
  return axios.appPost('/admin/checkInject', { id: vaccineId, status });
}
// UploadLicense
export function UploadLicense({ VaccineId, PetProfileId, petImage }: any) {
  return axios.appPost('/pet/addInjectVaccine', {
    VaccineId,
    PetProfileId,
    petImage,
  });
}
