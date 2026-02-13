import type { SkillKey } from "@shared/schema";
import { RU_LEARNING_BLOCKS, RU_WALLET_STEPS, RU_SATOSHI_WISDOM, RU_UI_TEXTS } from "./ru-texts";

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
    speech: "Listen carefully.\n\nYou're here for a reason. This is an alpha test of a digital freedom project. I'll give you tools that will change how you think about freedom online.\n\n10-15 minutes. That's all you need to start.\nEasier than ordering pizza on DoorDash. Seriously.\nNo:\n- registration\n- subscriptions\n- personal data\n- credit cards\nJust you and this chat.\n\nHere's the deal: For every correct answer, you earn pieces of real bitcoin.\nThe progress bar below tracks your journey. Every percent brings you closer to your first reward.\nBelieve it or not\u2014your choice.\nBut if you're here, you feel something's wrong with the system.\nReady to take the first step?",
    skill: "First step toward freedom", grantSkillKey: "WILL_TO_FREEDOM", reward: 100, progress_target: 21,
    options: [{ text: "Yes", action: "next_block" }, { text: "No", action: "go_back", conditional_text: "I get it. The system's comfortable. I'll be here if you change your mind." }]
  },
  {
    id: 2, title: "Banking Slavery (The Truth About Your Money)",
    speech: "You're on the right path.\nLet's start with a simple question: who owns the money in your account?",
    intermediate_question: { text: "Who owns the money in your account?", options: [
      { text: "Me", action: "continue", continued_text: "Actually, no\u2014even though the bank tells you it's yours.\n\nDespite what their app shows, that money isn't your property. It's a record in THEIR database that you're ALLOWED to use.\nTry this: send a large sum to a friend in another country. The bank will immediately ask: \"Where did this come from? Why? Who's it for?\" They can freeze your account simply because their algorithm didn't like your purchase.\nDecided to buy something your government doesn't approve of? Maybe a donation to protesters, a banned book, or a VPN? Account frozen in seconds.\nMoney on a card isn't money\u2014it's a bank's promise.\n\nThat promise works as long as you do what's expected.\nYou can work or save, but essentially you're getting numbers in an app that don't belong to you.\nBanks and states want to own the fruits of your labor and time spent.\n\"App balance\" isn't ownership. It's permission." },
      { text: "The Bank", action: "continue", continued_text: "Correct, even though the bank tells you otherwise.\n\nDespite what their app shows, that money isn't your property. It's just a record in their database that you're permitted to use.\nTry this: send a large sum to a friend in another country. The bank will immediately ask: \"Where did this come from? Why? Who's it for?\" They can freeze your account simply because their algorithm didn't like your purchase.\nDecided to buy something your government doesn't approve of? Maybe a donation to protesters, a banned book, or a VPN? Account frozen in seconds.\nMoney on a card isn't money\u2014it's a bank's promise.\n\nThat promise works as long as you do what's expected.\nYou can work or save, but essentially you're getting numbers in an app that don't belong to you.\nBanks and states want to own the fruits of your labor and time spent.\n\"App balance\" isn't ownership. It's permission." }
    ] },
    speech_continued: "Actually, no\u2014even though the bank tells you it's yours.\n\nDespite what their app shows, that money isn't your property. It's a record in THEIR database that you're ALLOWED to use.\nTry this: send a large sum to a friend in another country. The bank will immediately ask: \"Where did this come from? Why? Who's it for?\" They can freeze your account simply because their algorithm didn't like your purchase.\nDecided to buy something your government doesn't approve of? Maybe a donation to protesters, a banned book, or a VPN? Account frozen in seconds.\nMoney on a card isn't money\u2014it's a bank's promise.\n\nThat promise works as long as you do what's expected.\nYou can work or save, but essentially you're getting numbers in an app that don't belong to you.\nBanks and states want to own the fruits of your labor and time spent.\n\"App balance\" isn't ownership. It's permission.",
    skill: "Understanding that app balance is permission, not ownership", grantSkillKey: "TRUTH_SEEKER", reward: 100, progress_target: 22,
    options: [{ text: "Yeah, but what can I do about it?", action: "next_block" }, { text: "But it's always been this way, it's normal", action: "show_conditional_text", conditional_text: "\"Normal\" is when a bank charges fees to hold YOUR money.\n\n\"Normal\" is when you can't buy a plane ticket without bank approval.\n\nSlavery was once \"normal\" too.\n\nReady to see the way out, or going back to \"normal\"?", conditional_options: [{ text: "Show me the exit", action: "next_block" }, { text: "Return to the start", action: "restart" }] }]
  },
  {
    id: 3, title: "Bitcoin\u2014The Exit (Math vs. Promises)",
    speech: "Good. You're ready to see the exit\u2014Bitcoin.\n\nForget everything you've heard: \"cryptocurrency,\" \"investment,\" \"speculation.\" Technically, Bitcoin is a distributed database spread across the world, and money is like entries in this digital ledger.\n\nIt has no single owner or central authority\u2014the rules are written mathematically. No one can change them unilaterally. There's only a theoretical possibility to change how it operates. That would require millions of people to agree. In practice, it's nearly impossible\u2014the network is deliberately designed to make changes extremely difficult.\n\nBitcoin isn't someone's property or invention\u2014it's primarily a mathematical law protected by cryptography. You could call it the first system in human history where trust is replaced with proof. Rules are enforced by the network itself, not by someone's decree.\n\nIt's also called \"digital gold.\"\nImagine gold that:\n- fits in an encrypted file on your phone\n- can be sent anywhere in seconds\n- no one can confiscate\n- no bank controls\n\nBanks can go bankrupt, governments can debase currency. Bitcoin has run for 17 years straight, 24/7.",
    skill: "Bitcoin = math + scarcity + freedom", grantSkillKey: "HARD_MONEY", reward: 100, progress_target: 23,
    options: [{ text: "Sounds complicated, what do I do with this?", action: "next_block" }, { text: "What other advantages?", action: "next_block" }]
  },
  {
    id: 4, title: "Keys (Whoever Owns, Rules)",
    speech: "Actually, nothing complicated\u2014I promise in a couple minutes you'll own your pieces of Bitcoin!\n\nJust remember, your wallet won't be a bank account, but merely a password keeper and interface for accessing the database (blockchain) where your funds are recorded.\n\nBitcoins don't physically exist in your phone, the cloud, or a bank.\n\nYour phone doesn't store money\u2014it stores PRIVATE KEYS (something like a digital signature). Your \"key\" is the only proof of your right to control Bitcoin.",
    skill: "Concept of personal ownership without intermediaries", reward: 100, progress_target: 24,
    options: [{ text: "Whoa, tell me more", action: "next_block" }, { text: "How do I use this in real life?", action: "next_block" }]
  },
  {
    id: 5, title: "Privacy (Being Invisible)",
    speech: "Now you're ready for the next level.\n\nThe system wants to know everything.\nWhat you ate for breakfast. Where you went yesterday. How much you spent on coffee. Who you met.\nAll banks must share data with the government. Google knows where you've been. Your credit card is a diary of your life.\n\nIn Italy, every transaction over \u20ac2000 is automatically tracked. Buying something from a friend? Report to the state.\n\nWhat if you don't want to? Bitcoin gives you a choice.\nYour address is just a string of letters and numbers. No name. No passport.\nAnd you can create it for free in seconds.\n\nWant to send someone money? No one asks \"Why?\", no one records this transaction in a digital ID with your name.\n\nYour spending is your private business.\nEven basic Bitcoin knowledge gives you more freedom than any bank in the world.",
    skill: "Basic digital hygiene and right to privacy", reward: 100, progress_target: 25,
    options: [{ text: "No one at all between me and the recipient?!", action: "next_block" }, { text: "Can this be used for everyday purchases or withdrawing cash?", action: "next_block" }]
  },
  {
    id: 6, title: "Lightning (Instant Energy)",
    speech: "This is where Bitcoin becomes a weapon of the future.\n\nYou can pay for a huge range of things with bitcoin, and the number of countries and businesses accepting it keeps growing. Beyond online payments, there are hundreds of ways to convert to cash if needed.\n\nRemember when I mentioned the reward? You're earning satoshis (shortened to SATS).\nSatoshis are the smallest unit of bitcoin. One bitcoin contains 100 million SATS. They're named after me\u2014Bitcoin's creator, Satoshi Nakamoto.\n\nAnd here's what matters: you can send them to each other at the speed of light.\nTransfer to Japan? Half a second!\nFee? Fractions of a euro cent.\nThis is called Lightning Network.\n\nA boundless network. Your phone connects to millions of nodes worldwide.\nNo bank in between. No SWIFT or IBAN. No \"business hours.\"\nMoney moves at the speed of thought.",
    skill: "Instant payments without borders", grantSkillKey: "GRID_RUNNER", reward: 100, progress_target: 26,
    options: [{ text: "Who needs all this?", action: "next_block" }, { text: "Sounds complicated, do I need to code?", action: "next_block", conditional_text: "No. We made this easier than DoorDash. Let's continue." }]
  },
  {
    id: 7, title: "Shield Card (Your Resistance Pass)",
    speech: "You've almost completed the prototype of Module 1 and in a couple minutes can claim your reward! Time to tell you where you've landed.\n\nYou're in a club of digital resistance against authoritarianism.\n\nThere will be 7 modules total.\nComing soon:\n\n\u2192 2: Privacy and surveillance evasion\n\u2192 3: Secure communication\n\u2192 4: Censorship circumvention\n\u2192 5: Free access to knowledge\n\u2192 6: Techno-philosophy\n\u2192 7: Offline survival tools\n\nEach module is a skill. Each skill is part of your independence shield.\n\nBy the end you'll know how to:\n- manage your assets so no government can take them\n- communicate so no one can read it\n- access information they're trying to hide\n- respond to internet shutdowns in your country\n- live as freely as possible in a world where the system tries to control you\n\nAnd most importantly, you'll gain dozens of practical skills to protect your freedom the way YOU need!\nNo political agenda\u2014just human rights to freedom!\n\nThat transparent card is your pass into a global network of people who want to live in a more honest world. Pass it to someone who'll understand.\n\nWe're building a parallel internet. And you just became part of it.",
    skill: "Understanding the freedom ecosystem", reward: 200, progress_target: 27,
    options: [{ text: "Alright, ready to claim my SATS", action: "next_block" }]
  },
  {
    id: 8, title: "Final Choice (Moment of Truth)",
    speech: "1000 SATS\u2014your first money that doesn't belong to a bank.\n\nBut there's one problem... You don't have a wallet yet. Right now these SATS only exist here.\n\nYour final step:\n\nCreate a personal Bitcoin wallet. Takes 2 minutes.\nAnd all the SATS you've earned will automatically arrive at your address.\n\nThis is when theory becomes reality.",
    skill: "Moment of final decision", reward: 0, progress_target: 27,
    options: [{ text: "Let's create a wallet", action: "create_wallet" }, { text: "No, I need to think", action: "show_conditional_text", conditional_text: "I understand. Freedom is scary.\n\nYour satoshis will wait here for 72 hours. After that\u2014they vanish.\n\nChoice is yours.", conditional_options: [{ text: "Return to wallet creation", action: "create_wallet" }] }]
  },
];

const LEARNING_BLOCKS_IT: LearningBlock[] = [
  {
    id: 1, title: "Disclaimer (Primo colpo)",
    speech: "Ascolta attentamente.\n\nSei qui per un motivo. Questo \u00e8 un alpha test di un progetto sulla libert\u00e0 digitale. Ti dar\u00f2 strumenti che cambieranno il tuo modo di pensare alla libert\u00e0 online.\n\n10-15 minuti. \u00c8 tutto ci\u00f2 che ti serve per iniziare.\nPi\u00f9 facile che ordinare una pizza su Glovo. Davvero.\nNiente:\n- registrazione\n- abbonamenti\n- dati personali\n- carte di credito\nSolo tu e questa chat.\n\nEcco il patto: per ogni risposta corretta, guadagni pezzi di bitcoin veri.\nLa barra di progressione sotto traccia il tuo viaggio. Ogni percentuale ti avvicina alla prima ricompensa.\nCrederci o no\u2014scelta tua.\nMa se sei qui, senti che qualcosa non va nel sistema.\nPronto a fare il primo passo?",
    skill: "Primo passo verso la libert\u00e0", grantSkillKey: "WILL_TO_FREEDOM", reward: 100, progress_target: 21,
    options: [{ text: "S\u00ec", action: "next_block" }, { text: "No", action: "go_back", conditional_text: "Capisco. Il sistema \u00e8 comodo. Sar\u00f2 qui se cambi idea." }]
  },
  {
    id: 2, title: "Schiavit\u00f9 bancaria (La verit\u00e0 sui tuoi soldi)",
    speech: "Sei sulla strada giusta.\nIniziamo con una domanda semplice: a chi appartengono i soldi sul tuo conto?",
    intermediate_question: { text: "A chi appartengono i soldi sul tuo conto?", options: [
      { text: "A me", action: "continue", continued_text: "In realt\u00e0 no\u2014anche se la banca ti dice che sono tuoi.\n\nNonostante quello che mostra la loro app, quei soldi non sono tua propriet\u00e0. Sono un record nel LORO database che ti \u00e8 PERMESSO usare.\nProva questo: invia una grossa somma a un amico in un altro paese. La banca chieder\u00e0 subito: \"Da dove vengono? Perch\u00e9? A chi?\" Possono bloccare il tuo conto semplicemente perch\u00e9 al loro algoritmo non \u00e8 piaciuto il tuo acquisto.\nHai deciso di comprare qualcosa che il tuo governo non approva? Magari una donazione a manifestanti, un libro proibito o una VPN? Conto congelato in secondi.\nI soldi su carta non sono soldi\u2014sono una promessa della banca.\n\nQuella promessa funziona finch\u00e9 fai quello che ci si aspetta da te.\nPuoi lavorare o risparmiare, ma essenzialmente stai ottenendo numeri in un'app che non ti appartengono.\nBanche e stati vogliono possedere i frutti del tuo lavoro e del tempo speso.\n\"Saldo nell'app\" non \u00e8 propriet\u00e0. \u00c8 permesso." },
      { text: "Alla banca", action: "continue", continued_text: "Corretto, anche se la banca ti dice il contrario.\n\nNonostante quello che mostra la loro app, quei soldi non sono tua propriet\u00e0. Sono solo un record nel loro database che ti \u00e8 permesso usare.\nProva questo: invia una grossa somma a un amico in un altro paese. La banca chieder\u00e0 subito: \"Da dove vengono? Perch\u00e9? A chi?\" Possono bloccare il tuo conto semplicemente perch\u00e9 al loro algoritmo non \u00e8 piaciuto il tuo acquisto.\nHai deciso di comprare qualcosa che il tuo governo non approva? Magari una donazione a manifestanti, un libro proibito o una VPN? Conto congelato in secondi.\nI soldi su carta non sono soldi\u2014sono una promessa della banca.\n\nQuella promessa funziona finch\u00e9 fai quello che ci si aspetta da te.\nPuoi lavorare o risparmiare, ma essenzialmente stai ottenendo numeri in un'app che non ti appartengono.\nBanche e stati vogliono possedere i frutti del tuo lavoro e del tempo speso.\n\"Saldo nell'app\" non \u00e8 propriet\u00e0. \u00c8 permesso." }
    ] },
    speech_continued: "In realt\u00e0 no\u2014anche se la banca ti dice che sono tuoi.\n\nNonostante quello che mostra la loro app, quei soldi non sono tua propriet\u00e0. Sono un record nel LORO database che ti \u00e8 PERMESSO usare.\nProva questo: invia una grossa somma a un amico in un altro paese. La banca chieder\u00e0 subito: \"Da dove vengono? Perch\u00e9? A chi?\" Possono bloccare il tuo conto semplicemente perch\u00e9 al loro algoritmo non \u00e8 piaciuto il tuo acquisto.\nHai deciso di comprare qualcosa che il tuo governo non approva? Magari una donazione a manifestanti, un libro proibito o una VPN? Conto congelato in secondi.\nI soldi su carta non sono soldi\u2014sono una promessa della banca.\n\nQuella promessa funziona finch\u00e9 fai quello che ci si aspetta da te.\nPuoi lavorare o risparmiare, ma essenzialmente stai ottenendo numeri in un'app che non ti appartengono.\nBanche e stati vogliono possedere i frutti del tuo lavoro e del tempo speso.\n\"Saldo nell'app\" non \u00e8 propriet\u00e0. \u00c8 permesso.",
    skill: "Capire che il saldo nell'app \u00e8 permesso, non propriet\u00e0", grantSkillKey: "TRUTH_SEEKER", reward: 100, progress_target: 22,
    options: [{ text: "Gi\u00e0, ma cosa posso farci?", action: "next_block" }, { text: "Ma \u00e8 sempre stato cos\u00ec, \u00e8 normale", action: "show_conditional_text", conditional_text: "\"Normale\" \u00e8 quando una banca ti fa pagare commissioni per tenere i TUOI soldi.\n\n\"Normale\" \u00e8 quando non puoi comprare un biglietto aereo senza l'approvazione della banca.\n\nAnche la schiavit\u00f9 era \"normale\" un tempo.\n\nPronto a vedere la via d'uscita, o torni alla \"normalit\u00e0\"?", conditional_options: [{ text: "Mostrami l'uscita", action: "next_block" }, { text: "Torna all'inizio", action: "restart" }] }]
  },
  {
    id: 3, title: "Bitcoin\u2014L'uscita (Matematica vs. Promesse)",
    speech: "Bene. Sei pronto a vedere l'uscita\u2014Bitcoin.\n\nDimentica tutto quello che hai sentito: \"criptovaluta,\" \"investimento,\" \"speculazione.\" Tecnicamente, Bitcoin \u00e8 un database distribuito nel mondo, e il denaro \u00e8 come voci in questo registro digitale.\n\nNon ha un singolo proprietario o autorit\u00e0 centrale\u2014le regole sono scritte matematicamente. Nessuno pu\u00f2 cambiarle unilateralmente. C'\u00e8 solo una possibilit\u00e0 teorica di cambiare come funziona. Richiederebbe l'accordo di milioni di persone. In pratica, \u00e8 quasi impossibile\u2014la rete \u00e8 deliberatamente progettata per rendere le modifiche estremamente difficili.\n\nBitcoin non \u00e8 propriet\u00e0 di qualcuno o un'invenzione\u2014\u00e8 principalmente una legge matematica protetta dalla crittografia. Potresti chiamarlo il primo sistema nella storia umana dove la fiducia \u00e8 sostituita dalla prova. Le regole sono applicate dalla rete stessa, non dal decreto di qualcuno.\n\n\u00c8 anche chiamato \"oro digitale.\"\nImmagina oro che:\n- sta in un file criptato sul tuo telefono\n- pu\u00f2 essere inviato ovunque in secondi\n- nessuno pu\u00f2 confiscare\n- nessuna banca controlla\n\nLe banche possono fallire, i governi possono svalutare la valuta. Bitcoin funziona da 17 anni di fila, 24/7.",
    skill: "Bitcoin = matematica + scarsit\u00e0 + libert\u00e0", grantSkillKey: "HARD_MONEY", reward: 100, progress_target: 23,
    options: [{ text: "Sembra complicato, cosa ci faccio?", action: "next_block" }, { text: "Quali altri vantaggi?", action: "next_block" }]
  },
  {
    id: 4, title: "Chiavi (Chi possiede, comanda)",
    speech: "In realt\u00e0, niente di complicato\u2014prometto che in un paio di minuti possiederai i tuoi pezzi di Bitcoin!\n\nRicorda solo, il tuo wallet non sar\u00e0 un conto bancario, ma semplicemente un custode di password e un'interfaccia per accedere al database (blockchain) dove sono registrati i tuoi fondi.\n\nI bitcoin non esistono fisicamente nel tuo telefono, nel cloud o in una banca.\n\nIl tuo telefono non conserva denaro\u2014conserva CHIAVI PRIVATE (qualcosa come una firma digitale). La tua \"chiave\" \u00e8 l'unica prova del tuo diritto di controllare Bitcoin.",
    skill: "Concetto di propriet\u00e0 personale senza intermediari", reward: 100, progress_target: 24,
    options: [{ text: "Wow, dimmi di pi\u00f9", action: "next_block" }, { text: "Come lo uso nella vita reale?", action: "next_block" }]
  },
  {
    id: 5, title: "Privacy (Essere invisibile)",
    speech: "Ora sei pronto per il livello successivo.\n\nIl sistema vuole sapere tutto.\nCosa hai mangiato a colazione. Dove sei andato ieri. Quanto hai speso per il caff\u00e8. Chi hai incontrato.\nTutte le banche devono condividere dati con il governo. Google sa dove sei stato. La tua carta di credito \u00e8 un diario della tua vita.\n\nIn Italia, ogni transazione oltre \u20ac2000 \u00e8 automaticamente tracciata. Compri qualcosa da un amico? Segnalalo allo stato.\n\nE se non vuoi? Bitcoin ti d\u00e0 una scelta.\nIl tuo indirizzo \u00e8 solo una stringa di lettere e numeri. Nessun nome. Nessun passaporto.\nE puoi crearlo gratis in secondi.\n\nVuoi inviare denaro a qualcuno? Nessuno chiede \"Perch\u00e9?\", nessuno registra questa transazione in un ID digitale con il tuo nome.\n\nLa tua spesa \u00e8 affar tuo.\nAnche la conoscenza base di Bitcoin ti d\u00e0 pi\u00f9 libert\u00e0 di qualsiasi banca al mondo.",
    skill: "Igiene digitale di base e diritto alla privacy", reward: 100, progress_target: 25,
    options: [{ text: "Nessuno affatto tra me e il destinatario?!", action: "next_block" }, { text: "Posso usarlo per acquisti quotidiani o prelevare contanti?", action: "next_block" }]
  },
  {
    id: 6, title: "Lightning (Energia istantanea)",
    speech: "Ecco dove Bitcoin diventa un'arma del futuro.\n\nPuoi pagare un'enorme gamma di cose con bitcoin, e il numero di paesi e aziende che lo accettano continua a crescere. Oltre ai pagamenti online, ci sono centinaia di modi per convertire in contanti se necessario.\n\nRicordi quando ho menzionato la ricompensa? Stai guadagnando satoshi (abbreviato SATS).\nI satoshi sono l'unit\u00e0 pi\u00f9 piccola di bitcoin. Un bitcoin contiene 100 milioni di SATS. Prendono il nome da me\u2014il creatore di Bitcoin, Satoshi Nakamoto.\n\nEd ecco cosa conta: puoi inviarli l'uno all'altro alla velocit\u00e0 della luce.\nTrasferimento in Giappone? Mezzo secondo!\nCommissione? Frazioni di centesimi di euro.\nSi chiama Lightning Network.\n\nUna rete sconfinata. Il tuo telefono si connette a milioni di nodi in tutto il mondo.\nNessuna banca in mezzo. Nessun SWIFT o IBAN. Nessun \"orario d'ufficio.\"\nIl denaro si muove alla velocit\u00e0 del pensiero.",
    skill: "Pagamenti istantanei senza confini", grantSkillKey: "GRID_RUNNER", reward: 100, progress_target: 26,
    options: [{ text: "A chi serve tutto questo?", action: "next_block" }, { text: "Sembra complicato, devo saper programmare?", action: "next_block", conditional_text: "No. L'abbiamo reso pi\u00f9 facile di Glovo. Continuiamo." }]
  },
  {
    id: 7, title: "Carta-scudo (Il tuo pass di resistenza)",
    speech: "Hai quasi completato il prototipo del Modulo 1 e tra un paio di minuti puoi reclamare la tua ricompensa! \u00c8 ora di dirti dove sei finito.\n\nSei in un club di resistenza digitale contro l'autoritarismo.\n\nCi saranno 7 moduli in totale.\nIn arrivo:\n\n\u2192 2: Privacy ed evasione della sorveglianza\n\u2192 3: Comunicazione sicura\n\u2192 4: Elusione della censura\n\u2192 5: Accesso libero alla conoscenza\n\u2192 6: Tecno-filosofia\n\u2192 7: Strumenti di sopravvivenza offline\n\nOgni modulo \u00e8 una skill. Ogni skill \u00e8 parte del tuo scudo di indipendenza.\n\nAlla fine saprai come:\n- gestire i tuoi beni cos\u00ec nessun governo pu\u00f2 prenderli\n- comunicare in modo che nessuno possa leggere\n- accedere a informazioni che stanno cercando di nascondere\n- rispondere a blackout internet nel tuo paese\n- vivere nel modo pi\u00f9 libero possibile in un mondo dove il sistema cerca di controllarti\n\nE soprattutto, otterrai decine di skill pratiche per proteggere la tua libert\u00e0 nel modo di cui HAI bisogno!\nNessuna agenda politica\u2014solo diritti umani alla libert\u00e0!\n\nQuella carta trasparente \u00e8 il tuo pass in una rete globale di persone che vogliono vivere in un mondo pi\u00f9 onesto. Passala a qualcuno che capir\u00e0.\n\nStiamo costruendo un internet parallelo. E sei appena diventato parte di esso.",
    skill: "Comprendere l'ecosistema della libert\u00e0", reward: 200, progress_target: 27,
    options: [{ text: "Va bene, pronto a reclamare i miei SATS", action: "next_block" }]
  },
  {
    id: 8, title: "Scelta finale (Momento della verit\u00e0)",
    speech: "1000 SATS\u2014i tuoi primi soldi che non appartengono a una banca.\n\nMa c'\u00e8 un problema... Non hai ancora un wallet. In questo momento questi SATS esistono solo qui.\n\nIl tuo passo finale:\n\nCreare un wallet Bitcoin personale. Ci vogliono 2 minuti.\n\nE tutti i SATS che hai guadagnato arriveranno automaticamente al tuo indirizzo.\n\nQuesto \u00e8 quando la teoria diventa realt\u00e0.",
    skill: "Momento della decisione finale", reward: 0, progress_target: 27,
    options: [{ text: "Creiamo un wallet", action: "create_wallet" }, { text: "No, devo pensarci", action: "show_conditional_text", conditional_text: "Capisco. La libert\u00e0 fa paura.\n\nI tuoi satoshi ti aspetteranno qui per 72 ore. Dopo\u2014svaniscono.\n\nLa scelta \u00e8 tua.", conditional_options: [{ text: "Torna alla creazione del wallet", action: "create_wallet" }] }]
  },
];

const WALLET_STEPS_EN: WalletStep[] = [
  { id: "step_1", title: "Download Your Personal Vault", instruction: "For beginners, we recommend Phoenix Wallet. Simple and fast.", buttons: [{ text: "Download wallet for iPhone", url: "https://apps.apple.com/it/app/phoenix-wallet/id1544097028", type: "external" }, { text: "Download wallet for Android", url: "https://play.google.com/store/apps/details?id=fr.acinq.phoenix.mainnet&pli=1", type: "external" }, { text: "Already downloaded, what's next?", type: "next", target: "step_2" }] },
  { id: "step_2", title: "Create Your Wallet", instruction: "Great, app downloaded.\n\nNow open it on your phone.\n\nHere's what you'll see:\n\nFirst launch:\nPhoenix will show a welcome screen with two options:\n- \"Create a new wallet\"\n- \"Restore a wallet\"\n\nWhat to do:\nTap \"Create a new wallet\"\n\nPhoenix will automatically:\n- Generate your unique wallet\n- Create your personal Bitcoin address\n- Prepare everything for receiving payments\n\nTakes 3-5 seconds.\n\nDone. Wallet created.\n\nYou just entered the parallel economy. You have a personal Bitcoin address that can receive payments from anywhere in the world.\n\nNo intermediaries. No permissions. No borders.\n\nBut there's one more critical step\u2014saving the keys to this wallet.", buttons: [{ text: "Wallet created, what's next?", type: "next", target: "step_3" }] },
  { id: "step_3", title: "12 Words = Absolute Power", instruction: "Now for the most important part.\n\nYour wallet is protected by 12 words. This is called a seed phrase. Your master key.\n\nThese 12 words are the ONLY way to restore access to your money.\n\nLost your phone? Words restore the wallet on a new one.\nLost the words? Game over. No tech support. No recovery. Ever.\n\nStep-by-step:\n\n1. Open Phoenix on your phone\n\n2. Find the gear icon in the top right corner\n   That's the app settings\n\n3. Tap the gear\n   Settings menu opens\n\n4. Find \"Recovery phrase\" or \"Seed\" or \"Display seed\"\n   (May be named differently depending on version)\n\n5. Tap that item\n   Phoenix will show a security warning\n\n6. Confirm you understand the risks\n   (Usually \"I understand\" or \"Show seed\" button)\n\n7. Phoenix will display your 12 words\n   Numbered 1 to 12\n\n8. Now SAVE these words:\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\nBEST OPTION (most secure):\n\nPen + paper\n- Get a clean sheet of paper\n- Write all 12 words with a PEN (not pencil)\n- Maintain order (1, 2, 3... 12)\n- Double-check for errors\n- Hide the paper somewhere safe:\n  Not in your wallet (can be lost)\n  Not on the fridge (can be seen)\n  Ideal: safe, book, envelope in desk\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\nNO PEN AND PAPER HANDY?\n\nTemporary alternatives (do this TODAY):\n\nOption 1: Phone notes (OFFLINE)\n- Open \"Notes\" app\n- Create new note\n- Write all 12 words in correct order\n- Delete this note IMMEDIATELY after copying to paper!\n\nOption 2: Memorize (extreme)\n- Read all 12 words aloud 3 times\n- Close eyes and repeat from memory\n- Repeat after 10 minutes\n\nNEVER store seed phrase:\n- In the cloud (Google Drive, iCloud)\n- In a messenger (WhatsApp, Telegram)\n- In email\n- In a screenshot\n\nDone?", buttons: [{ text: "Yes, written on paper", type: "next", target: "step_4" }, { text: "Yes, saved temporarily (will rewrite later)", type: "next", target: "step_3a" }] },
  { id: "step_3a", title: "Additional Warning", instruction: "Okay. But remember:\n\nDigital storage of seed phrases is risky.\n- Phones get hacked\n- Clouds leak\n- Apps crash\n- Devices break\n\nPaper lasts 100+ years.\nA digital file can vanish in a second.\n\nShall we continue?", buttons: [{ text: "Got it, let's go", type: "next", target: "step_4" }] },
  { id: "step_4", title: "Claim What's Yours", instruction: "Now you'll receive your earned SATS.\n\nHow it works:\n\nWhen you hit the \"RECEIVE 1000 SATS\" button below, this happens:\n\n1. Phoenix Wallet automatically opens\n   (If it doesn't\u2014open manually)\n\n2. Phoenix shows an incoming payment notification\n   \"Incoming payment: 1000 sats\"\n\n3. In a couple seconds you'll see them in your balance\n   You'll see \"+1000\" in the app\n\n4. Done. Money's yours.\n\nThis is Bitcoin. Instant, anonymous, no intermediaries.\n\nFrom us to you directly. Through math and cryptography. Through freedom.\n\nWelcome to the parallel economy.\n\nYou just did what most people will never dare:\nTook control of your money.\n\nYou're no longer a guest in someone else's house.\nYou're the owner.\n\nHit the button. Your satoshis are waiting.", buttons: [{ text: "RECEIVE 1000 SATS", type: "deeplink", url: "lightning:LNURL1DP68GURN8GHJ7ET4WP5X7UNFVDEKZUNYD9HX2UEJ9EKXUCNFW3EJUCM0D5HHW6T5DPJ8YCTH9ASHQ6F0WCCJ7MRWW4EXCT6P0PZKYUJP8YE8SNPKWQMRVA23DPD8SERCVC2YC4CH", target: "step_5" }] },
  { id: "step_5", title: "Welcome to the Resistance", instruction: "You did it.\n\n1000 SATS just landed in your wallet.\n\nYour first money in the parallel economy.\n\nWhat's next?\n\nIf you want, explore Phoenix Wallet\n- Try sending 10 SATS to a friend (if they have a wallet too)\n- Find your address\n- Poke around settings\n\nFollow project updates\nThe full version of this module and modules 2-7 coming soon:\n- Privacy and surveillance evasion\n- Secure communication\n- Censorship circumvention\n- Free access to knowledge\n- Techno-philosophy\n- Offline survival tools\n\nPass the transparent card to someone who's ready.", buttons: [] },
];

const WALLET_STEPS_IT: WalletStep[] = [
  { id: "step_1", title: "Scarica il tuo caveau personale", instruction: "Per i principianti, raccomandiamo Phoenix Wallet. Semplice e veloce.", buttons: [{ text: "Scarica wallet per iPhone", url: "https://apps.apple.com/it/app/phoenix-wallet/id1544097028", type: "external" }, { text: "Scarica wallet per Android", url: "https://play.google.com/store/apps/details?id=fr.acinq.phoenix.mainnet&pli=1", type: "external" }, { text: "Gi\u00e0 scaricato, e ora?", type: "next", target: "step_2" }] },
  { id: "step_2", title: "Crea il tuo wallet", instruction: "Ottimo, app scaricata.\n\nOra aprila sul tuo telefono.\n\nEcco cosa vedrai:\n\nPrimo avvio:\nPhoenix mostrer\u00e0 una schermata di benvenuto con due opzioni:\n- \"Create a new wallet\" (Crea un nuovo wallet)\n- \"Restore a wallet\" (Ripristina un wallet)\n\nCosa fare:\nTocca \"Create a new wallet\"\n\nPhoenix automaticamente:\n- Generer\u00e0 il tuo wallet unico\n- Creer\u00e0 il tuo indirizzo Bitcoin personale\n- Preparer\u00e0 tutto per ricevere pagamenti\n\nCi vogliono 3-5 secondi.\n\nFatto. Wallet creato.\n\nSei appena entrato nell'economia parallela. Hai un indirizzo Bitcoin personale che pu\u00f2 ricevere pagamenti da qualsiasi parte del mondo.\n\nNessun intermediario. Nessun permesso. Nessun confine.\n\nMa c'\u00e8 ancora un passo critico\u2014salvare le chiavi di questo wallet.", buttons: [{ text: "Wallet creato, e ora?", type: "next", target: "step_3" }] },
  { id: "step_3", title: "12 parole = Potere assoluto", instruction: "Ora la parte pi\u00f9 importante.\n\nIl tuo wallet \u00e8 protetto da 12 parole. Si chiama seed phrase. La tua chiave maestra.\n\nQueste 12 parole sono l'UNICO modo per ripristinare l'accesso ai tuoi soldi.\n\nPerso il telefono? Le parole ripristinano il wallet su uno nuovo.\nPerse le parole? Game over. Nessun supporto tecnico. Nessun recupero. Mai.\n\nPasso dopo passo:\n\n1. Apri Phoenix sul tuo telefono\n\n2. Trova l'icona dell'ingranaggio in alto a destra\n   Sono le impostazioni dell'app\n\n3. Tocca l'ingranaggio\n   Si apre il menu impostazioni\n\n4. Trova \"Recovery phrase\" o \"Seed\" o \"Display seed\"\n   (Pu\u00f2 chiamarsi diversamente a seconda della versione)\n\n5. Tocca quella voce\n   Phoenix mostrer\u00e0 un avviso di sicurezza\n\n6. Conferma di capire i rischi\n   (Solitamente pulsante \"I understand\" o \"Show seed\")\n\n7. Phoenix mostrer\u00e0 le tue 12 parole\n   Numerate da 1 a 12\n\n8. Ora SALVA queste parole:\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\nOPZIONE MIGLIORE (pi\u00f9 sicura):\n\nPenna + carta\n- Prendi un foglio pulito\n- Scrivi tutte le 12 parole con una PENNA (non matita)\n- Mantieni l'ordine (1, 2, 3... 12)\n- Ricontrolla per errori\n- Nascondi il foglio in un posto sicuro:\n  Non nel portafoglio (pu\u00f2 essere perso)\n  Non sul frigo (pu\u00f2 essere visto)\n  Ideale: cassaforte, libro, busta in scrivania\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\nSENZA PENNA E CARTA A PORTATA?\n\nAlternative temporanee (fallo OGGI):\n\nOpzione 1: Note del telefono (OFFLINE)\n- Apri app \"Note\"\n- Crea nuova nota\n- Scrivi tutte le 12 parole nell'ordine corretto\n- Elimina questa nota IMMEDIATAMENTE dopo averla copiata su carta!\n\nOpzione 2: Memorizza (estremo)\n- Leggi tutte le 12 parole ad alta voce 3 volte\n- Chiudi gli occhi e ripeti a memoria\n- Ripeti dopo 10 minuti\n\nMAI conservare seed phrase:\n- Nel cloud (Google Drive, iCloud)\n- In messenger (WhatsApp, Telegram)\n- In email\n- In screenshot\n\nFatto?", buttons: [{ text: "S\u00ec, scritto su carta", type: "next", target: "step_4" }, { text: "S\u00ec, salvato temporaneamente (riscriver\u00f2 dopo)", type: "next", target: "step_3a" }] },
  { id: "step_3a", title: "Avviso aggiuntivo", instruction: "Ok. Ma ricorda:\n\nLa conservazione digitale della seed phrase \u00e8 rischiosa.\n- I telefoni vengono hackerati\n- I cloud perdono dati\n- Le app crashano\n- I dispositivi si rompono\n\nLa carta dura 100+ anni.\nUn file digitale pu\u00f2 svanire in un secondo.\n\nContinuiamo?", buttons: [{ text: "Capito, andiamo", type: "next", target: "step_4" }] },
  { id: "step_4", title: "Reclama ci\u00f2 che \u00e8 tuo", instruction: "Ora riceverai i tuoi SATS guadagnati.\n\nCome funziona:\n\nQuando premi il pulsante \"RICEVI 1000 SATS\" sotto, succede questo:\n\n1. Phoenix Wallet si apre automaticamente\n   (Se non lo fa\u2014apri manualmente)\n\n2. Phoenix mostra una notifica di pagamento in arrivo\n   \"Incoming payment: 1000 sats\"\n\n3. In un paio di secondi li vedrai nel tuo saldo\n   Vedrai \"+1000\" nell'app\n\n4. Fatto. I soldi sono tuoi.\n\nQuesto \u00e8 Bitcoin. Istantaneo, anonimo, senza intermediari.\n\nDa noi a te direttamente. Attraverso matematica e crittografia. Attraverso libert\u00e0.\n\nBenvenuto nell'economia parallela.\n\nHai appena fatto ci\u00f2 che la maggior parte delle persone non oser\u00e0 mai:\nPreso il controllo dei tuoi soldi.\n\nNon sei pi\u00f9 ospite in casa di qualcun altro.\nSei il proprietario.\n\nPremi il pulsante. I tuoi satoshi ti aspettano.", buttons: [{ text: "RICEVI 1000 SATS", type: "deeplink", url: "lightning:LNURL1DP68GURN8GHJ7ET4WP5X7UNFVDEKZUNYD9HX2UEJ9EKXUCNFW3EJUCM0D5HHW6T5DPJ8YCTH9ASHQ6F0WCCJ7MRWW4EXCT6P0PZKYUJP8YE8SNPKWQMRVA23DPD8SERCVC2YC4CH", target: "step_5" }] },
  { id: "step_5", title: "Benvenuto nella resistenza", instruction: "Ce l'hai fatta.\n\n1000 SATS sono appena atterrati nel tuo wallet.\n\nI tuoi primi soldi nell'economia parallela.\n\nE ora?\n\nSe vuoi, esplora Phoenix Wallet\n- Prova a inviare 10 SATS a un amico (se ha anche lui un wallet)\n- Trova il tuo indirizzo\n- Esplora le impostazioni\n\nSegui gli aggiornamenti del progetto\nLa versione completa di questo modulo e i moduli 2-7 in arrivo:\n- Privacy ed evasione della sorveglianza\n- Comunicazione sicura\n- Elusione della censura\n- Accesso libero alla conoscenza\n- Tecno-filosofia\n- Strumenti di sopravvivenza offline\n\nPassa la carta trasparente a qualcuno che \u00e8 pronto.", buttons: [] },
];

const SATOSHI_WISDOM_EN = [
  "The root problem with conventional currency is all the trust required. You have to trust the central bank not to debase the currency. History is full of breaches of that trust.",
  "Bitcoin is the first system where trust is replaced with math. No need to trust a bank or government. Code doesn't lie.",
  "Once Bitcoin launched, the rules were set in stone. No one can change them. This is protection against the arbitrary power of authority.",
  "Lost coins make the rest more valuable. It's a donation to all other Bitcoin holders.",
  "The network is robust in its simplicity. Millions of nodes operate independently. No need to ask permission. No coordination needed.",
  "The double-spending problem is solved without a central controller. The peer-to-peer network timestamps every transaction. Gaming the system is impossible.",
  "If you don't understand\u2014that's normal. Freedom requires effort. Slavery is more comfortable.",
  "Bitcoin can't be printed at a politician's whim. Emission is coded. 21 million coins. Forever.",
  "When block rewards become small, fees will motivate miners. The system is self-sustaining.",
  "Explaining this to ordinary people is hard. Nothing here is familiar. This is a new paradigm of money.",
];

const SATOSHI_WISDOM_IT = [
  "Il problema alla radice delle valute convenzionali \u00e8 tutta la fiducia richiesta. Devi fidarti che la banca centrale non svaluter\u00e0 la valuta. La storia \u00e8 piena di violazioni di quella fiducia.",
  "Bitcoin \u00e8 il primo sistema dove la fiducia \u00e8 sostituita dalla matematica. Non serve fidarsi di una banca o di un governo. Il codice non mente.",
  "Una volta lanciato Bitcoin, le regole sono state scolpite nella pietra. Nessuno pu\u00f2 cambiarle. Questa \u00e8 protezione contro il potere arbitrario dell'autorit\u00e0.",
  "Le monete perse rendono le altre pi\u00f9 preziose. \u00c8 una donazione a tutti gli altri possessori di Bitcoin.",
  "La rete \u00e8 robusta nella sua semplicit\u00e0. Milioni di nodi operano indipendentemente. Non serve chiedere permesso. Non serve coordinamento.",
  "Il problema della doppia spesa \u00e8 risolto senza un controllore centrale. La rete peer-to-peer marca temporalmente ogni transazione. Ingannare il sistema \u00e8 impossibile.",
  "Se non capisci\u2014\u00e8 normale. La libert\u00e0 richiede sforzo. La schiavit\u00f9 \u00e8 pi\u00f9 comoda.",
  "Bitcoin non pu\u00f2 essere stampato al capriccio di un politico. L'emissione \u00e8 codificata. 21 milioni di monete. Per sempre.",
  "Quando le ricompense dei blocchi diventeranno piccole, le commissioni motiveranno i miner. Il sistema si auto-sostiene.",
  "Spiegare questo alle persone comuni \u00e8 difficile. Non c'\u00e8 niente di familiare qui. Questo \u00e8 un nuovo paradigma del denaro.",
];

const LEARNING_BLOCKS_RU: LearningBlock[] = RU_LEARNING_BLOCKS as LearningBlock[];
const WALLET_STEPS_RU: WalletStep[] = RU_WALLET_STEPS as WalletStep[];
const SATOSHI_WISDOM_RU = RU_SATOSHI_WISDOM;

export const UI_TEXTS = {
  RU: RU_UI_TEXTS,
  EN: {
    skillNotification: "+SKILL",
    followQuestion: "How to follow project updates?",
    followResponse: "You can download the app—it can't be removed from app stores because it's built censorship-resistant.\n\nSecond option—subscribe to the founder on Nostr, a decentralized social network, and follow all news there. We'll study this network in upcoming blocks.",
    waitMessage: "complete the first block first, all questions later",
    moduleLabel: "MODULE",
    troubleshootingButton: "TROUBLESHOOTING",
    troubleshootingTitle: "RECEIVING ISSUES",
    troubleshootingSteps: ["Check internet connection", "Wait 30-60 seconds", "Restart Phoenix Wallet", "If money hasn't arrived in 5 minutes—contact us in chat"],
    followButton: "HOW TO FOLLOW PROJECT UPDATES?",
    downloadApp: "DOWNLOAD APP",
    installInstructionsIOS: "Tap the \"Share\" button (square with arrow at bottom of screen), then choose \"Add to Home Screen\"",
    installInstructionsAndroid: "Tap menu (three dots top right), then choose \"Install app\" or \"Add to home screen\"",
    installInstructionsFallback: "Add this site to home screen through browser menu",
    founderNostr: "FOUNDER ON NOSTR",
    inputPlaceholder: "Enter answer...",
  },
  IT: {
    skillNotification: "+SKILL",
    followQuestion: "Come seguire gli aggiornamenti del progetto?",
    followResponse: "Puoi scaricare l'app\u2014non pu\u00f2 essere rimossa dagli app store perché è costruita resistente alla censura.\n\nSeconda opzione—iscriviti al founder su Nostr, un social network decentralizzato, e segui tutte le notizie lì. Studieremo questa rete nei prossimi blocchi.",
    waitMessage: "completa prima il primo blocco, tutte le domande dopo",
    moduleLabel: "MODULO",
    troubleshootingButton: "TROUBLESHOOTING",
    troubleshootingTitle: "PROBLEMI DI RICEZIONE",
    troubleshootingSteps: ["Controlla connessione internet", "Aspetta 30-60 secondi", "Riavvia Phoenix Wallet", "Se i soldi non sono arrivati in 5 minuti—contattaci in chat"],
    followButton: "COME SEGUIRE GLI AGGIORNAMENTI DEL PROGETTO?",
    downloadApp: "SCARICA APP",
    installInstructionsIOS: "Tocca il pulsante \"Condividi\" (quadrato con freccia in basso), poi scegli \"Aggiungi a Home\"",
    installInstructionsAndroid: "Tocca menu (tre puntini in alto a destra), poi scegli \"Installa app\" o \"Aggiungi a schermata home\"",
    installInstructionsFallback: "Aggiungi questo sito alla schermata home attraverso il menu del browser",
    founderNostr: "FOUNDER SU NOSTR",
    inputPlaceholder: "Inserisci risposta...",
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
