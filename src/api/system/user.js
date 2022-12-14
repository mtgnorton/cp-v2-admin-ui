import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/ruoyi'

// 查询用户列表
export function listAdministrator(query) {
  return request({
    url: '/administrator-list', method: 'get', params: query
  })
}

// 查询用户详细
export function getAdministrator(userId) {
  return request({
    url: '/administrator-info', params: {
      id: praseStrEmpty(userId)
    }, method: 'get'
  })
}

// 新增用户
export function addAdministrator(data) {
  return request({
    url: '/administrator-store', method: 'post', data: data
  })
}

// 修改用户
export function updateAdministrator(data) {
  return request({
    url: '/administrator-update', method: 'put', data: data
  })
}

// 删除用户
export function delAdministrator(Ids) {
  return request({
    url: '/administrator-destroy', params: {
      Ids: Ids
    }, method: 'delete'
  })
}

// 导出用户
export function exportAdministrator(query) {
  return request({
    url: '/system/user/export', method: 'get', params: query
  })
}

// 用户密码重置
export function resetAdministratorPwd(userId, password) {
  const data = {
    userId, password
  }
  return request({
    url: '/system/user/resetPwd', method: 'put', data: data
  })
}

// 用户状态修改
export function changeAdministratorStatus(userId, status) {
  const data = {
    userId, status
  }
  return request({
    url: '/system/user/changeStatus', method: 'put', data: data
  })
}

// 查询用户个人信息
export function getAdministratorProfile() {
  return request({
    url: '/personal-info', method: 'get'
  })
}

// 修改用户个人信息
export function updateAdministratorProfile(data) {
  return request({
    url: '/personal-update', method: 'put', data: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/personal-avatar', method: 'post', data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate', method: 'get'
  })
}
