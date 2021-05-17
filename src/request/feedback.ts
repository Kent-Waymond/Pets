import axios from './basicRequest';

// CreateFeedback
export function CreateFeedback({
  title,
  complainType,
  content,
  phone,
  image,
}: any) {
  return axios.appPost('/article/addComplain', {
    title,
    complainType,
    content,
    phone,
    image,
  });
}
// ModifyFeedback
export function ModifyFeedback({
  complainId,
  complainType,
  title,
  content,
  phone,
  image,
}: any) {
  return axios.appPost('/article/modifyComplain', {
    complainId,
    complainType,
    title,
    content,
    phone,
    image,
  });
}
// ListFeedback
export function ListFeedbacks({ pageNumber, pageSize }: any) {
  return axios.appPost(`/admin/complainList/${pageNumber}/${pageSize}`);
}
// ListFeedbacksToDeal
export function ListFeedbacksToDeal({ pageNumber, pageSize }: any) {
  return axios.appPost(`/admin/complainList/${pageNumber}/${pageSize}`);
}
// GetFeedback
export function GetFeedback({ FeedbackId }: any) {
  return axios.appPost(`/article/detailComplain/${FeedbackId}`);
}
// ListMyFeedbacks
export function ListMyFeedbacks({ pageNumber, pageSize }: any) {
  return axios.appPost(`/article/myComplainList/${pageNumber}/${pageSize}`);
}

// RemoveFeedback
export function RemoveFeedback({ complainId }: any) {
  return axios.appPost(`/article/delComplain/${complainId}`);
}
// DealFeedback
export function DealFeedback({ complainId, status }: any) {
  return axios.appPost('/admin/checkComplain', { complainId, status });
}
