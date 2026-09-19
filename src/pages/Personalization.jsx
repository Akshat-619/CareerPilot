import React, {

  useEffect,

  useMemo,

  useRef,

  useState,

} from "react";



import {

  AlertCircle,

  ArrowRight,

  Check,

  ChevronDown,

  FileText,

  Loader2,

  MapPin,

  RefreshCw,

  Sparkles,

  Upload,

  UserRound,

  X,

} from "lucide-react";



import {

  useNavigate,

} from "react-router-dom";



import {

  analyzeResume,

} from "../api/resumeAI";



import {

  getCareerProfile,

  saveCareerProfile,

} from "../api/auth";





/*

 * --------------------------------------

 * HELPERS

 * --------------------------------------

 */



const safeString = (

  value

) => {

  if (

    value === null ||

    value === undefined

  ) {

    return "";

  }



  if (

    typeof value === "string" ||

    typeof value === "number"

  ) {

    return String(value);

  }



  return "";

};





const safeArray = (

  value

) => {

  return Array.isArray(value)

    ? value

    : [];

};





const safeDisplayValue = (

  value

) => {

  if (

    value === null ||

    value === undefined

  ) {

    return "Not provided";

  }



  if (

    typeof value === "string" ||

    typeof value === "number"

  ) {

    const text = String(value).trim();



    return text || "Not provided";

  }



  if (Array.isArray(value)) {

    return value

      .filter(

        (item) =>

          typeof item === "string" ||

          typeof item === "number"

      )

      .join(", ") || "Not provided";

  }



  return "Not provided";

};





const normalizeProfile = (

  rawProfile

) => {

  const raw =

    rawProfile || {};



  const personal =

    raw.personal || {};



  const careerProfile =

    raw.careerProfile || {};



  const education =

    safeArray(

      raw.education

    ).map((item) => ({

      degree:

        safeString(

          item?.degree

        ),



      field:

        safeString(

          item?.field

        ),



      institution:

        safeString(

          item?.institution

        ),



      graduationYear:

        safeString(

          item?.graduationYear

        ),

    }));





  const experience =

    safeArray(

      raw.experience

    ).map((item) => ({

      company:

        safeString(

          item?.company

        ),



      role:

        safeString(

          item?.role

        ),



      startDate:

        safeString(

          item?.startDate

        ),



      endDate:

        safeString(

          item?.endDate

        ),



      description:

        safeString(

          item?.description

        ),



      technologies:

        safeArray(

          item?.technologies

        ).filter(

          (item) =>

            typeof item === "string"

        ),

    }));





  const skillsSource =

    raw.skills || {};





  const skills = {

    programming:

      safeArray(

        skillsSource.programming

      ).filter(

        (item) =>

          typeof item === "string"

      ),



    frontend:

      safeArray(

        skillsSource.frontend

      ).filter(

        (item) =>

          typeof item === "string"

      ),



    backend:

      safeArray(

        skillsSource.backend

      ).filter(

        (item) =>

          typeof item === "string"

      ),



    databases:

      safeArray(

        skillsSource.databases

      ).filter(

        (item) =>

          typeof item === "string"

      ),



    tools:

      safeArray(

        skillsSource.tools

      ).filter(

        (item) =>

          typeof item === "string"

      ),



    other:

      safeArray(

        skillsSource.other

      ).filter(

        (item) =>

          typeof item === "string"

      ),

  };





  const projects =

    safeArray(

      raw.projects

    ).map((item) => ({

      name:

        safeString(

          item?.name

        ),



      description:

        safeString(

          item?.description

        ),



      technologies:

        safeArray(

          item?.technologies

        ).filter(

          (item) =>

            typeof item === "string"

        ),

    }));





  return {

    personal: {

      name:

        safeString(

          personal.name

        ),



      email:

        safeString(

          personal.email

        ),



      phone:

        safeString(

          personal.phone

        ),



      location:

        safeString(

          personal.location

        ),

    },



    summary:

      safeString(

        raw.summary

      ),



    education,



    experience,



    skills,



    projects,



    certifications:

      safeArray(

        raw.certifications

      ).filter(

        (item) =>

          typeof item === "string"

      ),



    achievements:

      safeArray(

        raw.achievements

      ).filter(

        (item) =>

          typeof item === "string"

      ),



    careerProfile: {

      likelyRoles:

        safeArray(

          careerProfile.likelyRoles

        ).filter(

          (item) =>

            typeof item === "string"

        ),



      experienceLevel:

        safeString(

          careerProfile.experienceLevel

        ),



      primaryDomain:

        safeString(

          careerProfile.primaryDomain

        ),



      careerInterests:

        safeArray(

          careerProfile.careerInterests

        ).filter(

          (item) =>

            typeof item === "string"

        ),

    },

  };

};





/*

 * --------------------------------------

 * COMPONENT

 * --------------------------------------

 */



const Personalization = ({

  user,

  profile,

  onProfileUpdate,

}) => {

  const navigate =

    useNavigate();



  const fileInputRef =

    useRef(null);





  const [

    selectedFile,

    setSelectedFile,

  ] = useState(null);



  const [

    isDragging,

    setIsDragging,

  ] = useState(false);



  const [

    isAnalyzing,

    setIsAnalyzing,

  ] = useState(false);



  const [

    analysisStep,

    setAnalysisStep,

  ] = useState(0);



  const [

    analysisError,

    setAnalysisError,

  ] = useState("");



  const [

    analyzedProfile,

    setAnalyzedProfile,

  ] = useState(null);



  const [

    isSaving,

    setIsSaving,

  ] = useState(false);



  const [

    savedMessage,

    setSavedMessage,

  ] = useState("");





  /*

   * --------------------------------------

   * EXISTING PROFILE

   * --------------------------------------

   */



  const existingProfile =

    useMemo(() => {

      if (profile) {

        return profile;

      }



      return getCareerProfile();

    }, [profile]);





  /*

   * --------------------------------------

   * ANALYSIS STEPS

   * --------------------------------------

   */



  const analysisSteps = [

    {

      title:

        "Reading your resume",

      description:

        "Extracting the information from your document.",

    },



    {

      title:

        "Understanding your experience",

      description:

        "Identifying education, experience, projects and skills.",

    },



    {

      title:

        "Building your career profile",

      description:

        "Structuring your career information for CareerPilot.",

    },



    {

      title:

        "Preparing your workspace",

      description:

        "Getting your personalized CareerPilot profile ready.",

    },

  ];





  /*

   * --------------------------------------

   * FILE VALIDATION

   * --------------------------------------

   */



  const validateFile = (

    file

  ) => {

    if (!file) {

      return "Please select a resume.";

    }





    const fileName =

      file.name?.toLowerCase() ||

      "";





    const isPdf =

      file.type ===

        "application/pdf" ||

      fileName.endsWith(".pdf");





    const isDocx =

      file.type ===

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||

      fileName.endsWith(".docx");





    if (!isPdf && !isDocx) {

      return (

        "Only PDF and DOCX resumes are supported."

      );

    }





    const maxSize =

      5 * 1024 * 1024;





    if (file.size > maxSize) {

      return (

        "Your resume must be smaller than 5 MB."

      );

    }





    return "";

  };





  /*

   * --------------------------------------

   * SELECT FILE

   * --------------------------------------

   */



  const selectFile = (

    file

  ) => {

    const error =

      validateFile(file);



    if (error) {

      setAnalysisError(

        error

      );



      setSelectedFile(null);



      return;

    }





    setAnalysisError("");



    setSavedMessage("");



    setSelectedFile(file);

  };





  const handleFileInput = (

    event

  ) => {

    const file =

      event.target.files?.[0];



    selectFile(file);

  };





  /*

   * --------------------------------------

   * DRAG & DROP

   * --------------------------------------

   */



  const handleDragOver = (

    event

  ) => {

    event.preventDefault();



    setIsDragging(true);

  };





  const handleDragLeave = (

    event

  ) => {

    event.preventDefault();



    setIsDragging(false);

  };





  const handleDrop = (

    event

  ) => {

    event.preventDefault();



    setIsDragging(false);



    const file =

      event.dataTransfer.files?.[0];



    selectFile(file);

  };





  /*

   * --------------------------------------

   * OPEN FILE PICKER

   * --------------------------------------

   */



  const openFilePicker = () => {

    fileInputRef.current?.click();

  };





  /*

   * --------------------------------------

   * ANALYZE RESUME

   * --------------------------------------

   */



  const handleAnalyze = async () => {

    if (!selectedFile) {

      setAnalysisError(

        "Please select a resume first."

      );



      return;

    }





    setAnalysisError("");



    setSavedMessage("");



    setIsAnalyzing(true);



    setAnalysisStep(0);





    let intervalId = null;





    try {

      /*

       * Move through the visual analysis

       * stages while the real API request

       * is running.

       */



      intervalId =

        window.setInterval(() => {

          setAnalysisStep(

            (current) =>

              Math.min(

                current + 1,

                analysisSteps.length - 1

              )

          );

        }, 1400);





      const result =

        await analyzeResume(

          selectedFile

        );





      const normalized =

        normalizeProfile(

          result?.profile

        );





      setAnalyzedProfile(

        normalized

      );



      setAnalysisStep(

        analysisSteps.length - 1

      );



    } catch (error) {

      console.error(

        "Resume analysis failed:",

        error

      );



      setAnalysisError(

        error?.message ||

          "Resume analysis failed. Please try again."

      );



    } finally {

      if (intervalId) {

        window.clearInterval(

          intervalId

        );

      }



      setIsAnalyzing(false);

    }

  };





  /*

   * --------------------------------------

   * SAVE PROFILE

   * --------------------------------------

   */



  const handleSaveProfile = () => {

    if (!analyzedProfile) {

      return;

    }





    setIsSaving(true);



    setSavedMessage("");





    try {

      saveCareerProfile(

        analyzedProfile

      );





      if (onProfileUpdate) {

        onProfileUpdate(

          analyzedProfile

        );

      }





      setSavedMessage(

        "Your career profile has been saved."

      );





      window.setTimeout(() => {

        navigate("/");

      }, 700);



    } catch (error) {

      console.error(

        "Failed to save career profile:",

        error

      );



      setAnalysisError(

        "Your profile could not be saved. Please try again."

      );



    } finally {

      setIsSaving(false);

    }

  };





  /*

   * --------------------------------------

   * RESET ANALYSIS

   * --------------------------------------

   */



  const handleReset = () => {

    setSelectedFile(null);



    setAnalyzedProfile(null);



    setAnalysisError("");



    setSavedMessage("");



    setAnalysisStep(0);





    if (fileInputRef.current) {

      fileInputRef.current.value =

        "";

    }

  };





  /*

   * --------------------------------------

   * PROFILE PREVIEW DATA

   * --------------------------------------

   */



  const previewProfile =

    analyzedProfile ||

    existingProfile;





  const allSkills = useMemo(() => {

    if (!previewProfile) {

      return [];

    }





    return Object.values(

      previewProfile.skills || {}

    )

      .flat()

      .filter(

        (skill) =>

          typeof skill === "string" &&

          skill.trim()

      );

  }, [previewProfile]);





  /*

   * --------------------------------------

   * RENDER

   * --------------------------------------

   */



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

          max-w-6xl

        "

      >



        {/* --------------------------------

            HEADER

        -------------------------------- */}



        <div

          className="

            mb-8

          "

        >



          <p

            className="

              text-xs

              font-semibold

              uppercase

              tracking-[0.14em]

              text-primary-600

            "

          >

            Career Profile

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

            {existingProfile

              ? "Update your career profile"

              : "Build your career profile"}

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

            Upload your resume once. CareerPilot

            will extract your career information

            and turn it into a structured profile

            for your personalized workspace.

          </p>



        </div>





        {/* --------------------------------

            ANALYZING

        -------------------------------- */}



        {isAnalyzing && (

          <div

            className="

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



              <div

                className="

                  flex

                  items-center

                  gap-3

                "

              >



                <div

                  className="

                    flex

                    h-10

                    w-10

                    items-center

                    justify-center

                    bg-primary-50

                    text-primary-600

                  "

                >

                  <Sparkles

                    size={19}

                  />

                </div>





                <div>

                  <p

                    className="

                      text-sm

                      font-semibold

                      text-text-primary

                    "

                  >

                    CareerPilot is analyzing

                    your resume

                  </p>



                  <p

                    className="

                      mt-0.5

                      text-xs

                      text-text-secondary

                    "

                  >

                    This may take a few moments.

                  </p>

                </div>



              </div>



            </div>





            <div

              className="

                p-6

                sm:p-8

              "

            >



              <div

                className="

                  space-y-5

                "

              >



                {analysisSteps.map(

                  (

                    step,

                    index

                  ) => {



                    const completed =

                      index <

                      analysisStep;



                    const active =

                      index ===

                      analysisStep;





                    return (

                      <div

                        key={

                          step.title

                        }

                        className="

                          flex

                          gap-4

                        "

                      >



                        <div

                          className={`

                            flex

                            h-9

                            w-9

                            shrink-0

                            items-center

                            justify-center

                            border

                            ${

                              completed

                                ? `

                                  border-emerald-200

                                  bg-emerald-50

                                  text-emerald-600

                                `

                                : active

                                  ? `

                                    border-primary-200

                                    bg-primary-50

                                    text-primary-600

                                  `

                                  : `

                                    border-border

                                    bg-slate-50

                                    text-slate-400

                                  `

                            }

                          `}

                        >



                          {completed ? (

                            <Check

                              size={16}

                            />

                          ) : active ? (

                            <Loader2

                              size={16}

                              className="

                                animate-spin

                              "

                            />

                          ) : (

                            <span

                              className="

                                text-xs

                                font-semibold

                              "

                            >

                              {index + 1}

                            </span>

                          )}



                        </div>





                        <div

                          className="

                            pt-0.5

                          "

                        >



                          <p

                            className={`

                              text-sm

                              font-semibold

                              ${

                                active ||

                                completed

                                  ? "text-text-primary"

                                  : "text-slate-400"

                              }

                            `}

                          >

                            {step.title}

                          </p>





                          <p

                            className="

                              mt-1

                              text-xs

                              leading-5

                              text-text-secondary

                            "

                          >

                            {step.description}

                          </p>



                        </div>



                      </div>

                    );

                  }

                )}



              </div>



            </div>



          </div>

        )}





        {/* --------------------------------

            ERROR

        -------------------------------- */}



        {analysisError && !isAnalyzing && (

          <div

            className="

              mb-6

              flex

              gap-3

              border

              border-red-200

              bg-red-50

              p-4

              text-red-700

            "

          >



            <AlertCircle

              size={18}

              className="

                mt-0.5

                shrink-0

              "

            />



            <div>



              <p

                className="

                  text-sm

                  font-semibold

                "

              >

                Something went wrong

              </p>



              <p

                className="

                  mt-1

                  text-sm

                  leading-5

                "

              >

                {analysisError}

              </p>



            </div>



          </div>

        )}





        {/* --------------------------------

            ANALYZED PROFILE

        -------------------------------- */}



        {!isAnalyzing &&

          analyzedProfile && (

            <ProfileReview

              profile={

                analyzedProfile

              }

              allSkills={

                allSkills

              }

              onSave={

                handleSaveProfile

              }

              onReset={

                handleReset

              }

              isSaving={

                isSaving

              }

              savedMessage={

                savedMessage

              }

            />

          )}





        {/* --------------------------------

            UPLOAD

        -------------------------------- */}



        {!isAnalyzing &&

          !analyzedProfile && (

            <>



              <div

                className="

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



                  <div

                    className="

                      flex

                      items-center

                      gap-3

                    "

                  >



                    <div

                      className="

                        flex

                        h-10

                        w-10

                        items-center

                        justify-center

                        bg-primary-50

                        text-primary-600

                      "

                    >

                      <FileText

                        size={19}

                      />

                    </div>





                    <div>



                      <p

                        className="

                          text-sm

                          font-semibold

                          text-text-primary

                        "

                      >

                        Upload your resume

                      </p>



                      <p

                        className="

                          mt-0.5

                          text-xs

                          text-text-secondary

                        "

                      >

                        PDF or DOCX · Maximum

                        5 MB

                      </p>



                    </div>



                  </div>



                </div>





                <div

                  className="

                    p-6

                    sm:p-8

                  "

                >



                  <input

                    ref={

                      fileInputRef

                    }

                    type="file"

                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

                    onChange={

                      handleFileInput

                    }

                    className="

                      hidden

                    "

                  />





                  <div

                    onDragOver={

                      handleDragOver

                    }

                    onDragLeave={

                      handleDragLeave

                    }

                    onDrop={

                      handleDrop

                    }

                    onClick={

                      openFilePicker

                    }

                    className={`

                      cursor-pointer

                      border-2

                      border-dashed

                      p-8

                      text-center

                      transition

                      sm:p-12

                      ${

                        isDragging

                          ? `

                            border-primary-500

                            bg-primary-50

                          `

                          : `

                            border-slate-200

                            hover:border-primary-300

                            hover:bg-slate-50

                          `

                      }

                    `}

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





                    <h2

                      className="

                        mt-5

                        text-base

                        font-semibold

                        text-text-primary

                      "

                    >

                      Drop your resume here

                    </h2>





                    <p

                      className="

                        mt-2

                        text-sm

                        text-text-secondary

                      "

                    >

                      or click to browse your

                      files

                    </p>





                    <p

                      className="

                        mt-4

                        text-xs

                        text-slate-400

                      "

                    >

                      Supported formats: PDF,

                      DOCX · Maximum size: 5 MB

                    </p>



                  </div>





                  {/* SELECTED FILE */}



                  {selectedFile && (

                    <div

                      className="

                        mt-5

                        flex

                        items-center

                        justify-between

                        gap-4

                        border

                        border-border

                        bg-slate-50

                        p-4

                      "

                    >



                      <div

                        className="

                          flex

                          min-w-0

                          items-center

                          gap-3

                        "

                      >



                        <div

                          className="

                            flex

                            h-9

                            w-9

                            shrink-0

                            items-center

                            justify-center

                            bg-white

                            text-primary-600

                          "

                        >

                          <FileText

                            size={17}

                          />

                        </div>





                        <div

                          className="

                            min-w-0

                          "

                        >



                          <p

                            className="

                              truncate

                              text-sm

                              font-medium

                              text-text-primary

                            "

                          >

                            {selectedFile.name}

                          </p>





                          <p

                            className="

                              mt-0.5

                              text-xs

                              text-text-secondary

                            "

                          >

                            {formatFileSize(

                              selectedFile.size

                            )}

                          </p>



                        </div>



                      </div>





                      <button

                        type="button"

                        onClick={(

                          event

                        ) => {

                          event.stopPropagation();

                          handleReset();

                        }}

                        className="

                          flex

                          h-8

                          w-8

                          shrink-0

                          items-center

                          justify-center

                          text-slate-400

                          transition

                          hover:bg-white

                          hover:text-slate-700

                        "

                        aria-label="Remove resume"

                      >

                        <X

                          size={16}

                        />

                      </button>



                    </div>

                  )}





                  {/* ANALYZE BUTTON */}



                  <div

                    className="

                      mt-6

                      flex

                      flex-col

                      gap-3

                      sm:flex-row

                      sm:items-center

                      sm:justify-between

                    "

                  >



                    <p

                      className="

                        text-xs

                        leading-5

                        text-text-secondary

                      "

                    >

                      CareerPilot only uses the

                      information extracted from

                      your uploaded resume.

                    </p>





                    <button

                      type="button"

                      disabled={

                        !selectedFile

                      }

                      onClick={

                        handleAnalyze

                      }

                      className="

                        flex

                        h-11

                        shrink-0

                        items-center

                        justify-center

                        gap-2

                        bg-primary-600

                        px-5

                        text-sm

                        font-semibold

                        text-white

                        transition

                        hover:bg-primary-700

                        disabled:cursor-not-allowed

                        disabled:opacity-40

                      "

                    >



                      Analyze Resume



                      <ArrowRight

                        size={16}

                      />



                    </button>



                  </div>



                </div>



              </div>





              {/* --------------------------------

                  HOW IT WORKS

              -------------------------------- */}



              <div

                className="

                  mt-6

                  grid

                  gap-4

                  md:grid-cols-3

                "

              >



                <InfoCard

                  number="01"

                  title="Upload"

                  description="Give CareerPilot your existing resume."

                />



                <InfoCard

                  number="02"

                  title="Analyze"

                  description="AI extracts your actual career information."

                />



                <InfoCard

                  number="03"

                  title="Personalize"

                  description="Use your profile across the CareerPilot workspace."

                />



              </div>



            </>

          )}



      </div>



    </div>

  );

};





/*

 * --------------------------------------

 * PROFILE REVIEW

 * --------------------------------------

 */



const ProfileReview = ({

  profile,

  allSkills,

  onSave,

  onReset,

  isSaving,

  savedMessage,

}) => {

  const [

    expandedSections,

    setExpandedSections,

  ] = useState({

    experience: true,

    education: true,

    skills: true,

    projects: true,

  });





  const toggleSection = (

    section

  ) => {

    setExpandedSections(

      (current) => ({

        ...current,

        [section]:

          !current[section],

      })

    );

  };





  return (

    <div>



      {/* HEADER */}



      <div

        className="

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

            py-6

            sm:px-8

          "

        >



          <div

            className="

              flex

              flex-col

              gap-5

              sm:flex-row

              sm:items-start

              sm:justify-between

            "

          >



            <div>



              <div

                className="

                  flex

                  items-center

                  gap-2

                "

              >



                <div

                  className="

                    flex

                    h-9

                    w-9

                    items-center

                    justify-center

                    bg-emerald-50

                    text-emerald-600

                  "

                >

                  <Check

                    size={18}

                  />

                </div>



                <span

                  className="

                    text-xs

                    font-semibold

                    uppercase

                    tracking-[0.12em]

                    text-emerald-600

                  "

                >

                  Analysis complete

                </span>



              </div>





              <h2

                className="

                  mt-4

                  text-xl

                  font-bold

                  tracking-tight

                  text-text-primary

                "

              >

                Review your career profile

              </h2>





              <p

                className="

                  mt-2

                  max-w-2xl

                  text-sm

                  leading-6

                  text-text-secondary

                "

              >

                CareerPilot extracted the

                information below from your

                resume. Review it before saving

                your profile.

              </p>



            </div>





            <button

              type="button"

              onClick={

                onReset

              }

              className="

                flex

                h-10

                shrink-0

                items-center

                justify-center

                gap-2

                border

                border-border

                px-4

                text-sm

                font-semibold

                text-slate-600

                transition

                hover:bg-slate-50

                hover:text-text-primary

              "

            >



              <RefreshCw

                size={15}

              />



              Analyze another resume



            </button>



          </div>



        </div>





        {/* PERSONAL */}



        <div

          className="

            grid

            gap-6

            border-b

            border-border

            px-6

            py-6

            sm:px-8

            md:grid-cols-2

          "

        >



          <ReviewField

            icon={UserRound}

            label="Name"

            value={

              profile.personal.name

            }

          />



          <ReviewField

            icon={FileText}

            label="Email"

            value={

              profile.personal.email

            }

          />



          <ReviewField

            icon={FileText}

            label="Phone"

            value={

              profile.personal.phone

            }

          />



          <ReviewField

            icon={MapPin}

            label="Location"

            value={

              profile.personal.location

            }

          />



        </div>





        {/* SUMMARY */}



        <div

          className="

            border-b

            border-border

            px-6

            py-6

            sm:px-8

          "

        >



          <p

            className="

              text-xs

              font-semibold

              uppercase

              tracking-[0.12em]

              text-slate-400

            "

          >

            Professional summary

          </p>





          <p

            className="

              mt-3

              max-w-4xl

              text-sm

              leading-7

              text-text-secondary

            "

          >

            {safeDisplayValue(

              profile.summary

            )}

          </p>



        </div>





        {/* CAREER DIRECTION */}



        <div

          className="

            border-b

            border-border

            px-6

            py-6

            sm:px-8

          "

        >



          <p

            className="

              text-xs

              font-semibold

              uppercase

              tracking-[0.12em]

              text-slate-400

            "

          >

            Career direction

          </p>





          <div

            className="

              mt-4

              grid

              gap-5

              md:grid-cols-3

            "

          >



            <ReviewField

              label="Primary domain"

              value={

                profile.careerProfile

                  .primaryDomain

              }

            />



            <ReviewField

              label="Experience level"

              value={

                profile.careerProfile

                  .experienceLevel

              }

            />



            <ReviewField

              label="Likely roles"

              value={

                profile.careerProfile

                  .likelyRoles

              }

            />



          </div>





          {profile.careerProfile

            .careerInterests

            .length > 0 && (

            <div

              className="

                mt-5

              "

            >



              <p

                className="

                  text-xs

                  font-medium

                  text-text-secondary

                "

              >

                Career interests

              </p>





              <div

                className="

                  mt-2

                  flex

                  flex-wrap

                  gap-2

                "

              >



                {profile.careerProfile

                  .careerInterests

                  .map(

                    (interest) => (

                      <span

                        key={

                          interest

                        }

                        className="

                          border

                          border-primary-100

                          bg-primary-50

                          px-2.5

                          py-1

                          text-xs

                          font-medium

                          text-primary-700

                        "

                      >

                        {interest}

                      </span>

                    )

                  )}



              </div>



            </div>

          )}



        </div>





        {/* EXPERIENCE */}



        <ReviewSection

          title="Experience"

          count={

            profile.experience

              .length

          }

          expanded={

            expandedSections.experience

          }

          onToggle={() =>

            toggleSection(

              "experience"

            )

          }

        >



          {profile.experience

            .length > 0 ? (

            <div

              className="

                space-y-5

              "

            >



              {profile.experience.map(

                (

                  item,

                  index

                ) => (

                  <div

                    key={

                      `${item.company}-${item.role}-${index}`

                    }

                    className="

                      border

                      border-border

                      p-4

                    "

                  >



                    <div

                      className="

                        flex

                        flex-col

                        gap-1

                        sm:flex-row

                        sm:items-start

                        sm:justify-between

                      "

                    >



                      <div>



                        <h4

                          className="

                            text-sm

                            font-semibold

                            text-text-primary

                          "

                        >

                          {safeDisplayValue(

                            item.role

                          )}

                        </h4>



                        <p

                          className="

                            mt-1

                            text-sm

                            text-primary-600

                          "

                        >

                          {safeDisplayValue(

                            item.company

                          )}

                        </p>



                      </div>





                      {(item.startDate ||

                        item.endDate) && (

                        <p

                          className="

                            text-xs

                            text-text-secondary

                          "

                        >

                          {[

                            item.startDate,

                            item.endDate,

                          ]

                            .filter(Boolean)

                            .join(

                              " - "

                            )}

                        </p>

                      )}



                    </div>





                    {item.description && (

                      <p

                        className="

                          mt-3

                          text-sm

                          leading-6

                          text-text-secondary

                        "

                      >

                        {

                          item.description

                        }

                      </p>

                    )}





                    {item.technologies

                      ?.length > 0 && (

                      <div

                        className="

                          mt-3

                          flex

                          flex-wrap

                          gap-2

                        "

                      >



                        {item.technologies.map(

                          (

                            technology

                          ) => (

                            <span

                              key={

                                technology

                              }

                              className="

                                bg-slate-100

                                px-2

                                py-1

                                text-[11px]

                                font-medium

                                text-slate-600

                              "

                            >

                              {

                                technology

                              }

                            </span>

                          )

                        )}



                      </div>

                    )}



                  </div>

                )

              )}



            </div>

          ) : (

            <EmptyReviewText />

          )}



        </ReviewSection>





        {/* EDUCATION */}



        <ReviewSection

          title="Education"

          count={

            profile.education

              .length

          }

          expanded={

            expandedSections.education

          }

          onToggle={() =>

            toggleSection(

              "education"

            )

          }

        >



          {profile.education

            .length > 0 ? (

            <div

              className="

                space-y-4

              "

            >



              {profile.education.map(

                (

                  item,

                  index

                ) => (

                  <div

                    key={

                      `${item.institution}-${item.degree}-${index}`

                    }

                    className="

                      border

                      border-border

                      p-4

                    "

                  >



                    <p

                      className="

                        text-sm

                        font-semibold

                        text-text-primary

                      "

                    >

                      {safeDisplayValue(

                        item.degree

                      )}

                    </p>





                    {item.field && (

                      <p

                        className="

                          mt-1

                          text-sm

                          text-primary-600

                        "

                      >

                        {

                          item.field

                        }

                      </p>

                    )}





                    <div

                      className="

                        mt-2

                        flex

                        flex-wrap

                        gap-x-4

                        gap-y-1

                        text-xs

                        text-text-secondary

                      "

                    >



                      {item.institution && (

                        <span>

                          {

                            item.institution

                          }

                        </span>

                      )}



                      {item.graduationYear && (

                        <span>

                          {

                            item.graduationYear

                          }

                        </span>

                      )}



                    </div>



                  </div>

                )

              )}



            </div>

          ) : (

            <EmptyReviewText />

          )}



        </ReviewSection>





        {/* SKILLS */}



        <ReviewSection

          title="Skills"

          count={

            allSkills.length

          }

          expanded={

            expandedSections.skills

          }

          onToggle={() =>

            toggleSection(

              "skills"

            )

          }

        >



          {allSkills.length > 0 ? (

            <div

              className="

                flex

                flex-wrap

                gap-2

              "

            >



              {allSkills.map(

                (

                  skill

                ) => (

                  <span

                    key={

                      skill

                    }

                    className="

                      border

                      border-border

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

            <EmptyReviewText />

          )}



        </ReviewSection>





        {/* PROJECTS */}



        <ReviewSection

          title="Projects"

          count={

            profile.projects

              .length

          }

          expanded={

            expandedSections.projects

          }

          onToggle={() =>

            toggleSection(

              "projects"

            )

          }

        >



          {profile.projects

            .length > 0 ? (

            <div

              className="

                space-y-4

              "

            >



              {profile.projects.map(

                (

                  project,

                  index

                ) => (

                  <div

                    key={

                      `${project.name}-${index}`

                    }

                    className="

                      border

                      border-border

                      p-4

                    "

                  >



                    <p

                      className="

                        text-sm

                        font-semibold

                        text-text-primary

                      "

                    >

                      {safeDisplayValue(

                        project.name

                      )}

                    </p>





                    <p

                      className="

                        mt-2

                        text-sm

                        leading-6

                        text-text-secondary

                      "

                    >

                      {safeDisplayValue(

                        project.description

                      )}

                    </p>





                    {project.technologies

                      ?.length > 0 && (

                      <div

                        className="

                          mt-3

                          flex

                          flex-wrap

                          gap-2

                        "

                      >



                        {project.technologies.map(

                          (

                            technology

                          ) => (

                            <span

                              key={

                                technology

                              }

                              className="

                                bg-slate-100

                                px-2

                                py-1

                                text-[11px]

                                font-medium

                                text-slate-600

                              "

                            >

                              {

                                technology

                              }

                            </span>

                          )

                        )}



                      </div>

                    )}



                  </div>

                )

              )}



            </div>

          ) : (

            <EmptyReviewText />

          )}



        </ReviewSection>





        {/* CERTIFICATIONS */}



        {profile.certifications

          .length > 0 && (

          <ReviewSection

            title="Certifications"

            count={

              profile

                .certifications

                .length

            }

            expanded={true}

            onToggle={() => {}}

          >



            <SimpleList

              items={

                profile.certifications

              }

            />



          </ReviewSection>

        )}





        {/* ACHIEVEMENTS */}



        {profile.achievements

          .length > 0 && (

          <ReviewSection

            title="Achievements"

            count={

              profile

                .achievements

                .length

            }

            expanded={true}

            onToggle={() => {}}

          >



            <SimpleList

              items={

                profile.achievements

              }

            />



          </ReviewSection>

        )}





        {/* SAVE */}



        <div

          className="

            border-t

            border-border

            bg-slate-50

            px-6

            py-5

            sm:px-8

          "

        >



          {savedMessage && (

            <div

              className="

                mb-4

                flex

                items-center

                gap-2

                text-sm

                font-medium

                text-emerald-600

              "

            >



              <Check

                size={16}

              />



              {savedMessage}



            </div>

          )}





          <div

            className="

              flex

              flex-col

              gap-3

              sm:flex-row

              sm:items-center

              sm:justify-between

            "

          >



            <p

              className="

                max-w-xl

                text-xs

                leading-5

                text-text-secondary

              "

            >

              Saving this profile will make the

              extracted information available

              throughout your CareerPilot

              workspace.

            </p>





            <button

              type="button"

              onClick={

                onSave

              }

              disabled={

                isSaving

              }

              className="

                flex

                h-11

                shrink-0

                items-center

                justify-center

                gap-2

                bg-primary-600

                px-6

                text-sm

                font-semibold

                text-white

                transition

                hover:bg-primary-700

                disabled:cursor-not-allowed

                disabled:opacity-60

              "

            >



              {isSaving ? (

                <>

                  <Loader2

                    size={16}

                    className="

                      animate-spin

                    "

                  />



                  Saving...

                </>

              ) : (

                <>

                  Save Career Profile



                  <ArrowRight

                    size={16}

                  />

                </>

              )}



            </button>



          </div>



        </div>



      </div>



    </div>

  );

};





/*

 * --------------------------------------

 * REVIEW SECTION

 * --------------------------------------

 */



const ReviewSection = ({

  title,

  count,

  expanded,

  onToggle,

  children,

}) => {

  return (

    <div

      className="

        border-b

        border-border

      "

    >



      <button

        type="button"

        onClick={

          onToggle

        }

        className="

          flex

          w-full

          items-center

          justify-between

          px-6

          py-5

          text-left

          sm:px-8

        "

      >



        <div

          className="

            flex

            items-center

            gap-3

          "

        >



          <span

            className="

              text-sm

              font-semibold

              text-text-primary

            "

          >

            {title}

          </span>





          <span

            className="

              bg-slate-100

              px-2

              py-0.5

              text-[11px]

              font-medium

              text-slate-500

            "

          >

            {count}

          </span>



        </div>





        <ChevronDown

          size={17}

          className={`

            text-slate-400

            transition-transform

            ${

              expanded

                ? "rotate-180"

                : ""

            }

          `}

        />



      </button>





      {expanded && (

        <div

          className="

            px-6

            pb-6

            sm:px-8

          "

        >

          {children}

        </div>

      )}



    </div>

  );

};





/*

 * --------------------------------------

 * REVIEW FIELD

 * --------------------------------------

 */



const ReviewField = ({

  icon: Icon,

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





      <div

        className="

          mt-1.5

          flex

          items-start

          gap-2

        "

      >



        {Icon && (

          <Icon

            size={15}

            className="

              mt-0.5

              shrink-0

              text-slate-400

            "

          />

        )}





        <p

          className="

            text-sm

            font-medium

            leading-6

            text-text-primary

          "

        >

          {safeDisplayValue(

            value

          )}

        </p>



      </div>



    </div>

  );

};





/*

 * --------------------------------------

 * SIMPLE LIST

 * --------------------------------------

 */



const SimpleList = ({

  items,

}) => {

  return (

    <div

      className="

        space-y-2

      "

    >



      {items.map(

        (

          item,

          index

        ) => (

          <div

            key={`${item}-${index}`}

            className="

              flex

              gap-3

              border

              border-border

              p-3

            "

          >



            <div

              className="

                mt-1.5

                h-1.5

                w-1.5

                shrink-0

                bg-primary-500

              "

            />



            <p

              className="

                text-sm

                leading-6

                text-text-secondary

              "

            >

              {item}

            </p>



          </div>

        )

      )}



    </div>

  );

};





/*

 * --------------------------------------

 * EMPTY

 * --------------------------------------

 */



const EmptyReviewText = () => {

  return (

    <p

      className="

        text-sm

        text-text-secondary

      "

    >

      No information was extracted from

      the resume for this section.

    </p>

  );

};





/*

 * --------------------------------------

 * INFO CARD

 * --------------------------------------

 */



const InfoCard = ({

  number,

  title,

  description,

}) => {

  return (

    <div

      className="

        border

        border-border

        bg-white

        p-5

      "

    >



      <p

        className="

          text-xs

          font-bold

          tracking-[0.12em]

          text-primary-600

        "

      >

        {number}

      </p>





      <h3

        className="

          mt-3

          text-sm

          font-semibold

          text-text-primary

        "

      >

        {title}

      </h3>





      <p

        className="

          mt-1

          text-xs

          leading-5

          text-text-secondary

        "

      >

        {description}

      </p>



    </div>

  );

};





/*

 * --------------------------------------

 * FILE SIZE

 * --------------------------------------

 */



const formatFileSize = (

  bytes

) => {

  if (!bytes) {

    return "0 KB";

  }





  if (bytes < 1024 * 1024) {

    return `${(

      bytes / 1024

    ).toFixed(0)} KB`;

  }





  return `${(

    bytes /

    (1024 * 1024)

  ).toFixed(2)} MB`;

};





export default Personalization;