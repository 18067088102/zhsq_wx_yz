// pages/face/index.js

import api from '../../utils/api.js'
import common from '../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    faceImgPath: '',
    faceImgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var imgPath = wx.getStorageSync('data').faceImg
    this.setData({
      faceImgPath: imgPath,
      faceImgUrl: common.combineImageUrl(imgPath)
    })
  },

  onChangePhoto() {
    wx.navigateTo({
      url: '/pages/face/change',
    })
  },

  // 预览 preview
  onPreviewTap() {
    if (this.data.faceImgPath) {
      const tempFilePath = this.data.faceImgUrl
      wx.previewImage({
        current: tempFilePath, // 当前显示图片的http链接
        urls: [tempFilePath] // 需要预览的图片http链接列表
      })
    }
  }
})