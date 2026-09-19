import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Opportunities from "./pages/Opportunities";
import Applications from "./pages/Applications";
import CareerPath from "./pages/CareerPath";
import Skills from "./pages/Skills";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Personalization from "./pages/Personalization";

import {
  getAuthState,
  getCareerProfile,
  logoutCareerPilot,
  saveCareerProfile,
} from "./api/auth";

const App = () => {
  const [auth, setAuth] = useState(() =>
    getAuthState()
  );

  const [profile, setProfile] = useState(() =>
    getCareerProfile()
  );

  const refreshAppState = useCallback(() => {
    setAuth(getAuthState());
    setProfile(getCareerProfile());
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      setAuth(getAuthState());
    };

    const handleProfileChange = () => {
      setProfile(getCareerProfile());
    };

    const handleStorageChange = () => {
      refreshAppState();
    };

    window.addEventListener(
      "careerpilot:auth-changed",
      handleAuthChange
    );

    window.addEventListener(
      "careerpilot:profile-updated",
      handleProfileChange
    );

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "careerpilot:auth-changed",
        handleAuthChange
      );

      window.removeEventListener(
        "careerpilot:profile-updated",
        handleProfileChange
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, [refreshAppState]);

  const handleLogout = useCallback(() => {
    logoutCareerPilot();

    setAuth({
      isAuthenticated: false,
      user: null,
    });

    setProfile(null);
  }, []);

  const handleProfileUpdate = useCallback(
    (profileData) => {
      if (!profileData) {
        return;
      }

      saveCareerProfile(profileData);
      setProfile(profileData);
    },
    []
  );

  const isAuthenticated = Boolean(
    auth?.isAuthenticated
  );

  const hasProfile = Boolean(profile);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface-page text-text-primary">
        {/* FIXED SIDEBAR */}
        <Sidebar
          user={auth?.user}
          isAuthenticated={isAuthenticated}
          hasProfile={hasProfile}
          onLogout={handleLogout}
        />

        {/* NAVBAR STARTS AFTER SIDEBAR */}
        <Navbar
          user={auth?.user}
          isAuthenticated={isAuthenticated}
          hasProfile={hasProfile}
          onLogout={handleLogout}
        />

        {/* PAGE CONTENT */}
        <main
          className="
            min-h-screen
            pt-20
            lg:ml-64
          "
        >
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  user={auth?.user}
                  profile={profile}
                  isAuthenticated={isAuthenticated}
                  hasProfile={hasProfile}
                />
              }
            />

            <Route
              path="/personalize"
              element={
                isAuthenticated ? (
                  <Personalization
                    user={auth?.user}
                    profile={profile}
                    onProfileUpdate={handleProfileUpdate}
                  />
                ) : (
                  <Navigate
                    to="/"
                    replace
                  />
                )
              }
            />

            <Route
              path="/opportunities"
              element={
                <Opportunities
                  user={auth?.user}
                  profile={profile}
                  isAuthenticated={isAuthenticated}
                  hasProfile={hasProfile}
                />
              }
            />

            <Route
              path="/applications"
              element={
                <Applications
                  user={auth?.user}
                  profile={profile}
                  isAuthenticated={isAuthenticated}
                  hasProfile={hasProfile}
                />
              }
            />

            <Route
              path="/career-path"
              element={
                <CareerPath
                  user={auth?.user}
                  profile={profile}
                  isAuthenticated={isAuthenticated}
                  hasProfile={hasProfile}
                />
              }
            />

            <Route
              path="/skills"
              element={
                <Skills
                  user={auth?.user}
                  profile={profile}
                  isAuthenticated={isAuthenticated}
                  hasProfile={hasProfile}
                />
              }
            />

            <Route
              path="/profile"
              element={
                <Profile
                  user={auth?.user}
                  profile={profile}
                  isAuthenticated={isAuthenticated}
                  hasProfile={hasProfile}
                />
              }
            />

            <Route
              path="/settings"
              element={
                <Settings
                  user={auth?.user}
                  profile={profile}
                  isAuthenticated={isAuthenticated}
                  hasProfile={hasProfile}
                  onLogout={handleLogout}
                />
              }
            />

            <Route
              path="/help"
              element={
                <Help
                  user={auth?.user}
                  profile={profile}
                  isAuthenticated={isAuthenticated}
                  hasProfile={hasProfile}
                />
              }
            />

            <Route
              path="*"
              element={<PageNotFound />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

const PageNotFound = () => {
  return (
    <div
      className="
        min-h-[calc(100vh-80px)]
        bg-surface-page
        p-4
        sm:p-6
        lg:p-8
      "
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="
            border
            border-border
            bg-white
            p-8
            shadow-cp-sm
            sm:p-10
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.14em]
              text-primary-600
            "
          >
            CareerPilot
          </p>

          <h1
            className="
              mt-2
              text-2xl
              font-bold
              tracking-tight
              text-text-primary
              sm:text-3xl
            "
          >
            Page Not Found
          </h1>

          <p
            className="
              mt-2
              max-w-xl
              text-sm
              leading-6
              text-text-secondary
            "
          >
            The page you're looking for doesn't exist.
            Use the navigation to continue exploring
            CareerPilot.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;