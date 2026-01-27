interface QuickQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

const QuickQuestions = ({ questions, onSelect }: QuickQuestionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {questions.map((question, index) => (
        <button
          key={index}
          onClick={() => onSelect(question)}
          className="px-3 py-2 text-xs font-medium rounded-full bg-primary/10 text-primary-foreground border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all"
        >
          {question}
        </button>
      ))}
    </div>
  );
};

export default QuickQuestions;
