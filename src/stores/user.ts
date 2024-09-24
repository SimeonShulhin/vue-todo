import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const user = ref<User>({
    id: 0,
    name: '',
    email: '',
    phone: ''
  })
  function addUser(newUser: User) {
    user.value = newUser
  }

  return { user, addUser }
})
