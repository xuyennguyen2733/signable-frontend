import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "../styles/App.css";
import { AuthProvider, useAuth } from "../../context/auth.jsx";

import LandingPage from "../../components/LandingPage/LandingPage.jsx";
import LoginPage from "../../components/LoginPage/LoginPage.jsx";
import SignupPage from "../../components/SignupPage/SignupPage.jsx";
import HomePage from "../../components/HomePage/HomePage.jsx";
import FriendsList from "../../components/Friends/Friends.jsx";
import LessonPage from "../../components/Lessons/LessonPage.jsx";
import ProfilePage from "../../components/ProfilePage/ProfilePage.jsx";
import AboutPage from "../../components/AboutPage/AboutPage.jsx";
import TutorialPage from "../../components/TutorialPage/TutorialPage.jsx";
import TeamPage from "../../components/TeamPage/TeamPage.jsx";
import Settings from "../../components/Settings/Settings.jsx";
import UserUpdate from "../../components/UserUpdate/UserUpdate.jsx";
import PasswordRecoveryPage from "../../components/PasswordRecovery/PasswordRecoveryPage.jsx";
import AdminPage from "../../components/AdminPage/AdminPage.jsx";

const queryClient = new QueryClient();

function NotFound() {
  return <h1>404: Not Found</h1>;
}

function AuthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/learn" element={<HomePage />} />
      <Route path="/userprofile" element={<ProfilePage />} />
      <Route path="/updateprofile" element={<UserUpdate />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/friends" element={<FriendsList />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/signup" element={<Navigate to="/learn" />} />
      <Route path="/login" element={<Navigate to="/learn" />} />
      <Route
        path="/lesson/unit/:unitId?/lesson/:lessonIndex?/:lessonId?"
        element={<LessonPage />}
      />

      <Route path="/error/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
}

function UnauthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage/>} />
      <Route path="/team" element={<TeamPage/>} />
      <Route path="/tutorial" element={<TutorialPage/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/recover-password" element={<PasswordRecoveryPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function Main() {
  const { isLoggedIn } = useAuth();

  // alert("We've paused our site's database temporarily since we were exceeding our monthly quota." 
  // + " Unfortunately, you will not be able to log in until 5/4/2024 when it resumes. Thanks for your understanding");

  return (
    <main>
      {isLoggedIn ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
    </main>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
