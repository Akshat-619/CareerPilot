import React from "react";

import {
  BriefcaseBusiness,
  ChevronRight,
  Compass,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogIn,
  Settings,
  Sparkles,
  Target,
  UserRoundPlus,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import Logo from "../assets/Logo.png";

const Sidebar = ({
  user,
  isAuthenticated = false,
  hasProfile = false,
}) => {
  const navigate = useNavigate();

  const navigation = [
    {
      label: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Opportunities",
      path: "/opportunities",
      icon: BriefcaseBusiness,
    },
    {
      label: "Applications",
      path: "/applications",
      icon: FileText,
    },
    {
      label: "Career Path",
      path: "/career-path",
      icon: Compass,
    },
    {
      label: "Skills",
      path: "/skills",
      icon: Target,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: GraduationCap,
    },
  ];

  const secondaryNavigation = [
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
    {
      label: "Help",
      path: "/help",
      icon: HelpCircle,
    },
  ];

  const handleSignup = () => {
    window.dispatchEvent(
      new CustomEvent("careerpilot:open-signup")
    );
  };

  const handleLogin = () => {
    window.dispatchEvent(
      new CustomEvent("careerpilot:open-login")
    );
  };

  const handleResumeSetup = () => {
    if (!isAuthenticated) {
      handleSignup();
      return;
    }

    navigate("/personalize");
  };

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        bottom-0
        z-40
        hidden
        w-64
        border-r
        border-border
        bg-white
        lg:flex
        lg:flex-col
      "
    >
      {/* BRAND */}
      <div
        className="
          flex
          h-20
          shrink-0
          items-center
          border-b
          border-border
          px-6
        "
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center"
          aria-label="Go to CareerPilot dashboard"
        >
          <img
            src={Logo}
            alt="CareerPilot"
            className="h-10 w-auto max-w-[190px] object-contain"
          />
        </button>
      </div>

    

      {/* MAIN NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p
          className="
            mb-2
            px-3
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-slate-400
          "
        >
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map(
            ({
              label,
              path,
              icon: Icon,
            }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) => `
                  group
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  transition
                  ${
                    isActive
                      ? `
                        bg-primary-50
                        text-primary-700
                      `
                      : `
                        text-slate-600
                        hover:bg-slate-50
                        hover:text-text-primary
                      `
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={
                        isActive
                          ? "text-primary-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }
                    />

                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            )
          )}
        </div>

        <p
          className="
            mb-2
            mt-7
            px-3
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-slate-400
          "
        >
          Support
        </p>

        <div className="space-y-1">
          {secondaryNavigation.map(
            ({
              label,
              path,
              icon: Icon,
            }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `
                  group
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  transition
                  ${
                    isActive
                      ? `
                        bg-primary-50
                        text-primary-700
                      `
                      : `
                        text-slate-600
                        hover:bg-slate-50
                        hover:text-text-primary
                      `
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={
                        isActive
                          ? "text-primary-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }
                    />

                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            )
          )}
        </div>
      </nav>

      {/* BOTTOM AREA */}
      <div className="shrink-0 border-t border-border p-4">
        {!isAuthenticated ? (
          <div>
            <div className="mb-3 px-1">
              <p className="text-sm font-semibold text-text-primary">
                Ready to personalize?
              </p>

              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Create your account and let CareerPilot build your
                career profile from your resume.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignup}
              className="
                flex
                w-full
                items-center
                justify-between
                bg-primary-600
                px-3
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-primary-700
              "
            >
              <span>Create account</span>

              <ChevronRight size={16} />
            </button>

            <button
              type="button"
              onClick={handleLogin}
              className="
                mt-2
                flex
                w-full
                items-center
                justify-center
                gap-2
                px-3
                py-2
                text-xs
                font-semibold
                text-slate-600
                transition
                hover:bg-slate-50
                hover:text-text-primary
              "
            >
              <LogIn size={14} />

              Sign in
            </button>
          </div>
        ) : !hasProfile ? (
          <div>
            <div className="mb-3">
              <p className="text-sm font-semibold text-text-primary">
                Complete your setup
              </p>

              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Upload your resume and let CareerPilot create your
                personalized profile.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResumeSetup}
              className="
                flex
                w-full
                items-center
                justify-between
                bg-primary-600
                px-3
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-primary-700
              "
            >
              <span>Upload Resume</span>

              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div
            className="
              border
              border-emerald-100
              bg-emerald-50/60
              px-3
              py-3
            "
          >
            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  bg-emerald-100
                  text-emerald-700
                "
              >
                <FileText size={14} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-emerald-800">
                  Career profile active
                </p>

                <p className="mt-0.5 truncate text-[10px] text-emerald-700/70">
                  Personalized workspace
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;