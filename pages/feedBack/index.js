import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textArea: '',
    imgList: [],
    isLoading: false,
    buttonText: '提交',
    isDisable: false,
    reportPhone: '',
    index1: null,
    picker1: ['物业服务', '门岗保安', '电梯安全', '设备维护', '楼道卫生', '机动车道', '其他问题'],
    valueArr1: ['11', '12', '13', '14', '15', '16', '99']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const phone = wx.getStorageSync('phoneNo')
    this.setData({
      reportPhone: phone
    })
  },

  TypeChange(e) {
    this.setData({
      index1: e.detail.value
    })
  },

  onTextAreaChange(e) {
    this.setData({
      textArea: e.detail.detail.value.replace(/\s+/g, '')
    })
  },

  reportPhoneInput(event) {
    let reportPhone = event.detail.value || event.detail.text;
    if (!reportPhone) {
      reportPhone = ''
    }
    this.setData({
      reportPhone: reportPhone.replace(/\s+/g, '')
    })
  },

  reportPhoneBlur(event) {
    let reportPhone = event.detail.value || event.detail.text
    if (!reportPhone) {
      reportPhone = ''
    }
    if (reportPhone.length != 11 || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(reportPhone))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    }
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

  submitHandler: function submitHandler() { //提交
    if (this.data.index1 == null || this.data.textArea == '' || this.data.imgList.length == 0) {
      wx.showToast({
        title: '有必填信息未填写',
        icon: 'none'
      })
    } else {
      this.setData({
        isLoading: true,
        buttonText: '提交中...',
        isDisable: true
      });
      this.onUploadFood()
    }
  },

  onUploadFood() {
    var that = this
    wx.showLoading({
      title: '正在上传...',
      mask: true
    })
    request(api.uploadFeedBackUrl, {
      method: 'POST',
      data: {
        complaintDescription: that.data.textArea,
        complaintImages: that.data.imgList,
        complaintType: that.data.valueArr1[that.data.index1]
      },
      token: '7e9d37bc9826dc745e149aab54e8bedd'
    }).then(res => {
      that.setData({
        isLoading: false,
        buttonText: '提交',
        isDisable: false
      });
      wx.hideLoading()
      wx.showToast({
        title: res.code == 200 ? '意见反馈提交成功' : '意见反馈提交失败',
        icon: 'none'
      })
      if (res.code == 200) {
        that.goBack()
      }
    }).catch(err => {
      wx.hideLoading()
      console.log("==> [ERROR]", err)
      that.setData({
        isLoading: false,
        buttonText: '提交',
        isDisable: false
      });
    })
  },

  goBack() { //返回上一页并刷新
    let pages = getCurrentPages(); //获取所有页面
    let currentPage = null; //当前页面
    let prevPage = null; //上一个页面
    if (pages.length >= 2) {
      currentPage = pages[pages.length - 1]; //获取当前页面，将其赋值
      prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
    }
    if (prevPage) {
      // prevPage.onLoad()
    }
    wx: wx.navigateBack({ //返回上一个页面
      delta: 1
    })
  }
})