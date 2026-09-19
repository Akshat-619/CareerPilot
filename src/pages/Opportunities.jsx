import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const AI_API_URL = "http://localhost:5000/api";

const Opportunities = ({
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
      const saved = localStorage.getItem("careerpilotProfile");

      if (saved) {
        return normalizeProfile(JSON.parse(saved));
      }

      const oldSaved = localStorage.getItem(
        "careerpilotPersonalization"
      );

      if (oldSaved) {
        return normalizeProfile(JSON.parse(oldSaved));
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
      <GuestOpportunities
        onSignup={() =>
          window.dispatchEvent(
            new CustomEvent("careerpilot:open-signup")
          )
        }
        onLogin={() =>
          window.dispatchEvent(
            new CustomEvent("careerpilot:open-login")
          )
        }
      />
    );
  }

  /*
   * --------------------------------------
   * LOGGED IN / NO PROFILE
   * --------------------------------------
   */

  if (isAuthenticated && !hasProfile) {
    return (
      <ProfileRequired
        onUpload={() => navigate("/personalize")}
      />
    );
  }

  /*
   * --------------------------------------
   * PROFILE READY
   * --------------------------------------
   */

  return (
    <ProfileReadyOpportunities
      profile={normalizedProfile}
      onUpdateProfile={() => navigate("/personalize")}
    />
  );
};

/*
 * ======================================
 * GUEST OPPORTUNITIES
 * ======================================
 */

const GuestOpportunities = ({
  onSignup,
  onLogin,
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
            <BriefcaseBusiness size={25} />
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
            Opportunities
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
            Find opportunities
            <br />
            relevant to you.
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
            Upload your resume and CareerPilot will
            use your career profile to discover
            relevant opportunities.
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

              <ArrowRight size={16} />
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

const ProfileRequired = ({ onUpload }) => {
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
            <Upload size={24} />
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
            Complete your profile
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
            CareerPilot needs your career profile
            before it can personalize opportunities
            for you.
          </p>

          <button
            type="button"
            onClick={onUpload}
            className="
              mt-8
              inline-flex
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
            Upload Resume

            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </PageShell>
  );
};

/*
 * ======================================
 * PROFILE READY
 * ======================================
 */

const ProfileReadyOpportunities = ({
  profile,
  onUpdateProfile,
}) => {
  const [jobs, setJobs] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const roles =
    profile?.careerProfile?.likelyRoles || [];

  const location =
    profile?.personal?.location || "";

  const skills = getAllSkills(profile?.skills);

  const fetchJobs = async () => {
    if (!profile) {
      setJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${AI_API_URL}/jobs/from-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The CareerPilot AI server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load opportunities."
        );
      }

      setJobs(
        Array.isArray(data?.jobs)
          ? data.jobs
          : []
      );

      setQueries(
        Array.isArray(data?.queries)
          ? data.queries
          : []
      );
    } catch (err) {
      console.error(
        "CareerPilot opportunities error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load opportunities right now."
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [profile]);

  return (
    <PageShell>
      {/* --------------------------------
          HEADER
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
        <div className="px-6 py-7 sm:px-8">
          <div
            className="
              flex
              flex-col
              gap-5
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
                Opportunities
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
                Your opportunity workspace
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
                CareerPilot uses your AI-generated
                career profile to discover relevant
                opportunities from Jobicy.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={fetchJobs}
                disabled={loading}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <RefreshCw
                  size={15}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>

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

                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------
          PROFILE SIGNALS
      -------------------------------- */}

      <section
        className="
          mt-6
          grid
          gap-4
          md:grid-cols-3
        "
      >
        <SignalCard
          icon={BriefcaseBusiness}
          label="Career direction"
          value={
            roles.length
              ? roles.join(", ")
              : "Not specified"
          }
        />

        <SignalCard
          icon={MapPin}
          label="Location"
          value={
            location || "Not specified"
          }
        />

        <SignalCard
          icon={CheckCircle2}
          label="Profile skills"
          value={
            skills.length
              ? `${skills.length} extracted`
              : "No skills extracted"
          }
        />
      </section>

      {/* --------------------------------
          SEARCH SIGNALS
      -------------------------------- */}

      {queries.length > 0 && (
        <section
          className="
            mt-6
            border
            border-border
            bg-white
            p-5
            shadow-cp-sm
          "
        >
          <div className="flex gap-3">
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
                CareerPilot search signals
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-text-secondary
                "
              >
                Opportunities are being discovered
                using your career profile.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {queries.map((query) => (
                  <span
                    key={query}
                    className="
                      border
                      border-slate-200
                      bg-slate-50
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      text-slate-700
                    "
                  >
                    {query}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --------------------------------
          LOADING
      -------------------------------- */}

      {loading && (
        <section
          className="
            mt-6
            border
            border-border
            bg-white
            shadow-cp-sm
          "
        >
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <LoaderCircle
              size={28}
              className="
                animate-spin
                text-primary-600
              "
            />

            <h2
              className="
                mt-5
                text-lg
                font-semibold
                text-text-primary
              "
            >
              Finding relevant opportunities
            </h2>

            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-text-secondary
              "
            >
              CareerPilot is searching current
              Jobicy opportunities using your
              career profile.
            </p>
          </div>
        </section>
      )}

      {/* --------------------------------
          ERROR
      -------------------------------- */}

      {!loading && error && (
        <section
          className="
            mt-6
            border
            border-red-200
            bg-red-50
            p-5
          "
        >
          <div className="flex gap-3">
            <Search
              size={18}
              className="
                mt-0.5
                shrink-0
                text-red-600
              "
            />

            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-red-800
                "
              >
                Unable to load opportunities
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-red-700
                "
              >
                {error}
              </p>

              <button
                type="button"
                onClick={fetchJobs}
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-red-800
                  underline
                  hover:no-underline
                "
              >
                Try again
              </button>
            </div>
          </div>
        </section>
      )}

      {/* --------------------------------
          JOB RESULTS
      -------------------------------- */}

      {!loading && !error && jobs.length > 0 && (
        <section className="mt-6">
          <div
            className="
              mb-4
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h2
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-text-primary
                "
              >
                Opportunities
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-text-secondary
                "
              >
                {jobs.length} opportunities found
              </p>
            </div>

            <span
              className="
                border
                border-slate-200
                bg-white
                px-3
                py-1.5
                text-xs
                font-medium
                text-slate-600
              "
            >
              Source: Jobicy
            </span>
          </div>

          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard
                key={
                  job.id ||
                  job.url ||
                  `${job.company}-${job.title}`
                }
                job={job}
              />
            ))}
          </div>
        </section>
      )}

      {/* --------------------------------
          NO RESULTS
      -------------------------------- */}

      {!loading &&
        !error &&
        jobs.length === 0 && (
          <section
            className="
              mt-6
              border
              border-border
              bg-white
              shadow-cp-sm
            "
          >
            <div className="px-6 py-14 text-center sm:px-10">
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
                <Search size={24} />
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
                No opportunities found
              </h2>

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-xl
                  text-sm
                  leading-7
                  text-text-secondary
                "
              >
                CareerPilot couldn't find current
                opportunities matching the signals
                extracted from your profile.
              </p>

              <button
                type="button"
                onClick={onUpdateProfile}
                className="
                  mt-6
                  inline-flex
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
                <ArrowRight size={15} />
              </button>
            </div>
          </section>
        )}
    </PageShell>
  );
};

/*
 * ======================================
 * JOB CARD
 * ======================================
 */

const JobCard = ({ job }) => {
  const description = stripHtml(
    job.description || ""
  );

  return (
    <article
      className="
        border
        border-border
        bg-white
        p-5
        shadow-cp-sm
        transition
        hover:border-primary-200
        hover:shadow-md
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >
        <div className="min-w-0 flex-1">
          <div
            className="
              flex
              flex-col
              gap-1
            "
          >
            <h3
              className="
                text-lg
                font-bold
                leading-6
                text-text-primary
              "
            >
              {job.title || "Untitled position"}
            </h3>

            <p
              className="
                text-sm
                font-medium
                text-primary-700
              "
            >
              {job.company || "Company not specified"}
            </p>
          </div>

          <div
            className="
              mt-4
              flex
              flex-wrap
              gap-x-4
              gap-y-2
              text-xs
              text-text-secondary
            "
          >
            {job.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {job.location}
              </span>
            )}

            {job.jobType && (
              <span>{job.jobType}</span>
            )}

            {job.jobLevel && (
              <span>{job.jobLevel}</span>
            )}

            {job.industry && (
              <span>{job.industry}</span>
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
              {truncateText(description, 360)}
            </p>
          )}
        </div>

        <div
          className="
            flex
            shrink-0
            flex-col
            gap-2
            sm:flex-row
            lg:flex-col
          "
        >
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
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
              View opportunity
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>

      <div
        className="
          mt-5
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          border-t
          border-slate-100
          pt-4
        "
      >
        <span
          className="
            text-xs
            text-text-secondary
          "
        >
          Source: {job.sourceCredit || "Jobicy"}
        </span>

        {job.publishedAt && (
          <span
            className="
              text-xs
              text-text-secondary
            "
          >
            Published{" "}
            {formatPublishedDate(
              job.publishedAt
            )}
          </span>
        )}
      </div>
    </article>
  );
};

/*
 * ======================================
 * SMALL COMPONENTS
 * ======================================
 */

const PageShell = ({ children }) => {
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

const SignalCard = ({
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
        <Icon size={17} />
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
 * HELPERS
 * ======================================
 */

const normalizeProfile = (raw) => {
  return {
    ...raw,

    personal:
      raw?.personal || {},

    careerProfile:
      raw?.careerProfile || {},

    skills:
      raw?.skills || {},

    experience:
      Array.isArray(raw?.experience)
        ? raw.experience
        : [],

    education:
      Array.isArray(raw?.education)
        ? raw.education
        : [],

    projects:
      Array.isArray(raw?.projects)
        ? raw.projects
        : [],
  };
};

const getAllSkills = (skills) => {
  if (!skills) {
    return [];
  }

  if (Array.isArray(skills)) {
    return [
      ...new Set(
        skills.filter(
          (item) =>
            typeof item === "string" &&
            item.trim()
        )
      ),
    ];
  }

  if (typeof skills === "object") {
    return [
      ...new Set(
        Object.values(skills)
          .flat()
          .filter(
            (item) =>
              typeof item === "string" &&
              item.trim()
          )
      ),
    ];
  }

  return [];
};

const stripHtml = (html) => {
  if (!html) {
    return "";
  }

  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
};

const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
};

const formatPublishedDate = (date) => {
  try {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  } catch {
    return date;
  }
};

export default Opportunities;