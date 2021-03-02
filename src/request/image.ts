import axios from './basicRequest';

// 镜像列表 /v1/image/listImages
export function ListImages({ Keyword, ListAll, PageNumber, PageSize }: any) {
  return axios.appPost('/image/listImages', {
    keywords: Keyword,
    pageNumber: PageNumber,
    pageSize: PageSize,
    listAll: ListAll,
  });
}
