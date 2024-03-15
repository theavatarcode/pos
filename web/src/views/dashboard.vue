<script setup>
import AdminLayout from '@/components/UserLayout.vue'


const priceChart = {
    options: {
        chart:
        {
            id: 'vuechart-example'
        },
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
    },
    series: [{
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
    }]
}

const soldProduct = {
    options: {

    },
    series: [44, 55, 41, 17, 15]
}


</script>


<template>
    <AdminLayout>
        <div class="my-4 w-full px-10">
            
            <div class="stats  w-full ">

                <div class="stat">

                    <div class="stat-title">สั้งซื้อทั้งหมด</div>
                    <div class="stat-value">3 ชิ้น</div>
                </div>
                <div class="stat">

                    <div class="stat-title">ต้นทุน</div>
                    <div class="stat-value">200 THB</div>
                </div>

                <div class="stat">

                    <div class="stat-title">ยอดขาย ทั้งหมด</div>
                    <div class="stat-value">600 THB</div>
                </div>


                <div class="stat">

                    <div class="stat-title">กำไรของสินค้าทั้งหมด</div>
                    <div class="stat-value">400 THB </div>
                </div>



            </div>
            <div class="text-4xl font-bold mt-10">
                ภาพรวม
            </div>

        </div>

        <div class="max-md:flex-col md:flex">
            <div class="flex-1 p-10">

                <apexchart type="line" :options="priceChart.options" :series="priceChart.series"></apexchart>
            </div>
            <div class="flex-1 p-10 shadow relative">
                <div class="absolute top-10 left-10">72 ชิ้น</div>
                <apexchart type="donut" labels="true" :options="soldProduct.options" :series="soldProduct.series">
                </apexchart>
            </div>
        </div>

    </AdminLayout>
    <div>



    </div>
</template>