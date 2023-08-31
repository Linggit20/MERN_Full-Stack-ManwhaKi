import { createContext, useState } from "react"


const GlobalErrorContext = createContext({})

// eslint-disable-next-line react/prop-types
export const GlobalErrorProvider = ({children}) => {
  const [globalError, setGlobalError] = useState(null)

  return (
    <GlobalErrorContext.Provider value={{ globalError, setGlobalError }}>
      {children}
    </GlobalErrorContext.Provider>
  )
}

export default GlobalErrorContext