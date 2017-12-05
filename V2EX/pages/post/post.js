var Util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: [],
    comment: [],
    count: 0,
    allComment: []
  },

  myUserInfo: function (event) {
    wx.navigateTo({
      url: '../user/user?id=' + event.currentTarget.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载主题中"
    })
    var that = this
    wx.request({
      url: 'https://www.v2ex.com/api/topics/show.json?id=' + options.id,
      method: 'GET',
      success: function (res) {
        if (!res.data.message) {
          res.data[0].created = Util.formatTime(Util.transLocalTime(res.data[0].created))
          that.setData({
            post: res.data[0]
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
    wx.showLoading({
      title: "加载评论中"
    })
    wx.request({
      url: 'https://www.v2ex.com/api/replies/show.json?topic_id=' + options.id,
      method: 'GET',
      success: function (res) {
        if (!res.data.message) {
          for (var p in res.data) {
            res.data[p].created = Util.formatTime(Util.transLocalTime(res.data[p].created))
          }
          that.setData({
            allComment: res.data
          })
          if (res.data[that.data.count]) {
            var tempList = []
            for (var p = that.data.count; res.data[p] != null && p < (that.data.count + 10); p++) {
              tempList[p] = res.data[p]
            }
            that.setData({
              count: p,
              comment: tempList
            })
          } else {
            console.log("初始评论获取为空")
          }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.allComment[that.data.count]) {
      var tempList = that.data.comment
      for (var p = that.data.count; that.data.allComment[p] != null && p < (that.data.count + 5); p++) {
        tempList[p] = that.data.allComment[p]
      }
      that.setData({
        count: p,
        comment: tempList
      })
    } else {
      console.log("懒加载列表为空了")
    }
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
      path: 'pages/user/user?id=123',
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