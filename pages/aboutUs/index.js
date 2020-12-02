// pages/aboutUs/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listItem: [
      {
        title_text: '公司官网',
        detail_text: 'www.cncqs.cn'
      },
      {
        title_text: '联系我们',
        detail_text: '0551-68168050'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onSelectItem(e) {
    const idx = e.currentTarget.dataset.index
    if(idx == 0) {

    }else{
      wx.makePhoneCall({
        phoneNumber: this.data.listItem[idx].detail_text,
        complete: {}
      })
    }
  }
})