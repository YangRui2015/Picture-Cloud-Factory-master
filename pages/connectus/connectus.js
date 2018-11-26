var app=getApp()
//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    msg:'点击发送',
    info:"Version: 1.2.0\nVersion Introduction:Fixed some bugs of the front-end, and constrained the number of visits.\nDeveloped & designed by: Yang Rui\nEmail: yang-r15@mails.tsinghua.edu.cn",
    notice:"",
    Server_url:app.globalData.Server_url
  },

  /**
   * 发送信息
   */
  send: function (e) {
    let that = this;
    
    console.log(e.detail.value)
    let message = e.detail.value["text"]
    if (message=='ID'){
      that.setData({
        notice: "恭喜您发现了彩蛋，您的ID是：" + app.globalData.id
      })
      return
    }
    if(message.length>0){
      wx.showToast({
        icon: "loading",
        title: "正在发送......",
        duration: 1000
      })
      wx.request({
        url: that.data.Server_url + '/send',
        data: { "message": message,
        "nickname":app.globalData.userInfo.nickName},
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          console.log(res.data);
          if (res.statusCode == 200) {
            wx.showModal({
              title: '提示',
              content: String(res.data),
              showCancel: false,
            })
          }
        },
        fail: function (e) {
          console.log(e);
          wx.showModal({
            title: '提示',
            content: '发送失败',
            showCancel: false,
            duration: 1000
          })
        },
        complete: function () {
          wx.hideToast();  //隐藏Toast
        }
      })
    }
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})


