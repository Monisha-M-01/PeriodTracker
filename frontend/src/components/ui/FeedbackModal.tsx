import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { submitFeedbackFn, type FeedbackData } from '../../api/feedback.api';
import { Button } from './Button';

const QUESTIONS = [
  {
    id: 'q1',
    text: '1. How would you rate your overall experience using Ritvi?',
    options: [
      { emoji: '😍', label: 'Amazing! I love it.', value: 'amazing' },
      { emoji: '🙂', label: 'Good, it works well.', value: 'good' },
      { emoji: '😐', label: 'Okay, it does the job.', value: 'okay' },
      { emoji: '😕', label: 'Needs some improvement.', value: 'needs_improvement' },
      { emoji: '😡', label: 'Terrible, I’m frustrated.', value: 'terrible' },
    ]
  },
  {
    id: 'q2',
    text: '2. How accurate have our period and fertility predictions been for you?',
    options: [
      { emoji: '🎯', label: 'Spot on every time!', value: 'spot_on' },
      { emoji: '👍', label: 'Mostly accurate.', value: 'mostly_accurate' },
      { emoji: '🤷‍♀️', label: 'Hit or miss.', value: 'hit_or_miss' },
      { emoji: '👎', label: 'Often wrong.', value: 'often_wrong' },
      { emoji: '❌', label: 'Completely off.', value: 'completely_off' },
    ]
  },
  {
    id: 'q3',
    text: '3. How easy is it to navigate the app and log your dates/symptoms?',
    options: [
      { emoji: '🚀', label: 'Super easy and fast.', value: 'super_easy' },
      { emoji: '🚶‍♀️', label: 'Fairly easy once you get used to it.', value: 'fairly_easy' },
      { emoji: '⚖️', label: 'Manageable, but could be smoother.', value: 'manageable' },
      { emoji: '🧗‍♀️', label: 'A bit tricky to find things.', value: 'tricky' },
      { emoji: '🧱', label: 'Very difficult and confusing.', value: 'difficult' },
    ]
  },
  {
    id: 'q4',
    text: '4. How helpful do you find the wellness features (like Relax, Insights, and Learn)?',
    options: [
      { emoji: '🌟', label: 'Life-changing! I use them all the time.', value: 'life_changing' },
      { emoji: '🧘‍♀️', label: 'Very helpful for my routine.', value: 'very_helpful' },
      { emoji: '💡', label: 'Somewhat helpful.', value: 'somewhat_helpful' },
      { emoji: '🥱', label: 'I barely use them.', value: 'barely_use' },
      { emoji: '🚫', label: 'Not helpful at all.', value: 'not_helpful' },
    ]
  },
  {
    id: 'q5',
    text: '5. How likely are you to recommend Ritvi to a friend?',
    options: [
      { emoji: '💯', label: 'Definitely! Already have.', value: 'definitely' },
      { emoji: '💖', label: 'Very likely.', value: 'very_likely' },
      { emoji: '🤔', label: 'Maybe, if it comes up.', value: 'maybe' },
      { emoji: '😬', label: 'Unlikely.', value: 'unlikely' },
      { emoji: '🙅‍♀️', label: 'Never.', value: 'never' },
    ]
  }
];

export const FeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [wantsToWrite, setWantsToWrite] = useState<Record<string, boolean>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [finalFeedback, setFinalFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkShouldShow = () => {
      const isCompleted = localStorage.getItem('feedbackCompleted');
      if (isCompleted === 'true') return;

      const skippedAt = localStorage.getItem('feedbackSkippedAt');
      if (skippedAt) {
        const skippedTime = parseInt(skippedAt, 10);
        const now = Date.now();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        if (now - skippedTime < ONE_DAY_MS) {
          return; // Skip, less than 24 hours ago
        }
      }

      setIsOpen(true);
    };

    // Slight delay to not interrupt immediate login navigation too jarringly
    const timer = setTimeout(checkShouldShow, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    localStorage.setItem('feedbackSkippedAt', Date.now().toString());
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < 5) {
      alert('Please answer all 5 questions to submit.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const data: FeedbackData = {
        q1Rating: answers['q1'],
        q1Text: texts['q1'],
        q2Rating: answers['q2'],
        q2Text: texts['q2'],
        q3Rating: answers['q3'],
        q3Text: texts['q3'],
        q4Rating: answers['q4'],
        q4Text: texts['q4'],
        q5Rating: answers['q5'],
        q5Text: texts['q5'],
        finalSuggestions: finalFeedback
      };
      
      await submitFeedbackFn(data);
      localStorage.setItem('feedbackCompleted', 'true');
      setIsOpen(false);
    } catch (e) {
      console.error('Failed to submit feedback:', e);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-card w-full md:w-1/2 max-h-[80vh] md:max-h-[60vh] overflow-y-auto rounded-2xl shadow-2xl border border-primary/20 flex flex-col relative hide-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/90 backdrop-blur z-10 p-4 border-b border-primary/10 flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-primary">We value your feedback!</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSkip}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium px-2 py-1 rounded-md hover:bg-primary/5"
                >
                  Skip for now
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="space-y-4">
                  <p className="font-medium text-foreground text-lg">{q.text}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.label }))}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          answers[q.id] === opt.label 
                            ? 'bg-primary border-primary text-primary-foreground shadow-md' 
                            : 'bg-card border-primary/20 hover:bg-primary/5 hover:border-primary/40'
                        }`}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <span className="text-sm font-medium leading-tight">{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {answers[q.id] && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      className="bg-primary/5 rounded-xl p-4 mt-4"
                    >
                      <p className="text-sm font-medium text-foreground mb-3">
                        Do you want to write related to this question to improve?
                      </p>
                      <div className="flex gap-2 mb-3">
                        <button 
                          onClick={() => setWantsToWrite(prev => ({ ...prev, [q.id]: true }))}
                          className={`px-4 py-1.5 text-sm rounded-full font-bold transition-colors ${
                            wantsToWrite[q.id] === true ? 'bg-primary text-white' : 'bg-background border border-primary/20 text-primary hover:bg-primary/10'
                          }`}
                        >
                          YES
                        </button>
                        <button 
                          onClick={() => setWantsToWrite(prev => ({ ...prev, [q.id]: false }))}
                          className={`px-4 py-1.5 text-sm rounded-full font-bold transition-colors ${
                            wantsToWrite[q.id] === false ? 'bg-muted-foreground text-white' : 'bg-background border border-muted text-muted-foreground hover:bg-muted/10'
                          }`}
                        >
                          NO
                        </button>
                      </div>

                      {wantsToWrite[q.id] && (
                        <motion.textarea
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          value={texts[q.id] || ''}
                          onChange={(e) => setTexts(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Tell us more..."
                          className="w-full bg-background border border-primary/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                        />
                      )}
                    </motion.div>
                  )}
                </div>
              ))}

              <div className="pt-6 border-t border-primary/10 space-y-3">
                <p className="font-medium text-foreground text-lg">
                  Do you wish to add any other features or see anything deleted? Let the team know. Any suggestions?
                </p>
                <textarea
                  value={finalFeedback}
                  onChange={(e) => setFinalFeedback(e.target.value)}
                  placeholder="Your suggestions matter to us..."
                  className="w-full bg-background border border-primary/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-card/90 backdrop-blur p-4 border-t border-primary/10 flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting || Object.keys(answers).length < 5}>
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
