//index.js
//获取应用实例
var Util = require('../../utils/util.js');
Page({
  data: {
    latestTopics: []
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
      url: 'https://www.v2ex.com/api/topics/latest.json',
      method: 'GET',
      success: function (res) {
        if (!res.data.message) {
          for (var p in res.data) {
            res.data[p].created = Util.formatTime(Util.transLocalTime(res.data[p].created))
          }
          that.setData({
            latestTopics: res.data
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

  }
})