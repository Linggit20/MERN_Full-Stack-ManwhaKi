import  { useEffect, useState } from "react"
import { Alert } from "@material-tailwind/react"
import { PiWarningFill } from "react-icons/pi"

// eslint-disable-next-line react/prop-types
const ErrorMessage = ({ message }) => {
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(message)
    const timer = setTimeout(() => {
      setError(null)
    }, 5000)

    return () => clearTimeout(timer)
  }, [message])

  return (
    error && (
      <Alert
        color="red"
        icon={<PiWarningFill />}
        className="rounded-none border-l-4 border-red-500 bg-red-300/10 font-medium text-red-300 flex items-center"
      >
        {error}
      </Alert>
    )
  )
}

export default ErrorMessage
