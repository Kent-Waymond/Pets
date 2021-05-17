import axios from './basicRequest';

// CreateCMoment
export function CreateCMoment({
  title,
  essayContent,
  essayRange,
  essayType,
}: any) {
  return axios.appPost('/article/addEssay', {
    title,
    essayContent,
    essayRange,
    essayType,
  });
}
// ListCommunity
export function ListCommunitys({ pageNumber, pageSize }: any) {
  return axios.appGet(`/article/essayListCommunity/${pageNumber}/${pageSize}`);
}
// SearchCommunity
export function SearchCommunitys({ Keyword, pageNumber, pageSize }: any) {
  return axios.appGet(
    `/article/searchComm/${Keyword}/${pageNumber}/${pageSize}`,
  );
}
// GetCommunity
export function GetCommunity({ essayId }: any) {
  return axios.appPost(`/article/detailComplain/${essayId}`);
}
// RemoveCommunity
export function RemoveCommunity({ essayId }: any) {
  return axios.appGet(`/article/delEssay/${essayId}`);
}
export function UploadImage({ name, CurrentUserID }: any) {
  const formDate = new FormData();
  formDate.append('name', name);
  return axios.appPost(`/file/upload/${CurrentUserID}`, formDate, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// ListMyMoments
export function ListMyMoments({ pageNumber, pageSize }: any) {
  return axios.appGet(`/article/myEssayList/${pageNumber}/${pageSize}`);
}
// GetMyMoment
export function GetMyMoment({ momentId }: any) {
  return axios.appPost(`/article/detailComplain/${momentId}`);
}
// RemoveMyMoment
export function RemoveMyMoment({ momentId }: any) {
  return axios.appPost(`/article/delEssay/${momentId}`);
}
