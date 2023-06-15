import request from '@/utils/request'

export const getArticleList = data => {
  return request.get('/admin/interview/query', {
    params: data
  })
}

// 创建面经
export const createArticle = data => {
  return request.post('/admin/interview/create', data)
}
