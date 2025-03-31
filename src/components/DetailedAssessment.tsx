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

    function submitQuestion(option: string) {
        setAnswers([...answers, option]);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            alert("Assessment complete! Thank you for your responses.");
            console.log("Detailed Answers:", answers);
        }
    }

    return (
        <div>
            <h2>{questions[currentQuestionIndex].body}</h2>
            {questions[currentQuestionIndex].options.map((option, index) => (
                <button key={index} onClick={() => submitQuestion(option)}>
                    {option}
                </button>
            ))}
        </div>
    );
}
