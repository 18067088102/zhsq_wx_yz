// pages/resident/detail.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'
import common from '../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataDic: {},
    imgPath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPersonDetailRequest(options.personId)
  },

  getPersonDetailRequest(personId) {
    var that = this
    return request(api.getPersonDetailUrl, {
      method: 'GET',
      data: {
        personId,
        roomId: wx.getStorageSync('data').roomId
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      if(res.code == 200) {
        this.setData({
          dataDic: res.data
        })
        if(this.data.dataDic.faceImg) {
          var imgUrl = common.combineImageUrl(this.data.dataDic.faceImg)
          this.setData({
            imgPath: imgUrl
          })
        }
      }
    }).catch(err => {})
  },

  // 预览 preview
  onPreviewTap() {
    const tempFilePath = this.data.imgPath
    wx.previewImage({
      current: tempFilePath, // 当前显示图片的http链接
      urls: [tempFilePath] // 需要预览的图片http链接列表
    })
  }
})