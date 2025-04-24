import { Route, Routes } from "react-router-dom"
import IndexVentanaChat from "./components/IndexVentanaChat"

function App() {
 
  return (
    <>
      <div className="min-h-screen bg-zinc-900 text-white">
        <Routes>
          <Route path="/" element={<IndexVentanaChat/>} />
          <Route path="/about" element={<h1 className="text-3xl font-bold underline">About</h1>} />
          <Route path="/contact" element={<h1 className="text-3xl font-bold underline">Contact</h1>} />
        </Routes>
      </div>
    </>
  )
}

export default App
