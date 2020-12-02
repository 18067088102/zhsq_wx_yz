// pages/visitorManager/add.js

import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textArea: '',
    isLoading: false,
    buttonText: '提交',
    isDisable: false,
    imgList: [],
    visitorName: '',
    visitorPhone: '',
    visitorNum: '',
    date1: null,
    source: '',
    illegalPhoneNum: false,
    roomId: '', //访客添加时使用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.source) {
      wx.setStorageSync('villageName', options.villageName)
      wx.setStorageSync('villageId', options.villageId)
      this.setData({
        roomId: options.roomId
      })
    }
    var nowDate = new Date();
    var year = nowDate.getFullYear(),
      month = nowDate.getMonth() + 1,
      day = nowDate.getDate()
    this.setData({
      date1: `${year}-${month}-${day}`,
      source: options.source ? options.source : '1'
    })
  },

  visitorNameInput(event) {
    let visitorName = event.detail.value || event.detail.text;
    if (!visitorName) {
      visitorName = ''
    }
    this.setData({
      visitorName: visitorName.replace(/\s+/g, '')
    })
  },

  visitorPhoneInput(event) {
    let visitorPhone = event.detail.value || event.detail.text;
    if (!visitorPhone) {
      visitorPhone = ''
    }
    this.setData({
      visitorPhone: visitorPhone.replace(/\s+/g, '')
    })
  },

  visitorPhoneBlur(event) {
    let visitorPhone = event.detail.value || event.detail.text;
    if (!visitorPhone) {
      visitorPhone = ''
    }
    if (visitorPhone.length != 11 || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(visitorPhone))) {
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

  visitorNumInput(event) {
    let visitorNum = event.detail.value || event.detail.text;
    if (!visitorNum) {
      visitorNum = ''
    }
    this.setData({
      visitorNum: visitorNum.replace(/\s+/g, '')
    })
  },

  DateChange(e) {
    this.setData({
      date1: e.detail.value
    })
  },

  textareaAInput(e) {
    this.setData({
      textArea: e.detail.value.replace(/\s+/g, '')
    })
  },

  submitHandler() {
    if (this.data.visitorName == '' || this.data.visitorPhone == '' || this.data.visitorNum == '' || this.data.textArea == '') {
      wx.showToast({
        title: '请完善基本信息',
        icon: 'none'
      })
      return
    } else if (this.data.illegalPhoneNum) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    } else if (this.data.imgList.length == 0) {
      wx.showToast({
        title: '请上传人脸照片',
        icon: 'none'
      })
      return
    } else {
      this.setData({
        isLoading: true,
        buttonText: '提交中...',
        isDisable: true
      });
      this.addVisitorRequest()
    }
  },

  addVisitorRequest() {
    var that = this
    var imgUrl = that.data.imgList[0]
    var str1 = imgUrl.split('?')[1]
    var str2 = str1.split('&')[0]
    var imgPath = str2.split('=')[1]
    return request(that.data.source == '1' ? api.addVisitorRecordUrl : api.addVisitorRecordUrl1, {
      method: 'POST',
      data: {
        roomId: that.data.source == '1' ? wx.getStorageSync('data').roomId : that.data.roomId,
        source: that.data.source,
        villageId: wx.getStorageSync('villageId'),
        visitReason: that.data.textArea,
        visitTime: that.data.date1,
        visitorFaceImg: imgPath,
        visitorName: that.data.visitorName,
        visitorNum: that.data.visitorNum,
        visitorPhone: that.data.visitorPhone
      },
      token: that.data.source == '1' ? wx.getStorageSync('token') : ''
    }).then(res => {
      this.setData({
        isLoading: false,
        buttonText: '提交',
        isDisable: false
      });
      if (res.code == 200) {
        if (that.data.source == '1') {
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]; //当前页面
          var prevPage = pages[pages.length - 2];
          prevPage.getVisitorListRequest(1, true)
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
          wx.switchTab({
            url: '/pages/home/index',
          })
        }
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

  onGetPictures(e) {
    this.setData({
      imgList: e.detail
    })
  },

  onDeletePicture(e) {
    this.setData({
      imgList: e.detail
    })
  },

  onShareAppMessage() {
    return {
      title: '智慧社区访客登记',
      imageUrl: '/images/mine/icon_logo.png',
      path: `/pages/visitorManager/add?source=2&roomId=${wx.getStorageSync('data').roomId}&villageId=${wx.getStorageSync('villageId')}&villageName=${wx.getStorageSync('villageName')}`
    }
  }
})