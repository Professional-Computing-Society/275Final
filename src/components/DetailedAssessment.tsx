import React, { useState } from "react";
import { ProgressBar } from "./ProgressBar"
import "./DetailedAssessment.css";
import { chat } from "../chat";
import ReactMarkdown from 'react-markdown';
import { useEffect } from "react";


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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("detailedAssessmentProgress");
        if (saved) {
            const { answers, index } = JSON.parse(saved);
            setAnswers(answers);
            setCurrentQuestionIndex(index);
            if (index >= questions.length) {
                setIsComplete(true);
                generateCareerReport(answers);
            }
        }
    }, []);

    function submitQuestion(option: string) {
        const updatedAnswers = [...answers, option];
        const newIndex = currentQuestionIndex + 1;
    
        setAnswers(updatedAnswers);
        setCurrentQuestionIndex(newIndex);
    
        // Save to localStorage
        localStorage.setItem("detailedAssessmentProgress", JSON.stringify({
            answers: updatedAnswers,
            index: newIndex
        }));
    
        if (newIndex >= questions.length) {
            setIsComplete(true);
            generateCareerReport(updatedAnswers);
            console.log("Detailed Assessment Answers:", updatedAnswers);
        }
    }
    

    async function generateCareerReport(answers: string[]) {
        setLoading(true);
        setError(null);
    
        try {
            const response = await chat(answers, "detailed");
            setGptResponse(response || "Sorry, something went wrong.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                  onClick={() => submitQuestion(option)}
                  className="option-button"
                >
                  {option}
                </button>
              ))}
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
            onClick={() => {
            localStorage.removeItem("detailedAssessmentProgress");
            window.location.reload();
            }}
            className="cool-button"
        >
            Reset
        </button>

        <button
            onClick={() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
            }}
            className="cool-button"
        >
            →
        </button>
        </div>


            </div>
          </div>
          <ProgressBar current={currentQuestionIndex} total={questions.length} />
        </>
      ) : (
        <div className="result-box">
            <h3>You're all done!</h3>
            {loading ? (
                <p>Generating your detailed career assessment...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : (
                <>
                    <p>Here's your personalized detailed career assessment:</p>
                    <div className="chatgpt-response">
                        <ReactMarkdown>{gptResponse || ""}</ReactMarkdown>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
                        <button
                            onClick={() => {
                                localStorage.removeItem("detailedAssessmentProgress");
                                window.location.reload();
                            }}
                            className="cool-button"
                        >
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
