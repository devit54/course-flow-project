
import React, { useState } from 'react';
import { quizData } from '../../data/courses.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface QuizProps {
  courseId: number;
  lessonId: number;
  onNavigate: (page: string, courseId?: number, lessonId?: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ courseId, lessonId, onNavigate }) => {
  const questions = quizData[courseId] || [];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 mb-4">Chưa có bài kiểm tra cho khóa học này</p>
            <Button onClick={() => onNavigate('lesson', courseId, lessonId)}>
              Quay lại bài học
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    
    if (finalScore >= 70) {
      toast.success(`Chúc mừng! Bạn đã đạt ${finalScore}% điểm!`);
    } else {
      toast.error(`Bạn đạt ${finalScore}% điểm. Hãy học lại để cải thiện!`);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Kết quả bài kiểm tra</CardTitle>
            <CardDescription>
              Bạn đã hoàn thành bài kiểm tra
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${
                score >= 70 ? 'text-green-500' : 'text-red-500'
              }`}>
                {score}%
              </div>
              <p className="text-lg text-gray-600">
                {score >= 70 ? 'Xuất sắc!' : 'Cần cải thiện'}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Chi tiết đáp án:</h3>
              {questions.map((q, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === q.correct;
                
                return (
                  <div key={q.id} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">
                      Câu {index + 1}: {q.question}
                    </h4>
                    <div className="space-y-2">
                      {q.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded text-sm ${
                            optionIndex === q.correct
                              ? 'bg-green-100 text-green-800 font-medium'
                              : optionIndex === userAnswer && !isCorrect
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-50'
                          }`}
                        >
                          {option}
                          {optionIndex === q.correct && ' ✓'}
                          {optionIndex === userAnswer && !isCorrect && ' ✗'}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <p className="mt-2 text-sm text-gray-600 italic">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <Button onClick={resetQuiz} variant="outline" className="flex-1">
                Làm lại
              </Button>
              <Button 
                onClick={() => onNavigate('lesson', courseId, lessonId)}
                className="flex-1"
              >
                Quay lại bài học
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Bài kiểm tra</CardTitle>
            <span className="text-sm text-gray-500">
              Câu {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-4">
              {question.question}
            </h3>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-elearning-primary bg-elearning-primary/5'
                      : 'border-gray-200 hover:border-elearning-primary/50 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-elearning-primary bg-elearning-primary'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              ← Câu trước
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className={currentQuestion === questions.length - 1 ? 'btn-gradient' : ''}
            >
              {currentQuestion === questions.length - 1 ? 'Nộp bài' : 'Câu tiếp →'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
