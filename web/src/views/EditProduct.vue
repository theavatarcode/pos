<script setup>
import UserLayout from '@/components/UserLayout.vue'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'


const productStore = useProductStore()
const router = useRouter()
const route = useRoute()
const formData = reactive({
    name : '',
    cost : 0,
    price : 0,
    imageUrl : 'https://i.pinimg.com/474x/57/e8/e9/57e8e9c0b93027308406463c35041aab.jpg',

})
const mode = ref('CREATE')

const update = () =>{
    const index = route.params.id
    if (mode.value === 'EDIT'){
        productStore.updateProduct(index, formData)

    }else{
        productStore.addProduct(formData)
    }
    router.push({path : '/product'})
}

onMounted(() =>{
    if(route.params.id){
        const index = route.params.id
        mode.value = 'EDIT'
        formData.name = productStore.list[index].name
        formData.cost = productStore.list[index].cost
        formData.price = productStore.list[index].price
        formData.imageUrl = productStore.list[index].imageUrl

    }
})
</script>

<template>
    <UserLayout>
        <div class=" h-full justify-items-center m-20 p-20 bg-base-200 gap-1 rounded-xl grid grid-cols-2">
            <div class="rounded-xl">
                <div class="carousel-item h-full rounded-xl">
                    <img :src="formData.imageUrl" class="rounded-xl"/>
                </div>
                <input type="file" class="mt-2 ">


            </div>
            <div>

                <div>
                    <label class="form-control w-full max-w-xs">
                        <div class="label">
                            <span  class="label-text">ชื่อสินค้า</span>
                        </div>
                        <input v-model="formData.name" type="text" placeholder="ชื่อสินค้า" class="input input-bordered w-full max-w-xs" />
                    </label>
                </div>
                <div>
                    <label class="form-control w-full max-w-xs">
                        <div class="label">
                            <span  class="label-text">ราคาขาย</span>
                        </div>
                        <input v-model="formData.price" type="text" placeholder="ราคาขาย" class="input input-bordered w-full max-w-xs" />
                    </label>
                </div>
                <div>
                    <label class="form-control w-full max-w-xs">
                        <div class="label">
                            <span class="label-text" >ต้นทุน</span>
                        </div>
                        <input v-model="formData.cost" type="text" placeholder="ต้นทุน" class="input input-bordered w-full max-w-xs" />
                    </label>
                </div>
                <div>
                    <label class="form-control w-full max-w-xs">
                        <div class="label">
                            <span  class="label-text">imageUrl</span>
                        </div>
                        <input v-model="formData.imageUrl" type="text" placeholder="imageUrl" class="input input-bordered w-full max-w-xs" />
                    </label>
                </div>
            <div class="flex justify-center gap-2 mt-4">
                <div class="btn btn-success" @click="update()">EDIT</div>
                <RouterLink :to="{ name:'products-list'}">
                    <div class="btn btn-error">Cancel</div>
                </RouterLink>
            </div>
            </div>
            


        </div>
    </UserLayout>


</template>
