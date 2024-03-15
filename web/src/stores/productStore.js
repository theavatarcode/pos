import { defineStore } from 'pinia';

export const useProductStore = defineStore('product', {
  state: () => ({ 
    list:[
      {
      name : 'ไอติม',
      cost: 20,
      price: 30,
      imageUrl:'https://i.pinimg.com/474x/6f/c7/7b/6fc77b8b44550703b5fc77458c6ce5d3.jpg',
      type: 'อาหาร'
    },
    {
      name : 'กระเพราหมูกอบ',
      cost: 20,
      price: 30,
      imageUrl:'https://i.pinimg.com/564x/f0/0f/03/f00f030f091055f97a44dcdbf539d5d8.jpg',
      type: 'อาหาร'
    },
    {
      name : 'ดนัยพัชร',
      cost: 10,
      price: 1500,
      imageUrl:'https://cdn.discordapp.com/attachments/1113161066726293536/1216256496694984705/image.png?ex=65ffba21&is=65ed4521&hm=39910b1724258c191db99dbcfa74271abe58f8aa65a0f0b0261936af69493751&',
      type: 'อาหาร'
    },
    {
      name : 'ชาเขียว',
      cost: 20,
      price: 30,
      imageUrl:'https://i.pinimg.com/564x/fb/f8/72/fbf872ea05c2607461dab9fe40a6736a.jpg',
      type: 'เครื่องดื่ม'
    },
    {
      name : 'น้ำเก๊กฮวย',
      cost: 20,
      price: 50,
      imageUrl:'https://i.pinimg.com/474x/97/f0/33/97f033f57c95fdc2e970adb4c8df8002.jpg',
      type: 'เครื่องดื่ม'
    },{
      name : 'เบียร์',
      cost:10,
      price:20,
      imageUrl:'https://i.pinimg.com/474x/18/21/32/182132a97183b28e49315ce2e839a872.jpg',
      type: 'เครื่องดื่ม'
    }
    ], 
    selected:[]
}),
  actions: {
    selectProduct(index) {
      if(this.selected.includes(this.list[index])){
        const i = this.selected.findIndex(item => item === this.list[index])
        this.selected[i].total += 1
        return
      }
      this.selected.push(this.list[index])
      const i = this.selected.findIndex(item => item === this.list[index])
      this.selected[i].total = 1
    },
    removeFromCart(index){
      this.selected.splice(index, 1)
    },
    removeProduct(index){
      this.list.splice(index, 1)
    },
    getTotalPrice(){
      return this.selected.reduce((accumulator, currentItem) => accumulator + currentItem.price * currentItem.total, 0);
    },
    updateProduct(index, formData){
      this.list[index] = formData
    },
    addProduct(formData){
      this.list.push(formData)
    },
    clearSelected(){
      this.selected = []
    }
  },
})

