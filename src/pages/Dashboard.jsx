import React, {
  useMemo,
} from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  FileText,
  GraduationCap,
  Sparkles,
  Target,
  Upload,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


const Dashboard = ({
  user,
  profile,
  isAuthenticated = false,
  hasProfile = false,
}) => {
  const navigate =
    useNavigate();


  /*
   * --------------------------------------
   * PROFILE NORMALIZATION
   * --------------------------------------
   *
   * CareerPilot can receive the profile
   * directly from App.jsx or fall back
   * to localStorage for compatibility.
   */

  const normalizedProfile =
    useMemo(() => {
      if (profile) {
        return normalizeProfile(
          profile
        );
      }

      try {
        const saved =
          localStorage.getItem(
            "careerpilotProfile"
          );

        if (saved) {
          return normalizeProfile(
            JSON.parse(saved)
          );
        }


        const oldSaved =
          localStorage.getItem(
            "careerpilotPersonalization"
          );

        if (oldSaved) {
          return normalizeProfile(
            JSON.parse(oldSaved)
          );
        }
      } catch (error) {
        console.error(
          "Failed to load CareerPilot profile:",
          error
        );
      }

      return null;
    }, [profile]);


  /*
   * --------------------------------------
   * STATE 1
   * GUEST / DEMO
   * --------------------------------------
   */

  if (!isAuthenticated) {
    return (
      <GuestDashboard
        onSignup={() =>
          window.dispatchEvent(
            new CustomEvent(
              "careerpilot:open-signup"
            )
          )
        }
        onLogin={() =>
          window.dispatchEvent(
            new CustomEvent(
              "careerpilot:open-login"
            )
          )
        }
      />
    );
  }


  /*
   * --------------------------------------
   * STATE 2
   * LOGGED IN / NO PROFILE
   * --------------------------------------
   */

  if (
    isAuthenticated &&
    !hasProfile
  ) {
    return (
      <ResumeOnboardingDashboard
        user={user}
        onUploadResume={() =>
          navigate("/personalize")
        }
      />
    );
  }


  /*
   * --------------------------------------
   * STATE 3
   * LOGGED IN / PROFILE READY
   * --------------------------------------
   */

  return (
    <PersonalizedDashboard
      user={user}
      profile={
        normalizedProfile
      }
      onUpdateProfile={() =>
        navigate("/personalize")
      }
      onViewProfile={() =>
        navigate("/profile")
      }
      onCareerPath={() =>
        navigate("/career-path")
      }
      onSkills={() =>
        navigate("/skills")
      }
      onOpportunities={() =>
        navigate("/opportunities")
      }
      onApplications={() =>
        navigate("/applications")
      }
    />
  );
};


/*
 * ======================================
 * GUEST DASHBOARD
 * ======================================
 */

const GuestDashboard = ({
  onSignup,
  onLogin,
}) => {
  return (
    <div
      className="
        min-h-[calc(100vh-80px)]
        bg-surface-page
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

      

        {/* --------------------------------
            HERO
        -------------------------------- */}

        <section
          className="
            mt-6
            border
            border-border
            bg-white
            shadow-cp-sm
          "
        >

          <div
            className="
              grid
              gap-10
              px-6
              py-10
              sm:px-10
              sm:py-12
              lg:grid-cols-[1.25fr_0.75fr]
              lg:items-center
              lg:px-12
              lg:py-14
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-primary-600
                "
              >
                Career intelligence
              </p>


              <h1
                className="
                  mt-3
                  max-w-3xl
                  text-3xl
                  font-bold
                  tracking-tight
                  text-text-primary
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Your resume goes in.
                Your career workspace
                comes out.
              </h1>


              <p
                className="
                  mt-5
                  max-w-2xl
                  text-sm
                  leading-7
                  text-text-secondary
                  sm:text-base
                "
              >
                CareerPilot turns the information
                already present in your resume into
                a structured career profile that can
                power your opportunities, skills,
                career path and applications.
              </p>


              <div
                className="
                  mt-7
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >

                <button
                  type="button"
                  onClick={onSignup}
                  className="
                    flex
                    h-11
                    items-center
                    justify-center
                    gap-2
                    bg-primary-600
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-primary-700
                  "
                >
                  Create your account

                  <ArrowRight
                    size={16}
                  />
                </button>


                <button
                  type="button"
                  onClick={onLogin}
                  className="
                    flex
                    h-11
                    items-center
                    justify-center
                    border
                    border-border
                    px-5
                    text-sm
                    font-semibold
                    text-text-primary
                    transition
                    hover:bg-slate-50
                  "
                >
                  Sign in
                </button>

              </div>

            </div>


            {/* RIGHT SIDE */}

            <div
              className="
                border
                border-border
                bg-slate-50
                p-5
                sm:p-6
              "
            >

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-slate-400
                "
              >
                How CareerPilot works
              </p>


              <div
                className="
                  mt-5
                  space-y-5
                "
              >

                <DemoStep
                  number="01"
                  title="Upload your resume"
                  description="Use the resume you already have."
                />

                <DemoStep
                  number="02"
                  title="AI understands it"
                  description="CareerPilot extracts your actual career information."
                />

                <DemoStep
                  number="03"
                  title="Build your workspace"
                  description="Your profile becomes the foundation for the platform."
                />

              </div>

            </div>

          </div>

        </section>


        {/* --------------------------------
            FEATURE AREAS
        -------------------------------- */}

        <section
          className="
            mt-6
            grid
            gap-4
            md:grid-cols-2
            lg:grid-cols-4
          "
        >

          <FeaturePreview
            icon={BriefcaseBusiness}
            title="Opportunities"
            description="Explore career opportunities around your profile."
          />

          <FeaturePreview
            icon={Compass}
            title="Career Path"
            description="Understand where your current experience can lead."
          />

          <FeaturePreview
            icon={Target}
            title="Skills"
            description="See the skills CareerPilot extracts from your resume."
          />

          <FeaturePreview
            icon={FileText}
            title="Applications"
            description="Keep your career application workspace organized."
          />

        </section>


        {/* --------------------------------
            NO FAKE DATA NOTE
        -------------------------------- */}

        <div
          className="
            mt-6
            border
            border-border
            bg-white
            p-5
          "
        >

          <div
            className="
              flex
              gap-3
            "
          >

            <CheckCircle2
              size={18}
              className="
                mt-0.5
                shrink-0
                text-emerald-600
              "
            />

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-text-primary
                "
              >
                This is a live product flow,
                not a fake dashboard.
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-text-secondary
                "
              >
                CareerPilot will only show
                personalized information after
                your account and resume are
                connected.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


/*
 * ======================================
 * LOGGED IN / NO PROFILE
 * ======================================
 */

const ResumeOnboardingDashboard = ({
  user,
  onUploadResume,
}) => {
  const name =
    getUserName(user);


  return (
    <div
      className="
        min-h-[calc(100vh-80px)]
        bg-surface-page
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        {/* SETUP STATUS */}

        <div
          className="
            border
            border-amber-200
            bg-amber-50
            px-5
            py-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <Sparkles
              size={16}
              className="
                text-amber-600
              "
            />

            <p
              className="
                text-sm
                font-medium
                text-amber-800
              "
            >
              Your account is ready.
              Your career profile is the
              next step.
            </p>

          </div>

        </div>


        {/* MAIN */}

        <div
          className="
            mt-6
            border
            border-border
            bg-white
            shadow-cp-sm
          "
        >

          <div
            className="
              mx-auto
              max-w-3xl
              px-6
              py-12
              text-center
              sm:px-10
              sm:py-16
            "
          >

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                bg-primary-50
                text-primary-600
              "
            >
              <Upload
                size={27}
              />
            </div>


            <p
              className="
                mt-6
                text-xs
                font-semibold
                uppercase
                tracking-[0.14em]
                text-primary-600
              "
            >
              Almost there
            </p>


            <h1
              className="
                mt-2
                text-3xl
                font-bold
                tracking-tight
                text-text-primary
                sm:text-4xl
              "
            >
              Welcome, {name}.
            </h1>


            <p
              className="
                mx-auto
                mt-4
                max-w-2xl
                text-sm
                leading-7
                text-text-secondary
                sm:text-base
              "
            >
              Upload your resume and let
              CareerPilot build your career
              profile automatically. You won't
              need to manually enter all of your
              experience and skills.
            </p>


            <button
              type="button"
              onClick={
                onUploadResume
              }
              className="
                mt-8
                inline-flex
                h-12
                items-center
                justify-center
                gap-2
                bg-primary-600
                px-6
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-primary-700
              "
            >

              Upload Resume

              <ArrowRight
                size={17}
              />

            </button>


            <p
              className="
                mt-4
                text-xs
                text-slate-400
              "
            >
              PDF or DOCX · Maximum 5 MB
            </p>

          </div>

        </div>


        {/* WHAT HAPPENS NEXT */}

        <div
          className="
            mt-6
            grid
            gap-4
            md:grid-cols-3
          "
        >

          <SetupStep
            number="01"
            title="Upload"
            description="Give CareerPilot your existing resume."
          />

          <SetupStep
            number="02"
            title="AI analysis"
            description="Your resume is converted into structured career information."
          />

          <SetupStep
            number="03"
            title="Personalized workspace"
            description="Your dashboard adapts to the career profile extracted from your resume."
          />

        </div>

      </div>

    </div>
  );
};


/*
 * ======================================
 * PERSONALIZED DASHBOARD
 * ======================================
 */

const PersonalizedDashboard = ({
  user,
  profile,
  onUpdateProfile,
  onViewProfile,
  onCareerPath,
  onSkills,
  onOpportunities,
  onApplications,
}) => {
  const name =
    profile?.personal?.name ||
    getUserName(user);


  const role =
    profile?.careerProfile
      ?.likelyRoles?.[0] ||
    profile?.careerProfile
      ?.primaryDomain ||
    "Career Profile";


  const location =
    profile?.personal
      ?.location ||
    "";


  const experienceLevel =
    profile?.careerProfile
      ?.experienceLevel ||
    "";


  const skills =
    getAllSkills(profile);


  const experience =
    profile?.experience || [];


  const education =
    profile?.education || [];


  const projects =
    profile?.projects || [];


  const likelyRoles =
    profile?.careerProfile
      ?.likelyRoles || [];


  return (
    <div
      className="
        min-h-[calc(100vh-80px)]
        bg-surface-page
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        {/* --------------------------------
            PROFILE STATUS
        -------------------------------- */}

        <div
          className="
            flex
            flex-col
            gap-3
            border
            border-emerald-100
            bg-emerald-50/60
            px-5
            py-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <CheckCircle2
              size={16}
              className="
                text-emerald-600
              "
            />

            <p
              className="
                text-sm
                font-medium
                text-emerald-800
              "
            >
              Your CareerPilot profile is
              active.
            </p>

          </div>


          <button
            type="button"
            onClick={
              onUpdateProfile
            }
            className="
              text-left
              text-xs
              font-semibold
              text-emerald-700
              hover:underline
              sm:text-right
            "
          >
            Update resume/profile →
          </button>

        </div>


        {/* --------------------------------
            WELCOME
        -------------------------------- */}

        <section
          className="
            mt-6
            border
            border-border
            bg-white
            shadow-cp-sm
          "
        >

          <div
            className="
              grid
              gap-8
              px-6
              py-7
              sm:px-8
              lg:grid-cols-[1fr_auto]
              lg:items-center
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-primary-600
                "
              >
                Your career workspace
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
                Welcome back, {name}.
              </h1>


              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-text-secondary
                "
              >
                CareerPilot is using the
                information extracted from your
                resume to organize your career
                workspace.
              </p>


              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-2
                "
              >

                <ProfileTag
                  icon={UserRound}
                  text={role}
                />

                {experienceLevel && (
                  <ProfileTag
                    icon={
                      GraduationCap
                    }
                    text={
                      experienceLevel
                    }
                  />
                )}

                {location && (
                  <ProfileTag
                    icon={Target}
                    text={location}
                  />
                )}

              </div>

            </div>


            <button
              type="button"
              onClick={
                onViewProfile
              }
              className="
                flex
                h-11
                items-center
                justify-center
                gap-2
                border
                border-border
                px-5
                text-sm
                font-semibold
                text-text-primary
                transition
                hover:bg-slate-50
              "
            >

              View Profile

              <ArrowRight
                size={16}
              />

            </button>

          </div>

        </section>


        {/* --------------------------------
            PROFILE OVERVIEW
        -------------------------------- */}

        <section
          className="
            mt-6
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          <OverviewCard
            icon={BriefcaseBusiness}
            label="Experience"
            value={
              experience.length
                ? `${experience.length} ${
                    experience.length === 1
                      ? "entry"
                      : "entries"
                  }`
                : "No entries"
            }
            onClick={
              onViewProfile
            }
          />


          <OverviewCard
            icon={Target}
            label="Skills"
            value={
              skills.length
                ? `${skills.length} ${
                    skills.length === 1
                      ? "skill"
                      : "skills"
                  }`
                : "No skills"
            }
            onClick={
              onSkills
            }
          />


          <OverviewCard
            icon={GraduationCap}
            label="Education"
            value={
              education.length
                ? `${education.length} ${
                    education.length === 1
                      ? "entry"
                      : "entries"
                  }`
                : "No entries"
            }
            onClick={
              onViewProfile
            }
          />


          <OverviewCard
            icon={FileText}
            label="Projects"
            value={
              projects.length
                ? `${projects.length} ${
                    projects.length === 1
                      ? "project"
                      : "projects"
                  }`
                : "No projects"
            }
            onClick={
              onViewProfile
            }
          />

        </section>


        {/* --------------------------------
            CAREER DIRECTION
        -------------------------------- */}

        <section
          className="
            mt-6
            grid
            gap-6
            lg:grid-cols-[1.1fr_0.9fr]
          "
        >

          <div
            className="
              border
              border-border
              bg-white
              shadow-cp-sm
            "
          >

            <div
              className="
                border-b
                border-border
                px-6
                py-5
              "
            >

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-slate-400
                "
              >
                Career direction
              </p>


              <h2
                className="
                  mt-1
                  text-lg
                  font-bold
                  text-text-primary
                "
              >
                What your resume tells us
              </h2>

            </div>


            <div
              className="
                p-6
              "
            >

              <p
                className="
                  text-sm
                  leading-7
                  text-text-secondary
                "
              >
                {profile?.summary ||
                  "No professional summary was extracted from your resume."}
              </p>


              {likelyRoles.length >
                0 && (
                <div
                  className="
                    mt-6
                  "
                >

                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-slate-400
                    "
                  >
                    Likely roles
                  </p>


                  <div
                    className="
                      mt-3
                      flex
                      flex-wrap
                      gap-2
                    "
                  >

                    {likelyRoles.map(
                      (item) => (
                        <span
                          key={
                            item
                          }
                          className="
                            border
                            border-primary-100
                            bg-primary-50
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-primary-700
                          "
                        >
                          {item}
                        </span>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>

          </div>


          {/* SKILLS */}

          <div
            className="
              border
              border-border
              bg-white
              shadow-cp-sm
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-border
                px-6
                py-5
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-slate-400
                  "
                >
                  Extracted skills
                </p>


                <h2
                  className="
                    mt-1
                    text-lg
                    font-bold
                    text-text-primary
                  "
                >
                  Your current toolkit
                </h2>

              </div>


              <button
                type="button"
                onClick={
                  onSkills
                }
                className="
                  text-xs
                  font-semibold
                  text-primary-600
                  hover:underline
                "
              >
                View all
              </button>

            </div>


            <div
              className="
                p-6
              "
            >

              {skills.length > 0 ? (
                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  {skills
                    .slice(0, 18)
                    .map(
                      (
                        skill
                      ) => (
                        <span
                          key={
                            skill
                          }
                          className="
                            bg-slate-100
                            px-2.5
                            py-1.5
                            text-xs
                            font-medium
                            text-slate-700
                          "
                        >
                          {skill}
                        </span>
                      )
                    )}

                </div>
              ) : (
                <EmptyStateText
                  text="No skills were extracted from your resume."
                />
              )}

            </div>

          </div>

        </section>


        {/* --------------------------------
            WORKSPACE AREAS
        -------------------------------- */}

        <section
          className="
            mt-6
            grid
            gap-4
            md:grid-cols-2
            lg:grid-cols-4
          "
        >

          <WorkspaceCard
            icon={
              BriefcaseBusiness
            }
            title="Opportunities"
            description="Career opportunities can be matched against your profile."
            onClick={
              onOpportunities
            }
          />


          <WorkspaceCard
            icon={Compass}
            title="Career Path"
            description="Explore career directions based on your current profile."
            onClick={
              onCareerPath
            }
          />


          <WorkspaceCard
            icon={Target}
            title="Skills"
            description="Review the skills CareerPilot extracted from your resume."
            onClick={
              onSkills
            }
          />


          <WorkspaceCard
            icon={FileText}
            title="Applications"
            description="Keep your real application activity organized."
            onClick={
              onApplications
            }
          />

        </section>


        {/* --------------------------------
            DATA PRINCIPLE
        -------------------------------- */}

        <div
          className="
            mt-6
            border
            border-border
            bg-white
            p-5
          "
        >

          <div
            className="
              flex
              gap-3
            "
          >

            <Sparkles
              size={18}
              className="
                mt-0.5
                shrink-0
                text-primary-600
              "
            />

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-text-primary
                "
              >
                Your workspace is driven by
                your profile.
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-text-secondary
                "
              >
                CareerPilot won't invent jobs,
                applications, skills or career
                results. Those areas will become
                useful as real data and AI
                intelligence are connected.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


/*
 * ======================================
 * SMALL COMPONENTS
 * ======================================
 */

const DemoStep = ({
  number,
  title,
  description,
}) => {
  return (
    <div
      className="
        flex
        gap-3
      "
    >

      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          bg-white
          text-xs
          font-bold
          text-primary-600
        "
      >
        {number}
      </div>


      <div>

        <p
          className="
            text-sm
            font-semibold
            text-text-primary
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-text-secondary
          "
        >
          {description}
        </p>

      </div>

    </div>
  );
};


const SetupStep = ({
  number,
  title,
  description,
}) => {
  return (
    <div
      className="
        border
        border-border
        bg-white
        p-5
      "
    >

      <p
        className="
          text-xs
          font-bold
          tracking-[0.12em]
          text-primary-600
        "
      >
        {number}
      </p>


      <h3
        className="
          mt-3
          text-sm
          font-semibold
          text-text-primary
        "
      >
        {title}
      </h3>


      <p
        className="
          mt-1
          text-xs
          leading-5
          text-text-secondary
        "
      >
        {description}
      </p>

    </div>
  );
};


const FeaturePreview = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div
      className="
        border
        border-border
        bg-white
        p-5
      "
    >

      <div
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          bg-slate-50
          text-slate-500
        "
      >
        <Icon
          size={17}
        />
      </div>


      <h3
        className="
          mt-4
          text-sm
          font-semibold
          text-text-primary
        "
      >
        {title}
      </h3>


      <p
        className="
          mt-1
          text-xs
          leading-5
          text-text-secondary
        "
      >
        {description}
      </p>

    </div>
  );
};


const OverviewCard = ({
  icon: Icon,
  label,
  value,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        border
        border-border
        bg-white
        p-5
        text-left
        shadow-cp-sm
        transition
        hover:border-slate-300
        hover:shadow-cp-md
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            bg-slate-50
            text-slate-500
          "
        >
          <Icon
            size={17}
          />
        </div>


        <ArrowRight
          size={15}
          className="
            text-slate-300
            transition
            group-hover:translate-x-0.5
            group-hover:text-primary-500
          "
        />

      </div>


      <p
        className="
          mt-5
          text-xs
          font-medium
          text-text-secondary
        "
      >
        {label}
      </p>


      <p
        className="
          mt-1
          text-base
          font-bold
          text-text-primary
        "
      >
        {value}
      </p>

    </button>
  );
};


const WorkspaceCard = ({
  icon: Icon,
  title,
  description,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        border
        border-border
        bg-white
        p-5
        text-left
        transition
        hover:border-slate-300
        hover:shadow-cp-sm
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            bg-primary-50
            text-primary-600
          "
        >
          <Icon
            size={17}
          />
        </div>


        <ArrowRight
          size={15}
          className="
            text-slate-300
            transition
            group-hover:translate-x-0.5
            group-hover:text-primary-500
          "
        />

      </div>


      <h3
        className="
          mt-4
          text-sm
          font-semibold
          text-text-primary
        "
      >
        {title}
      </h3>


      <p
        className="
          mt-1
          text-xs
          leading-5
          text-text-secondary
        "
      >
        {description}
      </p>

    </button>
  );
};


const ProfileTag = ({
  icon: Icon,
  text,
}) => {
  if (!text) {
    return null;
  }

  return (
    <div
      className="
        flex
        items-center
        gap-1.5
        border
        border-border
        bg-slate-50
        px-2.5
        py-1.5
        text-xs
        font-medium
        text-slate-600
      "
    >

      <Icon
        size={13}
        className="
          text-slate-400
        "
      />

      <span>
        {text}
      </span>

    </div>
  );
};


const EmptyStateText = ({
  text,
}) => {
  return (
    <p
      className="
        text-sm
        leading-6
        text-text-secondary
      "
    >
      {text}
    </p>
  );
};


/*
 * ======================================
 * DATA HELPERS
 * ======================================
 */

const normalizeProfile = (
  raw
) => {
  const personal =
    raw?.personal || {};

  const careerProfile =
    raw?.careerProfile || {};

  const education =
    Array.isArray(
      raw?.education
    )
      ? raw.education
      : [];


  const experience =
    Array.isArray(
      raw?.experience
    )
      ? raw.experience
      : [];


  const projects =
    Array.isArray(
      raw?.projects
    )
      ? raw.projects
      : [];


  return {
    ...raw,

    personal,

    careerProfile,

    education,

    experience,

    projects,

    skills:
      raw?.skills || {},

    certifications:
      Array.isArray(
        raw?.certifications
      )
        ? raw.certifications
        : [],

    achievements:
      Array.isArray(
        raw?.achievements
      )
        ? raw.achievements
        : [],
  };
};


const getAllSkills = (
  profile
) => {
  if (!profile?.skills) {
    return [];
  }


  if (
    Array.isArray(
      profile.skills
    )
  ) {
    return profile.skills.filter(
      (item) =>
        typeof item ===
        "string"
    );
  }


  if (
    typeof profile.skills ===
    "object"
  ) {
    return [
      ...new Set(
        Object.values(
          profile.skills
        )
          .flat()
          .filter(
            (item) =>
              typeof item ===
              "string" &&
              item.trim()
          )
      ),
    ];
  }


  return [];
};


const getUserName = (
  user
) => {
  if (!user) {
    return "there";
  }


  return (
    user.name ||
    user.fullName ||
    user.username ||
    user.email?.split("@")[0] ||
    "there"
  );
};


export default Dashboard;