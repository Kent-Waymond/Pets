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
  return axios.appPost(`/article/essayListCommunity/${pageNumber}/${pageSize}`);
}
// SearchCommunity
export function SearchCommunitys({ Keyword, pageNumber, pageSize }: any) {
  return axios.appPost(
    `/article/essayListCommunity/${Keyword}/${pageNumber}/${pageSize}`,
  );
}
// GetCommunity
export function GetCommunity({ essayId }: any) {
  return axios.appPost(`/article/detailComplain/${essayId}`);
}
// RemoveCommunity
export function RemoveCommunity({ essayId }: any) {
  return axios.appPost(`/article/delEssay/${essayId}`);
}

// ListMyMoments
export function ListMyMoments({ pageNumber, pageSize }: any) {
  return axios.appPost(`/article/myEssayList/${pageNumber}/${pageSize}`);
}
// GetMyMoment
export function GetMyMoment({ momentId }: any) {
  return axios.appPost(`/article/detailComplain/${momentId}`);
}
// RemoveMyMoment
export function RemoveMyMoment({ momentId }: any) {
  return axios.appPost(`/article/delEssay/${momentId}`);
}
