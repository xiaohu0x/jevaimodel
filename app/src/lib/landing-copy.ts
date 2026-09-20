import type { Locale } from '@/lib/locale'

interface TextItem {
  title: string
  body: string
}

export interface LandingCopy {
  intro: { title: string; paragraphs: readonly string[] }
  how: { title: string; intro: string; steps: readonly TextItem[] }
  types: { title: string; items: readonly TextItem[] }
  uses: { title: string; intro: string; items: readonly TextItem[] }
  faq: { title: string; items: readonly { q: string; a: string }[] }
}

export const LANDING_COPY: Record<Locale, LandingCopy> = {
  en: {
    intro: {
      title: 'What is an AI text classifier?',
      paragraphs: [
        'An AI text classifier turns unstructured language into a predictable category, score, or probability. JEV AI Model is a free online app for classifying plain text and JSON in your browser. Use it with support messages, résumés, survey answers, prompts, product listings, feedback, or any other record that needs the same decision applied consistently.',
        'A classifier differs from a general chatbot because you choose the shape of the answer before you run it. Instead of requesting a paragraph and then extracting its meaning, you ask for a probability, an ordered rating, or one label from a controlled list. The result is easier to store, compare, filter, audit, and pass to another step in a workflow.',
        'That structure does not remove uncertainty. It makes uncertainty visible. JEV AI Model returns the relevant probabilities and, where the answer type supports it, a confidence value. You can automate clear cases, review ambiguous ones, and revise the context or label definitions when results are not distinct enough. Treat every classification as model output that should be verified before a consequential decision.',
      ],
    },
    how: {
      title: 'How to classify text with AI online',
      intro: 'JEV AI Model keeps online text classification to three repeatable steps. You can begin with one of the examples in the playground or build a classification from an empty state.',
      steps: [
        { title: 'Add the context', body: 'Paste the text you want to classify or describe the relevant facts as JSON. Include the evidence needed for the decision, but leave out unrelated detail that could distract from it. Stable field names make it easier to reuse the same question across many records. Do not include confidential or regulated information you are not authorized to process.' },
        { title: 'Choose an answer type', body: 'Select Noul when the answer is a likelihood, Score when it belongs on an ordered scale, or Choice when it must be one of several named labels. Write one focused instruction and define levels or options so they are specific, distinct, and collectively useful. Clear boundaries produce results that are easier to interpret than vague or overlapping categories.' },
        { title: 'Run and review the classification', body: 'Run the request to receive the structured answer and supporting probabilities. Compare the winning answer with the alternatives instead of reading the label alone. A narrow margin signals ambiguity, while a strong distribution can support a higher-confidence next step. Adjust the source facts, instruction, or label definitions and run again when the model lacks enough evidence.' },
      ],
    },
    types: {
      title: 'Three AI classification output types',
      items: [
        { title: 'Noul - probability', body: 'Use Noul for a statement that can be more or less likely to be true. It returns a number from 0 to 1: values near 1 support the statement, values near 0 oppose it, and values near 0.5 show meaningful uncertainty. Examples include whether a support message is urgent, a review expresses satisfaction, or a prompt attempts to bypass a policy.' },
        { title: 'Score - ordered rating', body: 'Use Score when possible answers have a natural order. Define at least two levels such as no impact, minor, major, and blocking. The result can fall between levels, so a value such as 1.4 preserves more information than forcing the record into level 1 or 2. The probability distribution also shows which neighboring levels competed for the answer.' },
        { title: 'Choice - category label', body: 'Use Choice when the answer must come from a set of named options without an inherent order. Give every option a short description of what it includes and, when useful, what it excludes. The classifier returns the selected label, confidence, and probability assigned to each option. That full distribution helps reveal overlapping labels and borderline cases that need review.' },
      ],
    },
    uses: {
      title: 'Popular AI text classification use cases',
      intro: 'A free online AI classifier is most useful when many records need the same well-defined judgment. Start with a small representative sample, inspect uncertain outputs, and refine the question before applying the workflow more broadly.',
      items: [
        { title: 'Support ticket classification', body: 'Classify issue type, detect urgency, estimate sentiment, or route a message to billing, account, and technical teams. Include the customer message and the routing definitions in the context. Review tickets with similar top probabilities instead of automatically sending a genuinely ambiguous case to the wrong queue.' },
        { title: 'Résumé screening', body: 'Compare evidence in a résumé with explicit job requirements and rate relevance on a defined scale. Keep the criteria job-related, test them for inconsistent outcomes, and send uncertain applications to a person. AI classification should support a documented review process, not make an unreviewed employment decision.' },
        { title: 'Content moderation', body: 'Map posts, listings, comments, or prompts to the policy categories you define. Add the relevant policy text to the context and keep enforcement separate from classification, especially when nuance matters. The probability distribution can identify edge cases for human review and show when two policy labels overlap.' },
        { title: 'Survey coding and data labeling', body: 'Turn open-text responses, feedback, and raw records into consistent themes for analysis. Define the taxonomy before classifying, include an other or unclear option when appropriate, and audit a sample of every label. Reusable questions make it easier to compare results across batches without rewriting a prompt for each record.' },
      ],
    },
    faq: {
      title: 'AI text classifier FAQ',
      items: [
        { q: 'Is JEV AI Model free to use online?', a: 'Yes. You can run three classifications in the browser without creating an account. After that, sign in with Google for up to 30 playground runs per day. The current web experience is designed for interactive evaluation and small classification tasks, so you can test a workflow before deciding how it should fit into a larger process.' },
        { q: 'Can I classify JSON as well as plain text?', a: 'Yes. Paste normal text or provide a JSON object containing the facts the model should evaluate. JSON is useful when records share fields such as message, category, account tier, or policy. Keep the structure consistent across records and include human-readable values; field names alone should not have to carry the meaning of the task.' },
        { q: 'What can the AI text classifier return?', a: 'It can return the probability that a statement is true, a numeric score across ordered levels, or one category from options you define. Score and Choice results also expose their probability distribution, which helps you compare the selected answer with nearby alternatives rather than treating every winning label as equally certain.' },
        { q: 'Do I need an account or API key?', a: 'You do not need an account for the first three runs, and you never need to supply your own API key. The classifier runs through the browser playground. A Google sign-in raises the daily playground allowance to 30 runs; it is used for access and usage limits rather than changing the classification format.' },
        { q: 'How should I evaluate confidence and accuracy?', a: 'Test the classifier on representative examples for which you already know the desired outcome. Inspect incorrect results, close probability distributions, and differences across important subgroups. Set a review threshold based on the cost of an error, not a universal number. Low-confidence results should usually go to a person, and consequential decisions should always receive appropriate independent review.' },
      ],
    },
  },
  'zh-CN': {
    intro: {
      title: '什么是 AI 文本分类器？',
      paragraphs: [
        'AI 文本分类器会读取你提供的上下文，并返回明确的分类标签、评分或概率。JEV AI Model 同时支持普通文本和 JSON，可在线处理客服消息、简历、问卷回答、用户提示词、商品信息等内容。',
        '与聊天机器人不同，你在发送请求前就确定结果格式，因此输出更适合保存、对比、审核和接入业务流程。每个结果都基于你提供的事实，并附带置信度，便于把不确定的内容交给人工复核。',
      ],
    },
    how: {
      title: '如何在线使用 AI 进行文本分类',
      intro: '无论处理哪种内容，只需三个步骤即可获得结构化分类结果。',
      steps: [
        { title: '添加上下文', body: '粘贴文本，或用 JSON 描述需要判断的事实。模型只会使用你提供的信息。' },
        { title: '选择结果类型', body: '用 Noul 判断概率，用 Score 按等级评分，或用 Choice 从自定义标签中选择。' },
        { title: '运行分类', body: '立即获得结构化结果、置信度和概率分布，可直接用于后续工作流。' },
      ],
    },
    types: {
      title: '三种 AI 分类结果类型',
      items: [
        { title: 'Noul：真假概率', body: '判断一条陈述为真的概率，返回 0 到 1 的数值；接近 0.5 表示模型确实不确定。' },
        { title: 'Score：等级评分', body: '按照你定义的有序等级进行评分，例如低、中、高严重程度。' },
        { title: 'Choice：分类标签', body: '从你给出的标签中选择最符合的一项，同时返回所有选项的概率。' },
      ],
    },
    uses: {
      title: '常见的 AI 文本分类使用场景',
      intro: '当同一个判断需要重复处理大量记录时，结构化分类比生成长篇文本更实用。',
      items: [
        { title: '客服工单分类', body: '识别紧急程度、自动分配团队，并判断客户情绪。' },
        { title: '简历筛选', body: '根据职位要求评估候选人，并把不确定的申请交给人工查看。' },
        { title: '内容审核', body: '使用自己的规则对帖子、商品、评论和提示词进行分类。' },
        { title: '问卷编码与数据标注', body: '把开放式回答和原始记录转换成一致的标签，方便统计分析。' },
      ],
    },
    faq: {
      title: 'AI 文本分类器常见问题',
      items: [
        { q: '这个 AI 文本分类器免费吗？', a: '可以免费使用。无需账号可运行 3 次，使用 Google 登录后每天可运行 30 次。' },
        { q: '除了文本，还能分类 JSON 吗？', a: '可以。你可以粘贴普通文本，也可以用 JSON 对象提供需要模型判断的事实。' },
        { q: '分类器可以返回什么结果？', a: '它可以返回真假概率、按自定义等级计算的评分，或从给定选项中选择一个分类标签。' },
        { q: '使用时需要 API Key 吗？', a: '不需要。网页中的在线分类工具可以直接使用，无需提供自己的 API Key。' },
        { q: '置信度应该怎么用？', a: '你可以设置自动处理阈值，把低于阈值的结果交给人工复核。' },
      ],
    },
  },
  es: {
    intro: {
      title: '¿Qué es un clasificador de texto con IA?',
      paragraphs: [
        'Un clasificador de texto con IA analiza el contexto que proporcionas y devuelve una categoría, una puntuación o una probabilidad predecible. JEV AI Model admite texto y JSON para clasificar mensajes de soporte, currículums, encuestas, prompts, fichas de producto y otros registros desde el navegador.',
        'A diferencia de un chatbot, eliges la forma de la respuesta antes de ejecutar el modelo. Así puedes guardar, comparar y auditar los resultados, además de enviar los casos con baja confianza a una revisión humana.',
      ],
    },
    how: {
      title: 'Cómo clasificar texto con IA online',
      intro: 'El clasificador gratuito utiliza el mismo flujo de tres pasos para cualquier tarea.',
      steps: [
        { title: 'Añade el contexto', body: 'Pega el texto o describe los hechos relevantes en JSON. El modelo solo usa la información que proporcionas.' },
        { title: 'Elige el tipo de respuesta', body: 'Usa Noul para una probabilidad, Score para una escala ordenada o Choice para seleccionar una etiqueta.' },
        { title: 'Ejecuta la clasificación', body: 'Recibe una respuesta estructurada, su confianza y la distribución de probabilidades.' },
      ],
    },
    types: {
      title: 'Tres tipos de clasificación con IA',
      items: [
        { title: 'Noul — probabilidad', body: 'Evalúa si una afirmación es cierta y devuelve un valor de 0 a 1. Un valor cercano a 0,5 indica incertidumbre real.' },
        { title: 'Score — puntuación ordenada', body: 'Valora el contexto con niveles definidos por ti, como gravedad baja, media o alta.' },
        { title: 'Choice — etiqueta de categoría', body: 'Elige la mejor etiqueta entre tus opciones y muestra la probabilidad de cada una.' },
      ],
    },
    uses: {
      title: 'Usos habituales de la clasificación de texto con IA',
      intro: 'Aplica la misma pregunta a muchos registros cuando necesitas una decisión repetible en lugar de texto generado.',
      items: [
        { title: 'Clasificación de tickets', body: 'Detecta urgencia, asigna el equipo correcto y puntúa el sentimiento del cliente.' },
        { title: 'Selección de currículums', body: 'Compara la experiencia con los requisitos del puesto y revisa manualmente los casos dudosos.' },
        { title: 'Moderación de contenido', body: 'Aplica tus categorías de política a publicaciones, anuncios, comentarios y prompts.' },
        { title: 'Codificación de encuestas', body: 'Convierte respuestas abiertas y datos sin procesar en etiquetas consistentes.' },
      ],
    },
    faq: {
      title: 'Preguntas frecuentes sobre el clasificador de texto IA',
      items: [
        { q: '¿El clasificador de texto con IA es gratis?', a: 'Sí. Puedes hacer 3 clasificaciones sin cuenta y 30 al día después de iniciar sesión con Google.' },
        { q: '¿Puedo clasificar JSON además de texto?', a: 'Sí. Pega texto normal o proporciona un objeto JSON con los hechos que debe evaluar el modelo.' },
        { q: '¿Qué resultados puede devolver?', a: 'Una probabilidad, una puntuación sobre niveles ordenados o una categoría entre las opciones que definas.' },
        { q: '¿Necesito una clave API?', a: 'No. El clasificador online funciona directamente en el navegador sin tu propia clave API.' },
        { q: '¿Cómo uso la confianza?', a: 'Define un umbral para automatizar y envía los resultados con menor confianza a una persona.' },
      ],
    },
  },
  ja: {
    intro: {
      title: 'AIテキスト分類ツールとは？',
      paragraphs: [
        'AIテキスト分類ツールは、入力したコンテキストを読み取り、カテゴリ・スコア・確率として結果を返します。JEV AI Modelは文章とJSONに対応し、問い合わせ、履歴書、アンケート回答、プロンプト、商品情報などをブラウザ上で分類できます。',
        'チャットボットとは異なり、実行前に回答形式を決めるため、結果の保存・比較・監査が簡単です。すべての結果に確信度が付き、判断が難しいケースだけを人が確認できます。',
      ],
    },
    how: {
      title: 'AIでテキストをオンライン分類する方法',
      intro: '無料の分類ツールは、どのタスクでも同じ3つの手順で使えます。',
      steps: [
        { title: 'コンテキストを入力', body: '文章を貼り付けるか、必要な事実をJSONで記述します。モデルは入力された情報だけを使います。' },
        { title: '回答形式を選択', body: '確率はNoul、段階評価はScore、候補からの分類はChoiceを選びます。' },
        { title: '分類を実行', body: '構造化された回答、確信度、確率分布をすぐに取得できます。' },
      ],
    },
    types: {
      title: '3種類のAI分類結果',
      items: [
        { title: 'Noul — 確率', body: '文が真である確率を0〜1で返します。0.5に近い値は、本当に判断が難しいことを示します。' },
        { title: 'Score — 段階評価', body: '低・中・高など、自分で定義した順序付きレベルに沿って評価します。' },
        { title: 'Choice — カテゴリ', body: '指定した候補から最適なラベルを選び、全候補の確率を返します。' },
      ],
    },
    uses: {
      title: 'AIテキスト分類の主な活用例',
      intro: '多くのデータに同じ判断を繰り返す場合、自由文よりも構造化された分類が役立ちます。',
      items: [
        { title: '問い合わせ分類', body: '緊急度を検出し、適切な担当チームへの振り分けや感情分析を行います。' },
        { title: '履歴書スクリーニング', body: '候補者の経験と求人条件を比較し、判断が難しい応募を人が確認します。' },
        { title: 'コンテンツモデレーション', body: '投稿、商品、コメント、プロンプトを独自のポリシーで分類します。' },
        { title: 'アンケート分類とデータラベル', body: '自由回答や未整理のデータを一貫したカテゴリに変換します。' },
      ],
    },
    faq: {
      title: 'AIテキスト分類ツールのよくある質問',
      items: [
        { q: 'このAIテキスト分類ツールは無料ですか？', a: 'はい。アカウントなしで3回、Googleログイン後は1日30回まで利用できます。' },
        { q: '文章だけでなくJSONも分類できますか？', a: 'はい。通常の文章または、モデルが評価する事実を含むJSONオブジェクトを入力できます。' },
        { q: 'どのような結果を返せますか？', a: '確率、順序付きレベルのスコア、または指定した候補から1つのカテゴリを返せます。' },
        { q: 'APIキーは必要ですか？', a: 'いいえ。ブラウザ上の分類ツールは、自分のAPIキーなしで直接利用できます。' },
        { q: '確信度はどう使いますか？', a: '自動処理のしきい値を設定し、確信度が低い結果だけを人が確認できます。' },
      ],
    },
  },
  ko: {
    intro: {
      title: 'AI 텍스트 분류기란 무엇인가요?',
      paragraphs: [
        'AI 텍스트 분류기는 입력한 컨텍스트를 읽고 카테고리, 점수 또는 확률로 결과를 반환합니다. JEV AI Model은 일반 텍스트와 JSON을 지원하므로 고객 문의, 이력서, 설문 답변, 프롬프트, 상품 정보 등을 브라우저에서 바로 분류할 수 있습니다.',
        '챗봇과 달리 실행 전에 답변 형식을 정하므로 결과를 저장하고 비교하고 검토하기 쉽습니다. 모든 결과에는 신뢰도가 포함되어 애매한 사례만 사람에게 전달할 수 있습니다.',
      ],
    },
    how: {
      title: 'AI로 텍스트를 온라인 분류하는 방법',
      intro: '무료 분류기는 어떤 작업이든 동일한 세 단계로 사용할 수 있습니다.',
      steps: [
        { title: '컨텍스트 입력', body: '텍스트를 붙여 넣거나 관련 사실을 JSON으로 작성합니다. 모델은 제공된 정보만 사용합니다.' },
        { title: '답변 유형 선택', body: '확률은 Noul, 순서형 점수는 Score, 지정한 라벨 선택은 Choice를 사용합니다.' },
        { title: '분류 실행', body: '구조화된 답변과 신뢰도, 전체 확률 분포를 즉시 확인할 수 있습니다.' },
      ],
    },
    types: {
      title: '세 가지 AI 분류 결과',
      items: [
        { title: 'Noul — 확률', body: '문장이 참일 확률을 0부터 1 사이로 반환합니다. 0.5에 가까우면 실제로 불확실하다는 뜻입니다.' },
        { title: 'Score — 순서형 점수', body: '낮음, 보통, 높음처럼 직접 정의한 순서형 단계에 따라 평가합니다.' },
        { title: 'Choice — 카테고리 라벨', body: '제공한 라벨 중 가장 적합한 항목을 선택하고 모든 항목의 확률을 보여 줍니다.' },
      ],
    },
    uses: {
      title: 'AI 텍스트 분류 활용 사례',
      intro: '많은 레코드에 같은 판단을 반복해야 할 때 생성형 문장보다 구조화된 분류가 유용합니다.',
      items: [
        { title: '고객 문의 분류', body: '긴급도를 감지하고 적절한 팀으로 배정하며 고객 감정을 평가합니다.' },
        { title: '이력서 검토', body: '지원자의 경험과 채용 요건을 비교하고 애매한 지원서를 사람이 검토합니다.' },
        { title: '콘텐츠 검토', body: '게시물, 상품, 댓글, 프롬프트에 자체 정책 카테고리를 적용합니다.' },
        { title: '설문 코딩과 데이터 라벨링', body: '주관식 답변과 원시 데이터를 일관된 라벨로 변환합니다.' },
      ],
    },
    faq: {
      title: 'AI 텍스트 분류기 자주 묻는 질문',
      items: [
        { q: 'AI 텍스트 분류기를 무료로 사용할 수 있나요?', a: '네. 계정 없이 3회, Google 로그인 후 하루 30회까지 사용할 수 있습니다.' },
        { q: '텍스트뿐 아니라 JSON도 분류할 수 있나요?', a: '네. 일반 텍스트 또는 모델이 평가할 사실이 담긴 JSON 객체를 입력할 수 있습니다.' },
        { q: '어떤 결과를 반환하나요?', a: '확률, 순서형 단계의 점수 또는 직접 정의한 선택지 중 하나의 카테고리를 반환합니다.' },
        { q: 'API 키가 필요한가요?', a: '아니요. 브라우저 분류기는 별도의 API 키 없이 바로 사용할 수 있습니다.' },
        { q: '신뢰도는 어떻게 사용하나요?', a: '자동 처리 기준을 정하고 기준보다 신뢰도가 낮은 결과만 사람이 검토하도록 설정할 수 있습니다.' },
      ],
    },
  },
  fr: {
    intro: {
      title: 'Qu’est-ce qu’un classificateur de texte IA ?',
      paragraphs: [
        'Un classificateur de texte IA analyse le contexte fourni et renvoie une catégorie, un score ou une probabilité prévisible. JEV AI Model accepte le texte et le JSON pour classer des tickets de support, CV, réponses d’enquête, prompts, fiches produit et autres données dans le navigateur.',
        'Contrairement à un chatbot, la forme de la réponse est définie avant l’exécution. Les résultats sont donc faciles à stocker, comparer et auditer. Chaque réponse inclut un niveau de confiance pour orienter les cas incertains vers une personne.',
      ],
    },
    how: {
      title: 'Comment classer du texte avec une IA en ligne',
      intro: 'Le classificateur gratuit suit le même processus en trois étapes pour chaque tâche.',
      steps: [
        { title: 'Ajoutez le contexte', body: 'Collez le texte ou décrivez les faits utiles en JSON. Le modèle utilise uniquement les informations fournies.' },
        { title: 'Choisissez le type de réponse', body: 'Noul renvoie une probabilité, Score une note ordonnée et Choice une étiquette parmi votre liste.' },
        { title: 'Lancez la classification', body: 'Obtenez immédiatement une réponse structurée, sa confiance et la distribution des probabilités.' },
      ],
    },
    types: {
      title: 'Trois types de classification IA',
      items: [
        { title: 'Noul — probabilité', body: 'Teste si une affirmation est vraie et renvoie une valeur de 0 à 1. Une valeur proche de 0,5 indique une réelle incertitude.' },
        { title: 'Score — évaluation ordonnée', body: 'Évalue le contexte selon des niveaux que vous définissez, par exemple une gravité faible, moyenne ou élevée.' },
        { title: 'Choice — catégorie', body: 'Sélectionne la meilleure étiquette parmi vos options et indique la probabilité de chacune.' },
      ],
    },
    uses: {
      title: 'Principaux usages de la classification de texte IA',
      intro: 'Appliquez la même question à de nombreux enregistrements lorsqu’une décision répétable est plus utile qu’un texte généré.',
      items: [
        { title: 'Classement des tickets support', body: 'Détectez l’urgence, affectez la bonne équipe et mesurez le sentiment client.' },
        { title: 'Tri de CV', body: 'Comparez l’expérience aux exigences du poste et faites vérifier les candidatures incertaines.' },
        { title: 'Modération de contenu', body: 'Appliquez vos catégories de politique aux publications, annonces, commentaires et prompts.' },
        { title: 'Codage d’enquêtes', body: 'Transformez les réponses libres et données brutes en étiquettes cohérentes.' },
      ],
    },
    faq: {
      title: 'FAQ du classificateur de texte IA',
      items: [
        { q: 'Ce classificateur de texte IA est-il gratuit ?', a: 'Oui. Vous disposez de 3 classifications sans compte, puis de 30 par jour avec une connexion Google.' },
        { q: 'Puis-je classer du JSON en plus du texte ?', a: 'Oui. Collez du texte ou fournissez un objet JSON contenant les faits à évaluer.' },
        { q: 'Quels résultats peut-il renvoyer ?', a: 'Une probabilité, un score sur des niveaux ordonnés ou une catégorie parmi les options définies.' },
        { q: 'Ai-je besoin d’une clé API ?', a: 'Non. Le classificateur en ligne fonctionne directement dans le navigateur sans votre propre clé API.' },
        { q: 'Comment utiliser le niveau de confiance ?', a: 'Fixez un seuil d’automatisation et envoyez les résultats moins fiables à une personne.' },
      ],
    },
  },
  de: {
    intro: {
      title: 'Was ist ein KI-Textklassifikator?',
      paragraphs: [
        'Ein KI-Textklassifikator liest den bereitgestellten Kontext und gibt eine eindeutige Kategorie, Bewertung oder Wahrscheinlichkeit zurück. JEV AI Model verarbeitet Text und JSON, um Supportanfragen, Lebensläufe, Umfrageantworten, Prompts, Produktdaten und weitere Inhalte direkt im Browser zu klassifizieren.',
        'Anders als bei einem Chatbot legst du das Antwortformat vor der Ausführung fest. Dadurch lassen sich Ergebnisse leichter speichern, vergleichen und prüfen. Jede Antwort enthält eine Konfidenz, damit unsichere Fälle an Menschen weitergegeben werden können.',
      ],
    },
    how: {
      title: 'Text online mit KI klassifizieren',
      intro: 'Der kostenlose Klassifikator nutzt für jede Aufgabe denselben Ablauf in drei Schritten.',
      steps: [
        { title: 'Kontext eingeben', body: 'Text einfügen oder relevante Fakten als JSON beschreiben. Das Modell nutzt nur die bereitgestellten Informationen.' },
        { title: 'Antworttyp wählen', body: 'Noul liefert eine Wahrscheinlichkeit, Score eine geordnete Bewertung und Choice ein Label aus deiner Liste.' },
        { title: 'Klassifikation starten', body: 'Du erhältst sofort eine strukturierte Antwort, Konfidenz und Wahrscheinlichkeitsverteilung.' },
      ],
    },
    types: {
      title: 'Drei Arten der KI-Klassifikation',
      items: [
        { title: 'Noul — Wahrscheinlichkeit', body: 'Prüft, ob eine Aussage wahr ist, und gibt einen Wert von 0 bis 1 zurück. Werte um 0,5 zeigen echte Unsicherheit.' },
        { title: 'Score — geordnete Bewertung', body: 'Bewertet den Kontext anhand selbst definierter Stufen, etwa niedriger, mittlerer oder hoher Schweregrad.' },
        { title: 'Choice — Kategorie', body: 'Wählt das passende Label aus deinen Optionen und zeigt die Wahrscheinlichkeit für jede Option.' },
      ],
    },
    uses: {
      title: 'Typische Einsatzbereiche für KI-Textklassifikation',
      intro: 'Nutze dieselbe typisierte Frage für viele Datensätze, wenn eine wiederholbare Entscheidung hilfreicher ist als generierter Text.',
      items: [
        { title: 'Support-Tickets klassifizieren', body: 'Dringlichkeit erkennen, Tickets dem richtigen Team zuweisen und Kundenstimmung bewerten.' },
        { title: 'Lebensläufe prüfen', body: 'Erfahrung mit Stellenanforderungen vergleichen und unsichere Bewerbungen manuell prüfen.' },
        { title: 'Inhalte moderieren', body: 'Eigene Richtlinien auf Beiträge, Angebote, Kommentare und Prompts anwenden.' },
        { title: 'Umfragen und Daten labeln', body: 'Freitextantworten und Rohdaten in konsistente Kategorien umwandeln.' },
      ],
    },
    faq: {
      title: 'Häufige Fragen zum KI-Textklassifikator',
      items: [
        { q: 'Ist der KI-Textklassifikator kostenlos?', a: 'Ja. Ohne Konto sind 3 Klassifikationen möglich, nach Google-Anmeldung 30 pro Tag.' },
        { q: 'Kann ich neben Text auch JSON klassifizieren?', a: 'Ja. Füge normalen Text oder ein JSON-Objekt mit den zu bewertenden Fakten ein.' },
        { q: 'Welche Ergebnisse sind möglich?', a: 'Eine Wahrscheinlichkeit, eine Bewertung auf geordneten Stufen oder eine Kategorie aus deinen Optionen.' },
        { q: 'Brauche ich einen API-Schlüssel?', a: 'Nein. Der Online-Klassifikator funktioniert direkt im Browser ohne eigenen API-Schlüssel.' },
        { q: 'Wie verwende ich die Konfidenz?', a: 'Lege einen Grenzwert für Automatisierung fest und lasse Ergebnisse darunter von Menschen prüfen.' },
      ],
    },
  },
  'pt-BR': {
    intro: {
      title: 'O que é um classificador de texto com IA?',
      paragraphs: [
        'Um classificador de texto com IA analisa o contexto fornecido e retorna uma categoria, nota ou probabilidade previsível. O JEV AI Model aceita texto e JSON para classificar tickets de suporte, currículos, respostas de pesquisa, prompts, produtos e outros registros direto no navegador.',
        'Diferente de um chatbot, você escolhe o formato da resposta antes da execução. Assim, fica mais fácil salvar, comparar e auditar resultados. Cada resposta inclui confiança para encaminhar casos incertos à revisão humana.',
      ],
    },
    how: {
      title: 'Como classificar texto com IA online',
      intro: 'O classificador gratuito usa o mesmo processo de três etapas para qualquer tarefa.',
      steps: [
        { title: 'Adicione o contexto', body: 'Cole o texto ou descreva os fatos relevantes em JSON. O modelo usa apenas as informações fornecidas.' },
        { title: 'Escolha o tipo de resposta', body: 'Use Noul para probabilidade, Score para uma escala ordenada ou Choice para selecionar um rótulo.' },
        { title: 'Execute a classificação', body: 'Receba uma resposta estruturada, o nível de confiança e a distribuição de probabilidades.' },
      ],
    },
    types: {
      title: 'Três tipos de classificação com IA',
      items: [
        { title: 'Noul — probabilidade', body: 'Avalia se uma afirmação é verdadeira e retorna um valor de 0 a 1. Valores perto de 0,5 indicam incerteza real.' },
        { title: 'Score — nota ordenada', body: 'Avalia o contexto em níveis definidos por você, como gravidade baixa, média e alta.' },
        { title: 'Choice — categoria', body: 'Escolhe o melhor rótulo entre suas opções e mostra a probabilidade de cada uma.' },
      ],
    },
    uses: {
      title: 'Principais usos da classificação de texto com IA',
      intro: 'Aplique a mesma pergunta a muitos registros quando uma decisão repetível for mais útil do que texto gerado.',
      items: [
        { title: 'Classificação de tickets', body: 'Detecte urgência, encaminhe para a equipe correta e avalie o sentimento do cliente.' },
        { title: 'Triagem de currículos', body: 'Compare experiências com requisitos da vaga e revise manualmente os casos incertos.' },
        { title: 'Moderação de conteúdo', body: 'Aplique suas categorias de política a posts, anúncios, comentários e prompts.' },
        { title: 'Codificação de pesquisas', body: 'Transforme respostas abertas e dados brutos em rótulos consistentes.' },
      ],
    },
    faq: {
      title: 'Perguntas frequentes sobre o classificador de texto IA',
      items: [
        { q: 'O classificador de texto com IA é grátis?', a: 'Sim. Você pode fazer 3 classificações sem conta e 30 por dia após entrar com Google.' },
        { q: 'Posso classificar JSON além de texto?', a: 'Sim. Cole texto comum ou forneça um objeto JSON com os fatos que o modelo deve avaliar.' },
        { q: 'Quais resultados ele pode retornar?', a: 'Uma probabilidade, uma nota em níveis ordenados ou uma categoria entre as opções definidas.' },
        { q: 'Preciso de uma chave de API?', a: 'Não. O classificador online funciona direto no navegador sem sua própria chave de API.' },
        { q: 'Como usar a confiança?', a: 'Defina um limite para automação e envie resultados com confiança menor para uma pessoa revisar.' },
      ],
    },
  },
}
