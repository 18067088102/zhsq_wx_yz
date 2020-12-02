// pages/resident/list.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'
import common from '../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    Tabs: ['我的住户', '我的租客'],
    residentsArr: [],
    retentsArr: [],
    residentsFaces: [],
    retentsFaces: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.getPersonListRequest()
  },

  getPersonListRequest() {
    var that = this
    return request(api.getPersonListUrl, {
      method: 'GET',
      data: {
        roomId: wx.getStorageSync('data').roomId
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 200) {
        const list = res.data
        var residents = []
        var retents = []
        var residentsFaces = []
        var retentsFaces = []
        for (let i = 0; i < list.length; i++) {
          const relation = list[i].relationName
          var imgPath = common.combineImageUrl(list[i].faceImg)
          if(relation == '租客') {
            retents.push(list[i])
            retentsFaces.push(imgPath)
          }else{
            residents.push(list[i])
            residentsFaces.push(imgPath)
          }
        }
        that.setData({
          residentsFaces,
          retentsFaces,
          residentsArr: residents,
          retentsArr: retents
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
        isNoData: true
      })
    })
  },

  tabSelect(e) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
  },

  onClickItem(e) {
    var arr = this.data.TabCur == 0 ? this.data.residentsArr : this.data.retentsArr
    const idx = e.currentTarget.dataset.index
    const personId = arr[idx].id
    wx.navigateTo({
      url: '/pages/resident/detail?personId=' + personId,
    })
  },

  onAddResident() {
    wx.navigateTo({
      url: '/pages/communityRegister/validation1?fromID=1',
    })
  },

  onDeleteItem(e) {
    var arr = this.data.TabCur == 0 ? this.data.residentsArr : this.data.retentsArr
    var personId = arr[e.currentTarget.dataset.id].id
    var that = this
    wx.showModal({
      content: that.data.TabCur == 0 ? '确定删除该住户?' : '确定删除该租客?',
      cancelText: '再想想',
      cancelColor: '#797979',
      confirmText: '删除',
      confirmColor: '#218EFF',
      success(res) {
        if (res.confirm) {
          that.deletePersonRequest(personId)
        }
      }
    })
  },

  deletePersonRequest(personId) {
    var that = this
    var personIds = []
    personIds.push(personId)
    return request(api.deletePersonRecordUrl, {
      method: 'DELETE',
      data: personIds,
      token: wx.getStorageSync('token')
    }).then(res => {
      if(res.code == 200) {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          success: (res) => {
            that.getPersonListRequest()
          }
        })
      }else{
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
      }
    }).catch(err => {})
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
})