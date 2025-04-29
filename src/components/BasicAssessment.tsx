import React, { useState, useEffect } from "react";
import { ProgressBar } from "./ProgressBar";
import "./BasicAssessment.css";
import { chat, generateJobImage, extractJobTitle } from "../chat";
import ReactMarkdown from "react-markdown";
import { BounceLoader } from "react-spinners";
import { jsPDF } from "jspdf";

const questions = [
  {
    body: "What do you like to do?",
    options: ["Build things", "Help people", "Be creative", "Figure things out"]
  },
  {
    body: "Which working style resonates most with you?",
    options: ["Collaborating with a team toward a shared goal", "Independently pursuing your vision", "Engaging in hands-on, practical tasks", "Strategically planning and analyzing before acting"]
  },
  {
    body: "Which skill comes most naturally to you?",
    options: ["Repairing or improving the physical world", "Building relationships through conversation", "Innovating through art, design, or storytelling", "Solving logical or analytical challenges"]
  },
  {
    body: "How do you pick up new skills fastest?",
    options: ["Jump in and get hands-on", "Watch someone else first", "Read up and research", "Listen and soak it in"]
  },
  {
    body: "What type of project most excites you?",
    options: ["Collaborations with a group", "Independent challenges", "Inventive, open-ended creative endeavors", "Rigorous problem-solving tasks that test your intellect"]
  },
  {
    body: "What kind of projects excite you the most?",
    options: ["Group projects", "Solo challenges", "Creative builds", "Problem-solving tasks"]
  },
  {
    body: "How do you handle mistakes or setbacks?",
    options: ["Learn and try again", "Ask for help", "Look for creative alternatives", "Pause and reflect before continuing"]
  },
  {
    body: "What kinds of challenges do you find most rewarding?",
    options: ["Hands-on construction or repair work", "Facilitating solutions for interpersonal issues", "Generating fresh, original concepts", "Unraveling complex puzzles and problems"]
  },
  {
    body: "Where do you feel most productive?",
    options: ["In a workshop or lab", "In conversations with others", "In a creative space", "In a quiet place to think"]
  },
  {
    body: "Which tool would you pick for a school project?",
    options: ["Screwdriver", "Whiteboard marker", "Paintbrush", "Calculator"]
  }
];


export function BasicAssessment(): React.JSX.Element {
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
    const saved = localStorage.getItem("basicAssessmentProgress");
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
      // Toggle off selection
      updatedAnswers[currentQuestionIndex] = "";
    } else {
      updatedAnswers[currentQuestionIndex] = option;
    }

    setAnswers(updatedAnswers);

    localStorage.setItem("basicAssessmentProgress", JSON.stringify({
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
      console.log("Basic Assessment Answers:", answers);
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
      const response = await chat(answers);
      const finalResponse = response || "Sorry, something went wrong.";
      setGptResponse(response || "Sorry, something went wrong.");

      // Extract the first job title and generate an image
      if (response) {
        const jobTitle = extractJobTitle(response);
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

      generatePDF(finalResponse);

    } catch (err: any) {
      setError(err.message);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  function generatePDF(finalResponse: string) {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(46, 125, 50); // Green color
    doc.text("You're all done!", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Black
    doc.text("Here's your personalized career insight:", 105, 30, { align: "center" });

    // If we have a job image, add it to the PDF
    if (jobImage) {
      try {
        doc.addImage(jobImage, 'JPEG', 75, 40, 60, 60);
        
        // Add report content below the image
        doc.setFillColor(240, 248, 240); // light greenish
        doc.roundedRect(10, 110, 190, 170, 5, 5, 'F');

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const textLines = doc.splitTextToSize(finalResponse, 180);
        doc.text(textLines, 15, 120);
      } catch (err) {
        console.error("Error adding image to PDF:", err);
        
        // If image fails, just add the text content with original formatting
        doc.setFillColor(240, 248, 240); // light greenish
        doc.roundedRect(10, 40, 190, 230, 5, 5, 'F');

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const textLines = doc.splitTextToSize(finalResponse, 180);
        doc.text(textLines, 15, 50);
      }
    } else {
      // Original PDF formatting if no image
      doc.setFillColor(240, 248, 240); // light greenish
      doc.roundedRect(10, 40, 190, 230, 5, 5, 'F');

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const textLines = doc.splitTextToSize(finalResponse, 180);
      doc.text(textLines, 15, 50);
    }

    const pdfBlob = doc.output("blob");
    setPdfFile(pdfBlob);
  }

  function restartAssessment() {
    localStorage.removeItem("basicAssessmentProgress");
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
            <h2>{questions[currentQuestionIndex].body}</h2>
            <div className="options">
              {questions[currentQuestionIndex].options.map((option, index) => (
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
                fontWeight: "Semi-bold",
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
              <p>Here's your personalized career insight:</p>
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
                      a.download = "BasicAssessmentReport.pdf";
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
