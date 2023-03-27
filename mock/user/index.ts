import { config } from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'

const { result_code } = config

const timeout = 1000

const List: {
  name: string
  username: string
  school: string
  grade: string
  clazz: string
  type: string
  token: string
}[] = [
  {
    username: 'admin',
    name: 'test',
    school: '123',
    grade: '',
    clazz: '',
    type: 'teacher',
    token: '123'
  }
]

export default [
  // 列表接口
  {
    url: '/api/user/list',
    method: 'get',
    response: ({ query }) => {
      const { username, pageIndex, pageSize } = query

      const mockList = List.filter((item) => {
        if (username && item.username.indexOf(username) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )

      return {
        code: result_code,
        data: {
          total: mockList.length,
          list: pageList
        }
      }
    }
  }
  // // 登录接口
  // {
  //   url: '/user/login',
  //   method: 'post',
  //   timeout,
  //   response: ({ body }) => {
  //     return {
  //       code: result_code,
  //       data: List[0]
  //     }
  //   }
  // },
  // 退出接口
  // {
  //   url: '/api/user/loginOut',
  //   method: 'get',
  //   timeout,
  //   response: () => {
  //     return {
  //       code: result_code,
  //       data: null
  //     }
  //   }
  // }
] as MockMethod[]
