Component({
  externalClasses: ['l-class'],
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    show:Boolean,
    custom:Boolean,
    line:Boolean,
    color:String,
    type:{
      type:String,
      value:'loading'
    },
    endText:{
      type:String,
      value:'我是有底线的~'
    },
    loadingText:{
      type:String,
      value:'加载中...'
    },
    isLeft: { //检查公示列表界面卡片式列表需用此属性，将加载提示动画向左平移30个像素
      type: Boolean,
      value: false
    }
  },

  data: {

  },

  ready: function () {

  },
  methods: {
    onLoadmore(){
      this.triggerEvent('lintap');
      this.triggerEvent('lintapcatch',{},{ bubbles: true });
    }
  }
});
