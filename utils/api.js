// 生产
// let BASE_URL = 'https://live.cncqs.cn:8443/mpp/api/v1';
// let HOST_SERVER = BASE_URL + '/auth';
// let HOST_SERVER2 = BASE_URL + '/archives';
// let HOST_SERVER3 = BASE_URL + '/notification'; 
// let HOST_SERVER4 = BASE_URL + '/estate';

// 本地测试
let HOST_SERVER = 'http://192.168.1.170:7000';
let HOST_SERVER2 = 'http://192.168.1.170:7100';
let HOST_SERVER3 = 'http://192.168.1.170:7200';
let HOST_SERVER4 = 'http://192.168.1.170:7300';

let api = {  //共52个接口
  //共用 5
  getVillageListUrl: HOST_SERVER2 + '/village/page', //查询小区列表分页接口
  viewImgaeUrl: HOST_SERVER2 + '/img/view', //拼接图片完整地址
  dictionaryListUrl: HOST_SERVER2 + '/dictionary/list', //查询字典列表接口
  uploadImageUrl: HOST_SERVER2 + '/img/upload', //上传图片  
  noTokenUploadImageUrl: HOST_SERVER2 + '/img/noOauthCUpload', //没有token时上传图片

  //账号管理模块 8
  registerUrl: HOST_SERVER + "/doCreateTenantAccount", //创建小程序用户账户
  loginUrl: HOST_SERVER + '/login', //登录接口  
  wxLoginUrl: HOST_SERVER + '/wechat/owner', //微信登录接口
  logoutUrl: HOST_SERVER + '/logout', //退出登录接口
  changePasswordUrl: HOST_SERVER + '/user/retrievePassword', //找回密码接口
  getLoginSMSCodeUrl: HOST_SERVER + "/sendLoginSMS", //发送登录账号短信验证码接口
  getAuthSMSCodeUrl: HOST_SERVER2 + "/sendAuthenticateSMS", //发送社区认证短信验证码接口
  getRegisterSMSCodeUrl: HOST_SERVER + "/sendRegisterSMS", //发送注册账号短信验证码接口

  //轮播图、小区头条、小区风采模块 6
  getBannerListUrl: HOST_SERVER3 + '/banner/list', //查询公告轮播图信息分页列表接口
  addBannerTapCountUrl: HOST_SERVER3 + '/banner/addBannerClick', //添加轮播图点击数
  getHeadLinesListUrl: HOST_SERVER3 + '/headlines/page', //查询公告信息分页列表接口
  getElegantListUrl: HOST_SERVER3 + '/elegant/page', //查询小区风采信息分页列表接口
  getHeadLinesInfoUrl: HOST_SERVER3 + '/headlines/info', //查询公告信息详情接口
  getElegantInfoUrl: HOST_SERVER3 + '/elegant/info', //查询小区风采信息详情接口

  //访客管理模块 5 
  getVisitorListUrl: HOST_SERVER4 + '/visitorManage/page', //查询访客记录分页列表接口
  deleteVisitorRecordUrl: HOST_SERVER4 + '/visitorManage/delete', //删除访客接口
  addVisitorRecordUrl: HOST_SERVER4 + '/visitorManage/save', //新增访客接口
  addVisitorRecordUrl1: HOST_SERVER4 + '/visitorManage/saveFromVisitor', //新增访客接口(访客自行添加时)
  reviewVisitorUrl: HOST_SERVER4 + '/visitorManage/doVerify', //来访审核接口

  //生活缴费模块 2
  getEstateFeeListUrl: HOST_SERVER4 + '/feeOrderEstate/page', //查询物业费信息分页列表接口
  getParkingFeeListUrl: HOST_SERVER4 + '/feeOrderParking/page', //查询停车费信息分页列表接口
  
  //随手拍模块 6
  getRepairListUrl: HOST_SERVER4 + '/repair/page', //查询报修信息分页列表接口
  getConvenientListUrl: HOST_SERVER4 + '/convenient/page', //查询随手拍信息分页列表接口
  addRepairRecordUrl: HOST_SERVER4 + '/repair/save', //新增报修信息接口
  addConvenientRecordUrl: HOST_SERVER4 + '/convenient/save', //新增随手拍信息接口
  deleteRepairRecordUrl: HOST_SERVER4 + '/repair/delete', //报修撤销删除接口
  deleteConvenientRecordUrl: HOST_SERVER4 + '/convenient/delete', //随手拍撤销删除接口

  //认证模块 4
  roomAuthUrl1: HOST_SERVER2 + '/authenticate/doAuthenticateRoom', //社区认证接口1
  roomAuthUrl2: HOST_SERVER2 + '/authenticate/doSaveAuthenticatePerson', //社区认证接口2
  getBuildingListUrl: HOST_SERVER2 + '/building/list', //查询楼栋列表接口
  getRoomNumListUrl: HOST_SERVER2 + '/room/list', //查询房屋列表接口

  //常用电话模块 1
  getCommonPhoneUrl: HOST_SERVER4 + '/onekeyCallConf/page', //查询一键呼叫分页列表接口
  
  //用户信息模块 5
  setNickNameUrl: HOST_SERVER2 + '/authenticate/doSetNickName', //设置昵称接口
  changePhoneNumUrl: HOST_SERVER2 + '/authenticate/doUpdateOwnerAuthenticateMobile', //更改手机号码接口
  changeFaceImageUrl: HOST_SERVER2 + '/authenticate/doUpdateFaceImg', //修改头像接口
  queryUserInfoUrl: HOST_SERVER2 + '/authenticate/doFindByUserId', //查询当前用户信息
  getMineCountNumUrl: HOST_SERVER2 + '/authenticate/doCountOwnerAuthenticateCount', //房产住户车辆统计接口

  //房产模块 2
  getRoomListUrl: HOST_SERVER2 + '/authenticate/page', //查询房屋列表分页接口
  changeRoomUrl: HOST_SERVER2 + '/authenticate/doChangeVillage', //切换房产接口

  //车辆管理模块 3
  getVehicleListUrl: HOST_SERVER2 + '/car/page', //查询车辆列表分页接口
  addVehicleListUrl: HOST_SERVER2 + '/car/doSaveCar', //新增车辆信息接口
  deleteVehicleUrl: HOST_SERVER2 + '/car/delete', //删除车辆信息接口

  //住户管理模块 4
  getPersonListUrl: HOST_SERVER2 + '/person/list', //查询住户列表接口
  getPersonDetailUrl: HOST_SERVER2 + '/person/info', //查询住户信息接口
  deletePersonRecordUrl: HOST_SERVER2 + '/person/delete', //删除住户信息接口  
  addPersonRecordUrl: HOST_SERVER2 + '/person/save', //新增住户信息接口 

  //意见反馈 1
  uploadFeedBackUrl: HOST_SERVER4 + '/complaint/save', //意见反馈
}

module.exports = api;