<template>
	<view class="cart-container">
		<!-- 收货地址组件 -->
		<my-address></my-address>
		
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
		  <!-- 左侧的图标 -->
		  <uni-icons type="shop" size="18"></uni-icons>
		  <!-- 描述文本 -->
		  <text class="cart-title-text">购物车</text>
		</view>
		
		<!-- 商品列表区域 -->		
		<uni-swipe-action>
			<block v-for="(goods, i) in cart" :key="i">
			 <uni-swipe-action-item :options="options" @click="swipeItemClickHandler(goods)">
			  <my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
			 </uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		
		<my-settle></my-settle>
	</view>
</template>

<script>
import badgeMix from '@/mininx/tabvar-badge.js'
import {mapState,mapMutations}from 'vuex'
	
	export default {
		mixins:[badgeMix],
		data() {
			return {
				options:[{
					text:'删除',
					style:{
						backgroundColor:"#C00000"
					}
				}]
			};
		},
		computed:{
			...mapState('m_cart',['cart'])
		},
		methods:{
			...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','removeGoodsById']),
			radioChangeHandler(e){
				this.updateGoodsState(e)
			},
			numberChangeHandler(e){
				this.updateGoodsCount(e)
			},
			swipeItemClickHandler(goods){
				this.removeGoodsById(goods.goods_id)
			}
		}
	}
</script>

<style lang="scss">
.cart-title {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  .cart-title-text {
    margin-left: 10px;
  }
}
.cart-container{
	padding-bottom: 50px;
}
</style>
