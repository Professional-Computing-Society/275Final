import React, { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import "./BasicAssessment.css";  

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
        <div className="assessment-container">
            {!isComplete ? (
                <>
                    <div className="question-container">
                        <h2>{questions[currentQuestionIndex].body}</h2>
                        {questions[currentQuestionIndex].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => submitQuestion(option)}
                                className="option-button"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <ProgressBar current={currentQuestionIndex} total={questions.length} />
                </>
            ) : (
                <div className="result-box">
                    <h3>You're all done!</h3>
                    <p>Thanks for completing the basic questions.</p>
                </div>
            )}
        </div>
    );
}
