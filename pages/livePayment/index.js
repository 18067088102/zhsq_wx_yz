// pages/livePayment/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payListPics: [{
        pic: '/images/common/icon_wuyefei.png',
        title: '物业费'
      },
      {
        pic: '/images/common/icon_chefei.png',
        title: '停车费'
      },
      {
        pic: '/images/common/icon_dianfei.png',
        title: '电费'
      },
      {
        pic: '/images/common/icon_shuifei.png',
        title: '水费'
      },
      {
        pic: '/images/common/icon_ranqi.png',
        title: '燃气费'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onPayment(e) {
    const idx = e.currentTarget.dataset.index
    if(idx == 0 || idx == 1) {
      wx.navigateTo({
        url: '/pages/livePayment/list?fromID=' + idx,
      })
    }
    if(idx == 2 || idx == 3 || idx == 4) {
      wx.navigateToMiniProgram({  //跳转到微信生活缴费小程序
        appId: 'wxd2ade0f25a874ee2',
        // path: 'packquery/pages/query-guide/query-guide?navigateId=' + navigateId,
        path: '',
        extraData: {
          foo: 'bar'
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    }
  }
})