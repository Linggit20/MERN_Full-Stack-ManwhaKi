import { Alert } from "@material-tailwind/react"
import { BsCheckCircleFill } from "react-icons/bs"
import useAuth from "../hooks/useAuth"
import { useEffect } from "react"

const SuccessMessage = () => {
  const { state, dispatch } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({type: "SET_MESSAGE",  payload: {
        ...state,
        message: ""
      }})
    }, 3000)

    return () => clearTimeout(timer)
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.message])

  return (
    <>
      { state.message && (
        <Alert color="green" icon={<BsCheckCircleFill />}
          className="rounded-none border-l-4 border-[#2ec946] bg-[#2ec946]/10 font-medium text-[#2ec946] flex items-center"
        >
            { state.message }
        </Alert>
      )}
    </>
  )
}

export default SuccessMessage