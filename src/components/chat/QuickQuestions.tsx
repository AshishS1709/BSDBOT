interface QuickQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

const QuickQuestions = ({ questions, onSelect }: QuickQuestionsProps) => {
  return (
    <div className="flex flex-col gap-1 px-4 py-2 ml-10">
      {questions.map((question, index) => (
        <button
          key={index}
          onClick={() => onSelect(question)}
          className="text-left px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all border-b border-gray-100 last:border-b-0"
        >
          {question}
        </button>
      ))}
    </div>
  );
};

export default QuickQuestions;
