import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const errorMessage = ref('')
  const loading = ref(false)
  const loadingUser = ref(false)

  // Validation helper //
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }
  // Auth Handlers //
  const handleLogin = async (credentials) => {
    const { email, password } = credentials
    // Credential Validations //
    if (!validateEmail(email)) {
      return (errorMessage.value = 'Email is not valid')
    } else if (password.length === 0) {
      return (errorMessage.value = 'Password cannot be empty')
    }
    // Login User //
    loading.value = true // Loading is true as soon as we are connecting with supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    // -> Validating credentials
    if (error) {
      loading.value = false // Response = not loading
      return (errorMessage.value = error.message)
    }
    const { data: profile } = await supabase
      .from('users')
      .select()
      .eq('email', data.user.email)
      .single()
    user.value = profile
    loading.value = false // Response = not loading
  }
  const handleSignup = async (credentials) => {
    const { email, password, username } = credentials
    // Credential Validations //
    if (password.length < 6) {
      return (errorMessage.value = 'Password length is too short')
    } else if (username.length < 4) {
      return (errorMessage.value = 'Username length is too short')
    } else if (!validateEmail(email)) {
      return (errorMessage.value = 'Email is not valid')
    }
    // Validate existing user //
    loading.value = true // Loading is true as soon as we are connecting with supabase
    const { data: userFoundInDb } = await supabase
      .from('users')
      .select()
      .eq('username', username)
    if (userFoundInDb.length > 0) {
      loading.value = false // Response = not loading
      return (errorMessage.value = 'Username not available')
    }
    // Cleaning Error Message //
    errorMessage.value = ''
    // create user //
    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) {
      loading.value = false // Response = not loading
      return (errorMessage.value = error.message)
    }
    await supabase.from('users').insert({
      username,
      email
    })
    loading.value = false // Response = not loading
    const { data: newUser } = await supabase.from('users').select().eq('email', email).single()
    user.value = newUser
  }
  // Logging out using Supabase //
  const handleLogout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }
  // Getting User from Supabase using LocalStorage data //
  const getUser = async () => {
    loadingUser.value = true // Loading is true as soon as we are connecting with supabase
    // Get the user from jwt stored in LocalStorage //
    const {data} = await supabase.auth.getUser()
    if (!data.user) {
      user.value = null
      return loadingUser.value = false // Response = not loading
    }

    // Find user data and store it //
    const response = await supabase
      .from('users')
      .select()
      .eq('email', data.user.email)
      .single()
    user.value = response.data
    loadingUser.value = false // Response = not loading
  }
  // Helper Functions //
  const clearErrorMessage = () => {
    errorMessage.value = ''
  }

  return {
    user,
    loading,
    loadingUser,
    errorMessage,
    clearErrorMessage,
    handleLogin,
    handleSignup,
    handleLogout,
    getUser
  }
})
