//index.js
//获取应用实例
var Util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    hotTopics: []
  },
  //话题详情页面跳转动作
  onTouch: function (event) {
    wx.navigateTo({
      url: '../post/post?id=' + event.currentTarget.id,
    })
  },
  //个人详情页面跳转动作
  myUserInfo: function (event) {
    wx.navigateTo({
      url: '../user/user?id=' + event.currentTarget.id,
    })
  },

  onLoad: function () {
    wx.showLoading({
      title: "拼命加载中"
    })
    var that = this
    wx.request({
      url: 'https://www.v2ex.com/api/topics/hot.json',
      method: 'GET',
      success: function (res) {
        if (!res.data.message) {//判断api调用次数是否limited
          for (var p in res.data) {//格式化日期
            res.data[p].created = Util.formatTime(Util.transLocalTime(res.data[p].created))
          }
          that.setData({
            hotTopics: res.data
          })
          wx.hideLoading()
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.message,
            image: '../../images/error.png',
            duration: 2000
          })
        }

      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'V2EX社区-HEROi',
      path: 'pages/index/index',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 1000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '分享失败',
          image: '../../images/error.png',
          duration: 1000
        })
      }
    }
  }
})