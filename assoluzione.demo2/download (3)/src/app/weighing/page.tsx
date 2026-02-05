'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';
import { useAppContext } from '@/hooks/use-app-context';
import { getPersonalizedActions } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function WeighingPage() {
  const router = useRouter();
  const { profile, totalScore, answers, language, setAiResponse, setIsLoadingAi, isLoadingAi } = useAppContext();
  const { firestore, user } = useFirebase();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!profile) {
      router.push('/');
    }
  }, [profile, router]);

  const handleGetActions = async () => {
    setIsLoadingAi(true);
    const confessionData = Object.values(answers).reduce((acc, ans) => {
        acc[ans.questionText] = ans.value;
        return acc;
    }, {} as Record<string, any>);

    const aiResult = await getPersonalizedActions({ confessionData, language });
    setAiResponse(aiResult);
    
    if (user && aiResult?.summary) {
      const participantRef = doc(firestore, 'participants', user.uid);
      updateDocumentNonBlocking(participantRef, { biggestFault: aiResult.summary });
    }
    
    setIsLoadingAi(false);
    setStep(3);
  };
  
  const averageScore = 42; // Fictional average
  const isEnglish = language === 'en';

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
            <p className="text-xl text-center mb-4">{isEnglish ? "Your guilt score:" : "Il tuo punteggio di colpa:"}</p>
            <p className="text-8xl font-bold text-center glitch mb-4">{totalScore}</p>
            <p className="text-xl text-center text-muted-foreground">{isEnglish ? "Average:" : "Media:"} {averageScore}</p>
            <Button onClick={() => setStep(1)} className="w-full mt-8">Continue</Button>
          </motion.div>
        );
      case 1:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <p className="text-2xl text-accent mb-6">
              {isEnglish ? "You are normal. You are like everyone else. You are as complicit as everyone else." : "Sei nella norma. Sei come tutti. Sei complice come tutti."}
            </p>
            <p className="font-code text-lg text-muted-foreground">
              {isEnglish ? "Your phone usage today contributed to:" : "Il tuo utilizzo del telefono oggi ha contribuito a:"}
            </p>
            <ul className="mt-4 space-y-2 text-left max-w-sm mx-auto font-code">
              <li><span className="text-accent">></span> 0.003 grams of CO2</li>
              <li><span className="text-accent">></span> 0.0000001% of the profit of an arms company</li>
              <li><span className="text-accent">></span> 2 minutes of worker exploitation</li>
              <li><span className="text-accent">></span> 0.5 seconds of attention stolen from a real crisis</li>
            </ul>
             <Button onClick={() => setStep(2)} className="w-full mt-8">Continue</Button>
          </motion.div>
        );
      case 2:
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <p className="text-3xl font-bold mb-8">
                    {isEnglish ? "Too small to be guilty. Too numerous to be innocent." : "Troppo piccolo per essere colpevole. Troppo numeroso per essere innocente."}
                </p>
                <p className="text-xl text-muted-foreground mb-12">
                    {isEnglish ? "We are 8 billion culprits. 8 billion accomplices. 8 billion too small to be punished. 8 billion too large to be absolved. There is no expiation. There is no ritual. There is no purification. There is only the scroll. Again. And again. And again." : "Siamo 8 miliardi di colpevoli. 8 miliardi di complici. 8 miliardi troppo piccoli per essere puniti. 8 miliardi troppo grandi per essere assolti. Non c'è espiazione. Non c'è rituale. Non c'è purificazione. C'è solo lo scroll. Ancora. E ancora. E ancora."}
                </p>
                <p className="text-2xl font-bold text-accent mb-6 glitch-subtle">{isEnglish ? "Do you want to do something concrete?" : "Vuoi fare qualcosa di concreto?"}</p>
                <Button onClick={handleGetActions} disabled={isLoadingAi} className="w-1/2">
                    {isLoadingAi ? <Loader2 className="animate-spin" /> : (isEnglish ? "YES" : "SI")}
                </Button>
            </motion.div>
        );
      case 3:
        return <ActionSuggestion onDone={() => router.push('/privilege')} />;
      default:
        return null;
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-transparent border-none shadow-none">
        <CardContent className="p-2 md:p-6">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}

function ActionSuggestion({ onDone }: { onDone: () => void }) {
    const { language, aiResponse } = useAppContext();
    const [step, setStep] = useState(0);
    const isEnglish = language === 'en';

    if (!aiResponse) return <p>Loading suggestions...</p>;

    const actions = aiResponse.suggestedActions.split('\n').filter(s => s.trim().length > 0);

    const content = () => {
        switch (step) {
            case 0:
                return (
                    <>
                        <p className="text-lg text-muted-foreground mb-4">{isEnglish ? "Here are 5 concrete actions:" : "Ecco 5 azioni concrete:"}</p>
                        <ul className="space-y-3 text-left font-code">
                            {actions.map((action, index) => (
                                <li key={index} className="border border-border/50 p-3 rounded-md hover:bg-white/5 transition-colors">
                                  <button onClick={() => setStep(1)} className="w-full text-left">{action}</button>
                                </li>
                            ))}
                        </ul>
                    </>
                );
            case 1:
                return (
                    <div className="space-y-6">
                        <p className="text-2xl">{isEnglish ? "Done. Feel better? For how long?" : "Fatto. Ti senti meglio? Per quanto tempo?"}</p>
                        <p className="text-muted-foreground">{isEnglish ? "Tomorrow there will be another tragedy. Another video. Another petition." : "Domani ci sarà un'altra tragedia. Un altro video. Un'altra petizione."}</p>
                        <p className="text-muted-foreground">{isEnglish ? "How long can you sustain it? A day? A week? A year?" : "Quanto puoi sostenere? Un giorno? Una settimana? Un anno?"}</p>
                        <p className="text-xl">{isEnglish ? "Sooner or later, you'll go back to your life. Because you have to. Because you are small." : "Prima o poi, tornerai alla tua vita. Perché devi. Perché sei piccolo."}</p>
                        <p className="text-accent font-bold">{isEnglish ? "Being small is not an excuse. But it is the truth." : "Essere piccoli non è una scusa. Ma è la verità."}</p>
                        <Button onClick={onDone} className="mt-8 w-full">
                            {isEnglish ? "Understand your privilege" : "Comprendi il tuo privilegio"} <ArrowRight className="ml-2" />
                        </Button>
                    </div>
                )
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            {content()}
        </motion.div>
    );
}
    