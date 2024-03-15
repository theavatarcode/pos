import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => ({ 
    list:[
      
    ], 
}),
  actions: {
    addOrder(l){
        this.list.concat(l)
    }
  },
})

