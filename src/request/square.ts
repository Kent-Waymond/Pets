import axios from './basicRequest';

// CreateCMoment
export function CreateSMoment({
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
// ListSquare
export function ListSquares({ pageNumber, pageSize }: any) {
  return axios.appPost(`/article/essayListSquare/${pageNumber}/${pageSize}`);
}
// SearchSquares
export function SearchSquares({ Keyword, pageNumber, pageSize }: any) {
  return axios.appPost(
    `/article/searchSqu/${Keyword}/${pageNumber}/${pageSize}`,
  );
}
// GetSquare
export function GetSquare({ essayId }: any) {
  return axios.appPost(`/article/detailComplain/${essayId}`);
}
// RemoveSquare
export function RemoveSquare({ essayId }: any) {
  return axios.appPost(`/article/delEssay/${essayId}`);
}
