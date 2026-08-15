import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

const AXES = ['이미 있나', '얼마나 쓸까', '왜 하필 지금', '예산이 감당되는가']
const CATEGORIES = ['의류', '뷰티', '전자기기', '생활용품', '식품', '취미·운동']

const generate = async (prompt) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  })
  return JSON.parse(response.text)
}

export async function generateFirstQuestion(productInfo) {
  return generate(`
상품명: ${productInfo.name}
가격: ${productInfo.price?.toLocaleString()}원

다음 작업을 수행해줘:
1. 이 상품의 카테고리를 [${CATEGORIES.join(', ')}] 중 하나로 분류해줘.
2. 아래 기준으로 사용자에게 물어볼 첫 번째 질문을 만들어줘.
   - 축: "${AXES[0]}" (기존에 같은 류 제품을 갖고 있는지)
   - 상품명에 나온 구체적인 정보를 질문에 반영해 자연스럽게 만들어줘.
   - 선택지는 4개, 각 15자 이내로 간결하게.
3. 질문 아래 붙을 상품 관련 사실 한 줄을 추가해줘. (링크에서 알 수 있는 객관적 사실만. 없으면 빈 문자열)

JSON 형식으로만 반환:
{
  "category": "카테고리",
  "question": "질문 문장",
  "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
  "infoLine": "상품 사실 한 줄"
}
`)
}

export async function generateNextQuestion(productInfo, category, previousQAs, axisIndex) {
  const axis = AXES[axisIndex]
  const history = previousQAs
    .map((qa, i) => `Q${i + 1}(${AXES[i]}): ${qa.question} → 답변: ${qa.answer}`)
    .join('\n')

  return generate(`
상품명: ${productInfo.name}
가격: ${productInfo.price?.toLocaleString()}원
카테고리: ${category}

지금까지의 답변:
${history}

다음 질문을 만들어줘:
- 축: "${axis}"
- 이전 답변을 자연스럽게 인용해서 질문 문장을 구체화해줘.
- 선택지는 4개, 각 15자 이내로 간결하게.
- 세일/할인 중이면 "왜 하필 지금" 축의 선택지 맨 위에 "할인 중이라서"를 배치해줘.
- 질문 아래 붙을 상품 관련 사실 한 줄을 추가해줘. (객관적 사실만. 없으면 빈 문자열)

JSON 형식으로만 반환:
{
  "question": "질문 문장",
  "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
  "infoLine": "상품 사실 한 줄"
}
`)
}

export async function generateJudgment(productInfo, category, allQAs) {
  const history = allQAs
    .map((qa, i) => `Q${i + 1}(${qa.axis}): ${qa.question} → 답변: ${qa.answer}`)
    .join('\n')

  return generate(`
상품명: ${productInfo.name}
가격: ${productInfo.price?.toLocaleString()}원
카테고리: ${category}

사용자 답변:
${history}

각 답변을 "좋음", "주의", "걸림" 중 하나로 분류하고 최종 판정을 내려줘.

판정 기준:
- 구매해도 좋아요: 걸림 0개, 주의 1개 이하
- 조금 더 생각해봐요: 걸림 1개 또는 주의 2개 이상
- 추천하지 않아요: 걸림 2개 이상

JSON 형식으로만 반환:
{
  "verdict": "구매해도 좋아요" | "조금 더 생각해봐요" | "추천하지 않아요",
  "signals": [{"axis": "축 이름", "answer": "사용자 답변", "signal": "좋음" | "주의" | "걸림"}],
  "reason": "판정 근거 한두 문장"
}
`)
}
