// pages/notice/detail.js

import request from '../../utils/http-promise.js'
import api from '../../utils/api.js'
var WxParse = require('../../utils/wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    fromID: '', //0:小区头条；1:小区风采
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let noticeId = options.id;
    if(options.original) { //轮播图进入
      this.addBannerClickRequest(noticeId)
    }
    let fromID = options.fromID;
    wx.setNavigationBarTitle({
      title: options.fromID == 0 ? '公告详情' : '风采详情'
    })
    this.setData({
      noticeId,
      fromID
    });
    this.getDetailInfo();
  },
  getDetailInfo() {
    var that = this;
    var url = that.data.fromID == 0 ? api.getHeadLinesInfoUrl : api.getElegantInfoUrl
    request(url + "/" + that.data.noticeId, {
      method: 'GET',
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 200) {
        that.setData({
          info: res.data
        })
        that.setData({
          rticle_content: WxParse.wxParse('article_content', 'html', res.data.content, that, 5) //解析富文本编辑代码
        });
      }
    })
  },

  addBannerClickRequest(id) {
    request(api.addBannerTapCountUrl + '/' + id, {
      method: 'PUT',
      token: wx.getStorageSync('token')
    }).then(res => {})
  },
})