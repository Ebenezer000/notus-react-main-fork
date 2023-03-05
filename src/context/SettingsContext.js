import React, { useState } from "react"

export let Currency

;(function(Currency) {
  Currency["USD"] = "USD"
  Currency["EUR"] = "EUR"
  Currency["GBP"] = "GBP"
  Currency["CAD"] = "CAD"
  Currency["CNY"] = "CNY"
  Currency["KRW"] = "KRW"
  Currency["JPY"] = "JPY"
  Currency["RUB"] = "RUB"
  Currency["AUD"] = "AUD"
  Currency["NZD"] = "NZD"
  Currency["CHF"] = "CHF"
  Currency["SGD"] = "SGD"
  Currency["INR"] = "INR"
  Currency["ETH"] = "ETH"
  Currency["BTC"] = "BTC"
  Currency["LINK"] = "LINK"
})(Currency || (Currency = {}))

export let GasMode

;(function(GasMode) {
  GasMode["STANDARD"] = "standard"
  GasMode["FAST"] = "fast"
  GasMode["INSTANCE"] = "instant"
})(GasMode || (GasMode = {}))

export let SettingsActionType

;(function(SettingsActionType) {
  SettingsActionType["SET_CURRENCY"] = "SET_CURRENCY"
  SettingsActionType["SET_GAS_MODE"] = "SET_GAS_MODE"
  SettingsActionType["SET_SLIPPAGE"] = "SET_SLIPPAGE"
})(SettingsActionType || (SettingsActionType = {}))

export const SLIPPAGE_OPTIONS = [2, 3]

export const SettingsStateContext = React.createContext({})

export const SettingsProvider = ({ children }) => {
  const [currency, setCurrency] = useState(Currency.USD)
  const [gasMode, setGasMode] = useState(GasMode.FAST)
  const [slippage, setSlippage] = useState(3)

  const value = {
    currency,
    gasMode,
    slippage,
    setCurrency,
    setGasMode,
    setSlippage
  }
  return (
    <SettingsStateContext.Provider value={value}>
      {children}
    </SettingsStateContext.Provider>
  )
}
