// pages/setting/index.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listItem: ['设置密码','关于我们'],
    isLoading: false,
    buttonText: '退出登录',
    isDisable: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onSelectItem(e) {
    const idx = e.currentTarget.dataset.index
    switch (idx) {
      case 0:
        wx.navigateTo({
          url: '/pages/register/index?fromID=2',
        })
        break;
      case 1:
        wx.navigateTo({
          url: '/pages/aboutUs/index',
        })
        break;
    
      default:
        break;
    }
  },

  submitHandler() {
    this.onShowModal('您确定要退出登录吗?', '退出', '')
  },

  onShowModal(content, confirmText, url) {
    var that = this
    wx.showModal({
      content: content,
      cancelText: '关闭',
      cancelColor: '#797979',
      confirmText: confirmText,
      confirmColor: '#218EFF',
      success(res) {
        if (res.confirm) {
          that.setData({
            isLoading: true,
            buttonText: '退出中...',
            isDisable: true
          });
          that.onLogoutRequest()
        }
      }
    })
  },

  onLogoutRequest() {
    var that = this
    return request(api.logoutUrl, {
      method: 'POST',
      data: {},
      token: wx.getStorageSync('token')
    }).then(res => {
      that.setData({
        isLoading: false,
        buttonText: '退出登录',
        isDisable: false
      });
      if(res.code == 200) {
        wx.removeStorageSync('token')
        wx.removeStorageSync('userId')
        wx.showToast({
          title: '退出成功',
          icon: 'none',
          success: (res) => {
            wx.navigateBack({
              delta: 1,
            })
          }
        })
      }else{
        wx.showToast({
          title: '退出失败，请重试',
          icon: 'none'
        })
      }
    }).catch(err => {
      that.setData({
        isLoading: false,
        buttonText: '退出登录',
        isDisable: false
      });
    })
  }
})