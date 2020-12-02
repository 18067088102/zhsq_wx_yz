// pages/accountInfo/changePhoneNum.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    getCodeText: '获取验证码',
    isLoading: false,
    buttonText: '修改',
    isDisable: true,
    phoneNo: "",
    smsCode: "",
    newPhoneNo: "",
    isDisabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phoneNo: wx.getStorageSync('phoneNo')
    })
  },

  phoneNoBlur(event) {
    let phoneNo = event.detail.value || event.detail.text;
    if (!phoneNo) {
      phoneNo = ''
    }
    if (phoneNo.length != 11 || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phoneNo))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    }
  },

  newPhoneNoBlur(event) {
    let newPhoneNo = event.detail.value || event.detail.text;
    if (!newPhoneNo) {
      newPhoneNo = ''
    }
    if (newPhoneNo.length != 11 || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(newPhoneNo))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    }
  },

  getValue(e) {
    let type = e.currentTarget.dataset.id;
    if (type == 'phoneNo') {
      this.setData({
        phoneNo: e.detail.value.replace(/\s+/g, '')
      })
    }
    if (type == "smsCode") {
      this.setData({
        smsCode: e.detail.value.replace(/\s+/g, '')
      })
    }
    if (type == "newPhoneNo") {
      this.setData({
        newPhoneNo: e.detail.value.replace(/\s+/g, '')
      })
    }
    this.validateEmpty();
  },

  validateEmpty() {
    if (this.data.phoneNo == '' || this.data.smsCode == '' || this.data.newPhoneNo == '') {
      this.setData({
        isDisable: true
      })
    } else {
      this.setData({
        isDisable: false
      })
    }
  },

  onGetCode() {
    if (this.data.newPhoneNo.length == 0) {
      wx.showToast({
        title: '新手机号不能为空',
        icon: "none"
      })
    } else {
      if (this.data.isDisabled == true) {
        wx.showToast({
          title: '加载中…',
          icon: 'loading'
        })
        this.getCodeRequest();
      } else {
        wx.showToast({
          title: '已获取验证码,请稍后再试',
          icon: 'none'
        })
      }
    }
  },

  getCodeRequest() {
    var that = this
    return request(api.getAuthSMSCodeUrl + "?phone=" + this.data.newPhoneNo, {
      method: 'POST',
      data: {},
      token: ''
    }).then(res => {
      that.handleRequestResult(res)
    }).catch(err => {})
  },

  handleRequestResult(res) {
    wx.hideToast()
    if (res.code == 200) {
      wx.showToast({
        title: '获取验证码成功',
        icon: "none"
      })
      var _this = this
      var coden = 180 //定义60秒的倒计时
      var codeV = setInterval(function () {
        _this.setData({ //_this这里的作用域不同了
          getCodeText: (--coden) + 's' + '后重试',
          isDisabled: false,
        })
        if (coden == -1) { //清除setInterval倒计时，这里可以做很多操作，按钮变回原样等
          clearInterval(codeV)
          _this.setData({
            getCodeText: '获取验证码',
            isDisabled: true
          })
        }
      }, 1000) //1000是1秒
    } else {
      wx.showToast({
        title: res.message,
        icon: "none"
      })
    }
  },

  submitHandler: function submitHandler() {
    if (this.data.newPhoneNo.length == 0) {
      wx.showToast({
        title: '新手机号不能为空',
        icon: 'none'
      })
      return
    }
    if (this.data.smsCode.length == 0) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none'
      })
      return
    }
    this.setData({
      isLoading: true,
      buttonText: '修改中...',
      isDisable: true
    });
    this.onChangePhoneNumRequest()
  },

  onChangePhoneNumRequest() {
    var that = this
    request(api.changePhoneNumUrl, {
      method: 'PUT',
      data: {
        id: wx.getStorageSync('data').id,
        mobile: that.data.phoneNo,
        newMobile: that.data.newPhoneNo,
        verifyCode: that.data.smsCode
      },
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
        var detail_text2 = "listItems[" + (2) + "].detail_text"
        prevPage.setData({
          [detail_text2]: that.data.newPhoneNo,
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