// pages/communityRegister/validation1.js

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
    imgList: [],
    userName: '',
    idCardNum: '',
    phoneNum: '',
    birthDate: '',
    sex: '',
    index1: 0,
    picker1: [],
    registerCodeArr: [],
    index2: 0,
    picker2: ['常住', '暂住', '出租'],
    index3: 0,
    picker3: [],
    relationCodeArr: [],
    index4: 0,
    picker4: [],
    cradCodeArr: [],
    buildingName: '',
    buildingId: '',
    roomName: '',
    roomId: '',
    isLegalIdNum: true,
    illegalPhoneNum: false,
    fromID: 0, //0:社区登记第二个页面；1:新增住户页面
    currentHouse: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.fromID) {
      this.setData({
        fromID: options.fromID,
        index2: 0,
        currentHouse: wx.getStorageSync('villageName') + wx.getStorageSync('data').buildingName + '栋' + wx.getStorageSync('data').roomName + '室'
      })
      wx.setNavigationBarTitle({
        title: '新增住户'
      })
    }else{
      this.setData({
        buildingName: options.buildingName,
        buildingId: options.buildingId,
        roomName: options.roomName,
        roomId: options.roomId
      })
    }
    this.getDictionaryListRequest("RKLX")
    this.getDictionaryListRequest("HZGX")
    this.getDictionaryListRequest("ZJLX")
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
        if (code == 'RKLX') {
          that.setData({
            picker1: nameArr,
            registerCodeArr: codeArr
          })
        } else if (code == 'HZGX') {
          that.setData({
            picker3: nameArr,
            relationCodeArr: codeArr
          })
        } else if (code == 'ZJLX') {
          that.setData({
            picker4: nameArr,
            cradCodeArr: codeArr
          })
        }
      }
    }).catch(err => {})
  },

  registerChange(e) {
    this.setData({
      index1: e.detail.value
    })
  },

  liveChange(e) {
    this.setData({
      index2: e.detail.value
    })
  },

  relationChange(e) {
    this.setData({
      index3: e.detail.value
    })
  },

  cardChange(e) {
    this.setData({
      index4: e.detail.value
    })
  },

  userNameInput(event) {
    let userName = event.detail.value || event.detail.text;
    if (!userName) {
      userName = ''
    }
    this.setData({
      userName: userName.replace(/\s+/g, '')
    })
  },

  idNumInput(event) {
    let idCardNum = event.detail.value || event.detail.text;
    if (!idCardNum) {
      idCardNum = ''
    }
    this.setData({
      idCardNum: idCardNum.replace(/\s+/g, '')
    })
  },

  idNumBlur(event) {
    let idNum = event.detail.value || event.detail.text;
    var idCardReg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;
    if (!idCardReg.test(idNum)) {
      this.setData({
        isLegalIdNum: false
      })
      wx.showToast({
        title: '身份证号码格式有误',
        icon: "none"
      })
    } else {
      this.setData({
        birthDate: idNum.substring(6, 10) + "-" + idNum.substring(10, 12) + "-" + idNum.substring(12, 14),
        sex: parseInt(idNum.substr(16, 1)) % 2 == 1 ? '男' : '女',
        isLegalIdNum: true
      })
    }
  },

  phoneNumInput(event) {
    let phoneNum = event.detail.value || event.detail.text;
    if (!phoneNum) {
      idCaphoneNumrdNum = ''
    }
    this.setData({
      phoneNum: phoneNum.replace(/\s+/g, '')
    })
  },

  phoneNumBlur(event) {
    let phoneNum = event.detail.value || event.detail.text;
    if (!phoneNum) {
      phoneNum = ''
    }
    if (phoneNum.length != 11 || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phoneNum))) {
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

  submitHandler() {
    if (this.data.index1 == null || this.data.index2 == null || this.data.index3 == null ||
      this.data.index4 == null || this.data.userName == '' || this.data.idCardNum == '') {
      wx.showToast({
        title: '请完善基本信息',
        icon: 'none'
      })
      return
    } else if (!this.data.isLegalIdNum) {
      wx.showToast({
        title: '身份证号码格式有误',
        icon: 'none'
      })
      return
    } else if (this.data.phoneNum == '' || this.data.birthDate == '' || this.data.sex == '') {
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
      this.onAuthEvent()
    }
  },

  onAuthEvent() {
    var that = this
    var imgUrl = that.data.imgList[0]
    var str1 = imgUrl.split('?')[1]
    var str2 = str1.split('&')[0]
    var imgPath = str2.split('=')[1]
    return request(that.data.fromID == 0 ? api.roomAuthUrl2 : api.addPersonRecordUrl, {
      method: that.data.fromID == 0 ? 'PUT' : 'POST',
      data: that.data.fromID == 0 ? {
        userId: wx.getStorageSync('userId'),
        userType: '3',
        birthDay: that.data.birthDate,
        buildingId: that.data.buildingId,
        buildingName: that.data.buildingName,
        faceImg: imgPath,
        idCardNumber: that.data.idCardNum,
        idCardType: that.data.picker4[that.data.index4],
        liveTypeName: that.data.picker2[that.data.index2],
        mobile: that.data.phoneNum,
        name: that.data.userName,
        registerTypeName: that.data.picker1[that.data.index1],
        relationCode: that.data.relationCodeArr[that.data.index3],
        relationName: that.data.picker3[that.data.index3],
        roomId: that.data.roomId,
        roomName: that.data.roomName,
        sex: that.data.sex,
        villageId: wx.getStorageSync('villageId'),
        villageName: wx.getStorageSync('villageName')
      } : {
        roomId: wx.getStorageSync('data').roomId,
        liveType: '1',
        relationName: that.data.picker3[that.data.index3],
        relationCode: that.data.relationCodeArr[that.data.index3],
        mobile: that.data.phoneNum,
        name: that.data.userName,
        sexName: that.data.sex,
        sexCode: that.data.sex == '男' ? '1' : '2',
        nationName: "汉",
        nationCode: "01",
        birthDay: that.data.birthDate,
        idCardTypeName: that.data.picker4[that.data.index4],
        idCardTypeCode: that.data.cradCodeArr[that.data.index4],
        idCardNumber: that.data.idCardNum,
        faceImg: imgPath,
        registerTypeName: that.data.picker1[that.data.index1],
        registerTypeCode: that.data.registerCodeArr[that.data.index1]
      },
      token: wx.getStorageSync('token')
    }).then(res => {
      this.setData({
        isLoading: false,
        buttonText: '提交',
        isDisable: false
      });
      if (res.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: "none",
          success: (res) => {
            that.data.fromID == 0 ? wx.navigateBack({
              delta: 2,
            }) : wx.navigateBack({
              delta: 1,
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
  }
})