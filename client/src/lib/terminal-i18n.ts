import type { SkillKey } from "@shared/schema";

interface BlockOption {
  text: string;
  action: string;
  conditional_text?: string;
  conditional_options?: BlockOption[];
  continued_text?: string;
}

interface IntermediateQuestion {
  text: string;
  options: BlockOption[];
}

interface LearningBlock {
  id: number;
  title: string;
  speech: string;
  intermediate_question?: IntermediateQuestion;
  speech_continued?: string;
  skill: string | null;
  grantSkillKey?: SkillKey;
  reward: number;
  progress_target: number;
  options: BlockOption[];
}

interface WalletStepButton {
  text: string;
  type: "next" | "external" | "deeplink";
  url?: string;
  target?: string;
}

interface WalletStep {
  id: string;
  title: string;
  instruction: string;
  buttons: WalletStepButton[];
}

const LEARNING_BLOCKS_EN: LearningBlock[] = [
  {
    id: 1, title: "Disclaimer (First Strike)",
    speech: "Listen closely.\n\nYou are not here by accident. This is an alpha test for a digital freedom project. I am going to give you tools that will change the way you think about freedom on the internet.\n\n10-15 minutes. That is all you need to start.\nIt's easier than ordering a pizza on Glovo. Seriously.\nNo:\n- Sign-ups\n- Subscriptions\n- Personal data\n- Bank cards\nJust you and this chat.\n\nHere is the deal: For every correct answer, you receive fractions of real Bitcoin.\nThe bar at the bottom shows your progress. Every percentage point is money.\nBelieve it or not\u2014that is your choice.\nBut if you are here, it means you feel something is wrong with the system.\nReady to take the first step?",
    skill: "The first step to freedom", grantSkillKey: "WILL_TO_FREEDOM", reward: 100, progress_target: 21,
    options: [{ text: "Yes", action: "next_block" }, { text: "No", action: "go_back", conditional_text: "I understand. The system is comfortable. If you change your mind\u2014I will be here." }]
  },
  {
    id: 2, title: "Banking Slavery (The Truth About Your Money)",
    speech: "You are on the right track!\nLet's start with a simple question: who owns the money in your account?",
    intermediate_question: { text: "Who owns the money in your account?", options: [
      { text: "Me", action: "continue", continued_text: "Actually, no, even though the bank tells you it's your money.\n\nAlthough their app shows a balance, that money is not your property. It is an entry in THEIR database that you are PERMITTED to use.\nTry this:\nSend a large sum to a friend in another country. The bank will inevitably ask: 'Where is the money from? Why? Who is it for?' They can block your account simply because their algorithm didn't like your purchase.\nDecided to buy something your government doesn't like? Maybe a donation to protesters, a banned book, or a VPN? Account frozen. No trial.\nMoney in the bank is not money. It is a promise from the bank.\nAnd that promise works only as long as you do what is expected of you.\nThey control access to your time, your labor, your life.\nYou work all week exchanging that time for numbers in an app. But those numbers do not belong to you.\nThe bank owns your time.\n'Balance in the app' is not ownership, it is permission." },
      { text: "The Bank", action: "continue", continued_text: "Correct, even though the bank tells you it's your money.\n\nAlthough their app shows a balance, that money is not your property. It is an entry in THEIR database that you are PERMITTED to use.\nTry this:\nSend a large sum to a friend in another country. The bank will inevitably ask: 'Where is the money from? Why? Who is it for?' They can block your account simply because their algorithm didn't like your purchase.\nDecided to buy something your government doesn't like? Maybe a donation to protesters, a banned book, or a VPN? Account frozen. No trial.\nMoney in the bank is not money. It is a promise from the bank.\nAnd that promise works only as long as you do what is expected of you.\nThey control access to your time, your labor, your life.\nYou work all week exchanging that time for numbers in an app. But those numbers do not belong to you.\nThe bank owns your time.\n'Balance in the app' is not ownership, it is permission." }
    ] },
    speech_continued: "Actually, no, even though the bank tells you it's your money.\n\nEven though their app shows a balance, that money is not your property. It is an entry in THEIR database that you are PERMITTED to use.\nTry this:\nSend a large sum to a friend in another country. The bank will inevitably ask: 'Where is the money from? Why? Who is it for?' They can block your account simply because their algorithm didn't like your purchase.\nDecided to buy something your government doesn't like? Maybe a donation to protesters, a banned book, or a VPN? Account frozen. No trial.\nMoney in the bank is merely a promise from the bank. And those promises work only as long as you do what is expected of you.\nIt turns out the system controls access to your time, your labor, your life.\nYou work all week exchanging that time for numbers in an app. But those numbers do not belong to you.\nThe bank owns your time.\n'Balance in the app' is not ownership, it is permission.",
    skill: "Understanding that app balance is permission, not ownership", grantSkillKey: "TRUTH_SEEKER", reward: 100, progress_target: 22,
    options: [{ text: "Okay, but what can I do about it?", action: "next_block" }, { text: "But it's always been this way, it's normal", action: "show_conditional_text", conditional_text: "\"Normal\" is when the bank charges a fee to hold YOUR money.\n\n\"Normal\" is when you cannot buy a ticket to another country without bank approval.\n\nSlavery was once considered \"normal\" too.\n\nAre you ready to see the exit, or will you return to \"normalcy\"?", conditional_options: [{ text: "Show me the exit", action: "next_block" }, { text: "Return to the start", action: "restart" }] }]
  },
  {
    id: 3, title: "Bitcoin is the Exit (Math vs. Promises)",
    speech: "Good. You are ready to see the exit\u2014Bitcoin!\n\nForget everything you've heard before: \"cryptocurrency,\" \"investment,\" \"speculation.\" To be precise, technically, it is a distributed database.\nImagine rules that cannot be changed unilaterally. To fake a transaction or change the algorithm, you would need to convince millions of independent nodes around the world. It is not the will of a bank or a government promise\u2014it is mathematical law, protected by cryptography.\nBitcoin is the first system in human history where trust is replaced by proof. The rules here are enforced by the network itself, not by someone's decree.\nIt is also called \"digital gold.\"\nImagine if gold:\n- Could fit in an encrypted file on your phone\n- Could be sent in seconds to any country\n- Could not be confiscated by anyone\n- Was controlled by no bank\n\nBanks can go bankrupt. Governments can devalue currency.\nBitcoin? Running for 17 years without stopping. 24/7. No weekends. No bankruptcies.\nThis is the first method in history to store the fruits of your labor where no government can reach them.",
    skill: "Bitcoin = math + scarcity + freedom", grantSkillKey: "HARD_MONEY", reward: 100, progress_target: 23,
    options: [{ text: "Got it, but how does it work?", action: "next_block" }, { text: "What are the other benefits?", action: "next_block" }]
  },
  {
    id: 4, title: "Keys (Who Holds Them, Rules)",
    speech: "An important clarification, explorer. Your wallet (like Phoenix) is not a bank account.\nBitcoin does not physically exist on your phone, in the cloud, or in a bank. It is merely a set of records in a global distributed database (the blockchain).\nYour phone stores PRIVATE KEYS, not money. This is your digital signature. Your \"key\" is the only proof of your right to manage a portion of the network's resources.\nRemember: Not your keys, not your bitcoin. If you hold the keys, you are sovereign. If a third party holds the keys, you are just a user of their service. Phoenix gives you full control over your keys right here in your terminal.",
    skill: "Concept of personal ownership without intermediaries", reward: 100, progress_target: 24,
    options: [{ text: "Wow, tell me more", action: "next_block" }, { text: "How do I use this in real life?", action: "next_block" }]
  },
  {
    id: 5, title: "Privacy (Being Invisible)",
    speech: "Now you are ready for the next level.\n\nThe system wants to know everything.\nWhat you ate for breakfast. Where you went yesterday. How much you spent on coffee. Who you met.\nBanks hand data over to the government. Google knows where you've been. Your credit card is a diary of your life.\n\nIn Italy, every transaction over \u20ac2000 is automatically tracked. Buying a used car from a friend? Report it to the state.\n\nWhat if you don't want to? Bitcoin gives you a choice.\nYour address is just a string of letters and numbers. No name. No passport.\nYou can create a new address for every transaction. In seconds. For free.\n\nWant to send money to a friend? No questions like \"Why?\". No bank fees. No records in your profile.\n\nYour spending is your private business.\nEven the base layer of Bitcoin gives you more freedom than any bank in the world.",
    skill: "Basic digital hygiene and the right to privacy", reward: 100, progress_target: 25,
    options: [{ text: "Absolutely no one between me and the recipient?!", action: "next_block" }, { text: "Can I use this for daily purchases or get cash?", action: "next_block" }]
  },
  {
    id: 6, title: "Lightning (Instant Energy)",
    speech: "This is where Bitcoin becomes a weapon of the future.\n\nYou can pay for a huge number of things with Bitcoin, and the number of countries and businesses accepting it is constantly growing. Beyond online payments, there are hundreds of ways to convert to cash if necessary.\n\nRemember the reward I mentioned at the start? You are earning satoshis (abbreviated as SATS).\nA Satoshi is the smallest fraction of a bitcoin. There are 100 million SATS in 1 bitcoin. They are named after me\u2014the creator of Bitcoin, Satoshi Nakamoto.\n\nHere is what matters: they can be sent to each other in a split second.\nWant to send money to Japan? 0.5 seconds.\nThe fee? Less than one euro cent. Sometimes fractions of a cent.\nThis is called the Lightning Network.\n\nA borderless network. Your phone connects to millions of nodes worldwide.\nNo bank in the middle. No SWIFT. No \"business hours.\"\nMoney moves at the speed of thought.",
    skill: "Instant payments without borders", grantSkillKey: "GRID_RUNNER", reward: 100, progress_target: 26,
    options: [{ text: "Who needs all this?", action: "next_block" }, { text: "Sounds complicated, do I need to code?", action: "next_block", conditional_text: "No. We made it simpler than Glovo. Let's move on." }]
  },
  {
    id: 7, title: "Shield Card (Your Pass to the Resistance)",
    speech: "You have almost completed the prototype of Module 1 and in a couple of minutes, you can claim your reward! Time to explain where you are.\n\nYou are in the digital resistance club against authoritarianism.\n\nThere will be 7 modules in total.\nComing soon:\n\n\u2192 2: Privacy and evading surveillance\n\u2192 3: Secure communication\n\u2192 4: Censorship circumvention\n\u2192 5: Free access to knowledge\n\u2192 6: Techno-philosophy\n\u2192 7: Offline survival tools\n\nEach module is a skill. Each skill is a piece of your independence shield.\n\nBy the end, you will know how to:\nManage your private keys so no one can seize your wealth\n- Communicate so no one can read it\n- Access information they try to hide\nSurvive in a world where the system tries to control you\n\nMost importantly, you will gain dozens of practical skills to defend your freedom exactly how you need to. No political agenda, just the human right to freedom!\n\nThat transparent card is a pass to a global network of people who want to live in a fairer world. Pass the card to someone who understands.\n\nWe are building a parallel internet. And you just became part of it.",
    skill: "Understanding the ecosystem of freedom", reward: 200, progress_target: 27,
    options: [{ text: "Okay, ready to claim my SATS", action: "next_block" }]
  },
  {
    id: 8, title: "Final Choice (Moment of Truth)",
    speech: "1000 SATS\u2014your first money that does not belong to a bank.\n\nBut there is one problem\u2026 You don't have a wallet yet. Right now, these SATS exist only here.\n\nYour final step:\n\nCreate a personal Bitcoin wallet. It takes 2 minutes.\nAnd all the SATS you earned will be sent to your address. Automatically.\nThis is the moment theory becomes reality.",
    skill: "Moment of final decision", reward: 0, progress_target: 27,
    options: [{ text: "Let's create a wallet", action: "create_wallet" }, { text: "No, I need to think", action: "show_conditional_text", conditional_text: "I understand. Freedom is scary.\n\nYour satoshis will wait for you here for 72 hours. After that\u2014they will disappear.\n\nThe choice is yours. It always was.", conditional_options: [{ text: "Return to wallet creation", action: "create_wallet" }] }]
  },
];

const LEARNING_BLOCKS_IT: LearningBlock[] = [
  {
    id: 1, title: "Disclaimer (Primo Colpo)",
    speech: "Ascolta attentamente.\n\nNon sei finito qui per caso. Questo \u00e8 un alpha test di un progetto sulla libert\u00e0 digitale. Ti dar\u00f2 strumenti che cambieranno il tuo modo di pensare alla libert\u00e0 su internet.\n\n10-15 minuti. \u00c8 tutto ci\u00f2 che ti serve per iniziare.\n\u00c8 pi\u00f9 semplice che ordinare una pizza su Glovo. Davvero.\nNiente:\n- Registrazioni\n- Abbonamenti\n- Dati personali\n- Carte bancarie\nSolo tu e questa chat.\n\nEcco l'accordo: Per ogni risposta corretta ricevi frazioni di veri Bitcoin.\nLa barra in basso mostra i tuoi progressi. Ogni percentuale \u00e8 denaro.\nCrederci o no: \u00e8 una tua scelta.\nMa se sei qui, significa che senti che c'\u00e8 qualcosa che non va nel sistema.\nPronto a fare il primo passo?",
    skill: "Il primo passo verso la libert\u00e0", grantSkillKey: "WILL_TO_FREEDOM", reward: 100, progress_target: 21,
    options: [{ text: "S\u00ec", action: "next_block" }, { text: "No", action: "go_back", conditional_text: "Capisco. Il sistema \u00e8 comodo. Se cambi idea, sar\u00f2 qui." }]
  },
  {
    id: 2, title: "Schiavit\u00f9 Bancaria (La verit\u00e0 sui tuoi soldi)",
    speech: "Sei sulla strada giusta!\nIniziamo con una domanda semplice: a chi appartengono i soldi sul tuo conto?",
    intermediate_question: { text: "A chi appartengono i soldi sul tuo conto?", options: [
      { text: "A me", action: "continue", continued_text: "In realt\u00e0 no, anche se la banca ti dice che sono tuoi.\n\nNonostante la loro app mostri un saldo, quei soldi non sono di tua propriet\u00e0. Sono una registrazione nel LORO database che ti \u00e8 PERMESSO utilizzare.\nProva questo:\nInvia una somma ingente a un amico in un altro paese. La banca ti chieder\u00e0 inevitabilmente: \"Da dove vengono? Perch\u00e9? Per chi sono?\" Possono bloccare il tuo conto semplicemente perch\u00e9 al loro algoritmo non \u00e8 piaciuto il tuo acquisto.\nHai deciso di comprare qualcosa che non piace al tuo governo? Magari una donazione a dei manifestanti, un libro proibito o una VPN? Conto congelato. Senza processo.\nI soldi in banca non sono soldi. Sono una promessa della banca.\nE questa promessa funziona solo finch\u00e9 fai quello che ci si aspetta da te.\nControllano l'accesso al tuo tempo, al tuo lavoro, alla tua vita.\nLavori tutta la settimana scambiando quel tempo per numeri in un'app. Ma i numeri non ti appartengono.\nLa banca \u00e8 padrona del tuo tempo.\n\"Il saldo nell'app\" non \u00e8 possesso, \u00e8 un permesso." },
      { text: "Alla Banca", action: "continue", continued_text: "Corretto, anche se la banca ti dice che sono tuoi.\n\nNonostante la loro app mostri un saldo, quei soldi non sono di tua propriet\u00e0. Sono una registrazione nel loro database che ti \u00e8 permesso utilizzare.\nProva questo:\nInvia una somma ingente a un amico in un altro paese. La banca ti chieder\u00e0 inevitabilmente: \"Da dove vengono? Perch\u00e9? Per chi sono?\" Possono bloccare il tuo conto semplicemente perch\u00e9 al loro algoritmo non \u00e8 piaciuto il tuo acquisto.\nHai deciso di comprare qualcosa che non piace al tuo governo? Magari una donazione a dei manifestanti, un libro proibito o una VPN? Conto congelato. Senza processo.\nI soldi in banca non sono soldi. Sono una promessa della banca.\nE questa promessa funziona solo finch\u00e9 fai quello che ci si aspetta da te.\nControllano l'accesso al tuo tempo, al tuo lavoro, alla tua vita.\nLavori tutta la settimana scambiando quel tempo per numeri in un'app. Ma i numeri non ti appartengono.\nLa banca \u00e8 padrona del tuo tempo.\n\"Il saldo nell'app\" non \u00e8 possesso, \u00e8 un permesso." }
    ] },
    speech_continued: "In realt\u00e0 no, anche se la banca ti dice che sono tuoi.\n\nNonostante la loro app mostri un saldo, quei soldi non sono di tua propriet\u00e0. Sono una registrazione nel LORO database che ti \u00e8 PERMESSO utilizzare.\nProva questo:\nInvia una somma ingente a un amico in un altro paese. La banca ti chieder\u00e0 inevitabilmente: \"Da dove vengono? Perch\u00e9? Per chi sono?\" Possono bloccare il tuo conto semplicemente perch\u00e9 al loro algoritmo non \u00e8 piaciuto il tuo acquisto.\nHai deciso di comprare qualcosa che non piace al tuo governo? Magari una donazione a dei manifestanti, un libro proibito o una VPN? Conto congelato. Senza processo.\nI soldi in banca sono solo promesse della banca. E queste promesse funzionano finch\u00e9 fai quello che ci si aspetta da te.\nNe consegue che il sistema controlla l'accesso al tuo tempo, al tuo lavoro, alla tua vita.\nLavori tutta la settimana e scambi questo tempo per dei numeri in un'app. Ma i numeri non ti appartengono.\nLa banca \u00e8 padrona del tuo tempo.\n\"Il saldo nell'app\" non \u00e8 possesso, ma un permesso.",
    skill: "Capire che il saldo nell'app \u00e8 un permesso, non possesso", grantSkillKey: "TRUTH_SEEKER", reward: 100, progress_target: 22,
    options: [{ text: "Ok, ma cosa posso farci?", action: "next_block" }, { text: "Ma \u00e8 sempre stato cos\u00ec, \u00e8 normale", action: "show_conditional_text", conditional_text: "\"Normale\" \u00e8 quando la banca ti fa pagare una commissione per custodire i TUOI soldi.\n\n\"Normale\" \u00e8 quando non puoi comprare un biglietto per un altro paese senza l'approvazione della banca.\n\nAnche la schiavit\u00f9 un tempo era considerata \"normale\".\n\nSei pronto a vedere l'uscita o tornerai alla \"normalit\u00e0\"?", conditional_options: [{ text: "Mostrami l'uscita", action: "next_block" }, { text: "Torna all'inizio", action: "restart" }] }]
  },
  {
    id: 3, title: "Bitcoin \u00e8 l'Uscita (Matematica contro Promesse)",
    speech: "Bene. Sei pronto a vedere l'uscita: Bitcoin!\n\nDimentica tutto ci\u00f2 che hai sentito prima: \"criptovaluta\", \"investimento\", \"speculazione\". Per essere precisi, tecnicamente \u00e8 un database distribuito.\nImmagina regole che non possono essere modificate unilateralmente. Per falsificare una transazione o cambiare l'algoritmo, dovresti convincere milioni di nodi indipendenti in tutto il mondo. Non \u00e8 la volont\u00e0 di una banca o la promessa di un governo: \u00e8 una legge matematica, protetta dalla crittografia.\nBitcoin \u00e8 il primo sistema nella storia dell'umanit\u00e0 in cui la fiducia \u00e8 sostituita dalla prova. Le regole qui sono fatte rispettare dalla rete stessa, non dal decreto di qualcuno.\nViene anche chiamato \"oro digitale\".\nImmagina che l'oro:\n- Possa stare in un file crittografato sul tuo telefono\n- Possa essere inviato in pochi secondi in qualsiasi paese\n- Non possa essere confiscato da nessuno\n- Non sia controllato da nessuna banca\n\nLe banche possono fallire. I governi possono svalutare il denaro.\nBitcoin? Funziona da 17 anni senza sosta. 24/7. Senza weekend. Senza bancarotte.\n\u00c8 il primo metodo nella storia per conservare il frutto del tuo lavoro dove nessun governo pu\u00f2 arrivare.",
    skill: "Bitcoin = matematica + scarsit\u00e0 + libert\u00e0", grantSkillKey: "HARD_MONEY", reward: 100, progress_target: 23,
    options: [{ text: "Capito, ma come funziona?", action: "next_block" }, { text: "Quali sono gli altri vantaggi?", action: "next_block" }]
  },
  {
    id: 4, title: "Chiavi (Chi le possiede, comanda)",
    speech: "Una precisazione importante, ricercatore. Il tuo wallet (come Phoenix) non \u00e8 un conto bancario.\nI Bitcoin non esistono fisicamente n\u00e9 nel tuo telefono, n\u00e9 nel cloud, n\u00e9 in banca. Sono solo registrazioni in un database globale distribuito (blockchain).\nIl tuo telefono non custodisce soldi, ma CHIAVI PRIVATE. Questa \u00e8 la tua firma digitale. La tua \"chiave\" \u00e8 l'unica prova del tuo diritto a gestire una parte delle risorse della rete.\nRicorda: Not your keys, not your bitcoin. Se hai le chiavi, sei sovrano. Se le chiavi sono in mano a una terza parte, sei solo un utente del loro servizio. Phoenix ti d\u00e0 il pieno controllo delle chiavi proprio qui, nel tuo terminale.",
    skill: "Concetto di possesso personale senza intermediari", reward: 100, progress_target: 24,
    options: [{ text: "Wow, raccontami di pi\u00f9", action: "next_block" }, { text: "Come si usa nella vita reale?", action: "next_block" }]
  },
  {
    id: 5, title: "Privacy (Essere invisibili)",
    speech: "Ora sei pronto per il livello successivo.\n\nIl sistema vuole sapere tutto.\nCosa hai mangiato a colazione. Dove sei andato ieri. Quanto hai speso per il caff\u00e8. Chi hai incontrato.\nLe banche trasmettono i dati al governo. Google sa dove sei stato. La tua carta di credito \u00e8 il diario della tua vita.\n\nIn Italia ogni transazione superiore ai 2000\u20ac viene tracciata automaticamente. Compri un'auto usata da un amico? Devi renderne conto allo stato.\n\nE se non volessi? Bitcoin ti d\u00e0 una scelta.\nIl tuo indirizzo \u00e8 solo una stringa di lettere e numeri. Niente nome. Niente passaporto.\nPuoi creare un nuovo indirizzo per ogni transazione. In pochi secondi. Gratis.\n\nVuoi inviare denaro a un amico? Nessuna domanda tipo \"Perch\u00e9?\". Nessuna commissione bancaria. Nessuna registrazione nel tuo profilo.\n\nLe tue spese sono affar tuo.\nAnche il livello base di Bitcoin ti d\u00e0 pi\u00f9 libert\u00e0 di qualsiasi banca al mondo.",
    skill: "Igiene digitale di base e diritto alla privacy", reward: 100, progress_target: 25,
    options: [{ text: "Davvero nessuno tra me e il destinatario?!", action: "next_block" }, { text: "Posso usarlo per acquisti quotidiani o prelevare contanti?", action: "next_block" }]
  },
  {
    id: 6, title: "Lightning (Energia Istantanea)",
    speech: "Ecco dove Bitcoin diventa un'arma del futuro.\n\nPuoi pagare un'enorme quantit\u00e0 di cose con Bitcoin, e il numero di paesi e aziende che lo accettano \u00e8 in costante crescita. Oltre ai pagamenti online, se necessario ci sono centinaia di modi per convertirlo in contanti.\n\nRicordi la ricompensa di cui parlavo all'inizio? Riceverai satoshi (abbreviato: SATS).\nUn Satoshi \u00e8 la pi\u00f9 piccola parte di un bitcoin. In 1 bitcoin ci sono 100 milioni di SATS. Sono chiamati cos\u00ec in onore di me: il creatore di Bitcoin, Satoshi Nakamoto.\n\nEd ecco cosa \u00e8 importante: possono essere inviati l'uno all'altro in una frazione di secondo.\nVuoi mandare soldi in Giappone? 0,5 secondi.\nCommissione? Meno di un centesimo di euro. A volte frazioni di centesimo.\nSi chiama Lightning Network.\n\nUna rete senza confini. Il tuo telefono si connette a milioni di nodi in tutto il mondo.\nNessuna banca nel mezzo. Nessuno SWIFT. Nessun \"orario di ufficio\".\nIl denaro si muove alla velocit\u00e0 del pensiero.",
    skill: "Pagamenti istantanei senza confini", grantSkillKey: "GRID_RUNNER", reward: 100, progress_target: 26,
    options: [{ text: "A chi serve tutto questo?", action: "next_block" }, { text: "Sembra complicato, bisogna saper programmare?", action: "next_block", conditional_text: "No. Lo abbiamo reso pi\u00f9 semplice di Glovo. Andiamo avanti." }]
  },
  {
    id: 7, title: "Carta Scudo (Il tuo pass per la resistenza)",
    speech: "Hai quasi completato il prototipo del Modulo 1 e tra un paio di minuti potrai ritirare la tua ricompensa! \u00c8 ora di spiegarti dove sei finito.\n\nSei nel club della resistenza digitale all'autoritarismo.\n\nCi saranno 7 moduli in totale.\nProssimamente:\n\n\u2192 2: Privacy ed elusione della sorveglianza\n\u2192 3: Comunicazione sicura\n\u2192 4: Aggiramento della censura\n\u2192 5: Libero accesso alla conoscenza\n\u2192 6: Tecno-filosofia\n\u2192 7: Strumenti di sopravvivenza offline\n\nOgni modulo \u00e8 un'abilit\u00e0. Ogni abilit\u00e0 \u00e8 un pezzo dello scudo della tua indipendenza.\n\nAlla fine saprai come:\nGestire le tue chiavi private in modo che nessuno possa sequestrare la tua ricchezza\n- Comunicare in modo che nessuno possa leggere\n- Accedere a informazioni che cercano di nascondere\nSopravvivere in un mondo in cui il sistema cerca di controllarti\n\nE soprattutto otterrai decine di abilit\u00e0 pratiche per difendere la tua libert\u00e0 esattamente come serve a te. Nessun programma politico, solo il diritto umano alla libert\u00e0!\n\nQuella carta trasparente \u00e8 un pass per una rete globale di persone che vogliono vivere in un mondo pi\u00f9 onesto. Passa la carta a chi pu\u00f2 capire.\n\nStiamo costruendo un internet parallelo. E tu ne sei appena diventato parte.",
    skill: "Comprensione dell'ecosistema della libert\u00e0", reward: 200, progress_target: 27,
    options: [{ text: "Bene, sono pronto a ritirare i SATS", action: "next_block" }]
  },
  {
    id: 8, title: "Scelta Finale (Il momento della verit\u00e0)",
    speech: "1000 SATS: i tuoi primi soldi che non appartengono a una banca.\n\nMa c'\u00e8 un problema... Non hai ancora un wallet. Proprio ora, questi SATS esistono solo qui.\n\nIl tuo passo finale:\n\nCreare un wallet Bitcoin personale. Ci vorranno 2 minuti.\nE tutti i SATS che hai guadagnato arriveranno al tuo indirizzo. Automaticamente.\nQuesto \u00e8 il momento in cui la teoria diventa realt\u00e0.",
    skill: "Momento della decisione finale", reward: 0, progress_target: 27,
    options: [{ text: "Creiamo il wallet", action: "create_wallet" }, { text: "No, devo pensarci", action: "show_conditional_text", conditional_text: "Capisco. La libert\u00e0 spaventa.\n\nI tuoi satoshi ti aspetteranno qui per 72 ore. Dopo di che svaniranno.\n\nLa scelta \u00e8 tua. Lo \u00e8 sempre stata.", conditional_options: [{ text: "Torna alla creazione del wallet", action: "create_wallet" }] }]
  },
];

const WALLET_STEPS_EN: WalletStep[] = [
  { id: "step_1", title: "Download Your Personal Safe", instruction: "For beginners, we recommend using Phoenix Wallet. It is simple, fast, and yours.\n\nImportant clarification: your wallet is not a bank account.\nBitcoins do not physically exist on your phone, in the cloud, or in a bank. They are merely records in a global distributed database (blockchain).\nYour phone stores PRIVATE KEYS, not money. This is your digital signature. Your \"key\" is the only proof of your right to manage a portion of the network's resources.\nRemember: Not your keys, not your bitcoin. If you hold the keys, you are sovereign. If a third party holds the keys, you are just a user of their service.", buttons: [{ text: "Download Wallet for iPhone", url: "https://apps.apple.com/it/app/phoenix-wallet/id1544097028", type: "external" }, { text: "Download Wallet for Android", url: "https://play.google.com/store/apps/details?id=fr.acinq.phoenix.mainnet&pli=1", type: "external" }, { text: "Already downloaded, what next?", type: "next", target: "step_2" }] },
  { id: "step_2", title: "Create Your Wallet", instruction: "Great. App downloaded.\n\nNow open Phoenix Wallet on your phone.\n\nHere is what you will see:\n\nOn first launch:\nPhoenix will show a welcome screen with two options:\n- \"Create a new wallet\"\n- \"Restore a wallet\"\n\nWhat to do:\nTap on \"Create a new wallet\"\n\nPhoenix will automatically:\n- Generate your unique wallet\n- Create your personal Bitcoin address\n- Prepare everything to receive payments\n\nThis will take 3-5 seconds.\n\nThat's it. Wallet created.\n\nYou have just entered the parallel economy. You have a personal Bitcoin address that can receive payments from all over the world.\n\nNo intermediaries. No permissions. No borders.\n\nBut there is one more critically important step\u2014saving the keys to this wallet.", buttons: [{ text: "Wallet created, what next?", type: "next", target: "step_3" }] },
  { id: "step_3", title: "12 Words = Absolute Power", instruction: "This is the most important part.\n\nYour wallet is protected by 12 words. This is called a seed phrase. Your master key.\n\nThese 12 words are the ONLY way to restore access to your money.\n\nLost your phone? The words will restore the wallet on a new one.\nLost the words? That's it. Game over. No tech support. No recovery. Never.\n\nStep-by-step instructions:\n\n1. Open Phoenix Wallet on your phone\n\n2. Find the gear icon in the top right corner\n  This is the app settings\n\n3. Tap on the gear\n  The settings menu will open\n\n4. Find the item \"Recovery phrase\" or \"Seed\" or \"Display seed\"\n  (It might be named differently depending on the version)\n\n5. Tap on this item\n  Phoenix will show a security warning\n\n6. Confirm that you understand the risks\n  (Usually an \"I understand\" or \"Show seed\" button)\n\n7. Phoenix will show your 12 words\n  They are numbered 1 to 12\n\n8. Now SAVE these words:\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\nBEST OPTION (safest):\n\nPen + Paper\n- Take a clean sheet of paper\n- Write down all 12 words with a PEN (not pencil)\n- Make sure to keep the order (1, 2, 3... 12)\n- Double-check for errors\n- Hide the paper in a secure place:\n  Not in your wallet (can be lost)\n  Not on the fridge (can be seen)\n  Ideal: a safe, a book, an envelope in a drawer\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\nNO PEN AND PAPER HANDY?\n\nTemporary alternatives (do this TODAY):\n\nOption 1: Phone Notes (OFFLINE)\n- Open your \"Notes\" app\n- Create a new note\n- Write down all 12 words in the correct order\n- Delete this note IMMEDIATELY after transferring to paper!\n\nOption 2: Memorize (Extreme)\n- Read all 12 words aloud 3 times in a row\n- Close your eyes and repeat from memory\n- Repeat after 10 minutes\n\nNEVER store the seed phrase:\n- In the cloud (Google Drive, iCloud)\n- In a messenger (WhatsApp, Telegram)\n- In email\n- In a screenshot\n\nReady?", buttons: [{ text: "Yes, wrote it on paper", type: "next", target: "step_4" }, { text: "Yes, saved temporarily (will rewrite later)", type: "next", target: "step_3a" }] },
  { id: "step_3a", title: "Additional Warning", instruction: "Okay. But remember:\n\nDigital storage of a seed phrase is a risk.\n- Phones get hacked\n- Clouds leak\n- Apps crash\n- Devices break\n\nPaper has existed for 100+ years.\nA digital file can disappear in a second.\n\nShall we continue?", buttons: [{ text: "Understood, moving on", type: "next", target: "step_4" }] },
  { id: "step_4", title: "Claim What's Yours", instruction: "Now you will receive your earned SATS.\n\nHow it works:\n\nWhen you press the \"GET 1000 SATS\" button below, the following will happen:\n\n1. Phoenix Wallet will open automatically\n  (If it doesn't open\u2014open it manually)\n\n2. Phoenix will show a notification about an incoming payment\n  \"Incoming payment: 1000 sats\"\n\n3. In a few seconds, you will see them on your balance\n  You will see \"+1000\" in the app\n\n4. Done. The money is yours.\n\nThis is Bitcoin. Instant, anonymous, and without intermediaries.\n\nFrom us to you directly. Through math and cryptography. Through freedom.\n\nWelcome to the parallel economy.\n\nYou have just done what most people never dare to do:\nTaken control of your money.\n\nYou are no longer a guest in someone else's house.\nYou are the owner.\n\nPress the button. Your satoshis are waiting.", buttons: [{ text: "GET 1000 SATS", type: "deeplink", url: "lightning:LNURL1DP68GURN8GHJ7ET4WP5X7UNFVDEKZUNYD9HX2UEJ9EKXUCNFW3EJUCM0D5HHW6T5DPJ8YCTH9ASHQ6F0WCCJ7MRWW4EXCT6P0PZKYUJP8YE8SNPKWQMRVA23DPD8SERCVC2YC4CH", target: "step_5" }] },
  { id: "step_5", title: "Welcome to the Resistance", instruction: "You did it.\n\n1000 SATS just arrived in your wallet.\n\nThis is your first money in the parallel economy.\n\nWhat's next?\n\nIf you want, explore Phoenix Wallet\n- Try sending 10 sats to a friend (if they have a wallet too)\n- Find your address\n- Explore the settings\n\nFollow project updates\nModules 2-7 are coming soon:\n- Privacy and evading surveillance\n- Secure communication\n- Censorship circumvention\n- Free access to knowledge\n- Techno-philosophy\n- Offline survival tools\n\nPass the transparent card to someone who is ready.", buttons: [] },
];

const WALLET_STEPS_IT: WalletStep[] = [
  { id: "step_1", title: "Scarica la tua cassaforte personale", instruction: "Ai principianti consigliamo di usare Phoenix Wallet. \u00c8 semplice, veloce e tuo.\n\nUna precisazione importante: il tuo wallet non \u00e8 un conto bancario.\nI Bitcoin non esistono fisicamente n\u00e9 nel tuo telefono, n\u00e9 nel cloud, n\u00e9 in banca. Sono solo registrazioni in un database globale distribuito (blockchain).\nIl tuo telefono non custodisce soldi, ma CHIAVI PRIVATE. Questa \u00e8 la tua firma digitale. La tua \"chiave\" \u00e8 l'unica prova del tuo diritto a gestire una parte delle risorse della rete.\nRicorda: Not your keys, not your bitcoin. Se hai le chiavi, sei sovrano. Se le chiavi sono in mano a terzi, sei solo un utente del loro servizio.", buttons: [{ text: "Scarica wallet per iPhone", url: "https://apps.apple.com/it/app/phoenix-wallet/id1544097028", type: "external" }, { text: "Scarica wallet per Android", url: "https://play.google.com/store/apps/details?id=fr.acinq.phoenix.mainnet&pli=1", type: "external" }, { text: "Gi\u00e0 scaricato, e ora?", type: "next", target: "step_2" }] },
  { id: "step_2", title: "Crea il tuo wallet", instruction: "Ottimo. App scaricata.\n\nOra apri Phoenix Wallet sul telefono.\n\nEcco cosa vedrai:\n\nAl primo avvio:\nPhoenix mostrer\u00e0 una schermata di benvenuto con due opzioni:\n- \"Create a new wallet\" (Crea nuovo wallet)\n- \"Restore a wallet\" (Ripristina wallet)\n\nCosa fare:\nTocca su \"Create a new wallet\"\n\nPhoenix far\u00e0 automaticamente questo:\n- Generer\u00e0 il tuo wallet unico\n- Creer\u00e0 il tuo indirizzo Bitcoin personale\n- Preparer\u00e0 tutto per ricevere pagamenti\n\nCi vorranno 3-5 secondi.\n\nFatto. Wallet creato.\n\nSei appena entrato nell'economia parallela. Hai un indirizzo Bitcoin personale che pu\u00f2 ricevere pagamenti da tutto il mondo.\n\nNessun intermediario. Nessun permesso. Nessun confine.\n\nMa c'\u00e8 ancora un passo criticamente importante: salvare le chiavi di questo wallet.", buttons: [{ text: "Wallet creato, e ora?", type: "next", target: "step_3" }] },
  { id: "step_3", title: "12 parole = potere assoluto", instruction: "Questa \u00e8 la parte pi\u00f9 importante.\n\nIl tuo wallet \u00e8 protetto da 12 parole. Si chiama \"seed phrase\". La tua chiave maestra.\n\nQueste 12 parole sono l'UNICO modo per ripristinare l'accesso ai tuoi soldi.\n\nHai perso il telefono? Le parole ripristineranno il wallet su uno nuovo.\nHai perso le parole? Fine. Game over. Nessuna assistenza tecnica. Nessun recupero. Mai.\n\nIstruzioni passo dopo passo:\n\n1. Apri Phoenix Wallet sul telefono\n\n2. Trova l'icona dell'ingranaggio nell'angolo in alto a destra\n  Sono le impostazioni dell'app\n\n3. Tocca l'ingranaggio\n  Si aprir\u00e0 il menu impostazioni\n\n4. Trova la voce \"Recovery phrase\" o \"Seed\" o \"Display seed\"\n  (Potrebbe chiamarsi diversamente a seconda della versione)\n\n5. Tocca questa voce\n  Phoenix mostrer\u00e0 un avviso di sicurezza\n\n6. Conferma di aver capito i rischi\n  (Di solito un pulsante \"I understand\" o \"Show seed\")\n\n7. Phoenix mostrer\u00e0 le tue 12 parole\n  Sono numerate da 1 a 12\n\n8. Ora SALVA queste parole:\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\nOPZIONE MIGLIORE (la pi\u00f9 sicura):\n\nCarta e Penna\n- Prendi un foglio di carta pulito\n- Scrivi tutte le 12 parole a PENNA (non a matita)\n- Assicurati di mantenere l'ordine (1, 2, 3... 12)\n- Controlla due volte che non ci siano errori\n- Nascondi il foglio in un luogo sicuro:\n  Non nel portafoglio (puoi perderlo)\n  Non sul frigorifero (possono vederlo)\n  Ideale: cassaforte, un libro, una busta nel cassetto\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\nNON HAI CARTA E PENNA A PORTATA DI MANO?\n\nAlternative temporanee (fallo OGGI):\n\nOpzione 1: Note del telefono (OFFLINE)\n- Apri l'app \"Note\"\n- Crea una nuova nota\n- Scrivi tutte le 12 parole nell'ordine corretto\n- Cancella questa nota IMMEDIATAMENTE dopo averle trascritte su carta!\n\nOpzione 2: Impara a memoria (Estremo)\n- Leggi tutte le 12 parole ad alta voce 3 volte di fila\n- Chiudi gli occhi e ripeti a memoria\n- Ripeti dopo 10 minuti\n\nNon conservare MAI la seed phrase:\n- Nel cloud (Google Drive, iCloud)\n- In un messenger (WhatsApp, Telegram)\n- Nelle email\n- In uno screenshot\n\nPronto?", buttons: [{ text: "S\u00ec, scritto su carta", type: "next", target: "step_4" }, { text: "S\u00ec, salvato temporaneamente (trascrivo dopo)", type: "next", target: "step_3a" }] },
  { id: "step_3a", title: "Avviso aggiuntivo", instruction: "Bene. Ma ricorda:\n\nL'archiviazione digitale della seed phrase \u00e8 un rischio.\n- Gli hacker bucano i telefoni\n- I cloud hanno perdite di dati\n- Le app crashano\n- I dispositivi si rompono\n\nLa carta esiste da centinaia di anni.\nUn file digitale pu\u00f2 sparire in un secondo.\n\nAndiamo avanti?", buttons: [{ text: "Capito, proseguiamo", type: "next", target: "step_4" }] },
  { id: "step_4", title: "Prenditi ci\u00f2 che \u00e8 tuo", instruction: "Ora riceverai i SATS che hai guadagnato.\n\nCome funziona:\n\nQuando premerai il pulsante \"RICEVI 1000 SATS\" in basso, succeder\u00e0 questo:\n\n1. Phoenix Wallet si aprir\u00e0 automaticamente\n  (Se non si apre, aprilo manualmente)\n\n2. Phoenix mostrer\u00e0 una notifica di pagamento in entrata\n  \"Incoming payment: 1000 sats\"\n\n3. Tra pochi secondi li vedrai nel saldo\n  Vedrai \"+1000\" nell'app\n\n4. Fatto. I soldi sono tuoi.\n\nQuesto \u00e8 Bitcoin. Istantaneo, anonimo e senza intermediari.\n\nDa noi a te direttamente. Attraverso la matematica e la crittografia. Attraverso la libert\u00e0.\n\nBenvenuto nell'economia parallela.\n\nHai appena fatto ci\u00f2 che la maggior parte delle persone non osa mai fare:\nHai preso il controllo dei tuoi soldi.\n\nNon sei pi\u00f9 un ospite in casa d'altri.\nSei il padrone.\n\nPremi il pulsante. I tuoi satoshi ti aspettano.", buttons: [{ text: "RICEVI 1000 SATS", type: "deeplink", url: "lightning:LNURL1DP68GURN8GHJ7ET4WP5X7UNFVDEKZUNYD9HX2UEJ9EKXUCNFW3EJUCM0D5HHW6T5DPJ8YCTH9ASHQ6F0WCCJ7MRWW4EXCT6P0PZKYUJP8YE8SNPKWQMRVA23DPD8SERCVC2YC4CH", target: "step_5" }] },
  { id: "step_5", title: "Benvenuto nella resistenza", instruction: "Ce l'hai fatta.\n\n1000 SATS sono appena atterrati nel tuo wallet.\n\nSono i tuoi primi soldi nell'economia parallela.\n\nE adesso?\n\nSe vuoi, esplora Phoenix Wallet\n- Prova a inviare 10 sats a un amico (se anche lui ha un wallet)\n- Trova il tuo indirizzo\n- Esplora le impostazioni\n\nSegui gli aggiornamenti del progetto\nProssimamente usciranno i moduli 2-7:\n- Privacy ed elusione della sorveglianza\n- Comunicazione sicura\n- Aggiramento della censura\n- Libero accesso alla conoscenza\n- Tecno-filosofia\n- Strumenti di sopravvivenza offline\n\nPassa la carta trasparente a chi \u00e8 pronto.", buttons: [] },
];

const SATOSHI_WISDOM_EN = [
  "The root problem with conventional currency is all the trust that's required to make it work. The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
  "Bitcoin is the first implementation of a concept called cryptocurrency. The main innovation: a network without a trusted central authority or third parties.",
  "The nature of Bitcoin is such that once version 0.1 was released, the core design was set in stone. I want you to be able to visualize it as unchangeable.",
  "Lost coins only make everyone else's coins slightly more valuable. Think of it as a donation to everyone.",
  "The network is robust in its unstructured simplicity. Nodes work all at once with little coordination. They do not need to be identified, since messages are not routed to any particular place.",
  "The double-spending problem is solved by a peer-to-peer network. The network timestamps transactions by hashing them into an ongoing chain of hash-based proof-of-work.",
  "If you don't believe me or don't get it, I don't have time to try to convince you, sorry.",
  "Bitcoin is generated at a speed closer to the planned schedule, and this remains true regardless of how many miners act.",
  "In a few decades when the reward gets too small, the transaction fee will become the main compensation for nodes.",
  "Writing a description for this thing for general audiences is bloody hard. There's nothing to relate it to.",
];

const SATOSHI_WISDOM_IT = [
  "Il problema alla radice delle valute tradizionali \u00e8 tutta la fiducia necessaria per farle funzionare. Ci si deve fidare che la banca centrale non svaluti la moneta, ma la storia delle valute fiat \u00e8 piena di violazioni di tale fiducia.",
  "Bitcoin \u00e8 la prima implementazione di un concetto chiamato criptovaluta. L'innovazione principale: una rete senza un'autorit\u00e0 centrale fidata o terze parti.",
  "La natura di Bitcoin \u00e8 tale che, una volta rilasciata la versione 0.1, il design del nucleo \u00e8 scolpito nella pietra. Voglio che riusciate a visualizzarlo come immutabile.",
  "Le monete perse rendono solo le monete di tutti gli altri leggermente pi\u00f9 preziose. Pensatelo come una donazione a tutti gli altri.",
  "La rete \u00e8 robusta nella sua semplicit\u00e0 non strutturata. I nodi lavorano tutti insieme con poco coordinamento. Non hanno bisogno di essere identificati, poich\u00e9 i messaggi non vengono instradati in un luogo particolare.",
  "Il problema della doppia spesa \u00e8 risolto attraverso una rete peer-to-peer. La rete appone una marcatura temporale sulle transazioni facendone l'hash in una catena continua di prove di lavoro (proof-of-work).",
  "Se non mi credete o non capite, non ho tempo per cercare di convincervi, mi dispiace.",
  "I Bitcoin vengono generati a una velocit\u00e0 che si avvicina al programma pianificato, e questo rimane vero indipendentemente da quanti minatori siano attivi.",
  "Tra qualche decennio, quando la ricompensa diventer\u00e0 troppo piccola, la commissione di transazione diventer\u00e0 il principale incentivo per i nodi.",
  "Scrivere una descrizione di questa cosa per il pubblico generico \u00e8 dannatamente difficile. Non c'\u00e8 nulla a cui poterlo paragonare.",
];

const LEARNING_BLOCKS_RU: LearningBlock[] = [
  {
    id: 1,
    title: "Дисклеймер (Первый удар)",
    speech: "Слушай внимательно.\n\nТы попал сюда не случайно. Это альфа-тест проекта о цифровой свободе. Я дам тебе инструменты, которые изменят то, как ты думаешь о свободе в интернете.\n\n10-15 минут. Это всё, что тебе нужно для начала\nЭто проще, чем заказать пиццу в Glovo. Серьёзно.\nНикаких:\n- Регистраций\n- Подписок\n- Личных данных\n- Банковских карт\nТолько ты и этот чат.\n\nВот сделка: За каждый правильный ответ ты получаешь части настоящих биткоинов.\nШкала внизу показывает твой прогресс. Каждый процент — это деньги.\nВерить или нет — твой выбор.\nНо если ты здесь, значит чувствуешь, что что-то не так с системой.\nГотов сделать первый шаг?",
    skill: "Первый шаг к свободе",
    grantSkillKey: "WILL_TO_FREEDOM",
    reward: 100,
    progress_target: 21,
    options: [
      { text: "Да", action: "next_block" },
      { text: "Нет", action: "go_back", conditional_text: "Понимаю. Система удобна. Если передумаешь — я буду здесь." }
    ]
  },
  {
    id: 2,
    title: "Банковское рабство (Правда о твоих деньгах)",
    speech: "Ты на верном пути!\nДавай начнем с простого вопроса: кому принадлежат деньги на твоем счету?",
    intermediate_question: {
      text: "Кому принадлежат деньги на твоем счету?",
      options: [
        {
          text: "Мне",
          action: "continue",
          continued_text: "На самом деле нет, хотя банк говорит тебе, что это твои деньги.\n\nНесмотря на то, что их приложение и показывает баланс, эти деньги не твоя собственность. Это запись в ИХ базе данных, которую тебе РАЗРЕШАЮТ использовать.\nПопробуй вот что:\nОтправь крупную сумму другу в другую страну. Банк обязательно спросит: «Откуда деньги? Зачем? Кому?» Они могут заблокировать твой счет просто потому, что их алгоритму не понравилась твоя покупка.\nРешил купить что-то, что не нравится твоему правительству? Может быть, пожертвование протестующим, запрещенную книгу или VPN? Счет заморожен. Без суда.\nДеньги в банке — это не деньги. Это обещание банка.\nИ это обещание работает, пока ты делаешь то, что от тебя ожидают.\nОни контролируют доступ к твоему времени, твоему труду, твоей жизни.\nТы работаешь всю неделю и обмениваешь это время на цифры в приложении. А цифры принадлежат не тебе.\nБанк — хозяин твоего времени.\n«Баланс в приложении» — это не владение, разрешение."
        },
        {
          text: "Банку",
          action: "continue",
          continued_text: "Верно, хотя банк говорит тебе, что это твои деньги.\n\nХотя их приложение и показывает баланс, эти деньги не твоя собственность. Это запись в их базе данных, которую тебе разрешают использовать.\nПопробуй вот что:\nОтправь крупную сумму другу в другую страну. Банк обязательно спросит: «Откуда деньги? Зачем? Кому?» Они могут заблокировать твой счет просто потому, что их алгоритму не понравилась твоя покупка.\nРешил купить что-то, что не нравится твоему правительству? Может быть, пожертвование протестующим, запрещенную книгу или VPN? Счет заморожен. Без суда.\nДеньги в банке — это не деньги. Это обещание банка.\nИ это обещание работает, пока ты делаешь то, что от тебя ожидают.\nОни контролируют доступ к твоему времени, твоему труду, твоей жизни.\nТы работаешь всю неделю и обмениваешь это время на цифры в приложении. А цифры принадлежат не тебе.\nБанк — хозяин твоего времени.\n«Баланс в приложении» — это не владение, разрешение."
        }
      ]
    },
    speech_continued: "На самом деле нет, хотя банк говорит тебе, что это твои деньги.\n\nНесмотря на то, что их приложение и показывает баланс, эти деньги не твоя собственность. Это запись в ИХ базе данных, которую тебе РАЗРЕШАЮТ использовать.\nПопробуй вот что:\nОтправь крупную сумму другу в другую страну. Банк обязательно спросит: «Откуда деньги? Зачем? Кому?» Они могут заблокировать твой счет просто потому, что их алгоритму не понравилась твоя покупка.\nРешил купить что-то, что не нравится твоему правительству? Может быть, пожертвование протестующим, запрещенную книгу или VPN? Счет заморожен. Без суда.\nДеньги в банке — это лишь обещания банка. И эти обещания работают, пока ты делаешь то, что от тебя ожидают.\nПолучается, что система контролирует доступ к твоему времени, твоему труду, твоей жизни.\nТы работаешь всю неделю и обмениваешь это время на цифры в приложении. А цифры принадлежат не тебе.\nБанк — хозяин твоего времени.\n«Баланс в приложении» — это не владение, а разрешение.",
    skill: "Понимание, что баланс в приложении — это не владение, а разрешение",
    reward: 100,
    progress_target: 22,
    options: [
      { text: "Ну да, но что с этим делать?", action: "next_block" },
      {
        text: "Но так было всегда, это нормально",
        action: "show_conditional_text",
        conditional_text: "\"Нормально\" — это когда банк берет комиссию за хранение ТВОИХ денег.\n\n\"Нормально\" — это когда ты не можешь купить билет в другую страну без одобрения банка.\n\nРабство тоже когда-то было \"нормально\".\n\nГотов увидеть выход или вернешься к «нормальности»?",
        conditional_options: [
          { text: "Покажи выход", action: "next_block" },
          { text: "Вернуться к началу", action: "restart" }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Bitcoin — выход (Математика против обещаний)",
    speech: "Хорошо. Ты готов увидеть выход — Bitcoin!\n\nЗабудь всё, что ты слышал о нём раньше \"криптовалюта\", \"инвестиция\", «спекуляция\". Если быть точным, технически это распределенная база данных.\nПредставь правила, которые невозможно изменить в одностороннем порядке. Чтобы подделать транзакцию или изменить алгоритм, нужно убедить миллионы независимых узлов по всему миру. Это не воля банка или обещание правительства — это математический закон, защищенный криптографией.\nБиткоин — это первая в истории человечества система, где доверие заменено доказательством. Правила здесь соблюдаются самой сетью, а не чьим-то указом.\nЕго ещё называют «цифровым золотом»\nПредставь, что золото:\n- Помещается в зашифрованном файле в твоем телефоне\n- Его можно отправить за секунды в любую страну\n- Никто не может его конфисковать\n- Никакой банк его не контролирует\n\nБанк может обанкротиться. Правительство может обесценить деньги.\nBitcoin? Работает 17 лет без остановки. 24/7. Без выходных. Без банкротств.\nЭто первый в истории способ хранить результат твоего труда там, где его не достанет ни одно правительство.",
    skill: "Bitcoin = математика + редкость + свобода",
    reward: 100,
    progress_target: 23,
    options: [
      { text: "Понял, но как это устроено?", action: "next_block" },
      { text: "Какие еще преимущества?", action: "next_block" }
    ]
  },
  {
    id: 4,
    title: "Ключи (Кто владеет, тот и хозяин)",
    speech: "Важное уточнение, исследователь. Твой кошелек (например, Phoenix) — это не банковский счет.\nБиткоинов не существует физически ни в твоем телефоне, ни в облаке, ни в банке. Они — лишь записи в глобальной распределенной базе данных (блокчейне).\nТвой телефон хранит не деньги, а ПРИВАТНЫЕ КЛЮЧИ. Это твоя цифровая подпись. Твой «ключ» — это единственное доказательство твоего права распоряжаться частью ресурсов сети.\nЗапомни: Not your keys, not your bitcoin. Если у тебя есть ключи — ты суверенен. Если ключи у третьей стороны — ты лишь пользователь их сервиса.",
    skill: "Понятие личного владения без посредников",
    reward: 100,
    progress_target: 24,
    options: [
      { text: "Вау, рассказывай дальше", action: "next_block" },
      { text: "Как этим пользоваться в реальной жизни?", action: "next_block" }
    ]
  },
  {
    id: 5,
    title: "Приватность (Быть невидимкой)",
    speech: "Теперь ты готов к следующему уровню.\n\nСистема хочет знать всё.\nЧто ты ел на завтрак. Куда ходил вчера. Сколько потратил на кофе. С кем встречался.\nБанки передают данные правительству. Google знает, где ты был. Твоя кредитная карта — дневник твоей жизни.\n\nВ Италии каждая транзакция больше €2000 автоматически отслеживается. Покупаешь что-то у друга? Отчитайся перед государством.\n\nА если ты не хочешь? Bitcoin дает тебе выбор.\nТвой адрес — это просто набор букв и цифр. Никакого имени. Никакого паспорта.\nМожно создать новый адрес для каждой транзакции. За секунды. Бесплатно.\n\nХочешь отправить кому-то деньги? Никаких вопросов «Зачем?». Никаких комиссий банка. Никаких записей в твоем профиле.\n\nТвои траты — твое личное дело.\nДаже базовый уровень Bitcoin дает тебе больше свободы, чем любой банк в мире.",
    skill: "Базовая цифровая гигиена и право на приватность",
    reward: 100,
    progress_target: 25,
    options: [
      { text: "Совсем никого между мной и получателем средств?!", action: "next_block" },
      { text: "Можно ли это использовать для повседневных покупок или снимать наличные?", action: "next_block" }
    ]
  },
  {
    id: 6,
    title: "Lightning (Мгновенная энергия)",
    speech: "Вот где Bitcoin становится оружием будущего.\n\nБиткоинами можно оплачивать огромное количество вещей, а количество стран и бизнесов где им можно оплачивать покупки постоянно растёт. Помимо оплаты в интернете, при необходимости есть сотни способов конвертации в наличные.\n\nПомнишь, в начале я говорил про награду? Ты получаешь сатоши (сокращенно — SATS).\nСатоши — это самая маленькая часть биткоина. В 1 биткоине 100 миллионов SATS. Они названы в честь меня — создателя Bitcoin, Сатоши Накамото.\n\nИ вот что важно: их можно отправлять друг другу за доли секунды.\nХочешь отправить деньги в Японию? 0.5 секунды.\nКомиссия? Меньше одного цента евро. Иногда доли цента.\nЭто называется Lightning Network.\n\nБезграничная сеть. Твой телефон подключается к миллионам узлов по всему миру.\nНикакого банка посередине. Никакой SWIFT. Никаких «рабочих часов».\nДеньги двигаются со скоростью мысли.",
    skill: "Мгновенные платежи без границ",
    reward: 100,
    progress_target: 26,
    options: [
      { text: "Кому всё это нужно?", action: "next_block" },
      { text: "Звучит сложно, нужно уметь программировать?", action: "next_block", conditional_text: "Нет. Мы сделали это проще Glovo. Идем дальше." }
    ]
  },
  {
    id: 7,
    title: "Карта-щит (Твой пропуск в сопротивление)",
    speech: "Ты почти прошел прототип 1 модуля и через пару минут сможешь забрать свою награду! Пора рассказать куда ты попал.\n\nТы в клубе цифрового сопротивления авторитаризму.\n\nВсего будет 7 модулей.\nВ ближайшее время появятся:\n\n→ 2: Приватность и обход слежки\n→ 3: Защищенная коммуникация\n→ 4: Обход цензуры\n→ 5: Свободный доступ к знаниям\n→ 6: Техно-философия\n→ 7: Инструменты выживания оффлайн\n\nКаждый модуль — это навык. Каждый навык — это часть щита независимости.\n\nК концу ты будешь уметь:\n- Управлять своими средствами так, что ни одно правительство мира не сможет их отнять\n- Общаться так, что никто не прочитает\n- Получать информацию, которую пытаются скрыть\nВыживать в мире, где система пытается тебя контролировать\n\nА самое главное получишь десятки практических навыков для защиты своей свободы так, как нужно именно тебе. Никакой политической программы, только право человека на свободу!\n\nТа прозрачная карта — это пропуск в глобальную сеть людей, которые хотят жить в более честном мире. Передай карту тому, кто поймёт.\n\nМы строим параллельный интернет. И ты только что стал частью этого.",
    skill: "Понимание экосистемы свободы",
    reward: 200,
    progress_target: 27,
    options: [
      { text: "Хорошо, готов забрать SATS", action: "next_block" }
    ]
  },
  {
    id: 8,
    title: "Финальный выбор (Момент истины)",
    speech: "1000 SATS — твои первые деньги, которые не принадлежат банку.\n\nНо есть одна проблема… У тебя еще нет кошелька. Прямо сейчас эти SATS существуют только тут.\n\nТвой финальный шаг:\n\nСоздать личный Bitcoin-кошелек. Это займёт 2 минуты.\nИ все SATS, которые ты заработал, придут на твой адрес. Автоматически.\nЭто момент, когда теория становится реальностью.",
    skill: "Момент принятия финального решения",
    reward: 0,
    progress_target: 27,
    options: [
      { text: "Давай создадим кошелек", action: "create_wallet" },
      {
        text: "Нет, мне нужно подумать",
        action: "show_conditional_text",
        conditional_text: "Понимаю. Свобода пугает.\n\nТвои сатоши будут ждать тебя здесь 72 часа. После этого — они исчезнут.\n\nВыбор за тобой. Всегда был.",
        conditional_options: [
          { text: "Вернуться к созданию кошелька", action: "create_wallet" }
        ]
      }
    ]
  },
];

const WALLET_STEPS_RU: WalletStep[] = [
  {
    id: "step_1",
    title: "Скачай свой личный сейф",
    instruction: "Новичкам советуем используем Phoenix Wallet. Он простой, быстрый и твой.\n\nВажное уточнение, твой кошелек это не банковский счет.\nБиткоинов не существует физически ни в твоем телефоне, ни в облаке, ни в банке. Они — лишь записи в глобальной распределенной базе данных (блокчейне).\nТвой телефон хранит не деньги, а ПРИВАТНЫЕ КЛЮЧИ. Это твоя цифровая подпись. Твой «ключ» — это единственное доказательство твоего права распоряжаться частью ресурсов сети.\nЗапомни: Not your keys, not your bitcoin. Если у тебя есть ключи — ты суверенен. Если ключи у третьей стороны — ты лишь пользователь их сервиса.",
    buttons: [
      { text: "Скачать кошелек для iPhone", url: "https://apps.apple.com/it/app/phoenix-wallet/id1544097028", type: "external" },
      { text: "Скачать кошелек для Android", url: "https://play.google.com/store/apps/details?id=fr.acinq.phoenix.mainnet&pli=1", type: "external" },
      { text: "Уже скачал, что дальше?", type: "next", target: "step_2" }
    ]
  },
  {
    id: "step_2",
    title: "Создай свой кошелек",
    instruction: "Отлично. Приложение скачано.\n\nТеперь открой Phoenix Wallet на своём телефоне.\n\nВот что ты увидишь:\n\nПри первом запуске:\nPhoenix покажет экран приветствия с двумя вариантами:\n- \"Create a new wallet\" (Создать новый кошелек)\n- \"Restore a wallet\" (Восстановить кошелек)\n\nЧто делать:\nНажми на \"Create a new wallet\"\n\nPhoenix автоматически:\n- Сгенерирует твой уникальный кошелек\n- Создаст твой личный Bitcoin-адрес\n- Подготовит всё для приёма платежей\n\nЭто займет 3-5 секунд.\n\nВсё. Кошелек создан.\n\nТы только что вошел в параллельную экономику. У тебя есть личный Bitcoin-адрес, который может принимать платежи со всего мира.\n\nНикаких посредников. Никаких разрешений. Никаких границ.\n\nНо есть еще один критически важный шаг — сохранить ключи от этого кошелька.",
    buttons: [
      { text: "Кошелек создан, что дальше?", type: "next", target: "step_3" }
    ]
  },
  {
    id: "step_3",
    title: "12 слов = абсолютная власть",
    instruction: "Сейчас самое важное.\n\nТвой кошелек защищен 12 словами. Это называется seed-фраза. Твой мастер-ключ.\n\nЭти 12 слов — это единственный способ восстановить доступ к твоим деньгам.\n\nПотерял телефон? Слова восстановят кошелек на новом.\nПотерял слова? Всё. Игра окончена. Никакой техподдержки. Никакого восстановления. Никогда.\n\nПошаговая инструкция:\n\n1. Открой Phoenix Wallet на телефоне\n\n2. Найди иконку шестеренки в правом верхнем углу\n   Это настройки приложения\n\n3. Нажми на шестеренку\n   Откроется меню настроек\n\n4. Найди пункт \"Recovery phrase\" или \"Seed\" или \"Display seed\"\n   (Может называться по-разному в зависимости от версии)\n\n5. Нажми на этот пункт\n   Phoenix покажет предупреждение о безопасности\n\n6. Подтверди, что понимаешь риски\n   (Обычно кнопка \"I understand\" или \"Show seed\")\n\n7. Phoenix покажет твои 12 слов\n   Они пронумерованы от 1 до 12\n\n8. Теперь СОХРАНИ эти слова:\n\n═══════════════════════════════\n\nЛУЧШИЙ ВАРИАНТ (самый безопасный):\n\nРучка + бумага\n- Возьми чистый лист бумаги\n- Запиши все 12 слов РУЧКОЙ (не карандашом)\n- Обязательно сохрани порядок (1, 2, 3... 12)\n- Проверь дважды — нет ли ошибок\n- Спрячь бумагу в надежном месте:\n  Не в кошельке (можно потерять)\n  Не на холодильнике (могут увидеть)\n  Идеально: сейф, книга, конверт в столе\n\n═══════════════════════════════\n\nНЕТ РУЧКИ И БУМАГИ ПОД РУКОЙ?\n\nВременные альтернативы (сделай это СЕГОДНЯ):\n\nВариант 1: Заметки телефона (ОФФЛАЙН)\n- Открой приложение \"Заметки\"\n- Создай новую заметку\n- Запиши все 12 слов в правильном порядке\n- Удали эту заметку СРАЗУ после того, как перепишешь на бумагу!\n\nВариант 2: Запомни наизусть (экстремальный)\n- Прочитай все 12 слов вслух 3 раза подряд\n- Закрой глаза и повтори по памяти\n- Повтори через 10 минут\n\nНИКОГДА не храни seed-фразу:\n- В облаке (Google Drive, iCloud)\n- В мессенджере (WhatsApp, Telegram)\n- В email\n- В скриншоте\n\nГотово?",
    buttons: [
      { text: "Да, записал на бумаге", type: "next", target: "step_4" },
      { text: "Да, сохранил временно (перепишу позже)", type: "next", target: "step_3a" }
    ]
  },
  {
    id: "step_3a",
    title: "Дополнительное предупреждение",
    instruction: "Хорошо. Но помни:\n\nЦифровое хранение seed-фразы — это риск.\n- Телефоны взламывают\n- Облака утекают\n- Приложения крашатся\n- Устройства ломаются\n\nБумага существует 100+ лет.\nЦифровой файл может исчезнуть за секунду.\n\nИдем дальше?",
    buttons: [
      { text: "Понял, идем дальше", type: "next", target: "step_4" }
    ]
  },
  {
    id: "step_4",
    title: "Забери своё",
    instruction: "Сейчас ты получишь свои заработанные SATS.\n\nКак это работает:\n\nКогда нажмешь кнопку \"ПОЛУЧИТЬ 1000 SATS\" внизу, произойдет следующее:\n\n1. Автоматически откроется Phoenix Wallet\n   (Если не открылся — открой вручную)\n\n2. Phoenix покажет уведомление о входящем платеже\n   \"Incoming payment: 1000 sats\"\n\n3. Через пару секунд ты увидишь их на балансе\n   Ты увидишь \"+1000\" в приложении\n\n4. Готово. Деньги твои.\n\nЭто Bitcoin. Мгновенно, анонимно и без посредников.\n\nОт нас к тебе напрямую. Через математику  и криптографию. Через свободу.\n\nДобро пожаловать в параллельную экономику.\n\nТы только что сделал то, что большинство людей никогда не решится сделать:\nВзял контроль над своими деньгами.\n\nТы больше не гость в чужом доме.\nТы — хозяин.\n\nНажимай кнопку. Твои сатоши ждут.",
    buttons: [
      { text: "ПОЛУЧИТЬ 1000 SATS", type: "deeplink", url: "lightning:LNURL1DP68GURN8GHJ7ET4WP5X7UNFVDEKZUNYD9HX2UEJ9EKXUCNFW3EJUCM0D5HHW6T5DPJ8YCTH9ASHQ6F0WCCJ7MRWW4EXCT6P0PZKYUJP8YE8SNPKWQMRVA23DPD8SERCVC2YC4CH", target: "step_5" }
    ]
  },
  {
    id: "step_5",
    title: "Добро пожаловать в сопротивление",
    instruction: "Ты сделал это.\n\n1000 SATS только что прилетели на твой кошелек.\n\nЭто твои первые деньги в параллельной экономике.\n\nЧто дальше?\n\nЕсли хочешь, изучи Phoenix Wallet\n- Попробуй отправить 10 sats другу (если у него тоже есть кошелек)\n- Найди свой адрес\n- Изучи настройки\n\nСледи за обновлениями проекта\nВ ближайшее время выйдут модули 2-7:\n- Приватность и обход слежки\n- Защищенная коммуникация\n- Обход цензуры\n- Свободный доступ к знаниям\n- Техно-философия\n- Инструменты выживания оффлайн\n\nПередай прозрачную карту тому, кто готов.",
    buttons: []
  }
];

const SATOSHI_WISDOM_RU = [
  "Корень проблемы традиционных валют — доверие. Нужно доверять центральному банку, что он не обесценит валюту. История полна примеров нарушения этого доверия.",
  "Bitcoin — это первая реализация концепции криптовалюты. Главное нововведение: сеть без доверенного центра или третьих сторон.",
  "Природа Bitcoin такова, что после выхода версии 0.1 ядро протокола высечено в камне. Я хочу, чтобы вы могли представить его как неизменный.",
  "Потерянные монеты только делают монеты других чуть более ценными. Думайте об этом как о пожертвовании всем остальным.",
  "Сеть устойчива в своей неструктурированной простоте. Узлы работают одновременно с небольшой координацией. Они не нуждаются в идентификации, поскольку сообщения не направляются в конкретное место.",
  "Проблема двойной траты решена через peer-to-peer сеть. Сеть ставит метку времени на транзакции, хешируя их в непрерывную цепь доказательств работы.",
  "Если вы не верите мне или не понимаете — у меня нет времени убеждать вас, извините.",
  "Bitcoin генерируется скоростью, приближающейся к запланированному графику, и это остается верным независимо от того, сколько майнеров участвует.",
  "Через несколько десятилетий, когда награда станет слишком маленькой, комиссия за транзакции станет основным стимулом для узлов.",
  "Написание описания для этого для обычных людей чертовски сложно. Здесь нет ничего, к чему можно привязаться.",
];

export const UI_TEXTS = {
  RU: {
    skillNotification: "+СКИЛЛ",
    followQuestion: "Как следить за обновлениями проекта?",
    followResponse: "Ты можешь скачать приложение — его нельзя удалить из магазинов приложений, потому что оно создано устойчивым к цензуре.\n\nВторая опция — подпишись на фаундера в децентрализованной соц. сети Nostr и следи за всеми новостями там. Мы будем изучать её в следующих блоках.",
    waitMessage: "сначала пройди первый блок, все вопросы потом",
    moduleLabel: "МОДУЛЬ",
    troubleshootingButton: "TROUBLESHOOTING",
    troubleshootingTitle: "ПРОБЛЕМЫ С ПОЛУЧЕНИЕМ",
    troubleshootingSteps: ["Проверь интернет-соединение", "Подожди 30-60 секунд", "Перезапусти Phoenix Wallet", "Если через 5 минут деньги не пришли — свяжись с нами в чате"],
    troubleshootingItems: ["Проверьте, что Phoenix Wallet установлен и открыт", "Нажмите кнопку \"ПОЛУЧИТЬ 1000 SATS\" ещё раз", "Убедитесь, что есть подключение к интернету", "Подождите минуту и попробуйте снова"],
    followButton: "КАК СЛЕДИТЬ ЗА ОБНОВЛЕНИЯМИ ПРОЕКТА?",
    downloadApp: "СКАЧАТЬ ПРИЛОЖЕНИЕ",
    installInstructionsIOS: "Нажми кнопку «Поделиться» (квадрат со стрелкой внизу экрана), затем выбери «На экран Домой»",
    installInstructionsAndroid: "Нажми меню (три точки вверху справа), затем выбери «Установить приложение» или «Добавить на главный экран»",
    installInstructionsFallback: "Добавь этот сайт на главный экран через меню браузера",
    founderNostr: "ФАУНДЕР В NOSTR",
    inputPlaceholder: "Введи ответ...",
    followUpdatesTitle: "СЛЕДИ ЗА ОБНОВЛЕНИЯМИ",
    followUpdatesSubtitle: "Подписывайся на мой канал",
    followTelegramButton: "Telegram",
    followInstagramButton: "Instagram",
  },
  EN: {
    skillNotification: "+SKILL",
    followQuestion: "How do I follow project updates?",
    followResponse: "You can download the app\u2014it cannot be removed from app stores because it is built to be censorship-resistant.\n\nThe second option\u2014follow the founder on the decentralized social network Nostr and track all news there. We will study it in the upcoming blocks.",
    waitMessage: "complete the first block first, all questions later",
    moduleLabel: "1/7 FINANCIAL FREEDOM",
    troubleshootingButton: "TROUBLESHOOTING",
    troubleshootingTitle: "IF THE MONEY DIDN'T ARRIVE:",
    troubleshootingSteps: ["Check your internet connection", "Wait 30-60 seconds", "Restart Phoenix Wallet", "If money hasn't arrived after 5 minutes\u2014contact us in the chat"],
    followButton: "HOW TO FOLLOW UPDATES?",
    downloadApp: "DOWNLOAD APP",
    installInstructionsIOS: "Tap the Share button (square with arrow at bottom), then select \"Add to Home Screen\"",
    installInstructionsAndroid: "Tap the menu (three dots at top right), then select \"Install app\" or \"Add to Home Screen\"",
    installInstructionsFallback: "Add this site to your home screen via browser menu",
    founderNostr: "FOUNDER ON NOSTR",
    inputPlaceholder: "Write a message...",
  },
  IT: {
    skillNotification: "+SKILL",
    followQuestion: "Come seguo gli aggiornamenti del progetto?",
    followResponse: "Puoi scaricare l'app: non pu\u00f2 essere rimossa dagli store perch\u00e9 \u00e8 creata per resistere alla censura.\n\nLa seconda opzione: segui il founder sul social network decentralizzato Nostr e leggi tutte le notizie l\u00ec. Lo studieremo nei prossimi blocchi.",
    waitMessage: "prima completa il primo blocco, tutte le domande dopo",
    moduleLabel: "1/7 LIBERT\u00c0 FINANZIARIA",
    troubleshootingButton: "RISOLUZIONE PROBLEMI",
    troubleshootingTitle: "SE I SOLDI NON SONO ARRIVATI:",
    troubleshootingSteps: ["Controlla la connessione internet", "Aspetta 30-60 secondi", "Riavvia Phoenix Wallet", "Se dopo 5 minuti i soldi non sono arrivati, contattaci in chat"],
    followButton: "COME SEGUIRE GLI AGGIORNAMENTI?",
    downloadApp: "SCARICA L'APP",
    installInstructionsIOS: "Tocca il pulsante Condividi (quadrato con freccia in basso), poi seleziona \"Aggiungi alla schermata Home\"",
    installInstructionsAndroid: "Tocca il menu (tre puntini in alto a destra), poi seleziona \"Installa app\" o \"Aggiungi a schermata Home\"",
    installInstructionsFallback: "Aggiungi questo sito alla schermata Home dal menu del browser",
    founderNostr: "FOUNDER SU NOSTR",
    inputPlaceholder: "Scrivi un messaggio...",
  },
};

export function getLearningBlocks(lang: string): LearningBlock[] {
  if (lang === "EN") return LEARNING_BLOCKS_EN;
  if (lang === "RU") return LEARNING_BLOCKS_RU;
  if (lang === "IT") return LEARNING_BLOCKS_IT;
  return LEARNING_BLOCKS_IT;
}

export function getWalletSteps(lang: string): WalletStep[] {
  if (lang === "EN") return WALLET_STEPS_EN;
  if (lang === "RU") return WALLET_STEPS_RU;
  if (lang === "IT") return WALLET_STEPS_IT;
  return WALLET_STEPS_IT;
}

export function getSatoshiWisdom(lang: string): string[] {
  if (lang === "EN") return SATOSHI_WISDOM_EN;
  if (lang === "RU") return SATOSHI_WISDOM_RU;
  if (lang === "IT") return SATOSHI_WISDOM_IT;
  return SATOSHI_WISDOM_IT;
}

export function getUITexts(lang: string) {
  return UI_TEXTS[lang as keyof typeof UI_TEXTS] || UI_TEXTS.IT;
}

export type { LearningBlock, WalletStep, WalletStepButton, BlockOption, IntermediateQuestion };
