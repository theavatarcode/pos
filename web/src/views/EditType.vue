<script setup>
import UserLayout from '@/components/UserLayout.vue'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const formData = reactive({
    name : '',
    cost : 0,
    price : 0,
    imageUrl : '',

})
const mode = ref('CREATE')

onMounted(() =>{
    if(route.params.id){
        mode.value = 'EDIT'
        
    }
})
</script>

<template>
    <UserLayout>
        <div class=" h-full justify-items-center m-20 p-20 bg-base-200 gap-1 rounded-xl grid grid-cols-2">
            <div class="rounded-xl">
                <div class="carousel-item h-full rounded-xl">
                    <img src="https://daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg" class="rounded-xl"/>
                </div>
                <input type="file" class="mt-2 ">


            </div>
            <div>

                <div>
                    <label class="form-control w-full max-w-xs">
                        <div class="label">
                            <span class="label-text">ชื่อสินค้า</span>
                        </div>
                        <input type="text" placeholder="ชื่อสินค้า" class="input input-bordered w-full max-w-xs" />
                    </label>
                </div>
                <div>
                    <label class="form-control w-full max-w-xs">
                        <div class="label">
                            <span class="label-text">ราคาขาย</span>
                        </div>
                        <input type="text" placeholder="ราคาขาย" class="input input-bordered w-full max-w-xs" />
                    </label>
                </div>
                <div>
                    <label class="form-control w-full max-w-xs">
                        <div class="label">
                            <span class="label-text">ต้นทุน</span>
                        </div>
                        <input type="text" placeholder="ต้นทุน" class="input input-bordered w-full max-w-xs" />
                    </label>
                </div>
                <div>
                    <label class="form-control w-full max-w-xs">
                        <div class="label">
                            <span class="label-text">imageUrl</span>
                        </div>
                        <input type="text" placeholder="imageUrl" class="input input-bordered w-full max-w-xs" />
                    </label>
                </div>
            <div class="flex justify-center gap-2 mt-4">
                <div class="btn btn-success">EDIT</div>
                <RouterLink :to="{ name:'products-list'}">
                    <div class="btn btn-error">Cancel</div>
                </RouterLink>
            </div>
            </div>
            


        </div>
    </UserLayout>


</template>
