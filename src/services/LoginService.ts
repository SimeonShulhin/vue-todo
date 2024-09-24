import type { User } from '../types'

export default {
  async userLogin({ name, phone }: Pick<User, 'name' | 'phone'>) {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      const data = await response.json()

      const user = data.find(
        (user: any) => user.username.toLowerCase() === name.toLowerCase() && user.phone === phone
      )

      if (user) {
        return user
      } else {
        return { error: "Login error: Username and phone number don't match." }
      }
    } catch (error) {
      console.error(error)
    }
  }
}
