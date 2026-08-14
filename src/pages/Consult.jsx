import { useState } from "react";
import QuestionSurvey from "../components/consult/QuestionSurvey";
import { useNavigate } from "react-router-dom";

export default function Consult() {
  const [step, setStep] = useState("questions");
  const [, setAnswers] = useState([]);
  const navigate = useNavigate();

  const finishQuestions = (result) => {
    setAnswers(result);
    setStep("judging");
    navigate("/report", { replace: true });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {step === "questions" && <QuestionSurvey onDone={finishQuestions} />}
      {step === "judging" && <div className="flex-1" />}
    </div>
  );
}
