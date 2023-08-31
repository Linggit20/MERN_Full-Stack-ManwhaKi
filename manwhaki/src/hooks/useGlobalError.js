import { useContext } from "react"
import GlobalErrorContext from "../context/GlablErrorProvider"

const useGlobalError = () => {
  return useContext(GlobalErrorContext)
}

export default useGlobalError