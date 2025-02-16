import { asyncRouterMap, constantRouterMap } from '@/router'
import { flatMultiLevelRoutes } from '@/utils/routerHelper'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { store } from '../index'

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    generateRoutes(): // type: 'admin' | 'test' | 'none',
    // routers?: AppCustomRouteRecordRaw[] | string[]
    Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []
        // if (type === 'admin') {
        //   // 模拟后端过滤菜单
        //   routerMap = generateRoutesFn2(routers as AppCustomRouteRecordRaw[])
        // } else if (type === 'test') {
        // 模拟前端过滤菜单
        // routerMap = generateRoutesFn1(cloneDeep(asyncRouterMap), routers as string[])
        // } else {
        // 直接读取静态路由表
        routerMap = cloneDeep(asyncRouterMap)
        // }
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // 渲染菜单的所有路由
        // 凭借不需要权限的界面constantRouterMap和需要权限的routerMap
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
