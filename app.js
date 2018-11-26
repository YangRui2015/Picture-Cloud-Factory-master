//app.js
App({
  globalData: {
    userInfo: {nickName:"匿名"},
    ratio: 1,
    id:"",
    setfind:true,
    setstyle:true,
    setadd:true,
    Server_url:'https://2333.mynatapp.cc',
    // Server_url: 'http://127.0.0.1:8080'
  },
  onLaunch: function () {
    // 展示本地存储能力
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code)
        if (res.code){
        wx.request({
          url: that.globalData.Server_url + "/getinfo", //接口地址
          data: { "code": res.code },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded'                     },
          success: function (res) {
            // console.log(res.data)
            that.globalData.id = res.data
          }
        })
        }
        else{
          console.log('获取用户登录态失败：' + res.errMsg);
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo
              console.log(res.userInfo.nickName)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.ratio = 375 / res.windowWidth;
      }
    })
  }
})