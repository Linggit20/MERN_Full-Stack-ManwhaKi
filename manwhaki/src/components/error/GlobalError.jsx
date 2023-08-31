import { Alert } from "@material-tailwind/react"
import { PiWarningFill } from "react-icons/pi"
import useGlobalError from "../../hooks/useGlobalError"

const GlobalErrror = () => {
  const { globalError } = useGlobalError()

  return (
    <>
      { globalError && (
        <Alert
          color="red"
          icon={<PiWarningFill />}
          className="rounded-none border-l-4 border-red-500 bg-red-300/10 font-medium text-red-300 flex items-center"
        >
          { globalError }
        </Alert>
      ) }
    </>
  )
}

export default GlobalErrror