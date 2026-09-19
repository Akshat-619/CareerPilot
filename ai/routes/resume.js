import express from "express";
import multer from "multer";

import {
  extractResumeText,
} from "../services/resumeParser.js";

import {
  analyzeResumeWithAI,
} from "../services/openrouter.js";

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
// ANALYZE
// ============================================================

router.post(
  "/analyze",
  upload.single("resume"),

  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please upload a resume.",
        });
      }


      console.log(
        "Resume received:",
        req.file.originalname
      );


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


      // ======================================================
      // AI ANALYSIS
      // ======================================================

      const aiResult =
        await analyzeResumeWithAI(
          resumeText
        );


      // ======================================================
      // RESPONSE
      // ======================================================

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

        profile:
          aiResult.profile,

        model:
          aiResult.model,

        usage:
          aiResult.usage,

      });

    } catch (error) {

      console.error(
        "Resume analysis failed:"
      );

      console.error(error);

      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Resume analysis failed.",

      });
    }
  }
);


export default router;