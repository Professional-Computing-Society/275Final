import React, { useState, useEffect } from "react";
import { ProgressBar } from "./ProgressBar";
import "./DetailedAssessment.css";
import { chat, generateJobImage, extractJobTitle } from "../chat";
import ReactMarkdown from "react-markdown";
import { BounceLoader } from "react-spinners";
import { jsPDF } from "jspdf";

const questions = [
  {
    body: "What type of work environment allows you to perform at your best?",
    options: [
      "Fast-paced and constantly evolving",
      "Structured, stable, and well-organized",
      "Creative, open-ended, and flexible",
      "Independent, self-driven, and autonomous",
      "Collaborative, team-oriented, and socially engaging"
    ]
  },
  {
    body: "Which of these tasks do you find most appealing?",
    options: [
      "Tackling complex technical challenges",
      "Leading teams and orchestrating projects",
      "Designing and crafting compelling visuals",
      "Supporting and counseling individuals",
      "Uncovering patterns through data analysis"
    ]
  },
  {
    body: "What is your primary source of motivation in your work?",
    options: [
      "Driving innovation and advancement",
      "Positively impacting people's lives",
      "Earning recognition for achievements",
      "Mastering new skills and deepening expertise",
      "Achieving financial security and career stability"
    ]
  },
  {
    body: "How do you typically approach decision-making?",
    options: [
      "Ground decisions in data and empirical evidence",
      "Trust intuition and instinct",
      "Seek input and advice from others",
      "Engage in deep analysis and careful reasoning",
      "Experiment and adapt through hands-on experience"
    ]
  },
  {
    body: "How would you most enjoy spending a free afternoon?",
    options: [
      "Constructing or building something tangible",
      "Volunteering to help others",
      "Creating art, designs, or visuals",
      "Reading, researching, and expanding knowledge",
      "Organizing a social or group event"
    ]
  },
  {
    body: "What role do you naturally take within a team setting?",
    options: [
      "Leader and strategic coordinator",
      "Creative innovator and idea generator",
      "Supportive facilitator and helper",
      "Researcher and critical analyst",
      "Hands-on implementer and problem-solver"
    ]
  },
  {
    body: "Which skill would you most like to strengthen or refine?",
    options: [
      "Leadership and management abilities",
      "Technical proficiency and expertise",
      "Creative expression and innovation",
      "Empathy, communication, and interpersonal skills",
      "Strategic thinking and long-term planning"
    ]
  },
  {
    body: "When encountering an unfamiliar task, how do you respond?",
    options: [
      "Dive in and learn through trial and error",
      "Seek advice and mentorship",
      "Research extensively before acting",
      "Draw connections to existing knowledge",
      "Deconstruct the task into manageable steps"
    ]
  },
  {
    body: "What type of work leaves you feeling most energized?",
    options: [
      "Collaborative creative brainstorming",
      "Coaching and empowering others",
      "Building, fixing, or crafting solutions",
      "Analyzing complex data or systems",
      "Planning, organizing, and executing initiatives"
    ]
  },
  {
    body: "When beginning a new project, what is your natural instinct?",
    options: [
      "Envision the final outcome vividly",
      "Draft a detailed checklist or plan",
      "Identify collaborators and team dynamics",
      "Explore possibilities and experiment freely",
      "Define the core problem or challenge to address"
    ]
  }
];

export function DetailedAssessment(): React.JSX.Element {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [gptResponse, setGptResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Generating your career insight...");
  const [error, setError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [jobImage, setJobImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("detailedAssessmentProgress");
    if (saved) {
      const { answers, index } = JSON.parse(saved);
      if (index < questions.length) {
        setAnswers(answers);
        setCurrentQuestionIndex(index);
      }
    }
  }, []);

  function selectAnswer(option: string) {
    const updatedAnswers = [...answers];

    if (updatedAnswers[currentQuestionIndex] === option) {
      updatedAnswers[currentQuestionIndex] = "";
    } else {
      updatedAnswers[currentQuestionIndex] = option;
    }

    setAnswers(updatedAnswers);

    localStorage.setItem("detailedAssessmentProgress", JSON.stringify({
      answers: updatedAnswers,
      index: currentQuestionIndex
    }));
  }

  function handleNext() {
    if (!answers[currentQuestionIndex]) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 2500);
      return;
    }

    const newIndex = currentQuestionIndex + 1;

    if (newIndex >= questions.length) {
      setIsComplete(true);
      generateCareerReport(answers);
      console.log("Detailed Assessment Answers:", answers);
    } else {
      setCurrentQuestionIndex(newIndex);
    }
  }

  async function generateCareerReport(answers: string[]) {
    setLoading(true);
    setError(null);

    const messages = [
      "Analyzing your answers...",
      "Matching your skills to career paths...",
      "Finalizing your personalized report..."
    ];
    let messageIndex = 0;

    const interval = setInterval(() => {
      setLoadingMessage(messages[messageIndex]);
      messageIndex = (messageIndex + 1) % messages.length;
    }, 2000);

    try {
      const response = await chat(answers, "detailed");
      setGptResponse(response || "Sorry, something went wrong.");
      
      if (response) {
        const jobTitle = extractJobTitle(response, "detailed");
        if (jobTitle) {
          console.log("Job title extracted:", jobTitle);
          setImageLoading(true);
          const imageUrl = await generateJobImage(jobTitle);
          if (imageUrl) {
            setJobImage(imageUrl);
          }
          setImageLoading(false);
        }
      }
      
      generatePDF(response || "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  function generatePDF(responseText: string) {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(46, 125, 50);
    doc.text("Detailed Career Assessment", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Here's your personalized career insight:", 105, 30, { align: "center" });
    
    const cleanedText = responseText.replace(/\*\*(.*?)\*\*/g, '$1');
    const lines = cleanedText.split("\n");
    const yStart = jobImage ? 120 : 50;
  
    if (jobImage) {
      try {
        doc.addImage(jobImage, 'JPEG', 75, 40, 60, 60);
        doc.setFillColor(240, 248, 240);
        doc.roundedRect(10, 110, 190, 170, 5, 5, 'F');
      } catch {
        doc.setFillColor(240, 248, 240);
        doc.roundedRect(10, 40, 190, 230, 5, 5, 'F');
      }
    } else {
      doc.setFillColor(240, 248, 240);
      doc.roundedRect(10, 40, 190, 230, 5, 5, 'F');
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
  
    let y = yStart;
    lines.forEach((line: string) => {
      let formattedLine = line.trimStart();
  
      if (formattedLine.startsWith("* ")) {
        formattedLine = "• " + formattedLine.slice(2);
      }
  
      const wrapped = doc.splitTextToSize(formattedLine, 180);
      doc.text(wrapped, 15, y);
      y += wrapped.length * 7;
    });

    const pdfBlob = doc.output("blob");
    setPdfFile(pdfBlob);
  }

  function restartAssessment() {
    localStorage.removeItem("detailedAssessmentProgress");
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setIsComplete(false);
    setGptResponse(null);
    setError(null);
    setJobImage(null);
    setPdfFile(null);
  }

  return (
    <div className="assessment-container">
      {!isComplete ? (
        <>
          <div className="question-container">
            <h2>{questions[currentQuestionIndex]?.body}</h2>
            <div className="options">
              {questions[currentQuestionIndex]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(option)}
                  className={`option-button ${answers[currentQuestionIndex] === option ? "selected" : ""}`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
              <button
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                  }
                }}
                className="cool-button"
              >
                ←
              </button>

              <button
                onClick={restartAssessment}
                className="cool-button"
              >
                Reset
              </button>

              <button
                onClick={handleNext}
                className="cool-button"
              >
                →
              </button>
            </div>

            {showWarning && (
              <div style={{
                color: "red",
                textAlign: "center",
                marginTop: "10px",
                fontWeight: "bold",
                animation: "fadeIn 0.3s ease"
              }}>
                ⚠️ Please select an answer before continuing.
              </div>
            )}
          </div>
          <ProgressBar current={answers.filter(Boolean).length} total={questions.length} />
        </>
      ) : (
        <div className="result-box">
          <h3>You're all done!</h3>
          {loading ? (
            <div className="loading-container">
              <BounceLoader color="#4CAF50" size={70} />
            <p className="loading-message">{loadingMessage}</p>
          </div>
          ) : error ? (
            <>
              <p style={{ color: "red" }}>Error: {error}</p>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
                <button onClick={restartAssessment} className="cool-button">
                  Restart Assessment
                </button>
              </div>
            </>
          ) : (
            <>
              <p>Here's your personalized detailed career assessment:</p>
              {imageLoading && <p>Generating job image...</p>}
              {jobImage && (
                <div style={{ maxWidth: "300px", margin: "0 auto", marginBottom: "20px" }}>
                  <img src={jobImage} alt="Job visualization" style={{ width: "100%", borderRadius: "8px" }} />
                </div>
              )}
              <div className="chatgpt-response">
                <ReactMarkdown>{gptResponse || ""}</ReactMarkdown>
              </div>
              {pdfFile && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                  <button
                    className="cool-button"
                    onClick={() => {
                      const url = URL.createObjectURL(pdfFile);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "DetailedCareerReport.pdf";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download Career Report as PDF
                  </button>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
                <button onClick={restartAssessment} className="cool-button">
                  Restart Assessment
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
