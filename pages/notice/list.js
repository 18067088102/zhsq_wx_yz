// pages/notice/list.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    elegantsArr: [],
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
  onShow: function (options) {
    this.getElegantListRequest(1, true)
  },

  getElegantListRequest(pageNo, override) {
    var that = this
    that.setData({
      show: true,
      loading: true
    })
    return request(api.getElegantListUrl, {
      method: 'GET',
      data: {
        limit: '10',
        page: pageNo,
        status: '1',
        villageId: wx.getStorageSync('villageId')
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
          elegantsArr: override ? list : that.data.elegantsArr.concat(list)
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
   * 小区风采详情
   */
  onElegantDetail(e) {
    const idx = e.currentTarget.dataset.index
    const id = this.data.elegantsArr[idx].id
    wx.navigateTo({
      url: `/pages/notice/detail?id=${id}&fromID=1`
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    if (!this.loading) {
      this.getElegantListRequest(1, true).then(() => {
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
      this.getElegantListRequest(this.data.page + 1)
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