<script setup>
import { useUserStore } from '@/stores/user.js'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const formRef = ref(null)
const formData = reactive({
  username: '',
  password: ''
})

// 表单规则
const rules = reactive({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ]
})

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      login()
    } else {
      ElMessage({
        type: 'error',
        message: '请补全表单'
      })
    }
  })
}

defineOptions({
  name: 'Login'
})

const login = async () => {
  loading.value = true
  try {
    await userStore.login(formData)
    await router.replace({
      path: route.query.redirect || '/'
    })
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <el-row style="height: 100%" align="middle" justify="center">
      <el-card class="card-box" shadow="never">
        <el-row justify="center">
          <h2>用户登录</h2>
        </el-row>
        <el-row justify="center" style="margin-top: 20px">
          <el-form
            ref="formRef"
            size="large"
            style="width: 350px"
            :rules
            :model="formData"
            label-width="auto"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="formData.username" placeholder="请输入用户名" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                @keydown.enter="submitForm(formRef)"
                type="password"
                v-model="formData.password"
                placeholder="请输入密码"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 350px" :loading @click="submitForm(formRef)"
                >登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<style scoped lang="less">
.login-container {
  width: 100%;
  height: 100%;
  background: url('https://ts1.cn.mm.bing.net/th/id/R-C.748160bf925a7acb3ba1c9514bbc60db?rik=AYY%2bJ9WcXYIMgw&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50017%2f0822.jpg_wh1200.jpg&ehk=CMVcdZMU6xxsjVjafO70cFcmJvD62suFC1ytk8UuAUk%3d&risl=&pid=ImgRaw&r=0');

  .card-box {
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(4dp);
  }
}
</style>
