import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  LogOut,
  Shield,
  Trash2,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuthState, getCareerProfile, logoutCareerPilot } from "../api/auth";

const SETTINGS_KEY = "careerpilotSettings";

const defaultSettings = {
  emailNotifications: true,
  applicationUpdates: true,
  careerInsights: true,
};

const readSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

const Settings = ({
  user: userProp,
  profile: profileProp,
  isAuthenticated: isAuthenticatedProp,
  hasProfile: hasProfileProp,
  onLogout,
}) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => getAuthState());
  const [profile, setProfile] = useState(() => getCareerProfile());
  const [settings, setSettings] = useState(readSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const refreshState = () => {
      setAuth(getAuthState());
      setProfile(getCareerProfile());
    };

    window.addEventListener("careerpilot:auth-changed", refreshState);
    window.addEventListener("careerpilot:profile-updated", refreshState);
    window.addEventListener("storage", refreshState);

    return () => {
      window.removeEventListener("careerpilot:auth-changed", refreshState);
      window.removeEventListener("careerpilot:profile-updated", refreshState);
      window.removeEventListener("storage", refreshState);
    };
  }, []);

  const user = userProp ?? auth.user;
  const activeProfile = profileProp ?? profile;
  const isAuthenticated = isAuthenticatedProp ?? auth.isAuthenticated;
  const hasProfile = hasProfileProp ?? Boolean(activeProfile);

  const displayName = useMemo(() => {
    return (
      user?.name ||
      activeProfile?.personal?.name ||
      user?.email?.split("@")[0] ||
      "CareerPilot User"
    );
  }, [user, activeProfile]);

  const email = user?.email || activeProfile?.personal?.email || "";

  const updateSetting = (key) => {
    setSettings((current) => {
      const next = {
        ...current,
        [key]: !current[key],
      };

      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });

    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logoutCareerPilot();
    }

    navigate("/");
  };

  const handleClearProfile = () => {
    localStorage.removeItem("careerpilotProfile");
    localStorage.removeItem("careerpilotPersonalization");

    window.dispatchEvent(new CustomEvent("careerpilot:profile-updated"));

    navigate("/personalize");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-surface-page p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="border border-border bg-white p-8 shadow-cp-sm sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center bg-primary-50 text-primary-600">
              <UserRound size={22} />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary-600">
              Settings
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Sign in to manage your settings
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
              Your account settings, notification preferences, and career profile
              controls will appear here after you sign in.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("careerpilot:open-login")
                  )
                }
                className="inline-flex items-center gap-2 bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                Sign in
                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("careerpilot:open-signup")
                  )
                }
                className="border border-border bg-white px-5 py-3 text-sm font-semibold text-text-primary transition hover:bg-surface-subtle"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface-page p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-600">
            Account
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                Manage your CareerPilot preferences and account controls.
              </p>
            </div>

            {saved && (
              <div className="inline-flex items-center gap-2 self-start border border-success-200 bg-success-50 px-3 py-2 text-xs font-semibold text-success-700 sm:self-auto">
                <Check size={15} />
                Saved
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            {/* Account */}
            <section className="border border-border bg-white shadow-cp-sm">
              <div className="border-b border-border px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-primary-50 text-primary-600">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-text-primary">
                      Account
                    </h2>
                    <p className="mt-0.5 text-xs text-text-muted">
                      Your current CareerPilot account
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-border">
                <div className="flex flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Name
                    </p>
                    <p className="mt-1 text-sm font-medium text-text-primary">
                      {displayName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-primary-600 hover:text-primary-700"
                  >
                    View profile
                    <ChevronRight size={15} />
                  </button>
                </div>

                <div className="px-5 py-5 sm:px-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Email
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-text-primary">
                    {email || "No email available"}
                  </p>
                </div>

                <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Career profile
                    </p>

                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      {hasProfile
                        ? "Your resume has been analyzed and your career profile is available."
                        : "Upload your resume to create your AI-powered career profile."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(hasProfile ? "/profile" : "/personalize")
                    }
                    className="inline-flex shrink-0 items-center justify-center gap-2 border border-border bg-white px-4 py-2.5 text-xs font-semibold text-text-primary transition hover:bg-surface-subtle"
                  >
                    {hasProfile ? "View profile" : "Upload resume"}
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="border border-border bg-white shadow-cp-sm">
              <div className="border-b border-border px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-cyan-50 text-cyan-600">
                    <Bell size={19} />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-text-primary">
                      Notifications
                    </h2>
                    <p className="mt-0.5 text-xs text-text-muted">
                      Control the updates CareerPilot can send you
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-border">
                <SettingToggle
                  title="Email notifications"
                  description="Receive important CareerPilot account updates."
                  enabled={settings.emailNotifications}
                  onChange={() => updateSetting("emailNotifications")}
                />

                <SettingToggle
                  title="Application updates"
                  description="Get notified about changes related to your tracked applications."
                  enabled={settings.applicationUpdates}
                  onChange={() => updateSetting("applicationUpdates")}
                />

                <SettingToggle
                  title="Career insights"
                  description="Allow CareerPilot to surface relevant career guidance and profile insights."
                  enabled={settings.careerInsights}
                  onChange={() => updateSetting("careerInsights")}
                />
              </div>
            </section>

            {/* Privacy */}
            <section className="border border-border bg-white shadow-cp-sm">
              <div className="border-b border-border px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-slate-100 text-slate-700">
                    <Shield size={19} />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-text-primary">
                      Privacy & data
                    </h2>
                    <p className="mt-0.5 text-xs text-text-muted">
                      Understand and manage your locally stored data
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-5 sm:px-6">
                <div className="border border-border bg-surface-subtle p-4">
                  <p className="text-sm font-semibold text-text-primary">
                    Career profile data
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                    Your current browser session stores your CareerPilot
                    account state and extracted career profile locally.
                  </p>

                  <button
                    type="button"
                    onClick={handleClearProfile}
                    className="mt-4 inline-flex items-center gap-2 border border-danger-200 bg-white px-4 py-2.5 text-xs font-semibold text-danger-600 transition hover:bg-danger-50"
                  >
                    <Trash2 size={15} />
                    Replace career profile
                  </button>
                </div>
              </div>
            </section>

            {/* Support */}
            <section className="border border-border bg-white shadow-cp-sm">
              <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-violet-50 text-violet-600">
                    <CircleHelp size={19} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-text-primary">
                      Need help?
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      Learn how CareerPilot works and how your resume powers
                      the platform.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/help")}
                  className="inline-flex shrink-0 items-center justify-center gap-2 border border-border px-4 py-2.5 text-xs font-semibold text-text-primary transition hover:bg-surface-subtle"
                >
                  Open Help
                  <ChevronRight size={15} />
                </button>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            <div className="bg-brand-gradient-soft p-px">
              <div className="bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-600">
                  CareerPilot
                </p>

                <h2 className="mt-2 text-lg font-bold tracking-tight text-text-primary">
                  Your career starts with your resume.
                </h2>

                <p className="mt-2 text-xs leading-5 text-text-secondary">
                  Upload your resume once and CareerPilot can build the career
                  context used across your workspace.
                </p>

                {!hasProfile && (
                  <button
                    type="button"
                    onClick={() => navigate("/personalize")}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-primary-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-primary-700"
                  >
                    Upload resume
                    <ChevronRight size={15} />
                  </button>
                )}
              </div>
            </div>

            <div className="border border-danger-200 bg-white shadow-cp-sm">
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-danger-600">
                  Account
                </p>

                <h2 className="mt-2 text-base font-bold text-text-primary">
                  Sign out
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                  Sign out of this CareerPilot session on this browser.
                </p>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-danger-200 bg-white px-4 py-3 text-xs font-semibold text-danger-600 transition hover:bg-danger-50"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const SettingToggle = ({ title, description, enabled, onChange }) => {
  return (
    <div className="flex items-start justify-between gap-5 px-5 py-5 sm:px-6">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className="mt-1 max-w-xl text-xs leading-5 text-text-secondary">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`Toggle ${title}`}
        onClick={onChange}
        className={`relative mt-0.5 h-6 w-11 shrink-0 border transition ${
          enabled
            ? "border-primary-600 bg-primary-600"
            : "border-slate-300 bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 bg-white shadow-sm transition ${
            enabled ? "left-[21px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
};

export default Settings;