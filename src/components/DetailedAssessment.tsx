import React, { useState, useEffect } from "react";
import { ProgressBar } from "./ProgressBar";
import "./DetailedAssessment.css";
import { chat } from "../chat";
import ReactMarkdown from "react-markdown";

const questions = [
  {
    body: "What type of work environment do you thrive in?",
    options: ["Fast-paced and dynamic", "Structured and predictable", "Creative and flexible", "Independent and autonomous", "Collaborative and team-focused"]
  },
  {
    body: "Which of these tasks appeals to you most?",
    options: ["Solving complex technical problems", "Leading and managing projects", "Designing and creating visuals", "Helping and counseling people", "Analyzing data and patterns"]
  },
  {
    body: "What motivates you in your work?",
    options: ["Innovation and progress", "Making a difference in people's lives", "Recognition and achievement", "Mastering skills and knowledge", "Financial success and stability"]
  },
  {
    body: "How do you prefer to make decisions?",
    options: ["With data and evidence", "Based on intuition", "By consulting with others", "After deep analysis", "Through hands-on experimentation"]
  },
  {
    body: "Which activity would you choose for a free afternoon?",
    options: ["Building something", "Volunteering", "Painting or designing", "Reading or researching", "Organizing a group event"]
  },
  {
    body: "What role do you usually take in a team setting?",
    options: ["Leader or organizer", "Idea generator", "Supporter or helper", "Researcher or analyst", "Hands-on contributor"]
  },
  {
    body: "Which skill would you most like to develop further?",
    options: ["Leadership", "Technical expertise", "Creative expression", "Empathy and communication", "Strategic thinking"]
  },
  {
    body: "How do you approach unfamiliar tasks?",
    options: ["Jump in and experiment", "Ask for guidance", "Research thoroughly", "Try to connect it to something I know", "Break it into smaller parts"]
  },
  {
    body: "What kind of work gives you the most energy?",
    options: ["Creative brainstorming", "Helping others improve", "Building or fixing something", "Analyzing complex data", "Organizing and managing"]
  },
  {
    body: "When starting a new project, whats your first instinct?",
    options: ["Visualize the result", "Make a checklist", "Ask who Im working with", "Explore what's possible", "Define the problem"]
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  function restartAssessment() {
    localStorage.removeItem("detailedAssessmentProgress");
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setIsComplete(false);
    setGptResponse(null);
    setError(null);
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
              <div className="spinner"></div>
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
              <div className="chatgpt-response">
                <ReactMarkdown>{gptResponse || ""}</ReactMarkdown>
              </div>
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
