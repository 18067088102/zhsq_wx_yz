// pages/login/index.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'
import common from '../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginType: 1,
    phoneNo: '',
    password: '',
    smsCode: '',
    seePsw: false,
    isLoading: false,
    buttonText: '登录',
    isDisable: true,
    getCodeText: '获取验证码',
    isDisabled: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phoneNo: wx.getStorageSync('phoneNo')
    })
  },
  changeActive(e) {
    let loginType = e.currentTarget.dataset.id;
    this.setData({
      loginType
    });
  },
  onGetCode() {
    if (this.data.phoneNo == '') {
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'none'
      });
      return
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
    return request(api.getLoginSMSCodeUrl + "?phone=" + this.data.phoneNo, {
      method: 'POST',
      data: {},
      token: ''
    }).then(res => {
      that.handleRequestResult(res);
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
        title: res.msg,
        icon: "none"
      })
    }
  },
  submitHandler: function submitHandler(e) {
    if (this.data.phoneNo.length != 11 || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.phoneNo))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }
    if (this.data.loginType == 1 && (this.data.password.length < 6 || this.data.password.length > 20)) {
      wx.showToast({
        title: '请输入6-20字符长度的密码',
        icon: 'none'
      })
      return
    }
    if (this.data.loginType == 1 && !common.isPsd(this.data.password)) {
      wx.showToast({
        title: '密码只可以为数字或字母',
        icon: 'none'
      })
      return
    }
    this.setData({
      isLoading: true,
      buttonText: '登录中...',
      isDisable: true
    });
    this.onLoginEvent()
  },

  onLoginEvent() {
    var that = this
    return request(api.loginUrl, {
      method: 'POST',
      data: {
        account: that.data.phoneNo,
        loginType: that.data.loginType,
        secret: that.data.loginType == 1 ? that.data.password : that.data.smsCode,
        userType: '3'
      },
      token: ''
    }).then(res => {
      this.setData({
        isLoading: false,
        buttonText: '登录',
        isDisable: false
      });
      if (res.code == 200) {
        wx.setStorageSync('phoneNo', that.data.phoneNo)
        wx.setStorageSync('token', res.data.token)
        wx.setStorageSync('userId', res.data.userId)
        wx.showToast({
          title: '登录成功',
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
          icon: "none"
        })
      }
    }).catch(err => {
      this.setData({
        isLoading: false,
        buttonText: '登录',
        isDisable: false
      });
    })
  },
  toRegister() {
    wx.navigateTo({
      url: '/pages/register/index',
    })
  },
  toForget() {
    wx.navigateTo({
      url: '/pages/register/index?fromID=1',
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
    if (this.data.loginType == 1) {
      if (this.data.phoneNo == '' || this.data.password == '') {
        this.setData({
          isDisable: true
        })
      } else {
        this.setData({
          isDisable: false
        })
      }
    } else {
      if (this.data.phoneNo == '' || this.data.smsCode == '') {
        this.setData({
          isDisable: true
        })
      } else {
        this.setData({
          isDisable: false
        })
      }
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
  onWXLogin() {
    wx.login({
      success(res) {
        if (res.code) {
          const code = res.code
          console.log(code)
          var that = this
          return request(api.wxLoginUrl + '?code=' + code, {
            method: 'POST',
            data: {},
            token: ''
          }).then(res => {
            if (res.code == 200) {

            } else {
              wx.showToast({
                title: res.msg,
                icon: "none"
              })
            }
          }).catch(err => {})
        } else {
          wx.showToast({
            title: '登录失败！' + res.errMsg,
            icon: 'none'
          })
        }
      }
    })
  }
})