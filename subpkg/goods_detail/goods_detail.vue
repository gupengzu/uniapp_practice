<template>
  <view v-if="goods_info.goods_name" class="goods-detail-container">
    <!-- 轮播图区域 -->
    <swiper 
      :indicator-dots="true" 
      :autoplay="true" 
      :interval="3000" 
      :duration="1000" 
      :circular="true"
    >
      <swiper-item 
        v-for="(item, i) in goods_info.pics" 
        :key="i"
      >
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
	
	<!-- 商品信息区域 -->
	<view class="goods-info-box">
	  <!-- 商品价格 -->
	  <view class="price">￥{{goods_info.goods_price}}</view>
	  <!-- 商品信息主体区域 -->
	  <view class="goods-info-body">
	    <!-- 商品的名字 -->
	    <view class="goods-name">{{goods_info.goods_name}}</view>
	    <!-- 收藏 -->
	    <view class="favi">
	      <uni-icons type="star" size="18" color="gray"></uni-icons>
	      <text>收藏</text>
	    </view>
	  </view>
	  <!-- 运费 -->
	  <view class="yf">快递：免运费</view>
	</view>
	
	<rich-text :nodes="goods_info.goods_introduce"></rich-text>
  
	<!-- 商品导航组件区域 -->
	<view class="goods_nav">
	  <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
	</view>
  </view>
</template>

<script>
	import{mapState,mapMutations,mapGetters}from'vuex'
	
	export default {
	  data() {
	    return {
			//用富文本时如果没有goods_introduce:''默认值会报“渲染层网络层错误”
	      goods_info: {goods_introduce:''},
		  // 左侧按钮组的配置对象
		  options: [{
			  icon: 'shop',
			  text: '店铺'
		  }, {
			  icon: 'cart',
			  text: '购物车',
			  info: 0
		  }],
		  // 右侧按钮组的配置对象
		  buttonGroup: [{
			  text: '加入购物车',
			  backgroundColor: '#ff0000',
			  color: '#fff'
		  }, {
			  text: '立即购买',
			  backgroundColor: '#ffa200',
			  color: '#fff'
		  }]
	    };
	  },
	  computed:{
	  		...mapState('m_cart',['cart']),
			...mapGetters('m_cart',['total'])
	  },
	  onLoad(options) {
	    const goods_id = options.goods_id;
	    this.getGoodsDetail(goods_id);
	  },
	  watch: {
	    // 定义 total 侦听器，指向一个配置对象
	    total: {
	      // handler 属性用来定义侦听器的 function 处理函数
	      handler(newVal) {
	        const findResult = this.options.find(x => x.text === '购物车')
	        if (findResult) {
	          findResult.info = newVal
	        }
	      },
	      // immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
	      immediate: true
	    }
	  },
	  methods: {
		...mapMutations('m_cart',['addToCart']),
	    async getGoodsDetail(goods_id) {
	      const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id });
	      if (res.meta.status !== 200) return uni.$showMsg();
		  
		  res.message.goods_introduce=res.message.goods_introduce.replace(/<img /g,'<img style="display:block;" ')
		  res.message.goods_introduce=res.message.goods_introduce.replace(/webp /g,'jpg')
	      this.goods_info = res.message;
	    },
		preview(i){
			uni.previewImage({
				current:i,
				urls:this.goods_info.pics.map(x=>x.pics_big)
			})
		},
		// 左侧按钮的点击事件处理函数
		onClick(e) {
		    if (e.content.text === '购物车') {
		        // 切换到购物车页面
		        uni.switchTab({
		            url: '/pages/cart/cart'
		        })
		    }
		},
		// 右侧按钮的点击事件处理函数
		buttonClick(e) {
		    // 1. 判断是否点击了 加入购物车 按钮
		    if (e.content.text === '加入购物车') {
		
		        // 2. 组织一个商品的信息对象
		        const goods = {
		            goods_id: this.goods_info.goods_id,        // 商品的Id
		            goods_name: this.goods_info.goods_name,    // 商品的名称
		            goods_price: this.goods_info.goods_price,  // 商品的价格
		            goods_count: 1,                            // 商品的数量
		            goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
		            goods_state: true                          // 商品的勾选状态
		        }
		
		        // 3. 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
		        this.addToCart(goods)
		
		    }
		}
	  }
	};
</script>

<style lang="scss">
swiper {
  height: 750rpx;

  image {
    width: 100%;
    height: 100%;
  }
}

.goods-info-box {
  padding: 10px;
  padding-right: 0;

  .price {
    color: #C00000;
    font-size: 18px;
    margin: 10px 0;
  }

  .goods-info-body {
    display: flex;
    justify-content: space-between;
	}
    .goods-name {
		font-size: 13px;
		margin-right: 10px;
	}

  .favi {
    width: 120px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-left: 1px solid #efefef;
    color: gray;
  }

  .yf {
    font-size: 12px;
    color: gray;
    margin: 10px 0;
  }
  .goods_nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
	z-index: 9999;
  }
  
  .goods-detail-container {
    padding-bottom: 50px;
  }
}
</style>
