const cleanText = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ");

const unique = (items) => {
  return [...new Set(items.map(cleanText).filter(Boolean))];
};

export const extractJobSearchProfile = (profile) => {
  if (!profile) {
    return {
      roles: [],
      skills: [],
      domains: [],
      queries: [],
    };
  }

  const career = profile.careerProfile || {};
  const skills = profile.skills || {};

  const roles = unique([
    ...(career.likelyRoles || []),
  ]);

  const skillsList = unique([
    ...(skills.programming || []),
    ...(skills.frontend || []),
    ...(skills.backend || []),
    ...(skills.databases || []),
    ...(skills.tools || []),
    ...(skills.other || []),
  ]);

  const domains = unique([
    career.primaryDomain,
    ...(career.careerInterests || []),
  ]);

  /*
   * Jobicy works well with tag-style searches.
   *
   * Example:
   * Frontend Developer
   * React
   * JavaScript
   */

  const queries = [];

  // Primary career roles
  roles.slice(0, 3).forEach((role) => {
    queries.push(role);
  });

  // Important technical skills
  skillsList.slice(0, 5).forEach((skill) => {
    queries.push(skill);
  });

  // Domain-based searches
  domains.slice(0, 2).forEach((domain) => {
    queries.push(domain);
  });

  return {
    roles,
    skills: skillsList,
    domains,
    queries: unique(queries),
  };
};

export default extractJobSearchProfile; 