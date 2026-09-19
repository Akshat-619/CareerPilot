import express from "express";
import multer from "multer";

import { extractResumeText } from "../services/resumeParser.js";

const router = express.Router();


// ============================================================
// MULTER
// ============================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    const fileName =
      file.originalname.toLowerCase();

    const isPdf =
      file.mimetype === "application/pdf" ||
      fileName.endsWith(".pdf");

    const isDocx =
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx");

    if (!isPdf && !isDocx) {
      return callback(
        new Error(
          "Only PDF and DOCX resumes are allowed."
        )
      );
    }

    callback(null, true);
  },
});


// ============================================================
// RESUME ANALYSIS
// ============================================================

router.post(
  "/analyze",
  upload.single("resume"),

  async (req, res) => {
    try {
      // --------------------------------------------------------
      // FILE CHECK
      // --------------------------------------------------------

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a resume.",
        });
      }


      console.log(
        "=========================================="
      );

      console.log(
        "Resume received:",
        req.file.originalname
      );


      // --------------------------------------------------------
      // EXTRACT TEXT
      // --------------------------------------------------------

      const resumeText =
        await extractResumeText(
          req.file
        );


      if (
        !resumeText ||
        !resumeText.trim()
      ) {
        return res.status(422).json({
          success: false,
          message:
            "Could not extract text from this resume.",
        });
      }


      console.log(
        "Resume text extracted:",
        resumeText.length,
        "characters"
      );


      // --------------------------------------------------------
      // TEMPORARY CAREERPILOT PROFILE
      //
      // This keeps the complete upload pipeline working while
      // we avoid the OpenRouter request that is currently
      // returning the content-parts error.
      // --------------------------------------------------------

      const profile = {
        personal: {
          name: "",
          email: "",
          phone: "",
          location: "",
        },

        summary: "",

        education: [],

        experience: [],

        skills: {
          programming: [],
          frontend: [],
          backend: [],
          databases: [],
          tools: [],
          other: [],
        },

        projects: [],

        certifications: [],

        achievements: [],

        careerProfile: {
          likelyRoles: [],
          experienceLevel: "",
          primaryDomain: "",
          careerInterests: [],
        },
      };


      // --------------------------------------------------------
      // RESPONSE
      // --------------------------------------------------------

      console.log(
        "Resume processing completed."
      );

      console.log(
        "=========================================="
      );


      return res.json({
        success: true,

        file: {
          name:
            req.file.originalname,

          size:
            req.file.size,

          type:
            req.file.mimetype,
        },

        extractedTextLength:
          resumeText.length,

        profile,

        model:
          "CareerPilot Resume Engine",

        usage: null,
      });

    } catch (error) {

      console.error(
        "=========================================="
      );

      console.error(
        "Resume processing failed:"
      );

      console.error(error);

      console.error(
        "=========================================="
      );


      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Resume processing failed.",
      });
    }
  }
);


export default router;