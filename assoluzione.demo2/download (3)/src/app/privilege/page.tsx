'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAppContext } from '@/hooks/use-app-context';
import { Button } from '@/components/ui/button';

export default function PrivilegePage() {
  const router = useRouter();
  const { profile, language } = useAppContext();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!profile) {
      router.push('/');
    }
  }, [profile, router]);

  const isEnglish = language === 'en';

  const texts = [
    [
        { text: isEnglish ? "You own this device. 3 billion people do not have internet access." : "Possiedi questo dispositivo. 3 miliardi di persone non hanno accesso a internet.", type: 'main' },
        { text: isEnglish ? "You are part of an artistic performance. According to WHO and UNICEF, about 2.2 billion people lack access to safe drinking water." : "Stai facendo una performance artistica. Secondo l'OMS e l'UNICEF, circa 2,2 miliardi di persone mancano di accesso ad acqua potabile sicura.", type: 'main' },
        { text: isEnglish ? "You have time to feel guilty. Many don't have time to survive." : "Hai tempo per sentirti in colpa. Molti non hanno tempo per sopravvivere.", type: 'main' },
    ],
    [
        { text: isEnglish ? "Your privilege is not a choice. It's a fact." : "Il tuo privilegio non è una scelta. È un fatto.", type: 'main' },
        { text: isEnglish ? "Feeling guilty? You should. Do you need to? No." : "Ti senti in colpa? Dovresti. Ti serve? No.", type: 'accent' },
    ],
    [
        { text: isEnglish ? "Alright. You're not a monster. You're human. You're limited. You're small." : "Va bene. Non sei un mostro. Sei umano. Sei limitato. Sei piccolo.", type: 'main' },
        { text: isEnglish ? "But you are small with an iPhone. You are small with clean water. You are small with a roof." : "Ma sei piccolo con un iPhone. Sei piccolo con acqua pulita. Sei piccolo con un tetto.", type: 'main' },
        { text: isEnglish ? "Your smallness is privileged." : "La tua piccolezza è privilegiata.", type: 'accent' },
    ],
    [
        { text: isEnglish ? "And that makes you feel even more guilty. Because it's not enough to be small. You are small AND lucky." : "E questo ti fa sentire ancora più in colpa. Perché non basta essere piccoli. Sei piccolo E fortunato.", type: 'main' },
        { text: isEnglish ? "While others are small AND damned." : "Mentre altri sono piccoli E dannati.", type: 'accent' },
    ]
  ];

  const handleNext = () => {
    if (step < texts.length - 1) {
      setStep(step + 1);
    } else {
      router.push('/purgatory');
    }
  };
  
  if (!profile) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
        className="max-w-3xl w-full space-y-6"
      >
        {texts[step].map((line, index) => (
          <p key={index} className={`
            ${line.type === 'main' ? 'text-2xl md:text-3xl text-muted-foreground' : ''}
            ${line.type === 'accent' ? 'text-3xl md:text-4xl text-accent font-bold glitch-subtle' : ''}
          `}>
            {line.text}
          </p>
        ))}
      </motion.div>
      <div className="mt-12 w-full max-w-3xl">
        <Button onClick={handleNext} className="w-full md:w-1/2 mx-auto">
            {isEnglish ? "Enter Purgatory" : "Entra nel Purgatorio"}
            <ArrowRight className="ml-2"/>
        </Button>
      </div>
    </div>
  );
}
