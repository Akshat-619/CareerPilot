import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bell,
  LogOut,
  Search,
  Settings,
  UserRound,
  X,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import LoginModal from "./modals/LoginModal";
import SignupModal from "./modals/SignupModal";

import {
  getAuthState,
  logoutCareerPilot,
} from "../api/auth";

import Logo from "../assets/Logo.png";

const Navbar = ({
  user: userProp,
  isAuthenticated: isAuthenticatedProp,
  hasProfile: hasProfileProp,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  const [localAuth, setLocalAuth] = useState(() =>
    getAuthState()
  );

  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState("login");

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleAuthChange = () => {
      setLocalAuth(getAuthState());
    };

    const handleStorageChange = () => {
      setLocalAuth(getAuthState());
    };

    window.addEventListener(
      "careerpilot:auth-changed",
      handleAuthChange
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
        "storage",
        handleStorageChange
      );
    };
  }, []);

  const isAuthenticated =
    typeof isAuthenticatedProp === "boolean"
      ? isAuthenticatedProp
      : localAuth.isAuthenticated;

  const user =
    userProp ||
    localAuth.user ||
    null;

  const getUserName = () => {
    if (!user) {
      return "Guest";
    }

    return (
      user.name ||
      user.fullName ||
      user.username ||
      user.email?.split("@")[0] ||
      "CareerPilot User"
    );
  };

  const getUserRole = () => {
    if (!user) {
      return "";
    }

    return (
      user.targetRole ||
      user.role ||
      user.careerProfile?.likelyRoles?.[0] ||
      ""
    );
  };

  const getInitials = () => {
    const name = getUserName().trim();

    if (!name) {
      return "CP";
    }

    const parts = name.split(/\s+/);

    if (parts.length === 1) {
      return parts[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  };

  const openLogin = () => {
    setAuthType("login");
    setAuthOpen(true);
    setUserMenuOpen(false);
  };

  const openSignup = () => {
    setAuthType("signup");
    setAuthOpen(true);
    setUserMenuOpen(false);
  };

  const closeAuth = () => {
    setAuthOpen(false);
  };

  const switchToLogin = () => {
    setAuthType("login");
  };

  const switchToSignup = () => {
    setAuthType("signup");
  };

  useEffect(() => {
    const handleOpenLogin = () => {
      openLogin();
    };

    const handleOpenSignup = () => {
      openSignup();
    };

    window.addEventListener(
      "careerpilot:open-login",
      handleOpenLogin
    );

    window.addEventListener(
      "careerpilot:open-signup",
      handleOpenSignup
    );

    return () => {
      window.removeEventListener(
        "careerpilot:open-login",
        handleOpenLogin
      );

      window.removeEventListener(
        "careerpilot:open-signup",
        handleOpenSignup
      );
    };
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logoutCareerPilot();
    }

    setUserMenuOpen(false);
    setNotificationOpen(false);
    setSearchOpen(false);

    navigate("/");
  };

  const goToProfile = () => {
    setUserMenuOpen(false);
    navigate("/profile");
  };

  const goToSettings = () => {
    setUserMenuOpen(false);
    navigate("/settings");
  };

  const searchItems = [
    {
      label: "Dashboard",
      path: "/",
      keywords: "dashboard home overview",
    },
    {
      label: "Opportunities",
      path: "/opportunities",
      keywords: "jobs opportunities roles",
    },
    {
      label: "Applications",
      path: "/applications",
      keywords: "applications applied jobs",
    },
    {
      label: "Career Path",
      path: "/career-path",
      keywords: "career path direction",
    },
    {
      label: "Skills",
      path: "/skills",
      keywords: "skills technology abilities",
    },
    {
      label: "Profile",
      path: "/profile",
      keywords: "profile resume personal",
    },
    {
      label: "Settings",
      path: "/settings",
      keywords: "settings preferences account",
    },
    {
      label: "Help",
      path: "/help",
      keywords: "help support faq",
    },
  ];

  const filteredSearchItems = searchItems.filter(
    (item) => {
      const query = searchQuery
        .trim()
        .toLowerCase();

      if (!query) {
        return true;
      }

      return (
        item.label
          .toLowerCase()
          .includes(query) ||
        item.keywords
          .toLowerCase()
          .includes(query)
      );
    }
  );

  const handleSearchNavigation = (path) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    setUserMenuOpen(false);
    setNotificationOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const notifications = [];

  return (
    <>
      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          h-20
          border-b
          border-border
          bg-white
          lg:left-64
        "
      >
        <div
          className="
            flex
            h-full
            items-center
            justify-between
            gap-4
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* MOBILE BRAND */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              flex
              items-center
              lg:hidden
            "
            aria-label="Go to CareerPilot dashboard"
          >
            <img
              src={Logo}
              alt="CareerPilot"
              className="h-9 w-auto max-w-[160px] object-contain"
            />
          </button>

          {/* RIGHT ACTIONS */}
          <div
            className="
              ml-auto
              flex
              items-center
              gap-2
            "
          >
            {/* SEARCH */}
            <div
              ref={searchRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setSearchOpen(
                    (current) => !current
                  )
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-transparent
                  text-slate-500
                  transition
                  hover:border-border
                  hover:bg-slate-50
                  hover:text-text-primary
                "
                aria-label="Search CareerPilot"
              >
                <Search size={19} />
              </button>

              {searchOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-[min(360px,calc(100vw-2rem))]
                    border
                    border-border
                    bg-white
                    shadow-cp-lg
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      border-b
                      border-border
                      px-3
                    "
                  >
                    <Search
                      size={17}
                      className="shrink-0 text-slate-400"
                    />

                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(
                          event.target.value
                        )
                      }
                      placeholder="Search CareerPilot..."
                      className="
                        h-12
                        min-w-0
                        flex-1
                        bg-transparent
                        text-sm
                        text-text-primary
                        outline-none
                        placeholder:text-slate-400
                      "
                    />

                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearchQuery("")
                        }
                        className="
                          text-slate-400
                          hover:text-slate-700
                        "
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div
                    className="
                      max-h-80
                      overflow-y-auto
                      p-2
                    "
                  >
                    {filteredSearchItems.length > 0 ? (
                      filteredSearchItems.map(
                        (item) => (
                          <button
                            key={item.path}
                            type="button"
                            onClick={() =>
                              handleSearchNavigation(
                                item.path
                              )
                            }
                            className="
                              flex
                              w-full
                              items-center
                              gap-3
                              px-3
                              py-2.5
                              text-left
                              text-sm
                              text-text-primary
                              transition
                              hover:bg-slate-50
                            "
                          >
                            <Search
                              size={15}
                              className="text-slate-400"
                            />

                            <span>
                              {item.label}
                            </span>
                          </button>
                        )
                      )
                    ) : (
                      <div
                        className="
                          px-3
                          py-8
                          text-center
                        "
                      >
                        <p
                          className="
                            text-sm
                            font-medium
                            text-text-primary
                          "
                        >
                          No results found
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-text-secondary
                          "
                        >
                          Try another search.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* NOTIFICATIONS */}
            <div
              ref={notificationRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setNotificationOpen(
                    (current) => !current
                  )
                }
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-transparent
                  text-slate-500
                  transition
                  hover:border-border
                  hover:bg-slate-50
                  hover:text-text-primary
                "
                aria-label="Notifications"
              >
                <Bell size={19} />
              </button>

              {notificationOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-[min(360px,calc(100vw-2rem))]
                    border
                    border-border
                    bg-white
                    shadow-cp-lg
                  "
                >
                  <div
                    className="
                      border-b
                      border-border
                      px-4
                      py-3
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-text-primary
                      "
                    >
                      Notifications
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-text-secondary
                      "
                    >
                      CareerPilot updates
                    </p>
                  </div>

                  {notifications.length > 0 ? (
                    <div className="divide-y divide-border">
                      {notifications.map(
                        (notification) => (
                          <div
                            key={notification.id}
                            className="
                              flex
                              gap-3
                              px-4
                              py-4
                            "
                          >
                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                bg-primary-50
                                text-primary-600
                              "
                            >
                              <Bell size={16} />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-text-primary">
                                {notification.title}
                              </p>

                              <p className="mt-1 text-xs leading-5 text-text-secondary">
                                {notification.description}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div
                      className="
                        px-5
                        py-10
                        text-center
                      "
                    >
                      <div
                        className="
                          mx-auto
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          bg-slate-50
                          text-slate-400
                        "
                      >
                        <Bell size={18} />
                      </div>

                      <p
                        className="
                          mt-3
                          text-sm
                          font-medium
                          text-text-primary
                        "
                      >
                        You're all caught up
                      </p>

                      <p
                        className="
                          mx-auto
                          mt-1
                          max-w-[240px]
                          text-xs
                          leading-5
                          text-text-secondary
                        "
                      >
                        New CareerPilot updates will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* GUEST */}
            {!isAuthenticated ? (
              <div
                className="
                  ml-1
                  hidden
                  items-center
                  gap-2
                  sm:flex
                "
              >
                <button
                  type="button"
                  onClick={openLogin}
                  className="
                    h-10
                    px-4
                    text-sm
                    font-semibold
                    text-text-primary
                    transition
                    hover:bg-slate-50
                  "
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={openSignup}
                  className="
                    h-10
                    bg-primary-600
                    px-4
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-primary-700
                  "
                >
                  Sign Up
                </button>
              </div>
            ) : (
              /* LOGGED IN USER */
              <div
                ref={userMenuRef}
                className="relative ml-1"
              >
                <button
                  type="button"
                  onClick={() =>
                    setUserMenuOpen(
                      (current) => !current
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2.5
                    border
                    border-transparent
                    py-1.5
                    pl-1.5
                    pr-2
                    transition
                    hover:border-border
                    hover:bg-slate-50
                  "
                  aria-label="Open account menu"
                  aria-expanded={userMenuOpen}
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      bg-primary-600
                      text-xs
                      font-bold
                      text-white
                    "
                  >
                    {getInitials()}
                  </div>

                  <div
                    className="
                      hidden
                      min-w-0
                      text-left
                      md:block
                    "
                  >
                    <p
                      className="
                        max-w-[150px]
                        truncate
                        text-sm
                        font-semibold
                        text-text-primary
                      "
                    >
                      {getUserName()}
                    </p>

                    {getUserRole() && (
                      <p
                        className="
                          max-w-[150px]
                          truncate
                          text-[11px]
                          text-text-secondary
                        "
                      >
                        {getUserRole()}
                      </p>
                    )}
                  </div>

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="
                      hidden
                      text-slate-400
                      md:block
                    "
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-12
                      z-50
                      w-64
                      border
                      border-border
                      bg-white
                      shadow-cp-lg
                    "
                  >
                    {/* USER INFO */}
                    <div
                      className="
                        border-b
                        border-border
                        px-4
                        py-4
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            bg-primary-600
                            text-xs
                            font-bold
                            text-white
                          "
                        >
                          {getInitials()}
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                              truncate
                              text-sm
                              font-semibold
                              text-text-primary
                            "
                          >
                            {getUserName()}
                          </p>

                          <p
                            className="
                              mt-0.5
                              truncate
                              text-xs
                              text-text-secondary
                            "
                          >
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* MENU */}
                    <div className="p-1.5">
                      <button
                        type="button"
                        onClick={goToProfile}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          px-3
                          py-2.5
                          text-left
                          text-sm
                          text-text-primary
                          transition
                          hover:bg-slate-50
                        "
                      >
                        <UserRound
                          size={17}
                          className="text-slate-400"
                        />

                        <span>Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={goToSettings}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          px-3
                          py-2.5
                          text-left
                          text-sm
                          text-text-primary
                          transition
                          hover:bg-slate-50
                        "
                      >
                        <Settings
                          size={17}
                          className="text-slate-400"
                        />

                        <span>Settings</span>
                      </button>
                    </div>

                    {/* LOGOUT */}
                    <div
                      className="
                        border-t
                        border-border
                        p-1.5
                      "
                    >
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          px-3
                          py-2.5
                          text-left
                          text-sm
                          font-medium
                          text-red-600
                          transition
                          hover:bg-red-50
                        "
                      >
                        <LogOut size={17} />

                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* AUTH MODALS */}
      {authOpen &&
        authType === "login" && (
          <LoginModal
            onClose={closeAuth}
            onSwitchToSignup={switchToSignup}
          />
        )}

      {authOpen &&
        authType === "signup" && (
          <SignupModal
            onClose={closeAuth}
            onSwitchToLogin={switchToLogin}
          />
        )}
    </>
  );
};

export default Navbar;