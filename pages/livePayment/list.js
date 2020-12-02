// pages/livePayment/list.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromID: 0, //0:物业费；1:停车费
    listsItem: [],
    show: false,
    type: 'loading',
    loading: true,
    page: 1,
    pages: 0,
    isNoData: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fromID: options.fromID
    })
    wx.setNavigationBarTitle({
      title: options.fromID == 0 ? '物业费' : '停车费'
    })
    this.getFeeListRequest(1, true)
  },

  getFeeListRequest(pageNo, override) {
    var that = this
    that.setData({
      show: true,
      loading: true
    })
    return request(this.data.fromID == 0 ? api.getEstateFeeListUrl : api.getParkingFeeListUrl, {
      method: 'GET',
      data: {
        roomId: wx.getStorageSync('data').roomId,
        limit: '10',
        page: pageNo,
        payStatus: 1
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      that.setData({
        show: false
      })
      if (res.code == 200) {
        const list = res.data.list
        that.setData({
          isNoData: list.length == 0 ? true : false,
          page: pageNo, //当前的页号
          pages: res.data.totalPage, //总页数
          listsItem: override ? list : that.data.listsItem.concat(list)
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        that.setData({
          isNoData: true
        })
      }
    }).catch(err => {
      that.setData({
        isNoData: true,
        show: false
      })
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    if (!this.loading) {
      this.getFeeListRequest(1, true).then(() => {
        wx.hideNavigationBarLoading()
        // 处理完成后，终止下拉刷新
        wx.stopPullDownRefresh()
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.loading && this.data.loading && this.data.page < this.data.pages) {
      this.setData({
        show: true,
        type: 'loading'
      })
      this.getFeeListRequest(this.data.page + 1)
    }
    if (!this.loading && this.data.loading && this.data.page == this.data.pages) {
      this.setData({
        show: true,
        type: 'loading'
      })
      setTimeout(() => {
        this.setData({
          show: true,
          type: 'end',
          loading: false
        })
      }, 800)
    }
  }
})