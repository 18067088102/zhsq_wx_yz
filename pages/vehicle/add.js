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
    carCardColor: '',
    carColor: '',
    carBrandName: '',
    index1: null,
    picker1: [],
    illegalPhoneNum: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDictionaryListRequest("CLLX")
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
        for (let i = 0; i < res.data.length; i++) {
          nameArr.push(res.data[i].zdz)
        }
        that.setData({
          picker1: nameArr
        })
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
        carTypeName: that.data.picker1[that.data.index1],
        carColorName: that.data.carColor,
        cardColorName: that.data.carCardColor,
        carBrandName: that.data.carBrandName
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

  TypeChange(e) {
    this.setData({
      index1: e.detail.value
    })
  },

  carCardColorInput(event) {
    let carCardColor = event.detail.value || event.detail.text;
    if (!carCardColor) {
      carCardColor = ''
    }
    this.setData({
      carCardColor: carCardColor.replace(/\s+/g, '')
    })
  },

  carColorInput(event) {
    let carColor = event.detail.value || event.detail.text;
    if (!carColor) {
      carColor = ''
    }
    this.setData({
      carColor: carColor.replace(/\s+/g, '')
    })
  },

  carBrandNameInput(event) {
    let carBrandName = event.detail.value || event.detail.text;
    if (!carBrandName) {
      carBrandName = ''
    }
    this.setData({
      carBrandName: carBrandName.replace(/\s+/g, '')
    })
  },

  onVehicleNum() {
    wx.navigateTo({
      url: '/pages/vehicle/vehicleNum',
    })
  }
})