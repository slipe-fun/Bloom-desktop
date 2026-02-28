import "./App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Auth} from "./pages/Auth.tsx";

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background font-medium text-text-main">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
