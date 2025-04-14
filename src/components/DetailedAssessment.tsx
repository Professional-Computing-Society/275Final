import React, { useState } from "react";
import { ProgressBar } from "./ProgressBar"

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

    function submitQuestion(option: string) {
        const updatedAnswers = [...answers, option];
        setAnswers(updatedAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsComplete(true);
            console.log("Detailed Answers:", updatedAnswers);
        }
    }

    return (
    <div className="assessment" style={{ color: "white" }}>
      {!isComplete ? (
        <>
          <div className="question">
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
            </div>
          </div>
                    <ProgressBar current={currentQuestionIndex } total={questions.length} />
                </>
            ) : (
                
                <div
                    className="result-box"
                >
                    <h3>Assessment complete!</h3>
                    <p>Thank you for your responses.</p>
                </div>
            )}
        </div>
    );
}
