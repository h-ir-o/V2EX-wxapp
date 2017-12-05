var Util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodeTopics: []
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "拼命加载中"
    })
    var that = this
    wx.request({
      url: 'https://www.v2ex.com/api/topics/show.json?node_id=' + options.id,
      method: 'GET',
      success: function (res) {
        if (res.data[0]) {//判断该节点内是否有帖子
          wx.setNavigationBarTitle({
            title: "V2EX社区：" + res.data[0].node.title
          })
          for (var p in res.data) {//格式化时间
            res.data[p].created = Util.formatTime(Util.transLocalTime(res.data[p].created))
          }
          that.setData({
            nodeTopics: res.data
          })
          wx.hideLoading()
        } else {
          wx.hideLoading()
          wx.setNavigationBarTitle({
            title: "该主题没有帖子哦"
          })
          wx.showToast({
            title: '内容为空，页面在02秒后返回',
            image: '../../images/error.png',
            duration: 2000
          })
          //防止返回页面不正当
          var pageID = getCurrentPages()[1].__wxWebviewId__//获取返回定时器执行前页面唯一id
          setTimeout(function () {
            if (getCurrentPages().length > 1) {//判断页面层数是否大于1
              if (pageID == getCurrentPages()[1].__wxWebviewId__) {//返回前判断当前页面是否与先前一致
                wx.navigateBack()
              }
            }
          }, 2000)
        }
      }
    })
  }
})