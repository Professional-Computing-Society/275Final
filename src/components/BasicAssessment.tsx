import React, { useState } from "react";
// import { Button } from "react-bootstrap";
// import { Question } from "../interfaces/question";

const questions = [
    {
        body: "How do you like to solve problems?",
        options: ["Utilizing creativity", "Through teamwork", "Experimenting", "Analyzing previous solutions and data"]
    },
    {
        body: "When do you feel most in flow?",
        options: ["When faced with a challenge", "When helping others", "When experimenting freely", "When everything is organized", "When you can let your imagination run free"]
    },
];
const answers = [];

export function BasicAssessment(): React.JSX.Element {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    
    function submitQuestion(option: string) {
        setAnswers([...answers, option]);
        if(currentQuestionIndex < questions.length -1) {
            setCurrentQuestionIndex(currentQuestionIndex+1);
        }
    }

    return (
        <div>
            <h2>{questions[currentQuestionIndex].body}</h2>
            {questions[currentQuestionIndex].options.map(( option, index) => (
                <button
                    key={index}
                    onClick={() => submitQuestion(option)}
                    >
                    {option}
                </button>
            ))}

        </div> 
    );
}
