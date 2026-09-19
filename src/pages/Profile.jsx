import React, { useMemo } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  FileBadge,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Target,
  Upload,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = ({
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
      <GuestProfile
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
    <ProfileReady
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
 * PROFILE READY
 * ======================================
 */

const ProfileReady = ({
  user,
  profile,
  onUpdateProfile,
}) => {
  const personal =
    profile?.personal || {};

  const careerProfile =
    profile?.careerProfile || {};

  const education =
    Array.isArray(
      profile?.education
    )
      ? profile.education
      : [];

  const experience =
    Array.isArray(
      profile?.experience
    )
      ? profile.experience
      : [];

  const projects =
    Array.isArray(
      profile?.projects
    )
      ? profile.projects
      : [];

  const certifications =
    Array.isArray(
      profile?.certifications
    )
      ? profile.certifications
      : [];

  const achievements =
    Array.isArray(
      profile?.achievements
    )
      ? profile.achievements
      : [];

  const likelyRoles =
    Array.isArray(
      careerProfile.likelyRoles
    )
      ? careerProfile.likelyRoles
      : [];

  const skills =
    getAllSkills(
      profile?.skills
    );

  const displayName =
    personal.name ||
    user?.name ||
    "Career Profile";

  const email =
    personal.email ||
    user?.email ||
    "";

  const phone =
    personal.phone ||
    "";

  const location =
    personal.location ||
    "";

  const experienceLevel =
    careerProfile.experienceLevel ||
    "";

  const primaryDomain =
    careerProfile.primaryDomain ||
    "";


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
              Profile
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
              Your CareerPilot profile
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
              This profile contains the
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
              bg-primary-600
              px-4
              text-sm
              font-semibold
              text-white
              hover:bg-primary-700
            "
          >
            Update Resume

            <ArrowRight
              size={15}
            />
          </button>

        </div>

      </section>


      {/* --------------------------------
          IDENTITY
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
            flex
            flex-col
            gap-6
            p-6
            sm:p-8
            lg:flex-row
            lg:items-start
          "
        >

          <div
            className="
              flex
              h-20
              w-20
              shrink-0
              items-center
              justify-center
              bg-primary-50
              text-primary-600
            "
          >
            <UserRound
              size={32}
            />
          </div>


          <div
            className="
              min-w-0
              flex-1
            "
          >

            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >

              <div>

                <h2
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-text-primary
                  "
                >
                  {displayName}
                </h2>


                {primaryDomain && (
                  <p
                    className="
                      mt-1
                      text-sm
                      font-medium
                      text-primary-600
                    "
                  >
                    {primaryDomain}
                  </p>
                )}

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  text-emerald-700
                "
              >

                <CheckCircle2
                  size={15}
                />

                Profile Ready

              </div>

            </div>


            <div
              className="
                mt-5
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >

              <ContactItem
                icon={Mail}
                value={email}
              />

              <ContactItem
                icon={Phone}
                value={phone}
              />

              <ContactItem
                icon={MapPin}
                value={location}
              />

            </div>

          </div>

        </div>

      </section>


      {/* --------------------------------
          CAREER SUMMARY
      -------------------------------- */}

      <section
        className="
          mt-6
          grid
          gap-6
          lg:grid-cols-[1.15fr_0.85fr]
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

          <SectionHeader
            icon={FileText}
            eyebrow="Professional summary"
            title="About your profile"
          />


          <div
            className="
              p-6
            "
          >

            {profile?.summary ? (
              <p
                className="
                  text-sm
                  leading-7
                  text-text-secondary
                "
              >
                {profile.summary}
              </p>
            ) : (
              <EmptyText
                text="
                  No professional summary was
                  extracted from your resume.
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

          <SectionHeader
            icon={Target}
            eyebrow="Career direction"
            title="Profile signals"
          />


          <div
            className="
              space-y-4
              p-6
            "
          >

            <ProfileSignal
              label="Experience level"
              value={
                experienceLevel ||
                "Not specified"
              }
            />

            <ProfileSignal
              label="Primary domain"
              value={
                primaryDomain ||
                "Not specified"
              }
            />

            <ProfileSignal
              label="Location"
              value={
                location ||
                "Not specified"
              }
            />

          </div>

        </div>

      </section>


      {/* --------------------------------
          LIKELY ROLES
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

        <SectionHeader
          icon={BriefcaseBusiness}
          eyebrow="Career direction"
          title="Likely roles"
        />


        <div
          className="
            p-6
          "
        >

          {likelyRoles.length >
          0 ? (
            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >

              {likelyRoles.map(
                (
                  role,
                  index
                ) => (
                  <span
                    key={`${role}-${index}`}
                    className="
                      border
                      border-primary-100
                      bg-primary-50
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      text-primary-700
                    "
                  >
                    {role}
                  </span>
                )
              )}

            </div>
          ) : (
            <EmptyText
              text="
                No likely roles were extracted from
                your resume.
              "
            />
          )}

        </div>

      </section>


      {/* --------------------------------
          SKILLS
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

        <SectionHeader
          icon={Code2}
          eyebrow="Skills"
          title="Technical and professional skills"
        />


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

              {skills.map(
                (skill) => (
                  <span
                    key={skill}
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
                )
              )}

            </div>
          ) : (
            <EmptyText
              text="
                No skills were extracted from your
                resume.
              "
            />
          )}

        </div>

      </section>


      {/* --------------------------------
          EXPERIENCE
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

        <SectionHeader
          icon={BriefcaseBusiness}
          eyebrow="Experience"
          title="Professional history"
        />


        {experience.length >
        0 ? (
          <div
            className="
              divide-y
              divide-border
            "
          >

            {experience.map(
              (
                item,
                index
              ) => (
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
                No experience entries were extracted
                from your resume.
              "
            />
          </div>
        )}

      </section>


      {/* --------------------------------
          EDUCATION
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

        <SectionHeader
          icon={GraduationCap}
          eyebrow="Education"
          title="Academic background"
        />


        {education.length >
        0 ? (
          <div
            className="
              grid
              gap-4
              p-6
              md:grid-cols-2
            "
          >

            {education.map(
              (
                item,
                index
              ) => (
                <EducationItem
                  key={`${item.institution || "education"}-${index}`}
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
                No education entries were extracted
                from your resume.
              "
            />
          </div>
        )}

      </section>


      {/* --------------------------------
          PROJECTS
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

        <SectionHeader
          icon={BriefcaseBusiness}
          eyebrow="Projects"
          title="Projects from your resume"
        />


        {projects.length >
        0 ? (
          <div
            className="
              grid
              gap-4
              p-6
              md:grid-cols-2
            "
          >

            {projects.map(
              (
                project,
                index
              ) => (
                <ProjectItem
                  key={`${project.name || "project"}-${index}`}
                  item={project}
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
                No projects were extracted from your
                resume.
              "
            />
          </div>
        )}

      </section>


      {/* --------------------------------
          CERTIFICATIONS / ACHIEVEMENTS
      -------------------------------- */}

      <section
        className="
          mt-6
          grid
          gap-6
          lg:grid-cols-2
        "
      >

        <InformationList
          icon={FileBadge}
          eyebrow="Certifications"
          title="Certifications"
          items={certifications}
          emptyText="
            No certifications were extracted from
            your resume.
          "
        />


        <InformationList
          icon={CheckCircle2}
          eyebrow="Achievements"
          title="Achievements"
          items={achievements}
          emptyText="
            No achievements were extracted from
            your resume.
          "
        />

      </section>


      {/* --------------------------------
          PROFILE DATA NOTICE
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
              Your profile is generated from
              your resume.
            </p>


            <p
              className="
                mt-1
                text-sm
                leading-6
                text-text-secondary
              "
            >
              If something is missing or
              incorrect, upload an updated resume
              and let the AI analysis run again.
              CareerPilot does not fill missing
              information with invented data.
            </p>

          </div>

        </div>

      </section>

    </PageShell>
  );
};


/*
 * ======================================
 * EXPERIENCE ITEM
 * ======================================
 */

const ExperienceItem = ({
  item,
}) => {
  const role =
    item?.role ||
    "Role not specified";

  const company =
    item?.company ||
    "Company not specified";

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
    <article
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
          sm:items-start
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
              text-primary-600
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
            {startDate ||
              "Start not specified"}
            {" — "}
            {endDate ||
              "Present"}
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

    </article>
  );
};


/*
 * ======================================
 * EDUCATION ITEM
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
    <article
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
          Graduation:{" "}
          {graduationYear}
        </p>
      )}

    </article>
  );
};


/*
 * ======================================
 * PROJECT ITEM
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
    <article
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

    </article>
  );
};


/*
 * ======================================
 * INFORMATION LIST
 * ======================================
 */

const InformationList = ({
  icon: Icon,
  eyebrow,
  title,
  items,
  emptyText,
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

      <SectionHeader
        icon={Icon}
        eyebrow={eyebrow}
        title={title}
      />


      {items.length > 0 ? (
        <div
          className="
            divide-y
            divide-border
          "
        >

          {items.map(
            (item, index) => (
              <div
                key={`${String(item)}-${index}`}
                className="
                  px-6
                  py-4
                "
              >

                <p
                  className="
                    text-sm
                    leading-6
                    text-text-secondary
                  "
                >
                  {formatListItem(
                    item
                  )}
                </p>

              </div>
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
            text={emptyText}
          />
        </div>
      )}

    </section>
  );
};


/*
 * ======================================
 * SECTION HEADER
 * ======================================
 */

const SectionHeader = ({
  icon: Icon,
  eyebrow,
  title,
}) => {
  return (
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
  );
};


/*
 * ======================================
 * CONTACT ITEM
 * ======================================
 */

const ContactItem = ({
  icon: Icon,
  value,
}) => {
  if (!value) {
    return (
      <div
        className="
          flex
          items-center
          gap-2
          text-xs
          text-slate-400
        "
      >

        <Icon
          size={14}
        />

        Not specified

      </div>
    );
  }


  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-2
        text-xs
        text-text-secondary
      "
    >

      <Icon
        size={14}
        className="
          shrink-0
          text-slate-400
        "
      />

      <span
        className="
          truncate
        "
      >
        {value}
      </span>

    </div>
  );
};


/*
 * ======================================
 * PROFILE SIGNAL
 * ======================================
 */

const ProfileSignal = ({
  label,
  value,
}) => {
  return (
    <div>

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
          mt-1
          text-sm
          font-semibold
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
 * GUEST
 * ======================================
 */

const GuestProfile = ({
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
            <UserRound
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
            Profile
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
            Your career profile,
            built from your resume.
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
            Upload your resume and CareerPilot
            will turn the information already in
            it into your structured career profile.
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
            Your CareerPilot profile will be
            created automatically after your
            resume is analyzed.
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
 * SHARED
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
 * DATA HELPERS
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
  skills
) => {
  if (!skills) {
    return [];
  }

  if (
    Array.isArray(
      skills
    )
  ) {
    return [
      ...new Set(
        skills.filter(
          (item) =>
            typeof item ===
              "string" &&
            item.trim()
        )
      ),
    ];
  }

  if (
    typeof skills ===
    "object"
  ) {
    return [
      ...new Set(
        Object.values(
          skills
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


const formatListItem = (
  item
) => {
  if (
    typeof item ===
    "string"
  ) {
    return item;
  }

  if (
    item &&
    typeof item ===
      "object"
  ) {
    return (
      item.name ||
      item.title ||
      item.description ||
      item.issuer ||
      JSON.stringify(
        item
      )
    );
  }

  return String(item);
};


export default Profile;