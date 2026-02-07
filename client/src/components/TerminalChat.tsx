import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
}

const LEARNING_BLOCKS: LearningBlock[] = [
  {
    id: 1,
    title: "Дисклеймер (Первый удар)",
    speech: "Слушай внимательно.\n\nТы попал сюда не случайно. Это альфа-тест проекта о цифровой свободе. Я дам тебе инструменты, которые изменят то, как ты думаешь о свободе в интернете.\n\n10-15 минут. Это всё, что тебе нужно.\n\nНикаких навыков. Это проще, чем заказать пиццу в Glovo. Серьезно.\n\nНикаких:\n- Регистраций\n- Подписок\n- Личных данных\n- Банковских карт\n\nТолько ты и этот чат.\n\nВот сделка: За каждый правильный ответ ты получаешь части настоящих биткоинов. Не баллы. Не \"виртуальную валюту\". Настоящие деньги.\n\nШкала внизу показывает твой прогресс. Каждый процент — это деньги.\n\nВерить или нет — твой выбор.\n\nНо если ты здесь, значит чувствуешь, что что-то не так с системой. Что банки, правительства, приложения — все хотят контролировать твою жизнь.\n\nГотов сделать первый шаг из системы?",
    skill: null,
    reward: 100,
    progress_target: 21,
    options: [
      { text: "Да, покажи мне выход", action: "next_block" },
      { text: "Нет, это звучит слишком хорошо", action: "restart", conditional_text: "Понимаю. Система удобна. Если передумаешь — я буду здесь." }
    ]
  },
  {
    id: 2,
    title: "Банковское рабство (Правда о твоих деньгах)",
    speech: "Хороший выбор.\n\nДавай начнем с простого вопроса: кому принадлежат деньги на твоем счету?\n\nПодумай секунду.",
    intermediate_question: {
      text: "Кому принадлежат деньги на твоем счету?",
      options: [
        { text: "Мне", action: "continue" },
        { text: "Банку", action: "continue" }
      ]
    },
    speech_continued: "Ты думаешь — тебе.\nБанк говорит — тебе.\nПриложение показывает твой баланс.\n\nНо вот правда: деньги в банке — это не твоя собственность. Это запись в их базе данных, которую тебе разрешают использовать.\n\nПопробуй вот что:\n\nОтправь крупную сумму другу в другую страну в субботу вечером. Банк спросит: \"Откуда деньги? Зачем? Кому?\" Они могут заблокировать твой счет просто потому, что их алгоритму не понравилась твоя покупка.\n\nРешил купить что-то, что не нравится твоему правительству? Может быть, пожертвование протестующим, запрещенную книгу или VPN? Счет заморожен. Без суда.\n\nДеньги в банке — это не деньги. Это обещание банка.\n\nИ это обещание работает, пока ты делаешь то, что от тебя ожидают.\n\nОни контролируют доступ к твоему времени, твоему труду, твоей жизни.\n\nТы работаешь всю неделю. Обмениваешь свое время на цифры в приложении. А эти цифры принадлежат не тебе.\n\nБанк — хозяин твоего времени.\n\n\"Баланс в приложении\" — это не владение. Это разрешение.",
    skill: "Понимание, что баланс в приложении — это не владение, а разрешение",
    reward: 100,
    progress_target: 22,
    options: [
      { text: "Да, я вижу проблему. Покажи альтернативу", action: "next_block" },
      {
        text: "Но так всегда было, это нормально",
        action: "show_conditional_text",
        conditional_text: "\"Нормально\" — это когда банк берет комиссию за хранение ТВОИХ денег.\n\n\"Нормально\" — это когда ты не можешь купить билет в другую страну без одобрения банка.\n\nРабство тоже когда-то было \"нормально\".\n\nГотов увидеть выход или вернешься к \"нормальности\"?",
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
    speech: "Хорошо. Ты готов увидеть выход.\n\nBitcoin.\n\nЗабудь всё, что ты слышал. Забудь \"криптовалюта\", \"инвестиция\", \"спекуляция\".\n\nВот что такое Bitcoin на самом деле:\n\nЭто математика, которую невозможно подделать.\n\nПредставь золото. Его нельзя напечатать. Его количество ограничено. Его ценность признают люди во всем мире.\n\nТеперь представь, что это золото:\n- Помещается в твоем телефоне\n- Его можно отправить за секунды в любую страну\n- Никто не может его конфисковать\n- Никакой банк не контролирует его\n\nЭто и есть Bitcoin.\n\n21 миллион монет. Больше никогда не будет. Никакой президент, никакой центральный банк не может напечатать еще.\n\nЭто не обещание. Это математический закон.\n\nБанк может обанкротиться. Правительство может обесценить деньги.\n\nBitcoin? Работает 16 лет без остановки. 24/7. Без выходных. Без банкротств.\n\nЭто первый в истории способ хранить результат твоего труда там, где его не достанет ни одно правительство.\n\nЦифровое золото, которое всегда с тобой.",
    skill: "Bitcoin = математика + редкость + свобода",
    reward: 100,
    progress_target: 23,
    options: [
      { text: "Понял. Но как это работает технически?", action: "next_block" },
      { text: "Звучит хорошо, но кто контролирует мои биткоины?", action: "next_block" }
    ]
  },
  {
    id: 4,
    title: "Ключи (Кто владеет, тот и хозяин)",
    speech: "Отличный вопрос. Вот где начинается настоящая свобода.\n\nВ обычном мире:\nТвой дом. Твой банковский счет. Твои \"деньги\".\nНо кто держит ключи?\n\nБанк.\n\nОни дают тебе приложение, карту, PIN-код. Но настоящие ключи у них. Они решают, когда ты можешь войти. Они могут закрыть дверь в любой момент.\n\nВ мире Bitcoin:\nКлючи только у тебя.\n\nЕсть 12 или 24 слова (их называют seed-фраза). Это твой мастер-ключ.\n\nКто владеет этими словами — владеет биткоинами. Точка.\n\nНе банк. Не правительство. Не приложение.\nТы.\n\nПотерял слова? Никто не поможет. Нет \"восстановления пароля\". Нет техподдержки.\n\nЭто цена свободы. Это ответственность.\n\nНо вот награда:\n\nТы можешь запомнить эти слова наизусть и перевезти любую сумму через любую границу, имея только слова в голове. Звучит фантастически?\n\nРеальность такова:\n\nНикто не может:\n- Заморозить твой счет\n- Забрать твои деньги\n- Ограничить твои траты\n- Потребовать объяснений\n\nЕсли у тебя есть ключи — ты владеешь миром.\nЕсли нет — ты просто гость в чужом доме.\n\nБольшинство людей хранят биткоины на биржах (Coinbase, Binance), но на самом деле это как держать золото в банковской ячейке.\n\nМы научим тебя держать ключи в собственном кармане.",
    skill: "Понятие личного владения без посредников",
    reward: 100,
    progress_target: 25,
    options: [
      { text: "Ясно. А как защитить свою приватность?", action: "next_block" },
      { text: "Я могу хранить ключи и оставаться анонимным?", action: "next_block" }
    ]
  },
  {
    id: 5,
    title: "Приватность (Быть невидимкой)",
    speech: "Теперь ты готов к следующему уровню.\n\nСистема хочет знать всё.\n\nЧто ты ел на завтрак. Куда ходил вчера. Сколько потратил на кофе. С кем встречался.\n\nБанки передают данные правительству. Google знает, где ты был. Твоя кредитная карта — это дневник твоей жизни.\n\nВ Италии каждая транзакция больше €2000 автоматически отслеживается. Покупаешь подержанную машину у друга? Отчитайся перед государством.\n\nА если ты не хочешь?\n\nBitcoin дает тебе выбор.\n\nТвой адрес — это просто набор букв и цифр. Никакого имени. Никакого паспорта.\n\nМожно создать новый адрес для каждой транзакции. За секунды. Бесплатно.\n\nХочешь отправить деньги другу? Никаких вопросов \"Зачем?\". Никаких комиссий банка. Никаких записей в твоем профиле.\n\nТвои траты — это твое личное дело.\n\nВажно: Bitcoin открыт всем. Транзакции публичны (но без твоего имени). Существуют инструменты для полной приватности — мы научим тебя в следующих модулях.\n\nНо даже базовый уровень Bitcoin дает тебе больше свободы, чем любой банк в мире.\n\nТы можешь быть тенью.",
    skill: "Базовая цифровая гигиена и право на приватность",
    reward: 100,
    progress_target: 26,
    options: [
      { text: "Отлично. А как быстро работают транзакции?", action: "next_block" },
      { text: "Можно ли это использовать для повседневных покупок?", action: "next_block" }
    ]
  },
  {
    id: 6,
    title: "Lightning (Мгновенная энергия)",
    speech: "Вот где Bitcoin становится оружием будущего.\n\nПомнишь, в начале я говорил про награду? Ты получаешь сатоши (сокращенно — sats).\n\nСатоши — это самая маленькая часть биткоина. Как цент для евро. Названы в честь меня — создателя Bitcoin, Сатоши Накамото.\n\nИ вот что важно: их можно отправлять друг другу за доли секунды.\n\nХочешь отправить деньги в Японию? 0.5 секунды.\nКомиссия? Меньше одного цента евро. Иногда доли цента.\n\nЭто называется Lightning Network.\n\nБезграничная сеть. Твой телефон подключается к миллионам узлов по всему миру.\n\nНикакого банка посередине. Никакой SWIFT. Никаких \"рабочих часов\".\n\nВоскресенье, 3 часа ночи? Lightning работает.\nПраздник в Италии? Lightning работает.\nТвой банк заблокировал карту за границей? Lightning. Работает.\n\nЭто не будущее. Это уже здесь.\n\nЛюди в Сальвадоре покупают продукты через Lightning.\nВ Швейцарии платят за парковку.\nВ Нигерии обходят контроль капитала.\n\nДеньги должны двигаться со скоростью мысли. Теперь они так и делают.",
    skill: "Мгновенные платежи без границ",
    reward: 100,
    progress_target: 27,
    options: [
      { text: "Впечатляет. Что еще я могу с этим сделать?", action: "next_block" },
      { text: "Это звучит сложно. Мне нужно учиться кодить?", action: "next_block", conditional_text: "Нет. Мы сделали это проще Glovo. Идем дальше." }
    ]
  },
  {
    id: 7,
    title: "Карта-щит (Твой пропуск в сопротивление)",
    speech: "Ты прошел почти весь путь. Пора рассказать, что такое re_chain.\n\nЭто не просто проект. Это твой клуб выхода из системы.\n\nТы только что прошел первый модуль из восьми.\n\nВот что тебя ждет дальше:\n\n→ Модуль 2: Приватность и обход слежки\n→ Модуль 3: Защищенная коммуникация\n→ Модуль 4: Обход цензуры\n→ Модуль 5: Свободный доступ к знаниям\n→ Модуль 6: Техно-философия\n→ Модуль 7: Инструменты выживания оффлайн\n→ Модуль 8: Мастер сопротивления\n\nКаждый модуль — это навык. Каждый навык — это часть щита.\n\nК концу ты будешь уметь:\n- Хранить деньги так, что никто их не заберет\n- Общаться так, что никто не прочитает\n- Получать информацию, которую пытаются скрыть\n- Выживать в мире, где система пытается тебя контролировать\n\nЭто не теория. Это десятки практических инструментов.\n\nТвоя карта re_chain — это пропуск в глобальную сеть людей, которые выбрали свободу.\n\nНас 2.3 миллиона человек в 167 странах.\n\nВчера кто-то в Буэнос-Айресе перевел $500 родителям, обойдя банковские ограничения.\nСегодня студент в Гонконге купил VPN, не оставив следов.\nЗавтра — ты.\n\nПрограммисты в Берлине. Активисты в Гонконге. Фермеры в Кении. Студенты в Италии.\n\nМы строим параллельную экономику. Параллельный интернет. Параллельный мир.\n\nИ ты только что стал частью этого.\n\nПередай эту карту тому, кто поймёт.",
    skill: "Понимание экосистемы свободы",
    reward: 100,
    progress_target: 28,
    options: [
      { text: "Я готов учиться дальше", action: "next_block" },
      { text: "Расскажи больше о сообществе", action: "next_block", conditional_text: "Сообщество — это мы. И теперь — ты. Идем к финалу." }
    ]
  },
  {
    id: 8,
    title: "Финальный выбор (Момент истины)",
    speech: "Ты прошел путь.\n\nПосмотри на шкалу внизу. Она полная.\n\nЗа каждый твой ответ ты заработал сатоши.\n\nНемного? Может быть.\nНо это твои первые деньги, которые не принадлежат банку.\n\nЭти деньги реальны. Ты можешь их потратить завтра. В любой точке мира.\n\nНо есть одна проблема.\n\nУ тебя еще нет кошелька.\n\nПрямо сейчас эти сатоши существуют в системе, но они ни у кого. Они ждут тебя.\n\nВот твой финальный выбор:\n\nТы можешь уйти прямо сейчас.\nУрок усвоен. Знания получены. Никаких обязательств.\n\nИли ты можешь сделать последний шаг.\n\nСоздать свой личный Bitcoin-кошелек. Прямо здесь. За 2 минуты.\n\nИ все сатоши, которые ты заработал, придут на твой адрес. Автоматически.\n\nЭто момент, когда теория становится реальностью.\n\nБольшинство людей останавливаются здесь. Они читают, кивают головой, закрывают вкладку.\n\nПотому что создать кошелек — это значит взять ответственность.\n\nЭто значит сказать: \"Я больше не жду, когда банк откроется в понедельник.\"\n\nТолько взяв ключи в свои руки, ты становишься хозяином своих денег.\n\nТвои сатоши ждут.",
    skill: "Момент принятия финального решения",
    reward: 100,
    progress_target: 29,
    options: [
      { text: "Да. Создать кошелек и забрать сатоши", action: "create_wallet" },
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
    speech: "Хороший выбор.\n\nДобро пожаловать в параллельную экономику.\n\nСейчас мы создадим твой кошелек. Следуй инструкциям внимательно.\n\nПомни: эти 12 слов — это твой банковский сейф, который никто не может взломать.\n\nНе потеряй их. Не фотографируй. Запиши на бумаге. Спрячь в надежном месте.\n\nНикто не сможет помочь тебе восстановить доступ. Ни я, ни техподдержка, ни правительство.\n\nЭто цена свободы. Ты готов?",
    skill: null,
    reward: 0,
    progress_target: 29,
    options: [
      { text: "Начать создание кошелька", action: "initialize_wallet" }
    ]
  }
];

const PixelSendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
    <rect x="2" y="7" width="2" height="2" />
    <rect x="4" y="7" width="2" height="2" />
    <rect x="6" y="7" width="2" height="2" />
    <rect x="8" y="7" width="2" height="2" />
    <rect x="10" y="5" width="2" height="2" />
    <rect x="10" y="9" width="2" height="2" />
    <rect x="12" y="7" width="2" height="2" />
    <rect x="8" y="5" width="2" height="2" />
    <rect x="8" y="9" width="2" height="2" />
    <rect x="6" y="3" width="2" height="2" />
    <rect x="6" y="11" width="2" height="2" />
  </svg>
);

type BlockPhase = 
  | "typing_speech"
  | "waiting_intermediate"
  | "typing_speech_continued"
  | "waiting_options"
  | "typing_conditional"
  | "waiting_conditional_options"
  | "completed";

export function TerminalChat({ onBack, onProgressUpdate, onSatsUpdate, totalSats }: TerminalChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [blockPhase, setBlockPhase] = useState<BlockPhase>("typing_speech");
  const [currentOptions, setCurrentOptions] = useState<BlockOption[]>([]);
  const [notification, setNotification] = useState<{ sats: number; skill: string | null } | null>(null);

  const isLockedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    };
  }, []);

  const typeMessage = useCallback((text: string, sender: "satoshi" | "system", onComplete?: () => void) => {
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    
    setIsTyping(true);
    setDisplayedText("");
    let charIndex = 0;

    typeIntervalRef.current = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
        setDisplayedText("");
        onComplete?.();
      }
    }, 30);
  }, []);

  const startBlock = useCallback((blockIndex: number) => {
    const block = LEARNING_BLOCKS[blockIndex];
    if (!block) return;

    setCurrentBlockIndex(blockIndex);
    setBlockPhase("typing_speech");
    setCurrentOptions([]);
    isLockedRef.current = true;

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
    startBlock(0);
  }, [startBlock]);

  const showNotification = useCallback((sats: number, skill: string | null) => {
    setNotification({ sats, skill });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const completeBlock = useCallback((blockIndex: number) => {
    const block = LEARNING_BLOCKS[blockIndex];
    if (!block) return;

    if (block.reward > 0) {
      onSatsUpdate(block.reward);
    }
    onProgressUpdate(block.progress_target);

    if (block.reward > 0 || block.skill) {
      showNotification(block.reward, block.skill);
    }
  }, [onSatsUpdate, onProgressUpdate, showNotification]);

  const handleOptionClick = useCallback((option: BlockOption) => {
    if (isLockedRef.current || isTyping) return;
    isLockedRef.current = true;

    setMessages(prev => [...prev, { id: Date.now(), text: option.text, sender: "user" }]);
    setCurrentOptions([]);

    const currentBlock = LEARNING_BLOCKS[currentBlockIndex];

    if (option.action === "continue" && currentBlock.speech_continued) {
      setBlockPhase("typing_speech_continued");
      setTimeout(() => {
        typeMessage(currentBlock.speech_continued!, "satoshi", () => {
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
  }, [isTyping, currentBlockIndex, typeMessage, startBlock, completeBlock]);

  const currentBlock = LEARNING_BLOCKS[currentBlockIndex];

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-[#E8E8E8] font-mono">
      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-4 left-0 right-0 z-[100] pointer-events-none flex flex-col items-center gap-2"
          >
            {notification.sats > 0 && (
              <div className="bg-[#1E1E1E] text-[#B87333] px-6 py-3 text-[13px] tracking-[3px] font-mono font-bold border border-[#B87333]/60 shadow-lg" data-testid="toast-sats">
                +{notification.sats} SATS
              </div>
            )}
            {notification.skill && (
              <div className="bg-[#1E1E1E] text-[#4ADE80] px-5 py-2 text-[11px] tracking-[2px] font-mono font-bold border border-[#4ADE80]/40 shadow-lg max-w-[360px] text-center" data-testid="toast-skill">
                SKILL UNLOCKED: {notification.skill}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky header */}
      <div className="flex-shrink-0 bg-[#111111] border-b-2 border-[#B87333]/60 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#B87333]" />
            <span className="text-[11px] tracking-[4px] font-bold text-[#B87333] uppercase">
              TERMINAL://SATOSHI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-1 border-2 border-[#B87333]/50 bg-[#B87333]/10">
              <span className="text-[9px] tracking-[3px] text-[#B87333]/60 font-bold">SATS</span>
              <motion.span
                key={totalSats}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="text-[12px] tracking-[2px] text-[#B87333] font-bold"
                data-testid="text-sats-count"
              >
                {totalSats}
              </motion.span>
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

      {/* Scrollable messages area */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6 space-y-5"
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
          `
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
                className={`max-w-[90%] px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line ${
                  message.sender === "user"
                    ? "bg-[#4ADE80]/10 text-[#4ADE80] border-l-4 border-[#4ADE80]"
                    : message.sender === "system"
                    ? "bg-[#B87333]/20 text-[#B87333] border-l-4 border-[#B87333] text-center w-full"
                    : "bg-[#B87333]/10 text-[#B87333] border-l-4 border-[#B87333]"
                }`}
              >
                <span className="text-[10px] opacity-60 block mb-1 tracking-wider">
                  {message.sender === "user" ? "[ USER ]" : message.sender === "system" ? "[ SYSTEM ]" : "[ SATOSHI ]"}
                </span>
                {message.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && displayedText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="max-w-[90%] px-4 py-3 text-[13px] leading-relaxed bg-[#B87333]/10 text-[#B87333] border-l-4 border-[#B87333] whitespace-pre-line">
              <span className="text-[10px] opacity-60 block mb-1 tracking-wider">[ SATOSHI ]</span>
              {displayedText}
              <span className="inline-block w-3 h-4 ml-1 bg-[#B87333] animate-pulse" />
            </div>
          </motion.div>
        )}

        {/* Option buttons */}
        <AnimatePresence>
          {currentOptions.length > 0 && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3 pt-2"
            >
              {currentOptions.map((option, idx) => (
                <motion.button
                  key={`${currentBlock?.id}-${blockPhase}-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  onClick={() => handleOptionClick(option)}
                  disabled={isLockedRef.current}
                  className="w-full px-5 py-4 text-left text-[13px] font-mono font-bold tracking-wide
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

      {/* Block title indicator at bottom */}
      <div className="flex-shrink-0 px-4 py-2 border-t-2 border-[#B87333]/60 bg-[#111111]">
        <div className="flex items-center justify-between max-w-[400px] mx-auto">
          <span className="text-[9px] tracking-[2px] text-[#B87333]/40 font-bold">
            БЛОК {currentBlock?.id || 1}/8
          </span>
          <span className="text-[9px] tracking-[2px] text-[#B87333]/40 font-bold truncate ml-3">
            {currentBlock?.title || ""}
          </span>
        </div>
      </div>
    </div>
  );
}
