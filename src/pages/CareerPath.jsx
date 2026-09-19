import React, { useMemo } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  GraduationCap,
  MapPin,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CareerPath = ({
  user,
  profile,
  isAuthenticated = false,
  hasProfile = false,
}) => {
  const navigate = useNavigate();

  const normalizedProfile = useMemo(() => {
    if (profile) {
      return normalizeProfile(profile);
    }

    try {
      const saved = localStorage.getItem(
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
   * GUEST
   * --------------------------------------
   */

  if (!isAuthenticated) {
    return (
      <GuestCareerPath
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
   * PROFILE REQUIRED
   * --------------------------------------
   */

  if (
    isAuthenticated &&
    !hasProfile
  ) {
    return (
      <ProfileRequired
        onUpload={() =>
          navigate("/personalize")
        }
      />
    );
  }


  /*
   * --------------------------------------
   * PROFILE READY
   * --------------------------------------
   */

  return (
    <ProfileCareerPath
      user={user}
      profile={normalizedProfile}
      onUpdateProfile={() =>
        navigate("/personalize")
      }
    />
  );
};


/*
 * ======================================
 * PROFILE CAREER PATH
 * ======================================
 */

const ProfileCareerPath = ({
  user,
  profile,
  onUpdateProfile,
}) => {
  const careerProfile =
    profile?.careerProfile || {};

  const personal =
    profile?.personal || {};

  const experience =
    Array.isArray(
      profile?.experience
    )
      ? profile.experience
      : [];

  const education =
    Array.isArray(
      profile?.education
    )
      ? profile.education
      : [];

  const projects =
    Array.isArray(
      profile?.projects
    )
      ? profile.projects
      : [];

  const likelyRoles =
    Array.isArray(
      careerProfile.likelyRoles
    )
      ? careerProfile.likelyRoles
      : [];

  const careerInterests =
    Array.isArray(
      careerProfile.careerInterests
    )
      ? careerProfile.careerInterests
      : [];

  const experienceLevel =
    careerProfile.experienceLevel ||
    "";

  const primaryDomain =
    careerProfile.primaryDomain ||
    "";

  const location =
    personal.location ||
    "";

  const currentRole =
    experience.length > 0
      ? experience[0]?.role ||
        ""
      : "";

  const currentCompany =
    experience.length > 0
      ? experience[0]?.company ||
        ""
      : "";


  return (
    <PageShell>

      {/* --------------------------------
          HEADER
      -------------------------------- */}

      <section
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
            flex-col
            gap-5
            px-6
            py-7
            sm:px-8
            lg:flex-row
            lg:items-end
            lg:justify-between
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
              Career Path
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
              Your career direction
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
              This view is based only on the
              information CareerPilot extracted
              from your resume.
            </p>

          </div>


          <button
            type="button"
            onClick={onUpdateProfile}
            className="
              flex
              h-10
              items-center
              justify-center
              gap-2
              border
              border-border
              px-4
              text-sm
              font-semibold
              text-text-primary
              hover:bg-slate-50
            "
          >
            Update profile

            <ArrowRight
              size={15}
            />
          </button>

        </div>

      </section>


      {/* --------------------------------
          CURRENT PROFILE
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

        <PathSignal
          icon={BriefcaseBusiness}
          label="Current role"
          value={
            currentRole ||
            "Not specified"
          }
        />


        <PathSignal
          icon={Target}
          label="Experience level"
          value={
            experienceLevel ||
            "Not specified"
          }
        />


        <PathSignal
          icon={Compass}
          label="Primary domain"
          value={
            primaryDomain ||
            "Not specified"
          }
        />


        <PathSignal
          icon={MapPin}
          label="Location"
          value={
            location ||
            "Not specified"
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
              Roles supported by your resume
            </h2>

          </div>


          <div
            className="
              p-6
            "
          >

            {likelyRoles.length > 0 ? (
              <div
                className="
                  space-y-3
                "
              >

                {likelyRoles.map(
                  (role, index) => (
                    <CareerRole
                      key={`${role}-${index}`}
                      role={role}
                    />
                  )
                )}

              </div>
            ) : (
              <EmptyText
                text="
                  No likely roles were extracted
                  from your resume.
                "
              />
            )}

          </div>

        </div>


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
              Career interests
            </p>


            <h2
              className="
                mt-1
                text-lg
                font-bold
                text-text-primary
              "
            >
              Areas identified
            </h2>

          </div>


          <div
            className="
              p-6
            "
          >

            {careerInterests.length >
            0 ? (
              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                "
              >

                {careerInterests.map(
                  (
                    interest,
                    index
                  ) => (
                    <span
                      key={`${interest}-${index}`}
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
                      {interest}
                    </span>
                  )
                )}

              </div>
            ) : (
              <EmptyText
                text="
                  No career interests were
                  explicitly identified in the
                  resume.
                "
              />
            )}

          </div>

        </div>

      </section>


      {/* --------------------------------
          EXPERIENCE TIMELINE
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
            border-b
            border-border
            px-6
            py-5
            sm:px-8
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
            Experience
          </p>


          <h2
            className="
              mt-1
              text-lg
              font-bold
              text-text-primary
            "
          >
            Your professional history
          </h2>

        </div>


        {experience.length > 0 ? (
          <div
            className="
              divide-y
              divide-border
            "
          >

            {experience.map(
              (item, index) => (
                <ExperienceItem
                  key={`${item.company || "experience"}-${index}`}
                  item={item}
                />
              )
            )}

          </div>
        ) : (
          <div
            className="
              p-6
            "
          >
            <EmptyText
              text="
                No professional experience
                entries were extracted from your
                resume.
              "
            />
          </div>
        )}

      </section>


      {/* --------------------------------
          EDUCATION + PROJECTS
      -------------------------------- */}

      <section
        className="
          mt-6
          grid
          gap-6
          lg:grid-cols-2
        "
      >

        <InformationSection
          icon={GraduationCap}
          eyebrow="Education"
          title="Academic background"
          items={
            education
          }
          emptyText="
            No education entries were extracted
            from your resume.
          "
          renderItem={(
            item,
            index
          ) => (
            <EducationItem
              key={`${item.institution || "education"}-${index}`}
              item={item}
            />
          )}
        />


        <InformationSection
          icon={BriefcaseBusiness}
          eyebrow="Projects"
          title="Practical work"
          items={
            projects
          }
          emptyText="
            No projects were extracted from your
            resume.
          "
          renderItem={(
            item,
            index
          ) => (
            <ProjectItem
              key={`${item.name || "project"}-${index}`}
              item={item}
            />
          )}
        />

      </section>


      {/* --------------------------------
          CURRENT AI STATUS
      -------------------------------- */}

      <section
        className="
          mt-6
          border
          border-blue-100
          bg-blue-50/60
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
              Career intelligence will build
              on this profile.
            </p>


            <p
              className="
                mt-1
                text-sm
                leading-6
                text-text-secondary
              "
            >
              The current page shows what your
              resume actually supports. Future
              CareerPilot intelligence can use
              this profile for skill-gap analysis,
              career recommendations and
              opportunity matching.
            </p>

          </div>

        </div>

      </section>


      {/* --------------------------------
          SOURCE NOTE
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
              No career path is being invented.
            </p>


            <p
              className="
                mt-1
                text-sm
                leading-6
                text-text-secondary
              "
            >
              Roles, experience, education and
              interests shown here come from the
              stored CareerPilot profile. Missing
              information remains missing instead
              of being replaced with sample data.
            </p>

          </div>

        </div>

      </div>

    </PageShell>
  );
};


/*
 * ======================================
 * GUEST
 * ======================================
 */

const GuestCareerPath = ({
  onSignup,
  onLogin,
}) => {
  return (
    <PageShell>

      <DemoBanner
        onSignup={onSignup}
      />


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
            mx-auto
            max-w-3xl
            px-6
            py-14
            text-center
            sm:px-10
            sm:py-16
          "
        >

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              bg-primary-50
              text-primary-600
            "
          >
            <Compass
              size={25}
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
            Career Path
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
            Understand where your
            career can go.
          </h1>


          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-7
              text-text-secondary
            "
          >
            CareerPilot starts with the
            experience and skills already in
            your resume and turns them into a
            structured career profile.
          </p>


          <div
            className="
              mt-8
              flex
              flex-col
              justify-center
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
                hover:bg-primary-700
              "
            >
              Create account

              <ArrowRight
                size={16}
              />
            </button>


            <button
              type="button"
              onClick={onLogin}
              className="
                h-11
                border
                border-border
                px-5
                text-sm
                font-semibold
                text-text-primary
                hover:bg-slate-50
              "
            >
              Sign in
            </button>

          </div>

        </div>

      </section>

    </PageShell>
  );
};


/*
 * ======================================
 * PROFILE REQUIRED
 * ======================================
 */

const ProfileRequired = ({
  onUpload,
}) => {
  return (
    <PageShell>

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
            mx-auto
            max-w-3xl
            px-6
            py-14
            text-center
            sm:px-10
            sm:py-16
          "
        >

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              bg-primary-50
              text-primary-600
            "
          >
            <Upload
              size={24}
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
            Profile required
          </p>


          <h1
            className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
              text-text-primary
            "
          >
            Upload your resume first.
          </h1>


          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-7
              text-text-secondary
            "
          >
            CareerPilot needs your resume-based
            career profile before it can build
            your career path.
          </p>


          <button
            type="button"
            onClick={onUpload}
            className="
              mt-8
              inline-flex
              h-11
              items-center
              gap-2
              bg-primary-600
              px-5
              text-sm
              font-semibold
              text-white
              hover:bg-primary-700
            "
          >
            Upload Resume

            <ArrowRight
              size={16}
            />
          </button>

        </div>

      </section>

    </PageShell>
  );
};


/*
 * ======================================
 * EXPERIENCE
 * ======================================
 */

const ExperienceItem = ({
  item,
}) => {
  const company =
    item?.company ||
    "Company not specified";

  const role =
    item?.role ||
    "Role not specified";

  const startDate =
    item?.startDate ||
    "";

  const endDate =
    item?.endDate ||
    "";

  const description =
    item?.description ||
    "";

  const technologies =
    Array.isArray(
      item?.technologies
    )
      ? item.technologies
      : [];


  return (
    <div
      className="
        p-6
        sm:p-7
      "
    >

      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:justify-between
        "
      >

        <div>

          <h3
            className="
              text-base
              font-bold
              text-text-primary
            "
          >
            {role}
          </h3>


          <p
            className="
              mt-1
              text-sm
              font-medium
              text-text-secondary
            "
          >
            {company}
          </p>

        </div>


        {(startDate ||
          endDate) && (
          <p
            className="
              text-xs
              font-medium
              text-slate-400
            "
          >
            {startDate || "Start not specified"}
            {" — "}
            {endDate || "Present"}
          </p>
        )}

      </div>


      {description && (
        <p
          className="
            mt-4
            max-w-4xl
            text-sm
            leading-6
            text-text-secondary
          "
        >
          {description}
        </p>
      )}


      {technologies.length >
        0 && (
        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-2
          "
        >

          {technologies.map(
            (
              technology,
              index
            ) => (
              <span
                key={`${technology}-${index}`}
                className="
                  bg-slate-100
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-slate-600
                "
              >
                {technology}
              </span>
            )
          )}

        </div>
      )}

    </div>
  );
};


/*
 * ======================================
 * EDUCATION
 * ======================================
 */

const EducationItem = ({
  item,
}) => {
  const degree =
    item?.degree ||
    "Degree not specified";

  const field =
    item?.field ||
    "";

  const institution =
    item?.institution ||
    "Institution not specified";

  const graduationYear =
    item?.graduationYear ||
    "";


  return (
    <div
      className="
        border
        border-border
        p-5
      "
    >

      <h3
        className="
          text-sm
          font-bold
          text-text-primary
        "
      >
        {degree}
      </h3>


      {field && (
        <p
          className="
            mt-1
            text-xs
            font-medium
            text-primary-600
          "
        >
          {field}
        </p>
      )}


      <p
        className="
          mt-3
          text-xs
          leading-5
          text-text-secondary
        "
      >
        {institution}
      </p>


      {graduationYear && (
        <p
          className="
            mt-2
            text-xs
            text-slate-400
          "
        >
          Graduation: {graduationYear}
        </p>
      )}

    </div>
  );
};


/*
 * ======================================
 * PROJECT
 * ======================================
 */

const ProjectItem = ({
  item,
}) => {
  const name =
    item?.name ||
    "Project";

  const description =
    item?.description ||
    "";

  const technologies =
    Array.isArray(
      item?.technologies
    )
      ? item.technologies
      : [];


  return (
    <div
      className="
        border
        border-border
        p-5
      "
    >

      <h3
        className="
          text-sm
          font-bold
          text-text-primary
        "
      >
        {name}
      </h3>


      {description && (
        <p
          className="
            mt-2
            text-xs
            leading-5
            text-text-secondary
          "
        >
          {description}
        </p>
      )}


      {technologies.length >
        0 && (
        <div
          className="
            mt-3
            flex
            flex-wrap
            gap-2
          "
        >

          {technologies.map(
            (
              technology,
              index
            ) => (
              <span
                key={`${technology}-${index}`}
                className="
                  bg-slate-100
                  px-2
                  py-1
                  text-[11px]
                  font-medium
                  text-slate-600
                "
              >
                {technology}
              </span>
            )
          )}

        </div>
      )}

    </div>
  );
};


/*
 * ======================================
 * CAREER ROLE
 * ======================================
 */

const CareerRole = ({
  role,
}) => {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        border
        border-border
        p-4
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
          bg-primary-50
          text-primary-600
        "
      >
        <Target
          size={15}
        />
      </div>


      <p
        className="
          text-sm
          font-semibold
          text-text-primary
        "
      >
        {role}
      </p>

    </div>
  );
};


/*
 * ======================================
 * INFORMATION SECTION
 * ======================================
 */

const InformationSection = ({
  icon: Icon,
  eyebrow,
  title,
  items,
  emptyText,
  renderItem,
}) => {
  return (
    <section
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
          gap-3
          border-b
          border-border
          px-6
          py-5
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
            {eyebrow}
          </p>


          <h2
            className="
              mt-1
              text-lg
              font-bold
              text-text-primary
            "
          >
            {title}
          </h2>

        </div>

      </div>


      <div
        className="
          space-y-3
          p-6
        "
      >

        {items.length > 0
          ? items.map(
              renderItem
            )
          : (
            <EmptyText
              text={emptyText}
            />
          )}

      </div>

    </section>
  );
};


/*
 * ======================================
 * SIGNAL
 * ======================================
 */

const PathSignal = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div
      className="
        border
        border-border
        bg-white
        p-5
        shadow-cp-sm
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


      <p
        className="
          mt-4
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
          line-clamp-2
          text-sm
          font-semibold
          leading-5
          text-text-primary
        "
      >
        {value}
      </p>

    </div>
  );
};


/*
 * ======================================
 * EMPTY TEXT
 * ======================================
 */

const EmptyText = ({
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
 * PAGE SHELL
 * ======================================
 */

const PageShell = ({
  children,
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
        {children}
      </div>

    </div>
  );
};


/*
 * ======================================
 * DEMO BANNER
 * ======================================
 */

const DemoBanner = ({
  onSignup,
}) => {
  return (
    <div
      className="
        border
        border-blue-100
        bg-blue-50/60
        px-5
        py-3
      "
    >

      <div
        className="
          flex
          flex-col
          gap-2
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <p
          className="
            text-sm
            font-medium
            text-primary-800
          "
        >
          You're exploring CareerPilot
          in demo mode.
        </p>


        <button
          type="button"
          onClick={onSignup}
          className="
            text-left
            text-xs
            font-semibold
            text-primary-700
            hover:underline
            sm:text-right
          "
        >
          Create an account →
        </button>

      </div>

    </div>
  );
};


/*
 * ======================================
 * PROFILE NORMALIZATION
 * ======================================
 */

const normalizeProfile = (
  raw
) => {
  return {
    ...raw,

    personal:
      raw?.personal || {},

    careerProfile:
      raw?.careerProfile || {},

    skills:
      raw?.skills || {},

    experience:
      Array.isArray(
        raw?.experience
      )
        ? raw.experience
        : [],

    education:
      Array.isArray(
        raw?.education
      )
        ? raw.education
        : [],

    projects:
      Array.isArray(
        raw?.projects
      )
        ? raw.projects
        : [],
  };
};


export default CareerPath;