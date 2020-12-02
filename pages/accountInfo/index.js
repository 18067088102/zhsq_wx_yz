// pages/accountInfo/index.js

import api from '../../utils/api.js'
import common from '../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listItems: [
      {
        title_text: '姓名',
        detail_text: '',
        isShowArrow: false
      },
      {
        title_text: '昵称',
        detail_text: '',
        isShowArrow: true
      },
      {
        title_text: '手机号码',
        detail_text: '',
        isShowArrow: true
      },
      {
        title_text: '性别',
        detail_text: '',
        isShowArrow: false
      },
      {
        title_text: '出生日期',
        detail_text: '',
        isShowArrow: false
      }
    ],
    faceImg: '',
    faceImgPath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var listItems = this.data.listItems
    var detail_text = "listItems[" + (0) + "].detail_text"
    var detail_text1 = "listItems[" + (1) + "].detail_text"
    var detail_text2 = "listItems[" + (2) + "].detail_text"
    var detail_text3 = "listItems[" + (3) + "].detail_text"
    var detail_text4 = "listItems[" + (4) + "].detail_text"
    this.setData({
      [detail_text]: wx.getStorageSync('data').name,
      [detail_text1]: wx.getStorageSync('data').nickname,
      [detail_text2]: wx.getStorageSync('data').mobile,
      [detail_text3]: wx.getStorageSync('data').sex,
      [detail_text4]: wx.getStorageSync('data').birthDay,
      faceImg: wx.getStorageSync('data').faceImg,
      faceImgPath: common.combineImageUrl(wx.getStorageSync('data').faceImg)
    })
  },

  onClickItem(e) {
    const idx = e.currentTarget.dataset.index
    if(idx==1) {
      wx.navigateTo({
        url: '/pages/accountInfo/changeNickname',
      })
    }else if(idx==2) {
      wx.navigateTo({
        url: '/pages/accountInfo/changePhoneNum',
      })
    }
  },

  // 预览 preview
  onPreviewTap() {
    const tempFilePath = this.data.faceImgPath
    wx.previewImage({
      current: tempFilePath, // 当前显示图片的http链接
      urls: [tempFilePath] // 需要预览的图片http链接列表
    })
  }
})