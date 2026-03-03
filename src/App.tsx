import "./app.css";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Auth} from "./pages/Auth.tsx";
import {Chat} from "./pages/Chat.tsx";

const DEV_ENTRY = import.meta.env.VITE_DEV_ENTRY_PATH;

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background font-medium text-text-main">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            DEV_ENTRY ? <Navigate to={DEV_ENTRY} replace/> : <Auth/>
          }/>

          <Route path="/chat" element={<Chat/>}/>
          <Route path="/auth" element={<Auth/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
