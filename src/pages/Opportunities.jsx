import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
 CircleDot,
  ChevronUp,
  ExternalLink,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  X,
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
    if (profile) return normalizeProfile(profile);

    try {
      const saved = localStorage.getItem("careerpilotProfile");
      if (saved) return normalizeProfile(JSON.parse(saved));

      const oldSaved = localStorage.getItem("careerpilotPersonalization");
      if (oldSaved) return normalizeProfile(JSON.parse(oldSaved));
    } catch (error) {
      console.error("Failed to load CareerPilot profile:", error);
    }

    return null;
  }, [profile]);

  if (!isAuthenticated) {
    return (
      <GuestView
        onSignup={() =>
          window.dispatchEvent(new CustomEvent("careerpilot:open-signup"))
        }
        onLogin={() =>
          window.dispatchEvent(new CustomEvent("careerpilot:open-login"))
        }
      />
    );
  }

  if (!hasProfile) {
    return <ProfileRequired onUpload={() => navigate("/personalize")} />;
  }

  return (
    <CareerDesk
      profile={normalizedProfile}
      onUpdateProfile={() => navigate("/personalize")}
    />
  );
};

const GuestView = ({ onSignup, onLogin }) => (
  <Shell>
    <div className="min-h-[calc(100vh-120px)] border-x border-border bg-surface-page">
      <section className="grid border-b border-border bg-white lg:grid-cols-[1.35fr_.65fr]">
        <div className="border-b border-border px-6 py-12 sm:px-10 sm:py-16 lg:border-b-0 lg:border-r lg:px-16 lg:py-20">
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-600">
            <span className="h-px w-8 bg-primary-600" /> Opportunity desk
          </div>
          <h1 className="mt-8 max-w-5xl text-[clamp(3.2rem,7vw,7.8rem)] font-medium leading-[.88] tracking-[-0.065em] text-text-primary">
            Find work that makes sense.
          </h1>
          <p className="mt-9 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
            CareerPilot reads your resume, understands the direction of your career,
            and turns that context into a focused stream of opportunities.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={onSignup} className="group inline-flex h-12 items-center gap-3 bg-text-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-600">
              Start with your resume <ArrowUpRight size={17} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button onClick={onLogin} className="h-12 border border-border bg-white px-6 text-sm font-semibold text-text-primary hover:bg-surface-page">
              Sign in
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden bg-text-primary px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-primary-400/20" />
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/10" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-300">Career intelligence</span>
                <Sparkles size={16} className="text-cyan-300" />
              </div>
              <div className="mt-12 font-mono text-[11px] uppercase tracking-widest text-text-secondary">01 / Resume</div>
              <div className="mt-3 text-2xl font-medium tracking-tight">Experience becomes context.</div>
              <div className="mt-9 font-mono text-[11px] uppercase tracking-widest text-text-secondary">02 / Profile</div>
              <div className="mt-3 text-2xl font-medium tracking-tight">Skills become direction.</div>
              <div className="mt-9 font-mono text-[11px] uppercase tracking-widest text-text-secondary">03 / Search</div>
              <div className="mt-3 text-2xl font-medium tracking-tight">Direction becomes opportunity.</div>
            </div>
            <div className="mt-14 border-t border-white/10 pt-5 text-xs leading-5 text-text-muted">
              Current source: Jobicy remote opportunities
            </div>
          </div>
        </div>
      </section>
    </div>
  </Shell>
);

const ProfileRequired = ({ onUpload }) => (
  <Shell>
    <div className="min-h-[calc(100vh-120px)] border-x border-border bg-surface-page">
      <section className="grid border-b border-border bg-white lg:grid-cols-[.55fr_1.45fr]">
        <div className="bg-text-primary px-7 py-12 text-white sm:px-12 lg:px-14 lg:py-16">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-300">
            <CircleDot size={13} /> Opportunity desk
          </div>
          <div className="mt-20 font-mono text-xs text-text-secondary">PROFILE / 00</div>
          <h1 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.04em]">Your career context is missing.</h1>
          <p className="mt-6 text-sm leading-6 text-text-muted">Give CareerPilot your resume once. The opportunity desk can use the resulting profile for every search.</p>
        </div>
        <div className="flex items-center px-7 py-14 sm:px-12 lg:px-20 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-600">One input</p>
            <h2 className="mt-5 text-4xl font-medium tracking-[-0.045em] text-text-primary sm:text-6xl">Upload the resume.<br />Let the system do the sorting.</h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-text-secondary">CareerPilot can extract roles, skills, education and career direction before it searches for opportunities.</p>
            <button onClick={onUpload} className="mt-9 inline-flex h-12 items-center gap-3 bg-primary-600 px-6 text-sm font-semibold text-white hover:bg-primary-700">
              Upload resume <ArrowUpRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </div>
  </Shell>
);

const CareerDesk = ({ profile, onUpdateProfile }) => {
  const [jobs, setJobs] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [expanded, setExpanded] = useState(null);
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("careerpilotSavedJobs") || "[]");
    } catch {
      return [];
    }
  });

  const loadJobs = async () => {
    if (!profile) {
      setJobs([]);
      setQueries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${AI_API_URL}/jobs/from-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data?.message || "Could not load opportunities.");

      setJobs(Array.isArray(data?.jobs) ? data.jobs : []);
      setQueries(Array.isArray(data?.searchProfile?.queries) ? data.searchProfile.queries : []);
    } catch (loadError) {
      console.error("CareerPilot opportunity search failed:", loadError);
      setError(loadError.message || "Could not load opportunities.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [profile]);

  const roleNames = useMemo(() => unique([
    ...(profile?.careerProfile?.likelyRoles || []),
  ]), [profile]);

  const skillNames = useMemo(() => getAllSkills(profile), [profile]);

  const locations = useMemo(() => unique(jobs.map((job) => job.location).filter(Boolean)).slice(0, 10), [jobs]);

  const types = useMemo(() => unique(jobs.map((job) => job.jobType).filter(Boolean)), [jobs]);

  const filteredJobs = useMemo(() => {
    const needle = search.trim().toLowerCase();

    const next = jobs.filter((job) => {
      const haystack = [job.title, job.company, job.location, job.industry, job.description, job.jobLevel, job.jobType].join(" ").toLowerCase();
      const matchesSearch = !needle || haystack.includes(needle);
      const matchesType = typeFilter === "all" || job.jobType === typeFilter;
      const matchesLocation = locationFilter === "all" || job.location === locationFilter;
      return matchesSearch && matchesType && matchesLocation;
    });

    return [...next].sort((a, b) => {
      if (sort === "company") return a.company.localeCompare(b.company);
      if (sort === "title") return a.title.localeCompare(b.title);
      return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
    });
  }, [jobs, search, typeFilter, locationFilter, sort]);

  const savedSet = useMemo(() => new Set(saved), [saved]);

  const toggleSaved = (jobId) => {
    setSaved((current) => {
      const next = current.includes(jobId) ? current.filter((id) => id !== jobId) : [...current, jobId];
      localStorage.setItem("careerpilotSavedJobs", JSON.stringify(next));
      return next;
    });
  };

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setLocationFilter("all");
    setSort("recent");
  };

  return (
    <Shell>
      <div className="min-h-screen border-x border-border bg-surface-page">
        <header className="border-b border-border bg-white">
          <div className="mx-auto max-w-[1500px] px-5 py-5 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-primary-600">
                  <span className="h-px w-7 bg-primary-600" /> Career opportunity desk
                </div>
                <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  <h1 className="text-4xl font-medium tracking-[-0.055em] text-text-primary sm:text-5xl">Opportunities</h1>
                  <span className="font-mono text-xs text-text-muted">LIVE SEARCH / JOBICY</span>
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-text-secondary">A working shortlist built from your career profile, refreshed from the connected opportunity source.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={onUpdateProfile} className="h-10 border border-border bg-white px-4 text-xs font-semibold text-text-secondary hover:bg-surface-page">Edit profile</button>
                <button onClick={loadJobs} disabled={loading} className="inline-flex h-10 items-center gap-2 bg-text-primary px-4 text-xs font-semibold text-white hover:bg-primary-600 disabled:opacity-50">
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh search
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[290px_1fr]">
          <aside className="border-b border-border bg-surface-page lg:border-b-0 lg:border-r">
            <div className="sticky top-0 px-5 py-6 sm:px-8 lg:px-6 lg:py-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Career brief</span>
                <BriefcaseBusiness size={15} className="text-text-muted" />
              </div>

              <div className="mt-7 border-y border-border py-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Target roles</div>
                <div className="mt-3 space-y-2">
                  {roleNames.length ? roleNames.slice(0, 4).map((role) => <div key={role} className="text-sm font-semibold text-text-primary">{role}</div>) : <div className="text-sm text-text-secondary">No role detected</div>}
                </div>
              </div>

              <div className="py-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Skills in context</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {skillNames.slice(0, 12).map((skill) => <span key={skill} className="border border-border bg-white px-2 py-1 text-[10px] font-medium text-text-secondary">{skill}</span>)}
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Search signals</div>
                <div className="mt-3 space-y-2">
                  {queries.slice(0, 7).map((query, index) => (
                    <div key={`${query}-${index}`} className="flex items-center gap-2 text-xs text-text-secondary">
                      <span className="font-mono text-[9px] text-primary-500">0{index + 1}</span>{query}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 border-t border-border pt-5 text-[10px] leading-5 text-text-muted">Source data is provided by Jobicy. CareerPilot uses your extracted profile to construct the search context.</div>
            </div>
          </aside>

          <main className="min-w-0 bg-white">
            <div className="border-b border-border px-5 py-5 sm:px-8 lg:px-10">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search roles, companies, technologies, locations..." className="h-11 w-full border border-border bg-surface-page pl-11 pr-10 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-400 focus:bg-white" />
                  {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"><X size={15} /></button>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <FilterSelect value={typeFilter} onChange={setTypeFilter} options={[{ value: "all", label: "All types" }, ...types.map((item) => ({ value: item, label: item }))]} />
                  <FilterSelect value={locationFilter} onChange={setLocationFilter} options={[{ value: "all", label: "All locations" }, ...locations.map((item) => ({ value: item, label: item }))]} />
                  <FilterSelect value={sort} onChange={setSort} options={[{ value: "recent", label: "Recent" }, { value: "company", label: "Company" }, { value: "title", label: "Role" }]} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-text-muted">
                <span><strong className="font-semibold text-text-secondary">{filteredJobs.length}</strong> opportunities in view</span>
                {(search || typeFilter !== "all" || locationFilter !== "all" || sort !== "recent") && <button onClick={resetFilters} className="font-semibold text-primary-600 hover:text-primary-700">Clear filters</button>}
              </div>
            </div>

            {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={loadJobs} /> : !filteredJobs.length ? <EmptyState onReset={resetFilters} /> : (
              <div>
                {filteredJobs.map((job, index) => (
                  <JobRow
                    key={job.id || `${job.title}-${index}`}
                    job={job}
                    index={index}
                    expanded={expanded === job.id}
                    saved={savedSet.has(job.id)}
                    onExpand={() => setExpanded(expanded === job.id ? null : job.id)}
                    onSave={() => toggleSaved(job.id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </Shell>
  );
};

const JobRow = ({ job, index, expanded, saved, onExpand, onSave }) => {
  const cleanDescription = stripHtml(job.description || "");
  const date = formatPublishedDate(job.publishedAt);
  const tags = unique([job.jobType, job.jobLevel, job.industry].filter(Boolean));

  return (
    <article className={`group border-b border-border transition ${expanded ? "bg-surface-page" : "bg-white hover:bg-surface-page"}`}>
      <div className="grid gap-6 px-5 py-7 sm:px-8 lg:grid-cols-[58px_minmax(0,1fr)_180px] lg:px-10 lg:py-8">
        <div className="hidden pt-1 font-mono text-[10px] text-text-muted lg:block">{String(index + 1).padStart(2, "0")}</div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-primary-600">{job.industry || "Opportunity"}</span>
            {date && <span className="text-[10px] text-text-muted">{date}</span>}
          </div>
          <h2 className="mt-3 max-w-4xl text-2xl font-medium leading-tight tracking-[-0.035em] text-text-primary sm:text-3xl">{job.title}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-secondary">
            <span className="font-semibold text-text-primary">{job.company || "Company not listed"}</span>
            {job.location && <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {job.location}</span>}
          </div>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {tags.map((tag) => <span key={tag} className="border border-border bg-white px-2 py-1 text-[10px] font-medium text-text-secondary">{tag}</span>)}
          </div>
          <p className={`mt-5 max-w-4xl text-sm leading-6 text-text-secondary ${expanded ? "" : "line-clamp-2"}`}>{cleanDescription || "No description was provided by the source."}</p>
          {expanded && (
            <div className="mt-6 border-t border-border pt-5">
              <div className="grid gap-5 sm:grid-cols-3">
                <Detail label="Location" value={job.location || "Not listed"} />
                <Detail label="Employment" value={job.jobType || "Not listed"} />
                <Detail label="Level" value={job.jobLevel || "Not listed"} />
              </div>
              {job.salaryMin || job.salaryMax ? <div className="mt-5 border-t border-border pt-5 text-xs text-text-secondary"><span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Salary</span><div className="mt-1 font-semibold">{formatSalary(job.salaryMin, job.salaryMax)}</div></div> : null}
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-3 lg:flex-col lg:items-stretch lg:justify-start">
          <button onClick={onSave} className={`h-10 border px-3 text-xs font-semibold transition ${saved ? "border-primary-200 bg-primary-50 text-primary-700" : "border-border bg-white text-text-secondary hover:border-border hover:text-text-primary"}`}>
            {saved ? "Saved" : "Save role"}
          </button>
          <button onClick={onExpand} className="inline-flex h-10 items-center justify-center gap-2 border border-border bg-white px-3 text-xs font-semibold text-text-secondary hover:border-border">
            {expanded ? "Less detail" : "Read details"} {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <a href={job.url} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 bg-text-primary px-4 text-xs font-bold text-white transition hover:bg-primary-600">Open opportunity <ExternalLink size={14} /></a>
        </div>
      </div>
    </article>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-text-muted">{label}</div>
    <div className="mt-2 text-xs font-semibold text-text-secondary">{value}</div>
  </div>
);

const FilterSelect = ({ value, onChange, options }) => (
  <label className="relative block">
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 min-w-[135px] appearance-none border border-border bg-white pl-3 pr-9 text-xs font-semibold text-text-secondary outline-none hover:border-border focus:border-primary-400">
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
  </label>
);

const LoadingState = () => (
  <div className="px-5 py-16 sm:px-8 lg:px-10">
    <div className="flex min-h-[360px] flex-col items-center justify-center border border-dashed border-border bg-surface-page text-center">
      <LoaderCircle size={25} className="animate-spin text-primary-600" />
      <div className="mt-5 text-lg font-medium tracking-tight text-text-primary">Reading your career context</div>
      <div className="mt-2 text-sm text-text-secondary">Building a fresh opportunity search.</div>
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="px-5 py-16 sm:px-8 lg:px-10">
    <div className="border border-red-200 bg-red-50/50 p-7 sm:p-10">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-500">Search error</div>
      <h2 className="mt-3 text-2xl font-medium tracking-tight text-text-primary">The opportunity feed did not respond.</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">{message}</p>
      <button onClick={onRetry} className="mt-6 inline-flex h-10 items-center gap-2 bg-text-primary px-4 text-xs font-semibold text-white hover:bg-primary-600"><RefreshCw size={14} /> Try again</button>
    </div>
  </div>
);

const EmptyState = ({ onReset }) => (
  <div className="px-5 py-16 sm:px-8 lg:px-10">
    <div className="grid min-h-[420px] place-items-center border border-border bg-surface-page p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-border bg-white text-primary-600"><Search size={19} /></div>
        <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">No results in current view</div>
        <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-text-primary">Nothing matched those filters.</h2>
        <p className="mt-4 text-sm leading-6 text-text-secondary">Clear the current search and filters to return to the full opportunity stream.</p>
        <button onClick={onReset} className="mt-7 h-10 bg-text-primary px-5 text-xs font-semibold text-white hover:bg-primary-600">Reset view</button>
      </div>
    </div>
  </div>
);

const Shell = ({ children }) => (
  <div className="px-0 py-0 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
    <div className="mx-auto max-w-[1600px] overflow-hidden bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">{children}</div>
  </div>
);

const normalizeProfile = (profile) => {
  if (!profile || typeof profile !== "object") return null;
  const skills = profile.skills || {};
  const career = profile.careerProfile || {};
  return {
    ...profile,
    personal: profile.personal || {},
    education: Array.isArray(profile.education) ? profile.education : [],
    experience: Array.isArray(profile.experience) ? profile.experience : [],
    projects: Array.isArray(profile.projects) ? profile.projects : [],
    skills: {
      programming: Array.isArray(skills.programming) ? skills.programming : [],
      frontend: Array.isArray(skills.frontend) ? skills.frontend : [],
      backend: Array.isArray(skills.backend) ? skills.backend : [],
      databases: Array.isArray(skills.databases) ? skills.databases : [],
      tools: Array.isArray(skills.tools) ? skills.tools : [],
      other: Array.isArray(skills.other) ? skills.other : [],
    },
    careerProfile: {
      likelyRoles: Array.isArray(career.likelyRoles) ? career.likelyRoles : [],
      experienceLevel: career.experienceLevel || "",
      primaryDomain: career.primaryDomain || "",
      careerInterests: Array.isArray(career.careerInterests) ? career.careerInterests : [],
    },
  };
};

const getAllSkills = (profile) => {
  const skills = profile?.skills || {};
  return unique([
    ...(skills.programming || []),
    ...(skills.frontend || []),
    ...(skills.backend || []),
    ...(skills.databases || []),
    ...(skills.tools || []),
    ...(skills.other || []),
  ]);
};

const unique = (items) => [...new Set(items.map((item) => String(item || "").trim()).filter(Boolean))];

const stripHtml = (value) => String(value || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/\s+/g, " ").trim();

const formatPublishedDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Math.max(0, Date.now() - date.getTime());
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const formatSalary = (min, max) => {
  const money = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return "";
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(number);
  };
  if (min && max) return `${money(min)} – ${money(max)}`;
  if (min) return `From ${money(min)}`;
  if (max) return `Up to ${money(max)}`;
  return "";
};

export default Opportunities;
