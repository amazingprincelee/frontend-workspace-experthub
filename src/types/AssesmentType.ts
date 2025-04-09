export interface AssesmentType {
  message:     string;
  assessments: Assessments;
  [key: string]: any;
}

export interface Assessments {
  title:     string;
  assesment: AssesmentElement[];
  _id:       string;
  __v:       number;
}

export interface AssesmentElement {
  question:           string;
  answerA:            string;
  answerB:            string;
  answerC:            string;
  correctAnswerIndex: number;
  _id:                string;
}
