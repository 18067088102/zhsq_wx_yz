// pages/face/change.js
import request from "../../utils/http-promise.js"
import api from '../../utils/api.js'
import common from '../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    buttonText: '',
    isDisable: false,
    type: 0,
    imgPath: '',
    imgUrl: '',

    scale: 0.5,
    cw0: "",
    ch0: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgPath: wx.getStorageSync('data').faceImg,
      imgUrl: common.combineImageUrl(wx.getStorageSync('data').faceImg),
      buttonText: this.data.type == 0 ? '上传' : '返回'
    })
  },

  submitHandler() {
    if (this.data.type == 0) {
      if (this.data.imgPath == '') {
        wx.showToast({
          title: '请选择人脸图片',
          icon: 'none'
        })
        return
      }
      this.setData({
        isLoading: false,
        buttonText: '上传中...',
        isDisable: false
      });
      this.changeFaceImgRequest()
    } else {
      wx.navigateBack({
        delta: 2,
      })
    }
  },

  changeFaceImgRequest() {
    var that = this
    return request(api.changeFaceImageUrl + '?faceImg=' + that.data.imgPath + '&id=' + wx.getStorageSync('data').id, {
      method: 'PUT',
      data: {},
      token: wx.getStorageSync('token')
    }).then(res => {
      that.setData({
        isLoading: false,
        buttonText: '上传',
        isDisable: false
      });
      if (res.code == 200) {
        wx.showToast({
          title: '上传成功',
          icon: 'none'
        })
        that.setData({
          type: 1,
          buttonText: '返回'
        })
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
          faceImgPath: that.data.imgPath,
          faceImgUrl: common.combineImageUrl(that.data.imgPath)
        })
      } else {
        wx.showToast({
          title: '上传失败，请重试',
          icon: 'none'
        })
      }
    }).catch(err => {
      that.setData({
        isLoading: false,
        buttonText: '上传',
        isDisable: false
      });
    })
  },

  ChooseImage() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: (res) => {
        let path = res.tempFilePaths[0];
        let size = res.tempFiles[0].size / 1024;
        if (size > 1024) { //大于1MB压缩
          console.log('大于1MB')
          wx.getImageInfo({
            src: path,
            success(res) {
              console.log('获得原始图片大小', res.width)
              let originWidth, originHeight;
              originHeight = res.height;
              originWidth = res.width;
              console.log(originWidth);
              //压缩比例
              // 最大尺寸限制
              let maxWidth = originWidth * that.data.scale,
                maxHeight = originHeight * that.data.scale;
              // 目标尺寸
              let targetWidth = originWidth,
                targetHeight = originHeight;
              //等比例压缩，如果宽度大于高度，则宽度优先，否则高度优先
              if (originWidth > maxWidth || originHeight > maxHeight) {
                if (originWidth / originHeight > maxWidth / maxHeight) {
                  // 要求宽度*(原生图片比例)=新图片尺寸
                  targetWidth = maxWidth;
                  targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                } else {
                  targetHeight = maxHeight;
                  targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                }
              }
              //更新canvas大小
              that.setData({
                cw0: targetWidth,
                ch0: targetHeight
              });
              let id = "myCanvas1";
              //尝试压缩文件，创建 canvas
              let ctx = wx.createCanvasContext(id, that);
              ctx.clearRect(0, 0, targetWidth, targetHeight);
              ctx.drawImage(path, 0, 0, targetWidth, targetHeight);
              ctx.draw(false, setTimeout(() => {
                wx.canvasToTempFilePath({
                  canvasId: id,
                  success: (res) => {
                    console.log(res)
                    wx.hideLoading()
                    //写入图片数组
                    let uploadFile = res.tempFilePath;
                    that.onUploadImage(uploadFile); //向服务器上传图片
                  },
                  fail: (err) => {
                    console.error(err)
                    wx.hideLoading()
                  }
                }, that)
              }), 500)
            }
          })
        } else {
          console.log('小于1MB')
          that.onUploadImage(path); //向服务器上传图片
        }
      }
    });
  },

  //向服务器上传图片的方法类
  onUploadImage(filePath) {
    var that = this
    wx.showLoading({
      title: '正在上传...',
      mask: true
    })
    //调用服务器上传图片接口，将图片上传至服务器
    wx.uploadFile({
      url: api.uploadImageUrl, //上传图片接口的url
      filePath: filePath,
      name: 'file',
      formData: {},
      header: {
        "Content-Type": "multipart/form-data",
        'token': wx.getStorageSync('token') //携带token请求
      },
      success: function (res) {
        wx.hideLoading()
        var result = JSON.parse(res.data)
        if (result.code == 200) {
          //上传成功后取到服务器回传的网络地址
          var imgUrl = common.combineImageUrl(result.data)
          that.setData({
            imgPath: result.data,
            imgUrl
          })
        }
      },
      fail: function (res) {
        //上传失败则进行相应提示
        wx.hideLoading()
        wx.showToast({
          title: '上传图片失败',
          icon: 'none'
        })
      }
    });
  },

  ViewImage() {
    wx.previewImage({
      urls: [this.data.imgUrl],
      current: this.data.imgUrl
    });
  },

  DelImg() {
    wx.showModal({
      title: '温馨提示',
      content: '确定要删除此人脸照片吗？',
      cancelText: '再想想',
      cancelColor: '#797979',
      confirmText: '删除',
      confirmColor: '#218EFF',
      success: res => {
        if (res.confirm) {
          this.setData({
            imgPath: '',
            imgUrl: ''
          })
        }
      }
    })
  }
})