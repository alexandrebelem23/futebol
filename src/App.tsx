// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import Cronometro from './components/Cronometro'
import './App.css'
import Gol from './components/Gol'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
     
      <h1>Pelada Werder Brhama</h1>
      <h3>
        Cronometro e Gols - Versao 1.0
      </h3>
      <Cronometro />
      <Gol />
      
    </>
  )
}

export default App
