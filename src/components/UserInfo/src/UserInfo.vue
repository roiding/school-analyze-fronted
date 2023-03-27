<script setup lang="ts">
import { loginOutApi } from '@/api/login'
import { UserType } from '@/api/login/types'
import { useCache } from '@/hooks/web/useCache'
import { useDesign } from '@/hooks/web/useDesign'
import { useI18n } from '@/hooks/web/useI18n'
import { resetRouter } from '@/router'
import { useAppStore } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const appStore = useAppStore()

const tagsViewStore = useTagsViewStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const { t } = useI18n()

const { wsCache } = useCache()

const { replace } = useRouter()

const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(async () => {
      const res = await loginOutApi().catch(() => {})
      if (res) {
        wsCache.clear()
        tagsViewStore.delAllViews()
        resetRouter() // 重置静态路由表
        replace('/login')
      }
    })
    .catch(() => {})
}

const changePassword = () => {
  //TODO
  window.open('https://element-plus-admin-doc.cn/')
}
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click">
    <div class="flex items-center">
      <img
        src="@/assets/imgs/avatar.jpg"
        alt=""
        class="w-[calc(var(--logo-height)-25px)] rounded-[50%]"
      />
      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">{{
        (wsCache.get(appStore.getUserInfo) as UserType).name
      }}</span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <div @click="changePassword">{{ t('common.changePassWord') }}</div>
        </ElDropdownItem>
        <ElDropdownItem divided>
          <div @click="loginOut">{{ t('common.loginOut') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
