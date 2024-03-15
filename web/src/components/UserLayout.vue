<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const router = useRouter()

const menus = [
    {
        name: 'Dashboard',
        routeName: 'dashboard'
    },
    {
        name: 'Check-bill',
        routeName: 'check-bill'
    },
    {
        name: 'Products',
        routeName: 'products-list'
    },
    {
        name: 'Order',
        routeName: 'order-list'
    },

]

const route = useRoute()
const activeMenu = ref('')

onMounted(async () => {

})
</script>


<template>
    <div class="navbar bg-base-200 flex justify-between py-4">
        <RouterLink :to="{path : '/checkbill'}">
        <a class="btn btn-ghost btn-outline text-2xl">MY POS</a>
    </RouterLink>
        <div class="gap-10">
            <RouterLink :to="{name: 'products-list'}">
                <div class="btn text-xl">Products</div>
            </RouterLink>
            <RouterLink :to="{name: 'dashboard'}">
                <div class="btn text-xl">Dashboard</div>
            </RouterLink>
            <RouterLink :to="{name: 'order-list'}">
                <div class="btn text-xl">Orders</div>
            </RouterLink>

        </div>
        <div>
        </div>
    </div>
    <slot></slot>
</template>