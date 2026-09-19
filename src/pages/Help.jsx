import React from "react";
import {
  ArrowRight,
  BrainCircuit,
  CircleHelp,
  FileText,
  MessageCircleQuestion,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Help = ({
  isAuthenticated = false,
  hasProfile = false,
}) => {
  const navigate = useNavigate();

  const openSignup = () => {
    window.dispatchEvent(new CustomEvent("careerpilot:open-signup"));
  };

  const openLogin = () => {
    window.dispatchEvent(new CustomEvent("careerpilot:open-login"));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface-page p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-600">
            Support
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            How CareerPilot works
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            CareerPilot is built around one simple idea: upload your resume,
            let the AI understand your career context, and use that profile
            across your career workspace.
          </p>
        </div>

        {/* Main workflow */}
        <section className="border border-border bg-white shadow-cp-sm">
          <div className="border-b border-border px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-primary-50 text-primary-600">
                <BrainCircuit size={20} />
              </div>

              <div>
                <h2 className="text-base font-bold text-text-primary">
                  Your CareerPilot workflow
                </h2>

                <p className="mt-0.5 text-xs text-text-muted">
                  From resume to career profile
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-border md:grid-cols-3">
            <WorkflowStep
              number="01"
              icon={Upload}
              title="Upload your resume"
              description="Start with your existing PDF or DOCX resume. CareerPilot uses it as the primary source of your career information."
            />

            <WorkflowStep
              number="02"
              icon={BrainCircuit}
              title="AI understands it"
              description="The AI extracts relevant information such as skills, experience, education, projects, and career signals."
            />

            <WorkflowStep
              number="03"
              icon={FileText}
              title="Review your profile"
              description="Review the extracted information before saving it as your CareerPilot career profile."
            />
          </div>
        </section>

        {/* FAQ-style explanations */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <HelpCard
            icon={FileText}
            title="What information does CareerPilot use?"
          >
            <p>
              The resume analysis is designed to extract information that is
              actually present in your resume.
            </p>

            <ul className="mt-4 space-y-2 text-xs leading-5 text-text-secondary">
              <li>• Personal and contact information</li>
              <li>• Education</li>
              <li>• Professional experience</li>
              <li>• Technical and other skills</li>
              <li>• Projects</li>
              <li>• Certifications and achievements</li>
              <li>• Career-related signals supported by the resume</li>
            </ul>
          </HelpCard>

          <HelpCard
            icon={BrainCircuit}
            title="Does the AI invent information?"
          >
            <p>
              The resume-analysis instructions are designed to keep extracted
              information grounded in the uploaded resume.
            </p>

            <p className="mt-3">
              If information is not available in the resume, CareerPilot is
              designed to leave that information empty rather than fabricate
              it.
            </p>
          </HelpCard>

          <HelpCard
            icon={MessageCircleQuestion}
            title="Can I correct my profile?"
          >
            <p>
              Yes. After resume analysis, you get a review step before the
              extracted profile is saved.
            </p>

            <p className="mt-3">
              If you want to replace the profile later, you can upload your
              resume again from the personalization page.
            </p>
          </HelpCard>

          <HelpCard
            icon={CircleHelp}
            title="What if I don't have a profile yet?"
          >
            <p>
              That's completely fine. CareerPilot keeps the workspace available
              while guiding you toward the resume-upload step.
            </p>

            <p className="mt-3">
              Once your resume is analyzed and the profile is saved, the
              profile-dependent areas of the platform can use that information.
            </p>
          </HelpCard>
        </div>

        {/* Current state */}
        <section className="mt-6 border border-border bg-white shadow-cp-sm">
          <div className="flex flex-col gap-5 px-5 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-600">
                Your workspace
              </p>

              <h2 className="mt-2 text-lg font-bold tracking-tight text-text-primary">
                {hasProfile
                  ? "Your career profile is ready."
                  : isAuthenticated
                    ? "Your career profile is not set up yet."
                    : "You're currently exploring CareerPilot."}
              </h2>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-text-secondary">
                {hasProfile
                  ? "You can review your extracted profile or continue exploring the CareerPilot workspace."
                  : isAuthenticated
                    ? "Upload your resume to create the career profile that powers your workspace."
                    : "Sign in or create an account when you're ready to build your CareerPilot profile."}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              {hasProfile ? (
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="inline-flex items-center gap-2 bg-primary-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-primary-700"
                >
                  View profile
                  <ArrowRight size={15} />
                </button>
              ) : isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => navigate("/personalize")}
                  className="inline-flex items-center gap-2 bg-primary-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-primary-700"
                >
                  Upload resume
                  <ArrowRight size={15} />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={openSignup}
                    className="inline-flex items-center gap-2 bg-primary-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-primary-700"
                  >
                    Create account
                    <ArrowRight size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={openLogin}
                    className="inline-flex items-center gap-2 border border-border bg-white px-5 py-3 text-xs font-semibold text-text-primary transition hover:bg-surface-subtle"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const WorkflowStep = ({
  number,
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center bg-primary-50 text-primary-600">
          <Icon size={19} />
        </div>

        <span className="text-xs font-bold tracking-[0.12em] text-text-muted">
          {number}
        </span>
      </div>

      <h3 className="mt-5 text-sm font-bold text-text-primary">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-text-secondary">
        {description}
      </p>
    </div>
  );
};

const HelpCard = ({ icon: Icon, title, children }) => {
  return (
    <section className="border border-border bg-white p-5 shadow-cp-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-slate-700">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-text-primary">
            {title}
          </h2>

          <div className="mt-3 text-xs leading-5 text-text-secondary">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Help;    