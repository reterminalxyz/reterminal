import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { playClick, playTypeTick, playSatsChime, playTransition } from "@/lib/sounds";

interface BlockOption {
  text: string;
  action: string;
  conditional_text?: string;
  conditional_options?: BlockOption[];
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
  reward: number;
  progress_target: number;
  options: BlockOption[];
}

interface Message {
  id: number;
  text: string;
  sender: "satoshi" | "user" | "system";
}

interface TerminalChatProps {
  onBack: () => void;
  onProgressUpdate: (progress: number) => void;
  onSatsUpdate: (sats: number) => void;
  totalSats: number;
  skipFirstTypewriter?: boolean;
}

const LEARNING_BLOCKS: LearningBlock[] = [
  {
    id: 1,
    title: "Дисклеймер (Первый удар)",
    speech: "Слушай внимательно.\n\nТы попал сюда не случайно. Это альфа-тест проекта о цифровой свободе. Я дам тебе инструменты, которые изменят то, как ты думаешь о свободе в интернете.\n\n10-15 минут. Это всё, что тебе нужно для начала\nЭто проще, чем заказать пиццу в Glovo. Серьёзно.\nНикаких:\n- Регистраций\n- Подписок\n- Личных данных\n- Банковских карт\nТолько ты и этот чат.\n\nВот сделка: За каждый правильный ответ ты получаешь части настоящих биткоинов.\nШкала внизу показывает твой прогресс. Каждый процент — это деньги.\nВерить или нет — твой выбор.\nНо если ты здесь, значит чувствуешь, что что-то не так с системой.\nГотов сделать первый шаг?",
    skill: null,
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
        { text: "Мне", action: "continue" },
        { text: "Банку", action: "continue" }
      ]
    },
    speech_continued: "На самом деле нет, хотя банк говорит тебе, что это твои деньги.\n\nНесмотря на то, что их приложение и показывает баланс, эти деньги не твоя собственность. Это запись в ИХ базе данных, которую тебе РАЗРЕШАЮТ использовать.\nПопробуй вот что:\nОтправь крупную сумму другу в другую страну. Банк обязательно спросит: «Откуда деньги? Зачем? Кому?» Они могут заблокировать твой счет просто потому, что их алгоритму не понравилась твоя покупка.\nРешил купить что-то, что не нравится твоему правительству? Может быть, пожертвование протестующим, запрещенную книгу или VPN? Счет заморожен. Без суда.\nДеньги в банке — это не деньги. Это обещание банка.\nИ это обещание работает, пока ты делаешь то, что от тебя ожидают.\nОни контролируют доступ к твоему времени, твоему труду, твоей жизни.\nТы работаешь всю неделю и обмениваешь это время на цифры в приложении. А цифры принадлежат не тебе.\nБанк — хозяин твоего времени.\n«Баланс в приложении» — это не владение, разрешение.",
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
    speech: "Хорошо. Ты готов увидеть выход.\n\nЭто Bitcoin!\n\nЗабудь всё, что ты слышал о нём: \"криптовалюта\", \"инвестиция\", \"спекуляция\".\nНа самом деле Bitcoin это математика, которую невозможно подделать.\nПредставь золото. Его нельзя напечатать. Его количество ограничено. Его ценность признают люди во всем мире.\n\nТеперь представь, что золото:\n- Помещается в зашифрованном файле в твоем телефоне\n- Его можно отправить за секунды в любую страну\n- Никто не может его конфисковать\n- Никакой банк его не контролирует\n\n21 миллион монет. Больше никогда не будет. Никакой центральный банк не может напечатать еще.\nЭто не обещание. Это неизменяемый математический закон, записанный в коде навсегда.\nБанк может обанкротиться. Правительство может обесценить деньги.\nBitcoin? Работает 17 лет без остановки. 24/7. Без выходных. Без банкротств.\nЭто первый в истории способ хранить результат твоего труда там, где его не достанет ни одно правительство.",
    skill: "Bitcoin = математика + редкость + свобода",
    reward: 100,
    progress_target: 23,
    options: [
      { text: "Понял, но как это устроено", action: "next_block" },
      { text: "Какие еще преимущества?", action: "next_block" }
    ]
  },
  {
    id: 4,
    title: "Ключи (Кто владеет, тот и хозяин)",
    speech: "Отличный вопрос. Вот где начинается настоящая свобода.\n\nВ обычном мире банк даёт тебе приложение, карту, PIN-код. Но настоящие ключи у них. Они решают, когда ты можешь войти в аккаунт. В их силах закрыть его в любой момент.\n\nВ мире Bitcoin ключи только у тебя.\nЕсть 12 или 24 слова (их называют seed-фраза). Это твой личный ключ.\nКто владеет этими словами — владеет аккаунтом и биткоинами на нём. Точка.\nНе банк. Не правительство. Не приложение.\nТолько тот, кто знает seed-фразу.\n\nПотерял слова? Никто не поможет. Нет «восстановления пароля». Нет техподдержки.\nЭто цена свободы. Это ответственность.\nС ответственностью приходит свобода, ведь никто даже теоритически не сможет:\n- Заморозить твой счет\n- Забрать твои деньги\n- Ограничить твои траты\n- Потребовать объяснений\nТы даже можешь запомнить эти слова наизусть и перевезти любую сумму через любую границу, имея только слова в голове.\n\nЕсли у тебя есть ключи — ты владеешь своими деньгами.\nЕсли нет — ты просто гость в чужом доме.",
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
    speech: "Теперь ты готов к следующему уровню.\n\nСистема хочет знать всё.\nЧто ты ел на завтрак. Куда ходил вчера. Сколько потратил на кофе. С кем встречался.\nБанки передают данные правительству. Google знает, где ты был. Твоя кредитная карта — дневник твоей жизни.\n\nВ Италии каждая транзакция больше €2000 автоматически отслеживается. Покупаешь подержанную машину у друга? Отчитайся перед государством.\n\nА если ты не хочешь? Bitcoin дает тебе выбор.\nТвой адрес — это просто набор букв и цифр. Никакого имени. Никакого паспорта.\nМожно создать новый адрес для каждой транзакции. За секунды. Бесплатно.\n\nХочешь отправить деньги другу? Никаких вопросов «Зачем?». Никаких комиссий банка. Никаких записей в твоем профиле.\n\nТвои траты — твое личное дело.\nДаже базовый уровень Bitcoin дает тебе больше свободы, чем любой банк в мире.",
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
      { text: "Звучит сложно, нужно уметь программировать", action: "next_block", conditional_text: "Нет. Мы сделали это проще Glovo. Идем дальше." }
    ]
  },
  {
    id: 7,
    title: "Карта-щит (Твой пропуск в сопротивление)",
    speech: "Ты почти прошел 1 модуль и через пару минут сможешь забрать свою награду! Пора рассказать, куда ты попал.\n\nТы в клубе цифрового сопротивления авторитаризму.\n\nВсего будет 7 модулей.\nВ ближайшее время появятся:\n\n→ 2: Приватность и обход слежки\n→ 3: Защищенная коммуникация\n→ 4: Обход цензуры\n→ 5: Свободный доступ к знаниям\n→ 6: Техно-философия\n→ 7: Инструменты выживания оффлайн\n\nКаждый модуль — это навык. Каждый навык — это часть щита независимости.\n\nК концу ты будешь уметь:\nХранить деньги так, что никто их не заберет\n- Общаться так, что никто не прочитает\n- Получать информацию, которую пытаются скрыть\nВыживать в мире, где система пытается тебя контролировать\n\nА самое главное получишь десятки практических навыков для защиты своей свободы так, как нужно именно тебе. Никакой политической программы, только право человека на свободу!\n\nТа прозрачная карта — это пропуск в глобальную сеть людей, которые хотят жить в более честном мире. Передай карту тому, кто поймёт.\n\nМы строим параллельный интернет. И ты только что стал частью этого.",
    skill: "Понимание экосистемы свободы",
    reward: 100,
    progress_target: 27,
    options: [
      { text: "Хорошо, готов забрать SATS", action: "next_block" }
    ]
  },
  {
    id: 8,
    title: "Финальный выбор (Момент истины)",
    speech: "1000 SATS это примерно 7 евро. Это твои первые деньги, которые не принадлежат банку.\n\nЭти деньги реальны. Ты можешь их потратить уже сегодня.\n\nНо есть одна проблема… У тебя еще нет кошелька.\n\nПрямо сейчас эти SATS существуют только тут.\n\nТвой финальный шаг:\n\nСоздать личный Bitcoin-кошелек. Это займёт 2 минуты.\nИ все SATS, которые ты заработал, придут на твой адрес. Автоматически.\nЭто момент, когда теория становится реальностью.",
    skill: "Момент принятия финального решения",
    reward: 100,
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
  {
    id: 9,
    title: "Финальная нота",
    speech: "Хороший выбор.\n\nДобро пожаловать в параллельную экономику.\n\nСейчас мы создадим твой кошелек. Следуй инструкциям внимательно.",
    skill: null,
    reward: 0,
    progress_target: 27,
    options: [
      { text: "Начать создание кошелька", action: "initialize_wallet" }
    ]
  }
];

const PixelSendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
    <rect x="7" y="2" width="2" height="2" />
    <rect x="5" y="4" width="2" height="2" />
    <rect x="9" y="4" width="2" height="2" />
    <rect x="3" y="6" width="2" height="2" />
    <rect x="11" y="6" width="2" height="2" />
    <rect x="7" y="4" width="2" height="2" />
    <rect x="7" y="6" width="2" height="2" />
    <rect x="7" y="8" width="2" height="2" />
    <rect x="7" y="10" width="2" height="2" />
    <rect x="7" y="12" width="2" height="2" />
  </svg>
);

const PixelCoin = ({ animating }: { animating: boolean }) => (
  <div className="relative">
    <motion.div
      className="absolute inset-[-6px] rounded-full"
      style={{ background: "radial-gradient(circle, rgba(184,115,51,0.5) 0%, transparent 70%)" }}
      animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.15, 0.9] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.svg
      width="22" height="22" viewBox="0 0 16 16"
      style={{ imageRendering: 'pixelated', position: 'relative', zIndex: 1 }}
      animate={animating
        ? { rotate: [0, 360], scale: [1, 1.6, 1], filter: ["brightness(1)", "brightness(2.5)", "brightness(1)"] }
        : { filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"], scale: [1, 1.05, 1] }
      }
      transition={animating
        ? { duration: 0.6 }
        : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <rect x="5" y="1" width="6" height="2" fill="#B87333" />
      <rect x="3" y="3" width="2" height="2" fill="#B87333" />
      <rect x="11" y="3" width="2" height="2" fill="#B87333" />
      <rect x="1" y="5" width="2" height="6" fill="#B87333" />
      <rect x="13" y="5" width="2" height="6" fill="#B87333" />
      <rect x="3" y="11" width="2" height="2" fill="#B87333" />
      <rect x="11" y="11" width="2" height="2" fill="#B87333" />
      <rect x="5" y="13" width="6" height="2" fill="#B87333" />
      <rect x="3" y="5" width="10" height="6" fill="#D4943D" />
      <rect x="5" y="3" width="6" height="2" fill="#D4943D" />
      <rect x="5" y="11" width="6" height="2" fill="#D4943D" />
      <rect x="7" y="4" width="2" height="2" fill="#B87333" />
      <rect x="6" y="6" width="4" height="2" fill="#B87333" />
      <rect x="7" y="8" width="2" height="2" fill="#B87333" />
      <rect x="7" y="10" width="2" height="1" fill="#B87333" />
    </motion.svg>
  </div>
);

type BlockPhase = 
  | "typing_speech"
  | "waiting_intermediate"
  | "typing_speech_continued"
  | "waiting_options"
  | "typing_conditional"
  | "waiting_conditional_options"
  | "completed";

export function TerminalChat({ onBack, onProgressUpdate, onSatsUpdate, totalSats, skipFirstTypewriter }: TerminalChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [blockPhase, setBlockPhase] = useState<BlockPhase>("typing_speech");
  const [currentOptions, setCurrentOptions] = useState<BlockOption[]>([]);
  const [notification, setNotification] = useState<{ sats: number; skill: string | null } | null>(null);
  const [inputText, setInputText] = useState("");

  const isLockedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const skippedFirstRef = useRef(false);
  const typeTickCounterRef = useRef(0);
  const userScrolledRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = useCallback(() => {
    if (!userScrolledRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  const handleUserScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom < 40) {
      userScrolledRef.current = false;
    } else {
      userScrolledRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        userScrolledRef.current = false;
        scrollToBottom();
      }, 8000);
    }
  }, [scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const typeMessage = useCallback((text: string, sender: "satoshi" | "system", onComplete?: () => void) => {
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    
    setIsTyping(true);
    setDisplayedText("");
    typeTickCounterRef.current = 0;
    let charIndex = 0;

    typeIntervalRef.current = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        typeTickCounterRef.current++;
        if (typeTickCounterRef.current % 3 === 0) {
          playTypeTick();
        }
        charIndex++;
      } else {
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
        setIsTyping(false);
        setDisplayedText("");
        setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
        onComplete?.();
      }
    }, 20);
  }, []);

  const startBlock = useCallback((blockIndex: number, skipTyping?: boolean) => {
    const block = LEARNING_BLOCKS[blockIndex];
    if (!block) return;

    userScrolledRef.current = false;
    setCurrentBlockIndex(blockIndex);
    setBlockPhase("typing_speech");
    setCurrentOptions([]);
    isLockedRef.current = true;

    if (skipTyping) {
      setMessages(prev => [...prev, { id: Date.now(), text: block.speech, sender: "satoshi" }]);
      isLockedRef.current = false;
      if (block.intermediate_question) {
        setBlockPhase("waiting_intermediate");
        setCurrentOptions(block.intermediate_question.options);
      } else {
        setBlockPhase("waiting_options");
        setCurrentOptions(block.options);
      }
      return;
    }

    playTransition();
    typeMessage(block.speech, "satoshi", () => {
      isLockedRef.current = false;
      if (block.intermediate_question) {
        setBlockPhase("waiting_intermediate");
        setCurrentOptions(block.intermediate_question.options);
      } else {
        setBlockPhase("waiting_options");
        setCurrentOptions(block.options);
      }
    });
  }, [typeMessage]);

  useEffect(() => {
    const shouldSkip = skipFirstTypewriter && !skippedFirstRef.current;
    skippedFirstRef.current = true;
    startBlock(0, shouldSkip);
  }, [startBlock, skipFirstTypewriter]);

  const internalSatsRef = useRef(totalSats);

  const showNotification = useCallback((sats: number) => {
    setNotification({ sats, skill: null });
    setTimeout(() => setNotification(null), 1800);
  }, []);

  const completeBlock = useCallback((blockIndex: number) => {
    const block = LEARNING_BLOCKS[blockIndex];
    if (!block) return;

    if (block.reward > 0) {
      internalSatsRef.current = Math.min(internalSatsRef.current + block.reward, 1000);
      onSatsUpdate(internalSatsRef.current);
      showNotification(block.reward);
      playSatsChime();
    }
    onProgressUpdate(Math.min(block.progress_target, 27));
  }, [onSatsUpdate, onProgressUpdate, showNotification]);

  const handleInputSend = useCallback(() => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    setInputText("");
    setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: "user" }]);
    playClick();
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "сначала пройди первый блок, все вопросы потом", sender: "satoshi" }]);
    }, 500);
  }, [inputText]);

  const handleOptionClick = useCallback((option: BlockOption) => {
    if (isLockedRef.current || isTyping) return;
    isLockedRef.current = true;
    playClick();

    setMessages(prev => [...prev, { id: Date.now(), text: option.text, sender: "user" }]);
    setCurrentOptions([]);

    const currentBlock = LEARNING_BLOCKS[currentBlockIndex];

    if (option.action === "continue" && currentBlock.speech_continued) {
      setBlockPhase("typing_speech_continued");
      const continuedText = currentBlock.speech_continued!;
      setTimeout(() => {
        typeMessage(continuedText, "satoshi", () => {
          isLockedRef.current = false;
          setBlockPhase("waiting_options");
          setCurrentOptions(currentBlock.options);
        });
      }, 400);
      return;
    }

    if (option.action === "next_block") {
      if (option.conditional_text) {
        setBlockPhase("typing_conditional");
        setTimeout(() => {
          typeMessage(option.conditional_text!, "satoshi", () => {
            isLockedRef.current = false;
            completeBlock(currentBlockIndex);
            setTimeout(() => {
              const nextIndex = currentBlockIndex + 1;
              if (nextIndex < LEARNING_BLOCKS.length) {
                startBlock(nextIndex);
              }
            }, 800);
          });
        }, 400);
      } else {
        completeBlock(currentBlockIndex);
        setTimeout(() => {
          isLockedRef.current = false;
          const nextIndex = currentBlockIndex + 1;
          if (nextIndex < LEARNING_BLOCKS.length) {
            startBlock(nextIndex);
          }
        }, 800);
      }
      return;
    }

    if (option.action === "go_back") {
      if (option.conditional_text) {
        setBlockPhase("typing_conditional");
        setTimeout(() => {
          typeMessage(option.conditional_text!, "satoshi", () => {
            isLockedRef.current = false;
            setTimeout(() => {
              onBack();
            }, 2000);
          });
        }, 400);
      } else {
        setTimeout(() => {
          isLockedRef.current = false;
          onBack();
        }, 500);
      }
      return;
    }

    if (option.action === "restart") {
      if (option.conditional_text) {
        setBlockPhase("typing_conditional");
        setTimeout(() => {
          typeMessage(option.conditional_text!, "satoshi", () => {
            isLockedRef.current = false;
            setTimeout(() => {
              setMessages([]);
              startBlock(0);
            }, 2000);
          });
        }, 400);
      } else {
        setTimeout(() => {
          isLockedRef.current = false;
          setMessages([]);
          startBlock(0);
        }, 500);
      }
      return;
    }

    if (option.action === "show_conditional_text" && option.conditional_text) {
      setBlockPhase("typing_conditional");
      setTimeout(() => {
        typeMessage(option.conditional_text!, "satoshi", () => {
          isLockedRef.current = false;
          if (option.conditional_options && option.conditional_options.length > 0) {
            setBlockPhase("waiting_conditional_options");
            setCurrentOptions(option.conditional_options);
          } else {
            setBlockPhase("waiting_options");
            setCurrentOptions(currentBlock.options);
          }
        });
      }, 400);
      return;
    }

    if (option.action === "create_wallet") {
      completeBlock(currentBlockIndex);
      setTimeout(() => {
        isLockedRef.current = false;
        const nextIndex = currentBlockIndex + 1;
        if (nextIndex < LEARNING_BLOCKS.length) {
          startBlock(nextIndex);
        }
      }, 800);
      return;
    }

    if (option.action === "initialize_wallet") {
      completeBlock(currentBlockIndex);
      setTimeout(() => {
        isLockedRef.current = false;
        setBlockPhase("completed");
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "ПРОТОКОЛ ЗАВЕРШЁН. ТЫ АКТИВИРОВАН.",
          sender: "system"
        }]);
      }, 500);
      return;
    }

    isLockedRef.current = false;
  }, [isTyping, currentBlockIndex, typeMessage, startBlock, completeBlock, onBack]);

  const [satsAnimating, setSatsAnimating] = useState(false);
  const prevSatsRef = useRef(totalSats);

  useEffect(() => {
    if (totalSats > prevSatsRef.current) {
      setSatsAnimating(true);
      setTimeout(() => setSatsAnimating(false), 600);
    }
    prevSatsRef.current = totalSats;
  }, [totalSats]);

  const currentBlock = LEARNING_BLOCKS[currentBlockIndex];

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-[#E8E8E8] font-mono">
      <AnimatePresence>
        {notification && notification.sats > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.7 }}
            animate={{ opacity: [0, 1, 1, 1, 0], y: [0, 60, 60, 60, 0], scale: [0.7, 1.15, 1, 1.15, 0.7] }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.6, times: [0, 0.15, 0.45, 0.75, 1], ease: "easeInOut" }}
            className="fixed top-12 left-0 right-0 z-[100] pointer-events-none flex justify-center"
          >
            <motion.div
              className="px-5 py-2 text-[15px] tracking-[4px] font-mono font-bold border-2 border-[#B87333]"
              style={{
                imageRendering: 'pixelated',
                background: '#0A0A0A',
                color: '#FFD700',
                textShadow: '0 0 8px #FFD700, 0 0 16px #B87333',
                boxShadow: '0 0 20px rgba(184,115,51,0.5), 0 0 40px rgba(255,215,0,0.2)',
              }}
              animate={{
                boxShadow: [
                  "0 0 10px rgba(184,115,51,0.3), 0 0 20px rgba(255,215,0,0.1)",
                  "0 0 30px rgba(184,115,51,0.7), 0 0 50px rgba(255,215,0,0.4)",
                  "0 0 10px rgba(184,115,51,0.3), 0 0 20px rgba(255,215,0,0.1)"
                ]
              }}
              transition={{ duration: 0.6, repeat: 2 }}
              data-testid="toast-sats"
            >
              +{notification.sats} SATS
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-shrink-0 bg-[#111111] border-b-2 border-[#B87333]/60 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#B87333]" />
            <span className="text-[11px] tracking-[4px] font-bold text-[#B87333] uppercase">
              TERMINAL://
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 border-2 border-[#B87333]/60 bg-[#B87333]/10">
              <PixelCoin animating={satsAnimating} />
              <motion.span
                key={totalSats}
                initial={{ scale: 1.4, color: "#FFD700" }}
                animate={{ scale: 1, color: "#B87333" }}
                transition={{ duration: 0.4 }}
                className="text-[14px] tracking-[2px] font-bold"
                data-testid="text-sats-count"
              >
                {totalSats}
              </motion.span>
              <span className="text-[10px] tracking-[2px] text-[#B87333]/60 font-bold">SATS</span>
            </div>
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 flex items-center justify-center border-2 border-[#B87333]/50 bg-[#B87333]/10 text-[#B87333] hover:bg-[#B87333]/20 transition-colors"
              data-testid="button-close-terminal"
            >
              <X size={16} strokeWidth={3} />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-4 py-1.5 border-b border-[#B87333]/30 bg-[#0D0D0D]">
        <div className="flex items-center justify-center max-w-[400px] mx-auto">
          <span className="text-[9px] tracking-[2px] text-[#B87333]/40 font-bold" data-testid="text-block-indicator">
            1/8 ФИНАНСОВАЯ СВОБОДА
          </span>
        </div>
      </div>

      <div 
        ref={messagesContainerRef}
        onScroll={handleUserScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2 terminal-scrollbar"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(0,0,0,0.15) 3px,
              rgba(0,0,0,0.15) 6px
            ),
            linear-gradient(180deg, #0A0A0A 0%, #0F0F0F 100%)
          `,
          overscrollBehavior: "contain",
        }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] px-3 py-2 text-[13px] leading-snug whitespace-pre-line ${
                  message.sender === "user"
                    ? "bg-[#4ADE80]/10 text-[#4ADE80] border-l-4 border-[#4ADE80]"
                    : message.sender === "system"
                    ? "bg-[#B87333]/20 text-[#B87333] border-l-4 border-[#B87333] text-center w-full"
                    : "bg-[#B87333]/10 text-[#B87333] border-l-4 border-[#B87333]"
                }`}
              >
                <span className="text-[10px] opacity-60 block mb-0.5 tracking-wider">
                  {message.sender === "user" ? "[ USER ]" : message.sender === "system" ? "[ SYSTEM ]" : "[ SATOSHI ]"}
                </span>
                {message.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && displayedText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="max-w-[90%] px-3 py-2 text-[13px] leading-snug bg-[#B87333]/10 text-[#B87333] border-l-4 border-[#B87333] whitespace-pre-line">
              <span className="text-[10px] opacity-60 block mb-0.5 tracking-wider">[ SATOSHI ]</span>
              {displayedText}
              <span className="inline-block w-3 h-4 ml-1 bg-[#B87333] animate-pulse" />
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {currentOptions.length > 0 && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2 pt-1"
            >
              {currentOptions.map((option, idx) => (
                <motion.button
                  key={`${currentBlock?.id}-${blockPhase}-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  onClick={() => handleOptionClick(option)}
                  disabled={isLockedRef.current}
                  className="w-full px-4 py-3 text-left text-[13px] font-mono font-bold tracking-wide
                           border-2 border-[#B87333]/50 bg-[#B87333]/5 text-[#B87333]
                           hover:bg-[#B87333]/15 hover:border-[#B87333] 
                           active:scale-[0.98] transition-all duration-200
                           disabled:opacity-30 disabled:cursor-not-allowed"
                  data-testid={`button-option-${idx}`}
                >
                  <span className="text-[#B87333]/40 mr-2">&gt;</span>
                  {option.text}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 border-t border-[#B87333]/30 bg-[#111111]">
        <div className="flex items-center gap-2 px-3 py-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleInputSend(); }}
            placeholder="Напиши сообщение..."
            className="flex-1 bg-[#1A1A1A] text-[#B87333] text-[12px] font-mono px-3 py-2 border border-[#B87333]/20 outline-none focus:border-[#B87333]/50 placeholder-[#B87333]/30"
            data-testid="input-message"
          />
          <motion.button
            onClick={handleInputSend}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 flex items-center justify-center border border-[#B87333]/40 bg-[#1A1A1A] text-[#B87333] hover:bg-[#B87333]/20 transition-colors"
            data-testid="button-send"
          >
            <PixelSendIcon />
          </motion.button>
        </div>
      </div>

    </div>
  );
}
