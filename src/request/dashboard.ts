import axios from './basicRequest';

// 种类 已经打的疫苗数 这个种类的宠物数量 宠物应该打的疫苗数量
// 一个接口返回全部数据  在Service中根据dashboard进行数据分类整理
// 宠物总数、接种率（已经打的疫苗数/该种类数量*应该打的疫苗数量）
// 宠物总览 每个种类的数量
// 疫苗总览  每个种类已接种的数量

// 获取所有数据
export function GetAllDataForDashboard() {
  return axios.appGet('/user/showPetVaccineCount');
}

export function ListNoticeRecords() {
  return axios.appGet('/user/getAllNotices');
}
export function GetNoticeProfile({ noticeId }: any) {
  console.log(noticeId, 'axisi');
  return axios.appGet(`/user/notice/detail/${noticeId}`);
}
export function DeleteNotice({ noticeId }: any) {
  return axios.appGet(`/admin/delNotice/${noticeId}`);
}

// 创建公告
export function CreateNotice({ title, noticeType, content }: any) {
  return axios.appPost('/admin/addNotice', { title, noticeType, content });
}
