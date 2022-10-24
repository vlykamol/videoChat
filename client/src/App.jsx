import { Routes, Route } from "react-router-dom";
import Dashbord from "./components/Dashbord";
import Room from "./components/Room";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashbord />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  )
}

export default App
