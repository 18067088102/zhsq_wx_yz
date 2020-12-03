// pages/common/index.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listsItem: [],
    show: false,
    type: 'loading',
    loading: true,
    page: 1,
    pages: 0,
    isNoData: false,
    isLogin: true,
    isAuth: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var token = wx.getStorageSync('token')
    if (token) {
      this.getUserInfoRequest()
    } else {
      this.setData({
        isLogin: false,
        isAuth: false
      })
    }
  },

  getUserInfoRequest() {
    var that = this
    return request(api.queryUserInfoUrl, {
      method: 'GET',
      data: {},
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 200) {
        var data = res.data
        wx.setStorageSync('data', data)
        if (data != null) {
          wx.setStorageSync('villageName', res.data.villageName)
          wx.setStorageSync('villageId', res.data.villageId)
          that.setData({
            isLogin: true,
            isAuth: true
          })
          that.getCommonPhoneListRequest(1, true)
        } else {
          that.setData({
            isLogin: true,
            isAuth: false
          })
        }
      }
    }).catch(err => {
      that.setData({
        isNoData: true
      })
    })
  },

  onClickItem(e) {
    const idx = e.currentTarget.dataset.index
    var phoneNum = this.data.listsItem[idx].phone
    wx.makePhoneCall({
      phoneNumber: phoneNum,
      complete: {}
    })
  },

  getCommonPhoneListRequest(pageNo, override) {
    var that = this
    that.setData({
      show: true,
      loading: true
    })
    return request(api.getCommonPhoneUrl, {
      method: 'GET',
      data: {
        villageId: wx.getStorageSync('villageId'),
        limit: '10',
        page: pageNo
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
      } else {
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
   * 登录、认证事件
   */
  getUserInfo: function (e) {
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/communityRegister/validation',
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (!this.data.isLogin || !this.data.isAuth) {
      wx.stopPullDownRefresh()
      return
    }
    wx.showNavigationBarLoading();
    if (!this.loading) {
      this.getCommonPhoneListRequest(1, true).then(() => {
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
      this.getCommonPhoneListRequest(this.data.page + 1)
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