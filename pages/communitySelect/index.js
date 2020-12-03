// pages/communitySelect/index.js

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
    loadingCenter: false,
    loading: true,
    page: 1,
    pages: 0,
    name: '',
    lat: '',
    lng: '',
    isNoData: false,
    fromID: 0 //0: 刚启动时社区选择；2:首页头部切换房产(未认证)；
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const villageName = wx.getStorageSync('villageName')
    // console.log(villageName)
    if (this.data.fromID == 0) {
      if (villageName) {
        wx.switchTab({
          url: '/pages/home/index',
        })
      } else {
        this.getLatAndLng()
      }
    } else {
      this.getLatAndLng()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var fromID = options.fromID
    this.setData({
      fromID: fromID ? fromID : 0
    })
    if (fromID == 2) {
      wx.setNavigationBarTitle({
        title: '重新选择社区'
      })
    }
  },

  onSelect(e) {
    const idx = e.currentTarget.dataset.index
    wx.setStorageSync('villageName', this.data.listsItem[idx].name)
    wx.setStorageSync('villageId', this.data.listsItem[idx].id)
    if (this.data.fromID == 0) {
      wx.switchTab({
        url: '/pages/home/index',
      })
    } else {
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  onCancel(e) {
    this.setData({
      name: e.detail.keyword
    })
    this.getVillageList(1, true)
  },

  onCommit(e) {
    this.setData({
      name: e.detail.keyword
    })
    this.getVillageList(1, true)
  },

  getVillageList(pageNo, override) {
    var that = this
    that.setData({
      show: true,
      loading: true
    })
    return request(api.getVillageListUrl, {
      method: 'GET',
      data: {
        lat: that.data.lat,
        lng: that.data.lng,
        limit: '10',
        page: pageNo,
        name: that.data.name
      },
      token: ''
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    if (!this.loading) {
      this.getVillageList(1, true).then(() => {
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
      this.getVillageList(this.data.page + 1)
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
  },

  getLatAndLng() {
    //获取经纬度
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        that.getVillageList(1, true)
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '温馨提示',
          content: '位置授权失败，部分功能将不能使用，是否重新授权？',
          showCancel: false,
          confirmText: "授权",
          success: function (res) {
            if (res.confirm) {
              if (wx.openSetting) { //当前微信的版本 ，是否支持openSetting
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting["scope.userLocation"]) { //如果用户重新同意了位置授权
                      wx.getLocation({
                        type: 'wgs84',
                        success: function (res) {
                          that.setData({
                            lat: res.latitude,
                            lng: res.longitude
                          })
                          that.getVillageList(1, true)
                        }
                      })
                    }
                  }
                })
              }
            }
          }
        })
      }
    })
  },
})