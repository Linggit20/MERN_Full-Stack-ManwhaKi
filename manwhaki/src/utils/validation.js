
export const validateInputs = (validationObjects) => {
  let isValid = true

  for (const { value, validator, errorSetter, errorMessage } of validationObjects) {
    if (!validator(value)) {
      errorSetter(errorMessage)
      isValid = false
    }
  }

  return isValid
}
