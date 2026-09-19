import React, { useMemo } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  ExternalLink,
  FileText,
  Layers3,
  Sparkles,
  Terminal,
  Upload,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SKILL_GROUPS = [
  {
    key: "programming",
    label: "Programming",
    icon: Code2,
  },
  {
    key: "frontend",
    label: "Frontend",
    icon: Layers3,
  },
  {
    key: "backend",
    label: "Backend",
    icon: Terminal,
  },
  {
    key: "databases",
    label: "Databases",
    icon: Database,
  },
  {
    key: "tools",
    label: "Tools",
    icon: Wrench,
  },
  {
    key: "other",
    label: "Other",
    icon: FileText,
  },
];

const Skills = ({
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
      <GuestSkills
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
    <ProfileSkills
      profile={normalizedProfile}
      onUpdateProfile={() =>
        navigate("/personalize")
      }
    />
  );
};


/*
 * ======================================
 * PROFILE SKILLS
 * ======================================
 */

const ProfileSkills = ({
  profile,
  onUpdateProfile,
}) => {
  const skills =
    profile?.skills || {};

  const groupedSkills =
    useMemo(
      () =>
        buildSkillGroups(
          skills
        ),
      [skills]
    );

  const allSkills =
    useMemo(
      () =>
        getAllSkills(
          skills
        ),
      [skills]
    );


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
              Skills
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
              Your extracted skill set
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
              These are the skills CareerPilot
              found in your resume. No skill
              level or proficiency score is
              invented.
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
            Update resume

            <ArrowRight
              size={15}
            />
          </button>

        </div>

      </section>


      {/* --------------------------------
          OVERVIEW
      -------------------------------- */}

      <section
        className="
          mt-6
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >

        <SkillSummaryCard
          label="Total skills"
          value={
            allSkills.length
          }
          description="
            Unique skills extracted from your resume.
          "
        />


        <SkillSummaryCard
          label="Skill groups"
          value={
            groupedSkills.filter(
              (group) =>
                group.skills.length >
                0
            ).length
          }
          description="
            Categories containing extracted skills.
          "
        />


        <SkillSummaryCard
          label="Source"
          value="Resume"
          description="
            Skills shown here come from your CareerPilot profile.
          "
        />

      </section>


      {/* --------------------------------
          SKILL GROUPS
      -------------------------------- */}

      <section
        className="
          mt-6
          grid
          gap-4
          md:grid-cols-2
        "
      >

        {groupedSkills.map(
          (group) => (
            <SkillGroup
              key={
                group.key
              }
              group={group}
            />
          )
        )}

      </section>


      {/* --------------------------------
          EMPTY STATE
      -------------------------------- */}

      {allSkills.length ===
        0 && (
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
              max-w-2xl
              px-6
              py-12
              text-center
              sm:px-10
              sm:py-14
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
                bg-slate-50
                text-slate-500
              "
            >
              <Code2
                size={24}
              />
            </div>


            <h2
              className="
                mt-6
                text-2xl
                font-bold
                tracking-tight
                text-text-primary
              "
            >
              No skills were extracted.
            </h2>


            <p
              className="
                mt-3
                text-sm
                leading-7
                text-text-secondary
              "
            >
              CareerPilot did not find structured
              skills in the current resume profile.
              You can upload an updated resume if
              the information was missing.
            </p>


            <button
              type="button"
              onClick={onUpdateProfile}
              className="
                mt-7
                inline-flex
                h-10
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
              Update Resume

              <ArrowRight
                size={16}
              />
            </button>

          </div>

        </section>
      )}


      {/* --------------------------------
          FUTURE AI INTELLIGENCE
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
              Skill intelligence comes next.
            </p>


            <p
              className="
                mt-1
                text-sm
                leading-6
                text-text-secondary
              "
            >
              Once the core profile is working,
              CareerPilot can compare these
              extracted skills with target roles
              and identify genuine skill gaps.
            </p>

          </div>

        </div>

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
              No fake proficiency scores.
            </p>


            <p
              className="
                mt-1
                text-sm
                leading-6
                text-text-secondary
              "
            >
              CareerPilot currently shows only
              the skills actually extracted from
              your resume. It does not claim that
              you are beginner, intermediate or
              expert unless that information is
              explicitly supported by the profile.
            </p>

          </div>

        </div>

      </div>

    </PageShell>
  );
};


/*
 * ======================================
 * SKILL GROUP
 * ======================================
 */

const SkillGroup = ({
  group,
}) => {
  const Icon =
    group.icon;

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
          justify-between
          border-b
          border-border
          px-5
          py-4
          sm:px-6
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
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
                text-sm
                font-semibold
                text-text-primary
              "
            >
              {group.label}
            </p>


            <p
              className="
                mt-0.5
                text-xs
                text-text-secondary
              "
            >
              {group.skills.length}{" "}
              {group.skills.length ===
              1
                ? "skill"
                : "skills"}
            </p>

          </div>

        </div>

      </div>


      <div
        className="
          p-5
          sm:p-6
        "
      >

        {group.skills.length >
        0 ? (
          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >

            {group.skills.map(
              (
                skill
              ) => (
                <SkillChip
                  key={
                    skill
                  }
                  skill={
                    skill
                  }
                />
              )
            )}

          </div>
        ) : (
          <p
            className="
              text-sm
              text-text-secondary
            "
          >
            No skills extracted in this
            category.
          </p>
        )}

      </div>

    </section>
  );
};


/*
 * ======================================
 * SKILL CHIP
 * ======================================
 */

const SkillChip = ({
  skill,
}) => {
  return (
    <span
      className="
        border
        border-slate-200
        bg-slate-50
        px-3
        py-1.5
        text-xs
        font-medium
        text-slate-700
      "
    >
      {skill}
    </span>
  );
};


/*
 * ======================================
 * SUMMARY CARD
 * ======================================
 */

const SkillSummaryCard = ({
  label,
  value,
  description,
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

      <p
        className="
          text-xs
          font-medium
          text-text-secondary
        "
      >
        {label}
      </p>


      <p
        className="
          mt-2
          text-2xl
          font-bold
          tracking-tight
          text-text-primary
        "
      >
        {value}
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
  );
};


/*
 * ======================================
 * GUEST
 * ======================================
 */

const GuestSkills = ({
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
            <Code2
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
            Skills
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
            See what your resume
            actually tells us.
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
            CareerPilot extracts your technical
            and professional skills from your
            resume and organizes them into a
            usable career profile.
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
            profile before it can show the skills
            it has extracted.
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
 * SHARED UI
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
 * SKILL DATA
 * ======================================
 */

const buildSkillGroups = (
  skills
) => {
  return SKILL_GROUPS.map(
    (group) => ({
      ...group,
      skills:
        normalizeSkillArray(
          skills?.[
            group.key
          ]
        ),
    })
  );
};


const getAllSkills = (
  skills
) => {
  if (!skills) {
    return [];
  }

  const values =
    Object.values(
      skills
    ).flat();

  return [
    ...new Set(
      values.filter(
        (item) =>
          typeof item ===
            "string" &&
          item.trim()
      )
    ),
  ];
};


const normalizeSkillArray = (
  value
) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value.filter(
        (item) =>
          typeof item ===
            "string" &&
          item.trim()
      )
    ),
  ];
};


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


export default Skills;