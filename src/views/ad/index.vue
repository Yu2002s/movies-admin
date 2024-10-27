<script setup>
import * as echarts from 'echarts'

defineOptions({
  name: 'AD'
})

const BASE_URL = 'http://api.zaibiao.cn'
const profitData = ref({})
const profitEcharts = ref({})
const profitEchartsRef = ref()

onMounted(() => {
  profitEcharts.value = echarts.init(profitEchartsRef.value)
  getUserInfo()
})

const getUserInfo = async () => {
  const res = await fetch(`${BASE_URL}/admin/userinfo`, {
    method: 'GET',
    headers: {
      Sessiontoken: localStorage.getItem('ad_token')
    }
  }).then((res) => res.json())
  console.log(res)
  if (res.code === 0) {
    // 登录成功的
    await getHomeData()
  } else {
    localStorage.removeItem('ad_token')
    await login()
  }
}

const login = async () => {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      Referer: 'http://admore.zaibiao.cn/',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'dyys',
      password: 'aPxt2M11'
    })
  }).then((res) => res.json())
  if (res.code === 0) {
    localStorage.setItem('ad_token', res.result)
  }
}

const getHomeData = async () => {
  const res = await fetch(`${BASE_URL}/`, {
    method: 'GET',
    headers: {
      Sessiontoken: localStorage.getItem('ad_token')
    }
  }).then((res) => res.json())

  if (res.code === 0) {
    profitData.value = res.result.profit_data
    const chartsData = res.result.charts
    profitEcharts.value.setOption({
      title: {
        text: '收益统计'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['点击总数', '总点击率', '总预估收入', '展示总数',]
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartsData.labels
      },
      yAxis: {
        type: 'value'
      },
      series: [
        chartsData.datasets.click,
        chartsData.datasets.click_rate,
        chartsData.datasets.profit,
        chartsData.datasets.show
      ]
    })
  }
}
</script>

<template>
  <div class="ad-container">
    <el-card style="margin: 20px 0">
      <h3 style="font-size: 18px; font-weight: 600">收益信息</h3>
      <div class="profile-data">
        <div class="profile-item">
          <p style="font-size: 24px">{{ profitData.profit_yesterday }}</p>
          <p>昨日收益</p>
        </div>
        <div class="profile-item">
          <p style="font-size: 24px">{{ profitData.profit_seven_day }}</p>
          <p>过去7天收益</p>
        </div>
        <div class="profile-item">
          <p style="font-size: 24px">{{ profitData.profit_month_start }}</p>
          <p>本月累计收益</p>
        </div>
        <div class="profile-item">
          <p style="font-size: 24px">{{ profitData.profit_all }}</p>
          <p>总收益</p>
        </div>
      </div>
    </el-card>
    <el-card style="margin: 20px 0">
      <div ref="profitEchartsRef" style="height: 400px; width: 100%;"></div>
    </el-card>
  </div>
</template>

<style scoped lang="less">
.ad-container {
  width: 100%;
  padding: 0 20px;
  overflow: hidden;

  .ad-view {
    width: 100%;
    height: 100%;
    border: none;
  }

  .profile-data {
    display: flex;
    align-items: center;
    justify-content: space-around;

    .profile-item {
      text-align: center;
    }
  }
}
</style>
