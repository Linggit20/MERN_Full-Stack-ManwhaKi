import { useState } from "react"

const useHandleErrors = () => {
  const [errors, setErrors] = useState({
    error: null,
    loginError: null,
    currentPasswordError: null,
    newPasswordError: null,
    confirmPasswordError: null,
    emailError: null,
    usernameError: null,
    passwordError: null,
  })

  const clearErrors = () => {
    setErrors({
      error: null,
      loginError: null,
      currentPasswordError: null,
      newPasswordError: null,
      confirmPasswordError: null,
      emailError: null,
      usernameError: null,
      passwordError: null,
    })
  }

  const setError = {
    error: (message) => 
      setErrors((prevErrors) => ({
        ...prevErrors,
        error: message,
      })),
    loginError: (message) => 
      setErrors((prevErrors) => ({
        ...prevErrors,
        loginError: message,
    })),
    currentPasswordError: (message) =>
      setErrors((prevErrors) => ({
        ...prevErrors,
        currentPasswordError: message,
      })),
    newPasswordError: (message) =>
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPasswordError: message,
      })),
    confirmPasswordError: (message) =>
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPasswordError: message,
      })),
    emailError: (message) =>
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailError: message,
      })),
    usernameError: (message) =>
      setErrors((prevErrors) => ({
        ...prevErrors,
        usernameError: message,
      })),
    passwordError: (message) =>
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordError: message,
      })),
  }

  return { errors, setError, clearErrors }
}

export default useHandleErrors