import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const APPLICATIONS_KEY = "careerpilotApplications";

const APPLICATION_STATUSES = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

const Applications = ({
  user,
  profile,
  isAuthenticated = false,
  hasProfile = false,
}) => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState(() =>
    readApplications()
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [newApplication, setNewApplication] =
    useState(createEmptyApplication());

  /*
   * --------------------------------------
   * KEEP STATE IN SYNC
   * --------------------------------------
   */

  useEffect(() => {
    const handleStorage = () => {
      setApplications(readApplications());
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);


  /*
   * --------------------------------------
   * GUEST
   * --------------------------------------
   */

  if (!isAuthenticated) {
    return (
      <GuestApplications
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
   * LOGGED IN / NO PROFILE
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
   * FILTER APPLICATIONS
   * --------------------------------------
   */

  const filteredApplications =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      return applications.filter(
        (application) => {
          const matchesSearch =
            !query ||
            [
              application.company,
              application.role,
              application.location,
              application.status,
            ]
              .filter(Boolean)
              .some((value) =>
                String(value)
                  .toLowerCase()
                  .includes(query)
              );

          const matchesStatus =
            statusFilter === "All" ||
            application.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      applications,
      searchQuery,
      statusFilter,
    ]);


  /*
   * --------------------------------------
   * ADD APPLICATION
   * --------------------------------------
   */

  const handleAddApplication = (
    event
  ) => {
    event.preventDefault();

    const company =
      newApplication.company.trim();

    const role =
      newApplication.role.trim();

    if (!company || !role) {
      return;
    }

    const application = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
      company,
      role,
      location:
        newApplication.location.trim(),
      status:
        newApplication.status ||
        "Applied",
      appliedDate:
        newApplication.appliedDate,
      jobUrl:
        newApplication.jobUrl.trim(),
      notes:
        newApplication.notes.trim(),
      createdAt:
        new Date().toISOString(),
    };

    const updated = [
      application,
      ...applications,
    ];

    saveApplications(updated);
    setApplications(updated);
    setNewApplication(
      createEmptyApplication()
    );
    setShowAddForm(false);
  };


  /*
   * --------------------------------------
   * DELETE APPLICATION
   * --------------------------------------
   */

  const handleDelete = (
    applicationId
  ) => {
    const confirmed =
      window.confirm(
        "Remove this application from CareerPilot?"
      );

    if (!confirmed) {
      return;
    }

    const updated =
      applications.filter(
        (application) =>
          application.id !==
          applicationId
      );

    saveApplications(updated);
    setApplications(updated);
  };


  /*
   * --------------------------------------
   * UPDATE STATUS
   * --------------------------------------
   */

  const handleStatusChange = (
    applicationId,
    status
  ) => {
    const updated =
      applications.map(
        (application) =>
          application.id ===
          applicationId
            ? {
                ...application,
                status,
              }
            : application
      );

    saveApplications(updated);
    setApplications(updated);
  };


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
              Applications
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
              Your application workspace
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
              Keep track of the opportunities
              you actually apply to. CareerPilot
              stores only the applications you add.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              setShowAddForm(
                (current) => !current
              )
            }
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

            <Plus
              size={17}
            />

            Add Application

          </button>

        </div>

      </section>


      {/* --------------------------------
          ADD APPLICATION FORM
      -------------------------------- */}

      {showAddForm && (
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
                text-primary-600
              "
            >
              New application
            </p>


            <h2
              className="
                mt-1
                text-lg
                font-bold
                text-text-primary
              "
            >
              Add an application
            </h2>

          </div>


          <form
            onSubmit={
              handleAddApplication
            }
            className="
              p-6
              sm:p-8
            "
          >

            <div
              className="
                grid
                gap-5
                md:grid-cols-2
              "
            >

              <FormField
                label="Company"
                required
                value={
                  newApplication.company
                }
                onChange={(value) =>
                  setNewApplication(
                    (current) => ({
                      ...current,
                      company: value,
                    })
                  )
                }
                placeholder="Company name"
              />


              <FormField
                label="Role"
                required
                value={
                  newApplication.role
                }
                onChange={(value) =>
                  setNewApplication(
                    (current) => ({
                      ...current,
                      role: value,
                    })
                  )
                }
                placeholder="Job title"
              />


              <FormField
                label="Location"
                value={
                  newApplication.location
                }
                onChange={(value) =>
                  setNewApplication(
                    (current) => ({
                      ...current,
                      location: value,
                    })
                  )
                }
                placeholder="City, Remote, Hybrid..."
              />


              <FormField
                label="Applied date"
                type="date"
                value={
                  newApplication.appliedDate
                }
                onChange={(value) =>
                  setNewApplication(
                    (current) => ({
                      ...current,
                      appliedDate: value,
                    })
                  )
                }
              />


              <div>

                <label
                  className="
                    text-xs
                    font-semibold
                    text-text-primary
                  "
                >
                  Status
                </label>


                <select
                  value={
                    newApplication.status
                  }
                  onChange={(event) =>
                    setNewApplication(
                      (current) => ({
                        ...current,
                        status:
                          event.target
                            .value,
                      })
                    )
                  }
                  className="
                    mt-2
                    h-11
                    w-full
                    border
                    border-border
                    bg-white
                    px-3
                    text-sm
                    text-text-primary
                    outline-none
                    focus:border-primary-500
                  "
                >

                  {APPLICATION_STATUSES.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}

                </select>

              </div>


              <FormField
                label="Job URL"
                type="url"
                value={
                  newApplication.jobUrl
                }
                onChange={(value) =>
                  setNewApplication(
                    (current) => ({
                      ...current,
                      jobUrl: value,
                    })
                  )
                }
                placeholder="https://..."
              />

            </div>


            <div
              className="
                mt-5
              "
            >

              <label
                className="
                  text-xs
                  font-semibold
                  text-text-primary
                "
              >
                Notes
              </label>


              <textarea
                value={
                  newApplication.notes
                }
                onChange={(event) =>
                  setNewApplication(
                    (current) => ({
                      ...current,
                      notes:
                        event.target
                          .value,
                    })
                  )
                }
                rows={4}
                placeholder="Interview details, recruiter notes, follow-up date..."
                className="
                  mt-2
                  w-full
                  resize-y
                  border
                  border-border
                  bg-white
                  px-3
                  py-3
                  text-sm
                  leading-6
                  text-text-primary
                  outline-none
                  placeholder:text-slate-400
                  focus:border-primary-500
                "
              />

            </div>


            <div
              className="
                mt-6
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:justify-end
              "
            >

              <button
                type="button"
                onClick={() =>
                  setShowAddForm(false)
                }
                className="
                  h-10
                  border
                  border-border
                  px-4
                  text-sm
                  font-semibold
                  text-text-primary
                  hover:bg-slate-50
                "
              >
                Cancel
              </button>


              <button
                type="submit"
                className="
                  h-10
                  bg-primary-600
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-primary-700
                "
              >
                Save Application
              </button>

            </div>

          </form>

        </section>
      )}


      {/* --------------------------------
          APPLICATION CONTENT
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

        {/* TOOLBAR */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-border
            p-5
            sm:p-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div
            className="
              relative
              w-full
              lg:max-w-sm
            "
          >

            <Search
              size={16}
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
              type="search"
              value={
                searchQuery
              }
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search applications..."
              className="
                h-10
                w-full
                border
                border-border
                bg-white
                pl-9
                pr-3
                text-sm
                text-text-primary
                outline-none
                placeholder:text-slate-400
                focus:border-primary-500
              "
            />

          </div>


          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                text-xs
                font-medium
                text-text-secondary
              "
            >
              Status
            </span>


            <select
              value={
                statusFilter
              }
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="
                h-10
                border
                border-border
                bg-white
                px-3
                text-sm
                text-text-primary
                outline-none
                focus:border-primary-500
              "
            >

              <option value="All">
                All
              </option>

              {APPLICATION_STATUSES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}

            </select>

          </div>

        </div>


        {/* APPLICATION LIST */}

        {applications.length ===
        0 ? (
          <EmptyApplications
            onAdd={() =>
              setShowAddForm(true)
            }
          />
        ) : filteredApplications.length ===
          0 ? (
          <NoMatchingApplications
            onClear={() => {
              setSearchQuery("");
              setStatusFilter("All");
            }}
          />
        ) : (
          <div
            className="
              divide-y
              divide-border
            "
          >

            {filteredApplications.map(
              (application) => (
                <ApplicationRow
                  key={
                    application.id
                  }
                  application={
                    application
                  }
                  onStatusChange={
                    handleStatusChange
                  }
                  onDelete={
                    handleDelete
                  }
                />
              )
            )}

          </div>
        )}

      </section>


      {/* --------------------------------
          DATA NOTICE
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
              Your applications are user-owned
              data.
            </p>


            <p
              className="
                mt-1
                text-sm
                leading-6
                text-text-secondary
              "
            >
              CareerPilot does not create sample
              applications here. Applications
              appear only after you add them or
              another connected workflow creates
              them.
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

const GuestApplications = ({
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
            <ClipboardList
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
            Applications
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
            Keep your applications
            organized.
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
            Track the jobs you actually apply
            to, their current status and your
            notes in one workspace.
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
            <FileText
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
            Your application workspace is
            available after CareerPilot creates
            your career profile.
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
 * APPLICATION ROW
 * ======================================
 */

const ApplicationRow = ({
  application,
  onStatusChange,
  onDelete,
}) => {
  return (
    <div
      className="
        p-5
        sm:p-6
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
              gap-1
              sm:flex-row
              sm:items-center
              sm:gap-3
            "
          >

            <h3
              className="
                truncate
                text-base
                font-bold
                text-text-primary
              "
            >
              {application.role}
            </h3>


            <span
              className="
                hidden
                text-slate-300
                sm:block
              "
            >
              /
            </span>


            <p
              className="
                text-sm
                font-medium
                text-text-secondary
              "
            >
              {application.company}
            </p>

          </div>


          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-x-4
              gap-y-2
              text-xs
              text-text-secondary
            "
          >

            {application.location && (
              <span
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >
                <BriefcaseBusiness
                  size={13}
                />

                {application.location}
              </span>
            )}


            {application.appliedDate && (
              <span
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >
                <CalendarDays
                  size={13}
                />

                Applied{" "}
                {formatDate(
                  application.appliedDate
                )}
              </span>
            )}

          </div>


          {application.notes && (
            <p
              className="
                mt-4
                max-w-3xl
                text-xs
                leading-5
                text-text-secondary
              "
            >
              {application.notes}
            </p>
          )}

        </div>


        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
          "
        >

          <select
            value={
              application.status ||
              "Applied"
            }
            onChange={(event) =>
              onStatusChange(
                application.id,
                event.target.value
              )
            }
            className="
              h-9
              border
              border-border
              bg-white
              px-3
              text-xs
              font-semibold
              text-text-primary
              outline-none
              focus:border-primary-500
            "
          >

            {APPLICATION_STATUSES.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              )
            )}

          </select>


          {application.jobUrl && (
            <a
              href={
                application.jobUrl
              }
              target="_blank"
              rel="noreferrer"
              className="
                flex
                h-9
                items-center
                justify-center
                gap-1.5
                border
                border-border
                px-3
                text-xs
                font-semibold
                text-text-primary
                hover:bg-slate-50
              "
            >
              Open

              <ExternalLink
                size={13}
              />
            </a>
          )}


          <button
            type="button"
            onClick={() =>
              onDelete(
                application.id
              )
            }
            className="
              flex
              h-9
              items-center
              justify-center
              gap-1.5
              border
              border-red-100
              px-3
              text-xs
              font-semibold
              text-red-600
              hover:bg-red-50
            "
          >
            <Trash2
              size={13}
            />

            Remove
          </button>

        </div>

      </div>

    </div>
  );
};


/*
 * ======================================
 * EMPTY STATE
 * ======================================
 */

const EmptyApplications = ({
  onAdd,
}) => {
  return (
    <div
      className="
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
          bg-slate-50
          text-slate-500
        "
      >
        <ClipboardList
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
        No applications yet.
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
        Applications will appear here after
        you add the jobs you've actually
        applied to.
      </p>


      <button
        type="button"
        onClick={onAdd}
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

        <Plus
          size={16}
        />

        Add Application

      </button>

    </div>
  );
};


/*
 * ======================================
 * NO MATCH
 * ======================================
 */

const NoMatchingApplications = ({
  onClear,
}) => {
  return (
    <div
      className="
        px-6
        py-12
        text-center
        sm:px-10
      "
    >

      <div
        className="
          mx-auto
          flex
          h-12
          w-12
          items-center
          justify-center
          bg-slate-50
          text-slate-500
        "
      >
        <Search
          size={21}
        />
      </div>


      <h2
        className="
          mt-5
          text-lg
          font-bold
          text-text-primary
        "
      >
        No matching applications.
      </h2>


      <p
        className="
          mt-2
          text-sm
          text-text-secondary
        "
      >
        Try changing your search or status
        filter.
      </p>


      <button
        type="button"
        onClick={onClear}
        className="
          mt-5
          text-sm
          font-semibold
          text-primary-600
          hover:underline
        "
      >
        Clear filters
      </button>

    </div>
  );
};


/*
 * ======================================
 * FORM FIELD
 * ======================================
 */

const FormField = ({
  label,
  required = false,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>

      <label
        className="
          text-xs
          font-semibold
          text-text-primary
        "
      >

        {label}

        {required && (
          <span
            className="
              ml-1
              text-red-500
            "
          >
            *
          </span>
        )}

      </label>


      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        required={required}
        className="
          mt-2
          h-11
          w-full
          border
          border-border
          bg-white
          px-3
          text-sm
          text-text-primary
          outline-none
          placeholder:text-slate-400
          focus:border-primary-500
        "
      />

    </div>
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
 * STORAGE
 * ======================================
 */

const readApplications = () => {
  try {
    const saved =
      localStorage.getItem(
        APPLICATIONS_KEY
      );

    if (!saved) {
      return [];
    }

    const parsed =
      JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.error(
      "Failed to read applications:",
      error
    );

    return [];
  }
};


const saveApplications = (
  applications
) => {
  try {
    localStorage.setItem(
      APPLICATIONS_KEY,
      JSON.stringify(
        applications
      )
    );
  } catch (error) {
    console.error(
      "Failed to save applications:",
      error
    );
  }
};


const createEmptyApplication =
  () => ({
    company: "",
    role: "",
    location: "",
    status: "Applied",
    appliedDate: "",
    jobUrl: "",
    notes: "",
  });


const formatDate = (
  date
) => {
  if (!date) {
    return "";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return date;
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};


export default Applications;