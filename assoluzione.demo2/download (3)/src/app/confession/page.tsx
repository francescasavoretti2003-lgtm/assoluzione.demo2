'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppContext } from '@/hooks/use-app-context';
import { questions } from '@/lib/questions';
import { t } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function ConfessionPage() {
  const router = useRouter();
  const { language, profile, addAnswer } = useAppContext();
  const { firestore, user } = useFirebase();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [showFact, setShowFact] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (!showFact) {
      const isBooleanAndUnanswered = currentQuestion.type === 'boolean' && currentAnswer === null;
      const isNumericAndEmpty = currentQuestion.type === 'numeric' && (currentAnswer === null || currentAnswer === '');
      
      if (isBooleanAndUnanswered || isNumericAndEmpty) {
          setError(language === 'it' ? 'La risposta è obbligatoria.' : 'An answer is required.');
          return;
      }
      setError(null);

      const score = currentQuestion.scoring(currentAnswer);
      const answerData = {
        questionId: currentQuestion.id,
        value: currentAnswer,
        score,
        questionText: currentQuestion.text[language],
      };

      addAnswer(answerData);

      if (user) {
        const answerForDb = {
          userProfileId: user.uid,
          questionId: currentQuestion.id,
          answerText: String(currentAnswer),
          pointsAwarded: score,
          createdAt: new Date().toISOString(),
        };
        const answersColRef = collection(firestore, 'users', user.uid, 'answers');
        addDocumentNonBlocking(answersColRef, answerForDb);
      }

      setShowFact(true);
    } else {
      setShowFact(false);
      setCurrentAnswer(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        router.push('/weighing');
      }
    }
  };
  
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!profile || !user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mb-4">
        <Progress value={progressPercentage} className="w-full h-2 bg-primary/20" />
        <p className="text-center text-sm text-muted-foreground mt-2 font-code">
          {currentQuestionIndex + 1} / {questions.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-card/30 border-border/50 backdrop-blur-sm overflow-hidden">
            <CardHeader>
              <p className="text-xl md:text-2xl text-center font-code leading-relaxed">
                {currentQuestion.text[language]}
              </p>
            </CardHeader>
            <CardContent className="min-h-[150px] flex items-center justify-center">
              {!showFact && (
                <div className="w-full max-w-sm">
                  {currentQuestion.type === 'boolean' && (
                    <RadioGroup
                      onValueChange={(val) => setCurrentAnswer(val === 'true')}
                      className="flex items-center justify-center gap-8"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="r1" />
                        <Label htmlFor="r1" className="text-lg">{t('booleanYes', language)}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="r2" />
                        <Label htmlFor="r2" className="text-lg">{t('booleanNo', language)}</Label>
                      </div>
                    </RadioGroup>
                  )}
                  {currentQuestion.type === 'numeric' && (
                    <Input
                      type="number"
                      value={currentAnswer || ''}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="0"
                      className="text-center text-2xl h-16 max-w-xs mx-auto font-code"
                      min="0"
                    />
                  )}
                   {currentQuestion.type === 'open' && (
                    <Textarea
                        value={currentAnswer || ''}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder={t('yourAnswer', language)}
                        className="text-center text-lg min-h-[100px] font-code"
                    />
                    )}
                    {error && <p className="text-destructive text-center mt-2">{error}</p>}
                </div>
              )}
              <AnimatePresence>
                {showFact && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <p className="text-accent font-bold mb-2 glitch">{t('fact', language)}</p>
                    <p className="text-muted-foreground italic">
                      {currentQuestion.fact[language]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={handleNext} className="font-bold w-48">
                {showFact
                  ? currentQuestionIndex === questions.length - 1
                    ? t('finishConfession', language)
                    : t('next', language)
                  : t('submit', language)}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
      <div className="text-center mt-12 text-muted-foreground font-code text-sm animate-pulse-slow">
        <p>"Confess. Admit. Recognize. Purify yourself."</p>
        <p>"You are not alone. We are all guilty. We are all small. We are all complicit."</p>
      </div>
    </div>
  );
}
    