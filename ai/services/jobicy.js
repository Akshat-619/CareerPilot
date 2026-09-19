const JOBICY_API_URL = "https://jobicy.com/api/v2/remote-jobs";

export const searchJobicyJobs = async ({
  query = "",
  count = 20,
} = {}) => {
  const params = new URLSearchParams();

  params.set(
    "count",
    String(Math.min(Math.max(Number(count) || 20, 1), 200)),
  );

  if (query.trim()) {
    params.set("tag", query.trim());
  }

  const response = await fetch(
    `${JOBICY_API_URL}?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "CareerPilot/1.0",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Jobicy API request failed: ${response.status}`,
    );
  }

  return response.json();
};

const normalizeJobicyJob = (job) => ({
  id: String(job.id ?? ""),
  source: "Jobicy",

  title: String(job.jobTitle ?? "").trim(),

  company: String(job.companyName ?? "").trim(),

  location: String(job.jobGeo ?? "").trim(),

  jobType: String(job.jobType ?? "").trim(),

  jobLevel: String(job.jobLevel ?? "").trim(),

  industry: String(job.jobIndustry ?? "").trim(),

  description: String(
    job.jobDescription ?? "",
  ).trim(),

  salaryMin: job.annualSalaryMin ?? null,
  salaryMax: job.annualSalaryMax ?? null,

  publishedAt: job.pubDate ?? null,

  url: String(job.url ?? "").trim(),

  sourceCredit: "Jobicy",
});

export const getCareerPilotJobs = async ({
  query = "",
  count = 20,
} = {}) => {
  const data = await searchJobicyJobs({
    query,
    count,
  });

  const jobs = (data.jobs || [])
    .map(normalizeJobicyJob)
    .filter((job) => job.title && job.url);

  return {
    source: "Jobicy",
    total: jobs.length,
    jobs,
  };
};