import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home.jsx";
import Chat from "./components/Chat.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
