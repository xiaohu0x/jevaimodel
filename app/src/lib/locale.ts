import type { PrimitiveType } from '@/lib/engine'

export const LOCALES = [
  { code: 'en', slug: '', hrefLang: 'en', htmlLang: 'en', ogLocale: 'en_US', label: 'English', shortLabel: 'EN' },
  { code: 'zh-CN', slug: 'zh-cn', hrefLang: 'zh-CN', htmlLang: 'zh-CN', ogLocale: 'zh_CN', label: '简体中文', shortLabel: '中文' },
  { code: 'es', slug: 'es', hrefLang: 'es', htmlLang: 'es', ogLocale: 'es_ES', label: 'Español', shortLabel: 'ES' },
  { code: 'ja', slug: 'ja', hrefLang: 'ja', htmlLang: 'ja', ogLocale: 'ja_JP', label: '日本語', shortLabel: '日本語' },
  { code: 'ko', slug: 'ko', hrefLang: 'ko', htmlLang: 'ko', ogLocale: 'ko_KR', label: '한국어', shortLabel: '한국어' },
  { code: 'fr', slug: 'fr', hrefLang: 'fr', htmlLang: 'fr', ogLocale: 'fr_FR', label: 'Français', shortLabel: 'FR' },
  { code: 'de', slug: 'de', hrefLang: 'de', htmlLang: 'de', ogLocale: 'de_DE', label: 'Deutsch', shortLabel: 'DE' },
  { code: 'pt-BR', slug: 'pt-br', hrefLang: 'pt-BR', htmlLang: 'pt-BR', ogLocale: 'pt_BR', label: 'Português (Brasil)', shortLabel: 'PT' },
] as const

export type Locale = (typeof LOCALES)[number]['code']

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALIZED_HOME_PATHS = LOCALES.filter((locale) => locale.slug).map(
  (locale) => `/${locale.slug}`,
)

export function localeDefinition(locale: Locale) {
  return LOCALES.find((candidate) => candidate.code === locale) ?? LOCALES[0]
}

export function localeHomePath(locale: Locale): string {
  const slug = localeDefinition(locale).slug
  return slug ? `/${slug}` : '/'
}

export function localeFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split('/').filter(Boolean)[0]?.toLowerCase()
  return LOCALES.find((locale) => locale.slug === firstSegment)?.code ?? DEFAULT_LOCALE
}

export function formatMessage(message: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    message,
  )
}

interface PrimitiveCopy {
  ask: string
  answerShape: string
  tagline: string
  example: string
}

interface UiCopy {
  seo: {
    title: string
    description: string
    h1: string
    imageAlt: string
  }
  header: {
    playground: string
    howItWorks: string
    share: string
    copied: string
    signIn: string
    signOut: string
    language: string
  }
  hero: {
    eyebrow: string
    lines: readonly string[]
    intro: string
  }
  examples: {
    prompt: string
    hint: string
    titles: Record<string, string>
  }
  editor: {
    context: string
    contextHint: string
    invalidJson: string
    fieldView: string
    fieldViewUnavailable: string
    fields: string
    field: string
    value: string
    noFacts: string
    addField: string
    removeField: string
    contextJson: string
    fixJson: string
    nestedJson: string
    questions: string
    questionsHint: string
    pickAnswer: string
    add: string
    selectType: string
    docs: string
    questionType: string
    removeQuestion: string
    instructions: string
    noulHelp: string
    levels: string
    lowest: string
    highest: string
    inBetween: string
    addLevel: string
    removeLevel: string
    levelHelp: string
    options: string
    optionName: string
    optionDescription: string
    addOption: string
    removeOption: string
    optionHelp: string
    youGet: string
  }
  primitives: Record<PrimitiveType, PrimitiveCopy>
  action: {
    authError: string
    tryAgain: string
    dismiss: string
    checking: string
    readyIn: string
    userRemaining: string
    dailyDone: string
    guestRemaining: string
    signInContinue: string
    unavailable: string
    clear: string
    asking: string
    dailyLimit: string
    run: string
    genericError: string
    wait: string
  }
  output: {
    result: string
    answer: string
    answers: string
    likelyTrue: string
    likelyFalse: string
    unsure: string
    no: string
    yes: string
    choice: string
    closest: string
    score: string
    confidence: string
    low: string
    askingQuestions: string
  }
  next: {
    title: string
    changeAndRun: string
    seeMove: string
    alsoAsk: string
  }
  login: {
    title: string
    body: string
    google: string
    disclosureBefore: string
    terms: string
    disclosureMiddle: string
    privacy: string
    close: string
  }
  features: readonly { title: string; body: string }[]
  footer: {
    description: string
    section: string
    open: string
    docs: string
    useCases: string
    examples: string
    faq: string
    privacy: string
    terms: string
    source: string
  }
}

export const UI_COPY: Record<Locale, UiCopy> = {
  en: {
    seo: {
      title: 'JEV AI Model: Free AI Text Classifier Online, No Waitlist',
      description: 'JEV AI Model is a free online AI text classifier for text and JSON. Get probabilities, scores, labels, and confidence in seconds without an API key.',
      h1: 'JEV AI Model: free online AI text classifier',
      imageAlt: 'Free online AI text classifier by JEV AI Model',
    },
    header: { playground: 'Playground', howItWorks: 'How it works', share: 'Share', copied: 'Copied', signIn: 'Sign in', signOut: 'Sign out', language: 'Language' },
    hero: {
      eyebrow: 'FREE ONLINE AI TEXT CLASSIFIER',
      lines: ['JEV AI Model:', 'free online AI text classifier'],
      intro: 'Classify text or JSON into probabilities, scores, and labels with confidence. Start free in your browser, with no API key required.',
    },
    examples: {
      prompt: 'New here? Start with an example',
      hint: 'each one fills in the context and question below',
      titles: { hotdog: 'Is a hotdog a sandwich?', sky: 'What color is the sky?', support: 'Triage a support message', resume: 'Screen a résumé' },
    },
    editor: {
      context: 'Context', contextHint: 'the facts to classify — one per row', invalidJson: 'invalid JSON', fieldView: 'Field view', fieldViewUnavailable: 'Field view needs a flat JSON object', fields: 'Fields', field: 'Field', value: 'Value', noFacts: 'No facts yet — add a field, or pick an example above.', addField: 'Add a field', removeField: 'Remove field', contextJson: 'Context JSON', fixJson: 'Fix the JSON above to switch back to the field view.', nestedJson: 'This context is nested, so it stays in JSON. Flat key/value data can use the field view.', questions: 'Questions', questionsHint: 'what you want to know about it', pickAnswer: 'Pick what kind of answer you want:', add: 'Add', selectType: 'Select question type', docs: 'Docs', questionType: 'Question type', removeQuestion: 'Remove question', instructions: 'Instructions', noulHelp: 'Write a statement, not a question. You get the probability that it is true — from 0 to 1.', levels: 'Levels — low to high', lowest: 'Lowest — e.g. no impact', highest: 'Highest — e.g. blocking issue', inBetween: 'In between', addLevel: 'Add level', removeLevel: 'Remove level', levelHelp: 'You get a number on this scale — 1.4 sits between level 1 and level 2.', options: 'Options', optionName: 'Option name', optionDescription: 'What this option covers', addOption: 'Add option', removeOption: 'Remove option', optionHelp: 'The description is what the model reads — say what each option covers.', youGet: 'You get',
    },
    primitives: {
      noul: { ask: 'Is it true?', answerShape: '0.93 likely', tagline: 'Probability from 0 to 1', example: 'The message conveys urgency' },
      score: { ask: 'How much?', answerShape: '1.4 of 3 levels', tagline: 'Rate against ordered levels', example: 'How severe is the reported issue?' },
      choice: { ask: 'Which one?', answerShape: 'billing · 92%', tagline: 'Pick one supplied option', example: 'Which team should handle this?' },
    },
    action: { authError: 'Couldn’t complete Google sign-in', tryAgain: 'Please try again.', dismiss: 'Dismiss', checking: 'Checking allowance...', readyIn: 'Ready in {seconds}s', userRemaining: '{count} of 30 runs left today', dailyDone: '30 runs used today. Come back tomorrow.', guestRemaining: '{count} free runs left', signInContinue: 'Sign in to continue', unavailable: 'Usage unavailable', clear: 'Clear', asking: 'Asking Jev', dailyLimit: 'Daily limit reached', run: 'Run', genericError: 'Something went wrong reaching the classifier.', wait: 'Please wait {seconds} seconds before running again.' },
    output: { result: 'Result', answer: 'answer', answers: 'answers', likelyTrue: 'likely true', likelyFalse: 'likely false', unsure: 'genuinely unsure', no: 'No', yes: 'Yes', choice: 'Choice', closest: 'Closest to “{label}”', score: 'Score', confidence: 'Confidence', low: 'low', askingQuestions: 'Jev is processing {count} question(s)…' },
    next: { title: 'Try next', changeAndRun: 'Change {field} and run again', seeMove: 'see the answer move', alsoAsk: 'Also ask {question}' },
    login: { title: 'Sign in to keep going', body: 'Continue with your Google account for 30 playground runs each day.', google: 'Continue with Google', disclosureBefore: 'We only store your name, email and avatar for sign-in. By continuing, you agree to our', terms: 'Terms', disclosureMiddle: 'and acknowledge our', privacy: 'Privacy Policy', close: 'Close' },
    features: [
      { title: 'Structured answers', body: 'Get a probability, score, or one of your labels instead of free-form text.' },
      { title: 'Confidence included', body: 'Every result includes confidence, so uncertain cases can go to review.' },
      { title: 'No setup', body: 'Try three classifications without an account or API key, then sign in to continue.' },
    ],
    footer: { description: 'A free online AI text classifier for turning text and JSON into probabilities, scores, and labels.', section: 'PLAYGROUND', open: 'Open the playground', docs: 'Documentation', useCases: 'Use cases', examples: 'Examples', faq: 'FAQ', privacy: 'Privacy', terms: 'Terms', source: 'Source' },
  },
  'zh-CN': {
    seo: {
      title: 'JEV AI模型：免排队直接使用的免费在线 AI 分类器',
      description: 'JEV AI Model 是免费在线 AI 文本分类器，支持文本和 JSON，快速返回概率、评分、标签与置信度，无需 API Key 即可试用。',
      h1: 'JEV AI Model：免费在线 AI 文本分类器',
      imageAlt: 'JEV AI Model 免费在线 AI 文本分类器',
    },
    header: { playground: '分类工具', howItWorks: '使用方法', share: '分享', copied: '已复制', signIn: '登录', signOut: '退出登录', language: '语言' },
    hero: {
      eyebrow: '在线 AI 文本分类工具',
      lines: ['JEV AI Model：', '免费在线 AI 文本分类器'],
      intro: '粘贴文本或 JSON，选择结果类型，几秒内获得带置信度的概率、评分或分类标签。',
    },
    examples: { prompt: '第一次使用？从示例开始', hint: '示例会自动填写下方的上下文和问题', titles: { hotdog: '热狗算三明治吗？', sky: '天空是什么颜色？', support: '分流客服消息', resume: '筛选简历' } },
    editor: { context: '上下文', contextHint: '需要分类的事实，每行一项', invalidJson: 'JSON 格式错误', fieldView: '字段', fieldViewUnavailable: '字段视图仅支持扁平 JSON 对象', fields: '字段', field: '字段名', value: '值', noFacts: '还没有内容，请添加字段或选择上方示例。', addField: '添加字段', removeField: '删除字段', contextJson: '上下文 JSON', fixJson: '请先修复上方 JSON，再切换回字段视图。', nestedJson: '当前数据包含嵌套结构，因此使用 JSON 视图。扁平键值数据可以使用字段视图。', questions: '问题', questionsHint: '你想从这些信息中判断什么', pickAnswer: '选择你需要的结果类型：', add: '添加', selectType: '选择问题类型', docs: '文档', questionType: '问题类型', removeQuestion: '删除问题', instructions: '判断说明', noulHelp: '请写成陈述句。结果是该陈述为真的概率，范围为 0 到 1。', levels: '等级（从低到高）', lowest: '最低，例如：无影响', highest: '最高，例如：完全阻塞', inBetween: '中间等级', addLevel: '添加等级', removeLevel: '删除等级', levelHelp: '结果会落在这条等级刻度上，例如 1.4 位于等级 1 和 2 之间。', options: '选项', optionName: '选项名称', optionDescription: '该选项包含什么', addOption: '添加选项', removeOption: '删除选项', optionHelp: '模型会读取选项说明，请清楚描述每个选项的范围。', youGet: '返回结果' },
    primitives: {
      noul: { ask: '是否为真？', answerShape: '概率 0.93', tagline: '返回 0 到 1 的概率', example: '这条消息表达了紧迫性' },
      score: { ask: '程度如何？', answerShape: '3 级中的 1.4', tagline: '按自定义等级评分', example: '这个问题有多严重？' },
      choice: { ask: '属于哪一项？', answerShape: '技术支持 · 92%', tagline: '从给定选项中选择', example: '应该由哪个团队处理？' },
    },
    action: { authError: 'Google 登录未完成', tryAgain: '请重试。', dismiss: '关闭', checking: '正在检查可用次数…', readyIn: '{seconds} 秒后可用', userRemaining: '今天还剩 {count}/30 次', dailyDone: '今天 30 次已用完，请明天再来。', guestRemaining: '还剩 {count} 次免登录试用', signInContinue: '登录后继续', unavailable: '暂时无法读取次数', clear: '清空', asking: 'Jev 正在判断', dailyLimit: '今日次数已用完', run: '开始分类', genericError: '连接分类服务时出现问题。', wait: '请等待 {seconds} 秒后再次运行。' },
    output: { result: '分类结果', answer: '个结果', answers: '个结果', likelyTrue: '很可能为真', likelyFalse: '很可能为假', unsure: '暂时无法确定', no: '否', yes: '是', choice: '所选分类', closest: '最接近“{label}”', score: '评分', confidence: '置信度', low: '较低', askingQuestions: 'Jev 正在处理 {count} 个问题…' },
    next: { title: '下一步可以尝试', changeAndRun: '修改 {field} 后再次运行', seeMove: '观察结果变化', alsoAsk: '还可以判断：{question}' },
    login: { title: '登录后继续使用', body: '使用 Google 账号登录后，每天可在分类工具中运行 30 次。', google: '使用 Google 继续', disclosureBefore: '我们只保存登录所需的姓名、邮箱和头像。继续即表示你同意', terms: '服务条款', disclosureMiddle: '并确认已阅读', privacy: '隐私政策', close: '关闭' },
    features: [
      { title: '结构化分类结果', body: '直接获得概率、评分或标签，不再从长篇文本中提取答案。' },
      { title: '自带置信度', body: '每个结果都包含置信度，低置信度内容可以交给人工复核。' },
      { title: '无需配置', body: '无需账号或 API Key 即可免费分类 3 次，登录后可继续使用。' },
    ],
    footer: { description: '免费在线 AI 文本分类器，把文本和 JSON 转换为概率、评分与分类标签。', section: '分类工具', open: '打开分类工具', docs: '英文文档', useCases: '使用场景', examples: '示例', faq: '常见问题', privacy: '隐私政策', terms: '服务条款', source: '源代码' },
  },
  es: {
    seo: { title: 'JEV AI Model: clasificador de texto con IA gratis sin cola', description: 'JEV AI Model es un clasificador de texto con IA gratis y online para texto y JSON. Obtén probabilidades, puntuaciones, etiquetas y confianza sin clave API.', h1: 'JEV AI Model: clasificador de texto con IA gratis', imageAlt: 'Clasificador de texto con IA gratis de JEV AI Model' },
    header: { playground: 'Clasificador', howItWorks: 'Cómo funciona', share: 'Compartir', copied: 'Copiado', signIn: 'Entrar', signOut: 'Cerrar sesión', language: 'Idioma' },
    hero: { eyebrow: 'CLASIFICADOR DE TEXTO CON IA', lines: ['JEV AI Model:', 'clasificador de texto con IA gratis'], intro: 'Pega texto o JSON, elige el formato de respuesta y obtén una clasificación fundamentada con nivel de confianza.' },
    examples: { prompt: '¿Es tu primera vez? Empieza con un ejemplo', hint: 'cada ejemplo completa el contexto y la pregunta', titles: { hotdog: '¿Un perrito caliente es un sándwich?', sky: '¿De qué color está el cielo?', support: 'Clasificar un mensaje de soporte', resume: 'Evaluar un currículum' } },
    editor: { context: 'Contexto', contextHint: 'los datos que se van a clasificar', invalidJson: 'JSON no válido', fieldView: 'Campos', fieldViewUnavailable: 'La vista de campos necesita un objeto JSON plano', fields: 'Campos', field: 'Campo', value: 'Valor', noFacts: 'Aún no hay datos. Añade un campo o elige un ejemplo.', addField: 'Añadir campo', removeField: 'Eliminar campo', contextJson: 'JSON de contexto', fixJson: 'Corrige el JSON para volver a la vista de campos.', nestedJson: 'Este contexto está anidado y se mantiene como JSON. Los datos planos pueden usar la vista de campos.', questions: 'Preguntas', questionsHint: 'qué quieres saber sobre el contexto', pickAnswer: 'Elige el tipo de respuesta:', add: 'Añadir', selectType: 'Seleccionar tipo de pregunta', docs: 'Docs', questionType: 'Tipo de pregunta', removeQuestion: 'Eliminar pregunta', instructions: 'Instrucciones', noulHelp: 'Escribe una afirmación. Recibirás la probabilidad de que sea cierta, de 0 a 1.', levels: 'Niveles, de menor a mayor', lowest: 'Mínimo, p. ej. sin impacto', highest: 'Máximo, p. ej. bloqueante', inBetween: 'Nivel intermedio', addLevel: 'Añadir nivel', removeLevel: 'Eliminar nivel', levelHelp: 'Recibirás un número en esta escala; 1,4 queda entre los niveles 1 y 2.', options: 'Opciones', optionName: 'Nombre de la opción', optionDescription: 'Qué incluye esta opción', addOption: 'Añadir opción', removeOption: 'Eliminar opción', optionHelp: 'El modelo lee la descripción; explica con claridad qué incluye cada opción.', youGet: 'Resultado' },
    primitives: { noul: { ask: '¿Es cierto?', answerShape: '0,93 probable', tagline: 'Probabilidad de 0 a 1', example: 'El mensaje transmite urgencia' }, score: { ask: '¿En qué grado?', answerShape: '1,4 de 3 niveles', tagline: 'Puntúa con niveles ordenados', example: '¿Qué gravedad tiene el problema?' }, choice: { ask: '¿Cuál es?', answerShape: 'soporte · 92 %', tagline: 'Elige una opción definida', example: '¿Qué equipo debe gestionarlo?' } },
    action: { authError: 'No se pudo completar el acceso con Google', tryAgain: 'Inténtalo de nuevo.', dismiss: 'Cerrar', checking: 'Comprobando usos…', readyIn: 'Disponible en {seconds} s', userRemaining: 'Quedan {count} de 30 usos hoy', dailyDone: 'Has usado los 30 intentos de hoy. Vuelve mañana.', guestRemaining: 'Quedan {count} usos gratis', signInContinue: 'Inicia sesión para continuar', unavailable: 'Uso no disponible', clear: 'Limpiar', asking: 'Jev está clasificando', dailyLimit: 'Límite diario alcanzado', run: 'Clasificar', genericError: 'No se pudo conectar con el clasificador.', wait: 'Espera {seconds} segundos antes de volver a ejecutar.' },
    output: { result: 'Resultado', answer: 'respuesta', answers: 'respuestas', likelyTrue: 'probablemente cierto', likelyFalse: 'probablemente falso', unsure: 'incierto', no: 'No', yes: 'Sí', choice: 'Elección', closest: 'Más cercano a «{label}»', score: 'Puntuación', confidence: 'Confianza', low: 'baja', askingQuestions: 'Jev está procesando {count} preguntas…' },
    next: { title: 'Prueba ahora', changeAndRun: 'Cambia {field} y vuelve a ejecutar', seeMove: 'observa cómo cambia', alsoAsk: 'Pregunta también: {question}' },
    login: { title: 'Inicia sesión para continuar', body: 'Accede con Google para obtener 30 usos diarios del clasificador.', google: 'Continuar con Google', disclosureBefore: 'Solo guardamos tu nombre, correo y avatar para iniciar sesión. Al continuar, aceptas los', terms: 'Términos', disclosureMiddle: 'y reconoces la', privacy: 'Política de privacidad', close: 'Cerrar' },
    features: [{ title: 'Respuestas estructuradas', body: 'Obtén una probabilidad, una puntuación o una etiqueta en vez de texto libre.' }, { title: 'Confianza incluida', body: 'Cada resultado incluye confianza para enviar los casos dudosos a revisión.' }, { title: 'Sin configuración', body: 'Prueba 3 clasificaciones sin cuenta ni clave API; después puedes iniciar sesión.' }],
    footer: { description: 'Clasificador de texto con IA gratuito para convertir texto y JSON en probabilidades, puntuaciones y etiquetas.', section: 'CLASIFICADOR', open: 'Abrir el clasificador', docs: 'Documentación en inglés', useCases: 'Casos de uso', examples: 'Ejemplos', faq: 'Preguntas frecuentes', privacy: 'Privacidad', terms: 'Términos', source: 'Código fuente' },
  },
  ja: {
    seo: { title: 'JEV AIモデル：順番待ち不要の無料オンラインAI分類ツール', description: 'JEV AI Modelは、テキストやJSONを確率・スコア・ラベルに変換する無料オンラインAI分類ツールです。APIキーなしですぐ試せます。', h1: 'JEV AI Model：無料オンラインAIテキスト分類ツール', imageAlt: 'JEV AI Modelの無料AIテキスト分類ツール' },
    header: { playground: '分類ツール', howItWorks: '使い方', share: '共有', copied: 'コピー済み', signIn: 'ログイン', signOut: 'ログアウト', language: '言語' },
    hero: { eyebrow: 'オンラインAIテキスト分類', lines: ['JEV AI Model：', '無料オンラインAIテキスト分類ツール'], intro: 'テキストやJSONを貼り付け、回答形式を選ぶだけ。確信度付きの分類結果をすぐに取得できます。' },
    examples: { prompt: '初めてですか？例から始めましょう', hint: '下のコンテキストと質問が自動入力されます', titles: { hotdog: 'ホットドッグはサンドイッチ？', sky: '空は何色？', support: '問い合わせを振り分ける', resume: '履歴書を評価する' } },
    editor: { context: 'コンテキスト', contextHint: '分類する事実を1行ずつ入力', invalidJson: 'JSONが無効です', fieldView: 'フィールド', fieldViewUnavailable: 'フィールド表示にはフラットなJSONオブジェクトが必要です', fields: 'フィールド', field: '項目', value: '値', noFacts: 'データがありません。フィールドを追加するか、例を選んでください。', addField: 'フィールドを追加', removeField: 'フィールドを削除', contextJson: 'コンテキストJSON', fixJson: 'JSONを修正するとフィールド表示に戻れます。', nestedJson: '入れ子のコンテキストはJSON表示になります。フラットなキーと値はフィールド表示を利用できます。', questions: '質問', questionsHint: 'コンテキストから何を判断するか', pickAnswer: '必要な回答形式を選択：', add: '追加', selectType: '質問タイプを選択', docs: 'Docs', questionType: '質問タイプ', removeQuestion: '質問を削除', instructions: '判定内容', noulHelp: '質問ではなく文として入力します。真である確率が0〜1で返ります。', levels: 'レベル（低い順）', lowest: '最低（例：影響なし）', highest: '最高（例：完全に停止）', inBetween: '中間', addLevel: 'レベルを追加', removeLevel: 'レベルを削除', levelHelp: 'この尺度上の数値が返ります。1.4はレベル1と2の間です。', options: '選択肢', optionName: '選択肢名', optionDescription: 'この選択肢の範囲', addOption: '選択肢を追加', removeOption: '選択肢を削除', optionHelp: 'モデルは説明文を読みます。各選択肢の範囲を明確にしてください。', youGet: '返される結果' },
    primitives: { noul: { ask: '本当？', answerShape: '確率 0.93', tagline: '0〜1の確率', example: 'このメッセージには緊急性がある' }, score: { ask: 'どの程度？', answerShape: '3段階中 1.4', tagline: '順序付きレベルで評価', example: '報告された問題はどの程度深刻か' }, choice: { ask: 'どれ？', answerShape: '技術 · 92%', tagline: '候補から1つを選択', example: 'どのチームが対応すべきか' } },
    action: { authError: 'Googleログインを完了できませんでした', tryAgain: 'もう一度お試しください。', dismiss: '閉じる', checking: '利用回数を確認中…', readyIn: '{seconds}秒後に利用可能', userRemaining: '本日は残り{count}/30回', dailyDone: '本日の30回を使い切りました。明日またお試しください。', guestRemaining: '無料利用は残り{count}回', signInContinue: 'ログインして続ける', unavailable: '利用状況を取得できません', clear: 'クリア', asking: 'Jevが分類中', dailyLimit: '本日の上限に達しました', run: '分類する', genericError: '分類サービスに接続できませんでした。', wait: '再実行まで{seconds}秒お待ちください。' },
    output: { result: '分類結果', answer: '件の回答', answers: '件の回答', likelyTrue: '真の可能性が高い', likelyFalse: '偽の可能性が高い', unsure: '判断が難しい', no: 'いいえ', yes: 'はい', choice: '選択結果', closest: '「{label}」に最も近い', score: 'スコア', confidence: '確信度', low: '低い', askingQuestions: 'Jevが{count}件の質問を処理中…' },
    next: { title: '次に試す', changeAndRun: '{field}を変更して再実行', seeMove: '結果の変化を確認', alsoAsk: 'さらに質問：{question}' },
    login: { title: 'ログインして続ける', body: 'Googleアカウントでログインすると、1日30回まで利用できます。', google: 'Googleで続ける', disclosureBefore: 'ログイン用に氏名、メール、画像のみを保存します。続行すると', terms: '利用規約', disclosureMiddle: 'と', privacy: 'プライバシーポリシー', close: '閉じる' },
    features: [{ title: '構造化された回答', body: '自由文ではなく、確率・スコア・指定したラベルを取得できます。' }, { title: '確信度も表示', body: 'すべての結果に確信度が付き、曖昧なケースを人が確認できます。' }, { title: '設定不要', body: 'アカウントやAPIキーなしで3回試せます。ログイン後も継続できます。' }],
    footer: { description: 'テキストやJSONを確率・スコア・ラベルに変換する無料オンラインAI分類ツール。', section: '分類ツール', open: '分類ツールを開く', docs: '英語ドキュメント', useCases: '活用例', examples: '例', faq: 'よくある質問', privacy: 'プライバシー', terms: '利用規約', source: 'ソースコード' },
  },
  ko: {
    seo: { title: 'JEV AI 모델: 대기열 없이 바로 쓰는 무료 AI 텍스트 분류기', description: 'JEV AI Model은 텍스트와 JSON을 확률, 점수, 라벨로 바꾸는 무료 온라인 AI 분류기입니다. API 키 없이 바로 사용해 보세요.', h1: 'JEV AI Model: 무료 온라인 AI 텍스트 분류기', imageAlt: 'JEV AI Model 무료 온라인 AI 텍스트 분류기' },
    header: { playground: '분류 도구', howItWorks: '사용 방법', share: '공유', copied: '복사됨', signIn: '로그인', signOut: '로그아웃', language: '언어' },
    hero: { eyebrow: '온라인 AI 텍스트 분류', lines: ['JEV AI Model:', '무료 온라인 AI 텍스트 분류기'], intro: '텍스트나 JSON을 붙여 넣고 답변 형식을 선택하면 신뢰도가 포함된 분류 결과를 받을 수 있습니다.' },
    examples: { prompt: '처음이신가요? 예제로 시작하세요', hint: '아래 컨텍스트와 질문이 자동으로 채워집니다', titles: { hotdog: '핫도그는 샌드위치일까요?', sky: '하늘은 무슨 색일까요?', support: '고객 문의 분류하기', resume: '이력서 평가하기' } },
    editor: { context: '컨텍스트', contextHint: '분류할 사실을 한 줄씩 입력', invalidJson: '잘못된 JSON', fieldView: '필드', fieldViewUnavailable: '필드 보기는 단순 JSON 객체가 필요합니다', fields: '필드', field: '필드', value: '값', noFacts: '아직 데이터가 없습니다. 필드를 추가하거나 예제를 선택하세요.', addField: '필드 추가', removeField: '필드 삭제', contextJson: '컨텍스트 JSON', fixJson: 'JSON을 수정하면 필드 보기로 돌아갈 수 있습니다.', nestedJson: '중첩된 컨텍스트는 JSON으로 표시됩니다. 단순 키/값 데이터는 필드 보기를 사용할 수 있습니다.', questions: '질문', questionsHint: '컨텍스트에서 판단할 내용', pickAnswer: '원하는 답변 형식을 선택하세요:', add: '추가', selectType: '질문 유형 선택', docs: 'Docs', questionType: '질문 유형', removeQuestion: '질문 삭제', instructions: '판단 내용', noulHelp: '질문이 아닌 문장으로 작성하세요. 참일 확률이 0부터 1 사이로 반환됩니다.', levels: '단계(낮음에서 높음)', lowest: '최저(예: 영향 없음)', highest: '최고(예: 완전 차단)', inBetween: '중간 단계', addLevel: '단계 추가', removeLevel: '단계 삭제', levelHelp: '이 척도의 숫자가 반환됩니다. 1.4는 1단계와 2단계 사이입니다.', options: '선택지', optionName: '선택지 이름', optionDescription: '이 선택지의 범위', addOption: '선택지 추가', removeOption: '선택지 삭제', optionHelp: '모델은 설명을 읽습니다. 각 선택지의 범위를 명확히 적어 주세요.', youGet: '결과' },
    primitives: { noul: { ask: '사실인가요?', answerShape: '확률 0.93', tagline: '0~1 확률', example: '이 메시지는 긴급함을 전달한다' }, score: { ask: '어느 정도인가요?', answerShape: '3단계 중 1.4', tagline: '순서가 있는 단계로 평가', example: '보고된 문제는 얼마나 심각한가?' }, choice: { ask: '어느 항목인가요?', answerShape: '기술 · 92%', tagline: '제시된 항목 중 선택', example: '어느 팀이 처리해야 하는가?' } },
    action: { authError: 'Google 로그인을 완료하지 못했습니다', tryAgain: '다시 시도해 주세요.', dismiss: '닫기', checking: '사용 가능 횟수 확인 중…', readyIn: '{seconds}초 후 사용 가능', userRemaining: '오늘 {count}/30회 남음', dailyDone: '오늘 30회를 모두 사용했습니다. 내일 다시 이용해 주세요.', guestRemaining: '무료 사용 {count}회 남음', signInContinue: '로그인하고 계속하기', unavailable: '사용량을 불러올 수 없음', clear: '초기화', asking: 'Jev 분류 중', dailyLimit: '일일 한도 도달', run: '분류하기', genericError: '분류 서비스에 연결하지 못했습니다.', wait: '{seconds}초 후 다시 실행해 주세요.' },
    output: { result: '분류 결과', answer: '개 답변', answers: '개 답변', likelyTrue: '참일 가능성이 높음', likelyFalse: '거짓일 가능성이 높음', unsure: '판단하기 어려움', no: '아니요', yes: '예', choice: '선택 결과', closest: '“{label}”에 가장 가까움', score: '점수', confidence: '신뢰도', low: '낮음', askingQuestions: 'Jev가 질문 {count}개를 처리 중…' },
    next: { title: '다음으로 시도하기', changeAndRun: '{field} 값을 바꾸고 다시 실행', seeMove: '결과 변화 확인', alsoAsk: '추가 질문: {question}' },
    login: { title: '로그인하고 계속하기', body: 'Google 계정으로 로그인하면 하루 30회까지 사용할 수 있습니다.', google: 'Google로 계속', disclosureBefore: '로그인을 위해 이름, 이메일, 프로필 사진만 저장합니다. 계속하면', terms: '이용약관', disclosureMiddle: '및', privacy: '개인정보 처리방침', close: '닫기' },
    features: [{ title: '구조화된 답변', body: '자유 형식 텍스트 대신 확률, 점수 또는 지정한 라벨을 받습니다.' }, { title: '신뢰도 포함', body: '모든 결과에 신뢰도가 포함되어 애매한 사례를 검토할 수 있습니다.' }, { title: '설정 필요 없음', body: '계정이나 API 키 없이 3회 무료로 사용하고 로그인 후 계속할 수 있습니다.' }],
    footer: { description: '텍스트와 JSON을 확률, 점수, 라벨로 바꾸는 무료 온라인 AI 텍스트 분류기입니다.', section: '분류 도구', open: '분류 도구 열기', docs: '영문 문서', useCases: '활용 사례', examples: '예제', faq: '자주 묻는 질문', privacy: '개인정보', terms: '이용약관', source: '소스 코드' },
  },
  fr: {
    seo: { title: 'JEV AI Model : classificateur IA gratuit sans attente', description: 'JEV AI Model est un classificateur de texte IA gratuit en ligne pour texte et JSON. Obtenez probabilités, scores, étiquettes et confiance sans clé API.', h1: 'JEV AI Model : classificateur de texte IA gratuit', imageAlt: 'Classificateur de texte IA gratuit JEV AI Model' },
    header: { playground: 'Classificateur', howItWorks: 'Fonctionnement', share: 'Partager', copied: 'Copié', signIn: 'Connexion', signOut: 'Déconnexion', language: 'Langue' },
    hero: { eyebrow: 'CLASSIFICATEUR DE TEXTE IA', lines: ['JEV AI Model :', 'classificateur de texte IA gratuit'], intro: 'Collez du texte ou du JSON, choisissez le format de réponse et obtenez une classification justifiée avec son niveau de confiance.' },
    examples: { prompt: 'Première visite ? Commencez par un exemple', hint: 'le contexte et la question seront remplis automatiquement', titles: { hotdog: 'Un hot-dog est-il un sandwich ?', sky: 'De quelle couleur est le ciel ?', support: 'Trier un message de support', resume: 'Évaluer un CV' } },
    editor: { context: 'Contexte', contextHint: 'les faits à classer, un par ligne', invalidJson: 'JSON invalide', fieldView: 'Champs', fieldViewUnavailable: 'La vue champs nécessite un objet JSON plat', fields: 'Champs', field: 'Champ', value: 'Valeur', noFacts: 'Aucune donnée. Ajoutez un champ ou choisissez un exemple.', addField: 'Ajouter un champ', removeField: 'Supprimer le champ', contextJson: 'JSON du contexte', fixJson: 'Corrigez le JSON pour revenir à la vue champs.', nestedJson: 'Ce contexte est imbriqué et reste en JSON. Les données clé/valeur simples peuvent utiliser la vue champs.', questions: 'Questions', questionsHint: 'ce que vous voulez déterminer', pickAnswer: 'Choisissez le type de réponse :', add: 'Ajouter', selectType: 'Choisir le type de question', docs: 'Docs', questionType: 'Type de question', removeQuestion: 'Supprimer la question', instructions: 'Instruction', noulHelp: 'Écrivez une affirmation. Vous recevrez sa probabilité d’être vraie, de 0 à 1.', levels: 'Niveaux, du plus bas au plus haut', lowest: 'Minimum, ex. aucun impact', highest: 'Maximum, ex. bloquant', inBetween: 'Niveau intermédiaire', addLevel: 'Ajouter un niveau', removeLevel: 'Supprimer le niveau', levelHelp: 'Le résultat est un nombre sur cette échelle ; 1,4 se situe entre 1 et 2.', options: 'Options', optionName: 'Nom de l’option', optionDescription: 'Ce que couvre cette option', addOption: 'Ajouter une option', removeOption: 'Supprimer l’option', optionHelp: 'Le modèle lit la description ; précisez ce que couvre chaque option.', youGet: 'Résultat' },
    primitives: { noul: { ask: 'Est-ce vrai ?', answerShape: '0,93 probable', tagline: 'Probabilité de 0 à 1', example: 'Le message exprime une urgence' }, score: { ask: 'À quel niveau ?', answerShape: '1,4 sur 3 niveaux', tagline: 'Évaluer sur des niveaux ordonnés', example: 'Quelle est la gravité du problème ?' }, choice: { ask: 'Laquelle ?', answerShape: 'technique · 92 %', tagline: 'Choisir une option fournie', example: 'Quelle équipe doit traiter ce cas ?' } },
    action: { authError: 'Connexion Google impossible', tryAgain: 'Veuillez réessayer.', dismiss: 'Fermer', checking: 'Vérification du quota…', readyIn: 'Disponible dans {seconds} s', userRemaining: '{count} utilisations sur 30 restantes aujourd’hui', dailyDone: 'Les 30 utilisations du jour sont épuisées. Revenez demain.', guestRemaining: '{count} essais gratuits restants', signInContinue: 'Se connecter pour continuer', unavailable: 'Quota indisponible', clear: 'Effacer', asking: 'Jev classe le contenu', dailyLimit: 'Limite quotidienne atteinte', run: 'Classer', genericError: 'Impossible de joindre le classificateur.', wait: 'Attendez {seconds} secondes avant de relancer.' },
    output: { result: 'Résultat', answer: 'réponse', answers: 'réponses', likelyTrue: 'probablement vrai', likelyFalse: 'probablement faux', unsure: 'incertain', no: 'Non', yes: 'Oui', choice: 'Choix', closest: 'Plus proche de « {label} »', score: 'Score', confidence: 'Confiance', low: 'faible', askingQuestions: 'Jev traite {count} questions…' },
    next: { title: 'À essayer ensuite', changeAndRun: 'Modifiez {field} puis relancez', seeMove: 'observer le changement', alsoAsk: 'Demandez aussi : {question}' },
    login: { title: 'Connectez-vous pour continuer', body: 'Connectez-vous avec Google pour obtenir 30 utilisations par jour.', google: 'Continuer avec Google', disclosureBefore: 'Nous conservons uniquement votre nom, e-mail et avatar pour la connexion. En continuant, vous acceptez les', terms: 'Conditions', disclosureMiddle: 'et reconnaissez notre', privacy: 'Politique de confidentialité', close: 'Fermer' },
    features: [{ title: 'Réponses structurées', body: 'Obtenez une probabilité, un score ou une étiquette au lieu d’un texte libre.' }, { title: 'Confiance incluse', body: 'Chaque résultat indique sa confiance afin de faire vérifier les cas incertains.' }, { title: 'Sans configuration', body: 'Essayez 3 classifications sans compte ni clé API, puis connectez-vous.' }],
    footer: { description: 'Classificateur de texte IA gratuit pour transformer texte et JSON en probabilités, scores et étiquettes.', section: 'CLASSIFICATEUR', open: 'Ouvrir le classificateur', docs: 'Documentation en anglais', useCases: 'Cas d’usage', examples: 'Exemples', faq: 'FAQ', privacy: 'Confidentialité', terms: 'Conditions', source: 'Code source' },
  },
  de: {
    seo: { title: 'JEV AI Model: Kostenloser KI-Klassifikator ohne Warteliste', description: 'JEV AI Model ist ein kostenloser Online-KI-Textklassifikator für Text und JSON. Erhalte Wahrscheinlichkeiten, Bewertungen und Labels ohne API-Schlüssel.', h1: 'JEV AI Model: kostenloser KI-Textklassifikator', imageAlt: 'Kostenloser KI-Textklassifikator von JEV AI Model' },
    header: { playground: 'Klassifikator', howItWorks: 'So funktioniert es', share: 'Teilen', copied: 'Kopiert', signIn: 'Anmelden', signOut: 'Abmelden', language: 'Sprache' },
    hero: { eyebrow: 'ONLINE KI-TEXTKLASSIFIKATOR', lines: ['JEV AI Model:', 'kostenloser KI-Textklassifikator'], intro: 'Text oder JSON einfügen, Antwortformat wählen und eine nachvollziehbare Klassifikation mit Konfidenz erhalten.' },
    examples: { prompt: 'Neu hier? Starte mit einem Beispiel', hint: 'Kontext und Frage werden automatisch ausgefüllt', titles: { hotdog: 'Ist ein Hotdog ein Sandwich?', sky: 'Welche Farbe hat der Himmel?', support: 'Supportanfrage einordnen', resume: 'Lebenslauf bewerten' } },
    editor: { context: 'Kontext', contextHint: 'die zu klassifizierenden Fakten', invalidJson: 'ungültiges JSON', fieldView: 'Felder', fieldViewUnavailable: 'Die Feldansicht benötigt ein flaches JSON-Objekt', fields: 'Felder', field: 'Feld', value: 'Wert', noFacts: 'Noch keine Daten. Füge ein Feld hinzu oder wähle ein Beispiel.', addField: 'Feld hinzufügen', removeField: 'Feld entfernen', contextJson: 'Kontext-JSON', fixJson: 'Korrigiere das JSON, um zur Feldansicht zurückzukehren.', nestedJson: 'Dieser Kontext ist verschachtelt und bleibt in der JSON-Ansicht. Flache Schlüssel/Werte können die Feldansicht nutzen.', questions: 'Fragen', questionsHint: 'was du über den Kontext wissen möchtest', pickAnswer: 'Wähle das gewünschte Antwortformat:', add: 'Hinzufügen', selectType: 'Fragetyp auswählen', docs: 'Docs', questionType: 'Fragetyp', removeQuestion: 'Frage entfernen', instructions: 'Anweisung', noulHelp: 'Formuliere eine Aussage. Du erhältst die Wahrscheinlichkeit, dass sie wahr ist, von 0 bis 1.', levels: 'Stufen, niedrig bis hoch', lowest: 'Niedrigste, z. B. keine Auswirkung', highest: 'Höchste, z. B. blockierend', inBetween: 'Dazwischen', addLevel: 'Stufe hinzufügen', removeLevel: 'Stufe entfernen', levelHelp: 'Du erhältst eine Zahl auf dieser Skala; 1,4 liegt zwischen Stufe 1 und 2.', options: 'Optionen', optionName: 'Name der Option', optionDescription: 'Was diese Option umfasst', addOption: 'Option hinzufügen', removeOption: 'Option entfernen', optionHelp: 'Das Modell liest die Beschreibung. Erkläre klar, was jede Option umfasst.', youGet: 'Ergebnis' },
    primitives: { noul: { ask: 'Ist es wahr?', answerShape: '0,93 wahrscheinlich', tagline: 'Wahrscheinlichkeit von 0 bis 1', example: 'Die Nachricht vermittelt Dringlichkeit' }, score: { ask: 'Wie stark?', answerShape: '1,4 von 3 Stufen', tagline: 'Mit geordneten Stufen bewerten', example: 'Wie schwerwiegend ist das Problem?' }, choice: { ask: 'Welche Option?', answerShape: 'Technik · 92 %', tagline: 'Eine Vorgabe auswählen', example: 'Welches Team soll den Fall bearbeiten?' } },
    action: { authError: 'Google-Anmeldung konnte nicht abgeschlossen werden', tryAgain: 'Bitte erneut versuchen.', dismiss: 'Schließen', checking: 'Kontingent wird geprüft…', readyIn: 'Bereit in {seconds} s', userRemaining: 'Heute noch {count} von 30 Läufen', dailyDone: 'Alle 30 Läufe für heute sind verbraucht. Komm morgen wieder.', guestRemaining: '{count} kostenlose Läufe übrig', signInContinue: 'Anmelden und fortfahren', unavailable: 'Kontingent nicht verfügbar', clear: 'Leeren', asking: 'Jev klassifiziert', dailyLimit: 'Tageslimit erreicht', run: 'Klassifizieren', genericError: 'Der Klassifikator ist nicht erreichbar.', wait: 'Bitte {seconds} Sekunden bis zum nächsten Lauf warten.' },
    output: { result: 'Ergebnis', answer: 'Antwort', answers: 'Antworten', likelyTrue: 'wahrscheinlich wahr', likelyFalse: 'wahrscheinlich falsch', unsure: 'unklar', no: 'Nein', yes: 'Ja', choice: 'Auswahl', closest: 'Am nächsten bei „{label}“', score: 'Bewertung', confidence: 'Konfidenz', low: 'niedrig', askingQuestions: 'Jev verarbeitet {count} Fragen…' },
    next: { title: 'Als Nächstes', changeAndRun: '{field} ändern und erneut ausführen', seeMove: 'Veränderung ansehen', alsoAsk: 'Zusätzlich fragen: {question}' },
    login: { title: 'Anmelden und fortfahren', body: 'Mit Google anmelden und täglich 30 Läufe im Klassifikator erhalten.', google: 'Mit Google fortfahren', disclosureBefore: 'Wir speichern nur Name, E-Mail und Profilbild für die Anmeldung. Mit dem Fortfahren akzeptierst du die', terms: 'Nutzungsbedingungen', disclosureMiddle: 'und bestätigst die', privacy: 'Datenschutzerklärung', close: 'Schließen' },
    features: [{ title: 'Strukturierte Antworten', body: 'Erhalte Wahrscheinlichkeit, Bewertung oder Label statt freien Text.' }, { title: 'Konfidenz inklusive', body: 'Jedes Ergebnis enthält eine Konfidenz, damit unsichere Fälle geprüft werden können.' }, { title: 'Ohne Einrichtung', body: 'Teste 3 Klassifikationen ohne Konto oder API-Schlüssel und melde dich danach an.' }],
    footer: { description: 'Kostenloser Online-KI-Textklassifikator für Wahrscheinlichkeiten, Bewertungen und Labels aus Text und JSON.', section: 'KLASSIFIKATOR', open: 'Klassifikator öffnen', docs: 'Englische Dokumentation', useCases: 'Anwendungsfälle', examples: 'Beispiele', faq: 'FAQ', privacy: 'Datenschutz', terms: 'Bedingungen', source: 'Quellcode' },
  },
  'pt-BR': {
    seo: { title: 'JEV AI Model: classificador de texto com IA grátis sem fila', description: 'JEV AI Model é um classificador de texto com IA grátis e online para texto e JSON. Receba probabilidades, notas, rótulos e confiança sem chave de API.', h1: 'JEV AI Model: classificador de texto com IA grátis', imageAlt: 'Classificador de texto com IA grátis do JEV AI Model' },
    header: { playground: 'Classificador', howItWorks: 'Como funciona', share: 'Compartilhar', copied: 'Copiado', signIn: 'Entrar', signOut: 'Sair', language: 'Idioma' },
    hero: { eyebrow: 'CLASSIFICADOR DE TEXTO COM IA', lines: ['JEV AI Model:', 'classificador de texto com IA grátis'], intro: 'Cole texto ou JSON, escolha o formato da resposta e receba uma classificação fundamentada com nível de confiança.' },
    examples: { prompt: 'Primeira vez? Comece com um exemplo', hint: 'o contexto e a pergunta serão preenchidos abaixo', titles: { hotdog: 'Cachorro-quente é sanduíche?', sky: 'Qual é a cor do céu?', support: 'Classificar uma mensagem de suporte', resume: 'Avaliar um currículo' } },
    editor: { context: 'Contexto', contextHint: 'os fatos que serão classificados', invalidJson: 'JSON inválido', fieldView: 'Campos', fieldViewUnavailable: 'A visualização por campos exige um objeto JSON simples', fields: 'Campos', field: 'Campo', value: 'Valor', noFacts: 'Ainda não há dados. Adicione um campo ou escolha um exemplo.', addField: 'Adicionar campo', removeField: 'Remover campo', contextJson: 'JSON do contexto', fixJson: 'Corrija o JSON para voltar à visualização por campos.', nestedJson: 'Este contexto é aninhado e permanece em JSON. Dados simples de chave e valor podem usar campos.', questions: 'Perguntas', questionsHint: 'o que você quer descobrir', pickAnswer: 'Escolha o tipo de resposta:', add: 'Adicionar', selectType: 'Selecionar tipo de pergunta', docs: 'Docs', questionType: 'Tipo de pergunta', removeQuestion: 'Remover pergunta', instructions: 'Instrução', noulHelp: 'Escreva uma afirmação. Você receberá a probabilidade de ela ser verdadeira, de 0 a 1.', levels: 'Níveis, do menor ao maior', lowest: 'Mínimo, ex.: sem impacto', highest: 'Máximo, ex.: bloqueante', inBetween: 'Nível intermediário', addLevel: 'Adicionar nível', removeLevel: 'Remover nível', levelHelp: 'Você recebe um número nesta escala; 1,4 fica entre os níveis 1 e 2.', options: 'Opções', optionName: 'Nome da opção', optionDescription: 'O que esta opção cobre', addOption: 'Adicionar opção', removeOption: 'Remover opção', optionHelp: 'O modelo lê a descrição; explique claramente o que cada opção cobre.', youGet: 'Resultado' },
    primitives: { noul: { ask: 'É verdade?', answerShape: '0,93 provável', tagline: 'Probabilidade de 0 a 1', example: 'A mensagem transmite urgência' }, score: { ask: 'Em que nível?', answerShape: '1,4 de 3 níveis', tagline: 'Avaliar em níveis ordenados', example: 'Qual é a gravidade do problema?' }, choice: { ask: 'Qual opção?', answerShape: 'técnico · 92%', tagline: 'Escolher uma opção definida', example: 'Qual equipe deve atender este caso?' } },
    action: { authError: 'Não foi possível concluir o login com Google', tryAgain: 'Tente novamente.', dismiss: 'Fechar', checking: 'Verificando limite…', readyIn: 'Disponível em {seconds}s', userRemaining: 'Restam {count} de 30 usos hoje', dailyDone: 'Você usou as 30 classificações de hoje. Volte amanhã.', guestRemaining: 'Restam {count} usos grátis', signInContinue: 'Entre para continuar', unavailable: 'Limite indisponível', clear: 'Limpar', asking: 'Jev está classificando', dailyLimit: 'Limite diário atingido', run: 'Classificar', genericError: 'Não foi possível acessar o classificador.', wait: 'Aguarde {seconds} segundos antes de executar novamente.' },
    output: { result: 'Resultado', answer: 'resposta', answers: 'respostas', likelyTrue: 'provavelmente verdadeiro', likelyFalse: 'provavelmente falso', unsure: 'incerto', no: 'Não', yes: 'Sim', choice: 'Escolha', closest: 'Mais próximo de “{label}”', score: 'Nota', confidence: 'Confiança', low: 'baixa', askingQuestions: 'Jev está processando {count} perguntas…' },
    next: { title: 'Tente agora', changeAndRun: 'Altere {field} e execute novamente', seeMove: 'veja a resposta mudar', alsoAsk: 'Pergunte também: {question}' },
    login: { title: 'Entre para continuar', body: 'Entre com sua conta Google para ter 30 usos por dia.', google: 'Continuar com Google', disclosureBefore: 'Guardamos apenas nome, e-mail e foto para login. Ao continuar, você aceita os', terms: 'Termos', disclosureMiddle: 'e reconhece a', privacy: 'Política de Privacidade', close: 'Fechar' },
    features: [{ title: 'Respostas estruturadas', body: 'Receba probabilidade, nota ou rótulo em vez de texto livre.' }, { title: 'Confiança incluída', body: 'Cada resultado informa a confiança para encaminhar casos incertos à revisão.' }, { title: 'Sem configuração', body: 'Teste 3 classificações sem conta ou chave de API e depois faça login.' }],
    footer: { description: 'Classificador de texto com IA gratuito para transformar texto e JSON em probabilidades, notas e rótulos.', section: 'CLASSIFICADOR', open: 'Abrir o classificador', docs: 'Documentação em inglês', useCases: 'Casos de uso', examples: 'Exemplos', faq: 'Perguntas frequentes', privacy: 'Privacidade', terms: 'Termos', source: 'Código-fonte' },
  },
}
