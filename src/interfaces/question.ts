/** A representation of a Question in a quizzing application */
export interface Question {
    /** The instructions and content of the Question */
    body: string;
    /** The possible answers for a Question (for Multiple Choice questions) */
    options: string[];
}
