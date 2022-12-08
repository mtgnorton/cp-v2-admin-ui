import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/ruoyi'

export function getSiteInfo() {
  return request({
    url: '/site-info', method: 'get'
  })
}

export function listNode(query) {
  return request({
    url: '/node-list', method: 'get', params: query
  })
}

export function storeNode(query) {
  return request({
    url: '/node-store', method: 'post', params: query
  })
}

export function updateNode(query) {
  return request({
    url: '/node-update', method: 'put', params: query
  })
}

export function infoNode(query) {
  return request({
    url: '/node-info', method: 'get', params: query
  })
}

export function destroyNode(query) {
  return request({
    url: '/node-destroy', method: 'delete', params: query
  })
}

export function nodeDownloadRemoteImage(query) {
  return request({
    url: '/node-download-img', method: 'post', data: query
  })
}

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/user-list', method: 'get', params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/user-info', params: {
      id: praseStrEmpty(userId)
    }, method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/user-store', method: 'post', data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/user-update', method: 'put', data: data
  })
}

// 删除用户
export function delUser(Ids) {
  return request({
    url: '/user-destroy', params: {
      Ids: Ids
    }, method: 'delete'
  })
}

export function listPost(query) {
  return request({
    url: '/post-list', method: 'get', params: query
  })
}

export function auditPost(data) {
  return request({
    url: '/post-audit', method: 'post', data: data
  })
}

export function updatePost(data) {
  return request({
    url: '/post-update', method: 'put', data: data
  })
}

export function infoPost(id) {
  return request({
    url: '/post-info', params: {
      id: praseStrEmpty(id)
    }, method: 'get'
  })
}

export function delPost(id) {
  return request({
    url: '/post-destroy', params: {
      id: id
    }, method: 'delete'
  })
}

export function listReply(query) {
  return request({
    url: '/reply-list', method: 'get', params: query
  })
}

export function auditReply(data) {
  return request({
    url: '/reply-audit', method: 'post', data: data
  })
}

export function updateReply(data) {
  return request({
    url: '/reply-update', method: 'put', data: data
  })
}

export function delReply(id) {
  return request({
    url: '/reply-destroy', params: {
      id: id
    }, method: 'delete'
  })
}

export function sensitiveWordList(query) {
  return request({
    url: '/sensitive-word-list', method: 'get', params: query
  })
}

export function delSensitiveWord(ids) {
  return request({
    url: '/sensitive-word-destroy', data: ids, method: 'delete'
  })
}

export function addSensitiveWord(data) {
  return request({
    url: '/sensitive-word-store', method: 'post', data: data
  })
}

// 提示语

// 查询提示语列表
export function listPrompt(query) {
  return request({
    url: '/prompt-list', method: 'get', params: query
  })
}

// 查询提示语详细
export function getPrompt(userId) {
  return request({
    url: '/prompt-info', params: {
      id: praseStrEmpty(userId)
    }, method: 'get'
  })
}

// 新增提示语
export function addPrompt(data) {
  return request({
    url: '/prompt-store', method: 'post', data: data
  })
}

// 修改提示语
export function updatePrompt(data) {
  return request({
    url: '/prompt-update', method: 'put', data: data
  })
}

// 删除提示语
export function delPrompt(id) {
  return request({
    url: '/prompt-destroy', params: {
      id: id
    }, method: 'delete'
  })
}

// 查询邮件记录列表
export function listEmailRecord(query) {
  return request({
    url: '/email-record-list', method: 'get', params: query
  })
}

// 删除邮件记录
export function delEmailRecord(id) {
  return request({
    url: '/email-record-destroy', params: {
      id: id
    }, method: 'delete'
  })
}

// 节点分类

// 查询节点分类列表
export function listNodeCategory(query) {
  return request({
    url: '/node-category-list', method: 'get', params: query
  })
}

// 查询节点分类详细
export function infoNodeCategory(userId) {
  return request({
    url: '/node-category-info', params: {
      id: praseStrEmpty(userId)
    }, method: 'get'
  })
}

// 新增节点分类
export function storeNodeCategory(data) {
  return request({
    url: '/node-category-store', method: 'post', data: data
  })
}

// 修改节点分类
export function updateNodeCategory(data) {
  return request({
    url: '/node-category-update', method: 'put', data: data
  })
}

// 删除节点分类
export function destroyNodeCategory(id) {
  return request({
    url: '/node-category-destroy', params: {
      id: id
    }, method: 'delete'
  })
}

// 查询余额变动记录列表
export function listBalanceLogRecord(query) {
  return request({
    url: '/balance-log-list', method: 'get', params: query
  })
}

// 删除余额变动记录
export function delBalanceLogRecord(id) {
  return request({
    url: '/balance-log-destroy', params: {
      id: id
    }, method: 'delete'
  })
}

//
export function listAssociation(query) {
  return request({
    url: '/association-list', method: 'get', params: query
  })
}

export function indexStatistics() {
  return request({
    url: 'index', method: 'get'
  })
}
