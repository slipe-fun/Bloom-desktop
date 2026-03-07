import "./app.css";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {AuthLayout} from "./layouts/AuthLayout.tsx";
import {MainLayout} from "./layouts/MainLayout.tsx";

const DEV_ENTRY = import.meta.env.VITE_DEV_ENTRY_PATH;

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background font-medium text-text-main">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            DEV_ENTRY ? <Navigate to={DEV_ENTRY} replace/> : <AuthLayout/>
          }/>

          <Route path="/main" element={<MainLayout/>}/>
          <Route path="/auth" element={<AuthLayout/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
