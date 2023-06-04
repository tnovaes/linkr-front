import { Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage.js";
import SignUpPage from "./pages/SignUpPage.js";
import { Header } from "./components/Header.js";
import TimelinePage from "./pages/TimelinePage.js";
import UserPage from "./pages/UserPage.js";
import HashtagPage from "./pages/HashtagPage.js";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/timeline" element={<Header><TimelinePage /></Header>} />
        <Route path="/user/:id" element={<Header><UserPage /></Header>} />
        <Route path="/hashtag/:hashtag" element={<Header><HashtagPage /></Header>} />
      </Routes>
    </>
  );
}

export default App;
