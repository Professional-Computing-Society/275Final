import React, { useState, useEffect } from "react";
import { ProgressBar } from "./ProgressBar";
import "./BasicAssessment.css";
import { chat } from "../chat";
import ReactMarkdown from "react-markdown";

const questions = [
  {
    body: "What do you like to do?",
    options: ["Build things", "Help people", "Be creative", "Figure things out"]
  },
  {
    body: "What do you enjoy more?",
    options: ["Working with others", "Working alone", "Doing hands-on work", "Thinking and planning"]
  },
  {
    body: "What are you good at?",
    options: ["Fixing things", "Talking to people", "Drawing or making art", "Solving puzzles"]
  },
  {
    body: "How do you learn best?",
    options: ["By doing", "By watching", "By reading", "By listening"]
  },
  {
    body: "What makes you excited?",
    options: ["Trying new things", "Helping someone", "Finishing a project", "Learning something cool"]
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
    body: "What kind of challenges do you enjoy?",
    options: ["Hands-on tasks", "Helping others solve issues", "Coming up with ideas", "Solving tricky problems"]
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
      setGptResponse(response || "Sorry, something went wrong.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  function restartAssessment() {
    localStorage.removeItem("basicAssessmentProgress");
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
            <p>Generating your career insight...</p>
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
