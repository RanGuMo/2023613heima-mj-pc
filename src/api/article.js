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

// 删除面经
export const removeArticle = id => {
  return request.delete('/admin/interview/remove', {
    data: {
      id
    }
  })
}

// 回显面经
export const getArticleDetail = id => {
  return request.get('/admin/interview/show', {
    params: {
      id
    }
  })
}

// 更新面经
export const updateArticle = data => {
  return request.put('/admin/interview/update', data)
}

