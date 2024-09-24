<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginService from '../services/LoginService'
import { useUserStore } from '@/stores/user'

const store = useUserStore()
const { addUser } = store

const username = ref<string>('')
const phone = ref<string>('')
const usernameError = ref<string>('')
const loginError = ref<string>('')
const router = useRouter()

const validateUsername = () => {
  const regex = /^[A-Za-z]+$/
  if (!regex.test(username.value)) {
    usernameError.value = 'Username must contain only letters.'
  } else {
    usernameError.value = ''
  }
}

const loginUser = async () => {
  const response = await LoginService.userLogin({ name: username.value, phone: phone.value })
  if (response.error) {
    loginError.value = "Login error: Username and phone number don't match."
  } else {
    addUser(response)
    router.push('/profile')
  }
}
</script>

<template>
  <div class="login-form">
    <h2 class="form-title">Login</h2>
    <form @submit.prevent="loginUser">
      <div class="form-group">
        <label>Username</label>
        <input type="text" v-model="username" @input="validateUsername" required />
        <p v-if="usernameError" class="error">{{ usernameError }}</p>
      </div>

      <div class="form-group">
        <label>Phone Number</label>
        <input type="text" v-model="phone" required />
      </div>

      <button type="submit" class="submit-btn" :disabled="usernameError ? true : false">
        Login
      </button>
      <p v-if="loginError" class="error">{{ loginError }}</p>
    </form>
  </div>
</template>

<style scoped>
.login-form {
  background-color: #ccc;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.form-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

input[type='text'] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

input[type='text']:focus {
  border-color: #aaa;
  outline: none;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:hover {
  background-color: #45a049;
}
.submit-btn:disabled {
  opacity: 0.5;
  pointer-events: none;
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
