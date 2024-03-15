import { defineStore } from 'pinia';

export const useProductStore = defineStore('product', () => ({
  list: [{
    name : 'อาหาร'
    },
    {
    name : 'เครื่องดื่ม'
    }
],
  selected: [],
}), {
  actions: {
    // ฟังก์ชัน actions ที่เรียกใช้ mutations
    selectedProduct(index) {
      // เรียกใช้ mutations.updateSelected เพื่ออัพเดท state
      this.updateSelected(index);
    },
    removefromCart(index) {
      // เรียกใช้ mutations.updateSelected เพื่ออัพเดท state
      this.updateSelected(this.selected.filter(item => item !== index));
    }
  },
  mutations: {
    // ฟังก์ชัน mutations ที่ใช้ในการอัพเดท state
    updateSelected(newSelected) {
      // อัพเดท state ที่เกี่ยวข้อง
      this.selected = newSelected;
    },
  },
});