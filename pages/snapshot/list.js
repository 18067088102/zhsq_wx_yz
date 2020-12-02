// pages/snapshot/list.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'
import common from '../../utils/common.js'

const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight: App.globalData.navHeight * (750 / App.globalData.windowWidth),
    navTop: App.globalData.navTop * (750 / App.globalData.windowWidth),
    typeIndex: 0,
    typeArr: ['物业报修', '随手拍'],
    TabCur: 0,
    Tabs: ['全部', '待处理', '已处理'],
    imgs: [],
    listsItem: [],
    show: false,
    type: 'loading',
    loading: true,
    page: 1,
    pages: 0,
    isNoData: false,
    repiarsArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRepairListRequest(1, true)
  },

  getRepairListRequest(pageNo, override) {
    var that = this
    that.setData({
      show: true,
      loading: true
    })
    return request(that.data.typeIndex == 0 ? api.getRepairListUrl : api.getConvenientListUrl, {
      method: 'GET',
      data: that.data.typeIndex == 0 ? {
        repairmanId: wx.getStorageSync('userId'),
        handleStatus: that.data.TabCur == 0 ? '' : that.data.TabCur == 1 ? '0' : '1',
        villageId: wx.getStorageSync('villageId'),
        limit: '10',
        page: pageNo
      } : {
        uploaderId: wx.getStorageSync('userId'),
        handleStatus: that.data.TabCur == 0 ? '' : that.data.TabCur == 1 ? '0' : '1',
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
        var repiarsArr = []
        for (var i = 0; i < list.length; i++) {
          var repairList = list[i].repairList
          var urls = []
          for (let j = 0; j < repairList.length; j++) {
            var imgPath = common.combineImageUrl(repairList[j])
            urls.push(imgPath)
          }
          repiarsArr.push(urls)
        }
        that.setData({
          isNoData: list.length == 0 ? true : false,
          page: pageNo, //当前的页号
          pages: res.data.totalPage, //总页数
          listsItem: override ? list : that.data.listsItem.concat(list),
          repiarsArr
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

  tabSelect(e) {
    this.scrollToTop()
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
    this.getRepairListRequest(1, true)
  },

  onSelectType(e) {
    this.scrollToTop()
    const idx = e.currentTarget.dataset.index
    this.setData({
      typeIndex: idx,
      TabCur: 0
    })
    this.getRepairListRequest(1, true)
  },

  scrollToTop() {
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
  },

  onNavBack() {
    wx.navigateBack()
  },

  // // 预览 preview
  // onPreviewTap(e) {
  //   const index = e.currentTarget.dataset.index
  //   var pics = this.data.pic1[index]
  //   const tempFilePath = pics[index]
  //   wx.previewImage({
  //     current: tempFilePath, // 当前显示图片的http链接
  //     urls: pics // 需要预览的图片http链接列表
  //   })
  // },

  onSelectItem(e) {
    const idx = e.currentTarget.dataset.index
    var dataDic = this.data.listsItem[idx]
    // var repairImgs = this.data.pic2[idx]
    // wx.navigateTo({
    //   url: `/pages/snapshot/detail?typeIndex=${this.data.typeIndex}&dataDic=${JSON.stringify(dataDic)}&repairImgs=${JSON.stringify(repairImgs)}`
    // })
    wx.navigateTo({
      url: `/pages/snapshot/detail?typeIndex=${this.data.typeIndex}&dataDic=${JSON.stringify(dataDic)}`
    })
  },

  onAddSnap() {
    wx.navigateTo({
      url: '/pages/snapshot/add?typeIndex=' + this.data.typeIndex,
    })
  },

  onDeleteItem(e) {
    var Id = this.data.listsItem[e.currentTarget.dataset.id].id
    var that = this
    wx.showModal({
      content: that.data.typeIndex == 0 ? '确定删除该报修记录?' : '确定删除该随手拍记录?',
      cancelText: '再想想',
      cancelColor: '#797979',
      confirmText: '删除',
      confirmColor: '#218EFF',
      success(res) {
        if (res.confirm) {
          that.deleteRepairRequest(Id)
        }
      }
    })
  },

  deleteRepairRequest(Id) {
    var that = this
    var url = that.data.typeIndex == 0 ? (api.deleteRepairRecordUrl + '?repairId=') : (api.deleteConvenientRecordUrl + '?convenientId=')
    return request(url + Id, {
      method: 'DELETE',
      data: {},
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          success: (res) => {
            that.getRepairListRequest(1, true)
          }
        })
      } else {
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
      this.getRepairListRequest(1, true).then(() => {
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
      this.getRepairListRequest(this.data.page + 1)
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