import React, { useState } from "react";

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
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            {!isComplete ? (
                <>
                    <h2>{questions[currentQuestionIndex].body}</h2>
                    {questions[currentQuestionIndex].options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => submitQuestion(option)}
                            style={{
                                display: "block",
                                margin: "10px 0",
                                padding: "10px 15px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                cursor: "pointer",
                                backgroundColor: "#f0f0f0"
                            }}
                        >
                            {option}
                        </button>
                    ))}
                </>
            ) : (
                <div
                    style={{
                        border: "2px solid #4CAF50",
                        borderRadius: "8px",
                        padding: "20px",
                        backgroundColor: "#e6ffe6",
                        color: "#2d572c",
                        textAlign: "center",
                        maxWidth: "500px",
                        margin: "0 auto"
                    }}
                >
                    <h3>Assessment complete!</h3>
                    <p>Thank you for your responses.</p>
                </div>
            )}
        </div>
    );
}
