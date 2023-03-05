import React from "react"

import Axios from "axios"
import { useQuery } from "react-query"

export let GasMode

;(function(GasMode) {
  GasMode["STANDARD"] = "standard"
  GasMode["FAST"] = "fast"
  GasMode["INSTANCE"] = "instant"
})(GasMode || (GasMode = {}))

export const GasPriceContext = React.createContext({
  data: undefined,
  isLoading: true
})

export const GasPriceProvider = ({ children }) => {
  const { data, isLoading } = useQuery(["gas-prices"], async () => {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_ZAPPER_API}/v1/gas-price`,
      {
        headers: {
          "x-zapper-api-key": process.env.REACT_APP_ZAPPER_API_KEY
        }
      }
    )
    return data
  })

  return (
    <GasPriceContext.Provider value={{ data, isLoading }}>
      {children}
    </GasPriceContext.Provider>
  )
}
