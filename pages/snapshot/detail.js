// pages/snapshot/detail.js

import api from '../../utils/api.js'
import common from '../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '',
    dataDic: {},
    repiarsArr: [],
    handlesArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dataDic = JSON.parse(options.dataDic)
    for (let i = 0; i < dataDic.handleList.length; i++) {
      dataDic.handleList[i] = common.combineImageUrl(dataDic.handleList[i])
    }
    for (let j = 0; j < dataDic.repairList.length; j++) {
      dataDic.repairList[j] = common.combineImageUrl(dataDic.repairList[j])
    }
    this.setData({
      dataDic,
      status: dataDic.handleStatus,
      typeIndex: options.typeIndex,
      repiarsArr: dataDic.repairList,
      handlesArr: dataDic.handleList
    })
    wx.setNavigationBarTitle({
      title: this.data.typeIndex == 0 ? '报修详情' : '随手拍详情'
    })
  },
  
  // 预览 preview
  onPreviewTap(e) {
    const index = e.currentTarget.dataset.index
    const tempFilePath = this.data.pic1[index]
    wx.previewImage({
      current: tempFilePath, // 当前显示图片的http链接
      urls: this.data.pic1 // 需要预览的图片http链接列表
    })
  },

  // 预览 preview
  onPreviewTap1(e) {
    const index = e.currentTarget.dataset.index
    const tempFilePath = this.data.handlesArr[index]
    wx.previewImage({
      current: tempFilePath, // 当前显示图片的http链接
      urls: this.data.handlesArr // 需要预览的图片http链接列表
    })
  },
})