// pages/vehicle/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataDic: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dataDic: JSON.parse(options.dataDic)
    })
  },
})