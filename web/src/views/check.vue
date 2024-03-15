<script setup>
import UserLayout from '@/components/UserLayout.vue'
import { useProductStore } from '@/stores/productStore'
import { useOrderStore } from '@/stores/orderStore'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'


import { io } from 'socket.io-client';
const productStore = useProductStore()
const orderStore = useOrderStore()
const socket = io('https://169172b05c29a5.lhr.life', {
    // ...
    transports: ['polling', 'websocket'],
    upgrade: false,
    // ...
    rejectUnauthorized: false,
    // ...
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
    // ...
    timeout: 5000,
    // ...
    autoConnect: true,

    // ...
    forceNew: true,
    // ...
    debug: true,  // เพิ่มบรรทัดนี้เพื่อเปิด verbose mode
});

onMounted(() => {
    socket.connect();
    socket.emit('message', 'Hello Server');
})


const createSourcePromptPay = (amount) => {
    return new Promise((resolve, reject) => {
        Omise.createSource('promptpay', {
            amount: (amount * 100),
            currency: 'THB',
        }, (statusCode, response) => {
            if (statusCode !== 200) {
                return reject(response)
            }
            resolve(response)
        })
    })
}

Omise.setPublicKey(import.meta.env.VITE_OMISE_PKEY)

const select = (index) => {
    productStore.selectProduct(index)
}

const payCard = async() =>{
    const amount = productStore.getTotalPrice()
    socket.emit('CARD', amount)
    socket.on('card-success' ,(amount) =>{
        Swal.fire({
                    title: "ชำระเงินเสร็จสิ้น",
                    text: 'จำนวน ' + amount + ' THB',
                    icon: "success",
                    showConfirmButton: false,
                })
    })
}
const payQr = async () => {
    const amount = productStore.getTotalPrice()
    const omiseResponse = await createSourcePromptPay(amount)
    console.log(omiseResponse)
    const sourceId = omiseResponse.id

    socket.emit('QR', { sourceId, amount })
    setTimeout(() => {
                Swal.fire({
                    title: "ชำระเงินเสร็จสิ้น",
                    text: 'จำนวน ' + amount + ' THB',
                    icon: "success",
                    showConfirmButton: false,
                })
    }, 5000);

    let n = 0
    const intervalId = setInterval(async () => {
        console.log(sourceId)
        try {
            const response = await axios.post('/api/check', {
                source: sourceId,
            })

            if (response.data.status === 'successful') {
                Swal.fire({
                    title: "ชำระเงินเสร็จสิ้น",
                    text: 'จำนวน ' + amount + ' THB',
                    icon: "success",
                    showConfirmButton: false,
                    timer: 3000
                })
                orderStore.addOrder(productStore.selected)
                productStore.clearSelected()
                clearInterval(intervalId);


            }
            else if (response.data.status === 'not exists') { //ยกเลิกการชำระเงิน
                clearInterval(intervalId);
            }
            else if (response.data.status === 'failed') {
                Swal.fire({
                    title: "ชำระเงินไม่สำเร็จ",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000
                })
            }
            n += 1
            if (n > 10) {
                clearInterval(intervalId);
                Swal.fire({
                    title: "ชำระเงินไม่สำเร็จ",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000
                })
                const response = await axios.post('/api/cancel', {
                    source: sourceId,
                })

            }


        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "ชำระเงินไม่สำเร็จ",
                icon: "error",
                showConfirmButton: false,
                timer: 3000
            })

            clearInterval(intervalId);
            const response = await axios.post('/api/cancel', {
                source: sourceId,
            },)

        }
        n += 1

    }, 5 * 1000);


}
const payCash = () => {
    Swal.fire({
        title: "จำนวนเงินสดที่รับมา",
        input: "number",
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        showLoaderOnConfirm: true,
        preConfirm: (amount) => {
            return { amount }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            if (productStore.getTotalPrice() > result.amount) {
                Swal.fire({
                    title: `ตังไม่พอ`,
                    icon: "error",
                    timer: 3000
                });
            } else {
                Swal.fire({
                    title: `เงินทอนทั้งหมด ${parseInt(result.value.amount) - parseInt(productStore.getTotalPrice())} บาท`,
                    icon: "success",
                    timer: 3000
                });
            }

        }
    });
}
socket.on('qr-success', (data) => {
    Swal.fire({
        title: `สแกน QR สำเร็จ จำนวนเงิน : ${data}`,
        icon: "success",
        timer: 3000
    });
})

onMounted(() => {

})
</script>

<!-- ... -->
<template>


    <UserLayout>
        <div class="flex xl:p-10 gap-3 rounded-2xl">
            <div class="flex-1 bg-base-200 rounded-xl">
                <div class="flex flex-row m-5">
                    <div class="dropdown flex-1">
                        <div tabindex="0" role="button" class="btn btn-neutral text-xl">เลือกรายการสินค้า</div>
                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a>Item 1</a></li>
                            <li><a>Item 2</a></li>
                        </ul>
                    </div>
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
                    class="bg-base-200 md:px-5 pb-5 f grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

                    <div v-for="(item, index) in productStore.list" class="card card-compact w-48 bg-base-100 shadow-xl"
                        @click="productStore.selectProduct(index)">
                        <figure><img :src="item.imageUrl" alt="Shoes" class="h-48" /></figure>
                        <div class="card-body">
                            <h2 class="card-title text-center">{{ item.name }}</h2>
                            <p class="text-lg">ราคา {{ item.price }} บาท </p>
                        </div>
                    </div>

                </div>

            </div>

            <div class="flex-2 w-1/3 h-auto bg-base-200 rounded-xl">
                <div class="font-bold text-2xl text-center mt-5">
                    รายการที่สั่งซื้อ
                </div>
                <div class="overflow-x-auto ">
                    <table class="table">
                        <!-- head -->
                        <thead>
                            <tr>
                                <th>ชื่อ</th>
                                <th>ราคา</th>
                                <th>จำนวน</th>
                                <th></th>

                            </tr>
                        </thead>
                        <tbody>
                            <!-- row 1 -->
                            <tr v-for="(item, index ) in productStore.selected" class="bg-base-200">
                                <td>{{ item.name }}</td>
                                <td>{{ item.price }}</td>
                                <td>{{ item.total }}</td>
                                <td>
                                    <div class="btn btn-error" @click="productStore.removeFromCart(index)">ลบ</div>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                    <div class="p-4 font-bold text-xl">
                        <div v-if="productStore.getTotalPrice() !== 0">ราคารวมทั้งสิ้น {{ productStore.getTotalPrice()
                            }} บาท</div>
                        <div class="m-2 flex flex-row gap-4" v-if="productStore.getTotalPrice() !== 0">
                            <div class="btn btn-success" @click="payQr()">ชำระเงินด้วย QR</div>
                            <div class="btn btn-success" @click="payCard()">ชำระเงินด้วยบัตรเครดิต</div>
                        </div>
                        <div v-if="productStore.getTotalPrice() !== 0" class="btn btn-success m-2" @click="payCash()">
                            ชำระเงินด้วยเงินสด</div>

                    </div>
                </div>

            </div>


        </div>


    </UserLayout>

    <!-- ... -->
</template>