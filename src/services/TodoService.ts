import type { Todo } from '@/types'

export default {
  async fetchTodos() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos')
    const data = await response.json()
    return data
  },

  async createTodo(todo: Todo) {
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error))
  }
}
