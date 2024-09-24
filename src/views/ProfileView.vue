<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import router from '@/router'
import TodoService from '@/services/TodoService'
import type { Todo } from '@/types'

const store = useUserStore()
const { user } = storeToRefs(store)

const todos = ref<Todo[]>([])
const favorites = ref<number[]>([])
const selectedStatus = ref<string>('all')
const selectedId = ref<string | number>('all')
const searchTerm = ref<string>('')
const newTodoTitle = ref<string>('')
const newTodoUserId = ref<number>()

const filteredTodos = computed(() => {
  return todos.value.filter((todo) => {
    const matchesStatus =
      selectedStatus.value === 'all' ||
      (selectedStatus.value === 'completed' && todo.completed) ||
      (selectedStatus.value === 'uncompleted' && !todo.completed) ||
      (selectedStatus.value === 'favorites' && favorites.value.includes(todo.id))

    const matchesUserId = selectedId.value === 'all' || selectedId.value === todo.userId

    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.value.toLowerCase())

    return matchesStatus && matchesUserId && matchesSearch
  })
})

const idList = computed(() => {
  return new Set(todos.value.map((todo) => todo.userId))
})

const isFavorite = (id: number) => {
  return favorites.value.includes(id)
}

const toggleFavorite = (id: number) => {
  if (isFavorite(id)) {
    favorites.value = favorites.value.filter((favId) => favId !== id)
  } else {
    favorites.value.push(id)
  }

  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}

const addTodo = () => {
  const newTodo: Todo = {
    userId: newTodoUserId.value || user.value.id,
    id: Date.now(),
    title: newTodoTitle.value,
    completed: false
  }

  TodoService.createTodo(newTodo).then(() => todos.value.unshift(newTodo))

  newTodoTitle.value = ''
  newTodoUserId.value = undefined
}

onMounted(async () => {
  !user.value.name && router.push('/')
  todos.value = await TodoService.fetchTodos()
  favorites.value = JSON.parse(localStorage.getItem('favorites') || '[]')
})
</script>

<template>
  <div class="container">
    <h1 class="title">{{ user?.name }}'s Profile</h1>
    <p class="info">Email: {{ user?.email }}</p>
    <p class="info">Phone: {{ user?.phone }}</p>

    <div class="filters">
      <label for="status">Filter by Status:</label>
      <select v-model="selectedStatus" class="filter-select">
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="uncompleted">Uncompleted</option>
        <option value="favorites">Favorites</option>
      </select>

      <label for="status">Filter by Id:</label>
      <select v-model="selectedId" class="filter-select">
        <option value="all">All users</option>
        <option v-for="id in idList" :key="id" :value="id">{{ id }}</option>
      </select>

      <label for="search">Search by Title:</label>
      <input type="search" v-model="searchTerm" class="search-input" placeholder="Search todos" />
    </div>

    <div class="add-todo">
      <form action="" @submit.prevent="addTodo">
        <fieldset>
          <legend>Add a new todo</legend>
          <input
            v-model="newTodoUserId"
            type="number"
            class="new-todo-input"
            placeholder="User id"
            required
          />
          <input v-model="newTodoTitle" class="new-todo-input" placeholder="Title" required />
          <button type="submit" class="add-todo-button">Add</button>
        </fieldset>
      </form>
    </div>

    <div class="todo-list-container">
      <ul class="todo-list">
        <li v-for="todo in filteredTodos" :key="todo.id" class="todo-item">
          <input type="checkbox" v-model="todo.completed" class="todo-checkbox" />
          <span :class="{ completed: todo.completed }" class="todo-title">{{ todo.title }}</span>
          <button @click="toggleFavorite(todo.id)" class="favorite-button">
            {{ isFavorite(todo.id) ? 'Remove from Favorites' : 'Add to Favorites' }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.info {
  font-size: 16px;
  color: #555;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 20px;
  margin-top: 1rem;
}

.filter-select,
.search-input,
.new-todo-input,
.add-todo-button {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.new-todo-input {
  margin: 0.5rem;
}

.add-todo-button {
  margin-left: 1rem;
}

.filter-select:focus,
.search-input:focus,
.new-todo-input:focus {
  border-color: #007bff;
  outline: none;
}

.todo-list-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-checkbox {
  margin-right: 10px;
}

.todo-title {
  flex: 1;
}

.completed {
  text-decoration: line-through;
  color: #aaa;
}

.favorite-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 0.5rem;
}

.favorite-button:hover {
  background-color: #0056b3;
}

.add-todo {
  margin-top: 20px;
}

.add-todo-button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.add-todo-button:hover {
  background-color: #218838;
}
</style>
