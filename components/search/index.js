// components/search-add/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    searchText: {
      type: String,
      value: ""
    },
    // noAddImg: {
    //   type: Boolean,
    //   value: false
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    keyword: "",
    isShowCancel: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCancelImg() {
      this.setData({
        keyword: "",
        isShowCancel: false
      })
      this.triggerEvent('cancel', {
        keyword: this.data.keyword
      }, {});
    },
    goAdd() {
      this.triggerEvent('add', {}, {});
    },
    onSearchInput(event) {
      const keyword = event.detail.value || event.detail.text
      this.setData({
        keyword: keyword ? keyword.replace(/\s+/g, '') : '',
        isShowCancel: keyword ? true : false
      })
    },
    onSearchFocus(event) {
      const keyword = event.detail.value || event.detail.text
      this.setData({
        isShowCancel: keyword ? true : false
      })
    },
    onSearchBlur(event) {
      this.setData({
        isShowCancel: false
      })
    },
    onTapSearch(event) {
      const keyword = event.detail.value || event.detail.text
      this.setData({
        keyword,
        isShowCancel: false
      })
      if (this.data.keyword) {
        this.triggerEvent('commit', {
          keyword: this.data.keyword
        }, {});
      } else {
        wx.showToast({
          title: '请输入搜索关键字',
          icon: 'none'
        })
      }
    }
  }
})