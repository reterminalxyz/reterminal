import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, EyeOff } from "lucide-react";
import { playClick, playTypeTick, playSatsChime, playTransition } from "@/lib/sounds";
import { SKILL_META, type SkillKey } from "@shared/schema";
import ProfileOverlay from "./ProfileOverlay";

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
  userStats?: { level: number; xp: number } | null;
  userToken?: string;
  onGrantSkill?: (skillKey: SkillKey) => void;
  levelUpSkill?: SkillKey | null;
  onDismissLevelUp?: () => void;
}

const LEARNING_BLOCKS: LearningBlock[] = [
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
      { text: "Понял, но как это устроено?", action: "next_block" },
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
    speech: "Ты почти прошел прототип 1 модуля и через пару минут сможешь забрать свою награду! Пора рассказать, куда ты попал.\n\nТы в клубе цифрового сопротивления авторитаризму.\n\nВсего будет 7 модулей.\nВ ближайшее время появятся:\n\n→ 2: Приватность и обход слежки\n→ 3: Защищенная коммуникация\n→ 4: Обход цензуры\n→ 5: Свободный доступ к знаниям\n→ 6: Техно-философия\n→ 7: Инструменты выживания оффлайн\n\nКаждый модуль — это навык. Каждый навык — это часть щита независимости.\n\nК концу ты будешь уметь:\nХранить деньги так, что никто их не заберет\n- Общаться так, что никто не прочитает\n- Получать информацию, которую пытаются скрыть\nВыживать в мире, где система пытается тебя контролировать\n\nА самое главное получишь десятки практических навыков для защиты своей свободы так, как нужно именно тебе. Никакой политической программы, только право человека на свободу!\n\nТа прозрачная карта — это пропуск в глобальную сеть людей, которые хотят жить в более честном мире. Передай карту тому, кто поймёт.\n\nМы строим параллельный интернет. И ты только что стал частью этого.",
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
    speech: "1000 SATS это примерно 7 евро. Это твои первые деньги, которые не принадлежат банку.\n\nЭти деньги реальны. Ты можешь их потратить уже сегодня.\n\nНо есть одна проблема… У тебя еще нет кошелька.\n\nПрямо сейчас эти SATS существуют только тут.\n\nТвой финальный шаг:\n\nСоздать личный Bitcoin-кошелек. Это займёт 2 минуты.\nИ все SATS, которые ты заработал, придут на твой адрес. Автоматически.\nЭто момент, когда теория становится реальностью.",
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

const WALLET_STEPS: WalletStep[] = [
  {
    id: "step_1",
    title: "Скачай свой личный сейф",
    instruction: "Слушай внимательно.\n\nМы используем Phoenix Wallet. Это лучший кошелек для новичков. Простой. Быстрый. Твой.\n\nВажно понять одну вещь: в системе Bitcoin нет «твоего аккаунта». Нет логина. Нет пароля. Нет восстановления через email.\nЕсть только твоё устройство. И то, что на нём хранится.\nPhoenix — это не приложение банка. Это твой личный сейф.\n\nСкачай приложение и возвращайся сюда.",
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
      { text: "ПОЛУЧИТЬ 1000 SATS", type: "deeplink", url: "lightning:LNURL1DP68GURN8GHJ7ET4WP5X7UNFVDEKZUNYD9HX2UEJ9EKXUCNFW3EJUCM0D5HHW6T5DPJ8YCTH9ASHQ6F0WCCJ7MRWW4EXCT6EFFMH2WRGVATK7KNTX4M8X3ZZ0QENX7PJ0YH42U35DFSNVNPKDYE5UATCV9RH5WF52EE527SGJD0GM", target: "step_5" }
    ]
  },
  {
    id: "step_5",
    title: "Добро пожаловать в сопротивление",
    instruction: "Ты сделал это.\n\n1000 SATS только что прилетели на твой кошелек.\n\nЭто твои первые деньги в параллельной экономике.\n\nЧто дальше?\n\nЕсли хочешь, изучи Phoenix Wallet\n- Попробуй отправить 10 sats другу (если у него тоже есть кошелек)\n- Найди свой адрес\n- Изучи настройки\n\nСледи за обновлениями проекта\nВ ближайшее время выйдут модули 2-7:\n- Приватность и обход слежки\n- Защищенная коммуникация\n- Обход цензуры\n- Свободный доступ к знаниям\n- Техно-философия\n- Инструменты выживания оффлайн\n\nПередай прозрачную карту тому, кто готов.",
    buttons: []
  }
];

const SATOSHI_WISDOM = [
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

const PixelThumbsUp = ({ size = 24, color = "#FFD700" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} style={{ imageRendering: 'pixelated' }}>
    <rect x="5" y="1" width="2" height="2" />
    <rect x="5" y="3" width="2" height="2" />
    <rect x="5" y="5" width="2" height="2" />
    <rect x="3" y="7" width="2" height="2" />
    <rect x="5" y="7" width="2" height="2" />
    <rect x="7" y="7" width="2" height="2" />
    <rect x="9" y="7" width="2" height="2" />
    <rect x="11" y="7" width="2" height="2" />
    <rect x="3" y="9" width="2" height="2" />
    <rect x="5" y="9" width="2" height="2" />
    <rect x="7" y="9" width="2" height="2" />
    <rect x="9" y="9" width="2" height="2" />
    <rect x="11" y="9" width="2" height="2" />
    <rect x="3" y="11" width="2" height="2" />
    <rect x="5" y="11" width="2" height="2" />
    <rect x="7" y="11" width="2" height="2" />
    <rect x="9" y="11" width="2" height="2" />
    <rect x="11" y="11" width="2" height="2" />
    <rect x="3" y="13" width="2" height="2" />
    <rect x="5" y="13" width="2" height="2" />
    <rect x="7" y="13" width="2" height="2" />
    <rect x="9" y="13" width="2" height="2" />
    <rect x="11" y="13" width="2" height="2" />
  </svg>
);

const CELEBRATION_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 1.5,
  duration: 2 + Math.random() * 2,
  size: 18 + Math.floor(Math.random() * 18),
  rotation: -30 + Math.random() * 60,
  color: ["#FFD700", "#B87333", "#4ADE80", "#FFD700", "#E8A317"][i % 5],
}));

const CelebrationOverlay = () => (
  <motion.div
    className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {CELEBRATION_PARTICLES.map((p) => (
      <motion.div
        key={p.id}
        className="absolute"
        style={{ left: `${p.x}%` }}
        initial={{ y: "110vh", rotate: 0, opacity: 0.9 }}
        animate={{
          y: "-20vh",
          rotate: p.rotation,
          opacity: [0, 1, 1, 0.8, 0],
        }}
        transition={{
          duration: p.duration,
          delay: p.delay,
          ease: "easeOut",
        }}
      >
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.9, 1.1, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror" }}
        >
          <PixelThumbsUp size={p.size} color={p.color} />
        </motion.div>
      </motion.div>
    ))}
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.15, 0.05, 0.1, 0] }}
      transition={{ duration: 3, times: [0, 0.2, 0.4, 0.6, 1] }}
      style={{
        background: "radial-gradient(circle at center, rgba(255,215,0,0.3) 0%, transparent 70%)",
      }}
    />
  </motion.div>
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

function saveWalletState(data: { walletMode: boolean; stepId: string | null; blockIndex: number; sats: number; progress: number }) {
  try { localStorage.setItem("liberta_wallet_state", JSON.stringify(data)); } catch (_) {}
}
function loadWalletState(): { walletMode: boolean; stepId: string | null; blockIndex: number; sats: number; progress: number } | null {
  try {
    const raw = localStorage.getItem("liberta_wallet_state");
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}
function clearWalletState() {
  try { localStorage.removeItem("liberta_wallet_state"); } catch (_) {}
}

function SkillNotificationBanner({ onClose, iconRect }: { onClose: () => void; iconRect?: { x: number; y: number } | null }) {
  const [phase, setPhase] = useState<"show" | "fly">("show");

  useEffect(() => {
    const showTimer = setTimeout(() => setPhase("fly"), 1500);
    return () => clearTimeout(showTimer);
  }, []);

  const flyToX = iconRect ? iconRect.x - window.innerWidth / 2 : 0;
  const flyToY = iconRect ? iconRect.y - 60 : -40;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.7 }}
      animate={phase === "show"
        ? { opacity: [0, 1, 1, 1], y: [0, 60, 60, 60], scale: [0.7, 1.15, 1, 1] }
        : { opacity: 0, y: flyToY, x: flyToX, scale: 0.2 }
      }
      transition={phase === "show"
        ? { duration: 1.2, times: [0, 0.15, 0.5, 1], ease: "easeInOut" }
        : { duration: 0.35, ease: "easeIn" }
      }
      onAnimationComplete={() => { if (phase === "fly") onClose(); }}
      className="fixed top-12 left-0 right-0 z-[100] pointer-events-none flex justify-center"
      data-testid="popup-level-up"
    >
      <motion.div
        className="flex items-center gap-3 px-5 py-2 border-2 border-[#B87333]"
        style={{
          imageRendering: 'pixelated',
          background: '#0A0A0A',
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
      >
        <EyeOff className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "#00e5ff", filter: "drop-shadow(0 0 6px rgba(0,229,255,0.6))" }} />
        <span
          className="text-[13px] tracking-[3px] font-mono font-bold uppercase"
          style={{
            color: '#FFD700',
            textShadow: '0 0 8px #FFD700, 0 0 16px #B87333',
          }}
        >
          Новый скилл
        </span>
      </motion.div>
    </motion.div>
  );
}

function saveTerminalProgress(data: { blockIndex: number; sats: number; progress: number; walletMode?: boolean; walletStepId?: string | null }) {
  try {
    localStorage.setItem("liberta_terminal_progress", JSON.stringify({
      blockIndex: data.blockIndex,
      sats: data.sats,
      progress: data.progress,
      walletMode: data.walletMode || false,
      walletStepId: data.walletStepId || null,
      timestamp: Date.now(),
    }));
  } catch (_) {}

  const token = localStorage.getItem("liberta_token");
  if (token) {
    fetch("/api/save-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        currentModuleId: data.walletMode ? `wallet_${data.walletStepId}` : `block_${data.blockIndex}`,
        currentStepIndex: data.blockIndex,
        totalSats: data.sats,
        independenceProgress: data.progress,
      }),
    }).catch(() => {});
  }
}

function loadTerminalProgress(): { blockIndex: number; sats: number; progress: number; walletMode: boolean; walletStepId: string | null } | null {
  try {
    const raw = localStorage.getItem("liberta_terminal_progress");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

let msgIdCounter = 0;
function nextMsgId() { return ++msgIdCounter; }

export function TerminalChat({ onBack, onProgressUpdate, onSatsUpdate, totalSats, skipFirstTypewriter, userStats, userToken, onGrantSkill, levelUpSkill, onDismissLevelUp }: TerminalChatProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [iconBlinking, setIconBlinking] = useState(false);
  const dosierIconRef = useRef<HTMLButtonElement>(null);
  const savedState = useRef(loadWalletState());
  const savedProgress = useRef(loadTerminalProgress());

  const [messages, setMessages] = useState<Message[]>([]);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(() => savedState.current?.blockIndex ?? 0);
  const [completedBlockCount, setCompletedBlockCount] = useState(() => savedState.current?.blockIndex ?? savedProgress.current?.blockIndex ?? 0);
  const [blockPhase, setBlockPhase] = useState<BlockPhase>("typing_speech");
  const [currentOptions, setCurrentOptions] = useState<BlockOption[]>([]);
  const [notification, setNotification] = useState<{ sats: number; skill: string | null } | null>(null);
  const [inputText, setInputText] = useState("");
  const [walletMode, setWalletMode] = useState(() => savedState.current?.walletMode ?? false);
  const [currentWalletStepId, setCurrentWalletStepId] = useState<string | null>(() => savedState.current?.stepId ?? null);
  const [walletButtons, setWalletButtons] = useState<WalletStepButton[]>([]);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [flowCompleted, setFlowCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const isLockedRef = useRef(false);
  const mountedRef = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const skippedFirstRef = useRef(false);
  const typeTickCounterRef = useRef(0);
  const userScrolledRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTopRef = useRef(0);
  const pendingTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const deeplinkCleanupRef = useRef<(() => void) | null>(null);

  const scrollToBottom = useCallback(() => {
    if (!userScrolledRef.current) {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
        lastScrollTopRef.current = container.scrollTop;
      }
    }
  }, []);

  const handleUserScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const currentScrollTop = container.scrollTop;
    const prevScrollTop = lastScrollTopRef.current;
    lastScrollTopRef.current = currentScrollTop;
    const distanceFromBottom = container.scrollHeight - currentScrollTop - container.clientHeight;
    const isScrollingUp = currentScrollTop < prevScrollTop - 2;
    if (isScrollingUp) {
      userScrolledRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        userScrolledRef.current = false;
        scrollToBottom();
      }, 8000);
    } else if (distanceFromBottom < 10) {
      userScrolledRef.current = false;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    }
  }, [scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText, scrollToBottom]);

  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      if (!mountedRef.current) return;
      pendingTimeoutsRef.current = pendingTimeoutsRef.current.filter(t => t !== id);
      fn();
    }, ms);
    pendingTimeoutsRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      pendingTimeoutsRef.current.forEach(t => clearTimeout(t));
      pendingTimeoutsRef.current = [];
      if (deeplinkCleanupRef.current) {
        deeplinkCleanupRef.current();
        deeplinkCleanupRef.current = null;
      }
    };
  }, []);

  const typeMessage = useCallback((text: string, sender: "satoshi" | "system", onComplete?: () => void) => {
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }
    
    if (!text) {
      onComplete?.();
      return;
    }
    
    setIsTyping(true);
    setDisplayedText("");
    typeTickCounterRef.current = 0;
    let charIndex = 0;

    typeIntervalRef.current = setInterval(() => {
      if (!mountedRef.current) {
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
        return;
      }
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
        requestAnimationFrame(() => {
          if (!mountedRef.current) return;
          setIsTyping(false);
          setDisplayedText("");
          setMessages(prev => [...prev, { id: nextMsgId(), text, sender }]);
          onComplete?.();
        });
      }
    }, 12);
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
      setMessages(prev => [...prev, { id: nextMsgId(), text: block.speech, sender: "satoshi" }]);
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

  const restoredWalletRef = useRef(savedState.current);
  const initializedRef = useRef(false);
  const onSatsUpdateRef = useRef(onSatsUpdate);
  const onProgressUpdateRef = useRef(onProgressUpdate);
  onSatsUpdateRef.current = onSatsUpdate;
  onProgressUpdateRef.current = onProgressUpdate;

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const shouldSkip = skipFirstTypewriter && !skippedFirstRef.current;
    skippedFirstRef.current = true;
    if (restoredWalletRef.current?.walletMode) return;

    const saved = savedProgress.current;
    if (saved && !saved.walletMode && saved.blockIndex > 0) {
      savedProgress.current = null;
      internalSatsRef.current = saved.sats;
      onSatsUpdateRef.current(saved.sats);
      onProgressUpdateRef.current(saved.progress);
      startBlock(saved.blockIndex, true);
    } else {
      startBlock(0, shouldSkip);
    }
  }, [startBlock, skipFirstTypewriter]);

  const internalSatsRef = useRef(totalSats);

  const showNotification = useCallback((sats: number) => {
    setNotification({ sats, skill: null });
    safeTimeout(() => setNotification(null), 1800);
  }, [safeTimeout]);

  const completeBlock = useCallback((blockIndex: number) => {
    const block = LEARNING_BLOCKS[blockIndex];
    if (!block) return;

    setCompletedBlockCount(prev => Math.max(prev, blockIndex + 1));

    if (block.reward > 0) {
      internalSatsRef.current = Math.min(internalSatsRef.current + block.reward, 1000);
      onSatsUpdate(internalSatsRef.current);
      showNotification(block.reward);
      try { playSatsChime(); } catch (_) {}
    }
    const newProgress = Math.min(block.progress_target, 27);
    onProgressUpdate(newProgress);

    if (block.grantSkillKey && onGrantSkill) {
      const skillKey = block.grantSkillKey;
      safeTimeout(() => onGrantSkill(skillKey), 1000);
    }

    saveTerminalProgress({
      blockIndex: blockIndex + 1,
      sats: internalSatsRef.current,
      progress: newProgress,
    });
  }, [onSatsUpdate, onProgressUpdate, showNotification, onGrantSkill, safeTimeout]);

  const startWalletStep = useCallback((stepId: string) => {
    const step = WALLET_STEPS.find(s => s.id === stepId);
    if (!step) return;

    setWalletMode(true);
    userScrolledRef.current = false;
    setCurrentWalletStepId(stepId);
    setWalletButtons([]);
    setCurrentOptions([]);
    isLockedRef.current = true;

    saveWalletState({ walletMode: true, stepId, blockIndex: 7, sats: internalSatsRef.current, progress: 27 });
    saveTerminalProgress({ blockIndex: 7, sats: internalSatsRef.current, progress: 27, walletMode: true, walletStepId: stepId });

    try { playTransition(); } catch (_) {}

    if (stepId === "step_5") {
      setShowCelebration(true);
      safeTimeout(() => setShowCelebration(false), 4000);
      clearWalletState();
    }

    typeMessage(step.instruction, "satoshi", () => {
      isLockedRef.current = false;
      setWalletButtons(step.buttons);
      if (stepId === "step_5") {
        setFlowCompleted(true);
      }
    });
  }, [typeMessage, safeTimeout]);

  useEffect(() => {
    const restored = restoredWalletRef.current;
    if (restored && restored.walletMode && restored.stepId) {
      restoredWalletRef.current = null;
      if (restored.sats) onSatsUpdate(restored.sats);
      if (restored.progress) onProgressUpdate(restored.progress);
      startWalletStep(restored.stepId);
    }
  }, [startWalletStep, onSatsUpdate, onProgressUpdate]);

  const handleWalletButtonClick = useCallback((button: WalletStepButton) => {
    if (isLockedRef.current || isTyping) return;
    playClick();

    if (button.type === "external" && button.url) {
      try {
        const a = document.createElement("a");
        a.href = button.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { try { document.body.removeChild(a); } catch (_) {} }, 500);
      } catch (_) {}
      return;
    }

    if (button.type === "deeplink" && button.url) {
      isLockedRef.current = true;
      setWalletButtons([]);
      setMessages(prev => [...prev, { id: nextMsgId(), text: button.text, sender: "user" }]);

      try {
        const iframe = document.createElement("iframe");
        iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;opacity:0;pointer-events:none;";
        document.body.appendChild(iframe);
        try { iframe.contentWindow?.location.replace(button.url); } catch (_) { iframe.src = button.url; }
        setTimeout(() => { try { document.body.removeChild(iframe); } catch (_) {} }, 3000);
      } catch (_) {
        try {
          const a = document.createElement("a");
          a.href = button.url;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
          document.body.appendChild(a);
          a.click();
          setTimeout(() => { try { document.body.removeChild(a); } catch (_) {} }, 500);
        } catch (_) {}
      }

      if (button.target) {
        const targetStep = button.target;
        let alreadyFired = false;
        const fireOnce = () => {
          if (alreadyFired) return;
          alreadyFired = true;
          document.removeEventListener("visibilitychange", onReturn);
          window.removeEventListener("focus", onReturn);
          deeplinkCleanupRef.current = null;
          startWalletStep(targetStep);
        };
        const onReturn = () => {
          if (document.visibilityState === "visible" || document.hasFocus()) {
            setTimeout(fireOnce, 500);
          }
        };
        document.addEventListener("visibilitychange", onReturn);
        window.addEventListener("focus", onReturn);
        deeplinkCleanupRef.current = () => {
          document.removeEventListener("visibilitychange", onReturn);
          window.removeEventListener("focus", onReturn);
        };
        setTimeout(fireOnce, 3000);
      } else {
        isLockedRef.current = false;
      }
      return;
    }

    if (button.type === "next" && button.target) {
      isLockedRef.current = true;
      setWalletButtons([]);
      setMessages(prev => [...prev, { id: nextMsgId(), text: button.text, sender: "user" }]);
      safeTimeout(() => {
        startWalletStep(button.target!);
      }, 800);
      return;
    }
  }, [isTyping, startWalletStep, safeTimeout]);

  const lastWisdomRef = useRef(-1);

  const handleInputSend = useCallback(() => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    setInputText("");
    setMessages(prev => [...prev, { id: nextMsgId(), text: userText, sender: "user" }]);
    playClick();

    if (flowCompleted) {
      let idx = Math.floor(Math.random() * SATOSHI_WISDOM.length);
      if (idx === lastWisdomRef.current) {
        idx = (idx + 1) % SATOSHI_WISDOM.length;
      }
      lastWisdomRef.current = idx;
      const wisdom = SATOSHI_WISDOM[idx];
      safeTimeout(() => {
        typeMessage(wisdom, "satoshi", () => {});
      }, 500);
    } else {
      safeTimeout(() => {
        setMessages(prev => [...prev, { id: nextMsgId(), text: "сначала пройди первый блок, все вопросы потом", sender: "satoshi" }]);
      }, 500);
    }
  }, [inputText, flowCompleted, typeMessage, safeTimeout]);

  const handleOptionClick = useCallback((option: BlockOption) => {
    if (isLockedRef.current || isTyping) return;
    isLockedRef.current = true;
    playClick();

    setMessages(prev => [...prev, { id: nextMsgId(), text: option.text, sender: "user" }]);
    setCurrentOptions([]);

    const currentBlock = LEARNING_BLOCKS[currentBlockIndex];

    if (option.action === "continue") {
      setBlockPhase("typing_speech_continued");
      const continuedText = option.continued_text || currentBlock.speech_continued || "";
      safeTimeout(() => {
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
        safeTimeout(() => {
          typeMessage(option.conditional_text!, "satoshi", () => {
            isLockedRef.current = false;
            completeBlock(currentBlockIndex);
            safeTimeout(() => {
              const nextIndex = currentBlockIndex + 1;
              if (nextIndex < LEARNING_BLOCKS.length) {
                startBlock(nextIndex);
              }
            }, 800);
          });
        }, 400);
      } else {
        completeBlock(currentBlockIndex);
        safeTimeout(() => {
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
        safeTimeout(() => {
          typeMessage(option.conditional_text!, "satoshi", () => {
            isLockedRef.current = false;
            safeTimeout(() => {
              onBack();
            }, 2000);
          });
        }, 400);
      } else {
        safeTimeout(() => {
          isLockedRef.current = false;
          onBack();
        }, 500);
      }
      return;
    }

    if (option.action === "restart") {
      if (option.conditional_text) {
        setBlockPhase("typing_conditional");
        safeTimeout(() => {
          typeMessage(option.conditional_text!, "satoshi", () => {
            isLockedRef.current = false;
            safeTimeout(() => {
              setMessages([]);
              startBlock(0);
            }, 2000);
          });
        }, 400);
      } else {
        safeTimeout(() => {
          isLockedRef.current = false;
          setMessages([]);
          startBlock(0);
        }, 500);
      }
      return;
    }

    if (option.action === "show_conditional_text" && option.conditional_text) {
      setBlockPhase("typing_conditional");
      safeTimeout(() => {
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
      setWalletMode(true);
      safeTimeout(() => {
        isLockedRef.current = false;
        startWalletStep("step_1");
      }, 800);
      return;
    }

    isLockedRef.current = false;
  }, [isTyping, currentBlockIndex, typeMessage, startBlock, completeBlock, onBack, startWalletStep, safeTimeout]);

  const [satsAnimating, setSatsAnimating] = useState(false);
  const prevSatsRef = useRef(totalSats);

  useEffect(() => {
    if (totalSats > prevSatsRef.current) {
      setSatsAnimating(true);
      const id = setTimeout(() => setSatsAnimating(false), 600);
      prevSatsRef.current = totalSats;
      return () => clearTimeout(id);
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

      <AnimatePresence>
        {showCelebration && <CelebrationOverlay />}
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
            <motion.button
              ref={dosierIconRef}
              type="button"
              onClick={() => setShowProfile(true)}
              className="w-9 h-9 flex items-center justify-center hover:opacity-90 transition-opacity"
              style={{ opacity: iconBlinking ? 1 : 0.5 }}
              animate={iconBlinking ? {
                opacity: [0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5],
                filter: [
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 8px rgba(0,229,255,0.8))",
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 8px rgba(0,229,255,0.8))",
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 8px rgba(0,229,255,0.8))",
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 8px rgba(0,229,255,0.8))",
                  "drop-shadow(0 0 0px transparent)",
                ],
              } : {}}
              transition={iconBlinking ? { duration: 2.4, ease: "easeInOut" } : {}}
              data-testid="button-profile-avatar"
            >
              <EyeOff
                className="w-[22px] h-[22px]"
                style={{
                  color: iconBlinking ? "#00e5ff" : "#B87333",
                  transition: "color 0.3s",
                }}
              />
            </motion.button>
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
              type="button"
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
            1/7 ФИНАНСОВАЯ СВОБОДА
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
        {messages.map((message) => (
          <div
            key={message.id}
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
          </div>
        ))}

        {isTyping && displayedText && (
          <div className="flex justify-start">
            <div className="max-w-[90%] px-3 py-2 text-[13px] leading-snug bg-[#B87333]/10 text-[#B87333] border-l-4 border-[#B87333] whitespace-pre-line">
              <span className="text-[10px] opacity-60 block mb-0.5 tracking-wider">[ SATOSHI ]</span>
              {displayedText}
              <span className="inline-block w-3 h-4 ml-1 bg-[#B87333] animate-pulse" />
            </div>
          </div>
        )}

        {currentOptions.length > 0 && !isTyping && !walletMode && (
          <div className="flex flex-col gap-2 pt-1">
            {currentOptions.map((option, idx) => (
              <motion.button
                type="button"
                key={`${currentBlock?.id}-${blockPhase}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleOptionClick(option); }}
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
          </div>
        )}

        {walletButtons.length > 0 && !isTyping && walletMode && (
          <div className="flex flex-col gap-2 pt-1">
            {walletButtons.map((button, idx) => (
              <motion.button
                type="button"
                key={`wallet-${currentWalletStepId}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleWalletButtonClick(button); }}
                disabled={isLockedRef.current}
                className={`w-full px-4 py-3 text-left text-[13px] font-mono font-bold tracking-wide
                         border-2 active:scale-[0.98] transition-all duration-200
                         disabled:opacity-30 disabled:cursor-not-allowed
                         ${button.type === "external"
                           ? "border-[#4ADE80]/50 bg-[#4ADE80]/5 text-[#4ADE80] hover:bg-[#4ADE80]/15 hover:border-[#4ADE80]"
                           : button.type === "deeplink"
                           ? "border-[#FFD700]/50 bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 hover:border-[#FFD700]"
                           : "border-[#B87333]/50 bg-[#B87333]/5 text-[#B87333] hover:bg-[#B87333]/15 hover:border-[#B87333]"
                         }`}
                data-testid={`button-wallet-${idx}`}
              >
                <span className={`mr-2 ${
                  button.type === "external" ? "text-[#4ADE80]/40" 
                  : button.type === "deeplink" ? "text-[#FFD700]/40"
                  : "text-[#B87333]/40"
                }`}>
                  {button.type === "external" ? "[>>]" : button.type === "deeplink" ? ">>>" : ">"}
                </span>
                {button.text}
              </motion.button>
            ))}
          </div>
        )}

        {flowCompleted && !isTyping && (
          <div className="pt-3">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTroubleshooting(prev => !prev); }}
              className="w-full px-4 py-3 text-left text-[11px] font-mono font-bold tracking-[2px]
                       border border-[#B87333]/30 bg-[#B87333]/5 text-[#B87333]/60
                       hover:bg-[#B87333]/10 hover:text-[#B87333] transition-all duration-200"
              data-testid="button-troubleshooting"
            >
              <span className="mr-2 text-[#B87333]/30">{showTroubleshooting ? "[-]" : "[+]"}</span>
              TROUBLESHOOTING
            </motion.button>

            <AnimatePresence>
              {showTroubleshooting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 text-[12px] font-mono leading-relaxed text-[#B87333]/70 border border-t-0 border-[#B87333]/20 bg-[#0A0A0A]">
                    <p className="text-[#B87333] font-bold mb-2 tracking-wider text-[11px]">ЕСЛИ ДЕНЬГИ НЕ ПРИШЛИ:</p>
                    <p className="mb-1">- Проверь интернет-соединение</p>
                    <p className="mb-1">- Подожди 30-60 секунд</p>
                    <p className="mb-1">- Перезапусти Phoenix Wallet</p>
                    <p>- Если через 5 минут деньги не пришли — свяжись с нами в чате</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

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
            type="button"
            onClick={handleInputSend}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 flex items-center justify-center border border-[#B87333]/40 bg-[#1A1A1A] text-[#B87333] hover:bg-[#B87333]/20 transition-colors"
            data-testid="button-send"
          >
            <PixelSendIcon />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {levelUpSkill && onDismissLevelUp && (
          <SkillNotificationBanner
            iconRect={dosierIconRef.current ? (() => {
              const r = dosierIconRef.current!.getBoundingClientRect();
              return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            })() : null}
            onClose={() => {
              onDismissLevelUp();
              setIconBlinking(true);
              safeTimeout(() => setIconBlinking(false), 2600);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfile && (
          <ProfileOverlay
            onClose={() => setShowProfile(false)}
            token={userToken || localStorage.getItem("liberta_token")}
            completedBlockIndex={completedBlockCount}
            originRect={dosierIconRef.current ? (() => {
              const r = dosierIconRef.current!.getBoundingClientRect();
              return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            })() : null}
          />
        )}
      </AnimatePresence>

    </div>
  );
}