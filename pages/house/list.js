// pages/house/list.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listsItem: [],
    currentAllName: '',
    fromID: 0, //0：我的房产进入；1:首页进入
    isNoData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.fromID) {
      this.setData({
        fromID: options.fromID
      })
      wx.setNavigationBarTitle({
        title: '切换房产'
      })
    }
    this.setData({
      currentAllName: wx.getStorageSync('data').villageName + wx.getStorageSync('data').buildingName + '栋' + wx.getStorageSync('data').roomName + '室'
    })
  },

  onShow: function () {
    this.getRoomList()
  },

  getRoomList() {
    var that = this
    return request(api.getRoomListUrl, {
      method: 'GET',
      data: {
        limit: '100',
        page: 1,
        userId: wx.getStorageSync('userId')
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 200) {
        const list = res.data.list
        var currentAllNameStr = ''
        for (let i = 0; i < list.length; i++) {
          const markedStr = list[i].marked
          if (markedStr == '1') {
            currentAllNameStr = list[i].villageName + list[i].buildingName + '栋' + list[i].roomName + '室'
          }
        }
        that.setData({
          currentAllName: currentAllNameStr,
          listsItem: list
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }).catch(err => {
      that.setData({
        isNoData: true
      })
    })
  },

  onChangeHouse(e) {
    const idx = e.currentTarget.dataset.index
    const roomId = this.data.listsItem[idx].roomId
    var that = this
    wx.showModal({
      content: '确定要切换为该房产吗？',
      cancelText: '取消',
      cancelColor: '#797979',
      confirmText: '切换',
      confirmColor: '#218EFF',
      success(res) { 
        if (res.confirm) {
          that.changeRoomRequest(roomId)
        }
      }
    })
  },

  changeRoomRequest(roomId) {
    var that = this
    return request(api.changeRoomUrl, {
      method: 'GET',
      data: {
        roomId: roomId,
        userId: wx.getStorageSync('userId')
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '切换成功',
          icon: 'none',
          success: (res) => {
            that.data.fromID == 0 ? that.getRoomList() : wx.navigateBack({
              delta: 1,
            })
          }
        })
      } else {
        wx.showToast({
          title: '切换失败',
          icon: 'none'
        })
      }
    }).catch(err => {})
  },

  onAddHouse() {
    wx.navigateTo({
      url: '/pages/communityRegister/validation',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getRoomList().then(() => {
      wx.hideNavigationBarLoading()
      // 处理完成后，终止下拉刷新
      wx.stopPullDownRefresh()
    })
  },
})