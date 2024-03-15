import { createRouter, createWebHistory } from 'vue-router'
import checkView from '@/views/check.vue'
import dashboard from '@/views/dashboard.vue'
import order from '@/views/order.vue'
import product from '@/views/product.vue'
import EditProduct from '@/views/EditProduct.vue'
import EditType from '@/views/EditType.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: dashboard
    },
    {
      path: '/checkbill',
      name: 'check-bill',
      component: checkView
    },
    {
      path: '/order',
      name: 'order-list',
      component: order
    },
    {
      path: '/product',
      name: 'products-list',
      component: product
    },
    {
      path: '/product/:id',
      name: 'product-edit',
      component: EditProduct
    },
    {
      path: '/product/create',
      name: 'product-create',
      component: EditProduct
    },
    {
      path : '/product/type',
      name : 'type-edit',
      component: EditType
    }
    
  ]
})

export default router
