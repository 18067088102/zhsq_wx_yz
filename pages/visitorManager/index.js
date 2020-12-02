// pages/visitorManager/index.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'
import common from '../../utils/common.js'

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
    faceImgArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVisitorListRequest(1, true)
  },

  getVisitorListRequest(pageNo, override) {
    var that = this
    that.setData({
      show: true,
      loading: true
    })
    return request(api.getVisitorListUrl, {
      method: 'GET',
      data: {
        roomId: wx.getStorageSync('data').roomId,
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
        var faceImgArr = []
        for (var i = 0; i < list.length; i++) {
          var imgPath = common.combineImageUrl(list[i].visitorFaceImg)
          faceImgArr.push(imgPath)
        }
        that.setData({
          faceImgArr,
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

  onDetail(e) {
    const idx = e.currentTarget.dataset.index
    const dataDic = this.data.listsItem[idx]
    wx.navigateTo({
      url: '/pages/visitorManager/detail?data=' + JSON.stringify(dataDic),
    })
  },

  onAddVisitor() {
    wx.navigateTo({
      url: '/pages/visitorManager/add',
    })
  },

  onDeleteItem(e) {
    var visitorId = this.data.listsItem[e.currentTarget.dataset.id].id
    var that = this
    wx.showModal({
      content: '确定删除该访客记录?',
      cancelText: '再想想',
      cancelColor: '#797979',
      confirmText: '删除',
      confirmColor: '#218EFF',
      success(res) {
        if (res.confirm) {
          that.deleteVisitorRequest(visitorId)
        }
      }
    })
  },

  deleteVisitorRequest(visitorId) {
    var that = this
    var ids = []
    ids.push(visitorId)
    return request(api.deleteVisitorRecordUrl, {
      method: 'DELETE',
      data: ids,
      token: wx.getStorageSync('token')
    }).then(res => {
      if(res.code == 200) {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          success: (res) => {
            that.getVisitorListRequest(1, true)
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    if (!this.loading) {
      this.getVisitorListRequest(1, true).then(() => {
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
      this.getVisitorListRequest(this.data.page + 1)
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