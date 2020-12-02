import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'

// pages/snapshot/add.js
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
    idx: 0, //0:物业报修；1:随手拍
    typeIndex: 1, //报修类型
    typeArr: ['公共区域报修', '私人区域报修'],
    repairArea: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var idx = options.typeIndex
    if (idx == 1) {
      wx.setNavigationBarTitle({
        title: '添加随手拍',
      })
    }
    this.setData({
      idx
    })
  },

  onSelectType(e) {
    const idx = e.currentTarget.dataset.index
    this.setData({
      typeIndex: idx
    })
  },

  submitHandler() {
    if (this.data.idx == 0 && this.data.repairArea.length == 0) {
      wx.showToast({
        title: '请填写报修区域',
        icon: 'none'
      })
      return
    }
    if (this.data.textArea.length == 0) {
      wx.showToast({
        title: '请填写问题描述',
        icon: 'none'
      })
      return
    }
    if (this.data.imgList.length == 0) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }
    this.setData({
      isLoading: true,
      buttonText: '提交中...',
      isDisable: true
    });
    this.addRepairRecordRequest()
  },

  addRepairRecordRequest() {
    var that = this
    var imgs = []
    for (let i = 0; i < that.data.imgList.length; i++) {
      const imgUrl = that.data.imgList[i]
      var str1 = imgUrl.split('?')[1]
      var str2 = str1.split('&')[0]
      var imgPath = str2.split('=')[1]
      imgs.push(imgPath)
    }
    return request(that.data.idx == 0 ? api.addRepairRecordUrl : api.addConvenientRecordUrl, {
      method: 'POST',
      data: that.data.idx == 0 ? {
        villageId: wx.getStorageSync('villageId'),
        repairDescription: that.data.textArea,
        repairList: imgs,
        repairType: that.data.typeIndex.toString(),
        repairArea: that.data.repairArea
      } : {
        villageId: wx.getStorageSync('villageId'),
        convenientDescription: that.data.textArea,
        repairList: imgs
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
        prevPage.setData({
          TabCur: 0
        })
        prevPage.getRepairListRequest(1, true)
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

  textareaAInput(e) {
    this.setData({
      textArea: e.detail.value.replace(/\s+/g, '')
    })
  },

  repairAreaInput(event) {
    let repairArea = event.detail.value || event.detail.text;
    if (!repairArea) {
      repairArea = ''
    }
    this.setData({
      repairArea: repairArea.replace(/\s+/g, '')
    })
  },
})