Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodeList: [],//目前显示的节点信息
    count: 0,//显示目前下一个的结点下标
    allList: []//所有节点信息
  },
  //节点帖子页面跳转
  nodeDetail: function (event) {
    wx.navigateTo({
      url: '../nodeDetail/nodeDetail?id=' + event.currentTarget.id,
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
    var tempList = []//用于更新nodeList的临时数据
    var tempArr = []//用于更新allList的临时数据
    wx.request({
      url: 'https://www.v2ex.com/api/nodes/all.json',
      method: 'GET',
      success: function (res) {
        if (!res.data.message) {//判断api调用次数是否limited
          tempArr = res.data
          var ctr = 'z'//用大于'z'来区分中文
          tempArr.sort(function (x, y) {
            if (x.title > ctr || y.title > ctr) {//x，y中至少有一个是中文
              if (x.title > ctr && y.title > ctr) {//x，y同时都是中文
                return x.title.localeCompare(y.title);
              } else {
                return x.title > ctr ? -1 : 1;//x是中文则不换位，否则y一定是中文，换位
              }
            } else {
              return x.title > y.title ? 1 : -1;//其余英文A-z排序
            }
          })
          that.setData({
            allList: tempArr
          })
          if (tempArr[that.data.count]) {//确保tempArr有数据
            for (var p = that.data.count; tempArr[p] != null && p < (that.data.count + 20); p++) {//先将最多20个数据放入临时数组准备加载
              tempList[p] = tempArr[p]
            }
            that.setData({
              count: p,//更新下一个下标计数
              nodeList: tempList
            })
          } else {
            console.log("初始节点获取为空")
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.allList[that.data.count]) {//确保
      var tempList = that.data.nodeList
      for (var p = that.data.count; that.data.allList[p] != null && p < (that.data.count + 10); p++) {
        tempList[p] = that.data.allList[p]
      }
      that.setData({
        count: p,
        nodeList: tempList
      })
    } else {
      console.log("懒加载列表为空了")
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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