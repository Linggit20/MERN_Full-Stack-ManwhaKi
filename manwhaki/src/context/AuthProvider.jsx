import { createContext, useReducer } from "react"


const initialState = {
  accessToken: "",
  user: {
    email: "",
    username: ""
  },
  message: ""
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        ...action.payload
      }
    case "REGISTER":
      return {
        ...state,
        ...action.payload
      }
    case "LOGOUT":
      return {
        ...state,
        ...action.payload
      }
    case "SET_MESSAGE":
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

const AuthContext = createContext({})


// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <AuthContext.Provider value={{state, dispatch}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext 