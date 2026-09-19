import express from "express";
import { getCareerPilotJobs } from "../services/jobicy.js";
import { extractJobSearchProfile } from "../services/profileExtractor.js";

const router = express.Router();

/*
 * Manual job search
 * Example:
 * /api/jobs/search?query=react&count=20
 */
router.get("/search", async (req, res, next) => {
  try {
    const query = String(req.query.query || "").trim();
    const count = Number(req.query.count || 20);

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Job search query is required.",
      });
    }

    const result = await getCareerPilotJobs({
      query,
      count,
    });

    res.json({
      success: true,
      query,
      source: result.source,
      total: result.total,
      jobs: result.jobs,
    });
  } catch (error) {
    next(error);
  }
});


/*
 * AI-powered job discovery
 *
 * Takes the CareerPilot career profile generated
 * by OpenRouter and automatically searches Jobicy.
 */
router.post("/from-profile", async (req, res, next) => {
  try {
    const profile = req.body?.profile;

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "Career profile is required.",
      });
    }

    const searchProfile = extractJobSearchProfile(profile);

    if (!searchProfile.queries.length) {
      return res.status(400).json({
        success: false,
        message: "No suitable job search queries could be extracted from the profile.",
      });
    }

    const allJobs = [];

    /*
     * Search the most relevant queries.
     * We limit the number of queries so we don't
     * unnecessarily hit the external API.
     */
    const queriesToSearch = searchProfile.queries.slice(0, 5);

    for (const query of queriesToSearch) {
      try {
        const result = await getCareerPilotJobs({
          query,
          count: 20,
        });

        allJobs.push(...result.jobs);
      } catch (error) {
        console.error(
          `Jobicy search failed for "${query}":`,
          error.message
        );
      }
    }

    /*
     * Remove duplicate jobs returned by different queries.
     */
    const uniqueJobs = Array.from(
      new Map(
        allJobs.map((job) => [
          job.id || job.url,
          job,
        ])
      ).values()
    );

    res.json({
      success: true,

      profile: {
        roles: searchProfile.roles,
        skills: searchProfile.skills,
        domains: searchProfile.domains,
      },

      queries: queriesToSearch,

      source: "Jobicy",

      total: uniqueJobs.length,

      jobs: uniqueJobs,
    });
  } catch (error) {
    next(error);
  }
});

export default router;