// pages/mine/index.js
//获取应用实例
const app = getApp()

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'
import common from '../../utils/common.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoginPopup: true,
    detailsArr: ['登录/注册', '登录后可查看更多信息', '请登记社区信息'],
    mineListPics: [{
        id: '1',
        items: [{
            pic: 'icon_shualian',
            title: '刷脸开门',
            tip: ''
          },
          {
            pic: 'icon_fangchan',
            title: '房产信息',
            tip: ''
          },
          {
            pic: 'icon_cheliang',
            title: '车辆信息',
            tip: ''
          },
          {
            pic: 'icon_fangwu',
            title: '住户信息',
            tip: ''
          }
        ]
      },
      {
        id: '2',
        items: [{
            pic: 'icon_fankui',
            title: '意见反馈',
            tip: ''
          },
          {
            pic: 'icon_shezhi',
            title: '设置',
            tip: ''
          }
        ]
      }
    ],
    isLogin: true,
    isAuth: true,
    nameTitle: '',
    detailTitle: '',
    faceImgPath: '',
    faceImgUrl: ''
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var token = wx.getStorageSync('token')
    if (token) {
      this.getUserInfoRequest()
    } else {
      var mineListPics = this.data.mineListPics
      var tip = "mineListPics[" + (0) + "].items[" + (0) + "].tip"
      var tip1 = "mineListPics[" + (0) + "].items[" + (1) + "].tip"
      var tip2 = "mineListPics[" + (0) + "].items[" + (2) + "].tip"
      var tip3 = "mineListPics[" + (0) + "].items[" + (3) + "].tip"
      this.setData({
        [tip]: '',
        [tip1]: '',
        [tip2]: '',
        [tip3]: ''
      })
      this.setData({
        faceImgPath: '',
        faceImgUrl: '',
        nameTitle: this.data.detailsArr[0],
        detailTitle: this.data.detailsArr[1],
        isLogin: false,
        isAuth: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },

  getUserInfoRequest() {
    var that = this
    var phoneNo = wx.getStorageSync('phoneNo')
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

          var mineListPics = that.data.mineListPics
          var tip = "mineListPics[" + (0) + "].items[" + (0) + "].tip"
          that.setData({
            [tip]: '已认证'
          })

          var name = wx.getStorageSync('data').name
          var imgPath = wx.getStorageSync('data').faceImg
          that.setData({
            faceImgPath: imgPath,
            faceImgUrl: common.combineImageUrl(imgPath),
            nameTitle: name,
            detailTitle: phoneNo.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
            isLogin: true,
            isAuth: true
          })
        } else {
          that.setData({
            faceImgPath: '',
            faceImgUrl: '',
            nameTitle: phoneNo.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
            detailTitle: that.data.detailsArr[2],
            isLogin: true,
            isAuth: false
          })
        }
        that.getMineCountNumRequest()
      }
    }).catch(err => {
      that.setData({
        faceImgPath: '',
        faceImgUrl: '',
        nameTitle: '用户姓名',
        detailTitle: phoneNo.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      })
    })
  },

  getMineCountNumRequest() {
    var that = this
    return request(api.getMineCountNumUrl, {
      method: 'GET',
      data: {
        personId: wx.getStorageSync('data').archiveId,
        roomId: wx.getStorageSync('data').roomId,
        relationCode: wx.getStorageSync('data').relationCode
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 200) {
        var mineListPics = that.data.mineListPics
        var tip1 = "mineListPics[" + (0) + "].items[" + (1) + "].tip"
        var tip2 = "mineListPics[" + (0) + "].items[" + (2) + "].tip"
        var tip3 = "mineListPics[" + (0) + "].items[" + (3) + "].tip"
        that.setData({
          [tip1]: res.data.houseNum.toString(),
          [tip2]: res.data.carNum.toString(),
          [tip3]: res.data.householdsNum.toString()
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
   * 头部个人资料
   */
  onClickAccount() {
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    if (!this.data.isAuth) {
      wx.navigateTo({
        url: '/pages/communityRegister/validation',
      })
    }
    if (this.data.isLogin && this.data.isAuth) {
      wx.navigateTo({
        url: '/pages/accountInfo/index',
      })
    }
  },

  /**
   * 刷脸开门等六个Cell-Item点击事件
   */
  onClickItem(e) {
    const idx = e.currentTarget.dataset.index
    var path = ''
    var loginStatus = this.judgeLoginStatus()
    var authStatus
    if (loginStatus) {
      authStatus = this.judgeAuthStatus(idx)
      if (!authStatus && idx == '2-2') {
        wx.navigateTo({
          url: '/pages/setting/index',
        })
      }
    }
    if (loginStatus && authStatus) {
      switch (idx) {
        case '1-1':
          path = '/pages/face/index'
          break;
        case '1-2':
          path = '/pages/house/list'
          break;
        case '1-3':
          path = '/pages/vehicle/list'
          break;
        case '1-4':
          path = '/pages/resident/list'
          break;
        case '2-1':
          path = '/pages/feedBack/index'
          break;
        case '2-2':
          path = '/pages/setting/index'
          break;

        default:
          break;
      }
      if (wx.getStorageSync('data') != null) {
        const relationName = wx.getStorageSync('data').relationName
        if (idx == '1-4' && relationName == '租客') {
          wx.showToast({
            title: '租客暂无权限访问该功能',
            icon: 'none'
          })
          return
        }
      }
      wx.navigateTo({
        url: path,
      })
    }
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
    if (idx == '2-2') {
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