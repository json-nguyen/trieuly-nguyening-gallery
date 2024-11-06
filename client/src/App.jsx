import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-500">Welcome to My Wedding App!</h1>
    </div>
  )
}

export default App
