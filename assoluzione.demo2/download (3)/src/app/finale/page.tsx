'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppContext } from '@/hooks/use-app-context';
import { Button } from '@/components/ui/button';

export default function FinalePage() {
  const router = useRouter();
  const { profile, language, resetState } = useAppContext();
  const [step, setStep] = useState(0);
  const [finalChoice, setFinalChoice] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) {
      router.push('/');
    }
  }, [profile, router]);

  const handleExit = () => {
    resetState();
    // A slight delay to show the final message before redirecting
    setTimeout(() => {
        router.push('/');
    }, 4000);
  }

  const isEnglish = language === 'en';

  const finaleSteps = [
    // Step 0: The Impossible Promise
    {
      title: isEnglish ? "Do you want to get out of this system?" : "Vuoi uscire da questo sistema?",
      texts: [
        isEnglish ? "You can't get out. The system is bigger than you. You were born into it. You will die in it." : "Non puoi uscire. Il sistema è più grande di te. Sei nato dentro. Morirai dentro.",
        isEnglish ? "Every action you take feeds the system. Even this performance." : "Ogni tua azione alimenta il sistema. Anche questa performance.",
        isEnglish ? "Even now, as you read this, you are consuming energy extracted from somewhere. You are using a device assembled by someone else. You are living on an Earth that is running out." : "Anche ora, mentre leggi questo, stai consumando energia estratta da qualche parte. Stai usando un dispositivo assemblato da qualcun altro. Stai vivendo su una Terra che si sta esaurendo.",
        isEnglish ? "And the worst part? You know. You know and you continue. Because you have to. Because you are small. Because you are human." : "E la cosa peggiore? Lo sai. Lo sai e continui. Perché devi. Perché sei piccolo. Perché sei umano."
      ]
    },
    // Step 1: The Privilege of Feeling Guilty
    {
      title: isEnglish ? "Do you know what distinguishes you from those who truly suffer?" : "Sai cosa ti distingue da chi veramente soffre?",
      texts: [
        isEnglish ? "You can afford to feel guilty. You can afford to reflect." : "Tu puoi permetterti di sentirti in colpa. Tu puoi permetterti di riflettere.",
        isEnglish ? "Those who are dying have no time for guilt. Those who are fleeing have no time for introspection. Those who are suffering do not have the luxury of existential guilt." : "Chi sta morendo non ha tempo per la colpa. Chi sta fuggendo non ha tempo per l'introspezione. Chi sta soffrendo non ha il lusso del senso di colpa esistenziale.",
        isEnglish ? "Your guilt is a privilege." : "Il tuo senso di colpa è un privilegio.",
        isEnglish ? "And that makes it even more unbearable, doesn't it?" : "E questo lo rende ancora più insopportabile, vero?"
      ]
    },
    // Step 2: The Final Mirror
    {
      title: isEnglish ? "Who is responsible for all this?" : "Chi è responsabile di tutto questo?",
      texts: [
        isEnglish ? "Here he is. It's you. It's you every time you buy. It's you every time you scroll. It's you every time you turn on this screen." : "Eccolo. Sei tu. Sei tu ogni volta che compri. Sei tu ogni volta che scrolli. Sei tu ogni volta che accendi questo schermo.",
        isEnglish ? "But it's not just you. It's us. All of us. 8 billion little accomplices. 8 billion powerless culprits." : "Ma non sei solo tu. Siamo noi. Tutti. 8 miliardi di piccoli complici. 8 miliardi di impotenti colpevoli.",
        isEnglish ? "You are not special in your guilt. You are normal." : "Non sei speciale nella tua colpa. Sei normale."
      ]
    },
    // Step 3: The Circle
    {
      title: isEnglish ? "You can exit this app. But you can't exit this circle." : "Puoi uscire da questa app. Ma non puoi uscire da questo circolo.",
      texts: [
        isEnglish ? "Tomorrow you will wake up. You will pick up your phone. You will see news of war, of poverty, of crisis." : "Domani ti sveglierai. Prenderai il telefono. Vedrai notizie di guerra, di povertà, di crisi.",
        isEnglish ? "You will feel bad. You will feel helpless. You will feel guilty." : "Ti sentirai male. Ti sentirai impotente. Ti sentirai in colpa.",
        isEnglish ? "Then you will continue your day. Because you have to. Because you are small. Because you are human." : "Poi continuerai la tua giornata. Perché devi. Perché sei piccolo. Perché sei umano.",
        isEnglish ? "This is hell. Not the flames. Not the torture. But knowing and being able to do nothing." : "Questo è l'inferno. Non le fiamme. Non le torture. Ma sapere e non poter fare niente.",
        isEnglish ? "Welcome. You've been living in it forever." : "Benvenuto. Ci vivi già da sempre."
      ]
    },
    // Step 4: Final Question
    {
      title: isEnglish ? "One question before you leave:" : "Una sola domanda prima di uscire:",
      texts: [isEnglish ? "What will you do tomorrow?" : "Cosa farai domani?"]
    },
    // Step 5: Final statement
    {
        title: finalChoice,
        texts: [
            isEnglish ? "Whatever you do, remember: you are neither hero nor monster. You are just small. Like all of us." : "Qualunque cosa tu faccia, ricorda: non sei né eroe né mostro. Sei solo piccolo. Come tutti noi.",
            isEnglish ? "And maybe that's the only thing that absolves us. And maybe it doesn't absolve us at all." : "E forse questo è l'unica cosa che ci assolve. E forse non ci assolve affatto."
        ]
    }
  ];

  if (!profile) return null;

  const currentStep = finaleSteps[step];
  
  const handleChoice = (choice: string) => {
    switch(choice) {
        case 'change': setFinalChoice(isEnglish ? "No, you won't. But that's okay. The intention is human." : "No, non lo farai. Ma va bene. L'intenzione è umana."); break;
        case 'continue': setFinalChoice(isEnglish ? "At least you're honest. Most of us are." : "Almeno sei onesto. La maggior parte di noi lo fa."); break;
        case 'dunno': setFinalChoice(isEnglish ? "That's the only honest answer. Nobody knows." : "Questa è l'unica risposta onesta. Nessuno sa."); break;
    }
    setStep(step + 1);
  }

  const renderContent = () => {
    if (step < 4) { // Text-only steps
      return (
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1.5, staggerChildren: 0.5 } }} className="space-y-6">
          <h2 className="text-3xl font-bold text-accent glitch">{currentStep.title}</h2>
          {currentStep.texts.map((text, i) => <p key={i} className="text-xl text-muted-foreground">{text}</p>)}
          <Button onClick={() => setStep(step + 1)} className="mt-8">{isEnglish ? 'Continue' : 'Continua'}</Button>
        </motion.div>
      );
    }
    if (step === 4) { // Question step
      return (
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-accent">{currentStep.title}</h2>
            <p className="text-xl text-muted-foreground">{currentStep.texts[0]}</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
                <Button className="flex-1" onClick={() => handleChoice('change')}>{isEnglish ? "I WILL CHANGE EVERYTHING" : "CAMBIERÒ TUTTO"}</Button>
                <Button className="flex-1" onClick={() => handleChoice('continue')}>{isEnglish ? "I WILL CONTINUE AS ALWAYS" : "CONTINUERÒ COME SEMPRE"}</Button>
                <Button className="flex-1" onClick={() => handleChoice('dunno')}>{isEnglish ? "I DON'T KNOW" : "NON LO SO"}</Button>
            </div>
        </motion.div>
      );
    }
    if (step === 5) { // Final statement and exit
        return (
            <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-accent">{currentStep.title}</h2>
                {currentStep.texts.map((text, i) => <p key={i} className="text-xl text-muted-foreground">{text}</p>)}
                <Button onClick={handleExit} className="mt-8 w-1/2">{isEnglish ? 'EXIT' : 'ESCI'}</Button>
            </motion.div>
        );
    }
    if (step === 6) { // Post-exit message
        return (
            <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1 } }} className="space-y-6">
                 <p className="text-xl text-muted-foreground">{isEnglish ? "See you tomorrow. When you pick up the phone again. When you see the news again. When you feel guilty again. And continue anyway." : "Ci vediamo domani. Quando prenderai di nuovo il telefono. Quando vedrai di nuovo le notizie. Quando ti sentirai di nuovo in colpa. E continuerai comunque."}</p>
                 <p className="text-2xl font-bold text-accent mt-4">{isEnglish ? "Because this is being human in the digital hell." : "Perché questo è essere umani nell'inferno digitale."}</p>
            </motion.div>
        )
    }
    return null;
  };
  
  if (step === 5 && !finalChoice) return null; // Wait for choice

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-center">
      <div className="max-w-3xl w-full">
        {renderContent()}
      </div>
    </div>
  );
}
