interface QuickQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

const QuickQuestions = ({ questions, onSelect }: QuickQuestionsProps) => {
  return (
    <div className="flex flex-col gap-2 px-4 py-3 ml-10">
      {questions.map((question, index) => (
        <button
          key={index}
          onClick={() => onSelect(question)}
          className="text-left px-4 py-2.5 text-sm font-medium text-black bg-orange-400 hover:bg-orange-500 rounded-lg transition-all shadow-sm"
        >
          {question}
        </button>
      ))}
    </div>
  );
};

export default QuickQuestions;
