import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { apiService } from '@/services/api';

interface Question {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
}

export const TakeQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // TODO: Replace with API call when bearer token is available
    // const fetchQuiz = async () => {
    //   try {
    //     const data = await apiService.get<Quiz>(`/api/quizzes/quizzes/${id}/`);
    //     setQuiz(data);
    //     setTimeRemaining(data.duration * 60); // Convert minutes to seconds
    //   } catch (error) {
    //     console.error('Error fetching quiz:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchQuiz();

    // Dummy data
    setTimeout(() => {
      setQuiz({
        id: id || '1',
        title: 'Math Quiz - Chapter 5',
        description: 'This quiz covers algebraic equations and linear functions.',
        duration: 30,
        questions: [
          {
            id: 'q1',
            question: 'What is the solution to 2x + 5 = 15?',
            type: 'MULTIPLE_CHOICE',
            options: ['x = 5', 'x = 10', 'x = 7', 'x = 3'],
          },
          {
            id: 'q2',
            question: 'The slope of a horizontal line is zero.',
            type: 'TRUE_FALSE',
            options: ['True', 'False'],
          },
          {
            id: 'q3',
            question: 'Explain the concept of linear functions in your own words.',
            type: 'SHORT_ANSWER',
          },
        ],
      });
      setTimeRemaining(30 * 60);
      setLoading(false);
    }, 500);
  }, [id]);

  useEffect(() => {
    if (timeRemaining > 0 && quiz) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, quiz]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      // TODO: Replace with API call when bearer token is available
      // await apiService.post(`/api/quizzes/quizzes/${id}/submit/`, {
      //   answers: answers,
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Quiz submitted successfully!');
      navigate('/app/student/quizzes');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || !quiz) {
    return <div>Loading quiz...</div>;
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{quiz.title}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{quiz.description}</p>
          </div>
          <div style={{ 
            background: timeRemaining < 300 ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            fontSize: '1.25rem'
          }}>
            Time: {formatTime(timeRemaining)}
          </div>
        </div>
        <div style={{ 
          background: 'var(--bg-color)',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          <div style={{
            background: 'var(--primary-color)',
            height: '100%',
            width: `${progress}%`,
            transition: 'width 0.3s'
          }} />
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
      </div>

      <div className="content-section">
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
            {question.question}
          </h2>

          {question.type === 'MULTIPLE_CHOICE' && question.options && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {question.options.map((option, index) => (
                <label
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    border: `2px solid ${answers[question.id] === option ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    background: answers[question.id] === option ? '#eff6ff' : 'white',
                  }}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    style={{ marginRight: '0.75rem' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {question.type === 'TRUE_FALSE' && question.options && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              {question.options.map((option) => (
                <label
                  key={option}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem 2rem',
                    border: `2px solid ${answers[question.id] === option ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    background: answers[question.id] === option ? '#eff6ff' : 'white',
                  }}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    style={{ marginRight: '0.75rem' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {question.type === 'SHORT_ANSWER' && (
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="input"
              rows={6}
              placeholder="Type your answer here..."
            />
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
              >
                Next
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

