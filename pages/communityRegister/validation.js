// pages/communityRegister/validation.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    villageName: '',
    villageId: '',
    buildingName: '',
    buildingId: '',
    buildingIdArr: [],
    index2: null,
    picker2: [],
    roomName: '',
    roomId: '',
    roomIdArr: [],
    index3: null,
    picker3: [],
    phoneNo: "",
    smsCode: '',
    isLoading: false,
    buttonText: '开始验证',
    isDisable: true,
    getCodeText: '获取验证码',
    isDisabled: true,
    illegalPhoneNum: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.setData({
      villageName: wx.getStorageSync('villageName'),
      villageId: wx.getStorageSync('villageId')
    })
    this.getBuildingListRequest()
  },

  buildingChange(e) {
    this.setData({
      index2: e.detail.value,
      buildingId: this.data.buildingIdArr[e.detail.value]
    })
    this.getRoomListRequest()
  },

  roomChange(e) {
    this.setData({
      index3: e.detail.value,
      roomId: this.data.roomIdArr[e.detail.value]
    })
  },

  getBuildingListRequest() {
    var that = this
    return request(api.getBuildingListUrl, {
      method: 'GET',
      data: {
        villageId: that.data.villageId
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 200) {
        var nameArr = []
        var idArr = []
        for (let i = 0; i < res.data.length; i++) {
          nameArr.push(res.data[i].name)
          idArr.push(res.data[i].id)
        }
        that.setData({
          picker2: nameArr,
          buildingIdArr: idArr
        })
      }
    }).catch(err => {})
  },

  getRoomListRequest() {
    var that = this
    return request(api.getRoomNumListUrl, {
      method: 'GET',
      data: {
        buildingId: that.data.buildingId
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 200) {
        var nameArr = []
        var idArr = []
        for (let i = 0; i < res.data.length; i++) {
          nameArr.push(res.data[i].name)
          idArr.push(res.data[i].id)
        }
        that.setData({
          picker3: nameArr,
          roomIdArr: idArr
        })
      }
    }).catch(err => {})
  },

  onSelectVillage() {
    wx.navigateTo({
      url: '/pages/communitySelect/index?fromID=2'
    })
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
    return request(api.getAuthSMSCodeUrl + "?phone=" + this.data.phoneNo, {
      method: 'POST',
      data: {},
      token: wx.getStorageSync('token')
    }).then(res => {
      that.handleRequestResult(res);
    }).catch(err => {

    })
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
      this.setData({
        illegalPhoneNum: true
      })
    }else{
      this.setData({
        illegalPhoneNum: false
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
    this.validateEmpty();
  },
  validateEmpty() {
    if (this.data.phoneNo == '' || this.data.smsCode == '') {
      this.setData({
        isDisable: true
      })
    } else {
      this.setData({
        isDisable: false
      })
    }
  },
  submitHandler() {
    if(this.data.villageId == ''||this.data.buildingId == ''||this.data.roomId == '') {
      wx.showToast({
        title: '请完善房屋信息',
        icon: 'none'
      })
      return
    }else if(this.data.illegalPhoneNum) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }else{
      this.setData({
        isLoading: true,
        buttonText: '验证中...',
        isDisable: true
      });
      this.onAuthEvent()
    }
  },
  onAuthEvent() {
    var that = this
    return request(api.roomAuthUrl1, {
      method: 'PUT',
      data: {
        buildingId: that.data.buildingId,
        mobile: that.data.phoneNo,
        roomId: that.data.roomId,
        verifyCode: that.data.smsCode,
        villageId: that.data.villageId
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      that.setData({
        isLoading: false,
        buttonText: '开始验证',
        isDisable: false
      });
      if (res.code == 200) {
        wx.showToast({
          title: '验证成功',
          icon: "none",
          success: (res) => {
            wx.navigateTo({
              url: `/pages/communityRegister/validation1?&buildingName=${that.data.picker2[that.data.index2]}&buildingId=${that.data.buildingId}&roomName=${that.data.picker3[that.data.index3]}&roomId=${that.data.roomId}`,
            })
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
      }
    }).catch(err => {
      that.setData({
        isLoading: false,
        buttonText: '开始验证',
        isDisable: false
      });
    })
  }
})