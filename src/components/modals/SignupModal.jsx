import React, {
  useEffect,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
  X,
} from "lucide-react";

import {
  setAuthState,
} from "../../api/auth";


const SignupModal = ({
  onClose,
  onSwitchToLogin,
}) => {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

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


  const validateForm = () => {
    const name =
      formData.name.trim();

    const email =
      formData.email.trim();

    const password =
      formData.password;

    const confirmPassword =
      formData.confirmPassword;


    if (!name) {
      return "Please enter your full name.";
    }


    if (name.length < 2) {
      return "Please enter a valid name.";
    }


    if (!email) {
      return "Please enter your email address.";
    }


    if (
      !email.includes("@") ||
      !email.includes(".")
    ) {
      return "Please enter a valid email address.";
    }


    if (!password) {
      return "Please create a password.";
    }


    if (password.length < 6) {
      return (
        "Password must contain at least 6 characters."
      );
    }


    if (!confirmPassword) {
      return "Please confirm your password.";
    }


    if (
      password !==
      confirmPassword
    ) {
      return "Passwords do not match.";
    }


    return "";
  };


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );
      return;
    }


    setIsSubmitting(true);


    try {
      const user = {
        name:
          formData.name.trim(),

        email:
          formData.email.trim(),

        targetRole:
          "",

        avatar:
          "",
      };


      /*
       * --------------------------------------
       * TEMPORARY LOCAL AUTH
       * --------------------------------------
       *
       * This creates the CareerPilot
       * authenticated state locally.
       *
       * Later this will be replaced by the
       * real authentication API/database.
       */

      setAuthState(user);


      /*
       * Notify the rest of the application.
       */
      window.dispatchEvent(
        new CustomEvent(
          "careerpilot:auth-changed"
        )
      );


      /*
       * Close the signup modal.
       */
      onClose?.();

    } catch (submitError) {
      console.error(
        "CareerPilot signup failed:",
        submitError
      );

      setError(
        "Something went wrong while creating your account. Please try again."
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
          aria-label="Close signup"
        >
          <X size={18} />
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
            <UserRound
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
            Create your account
          </h2>


          <p
            className="
              mt-2
              text-sm
              leading-6
              text-text-secondary
            "
          >
            Start building your personalized
            career workspace.
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

          {/* NAME */}

          <div>

            <label
              htmlFor="careerpilot-signup-name"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-text-primary
              "
            >
              Full name
            </label>


            <div
              className="
                relative
              "
            >

              <UserRound
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
                id="careerpilot-signup-name"
                name="name"
                type="text"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                placeholder="Your full name"
                autoComplete="name"
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


          {/* EMAIL */}

          <div className="mt-5">

            <label
              htmlFor="careerpilot-signup-email"
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
                id="careerpilot-signup-email"
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
              htmlFor="careerpilot-signup-password"
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
                id="careerpilot-signup-password"
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
                placeholder="Create a password"
                autoComplete="new-password"
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


          {/* CONFIRM PASSWORD */}

          <div className="mt-5">

            <label
              htmlFor="careerpilot-signup-confirm-password"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-text-primary
              "
            >
              Confirm password
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
                id="careerpilot-signup-confirm-password"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                placeholder="Confirm your password"
                autoComplete="new-password"
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
                  setShowConfirmPassword(
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
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showConfirmPassword ? (
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
              ? "Creating account..."
              : "Create account"}
          </button>


          {/* LOGIN */}

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
              Already have a CareerPilot
              account?
            </p>


            <button
              type="button"
              onClick={
                onSwitchToLogin
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
              Sign in
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


export default SignupModal;