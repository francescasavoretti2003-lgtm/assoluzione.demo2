import type { Question } from './types';

export const questions: Question[] = [
    // IMPACTO ENERGETICO E CARBON FOOTPRINT
    {
      id: 'q1',
      category: 'energy',
      type: 'numeric',
      text: {
        en: 'How many high-definition (HD or 4K) videos do you watch on average per week?',
        it: 'Quanti video in alta definizione (HD o 4K) guardi mediamente in una settimana?',
      },
      fact: {
        en: 'Video streaming accounts for 80% of global data traffic. Each hour of video consumes about 0.5 kg of CO₂; the global network now emits more greenhouse gases than the entire aviation industry.',
        it: "Lo streaming video rappresenta l'80% del traffico dati mondiale. Ogni ora di video consuma circa 0,5 kg di CO₂; la rete globale emette ormai più gas serra dell'intera industria aeronautica.",
      },
      scoring: (value) => Number(value) || 0,
    },
    {
      id: 'q2',
      category: 'energy',
      type: 'boolean',
      text: {
        en: 'Do you have a habit of keeping thousands of old emails, photos, or files in your "free" storage spaces (Google, iCloud, etc.)?',
        it: 'Hai l\'abitudine di conservare migliaia di e-mail, foto o file vecchi nei tuoi spazi di archiviazione "gratuiti" (Google, iCloud, etc.)?',
      },
      fact: {
        en: "The world's data centers consume about 200 terawatt-hours of electricity per year, more than the entire nation of Iran, to keep the silicon warehouses needed for your forgotten files active.",
        it: "I data center mondiali consumano circa 200 terawattora di elettricità all'anno, più dell'intera nazione dell'Iran, per mantenere attivi i magazzini di silicio necessari ai tuoi file dimenticati.",
      },
      scoring: (value) => (value ? 5 : 0),
    },
    {
      id: 'q3',
      category: 'energy',
      type: 'open',
      text: {
        en: 'When you search for something on Google or ask an AI for information, how much do you think it costs in terms of resources?',
        it: "Quando cerchi qualcosa su Google o chiedi un'informazione a un'IA, quanto pensi che costi in termini di risorse?",
      },
      fact: {
        en: 'Since 2012, the computing power used to train individual AI models has increased tenfold each year, leading to an exponential growth in energy consumption for simple clicks.',
        it: "Dal 2012, la potenza di calcolo usata per addestrare i singoli modelli di IA è aumentata di un fattore dieci ogni anno, portando a una crescita esponenziale dei consumi energetici per semplici clic.",
      },
      scoring: () => 5,
    },
     {
      id: 'q4',
      category: 'energy',
      type: 'boolean',
      text: {
        en: 'Do you regularly use voice assistants like Alexa or Siri for trivial tasks?',
        it: 'Utilizzi regolarmente assistenti vocali come Alexa o Siri per compiti banali?',
      },
      fact: {
        en: 'Every voice request you make requires "cloud" processing that activates servers thousands of kilometers away, feeding a system that subtracts water and energy from the local communities where the data centers reside.',
        it: "Ogni tua richiesta vocale richiede un'elaborazione in \"cloud\" che attiva server lontani migliaia di chilometri, alimentando un sistema che sottrae acqua ed energia alle comunità locali in cui i data center risiedono.",
      },
      scoring: (value) => (value ? 5 : 0),
    },
    {
      id: 'q5',
      category: 'energy',
      type: 'numeric',
      text: {
        en: 'How many tabs do you keep open simultaneously in your browser each day?',
        it: 'Quante schede (tab) tieni aperte contemporaneamente sul tuo browser ogni giorno?',
      },
      fact: {
        en: 'Keeping dozens of pages active requires constant RAM and CPU consumption; multiplied by billions of users, this contributes to the 100 million tons of CO₂ emitted annually by data centers alone.',
        it: 'Mantenere attive decine di pagine richiede un consumo costante di RAM e CPU; moltiplicato per miliardi di utenti, questo contribuisce ai 100 milioni di tonnellate di CO₂ emessi annualmente dai soli data center.',
      },
      scoring: (value) => Number(value) || 0,
    },
    // ESTRAZIONE DI RISORSE E PRODUZIONE HARDWARE
    {
      id: 'q11',
      category: 'hardware',
      type: 'numeric',
      text: {
        en: 'How often do you change your smartphone (in years)?',
        it: 'Ogni quanti anni cambi il tuo smartphone?',
      },
      fact: {
        en: 'The average life of a smartphone is only 4.7 years; this cycle of planned obsolescence fuels the unsustainable extraction of rare minerals in conflict zones.',
        it: 'La vita media di uno smartphone è di soli 4,7 anni; questo ciclo di obsolescenza programmata alimenta l\'estrazione insostenibile di minerali rari in zone di conflitto.',
      },
      scoring: (value) => Math.max(0, 5 - Number(value)) || 0,
    },
    {
        id: 'q12',
        category: 'hardware',
        type: 'boolean',
        text: {
            en: 'Do you own more than one computer or tablet, even if you don\'t use them all at the same time?',
            it: 'Possiedi più di un computer o tablet, anche se non li usi tutti contemporaneamente?',
        },
        fact: {
            en: 'Most of the carbon emissions from modern mobile devices and computers come from production and infrastructure, not from their final use.',
            it: 'La maggior parte delle emissioni di carbonio dei moderni dispositivi mobili e computer deriva dalla produzione e dall\'infrastruttura, non dal loro utilizzo finale.',
        },
        scoring: (value) => value ? 5 : 0,
    },
    {
        id: 'q13',
        category: 'hardware',
        type: 'open',
        text: {
            en: 'Where do you think your old electronic devices end up?',
            it: 'Dove finiscono, secondo te, i tuoi vecchi dispositivi elettronici?',
        },
        fact: {
            en: 'The tech industry generates millions of tons of electronic waste that often end up in toxic "black lakes" in Mongolia or illegal landfills in Africa, poisoning soil and water.',
            it: 'L\'industria tecnologica genera milioni di tonnellate di rifiuti elettronici che spesso finiscono in "laghi neri" tossici in Mongolia o discariche illegali in Africa, avvelenando suolo e acqua.',
        },
        scoring: () => 5,
    },
    // LAVORO E COSTI SOCIALI INVISIBILI
    {
        id: 'q21',
        category: 'labor',
        type: 'open',
        text: {
            en: 'Who do you think "teaches" artificial intelligence to distinguish one image from another?',
            it: 'Chi pensi che "insegni" all\'intelligenza artificiale a distinguere un\'immagine da un\'altra?',
        },
        fact: {
            en: 'Thousands of underpaid "data workers" in developing countries spend hours labeling images for pennies, living in conditions of extreme exploitation.',
            it: 'Migliaia di "lavoratori dei dati" sottopagati in paesi in via di sviluppo passano ore a etichettare immagini per pochi centesimi, vivendo in condizioni di sfruttamento estremo.',
        },
        scoring: () => 5,
    },
    {
        id: 'q22',
        category: 'labor',
        type: 'boolean',
        text: {
            en: 'Do you use delivery or transportation services managed by algorithms (e.g., food delivery)?',
            it: 'Usi servizi di consegna o trasporto gestiti da algoritmi (es. cibo a domicilio)?',
        },
        fact: {
            en: 'Work management algorithms transform human beings into simple optimized "resources", eliminating union protections and labor dignity in the name of efficiency.',
            it: 'Gli algoritmi di gestione del lavoro trasformano gli esseri umani in semplici "risorse" ottimizzate, eliminando tutele sindacali e dignità lavorativa in nome dell\'efficienza.',
        },
        scoring: (value) => value ? 5 : 0,
    },
    // IDEOLOGIA DEL PROGRESSO E FUTURO DEL PIANETA
    {
        id: 'q31',
        category: 'ideology',
        type: 'boolean',
        text: {
            en: 'Do you believe that technology will be the ultimate solution to the climate crisis?',
            it: 'Credi che la tecnologia sarà la soluzione definitiva alla crisi climatica?',
        },
        fact: {
            en: '"AI futurism" is an ideology that makes us believe that an algorithm is enough to save the planet while we consume it.',
            it: 'L\'"AI futurism" è un\'ideologia che ci fa credere che basti un algoritmo per salvare il pianeta mentre lo consumiamo.',
        },
        scoring: (value) => value ? 5 : 0,
    },
    {
        id: 'q32',
        category: 'ideology',
        type: 'numeric',
        text: {
            en: 'How many times have you purchased a tech product just because it was the "latest model"?',
            it: 'Quante volte hai acquistato un prodotto tecnologico solo perché era l\'"ultimo modello"?',
        },
        fact: {
            en: 'This induced desire fuels an extraction system that considers the Earth an infinite resource to be consumed until exhaustion.',
            it: 'Questo desiderio indotto alimenta un sistema di estrazione che considera la Terra una risorsa infinita da consumare fino all\'esaurimento.',
        },
        scoring: (value) => Number(value) || 0,
    },
    // DOMANDE DI RIEPILOGO E CONSAPEVOLEZZA
    {
      id: 'q41',
      category: 'summary',
      type: 'boolean',
      text: {
        en: 'After reading these facts, will you change your online behavior starting today?',
        it: 'Dopo aver letto questi dati, cambierai il tuo modo di stare online oggi stesso?',
      },
      fact: {
        en: 'Awareness is the first step in dismantling a system that thrives on our ignorance of the planetary costs of digital life.',
        it: 'La consapevolezza è il primo passo per smantellare un sistema che prospera sulla nostra ignoranza dei costi planetari della vita digitale.',
      },
      scoring: (value) => (value ? 0 : 5),
    }
  ];
  