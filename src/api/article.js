import request from '@/utils/request'

export const getArticleList = data => {
  return request.get('/admin/interview/query', {
    params: data
  })
}
