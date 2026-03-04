import { useState } from 'react'
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import "./styles/global.css";
import Home from './pages/Home';
import Chat from './pages/Chat';

function App() {
  const [count, setCount] = useState(0)

  return (
    <ChakraProvider value={defaultSystem}>
      <Home/>
      <Chat/>
    </ChakraProvider>
  )
}

export default App
