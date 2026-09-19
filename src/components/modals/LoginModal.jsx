import React, {
  useEffect,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  X,
} from "lucide-react";

import {
  setAuthState,
} from "../../api/auth";


const LoginModal = ({
  onClose,
  onSwitchToSignup,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  /*
   * Prevent background scrolling while
   * the modal is open.
   */
  useEffect(() => {
    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, []);


  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    const email =
      formData.email.trim();

    const password =
      formData.password;

    if (!email) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
      );
      return;
    }

    if (
      !email.includes("@") ||
      !email.includes(".")
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * --------------------------------------
       * TEMPORARY LOCAL AUTH
       * --------------------------------------
       *
       * We are currently building the frontend
       * auth flow before connecting a real
       * authentication backend.
       *
       * This DOES NOT pretend to be secure
       * production authentication.
       *
       * Later this block will call our real
       * authentication API.
       */

      const savedUser =
        localStorage.getItem(
          "careerpilotUser"
        );

      let user = null;

      if (savedUser) {
        try {
          user = JSON.parse(savedUser);
        } catch {
          user = null;
        }
      }

      /*
       * If a user was already created by
       * SignupModal, use that user's details.
       *
       * Otherwise create the minimum local
       * authenticated user object.
       */
      if (
        !user ||
        user.email?.toLowerCase() !==
          email.toLowerCase()
      ) {
        user = {
          name:
            email
              .split("@")[0]
              .replace(/[._-]/g, " ")
              .replace(
                /\b\w/g,
                (character) =>
                  character.toUpperCase()
              ),

          email,

          targetRole:
            "",

          avatar:
            "",
        };
      }

      /*
       * Save the centralized auth state.
       */
      setAuthState(user);

      /*
       * Tell the application that login
       * succeeded.
       */
      window.dispatchEvent(
        new CustomEvent(
          "careerpilot:auth-changed"
        )
      );

      /*
       * Close modal.
       */
      onClose?.();

    } catch (submitError) {
      console.error(
        "CareerPilot login failed:",
        submitError
      );

      setError(
        "Something went wrong while signing in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleOverlayClick = (
    event
  ) => {
    if (
      event.target ===
      event.currentTarget
    ) {
      onClose?.();
    }
  };


  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-slate-950/45
        p-4
        backdrop-blur-[2px]
      "
      onMouseDown={
        handleOverlayClick
      }
    >

      <div
        className="
          relative
          w-full
          max-w-md
          overflow-hidden
          border
          border-border
          bg-white
          shadow-2xl
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* --------------------------------
            CLOSE
        -------------------------------- */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-4
            top-4
            z-10
            flex
            h-9
            w-9
            items-center
            justify-center
            border
            border-border
            bg-white
            text-slate-500
            transition
            hover:border-slate-300
            hover:bg-slate-50
            hover:text-slate-900
          "
          aria-label="Close login"
        >
          <X
            size={18}
          />
        </button>


        {/* --------------------------------
            HEADER
        -------------------------------- */}

        <div
          className="
            border-b
            border-border
            px-6
            pb-6
            pt-7
            sm:px-8
          "
        >

          <div
            className="
              mb-5
              flex
              h-11
              w-11
              items-center
              justify-center
              bg-primary-50
              text-primary-600
            "
          >
            <LockKeyhole
              size={21}
            />
          </div>

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

          <h2
            className="
              mt-2
              text-2xl
              font-bold
              tracking-tight
              text-text-primary
            "
          >
            Welcome back
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-text-secondary
            "
          >
            Sign in to continue to your
            personalized career workspace.
          </p>

        </div>


        {/* --------------------------------
            FORM
        -------------------------------- */}

        <form
          onSubmit={handleSubmit}
          className="
            px-6
            py-6
            sm:px-8
          "
        >

          {/* EMAIL */}

          <div>
            <label
              htmlFor="careerpilot-login-email"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-text-primary
              "
            >
              Email address
            </label>

            <div
              className="
                relative
              "
            >

              <Mail
                size={17}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="careerpilot-login-email"
                name="email"
                type="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder="you@example.com"
                autoComplete="email"
                className="
                  h-11
                  w-full
                  border
                  border-border
                  bg-white
                  pl-10
                  pr-3
                  text-sm
                  text-text-primary
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-primary-500
                  focus:ring-2
                  focus:ring-primary-500/10
                "
              />

            </div>
          </div>


          {/* PASSWORD */}

          <div className="mt-5">

            <label
              htmlFor="careerpilot-login-password"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-text-primary
              "
            >
              Password
            </label>

            <div
              className="
                relative
              "
            >

              <LockKeyhole
                size={17}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="careerpilot-login-password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                className="
                  h-11
                  w-full
                  border
                  border-border
                  bg-white
                  pl-10
                  pr-11
                  text-sm
                  text-text-primary
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-primary-500
                  focus:ring-2
                  focus:ring-primary-500/10
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current
                  )
                }
                className="
                  absolute
                  right-0
                  top-0
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  text-slate-400
                  transition
                  hover:text-slate-700
                "
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff
                    size={17}
                  />
                ) : (
                  <Eye
                    size={17}
                  />
                )}
              </button>

            </div>
          </div>


          {/* ERROR */}

          {error && (
            <div
              className="
                mt-5
                border
                border-red-200
                bg-red-50
                px-3
                py-2.5
                text-sm
                leading-5
                text-red-700
              "
            >
              {error}
            </div>
          )}


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={
              isSubmitting
            }
            className="
              mt-6
              flex
              h-11
              w-full
              items-center
              justify-center
              bg-primary-600
              px-4
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-primary-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isSubmitting
              ? "Signing in..."
              : "Sign in"}
          </button>


          {/* SIGNUP */}

          <div
            className="
              mt-6
              border-t
              border-border
              pt-5
              text-center
            "
          >

            <p
              className="
                text-sm
                text-text-secondary
              "
            >
              Don't have a CareerPilot
              account?
            </p>

            <button
              type="button"
              onClick={
                onSwitchToSignup
              }
              className="
                mt-2
                text-sm
                font-semibold
                text-primary-600
                transition
                hover:text-primary-700
                hover:underline
              "
            >
              Create an account
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


export default LoginModal;