import { Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage.js";
import SignUpPage from "./pages/SignUpPage.js";
import { Header } from "./components/Header.js";
import TimelinePage from "./pages/TimelinePage.js";
import UserPage from "./pages/UserPage.js";
import { useState } from "react";


function App() {
  const [userProfileImage, setUserProfileImage] = useState()
  return (
    <>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/timeline" element={<Header setUserProfileImage={setUserProfileImage} userProfileImage={userProfileImage}><TimelinePage userProfileImage={userProfileImage} /></Header>} />
        <Route path="/user/:id" element={<Header setUserProfileImage={setUserProfileImage} userProfileImage={userProfileImage}><UserPage userProfileImage={userProfileImage} /></Header>} />
      </Routes>
    </>
  );
}

export default App;
