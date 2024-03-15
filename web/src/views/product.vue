<script setup>
import UserLayout from '@/components/UserLayout.vue'
import { useProductStore } from '@/stores/productStore'
import { RouterLink } from 'vue-router'
import { onMounted, ref } from 'vue'
import { io } from 'socket.io-client';

const productStore = useProductStore()



onMounted(() => {
    
});
</script>
<!-- ... -->
<template>


    <UserLayout>
        <div class="flex xl:p-10 gap-3 rounded-xl">
            <div class="flex-1 bg-base-200 rounded-xl">
                <div class="flex flex-row m-5 gap-3">
                    <div class="dropdown flex-1 w-auto">
                        <div tabindex="0" role="button" class="btn btn-neutral lg:text-xl">เลือกรายการสินค้า</div>
                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-80">
                            <li><a>Item 1</a></li>
                            <li><a>Item 2</a></li>
                        </ul>
                    </div>
                    <RouterLink :to="{ name: 'product-create' }">
                        <div class="btn flex-1 btn-success text-white md:text-xl">
                            เพิ่มสินค้า
                        </div>
                    </RouterLink>

                    <RouterLink :to="{ name: 'type-edit' }">
                        <div class="btn flex-1 btn-success text-white md:text-xl">
                            เพิ่มรายการสินค้า
                        </div>
                    </RouterLink>
                    <label class="input input-bordered flex items-center gap-2 w-80 flex-1">
                        <input type="text" class="grow" placeholder="ค้นหาสินค้า" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                            class="w-4 h-4 opacity-70">
                            <path fill-rule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clip-rule="evenodd" />
                        </svg>
                    </label>
                </div>
                <div
                    class="bg-base-200 md:px-5 pb-5 f grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 item-center">

                    <div v-for=" (item, index) in productStore.list"
                        class="card card-compact w-56bg-base-100 shadow-xl">
                        <figure class="w-56 h-56"><img :src="item.imageUrl" alt="Shoes" /></figure>
                        <div class="card-body">
                            <h2 class="card-title text-center">{{ item.name }}</h2>
                            <p class="text-lg">ต้นทุน {{ item.cost }} บาท</p>
                            <p class="text-lg">ราคาขาย {{ item.price }} บาท</p>

                            <div class="card-actions justify-center">
                                <RouterLink :to="{ name: 'product-edit', params: { id: index } }">
                                    <button class="btn btn-warning">แก้ไข</button>

                                </RouterLink>
                                <button class="btn btn-error" @click="productStore.removeProduct(index)">ลบ</button>

                            </div>

                        </div>
                    </div>

                </div>

            </div>


        </div>


    </UserLayout>

    <!-- ... -->
</template>