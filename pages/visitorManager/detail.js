// pages/visitorManager/detail.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'
import common from '../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataDic: {},
    isLoading: false,
    buttonText: '同意',
    isDisable: false,
    imgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dataDic: JSON.parse(options.data)
    })
    var imgs = []
    var imgUrl = common.combineImageUrl(this.data.dataDic.visitorFaceImg)
    imgs.push(imgUrl)
    this.setData({
      imgs
    })
  },

  // 预览 preview
  onPreviewTap(e) {
    const index = e.currentTarget.dataset.index
    const tempFilePath = this.data.imgs[index]
    wx.previewImage({
      current: tempFilePath, // 当前显示图片的http链接
      urls: this.data.imgs // 需要预览的图片http链接列表
    })
  },

  submitHandler() {
    var that = this
    wx.showModal({
      content: '是否同意该访客的来访请求？',
      cancelText: '关闭',
      cancelColor: '#797979',
      confirmText: '同意',
      confirmColor: '#218EFF',
      success(res) {
        if (res.confirm) {
          that.setData({
            isLoading: true,
            buttonText: '同意中...',
            isDisable: true
          });
          that.verifyVisitorRequest()
        }
      }
    })
  },

  verifyVisitorRequest() {
    var that = this
    return request(api.reviewVisitorUrl, {
      method: 'POST',
      data: {
        id: that.data.dataDic.id,
        roomId: that.data.dataDic.roomId,
        source: that.data.dataDic.source,
        villageId: that.data.dataDic.villageId,
        visitReason: that.data.dataDic.visitReason,
        visitTime: that.data.dataDic.visitTime,
        visitorFaceImg: that.data.dataDic.visitorFaceImg,
        visitorName: that.data.dataDic.visitorName,
        visitorNum: that.data.dataDic.visitorNum,
        visitorPhone: that.data.dataDic.visitorPhone
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      that.setData({
        isLoading: false,
        buttonText: '提交',
        isDisable: false
      });
      if (res.code == 200) {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2];
        prevPage.getVisitorListRequest(1, true)
        wx.showToast({
          title: '已同意',
          icon: 'none',
          success: (res) => {
            wx.navigateBack({
              delta: 1
            });
          }
        })
      } else {
        wx.showToast({
          title: '同意失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      that.setData({
        isLoading: false,
        buttonText: '同意',
        isDisable: false
      });
    })
  }
})