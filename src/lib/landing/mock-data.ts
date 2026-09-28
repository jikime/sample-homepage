import type { Artwork, LandingContent } from "./types"

/**
 * 랜딩 목업 데이터.
 * 문구는 references/design 의 P-01 목업(데스크톱 1280 · 모바일 390)을 그대로 옮겼다.
 * 작품 이미지는 codex-image로 생성한 자리표시 이미지다 — 배포 전 크리에이터 승인 작품(공개 샘플)으로 교체한다.
 * 회사명·금액·연락처는 모두 가상 데이터다.
 */

const artworkList: Artwork[] = [
  {
    id: "summer-terrace",
    title: "여름빛 테라스",
    creator: "소연",
    src: "/images/samples/summer-terrace.webp",
    width: 1024,
    height: 1280,
    sizeLabel: "1080×1350",
    category: "라이프스타일",
    tone: "자연광",
    placement: "인스타그램 피드",
    placementShort: "피드",
  },
  {
    id: "morning-skincare",
    title: "모닝 루틴 스킨케어",
    creator: "하린",
    src: "/images/samples/morning-skincare.webp",
    width: 1024,
    height: 1024,
    sizeLabel: "1080×1080",
    category: "뷰티",
    tone: "파스텔",
    placement: "인스타그램 피드",
    placementShort: "피드",
  },
  {
    id: "home-cafe",
    title: "홈카페 신메뉴",
    creator: "도윤",
    src: "/images/samples/home-cafe.webp",
    width: 1536,
    height: 804,
    sizeLabel: "1200×628",
    category: "F&B",
    tone: "따뜻한 톤",
    placement: "디스플레이 배너",
    placementShort: "배너",
  },
  {
    id: "city-running",
    title: "도심 러닝 슈즈",
    creator: "지후",
    src: "/images/samples/city-running.webp",
    width: 864,
    height: 1536,
    sizeLabel: "1080×1920",
    category: "스포츠",
    tone: "다이내믹",
    placement: "인스타그램 스토리",
    placementShort: "스토리",
  },
  {
    id: "autumn-outer",
    title: "가을 아우터 룩북",
    creator: "서진",
    src: "/images/samples/autumn-outer.webp",
    width: 1024,
    height: 1280,
    sizeLabel: "1080×1350",
    category: "패션",
    tone: "무드",
    placement: "페이스북",
    placementShort: "페이스북",
  },
  {
    id: "pet-treats",
    title: "반려동물 간식 출시",
    creator: "민재",
    src: "/images/samples/pet-treats.webp",
    width: 1024,
    height: 1024,
    sizeLabel: "1080×1080",
    category: "펫",
    tone: "선명한 컬러",
    placement: "카카오",
    placementShort: "카카오",
  },
  {
    id: "camping-lantern",
    title: "캠핑 랜턴 기획전",
    creator: "태오",
    src: "/images/samples/camping-lantern.webp",
    width: 1024,
    height: 1280,
    sizeLabel: "1080×1350",
    category: "아웃도어",
    tone: "저녁 무드",
    placement: "인스타그램 피드",
    placementShort: "피드",
  },
  {
    id: "wireless-earbuds",
    title: "무선 이어폰 론칭",
    creator: "유나",
    src: "/images/samples/wireless-earbuds.webp",
    width: 1536,
    height: 804,
    sizeLabel: "1200×628",
    category: "테크",
    tone: "미니멀",
    placement: "디스플레이 배너",
    placementShort: "배너",
  },
  {
    id: "fresh-juice",
    title: "제철 과일 주스",
    creator: "예린",
    src: "/images/samples/fresh-juice.webp",
    width: 864,
    height: 1536,
    sizeLabel: "1080×1920",
    category: "F&B",
    tone: "선명한 컬러",
    placement: "인스타그램 스토리",
    placementShort: "스토리",
  },
]

export const landingMock: LandingContent = {
  nav: [
    { label: "진행 방식", href: "#how" },
    { label: "샘플", href: "#samples" },
    { label: "이용 안내", href: "#terms" },
  ],
  loginHref: "/login",

  hero: {
    overline: {
      base: "광고대행사를 위한 AI 이미지 광고 소재 · 관리형 제작",
      mobile: "AI 이미지 광고 소재 · 관리형 제작",
    },
    headline: { lines: ["브리프 하나로,", "{accent} 안에", "검토된 후보를."], accent: "48시간" },
    description: {
      base: "캠페인 조건을 보내면 운영팀이 검토한 AI 이미지 소재 후보를 같은 기준으로 비교해 드려요. 변형·검수·라이선스까지 포함된 파일로 받아보세요.",
      mobile:
        "운영팀이 검토한 AI 이미지 소재 후보를 같은 기준으로 비교하고, 라이선스까지 포함된 파일로 받아보세요.",
    },
    note: {
      base: "승인된 에이전시만 이용할 수 있어요 · 가입 신청은 영업일 1일 안에 검토해요",
      mobile: "승인된 에이전시만 이용할 수 있어요",
    },
    primaryCta: "브리프 보내기",
    secondaryCta: { label: "진행 방식 보기", href: "#how" },
    desktopShowcase: [
      { artworkId: "city-running" },
      {
        artworkId: "summer-terrace",
        // 인스타그램 피드 정사각 표준 변형(리사이즈·리크롭)
        variant: {
          src: "/images/samples/summer-terrace-square.webp",
          width: 1024,
          height: 1024,
          sizeLabel: "1080×1080",
        },
      },
      { artworkId: "home-cafe" },
    ],
    mobileShowcase: [{ artworkId: "city-running" }, { artworkId: "summer-terrace" }],
  },

  problem: {
    heading: {
      overline: "WHY",
      title: { base: ["소재를 찾는 시간보다", "고르는 시간에 집중하세요"] },
    },
    items: [
      {
        code: "01",
        label: "탐색",
        title: "캠페인마다 제작자를 다시 찾아요",
        problem: "매체·규격·납기·예산에 맞는 사람을 찾고 연락하고 조율하는 일을 매번 반복하게 돼요.",
        solution: "정해진 양식의 브리프 한 번이면 운영팀이 후보를 골라 보내드려요.",
      },
      {
        code: "02",
        label: "조율",
        title: "수정 범위가 모호하면 일정이 밀려요",
        problem:
          "메신저로 오가는 수정 요청은 기록이 남지 않고, 재제작과의 경계가 흐려 비용과 납기가 늘어나요.",
        solution: "표준 변형 5종과 수정 2회를 작업 전에 견적으로 확정해요.",
      },
      {
        code: "03",
        label: "권리",
        title: "AI 이미지의 이용 조건을 설명하기 어려워요",
        problem: "생성 도구·후처리·이용 범위가 제각각이라 광고주가 물어볼 때 답하기가 곤란해요.",
        solution: "생성·후처리 정보와 라이선스 증서를 납품 파일과 함께 드려요.",
      },
    ],
  },

  process: {
    heading: {
      overline: "HOW IT WORKS",
      title: { base: ["브리프부터 인수까지 6단계"] },
      description: {
        base: "모든 단계는 프로젝트 화면 한 곳에서 진행 상황과 다음 할 일로 보여요.",
        mobile: "",
      },
    },
    steps: [
      {
        code: "01",
        title: "브리프",
        description: { base: "캠페인·스타일·규격·납기·예산·이용 조건을 4단계 양식으로 보내요." },
      },
      {
        code: "02",
        title: "후보",
        description: { base: "검토된 후보 2~5개가 적합 이유와 함께 48시간 안에 도착해요." },
      },
      {
        code: "03",
        title: "견적·결제",
        description: { base: "가격·납기·수정 횟수·라이선스를 작업 전에 확인하고 승인해요." },
      },
      {
        code: "04",
        title: "제작",
        description: {
          base: "결제가 확인되면 크리에이터가 제작하고 운영팀이 체크리스트로 검수해요.",
          mobile: "결제가 확인되면 제작을 시작하고 운영팀이 체크리스트로 검수해요.",
        },
      },
      {
        code: "05",
        title: "납품",
        description: {
          base: "합의한 규격의 파일, 라이선스 증서, 생성·후처리 정보를 함께 받아요.",
          mobile: "파일, 라이선스 증서, 생성·후처리 정보를 함께 받아요.",
        },
      },
      {
        code: "06",
        title: "완료",
        description: {
          base: "확인 후 인수하거나 수정을 요청해요. 7일이 지나면 자동으로 인수돼요.",
          mobile: "인수하거나 수정을 요청해요. 7일이 지나면 자동으로 인수돼요.",
        },
      },
    ],
  },

  compare: {
    heading: {
      overline: "COMPARE",
      title: { base: ["모든 후보를 같은 7가지 기준으로"], mobile: ["모든 후보를 같은", "7가지 기준으로"] },
      description: {
        base: "항목이 하나라도 빠진 작품은 후보로 보내지 않아요. 순서도 늘 같아요.",
        mobile: "항목이 하나라도 빠진 작품은 후보로 보내지 않아요.",
      },
    },
    example: {
      caption: {
        base: "예시 화면 · 후보 비교 (DP-2026-0014 여름 시즌 SNS 캠페인)",
        mobile: "예시 화면 · 후보 비교 (DP-2026-0014)",
      },
      rowLabels: [
        { base: "① 대표 이미지" },
        { base: "② 품질 메모" },
        { base: "③ 생성·후처리 정보", mobile: "③ 생성·후처리" },
        { base: "④ 변형 범위" },
        { base: "⑤ 기준 가격" },
        { base: "⑥ 기준 납기" },
        { base: "⑦ 라이선스" },
      ],
      candidates: [
        {
          id: "cand-1",
          order: 1,
          artworkId: "summer-terrace",
          qualityNote: { base: "자연광 톤, 제품 합성 영역이 넓고 손·글자 왜곡 없음" },
          generation: { base: "이미지 생성 도구 1종 · 색 보정·배경 정리 후처리" },
          variations: { base: "리사이즈·리크롭 · 카피 영역 · 색감·톤" },
          basePrice: 650000,
          leadDays: 4,
          license: "온라인 광고·SNS · 1년 · 대한민국 · 비독점",
        },
        {
          id: "cand-2",
          order: 2,
          artworkId: "morning-skincare",
          qualityNote: {
            base: "밝은 파스텔 톤, 제품 질감이 선명하고 여백이 균형 잡힘",
            mobile: "밝은 파스텔 톤, 제품 질감이 선명함",
          },
          generation: {
            base: "이미지 생성 도구 2종 · 제품 합성·리터치 후처리",
            mobile: "생성 도구 2종 · 제품 합성·리터치",
          },
          variations: {
            base: "리사이즈·리크롭 · 배경색 교체 · 소품 1개 교체",
            mobile: "리사이즈·리크롭 · 배경색 · 소품 1개",
          },
          basePrice: 900000,
          leadDays: 5,
          license: "온라인 광고·SNS · 1년 · 대한민국 · 비독점",
        },
        {
          id: "cand-3",
          order: 3,
          artworkId: "city-running",
          qualityNote: { base: "역동적인 구도, 세로형 매체에 맞춘 여백과 대비" },
          generation: { base: "이미지 생성 도구 1종 · 모션 블러·색 보정 후처리" },
          variations: { base: "리사이즈·리크롭 · 카피 영역" },
          basePrice: 550000,
          leadDays: 3,
          license: "온라인 광고·SNS · 1년 · 대한민국 · 비독점",
        },
      ],
      defaultSelectedId: "cand-2",
    },
  },

  samples: {
    heading: { overline: "SAMPLES", title: { base: ["심사를 통과한 샘플 작품"] } },
    moreLabel: "샘플 더 보기",
    initialCount: { mobile: 4, desktop: 6 },
    artworkIds: artworkList.map((artwork) => artwork.id),
  },

  rules: {
    heading: {
      overline: "OPERATING RULES",
      title: { base: ["약속은 숫자로 정해 두었어요"], mobile: ["약속은 숫자로", "정해 두었어요"] },
    },
    items: [
      {
        value: "48",
        unit: "시간",
        title: "후보 제안",
        description: {
          base: "브리프 완결 판정 후 48시간 안에 후보를 보내드려요.",
          mobile: "완결 판정 후 48시간 안에 보내드려요.",
        },
        emphasis: true,
      },
      {
        value: "2~5",
        unit: "개",
        title: "후보 수",
        description: {
          base: "후보마다 적합 이유를 적고, 같은 7항목으로 정리해요.",
          mobile: "적합 이유와 7항목을 함께 정리해요.",
        },
      },
      {
        value: "2",
        unit: "회",
        title: "수정 요청 포함",
        description: { base: "합의 범위 안의 수정은 견적에 포함돼요." },
      },
      {
        value: "1",
        unit: "부",
        title: "라이선스 증서",
        description: {
          base: "납품마다 이용 조건과 생성 정보를 담은 PDF를 드려요.",
          mobile: "납품마다 PDF로 드려요.",
        },
      },
    ],
  },

  terms: {
    heading: { overline: "TERMS", title: { base: ["이용 조건 요약"] } },
    rows: [
      {
        label: "기준 가격",
        monoPrefix: "300,000~1,500,000원",
        value: { base: "", mobile: " · 부가세 별도" },
        note: { base: "작품당 공급가 · 부가세 10% 별도", mobile: "" },
      },
      {
        label: "표준 변형",
        value: {
          base: "리사이즈·리크롭, 카피·로고 영역 확보, 색감·톤 조정, 배경색 교체, 소품 1개 교체",
          mobile: "리사이즈·리크롭, 카피·로고 영역, 색감·톤, 배경색, 소품 1개 교체",
        },
      },
      {
        label: "수정 요청",
        value: { base: "2회 포함 · 범위를 넘는 요청은 별도 견적", mobile: "2회 포함 · 범위를 넘으면 별도 견적" },
      },
      {
        label: "이용 조건",
        value: {
          base: "온라인 광고·SNS · 1년 · 대한민국 · 비독점 (독점은 옵션)",
          mobile: "온라인 광고·SNS · 1년 · 대한민국 · 비독점",
        },
      },
      {
        label: "결제",
        value: {
          base: "계좌이체(세금계산서 발행) 또는 카드 · 견적 유효 72시간",
          mobile: "계좌이체(세금계산서) 또는 카드 · 견적 유효 72시간",
        },
      },
      {
        label: "납기",
        value: { base: "희망 납기일은 접수일로부터 3일 이후 · 확정 납기는 견적에 표시" },
        desktopOnly: true,
      },
    ],
    detailLink: { label: "이용 안내 자세히 보기", href: "/guide" },
    faqTitle: "자주 묻는 질문",
    faqs: [
      {
        id: "license",
        question: "생성한 이미지의 라이선스는 어떻게 되나요?",
        answer: {
          base: "견적에 매체·기간·지역·독점 여부를 명시하고, 납품 때 라이선스 증서 PDF를 드려요. 기본 조건은 온라인 광고·SNS, 1년, 대한민국, 비독점 이용이에요.",
          mobile:
            "견적에 매체·기간·지역·독점 여부를 명시하고, 납품 때 라이선스 증서 PDF를 드려요. 기본은 온라인 광고·SNS, 1년, 대한민국, 비독점이에요.",
        },
      },
      {
        id: "revision",
        question: "수정은 몇 번까지 요청할 수 있나요?",
        answer: {
          base: "견적에 수정 요청 2회가 포함돼요. 구도·주제·인물 변경이나 새로 생성하는 요청은 표준 변형 범위를 넘어 별도 견적으로 안내드려요.",
          mobile: "수정 요청 2회가 포함돼요. 구도·주제·인물 변경이나 새로 생성하는 요청은 별도 견적으로 안내드려요.",
        },
      },
      {
        id: "payment",
        question: "결제는 어떻게 하나요?",
        answer: {
          base: "계좌이체가 기본이고 세금계산서를 발행해 드려요. 카드 결제도 할 수 있어요. 견적은 발행 후 72시간 동안 유효해요.",
          mobile: "계좌이체가 기본이고 세금계산서를 발행해 드려요. 카드 결제도 할 수 있어요.",
        },
      },
      {
        id: "refund",
        question: "취소하면 환불받을 수 있나요?",
        answer: {
          base: "크리에이터가 작업을 수락하기 전에는 전액, 수락 후 첫 제출 전에는 50%를 환불해 드려요. 첫 제출 이후에는 환불되지 않아요.",
          mobile: "작업 수락 전에는 전액, 수락 후 첫 제출 전에는 50%를 환불해 드려요. 첫 제출 이후에는 환불되지 않아요.",
        },
      },
      {
        id: "deadline",
        question: "납기는 어떻게 정해지나요?",
        answer: {
          base: "희망 납기일은 브리프 접수일로부터 3일 이후로 선택할 수 있어요. 확정 납기일은 선택한 작품의 기준 납기를 반영해 견적에 적어 드려요.",
          mobile: "희망 납기일은 접수일로부터 3일 이후로 고를 수 있어요. 확정 납기일은 견적에 적어 드려요.",
        },
      },
      {
        id: "contact",
        question: "크리에이터와 직접 연락할 수 있나요?",
        answer: {
          base: "고객과 크리에이터의 연락처는 서로 공개되지 않아요. 모든 소통은 프로젝트 코멘트로 운영팀을 거쳐 기록으로 남아요.",
          mobile: "연락처는 서로 공개되지 않아요. 모든 소통은 프로젝트 코멘트로 운영팀을 거쳐요.",
        },
      },
    ],
  },

  finalCta: {
    overline: "GET STARTED",
    title: {
      base: ["다음 캠페인 브리프,", "지금 보내 보세요"],
      mobile: ["다음 캠페인", "브리프, 지금", "보내 보세요"],
    },
    description: "가입 신청 후 영업일 1일 안에 검토해 이메일로 알려드려요.",
    primaryCta: "브리프 보내기",
    secondaryCta: { label: "로그인", href: "/login" },
  },

  footer: {
    tagline: "광고대행사를 위한 AI 이미지 광고 소재 관리형 제작 서비스",
    copyright: "© 2026 디지털플레이스",
    creatorContact: {
      label: "크리에이터 문의",
      linkLabel: { base: "creators@example.com", mobile: "크리에이터 문의" },
      href: "mailto:creators@example.com",
    },
    policies: [
      { label: "이용약관", href: "/legal/terms" },
      { label: "개인정보처리방침", href: "/legal/privacy" },
    ],
  },

  artworks: Object.fromEntries(artworkList.map((artwork) => [artwork.id, artwork])),
}
