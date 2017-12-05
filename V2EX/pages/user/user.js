Page({

  /**
   * 页面的初始数据
   */
  data: {
    myUserInfo: [],
    myUserInfoHeader: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: "加载个人资料中"
    })
    // var num = (Math.floor(Math.random() * 100000) % 1000) + 1;随机产生数字
    wx.request({
      url: 'https://www.v2ex.com/api/members/show.json?id=' + options.id,//223
      method: 'GET',
      success: function (res) {
        if (!res.data.message) {
          that.setData({
            myUserInfo: res.data,
            myUserInfoHeader: res.header['x-rate-limit-remaining']
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