// pages/vehicle/add.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    buttonText: '提交',
    isDisable: false,
    vehicleNum: '',
    ownerName: '',
    ownerPhone: '',
    index1: null,
    picker1: [],
    CLLXCodeArr: [],
    index2: null,
    picker2: [],
    CPYSCodeArr: [],
    index3: null,
    picker3: [],
    CSYSCodeArr: [],
    index4: null,
    picker4: [],
    CLPPCodeArr: [],
    illegalPhoneNum: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDictionaryListRequest("CLLX")
    this.getDictionaryListRequest("CPYS")
    this.getDictionaryListRequest("CLYS")
    this.getDictionaryListRequest("CLPP")
  },

  TypeChange(e) {
    this.setData({
      index1: e.detail.value
    })
  },

  CPYSChange(e) {
    this.setData({
      index2: e.detail.value
    })
  },

  CSYSChange(e) {
    this.setData({
      index3: e.detail.value
    })
  },

  CLPPChange(e) {
    this.setData({
      index4: e.detail.value
    })
  },

  getDictionaryListRequest(code) {
    var that = this
    return request(api.dictionaryListUrl + "?code=" + code, {
      method: 'GET',
      data: {},
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 200) {
        var nameArr = []
        var codeArr = []
        for (let i = 0; i < res.data.length; i++) {
          nameArr.push(res.data[i].zdz)
          codeArr.push(res.data[i].zdx)
        }
        if (code == 'CLLX') {
          that.setData({
            picker1: nameArr,
            CLLXCodeArr: codeArr
          })
        } else if (code == 'CPYS') {
          that.setData({
            picker2: nameArr,
            CPYSCodeArr: codeArr
          })
        } else if (code == 'CLYS') {
          that.setData({
            picker3: nameArr,
            CSYSCodeArr: codeArr
          })
        } else if (code == 'CLPP') {
          that.setData({
            picker4: nameArr,
            CLPPCodeArr: codeArr
          })
        }
      }
    }).catch(err => {})
  },

  submitHandler() {
    if (this.data.ownerName == '' || this.data.ownerPhone == '' || this.data.vehicleNum == '') {
      wx.showToast({
        title: '请完善必填信息',
        icon: 'none'
      })
      return
    } else if (this.data.illegalPhoneNum) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    } else {
      this.setData({
        isLoading: true,
        buttonText: '提交中...',
        isDisable: true
      });
      this.addVehicleRequest()
    }
  },

  addVehicleRequest() {
    var that = this
    return request(api.addVehicleListUrl, {
      method: 'POST',
      data: {
        ownerId: wx.getStorageSync('data').archiveId,
        ownerName: that.data.ownerName,
        ownerPhone: that.data.ownerPhone,
        hasParking: '0',
        cardNumber: that.data.vehicleNum,
        carTypeCode: that.data.CLLXCodeArr[that.data.index1],
        carTypeName: that.data.picker1[that.data.index1],
        carColorCode: that.data.CSYSCodeArr[that.data.index2],
        carColorName: that.data.picker2[that.data.index2],
        cardColorCode: that.data.CPYSCodeArr[that.data.index3],
        cardColorName: that.data.picker3[that.data.index3],
        carBrandCode: that.data.CLPPCodeArr[that.data.index4],
        carBrandName: that.data.picker4[that.data.index4],
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      this.setData({
        isLoading: false,
        buttonText: '提交',
        isDisable: false
      });
      if (res.code == 200) {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2];
        prevPage.getVehicleListRequest(1, true)
        wx.showToast({
          title: '提交成功',
          icon: 'none',
          success: (res) => {
            wx.navigateBack({
              delta: 1
            });
          }
        })
      } else {
        wx.showToast({
          title: '提交失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      this.setData({
        isLoading: false,
        buttonText: '提交',
        isDisable: false
      });
    })
  },

  ownerNameInput(event) {
    let ownerName = event.detail.value || event.detail.text;
    if (!ownerName) {
      ownerName = ''
    }
    this.setData({
      ownerName: ownerName.replace(/\s+/g, '')
    })
  },

  ownerPhoneInput(event) {
    let ownerPhone = event.detail.value || event.detail.text;
    if (!ownerPhone) {
      ownerPhone = ''
    }
    this.setData({
      ownerPhone: ownerPhone.replace(/\s+/g, '')
    })
  },

  ownerPhoneBlur(event) {
    let ownerPhone = event.detail.value || event.detail.text;
    if (!ownerPhone) {
      ownerPhone = ''
    }
    if (ownerPhone.length != 11 || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(ownerPhone))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      this.setData({
        illegalPhoneNum: true
      })
    } else {
      this.setData({
        illegalPhoneNum: false
      })
    }
  },

  onVehicleNum() {
    wx.navigateTo({
      url: '/pages/vehicle/vehicleNum',
    })
  }
})