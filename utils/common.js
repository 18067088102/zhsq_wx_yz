import '../utils/api.js'
import api from '../utils/api.js';

let common = {
  isPhone: function (value) {
    var regex = /^(13[0-9]{9})|(15[0-9]{9})|(17[0-9]{9})|(18[0-9]{9})|(19[0-9]{9})$/;
    if (regex.test(value)) {
      return true;
    } else {
      return false;
    }
  },
  isPsd: function (value) {
    var zg = /^[a-zA-Z0-9]+$/;
    if (zg.test(value)) {
      return true;
    } else {
      return false;
    }
  },
  isChiness: function (value) {
    var regName = /^[\u4e00-\u9fa5]{2,4}$/;
    if (regName.test(value)) {
      return true;
    } else {
      return false;
    }
  },
  combineImageUrl(imgPath) {
    var imgUrl = api.viewImgaeUrl + '?path=' + imgPath + '&token=' + wx.getStorageSync('token');
    if (imgPath) {
      return imgUrl
    } else {
      return ''
    }
  }
}
export default common;