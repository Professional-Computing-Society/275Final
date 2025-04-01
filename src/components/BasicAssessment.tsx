import React, { useState } from "react";

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
    }
];

export function BasicAssessment(): React.JSX.Element {
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
            console.log("Basic Assessment Answers:", updatedAnswers);
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
                                backgroundColor: "#f9f9f9"
                            }}
                        >
                            {option}
                        </button>
                    ))}
                </>
            ) : (
                <div
                    style={{
                        border: "2px solid #28a745",
                        borderRadius: "8px",
                        padding: "20px",
                        backgroundColor: "#eaffea",
                        color: "#155724",
                        textAlign: "center",
                        maxWidth: "500px",
                        margin: "0 auto"
                    }}
                >
                    <h3>You're all done!</h3>
                    <p>Thanks for completing the basic questions.</p>
                </div>
            )}
        </div>
    );
}
