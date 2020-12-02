// pages/home/index.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'
import common from '../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    villageName: '',
    villageId: '',
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    index: 0,
    interval: 5000,
    duration: 1000,
    bannerList: ["/images/common/icon_banner.png"],
    bannerList1: [],
    bannerData: [],
    uploadMaps: [{
        img: "home_icon_fangke",
        title: "访客管理"
      },
      {
        img: "home_icon_jiaofei",
        title: "生活缴费"
      },
      {
        img: "home_icon_suipai",
        title: "随手拍"
      },
      {
        img: "home_icon_renzheng",
        title: "社区认证"
      }
    ],
    hiddenNotice: false,
    headlinesArr: [],
    elegantsArr: [],
    showLoginPopup: true,
    buildNum: '',
    roomNum: '',
    isLogin: true,
    isAuth: true
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var token = wx.getStorageSync('token')
    this.setData({
      villageName: wx.getStorageSync('villageName')
    })
    if (token) {
      this.getUserInfoRequest()
    } else {
      this.setData({
        isLogin: false,
        isNoData: true,
        hiddenNotice: true,
        bannerList1: []
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},

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
            isAuth: true,
            villageName: res.data.villageName,
            buildNum: res.data.buildingName,
            roomNum: res.data.roomName
          })
          that.getBannerListRequest()
          that.getNoticeListRequest('headlines')
          that.getNoticeListRequest('elegant')
        } else {
          that.setData({
            isLogin: true,
            isAuth: false,
            isNoData: true,
            hiddenNotice: true
          })
        }
      }
    }).catch(err => {
      that.setData({
        isNoData: true,
        hiddenNotice: true
      })
    })
  },

  getBannerListRequest() {
    var that = this
    return request(api.getBannerListUrl, {
      method: 'GET',
      data: {
        status: '1',
        villageId: wx.getStorageSync('villageId')
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 200) {
        var bannerData = res.data
        if (bannerData.length != 0) {
          var imgs = []
          for (let i = 0; i < bannerData.length; i++) {
            var imgPath = bannerData[i].img;
            var imgUrl = common.combineImageUrl(imgPath)
            imgs.push(imgUrl)
          }
          that.setData({
            bannerList1: imgs,
            bannerData
          })
        }
      }
    }).catch(err => {})
  },

  getNoticeListRequest(source) {
    var that = this
    return request(source == 'headlines' ? api.getHeadLinesListUrl : api.getElegantListUrl, {
      method: 'GET',
      data: {
        limit: '5',
        page: '1',
        villageId: wx.getStorageSync('villageId')
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 200) {
        const list = res.data.list
        if (source == 'headlines') {
          that.setData({
            hiddenNotice: list.length == 0 ? true : false,
            headlinesArr: list
          })
        } else {
          that.setData({
            isNoData: list.length == 0 ? true : false,
            elegantsArr: list
          })
        }
      } else {
        that.setData({
          isNoData: true
        })
      }
    }).catch(err => {})
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
   * 切换小区  id为1：切换房产；为2：重新选择社区
   */
  pageToVillage() {
    var url = ''
    if (!this.data.isLogin) {
      url = '/pages/communitySelect/index?fromID=2'
    } else {
      if (this.data.isAuth) {
        url = '/pages/house/list?fromID=1'
      } else {
        url = '/pages/communitySelect/index?fromID=2'
      }
    }
    wx.navigateTo({
      url: url,
    })
  },

  /**
   * 访客管理等四个按钮点击事件
   */
  onSwitchClick(e) {
    const idx = e.currentTarget.dataset.index
    var path = ''
    var loginStatus = this.judgeLoginStatus()
    var authStatus
    if (loginStatus) {
      authStatus = this.judgeAuthStatus(idx)
      if (!authStatus && idx == 3) {
        wx.navigateTo({
          url: '/pages/communityRegister/validation',
        })
      }
    }
    if (loginStatus && authStatus) {
      switch (idx) {
        case 0:
          path = '/pages/visitorManager/index'
          break;
        case 1:
          path = '/pages/livePayment/index'
          break;
        case 2:
          path = '/pages/snapshot/list'
          break;
        case 3:
          path = '/pages/communityRegister/validation'
          break;
        default:
          break;
      }
      wx.navigateTo({
        url: path,
      })
    }
  },

  /**
   * 关闭首页滚动公告
   */
  onCloseNotice() {
    this.setData({
      hiddenNotice: true
    })
  },

  /**
   * 全部小区风采
   */
  onLookAll() {
    var loginStatus = this.judgeLoginStatus()
    var authStatus
    if (loginStatus) {
      authStatus = this.judgeAuthStatus()
    }
    if (loginStatus && authStatus) {
      wx.navigateTo({
        url: '/pages/notice/list',
      })
    }
  },

  /**
   * 轮播图详情
   */
  onClickBanner(e) {
    const idx = e.currentTarget.dataset.index
    // console.log(idx)
    if (this.data.bannerList1.length != 0) {
      const id = this.data.bannerData[idx].linkId
      const linkType = this.data.bannerData[idx].linkType
      console.log(linkType)
      switch (linkType) {
        case '1':
          wx.navigateTo({
            url: `/pages/notice/detail?id=${id}&fromID=0&original=0`
          })
          break;
        case '2':
          wx.navigateTo({
            url: `/pages/notice/detail?id=${id}&fromID=1&original=0`
          })
          break;

        default:
          break;
      }
    }
  },

  /**
   * 小区头条详情
   */
  onHeadLinesDetail(e) {
    const idx = e.currentTarget.dataset.index
    const id = this.data.headlinesArr[idx].id
    wx.navigateTo({
      url: `/pages/notice/detail?id=${id}&fromID=0`
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
   * 判断是否登录
   */
  judgeLoginStatus() {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      this.animationEvent()
      return false
    }
    return true
  },

  /**
   * 判断是否认证
   */
  judgeAuthStatus(idx) {
    if (idx == 3) {
      return true
    }
    if (!this.data.isAuth) {
      this.onShowModal('您还未进行社区认证，认证后即可使用该功能?', '去认证', '/pages/communityRegister/validation')
      this.animationEvent()
      return false
    }
    return true
  },

  /**
   * 按钮抖动动画
   */
  animationEvent() {
    var that = this;
    that.setData({
      animation: 'shake'
    })
    setTimeout(function () {
      that.setData({
        animation: ''
      })
    }, 1000)
  },

  /**
   * 弹框事件
   */
  onShowModal(content, confirmText, url) {
    wx.showModal({
      content: content,
      cancelText: '关闭',
      cancelColor: '#797979',
      confirmText: confirmText,
      confirmColor: '#218EFF',
      success(res) {
        if (res.confirm) {
          if (url != '') {
            wx.navigateTo({
              url: url,
            })
          }
        }
      }
    })
  }
})