const AUTH_KEY = "careerpilotAuth";
const USER_KEY = "careerpilotUser";
const PROFILE_KEY = "careerpilotProfile";
const PERSONALIZATION_KEY = "careerpilotPersonalization";
const APPLICATIONS_KEY = "careerpilotApplications";
const SETTINGS_KEY = "careerpilotSettings";

const dispatchAuthChange = () => {
  window.dispatchEvent(new CustomEvent("careerpilot:auth-changed"));
};

const dispatchProfileChange = () => {
  window.dispatchEvent(new CustomEvent("careerpilot:profile-updated"));
};

/* -------------------------------------------------------
   AUTHENTICATION
------------------------------------------------------- */

export const getAuthState = () => {
  try {
    const savedAuth = localStorage.getItem(AUTH_KEY);

    if (!savedAuth) {
      return {
        isAuthenticated: false,
        user: null,
      };
    }

    const auth = JSON.parse(savedAuth);

    if (!auth?.isAuthenticated) {
      return {
        isAuthenticated: false,
        user: null,
      };
    }

    let user = auth.user || null;

    if (!user) {
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedUser) {
        user = JSON.parse(savedUser);
      }
    }

    return {
      isAuthenticated: true,
      user,
    };
  } catch (error) {
    console.error("Failed to read CareerPilot auth state:", error);

    return {
      isAuthenticated: false,
      user: null,
    };
  }
};

export const setAuthState = (user) => {
  if (!user) return;

  const authState = {
    isAuthenticated: true,
    user,
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  dispatchAuthChange();
};

export const updateAuthUser = (updates) => {
  const currentAuth = getAuthState();

  if (!currentAuth.isAuthenticated || !currentAuth.user) {
    return null;
  }

  const updatedUser = {
    ...currentAuth.user,
    ...updates,
  };

  setAuthState(updatedUser);

  return updatedUser;
};

/* -------------------------------------------------------
   CAREER PROFILE
------------------------------------------------------- */

export const getCareerProfile = () => {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    /*
      Backward compatibility with the previous
      personalization storage key.
    */
    const oldSaved = localStorage.getItem(PERSONALIZATION_KEY);

    if (oldSaved) {
      const profile = JSON.parse(oldSaved);

      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

      return profile;
    }

    return null;
  } catch (error) {
    console.error("Failed to read CareerPilot profile:", error);
    return null;
  }
};

export const hasCareerProfile = () => {
  return Boolean(getCareerProfile());
};

export const saveCareerProfile = (profile) => {
  if (!profile) return;

  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  localStorage.setItem(PERSONALIZATION_KEY, JSON.stringify(profile));

  dispatchProfileChange();
};

export const clearCareerProfile = () => {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(PERSONALIZATION_KEY);

  dispatchProfileChange();
};

/* -------------------------------------------------------
   COMPLETE CAREERPILOT STATE
------------------------------------------------------- */

export const getCareerPilotState = () => {
  const auth = getAuthState();
  const profile = getCareerProfile();

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    profile,
    hasProfile: Boolean(profile),
  };
};

/* -------------------------------------------------------
   SETTINGS
------------------------------------------------------- */

export const getCareerPilotSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);

    if (!saved) {
      return null;
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error("Failed to read CareerPilot settings:", error);
    return null;
  }
};

export const saveCareerPilotSettings = (settings) => {
  if (!settings) return;

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

/* -------------------------------------------------------
   APPLICATIONS
------------------------------------------------------- */

export const getCareerPilotApplications = () => {
  try {
    const saved = localStorage.getItem(APPLICATIONS_KEY);

    if (!saved) {
      return [];
    }

    const applications = JSON.parse(saved);

    return Array.isArray(applications) ? applications : [];
  } catch (error) {
    console.error("Failed to read CareerPilot applications:", error);
    return [];
  }
};

export const saveCareerPilotApplications = (applications) => {
  if (!Array.isArray(applications)) return;

  localStorage.setItem(
    APPLICATIONS_KEY,
    JSON.stringify(applications)
  );
};

export const clearCareerPilotApplications = () => {
  localStorage.removeItem(APPLICATIONS_KEY);
};

/* -------------------------------------------------------
   LOGOUT
------------------------------------------------------- */

export const logoutCareerPilot = () => {
  /*
    Clear authentication.
  */
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);

  /*
    Clear AI-generated career profile.
  */
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(PERSONALIZATION_KEY);

  /*
    Clear locally tracked applications.
  */
  localStorage.removeItem(APPLICATIONS_KEY);

  /*
    Clear settings so a fresh session starts clean.
  */
  localStorage.removeItem(SETTINGS_KEY);

  /*
    Clear previous session-storage copies as well.
  */
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(PROFILE_KEY);
  sessionStorage.removeItem(PERSONALIZATION_KEY);
  sessionStorage.removeItem(APPLICATIONS_KEY);
  sessionStorage.removeItem(SETTINGS_KEY);

  dispatchAuthChange();
  dispatchProfileChange();
};

/* -------------------------------------------------------
   COMPLETE RESET
------------------------------------------------------- */

export const resetCareerPilot = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(PERSONALIZATION_KEY);
  localStorage.removeItem(APPLICATIONS_KEY);
  localStorage.removeItem(SETTINGS_KEY);

  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(PROFILE_KEY);
  sessionStorage.removeItem(PERSONALIZATION_KEY);
  sessionStorage.removeItem(APPLICATIONS_KEY);
  sessionStorage.removeItem(SETTINGS_KEY);

  dispatchAuthChange();
  dispatchProfileChange();
};

/* -------------------------------------------------------
   EXPORT STORAGE KEYS
------------------------------------------------------- */

export const CAREERPILOT_STORAGE_KEYS = {
  AUTH_KEY,
  USER_KEY,
  PROFILE_KEY,
  PERSONALIZATION_KEY,
  APPLICATIONS_KEY,
  SETTINGS_KEY,
};