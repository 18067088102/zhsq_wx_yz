// pages/register/index.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'
import common from '../../utils/common.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    getCodeText: '获取验证码',
    isLoading: false,
    buttonText: '注册',
    isDisable: true,
    phoneNo: "",
    smsCode: "",
    password: "",
    isDisabled: true,
    seePsw: false,
    fromID: 0 //0:注册;1:找回密码;2:设置密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.fromID) {
      wx.setNavigationBarTitle({
        title: '设置密码'
      })
      this.setData({
        fromID: options.fromID,
        phoneNo: wx.getStorageSync('phoneNo'),
        buttonText: '提交'
      })
    }
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
    if (type == "password") {
      this.setData({
        password: e.detail.value.replace(/\s+/g, '')
      })
    }
    this.validateEmpty();
  },

  validateEmpty() {
    if (this.data.phoneNo == '' || this.data.smsCode == '' || this.data.password == '') {
      this.setData({
        isDisable: true
      })
    } else {
      this.setData({
        isDisable: false
      })
    }
  },

  onSeePsw() {
    // if (!this.data.password) {
    //   return
    // }
    this.setData({
      seePsw: !this.data.seePsw
    })
  },

  onGetCode() {
    if (this.data.phoneNo.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
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
    return request(api.getRegisterSMSCodeUrl + "?phone=" + this.data.phoneNo, {
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
    if (this.data.phoneNo.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
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
    if (this.data.password.length == 0) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    if (this.data.password.length < 6 || this.data.password.length > 20) {
      wx.showToast({
        title: '请设置6-20字符长度的密码',
        icon: 'none'
      })
      return
    }
    if (!common.isPsd(this.data.password)) {
      wx.showToast({
        title: '密码只可以为数字或字母',
        icon: 'none'
      })
      return
    }
    this.setData({
      isLoading: true,
      buttonText: this.data.fromID == 0 ? '注册中...' : '提交中...',
      isDisable: true
    });
    this.onRegisterRequest()
  },

  onRegisterRequest() {
    var that = this
    request(that.data.fromID == 0 ? api.registerUrl : api.changePasswordUrl, {
      method: that.data.fromID == 0 ? 'POST' : 'PUT',
      data: that.data.fromID == 0 ? {
        mobile: that.data.phoneNo,
        mobileCode: that.data.smsCode,
        password: that.data.password
      } : {
        mobile: that.data.phoneNo,
        verifyCode: that.data.smsCode,
        newPassword: that.data.password
      },
      token: ''
    }).then(res => {
      that.setData({
        isLoading: false,
        buttonText: that.data.fromID == 0 ? '注册' : '提交',
        isDisable: false
      });
      if (res.code == 200) {
        if (that.data.fromID == 0 || that.data.fromID == 1) {
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]; //当前页面
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            phoneNo: that.data.phoneNo,
            password: that.data.password,
            loginType: 1
          })
          prevPage.validateEmpty()
          // prevPage.onLoginEvent()  //注册成功后自动登录
        }
        wx.showToast({
          title: that.data.fromID == 0 ? '注册成功' : '提交成功',
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
        buttonText: that.data.fromID == 0 ? '注册' : '提交',
        isDisable: false
      })
    })
  }
})