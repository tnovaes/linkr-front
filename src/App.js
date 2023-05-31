import { Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage.js";
import SignUpPage from "./pages/SignUpPage.js";
import { Header } from "./components/Header.js";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* demo de como usar o header, só por em volta do componente da página, podem apagar depois */}
        <Route path="/demoheader" element={<Header><SignUpPage /></Header>} />
      </Routes>
    </>
  );
}

export default App;
