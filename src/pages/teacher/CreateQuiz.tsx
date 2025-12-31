import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField } from '@/components/FormField';
// import { apiService } from '@/services/api';

export const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class: '',
    subject: '',
    dueDate: '',
    duration: '',
    maxScore: '',
    instructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Replace with API call when bearer token is available
      // const quizData = {
      //   title: formData.title,
      //   description: formData.description,
      //   class_obj: formData.class,
      //   subject: formData.subject,
      //   due_date: formData.dueDate,
      //   duration_minutes: parseInt(formData.duration),
      //   max_score: formData.maxScore ? parseFloat(formData.maxScore) : undefined,
      //   instructions: formData.instructions,
      //   status: 'DRAFT',
      // };
      // await apiService.post('/api/quizzes/quizzes/', quizData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Quiz created successfully!');
      navigate('/app/teacher/quizzes');
    } catch (err) {
      setError('Failed to create quiz. Please try again.');
      console.error('Error creating quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Quiz</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Create a new quiz for your students</p>
      </div>

      <div className="content-section">
        <form onSubmit={handleSubmit}>
          <FormField
            label="Quiz Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Math Quiz - Chapter 5"
          />

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Quiz description and learning objectives"
          />

          <FormField
            label="Class"
            name="class"
            type="select"
            value={formData.class}
            onChange={handleChange}
            required
            options={[
              { value: '1', label: 'Mathematics 101' },
              { value: '2', label: 'Science 201' },
              { value: '3', label: 'History 301' },
            ]}
          />

          <FormField
            label="Subject"
            name="subject"
            type="select"
            value={formData.subject}
            onChange={handleChange}
            required
            options={[
              { value: '1', label: 'Mathematics' },
              { value: '2', label: 'Science' },
              { value: '3', label: 'History' },
            ]}
          />

          <FormField
            label="Due Date & Time"
            name="dueDate"
            type="datetime-local"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />

          <FormField
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            required
            placeholder="30"
          />

          <FormField
            label="Max Score"
            name="maxScore"
            type="number"
            value={formData.maxScore}
            onChange={handleChange}
            placeholder="100"
            min="0"
            step="0.01"
          />

          <FormField
            label="Instructions"
            name="instructions"
            type="textarea"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Additional instructions for students"
          />

          {error && <div className="error-message">{error}</div>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Quiz'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/app/teacher/quizzes')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

