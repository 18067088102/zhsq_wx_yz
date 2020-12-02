// pages/accountInfo/changeNickname.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    buttonText: '修改',
    isDisable: true,
    nickName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickName: wx.getStorageSync('data').nickname
    })
  },

  getValue(e) {
    let type = e.currentTarget.dataset.id;
    if (type == 'nickName') {
      this.setData({
        nickName: e.detail.value.replace(/\s+/g, '')
      })
    }
    this.validateEmpty();
  },

  validateEmpty() {
    if (this.data.nickName == '') {
      this.setData({
        isDisable: true
      })
    } else {
      this.setData({
        isDisable: false
      })
    }
  },

  submitHandler: function submitHandler() {
    if (this.data.nickName.length == 0) {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'none'
      })
      return
    }
    this.setData({
      isLoading: true,
      buttonText: '修改中...',
      isDisable: true
    });
    this.onChangeNickNameRequest()
  },

  onChangeNickNameRequest() {
    var that = this
    request(api.setNickNameUrl + `?id=${wx.getStorageSync('data').id}&nickName=${that.data.nickName}`, {
      method: 'PUT',
      data: {},
      token: wx.getStorageSync('token')
    }).then(res => {
      that.setData({
        isLoading: false,
        buttonText: '修改',
        isDisable: false
      });
      if (res.code == 200) {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2];
        var listItems = prevPage.data.listItems
        var detail_text1 = "listItems[" + (1) + "].detail_text"
        prevPage.setData({
          [detail_text1]: that.data.nickName,
        })
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          success: (res) => {
            wx.navigateBack({
              delta: 1
            });
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }).catch(err => {
      that.setData({
        isLoading: false,
        buttonText: '修改',
        isDisable: false
      })
    })
  }
})