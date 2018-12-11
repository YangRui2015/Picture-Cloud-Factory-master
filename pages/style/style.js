var app=getApp()
//find.js
//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    msg:'上传图片',
    haveload: false,
    choose: 0,
    local_image:'',
    show_image: '../image/7.jpg',
    real_show: '../image/7.jpg',
    img_list: ['../image/12.jpg', '../image/9.jpg', '../image/13.jpg', '../image/10.jpg', '../image/11.jpg','../image/7.jpg'],
    ratio:1,
    timestart:0,
    timeend:0,
    Server_url:app.globalData.Server_url
  },
 
  /**
   * load图片到
   */
  upload: function () {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认1
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        wx.showToast({
          title: '',
          icon: 'loading',
          mask: true,
        })  
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        that.setData({
          show_image: tempFilePaths[0],
          real_show: tempFilePaths[0],
          local_image: tempFilePaths[0],
          haveload:true
        })
      }
    })
  },
    

  /**
   * 选择风格
   */
  select: function (e) {
    let that = this;
    if (app.globalData.setstyle){
    if (that.data.haveload){
    var ratio = app.globalData.ratio;
    var current = parseInt((e.currentTarget.offsetLeft * ratio) / 125);
    console.log(current)
    that.setData(
      {
        choose: current
      }
    )
    // console.log(that.data.show_image)
    wx.showToast({
      icon: "loading",
      title: "正在生成，请稍等...",
      duration: 1500,
      mask: true
    }),
      wx.uploadFile({
        url: that.data.Server_url + "/style",
        filePath: that.data.local_image,
        name: 'file',
      header: { "Content-Type": "multipart/form-data", "model": String(current), 'user': app.globalData.id},
        formData: {
          //和服务器约定的token, 一般也可以放在header中
          'filename': that.data.local_image,
          'nickname': app.globalData.userInfo.nickName
        },
        success: function (res) {
          console.log(res);
          if (res.data.endsWith(".JPG") || res.data.endsWith(".jpg") || res.data.endsWith(".png") || res.data.endsWith(".jpeg")) {
            var FilePath = res.data;  // 更新图片
            let SmallPath = res.data.replace("_t.jpg","_s.jpg")
            if (res.statusCode == 200) {
              console.log(FilePath)
              that.setData({  //上传成功修改图片列表
                show_image: FilePath,
                real_show:SmallPath
              })
              console.log(that.data.show_image)
            }
          }
          else {
            wx.showModal({
              title: '提示',
              content: res.data,
              showCancel: false,
            })
            if (res.data == "您今日使用次数已达上限。") {
              app.globalData.setstyle = false
            }
          }

        },
        fail: function (e) {
          console.log(e);
          wx.showModal({
            title: '提示',
            content: '上传服务器失败',
            showCancel: false,
            duration: 1000
          })
        },
        complete: function () {
          wx.hideToast();  //隐藏Toast
        }
    })
    }
  }
  else{
      wx.showModal({
        title: '提示',
        content: "您今日使用次数已达上限",
        showCancel: false,
      })
  }
  },
    

// 点击开始的时间  
  timestart: function (e) {
    var _this = this;
    _this.setData({ timestart: e.timeStamp });
  },
  //点击结束的时间
  timeend: function (e) {
    var _this = this;
    _this.setData({ timeend: e.timeStamp });
  },

  //保存图片
  saveImg: function (e) {
    var _this = this;
    if (_this.data.show_image != "../image/7.jpg") {

      var times = _this.data.timeend - _this.data.timestart;
      if (times > 300) {
        console.log("长按");
        wx.getSetting({
          success: function (res) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: function (res) {
                console.log("授权成功");
                wx.showToast({
                  icon: "loading",
                  title: "正在下载......",
                  duration: 500
                }),
                // 下载成功后再保存到本地
                wx.downloadFile({
                  url: _this.data.show_image,
                  success: function (res) {
                    console.log(res.tempFilePath)
                    wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                      success: function (res) {
                        wx.showToast({
                          title: '已保存到相册',
                          icon: 'success'
                        })
                      },
                      fail: function (res) {
                        console.log('保存失败')
                        wx.showToast({
                          title: '保存失败',
                          showCancel: false
                        })
                      }
                    })
                  },
                  fail: function (res) {
                    console.log('下载失败')
                    wx.showToast({
                      title: '下载失败',
                      showCancel: false
                    })
                  }
                })
              }
            })
          }
        })
      }
      else {
          wx.previewImage({
            urls: [_this.data.show_image],
            //这根本就不走
            success: function (res) {
              console.log(res);
            },
            //也根本不走
            fail: function () {
              console.log('fail')
            }
          })
      }
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


