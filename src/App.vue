<script setup>
import menuList from '@/router/routes'
import { useLayoutStore } from './stores/layout'
import { useUserStore } from '@/stores/user.js'

const route = useRoute()
const layoutStore = useLayoutStore()
const userStore = useUserStore()
const flag = ref(true)
watch(
  () => layoutStore.isRefresh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  }
)
</script>

<template>
  <el-container class="app-container" style="height: 100vh">
    <el-aside :class="{ expand: layoutStore.isExpand }" v-if="userStore.isLogin">
      <el-scrollbar>
        <Logo />
        <el-menu router :default-active="route.path" :collapse="!layoutStore.isExpand">
          <Menu :menu-list="menuList" />
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container direction="vertical">
      <Toolbar v-if="userStore.isLogin" />
      <el-main>
        <el-scrollbar :class="{ fill: !userStore.isLogin }" height="100%">
          <RouterView v-slot="{ Component }">
            <template v-if="Component">
              <Transition mode="out-in">
                <component :is="Component" v-if="flag"></component>
              </Transition>
            </template>
          </RouterView>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="less">
.app-container {
  .el-aside {
    overflow: hidden;
    width: 64px;

    &.expand {
      width: 250px;
    }
  }

  .el-main {
    --el-main-padding: 0;

    .el-scrollbar {
      height: calc(100vh - 60px);

      &.fill {
        height: 100vh;
      }

      ::v-deep(.el-scrollbar__view) {
        height: 100%;
      }
    }

    .v-enter-active,
    .v-leave-active {
      transition: opacity 0.5s ease;
    }

    .v-enter-from,
    .v-leave-to {
      opacity: 0;
    }
  }

  .el-menu {
    height: calc(100vh - 50px);
  }
}
</style>
