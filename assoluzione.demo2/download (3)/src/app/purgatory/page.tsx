'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAppContext } from '@/hooks/use-app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { Participant } from '@/lib/types';
import { Loader2 } from 'lucide-react';


export default function PurgatoryPage() {
  const router = useRouter();
  const { profile, language, answers } = useAppContext();
  const { user, firestore } = useFirebase();

  const participantsCol = useMemoFirebase(() => collection(firestore, 'participants'), [firestore]);
  const { data: participants, isLoading: isLoadingParticipants } = useCollection<Participant>(participantsCol);

  const [step, setStep] = useState(0); 
  const [tribunalIndex, setTribunalIndex] = useState(0);
  const [judgement, setJudgement] = useState<'guilty' | 'not_guilty' | null>(null);

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);
  
  const otherParticipants = useMemo(() => {
      if (!participants || !user) return [];
      // Only show participants who have a fault and are not the current user
      return participants.filter(p => p.id !== user.uid && p.biggestFault);
  }, [participants, user]);

  const currentUserParticipantDoc = useMemoFirebase(() => user ? doc(firestore, 'participants', user.uid) : null, [user, firestore]);
  const { data: currentUserParticipant, isLoading: isLoadingCurrentUserParticipant } = useDoc<Participant>(currentUserParticipantDoc);


  const isEnglish = language === 'en';
  
  const handleJudgement = (verdict: 'guilty' | 'not_guilty') => {
    setJudgement(verdict);
    setTimeout(() => {
      if (tribunalIndex < otherParticipants.length -1 && tribunalIndex < 2) { // Judge up to 3 people
        setTribunalIndex(tribunalIndex + 1);
        setJudgement(null);
      } else {
        setStep(1); // Move to revealing user's fault
      }
    }, 1500);
  };
  
  const getBiggestFault = () => {
    if (currentUserParticipant?.biggestFault) {
        return currentUserParticipant.biggestFault;
    }
    // Fallback if not loaded yet
    const sortedAnswers = Object.values(answers).sort((a, b) => b.score - a.score);
    if(sortedAnswers.length > 0) {
      return isEnglish ? `Your biggest impact comes from: ${sortedAnswers[0].questionText}` : `Il tuo impatto maggiore deriva da: ${sortedAnswers[0].questionText}`;
    }
    return isEnglish ? "Your complicity is perfectly distributed." : "La tua complicità è perfettamente distribuita.";
  };

  const currentParticipantToJudge = otherParticipants[tribunalIndex];
  
  if (!user || !profile) return null;
  
  if (isLoadingParticipants || isLoadingCurrentUserParticipant) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
              <Loader2 className="h-16 w-16 animate-spin text-accent"/>
              <p className="mt-4 text-muted-foreground font-code">{isEnglish ? "Entering Purgatory..." : "Entrando nel Purgatorio..."}</p>
          </div>
      )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center bg-card/30 border-border/50 backdrop-blur-sm">
        <CardContent className="p-6">
          {step === 0 && currentParticipantToJudge && (
            <motion.div key={tribunalIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold mb-4 glitch">{isEnglish ? 'The Tribunal' : 'Il Tribunale'}</h2>
              <Image
                src={currentParticipantToJudge.photoUrl!}
                alt={currentParticipantToJudge.name}
                width={128}
                height={128}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-border"
                data-ai-hint="person portrait"
              />
              <p className="text-lg font-bold">{currentParticipantToJudge.name}</p>
              <p className="text-muted-foreground font-code text-xl my-4">
                "{currentParticipantToJudge.biggestFault}"
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <Button variant="destructive" onClick={() => handleJudgement('guilty')} disabled={!!judgement}>
                    {isEnglish ? 'GUILTY' : 'COLPEVOLE'}
                </Button>
                <Button variant="secondary" onClick={() => handleJudgement('not_guilty')} disabled={!!judgement}>
                    {isEnglish ? 'NOT GUILTY' : 'NON COLPEVOLE'}
                </Button>
              </div>
              {judgement && <p className="mt-4 text-accent animate-pulse">{isEnglish ? 'Judgement cast.' : 'Giudizio emesso.'}</p>}
            </motion.div>
          )}

          {step === 0 && !currentParticipantToJudge && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-lg mb-4">{isEnglish ? 'The tribunal is empty. You are the first to confess.' : 'Il tribunale è vuoto. Sei il primo a confessare.'}</p>
                <Button onClick={() => setStep(1)}>{isEnglish ? 'Face your judgement' : 'Affronta il tuo giudizio'}</Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-lg mb-4">
                {profile.name}, {isEnglish ? 'according to the system, your greatest fault is:' : 'secondo il sistema, la tua colpa più grande è:'}
              </p>
              <p className="text-2xl text-accent font-code font-bold my-6">
                {getBiggestFault()}
              </p>
              <Button onClick={() => setStep(2)}>{isEnglish ? 'Continue' : 'Continua'}</Button>
            </motion.div>
          )}

          {step === 2 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <p className="text-2xl text-accent font-bold">
                    {isEnglish ? "No absolution available." : "Non c'è assoluzione disponibile."}
                </p>
                <p className="text-muted-foreground">
                    {isEnglish ? "No purgatory long enough. No digital paradise. There is only the loop." : "Non c'è purgatorio abbastanza lungo. Non c'è paradiso digitale. C'è solo il loop."}
                </p>
                <p className="text-muted-foreground">
                    {isEnglish ? "You will go back to scrolling. You will go back to buying. You will go back to forgetting." : "Tornerai a scrollare. Tornerai a comprare. Tornerai a dimenticare."}
                </p>
                <p className="text-xl font-bold">
                    {isEnglish ? "And tomorrow, you will be guilty again." : "E domani, sarai colpevole di nuovo."}
                </p>
                <p className="text-3xl font-bold glitch">
                    {isEnglish ? "Welcome to the cyclical hell." : "Benvenuto all'inferno ciclico."}
                </p>
                <Button onClick={() => router.push('/finale')} className="w-full mt-4">{isEnglish ? "There is no escape" : "Non c'è uscita"}</Button>
             </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
    