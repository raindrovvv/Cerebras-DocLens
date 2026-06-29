import { FinalAnalysisResult } from "@/types";

export const mockInsuranceResult: FinalAnalysisResult = {
  document: {
    id: "doc_insurance_sample",
    fileName: "무배당_케어플러스_암보험_약관.pdf",
    fileType: "pdf",
    pageCount: 124,
    uploadedAt: "2026-06-28T23:55:00Z",
    documentType: "insurance",
    language: "ko"
  },
  executiveSummary: [
    "이 약관은 암 진단 확정 시 지급되는 암 진단비 및 입원/수술 보장 내용을 규정합니다.",
    "최초 계약일로부터 90일의 면책(대기) 기간이 적용되며, 이 기간 내 발생한 암은 전혀 보장하지 않습니다.",
    "가입 후 1년 이내에 일반암 진단을 받을 경우, 약정된 보장 금액의 50%만 지급하는 감액 기간이 존재합니다."
  ],
  keyPoints: [
    "암 진단 확정 시 일반암 진단비 5,000만 원 일시금 지급 (최초 1회 한정)",
    "갑상선암, 경계성종양 등 유사암은 일반암의 20%인 1,000만 원 지급",
    "암 직접치료 목적의 4일 이상 입원 시 일당 10만 원 지급 (최대 120일 한도)",
    "피보험자의 고의적 사고 또는 자해의 경우 보험금 지급을 제한함 (면책 사유)"
  ],
  risks: [
    {
      id: "risk_ins_1",
      title: "암보장 개시일 (90일 면책 기간)",
      severity: "high",
      plainExplanation: "보험에 가입했더라도 첫 90일 동안은 암에 걸려도 돈을 한 푼도 받지 못하며, 오히려 계약이 없던 일로 취소됩니다.",
      whyItMatters: "가입 직후 혹시나 암 진단을 받게 되면 납입한 보험료만 돌려받고 정작 큰 치료비 지원은 전혀 받지 못하게 됩니다.",
      evidence: [
        {
          page: 12,
          quote: "계약일로부터 90일이 지난 날의 다음 날을 암보장개시일로 하며, 이 기간 내 진단 확정 시 계약은 무효로 합니다.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "risk_ins_2",
      title: "암의 정의 및 진단 확정 기준 분쟁",
      severity: "medium",
      plainExplanation: "동네 한의원이나 대체의학 전문기관의 진단서로는 보험금을 탈 수 없습니다. 반드시 대학병원급의 해부병리/임상병리 전문의가 서명한 조직검사 보고서가 필요합니다.",
      whyItMatters: "일반 의사의 구두 소견이나 일반 진단서만 제출했다가 청구가 거절되거나 심사가 지연될 수 있습니다.",
      evidence: [
        {
          page: 25,
          quote: "암의 진단 확정은 병리 또는 진단검사의학의 전문의 자격증을 가진 자에 의하여 내려져야 하며, 조직검사, 미세바늘흡인검사에 대한 현미경 소견을 기초로 해야 합니다.",
          confidence: 0.95
        }
      ]
    },
    {
      id: "risk_ins_3",
      title: "가입 후 1년 이내 50% 감액 지급",
      severity: "high",
      plainExplanation: "가입하고 90일이 지나 보장이 시작되더라도, 가입한 지 1년(365일)이 되기 전에 암에 걸리면 약속한 돈의 절반만 줍니다.",
      whyItMatters: "가입 초기에 치료비가 많이 드는 고액암 등이 발생했을 경우, 보장 공백이 생겨 본인 부담금이 크게 늘어날 수 있습니다.",
      evidence: [
        {
          page: 14,
          quote: "계약일부터 1년 미만에 최초로 암 진단 확정 시에는 일반암 진단비의 50%를 지급합니다.",
          confidence: 0.97
        }
      ]
    }
  ],
  moneyItems: [
    {
      id: "money_ins_1",
      amount: "50,000,000원",
      type: "you_receive",
      description: "일반암 최초 진단 시 1회에 한하여 일시금으로 지급받는 진단비",
      evidence: [
        {
          page: 8,
          quote: "일반암 진단 시 가입금액 50,000,000원을 지급합니다 (최초 1회에 한함).",
          confidence: 0.99
        }
      ]
    },
    {
      id: "money_ins_2",
      amount: "10,000,000원",
      type: "you_receive",
      description: "갑상선암, 제자리암, 경계성종양 진단 시 지급받는 유사암 진단비",
      evidence: [
        {
          page: 9,
          quote: "유사암 진단 시 가입금액의 20%인 10,000,000원을 지급합니다.",
          confidence: 0.97
        }
      ]
    },
    {
      id: "money_ins_3",
      amount: "100,000원 / 일",
      type: "you_receive",
      description: "암 치료 목적의 4일 이상 계속 입원 시 4일째부터 지급받는 일당 (최대 120일)",
      evidence: [
        {
          page: 15,
          quote: "암직접치료를 목적으로 4일 이상 입원한 경우, 3일 초과 1일당 100,000원을 지급합니다.",
          confidence: 0.96
        }
      ]
    },
    {
      id: "money_ins_4",
      amount: "45,000원 / 월",
      type: "you_pay",
      description: "매월 25일 약정 계좌에서 자동이체 출금되는 보험료",
      evidence: [
        {
          page: 2,
          quote: "제1회 보험료 및 매월 25일 납입하여야 하는 월 납입 기본보험료는 45,000원입니다.",
          confidence: 0.99
        }
      ]
    }
  ],
  timeline: [
    {
      id: "time_ins_1",
      dateText: "가입 후 90일",
      meaning: "면책 기간(돈을 주지 않는 기간) 종료일. 91일째 되는 날부터 암보장 개시",
      urgency: "high",
      evidence: [
        {
          page: 12,
          quote: "계약일로부터 90일이 지난 날의 다음 날부터 보장을 시작합니다.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "time_ins_2",
      dateText: "가입 후 1년 (365일)",
      meaning: "50% 감액 기간 종료일. 가입 1년 이후부터 암 진단 시 100% (5천만 원) 전액 보장 시작",
      urgency: "medium",
      evidence: [
        {
          page: 14,
          quote: "계약일로부터 1년이 경과한 날 이후부터는 진단비의 100%를 지급합니다.",
          confidence: 0.97
        }
      ]
    },
    {
      id: "time_ins_3",
      dateText: "진단일로부터 3년 이내",
      meaning: "보험금 청구 소멸 시효. 암 진단을 받은 지 3년이 지나면 청구할 권리가 사라짐",
      urgency: "high",
      evidence: [
        {
          page: 45,
          quote: "보험금 청구권은 3년간 행사하지 아니하면 소멸시효가 완성됩니다.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "time_ins_4",
      dateText: "보험료 납입 연체 후 2개월",
      meaning: "보험 계약 해지 시점. 보험료가 밀리면 회사가 독촉장을 보내고, 2개월이 지나면 보험 계약이 자동 해지(실효)됨",
      urgency: "medium",
      evidence: [
        {
          page: 38,
          quote: "보험료 납입이 연체중인 경우, 14일 이상의 기간을 정하여 최고하고 그 기간까지 납입하지 않으면 계약을 해지합니다.",
          confidence: 0.94
        }
      ]
    }
  ],
  actions: [
    {
      id: "act_ins_1",
      task: "대학병원 조직검사 보고서(Biopsy Report) 확보하기",
      priority: "high",
      reason: "보험사가 암 여부를 판단할 때 가장 먼저 요구하는 핵심 의학 서류입니다. 일반 진단서만으로는 지급이 지연됩니다.",
      evidence: [
        {
          page: 25,
          quote: "진단 확정은 병리 전문의의 해부병리/임상병리 보고서 소견에 근거해야 합니다.",
          confidence: 0.96
        }
      ]
    },
    {
      id: "act_ins_2",
      task: "진단 후 3년 안에 보험 청구 완료하기",
      priority: "high",
      reason: "바쁘거나 잊어버려서 3년을 넘기면 상법 및 약관상 권리가 사라져 보험금을 받을 수 없습니다.",
      evidence: [
        {
          page: 45,
          quote: "보험금 청구권 소멸시효는 3년입니다.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "act_ins_3",
      task: "가입 후 첫 90일 동안은 중대 증상이 없는 한 종합 검진 미루기",
      priority: "medium",
      reason: "이 대기 기간에 경미한 증상으로 정밀 검사를 받다 암이 발견되면 보험도 깨지고 아무 보장도 못 받기 때문에 검진 시기를 조율하는 것이 현명합니다.",
      evidence: [
        {
          page: 12,
          quote: "면책기간 내 진단 확정 시 계약은 무효로 하며 이미 납입한 보험료만을 반환합니다.",
          confidence: 0.95
        }
      ]
    }
  ],
  personaBrief: {
    child: "몸에 나쁜 악당(암)이 찾아왔을 때, 부모님이 큰 병원비를 걱정하지 않고 나를 치료해 줄 수 있도록 돈을 주는 착한 저금통 규칙이에요. 하지만 주의할 점이 있어요! 저금통을 만든 날부터 90일(약 세 달) 동안은 악당이 와도 도와주지 않는 약속 기간이 있대요. 그리고 일부러 장난치고 다치면(고의 사고) 이 저금통은 열리지 않아요!",
    senior: "어르신, 가장 중요한 세 가지만 꼭 기억하십시오! 첫째, 가입하시고 90일(약 석 달) 동안은 암에 걸리셔도 보험금이 전혀 안 나옵니다. 91일째부터 나오기 시작합니다. 둘째, 암에 걸리시면 의사 선생님께 꼭 '조직검사 보고서'를 복사해 달라고 하셔야 돈을 쉽게 타실 수 있습니다. 셋째, 가입하고 1년 안에 암이 발견되면 원래 주기로 약속한 돈의 반(50%)만 깎아서 줍니다. 달력에 1년이 지나서 보장액이 100%가 되는 날을 꼭 표시해두세요.",
    general: "이 문서는 암 확정 시 일반암 5,000만 원, 유사암 1,000만 원을 일시 지급하는 암 전용 보험 약관입니다. 청구 시 병리학 전문의의 조직검사 보고서가 필수적으로 수반되어야 하며, 계약일 기준 90일의 면책(대기) 기간 및 1년 이내 50% 감액 기간이 설정되어 있습니다. 청구 소멸시효는 3년이므로 치료가 완료되는 즉시 서류를 갖춰 청구하셔야 합니다.",
    expert: "본 보험계약 약관은 피보험자의 일반암 및 유사암 진단에 대한 정액형 급부 지급 조건을 규정하고 있습니다. 제12조(면책)에 따라 계약 성립일로부터 90일의 대기 기간이 적용되며, 동 대기 기간 내에 한국표준질병사인분류(KCD)상 C코드에 해당하는 악성신생물 확정 시 당사의 지급 책임은 무효(보험료 반환) 처리됩니다. 또한 제14조(감액)에 의거 가입 후 1년 미만 시기에는 지급 급부의 50%를 차감 지급합니다. 진단 확정의 입증 책임은 제25조에 의거 병리과 또는 진단검사의학과 전문의가 작성한 조직학적 검사 결과지(Biopsy Report)에 기초하며, 청구권은 상법 제662조에 의거 3년의 단기소멸시효가 적용됩니다."
  },
  disclaimer: "Cerebras DocLens은 문서 이해를 돕는 AI 도구입니다. 법률, 의료, 보험, 금융에 대한 전문 자문을 대체하지 않습니다. 중요한 결정 전에는 반드시 전문가 또는 해당 기관에 확인하세요."
};

export const mockLegalResult: FinalAnalysisResult = {
  document: {
    id: "doc_legal_sample",
    fileName: "주택임대차표준계약서_서울마포구.pdf",
    fileType: "pdf",
    pageCount: 6,
    uploadedAt: "2026-06-28T23:56:00Z",
    documentType: "legal",
    language: "ko"
  },
  executiveSummary: [
    "이 문서는 서울 마포구 염리동 소재 주택에 대해 임대보증금 2억 원, 월세 50만 원으로 약정하는 2년 기한의 주택임대차 표준계약서입니다.",
    "세입자는 보증금을 안전하게 지키기 위해 이삿날(잔금 납부일) 즉시 주민센터에서 전입신고를 하고 확정일자를 받아야 합니다.",
    "월세를 연속하거나 띄어서라도 총 2번(2달 치 상당) 안 내면 집주인은 세입자를 내보내고 계약을 즉시 해지할 수 있습니다."
  ],
  keyPoints: [
    "임대보증금 총액 2억 원 중 계약금 2,000만 원은 계약일 지급, 나머지 잔금 1억 8,000만 원은 입주일 지급",
    "월세 50만 원은 매월 1일에 선불로 집주인의 계좌로 송금함",
    "계약 기간은 2년 (2026년 8월 1일부터 2028년 8월 1일까지)",
    "특약 사항으로 임차인의 전세자금대출 미승인 시 계약금을 반환하고 계약을 해제하기로 합의함"
  ],
  risks: [
    {
      id: "risk_leg_1",
      title: "잔금일 기준 임대인의 추가 담보대출(근저당권) 금지 조항의 모호함",
      severity: "high",
      plainExplanation: "이사하는 당일과 그 다음날까지 집주인이 은행에서 집을 담보로 추가 대출을 받지 못하도록 하는 특약의 대상일이 정확하게 적혀있지 않아 리스크가 있습니다.",
      whyItMatters: "세입자가 주민센터에 전입신고를 해도 법적 효력(대항력)은 다음날 0시부터 발생합니다. 만약 집주인이 잔금 치르는 날 은행 대출을 받으면 은행 대출 권리가 세입자의 보증금 권리보다 앞서게 되어, 나중에 집이 경매로 넘어갈 때 보증금을 떼일 위험이 있습니다.",
      evidence: [
        {
          page: 4,
          quote: "임대인은 잔금 지급일 다음날까지 본 주택에 대한 새로운 근저당권 등 권리 관계를 설정하지 않기로 한다. (단, 설정 시 해제 조건 등 세부 페널티 누락)",
          confidence: 0.92
        }
      ]
    },
    {
      id: "risk_leg_2",
      title: "월세 2회 연체 시 즉시 해지 조항",
      severity: "high",
      plainExplanation: "월세를 2번 밀리면 집주인은 방을 비워달라고 요구할 권리를 가집니다. 연속해서 2번 밀리는 것뿐만 아니라, 1월에 한 번 밀리고 3월에 한 번 더 밀려 총 연체액이 2달 치 월세인 100만 원이 되는 순간 해지권이 발생합니다.",
      whyItMatters: "개인 사정으로 송금을 깜빡하거나 늦췄다가 계약을 도중에 강제 해지당하고 급히 이사해야 하는 곤란한 상황에 부딪힐 수 있습니다.",
      evidence: [
        {
          page: 2,
          quote: "임차인이 월 차임을 2회 이상 연체하는 경우 임대인은 본 계약을 일방적으로 해지할 수 있습니다.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "risk_leg_3",
      title: "사용자 과실에 따른 전액 원상복구 의무",
      severity: "medium",
      plainExplanation: "시간이 흘러 저절로 낡아지는 도배나 장판은 괜찮지만, 못을 박거나 낙서를 하거나 애완동물로 인해 훼손된 부분은 방을 뺄 때 세입자 돈으로 전부 다시 해놓아야 합니다.",
      whyItMatters: "이사를 나갈 때 도배벽지 손상 등을 이유로 집주인이 보증금에서 큰돈을 깎고 돌려주어 보증금 반환 관련 말다툼이 자주 발생합니다.",
      evidence: [
        {
          page: 3,
          quote: "임차인은 계약 종료 시 본 주택을 원상 복구하여 임대인에게 반환하여야 하며, 자연마모를 제외한 고의 또는 과실에 의한 파손은 보수 비용을 전액 부담합니다.",
          confidence: 0.96
        }
      ]
    }
  ],
  moneyItems: [
    {
      id: "money_leg_1",
      amount: "200,000,000원",
      type: "you_pay",
      description: "임대보증금 총액으로, 계약이 만료되어 나갈 때 집주인으로부터 고스란히 돌려받아야 하는 돈",
      evidence: [
        {
          page: 1,
          quote: "임대보증금 금 이억원을 아래와 같이 지불하기로 한다.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "money_leg_2",
      amount: "20,000,000원",
      type: "you_pay",
      description: "계약 당일(2026-07-01) 지급하고 보관증을 수령한 계약금",
      evidence: [
        {
          page: 1,
          quote: "계약금 20,000,000원은 계약 시 임대인에게 지급하고 영수한다.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "money_leg_3",
      amount: "180,000,000원",
      type: "you_pay",
      description: "입주 당일 집주인에게 이체하고 키를 인계받아야 하는 보증금 잔금",
      evidence: [
        {
          page: 1,
          quote: "잔금 180,000,000원은 2026년 8월 1일에 지불한다.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "money_leg_4",
      amount: "500,000원 / 월",
      type: "you_pay",
      description: "매월 1일에 집주인의 지정 계좌로 입금해야 하는 월세 (선불)",
      evidence: [
        {
          page: 1,
          quote: "월세 500,000원은 매월 1일에 지불하며, 계좌번호는 신한은행 임대인 예금주 앞이다.",
          confidence: 0.97
        }
      ]
    },
    {
      id: "money_leg_5",
      amount: "80,000원 / 월",
      type: "you_pay",
      description: "관리비 명목으로 매월 말일에 관리사무소에 별도 청구 및 입금",
      evidence: [
        {
          page: 4,
          quote: "정액 관리비 80,000원은 매월 말일까지 임차인이 별도로 납부한다.",
          confidence: 0.94
        }
      ]
    }
  ],
  timeline: [
    {
      id: "time_leg_1",
      dateText: "2026-07-01",
      meaning: "계약 체결일. 계약금 2,000만 원을 지급하고 임대차 표준계약서에 날인한 날",
      urgency: "low",
      evidence: [
        {
          page: 1,
          quote: "본 계약은 2026년 7월 1일에 성립되었습니다.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "time_leg_2",
      dateText: "2026-08-01",
      meaning: "잔금 치르는 날이자 입주하는 날. '전입신고'와 '확정일자'를 받는 가장 중요한 날",
      urgency: "high",
      evidence: [
        {
          page: 1,
          quote: "잔금 1억 8천만 원은 2026년 8월 1일에 지급하고, 임대주택의 인도는 이 날로 한다.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "time_leg_3",
      dateText: "매월 1일",
      meaning: "월세 납부일. 하루라도 늦어지면 지연이자가 청구될 수 있으므로 자동이체 설정 추천",
      urgency: "medium",
      evidence: [
        {
          page: 1,
          quote: "월 차임은 매월 1일에 선불로 지급한다.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "time_leg_4",
      dateText: "2028-08-01",
      meaning: "2년 만기 종료일. 재계약 여부를 논의하거나 보증금을 돌려받고 나가는 날",
      urgency: "medium",
      evidence: [
        {
          page: 1,
          quote: "임대차 기간은 2026년 8월 1일부터 2028년 8월 1일까지로 한다.",
          confidence: 0.99
        }
      ]
    }
  ],
  actions: [
    {
      id: "act_leg_1",
      task: "잔금일 당일 확정일자 부여받고 전입신고하기",
      priority: "high",
      reason: "전입신고와 확정일자를 즉시 받아둬야 다른 대출 권리자들로부터 나의 보증금을 안전하게 지키는 대항력과 우선변제권이 생깁니다. 절대 미루면 안 됩니다.",
      evidence: [
        {
          page: 2,
          quote: "임차인은 주택의 인도와 전입신고를 마치고 계약서에 확정일자를 받아 우선변제권을 취득해야 합니다.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "act_leg_2",
      task: "잔금 납부 전 등기부등본 최종 확인하기",
      priority: "high",
      reason: "계약을 한 날(7월 1일)부터 이사하는 날(8월 1일) 사이에 혹시 집주인이 몰래 추가 대출을 받았거나 가압류가 들어오지 않았는지 잔금 이체 직전에 직접 떼서 확인해야 합니다.",
      evidence: [
        {
          page: 4,
          quote: "임대인은 계약 후 잔금일까지 근저당 설정 등 본 주택의 담보가치를 훼손하는 등기 행위를 금한다.",
          confidence: 0.93
        }
      ]
    },
    {
      id: "act_leg_3",
      task: "입주 첫날 집 내부 구석구석 사진 촬영하기",
      priority: "medium",
      reason: "벽지 손상, 문고리 파손, 보일러 누수 등을 입주할 때의 사진으로 남겨두어야 나중에 이사 나갈 때 원상복구 분쟁이 터졌을 때 내가 부수지 않았음을 증명할 수 있습니다.",
      evidence: [
        {
          page: 3,
          quote: "임차인은 임대차 계약 해지 시 본 주택을 인수한 상태대로 원상으로 회복하여 임대인에게 반환한다.",
          confidence: 0.95
        }
      ]
    }
  ],
  personaBrief: {
    child: "내가 살 튼튼한 집을 집주인 삼촌에게 빌려서 살기로 약속하는 편지예요. 약속한 돈(보증금과 월세)을 늦지 않게 주인 삼촌 지갑에 쏙 보내줘야 하고, 문이나 벽을 스티커나 못으로 망가뜨리면 나갈 때 깨끗하게 닦아 놓거나 새로 사줘야 해요. 나중에 이사 갈 때는 주인 삼촌이 처음에 냈던 보증금을 돌려줘서, 다른 멋진 집을 또 빌릴 수 있답니다!",
    senior: "어르신, 재산을 꼭 지키시기 위해 이 두 가지만 약속하십시오! 첫째, 8월 1일에 이사 들어가시는 날, 가방에 계약서를 챙겨서 꼭 '동사무소(주민센터)'에 먼저 가십시오. 가셔서 전입신고를 하시면서 '확정일자를 꼭 도장으로 찍어달라'고 말씀하셔야 2억 원을 한 푼도 안 잃고 나라에서 법으로 보호해 줍니다. 둘째, 매달 1일에 내시는 월세 50만 원은 자동이체를 걸어서 밀리지 않게 통장에 늘 입금해두십시오.",
    general: "이 계약서는 보증금 2억 원, 월세 50만 원, 계약 기한 2년의 주택임대차 계약서입니다. 임차인은 보증금의 법적 대항력 취득을 위해 이사 당일(2026년 8월 1일) 전입신고와 확정일자 날인을 완료해야 합니다. 차임액이 2회분 이상 연체 시 즉시 계약 해지될 수 있으며, 퇴거 시 임차인의 고의/과실 파손에 대해 원상복구 의무가 적용됩니다.",
    expert: "본 계약은 임대인과 임차인 간에 체결되는 임대보증금 200,000,000원(계약금 20,000,000원, 잔금 180,000,000원) 및 월 차임 500,000원(익월 1일 선불)의 주택 임대차 계약입니다. 임차인은 민법 및 주택임대차보호법에 준하는 대항 요건과 우선변제권 취득을 위해 주택의 인도 및 주민등록(전입신고), 확정일자 요건을 구비해야 합니다. 차임 연체액이 2기(총 1,000,000원)에 달할 시 임대인은 민법 제640조에 기거하여 일방적 해지통보를 할 수 있으며, 계약 종료 시 임차인의 원상회복 의무(민법 제615조)에 의거한 시설 복구 분쟁을 방지하기 위해 인도 당시의 현황 자료 확보를 권장합니다."
  },
  disclaimer: "Cerebras DocLens은 문서 이해를 돕는 AI 도구입니다. 법률, 의료, 보험, 금융에 대한 전문 자문을 대체하지 않습니다. 중요한 결정 전에는 반드시 전문가 또는 해당 기관에 확인하세요."
};

export const mockMedicalResult: FinalAnalysisResult = {
  document: {
    id: "doc_medical_sample",
    fileName: "수술동의서_및_부작용_설명서.pdf",
    fileType: "pdf",
    pageCount: 8,
    uploadedAt: "2026-06-28T23:57:00Z",
    documentType: "medical",
    language: "ko"
  },
  executiveSummary: [
    "이 문서는 전신 마취 하 진행되는 복강경 맹장 절제 수술에 대한 설명 및 부작용 동의서입니다.",
    "수술 중 대량 출혈, 감염, 유착 등의 부작용과 드물게 사망에 이를 수 있는 전신 마취 리스크에 동의하고 서명하는 서류입니다.",
    "수술 전 최소 8시간 이상의 금식(물 포함)이 의무화되며, 수술 후 합병증 예방을 위해 조기 보행이 적극적으로 권장됩니다."
  ],
  keyPoints: [
    "수술 대상: 전신 마취 하 복강경 맹장 절제술 (Appendix Extirpation)",
    "부작용 설명: 장기 유착(Adhesion), 술 후 감염, 마취제 과민반응",
    "금식 수칙: 수술 전날 밤 12시부터 당일 수술 전까지 물 포함 철저 금식",
    "비용 안내: 건강보험 비급여 항목(정밀 유착 방지제 등 약 40만 원 상당) 포함에 대한 동의"
  ],
  risks: [
    {
      id: "risk_med_1",
      title: "전신 마취 후유증 및 면책 동의",
      severity: "high",
      plainExplanation: "수술을 위해 전신 마취를 할 때, 특이 체질이나 알레르기로 인해 혈압이 낮아지거나 호흡이 멈추는 돌발 상황이 생길 수 있으며 병원은 이에 대한 과실이 없는 한 면책됩니다.",
      whyItMatters: "매우 드물지만 생명이 위험해질 수 있는 중대한 부작용이므로, 환자 본인과 보호자가 수술 전 반드시 마취통증의학과 전문의와 면담하고 가족력을 미리 알려야 합니다.",
      evidence: [
        {
          page: 3,
          quote: "마취 약제에 의한 과민반응, 심혈관계 허탈 등 예기치 못한 합병증이 발생할 수 있으며, 의료진의 과실이 없는 경우 병원은 이에 대한 책임을 지지 않습니다.",
          confidence: 0.95
        }
      ]
    },
    {
      id: "risk_med_2",
      title: "복강경 수술 도중 개복 수술로의 전환 가능성",
      severity: "medium",
      plainExplanation: "배에 작은 구멍을 뚫어 도구로 수술하다가(복강경), 염증이 너무 심해 다른 장기와 딱 달라붙어 있거나 피가 많이 나면 환자의 생명을 위해 배를 길게 가르는 개복 수술로 즉시 바뀔 수 있습니다.",
      whyItMatters: "수술 방법이 바뀌면 흉터가 커지고 입원 기간과 병원비가 크게 늘어날 수 있습니다.",
      evidence: [
        {
          page: 5,
          quote: "해부학적 변이, 심한 유착, 대량 출혈 발생 시 환자의 안전을 위해 수술 도중 예고 없이 개복술로 전환할 수 있습니다.",
          confidence: 0.93
        }
      ]
    },
    {
      id: "risk_med_3",
      title: "건강보험 적용이 안 되는 고가 소모품(비급여) 동의",
      severity: "medium",
      plainExplanation: "수술 부위가 장기와 달라붙지 않게 해주는 '유착 방지제'나 상처를 빨리 아물게 하는 '피부 접착제'는 나라에서 건강보험 돈을 안 대주기 때문에 환자가 100% 본인 돈으로 사서 써야 합니다.",
      whyItMatters: "병원비 정산 시 예상보다 40~50만 원가량 추가 요금이 나올 수 있으므로, 원치 않으면 사전에 거부 의사를 밝혀야 합니다.",
      evidence: [
        {
          page: 7,
          quote: "수술 중 사용되는 유착방지제, 조직 접착제 등은 비급여 항목으로 환자 본인이 전액 부담하는 것에 동의합니다.",
          confidence: 0.94
        }
      ]
    }
  ],
  moneyItems: [
    {
      id: "money_med_1",
      amount: "400,000원 상당",
      type: "you_pay",
      description: "건강보험 혜택이 적용되지 않는 비급여 소모품(유착 방지제 및 정밀 수술 도구) 가격",
      evidence: [
        {
          page: 7,
          quote: "비급여 소모품의 예상 비용은 400,000원 내외입니다.",
          confidence: 0.97
        }
      ]
    },
    {
      id: "money_med_2",
      amount: "1,200,000원 내외",
      type: "conditional",
      description: "수술 및 3박 4일 기본 입원 시 발생하는 총 본인 부담 병원비 (급여 환자 기준)",
      evidence: [
        {
          page: 8,
          quote: "표준 입원(3~4일) 시 수술 및 본인 부담 진료비는 약 1,200,000원 선으로 예상됩니다.",
          confidence: 0.92
        }
      ]
    }
  ],
  timeline: [
    {
      id: "time_med_1",
      dateText: "수술 전 8시간",
      meaning: "물, 껌, 사탕을 포함하여 완벽한 금식 상태 유지. 마취 중 음식물이 기도로 넘어가서 질식하는 사고를 예방하기 위한 절대 필수 기한",
      urgency: "high",
      evidence: [
        {
          page: 2,
          quote: "환자는 수술 전 최소 8시간 동안 물을 포함하여 일체의 음식 섭취를 금해야 합니다.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "time_med_2",
      dateText: "수술 후 12시간 이내",
      meaning: "수술 후 병실에 와서 가스가 나오거나 물을 마시기 시작하는 권장 시점. 수술 부위의 출혈이나 가스 배출 여부를 확인하는 시간",
      urgency: "medium",
      evidence: [
        {
          page: 6,
          quote: "수술 후 약 12시간이 경과하고 가스 배출(방귀)이 확인된 후 미음부터 식사가 가능합니다.",
          confidence: 0.95
        }
      ]
    },
    {
      id: "time_med_3",
      dateText: "수술 후 14일",
      meaning: "실밥 제거 및 수술 부위 상처 치유 확인 기간. 이 기간 전까지는 물이 닿지 않도록 방수 밴드 사용 및 샤워 금지",
      urgency: "medium",
      evidence: [
        {
          page: 6,
          quote: "봉합사 제거(실밥 뽑기)는 일반적으로 수술 후 14일 경 외래 진료 시 시행합니다.",
          confidence: 0.96
        }
      ]
    }
  ],
  actions: [
    {
      id: "act_med_1",
      task: "수술 전날 밤 12시부터 완전 금식하기 (물 포함)",
      priority: "high",
      reason: "마취를 하면 위장 운동이 멈추기 때문에 위에 음식이 남아 있으면 구토를 하여 기도를 막거나 폐렴을 일으켜 생명이 위험할 수 있습니다.",
      evidence: [
        {
          page: 2,
          quote: "수술 전 8시간 금식은 마취 흡인성 폐렴을 방지하기 위한 절대 필수 사항입니다.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "act_med_2",
      task: "평소 복용하는 아스피린, 항응고제 복용 중단 여부 의사와 확인하기",
      priority: "high",
      reason: "피를 맑게 하는 약(아스피린 등)은 피를 잘 안 멈추게 만들어서 수술 중 대량 출혈을 일으킬 수 있으므로 수술 5~7일 전 중단해야 하는지 의사와 상의해야 합니다.",
      evidence: [
        {
          page: 2,
          quote: "항혈소판제 및 아스피린 복용 환자는 출혈 예방을 위해 사전에 담당 의사와 약물 복용 중단 시기를 논의해야 합니다.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "act_med_3",
      task: "수술 후 보행 훈련 즉시 시작하기",
      priority: "medium",
      reason: "배를 수술한 후 침대에만 누워 있으면 장기가 서로 달라붙는 '유착'이 생기거나 다리 피가 굳어 폐를 막는 위험한 병이 생길 수 있으므로, 아프더라도 조금씩 걸어 다녀야 장이 빨리 제자리로 돌아옵니다.",
      evidence: [
        {
          page: 6,
          quote: "수술 후 장 마비 및 유착을 예방하기 위해 환자의 자발적 조기 보행을 권장합니다.",
          confidence: 0.96
        }
      ]
    }
  ],
  personaBrief: {
    child: "배가 아파서 나쁜 맹장을 떼어내는 수술을 받기 전에, 의사 선생님이 부모님께 수술하는 법과 조심할 점을 알려주는 편지예요. 수술하기 전에는 배 속을 깨끗하게 비워야 해서 물도 마시면 안 된대요! 그리고 수술실에서 잠에서 깬 다음에는 아프더라도 씩씩하게 복도를 꼬마 펭귄처럼 아장아장 걸어 다녀야 장이 꼬이지 않고 빨리 나아서 집에 갈 수 있어요!",
    senior: "어르신, 수술을 받으시기 전에 이 세 가지만 꼭 지켜주십시오. 첫째, 수술 전날 밤 12시부터는 물도 한 모금 드시면 절대 안 됩니다. 마취 중에 기도로 침이나 물이 넘어가면 아주 큰일 납니다. 둘째, 평소 드시는 혈압약이나 피를 맑게 하는 아스피린 약이 있다면 의사 선생님께 당장 말씀하시어 며칠 전부터 끊을지 지시를 받으셔야 수술 시 피가 잘 멈춥니다. 셋째, 수술 끝나고 아프시더라도 병동 복도를 억지로라도 조금씩 걸으셔야 장이 들러붙는 유착을 막을 수 있습니다.",
    general: "본 문서는 복강경 하 맹장 절제술에 대한 수술 설명 및 부작용 동의서입니다. 수술 전 최소 8시간 동안 물을 포함하여 절대 금식해야 하며, 지혈 작용을 억제하는 아스피린 등 복용 중인 약물이 있다면 사전에 의사와 조율해야 합니다. 수술 중 부작용(유착, 출혈 등) 발생 시 개복술로 전환될 가능성이 있으며, 수술 후에는 유착 예방을 위해 조기 보행이 적극적으로 권장됩니다.",
    expert: "본 동의서는 전신 마취 하 진행되는 복강경 충수절제술(Laparoscopic Appendectomy)의 절차 및 잠재적 리스크에 대한 환자의 고지 및 동의(Informed Consent) 법률 문서입니다. 마취 전 흡인성 폐렴(Aspiration Pneumonia) 예방을 위해 NPO(금식) 8시간 준수가 의무화되며, 지혈 방해를 유도하는 항응고성 약물은 수술 5-7일 전 중단 여부를 평가해야 합니다. 술 후 합병증으로 장폐색(Ileus) 및 유착(Adhesion) 리스크가 존재하며, 이를 최소화하기 위한 조기 보행(Early Ambulation)이 지시됩니다. 수술 도중 불가항력적인 대량 출혈 또는 심한 염증 유착 발견 시 긴급 개복술(Laparotomy) 전환 가능성과 국민건강보험 비급여 소모품 적용 비용 부담에 서명 동의함을 입증합니다."
  },
  disclaimer: "Cerebras DocLens은 문서 이해를 돕는 AI 도구입니다. 법률, 의료, 보험, 금융에 대한 전문 자문을 대체하지 않습니다. 중요한 결정 전에는 반드시 전문가 또는 해당 기관에 확인하세요."
};

export const mockInsuranceResultEn: FinalAnalysisResult = {
  document: {
    id: "doc_insurance_sample_en",
    fileName: "CarePlus_Cancer_Insurance_Policy.pdf",
    fileType: "pdf",
    pageCount: 124,
    uploadedAt: "2026-06-28T23:55:00Z",
    documentType: "insurance",
    language: "en"
  },
  executiveSummary: [
    "This policy regulates the cancer diagnosis benefit and hospitalization/surgery coverage upon cancer confirmation.",
    "A 90-day waiting (exclusion) period applies from the initial contract date; cancers diagnosed during this period are not covered.",
    "A 50% benefit reduction clause applies if diagnosed with general cancer within the first year (365 days) of the contract."
  ],
  keyPoints: [
    "Pays 50,000,000 KRW lump-sum upon general cancer diagnosis (limited to once per lifetime).",
    "Pays 10,000,000 KRW (20% of general cancer benefit) for minor cancers (thyroid, boundary tumors, etc.).",
    "Pays 100,000 KRW per day for cancer-related hospitalizations lasting 4+ days (up to 120 days).",
    "Excludes coverage for self-inflicted harm or intentional accidents (liability waiver)."
  ],
  risks: [
    {
      id: "risk_ins_1",
      title: "Cancer Coverage Waiting Period (90-Day Exclusion)",
      severity: "high",
      plainExplanation: "Even after purchasing the policy, you will not receive any benefit for cancers diagnosed during the first 90 days. Instead, the contract is canceled as void.",
      whyItMatters: "If diagnosed immediately after signing up, you only get your premiums back and receive zero coverage for major medical expenses.",
      evidence: [
        {
          page: 12,
          quote: "The day after 90 days have elapsed from the contract date shall be the cancer coverage start date. If diagnosed within this period, the contract is null and void.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "risk_ins_2",
      title: "Definition of Cancer & Diagnostic Dispute Clause",
      severity: "medium",
      plainExplanation: "Diagnoses from alternative medicine centers or oriental medicine clinics are not accepted. You must provide a biopsy report signed by a pathologist at a general/university hospital.",
      whyItMatters: "A simple doctor's note or general certificate may cause claim denial or heavy review delays.",
      evidence: [
        {
          page: 25,
          quote: "The diagnosis of cancer must be determined by a specialist licensed in pathology or diagnostic medicine, based on microscopic findings of tissue biopsy or fine-needle aspiration.",
          confidence: 0.95
        }
      ]
    },
    {
      id: "risk_ins_3",
      title: "50% Benefit Reduction in the First Year",
      severity: "high",
      plainExplanation: "Even after the 90-day waiting period, if cancer is diagnosed within 1 year (365 days) of signing up, you only receive half (50%) of the promised payout.",
      whyItMatters: "If a high-cost cancer is diagnosed early, you will face a significant coverage gap and higher out-of-pocket costs.",
      evidence: [
        {
          page: 14,
          quote: "If cancer is diagnosed within less than 1 year from the contract date, 50% of the general cancer diagnosis benefit shall be paid.",
          confidence: 0.97
        }
      ]
    }
  ],
  moneyItems: [
    {
      id: "money_ins_1",
      amount: "50,000,000 KRW",
      type: "you_receive",
      description: "General cancer diagnosis lump-sum benefit (once per lifetime)",
      evidence: [
        {
          page: 8,
          quote: "Upon diagnosis of general cancer, the sum of 50,000,000 KRW shall be paid (limited to the first diagnosis).",
          confidence: 0.99
        }
      ]
    },
    {
      id: "money_ins_2",
      amount: "10,000,000 KRW",
      type: "you_receive",
      description: "Benefit for minor/similar cancers (thyroid, border tumors, etc.)",
      evidence: [
        {
          page: 9,
          quote: "For similar cancers, 20% of the sum (10,000,000 KRW) shall be paid.",
          confidence: 0.97
        }
      ]
    },
    {
      id: "money_ins_3",
      amount: "100,000 KRW / Day",
      type: "you_receive",
      description: "Daily hospitalization allowance for cancer treatments lasting 4+ days (up to 120 days)",
      evidence: [
        {
          page: 15,
          quote: "For hospitalization exceeding 3 days for cancer treatment, 100,000 KRW per day shall be paid starting on the 4th day.",
          confidence: 0.96
        }
      ]
    },
    {
      id: "money_ins_4",
      amount: "45,000 KRW / Month",
      type: "you_pay",
      description: "Monthly premium deducted automatically on the 25th",
      evidence: [
        {
          page: 2,
          quote: "The monthly premium payable on the 25th of each month is 45,000 KRW.",
          confidence: 0.99
        }
      ]
    }
  ],
  timeline: [
    {
      id: "time_ins_1",
      dateText: "90 Days after Signup",
      meaning: "End of exclusion period. Cancer coverage officially starts on Day 91.",
      urgency: "high",
      evidence: [
        {
          page: 12,
          quote: "Coverage begins on the day after 90 days have elapsed from the contract date.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "time_ins_2",
      dateText: "1 Year after Signup (365 Days)",
      meaning: "End of 50% reduction period. 100% (50M KRW) benefit is unlocked.",
      urgency: "medium",
      evidence: [
        {
          page: 14,
          quote: "100% of the benefit shall be paid for diagnoses after 1 year has elapsed.",
          confidence: 0.97
        }
      ]
    },
    {
      id: "time_ins_3",
      dateText: "Within 3 Years of Diagnosis",
      meaning: "Statute of limitations for claims. The right to claim expires after 3 years.",
      urgency: "high",
      evidence: [
        {
          page: 45,
          quote: "The right to claim insurance benefits expires if not exercised within 3 years.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "time_ins_4",
      dateText: "2 Months after Grace Period",
      meaning: "Termination of policy due to non-payment. Automatically terminated if premiums are overdue for 2 months.",
      urgency: "medium",
      evidence: [
        {
          page: 38,
          quote: "If premium payments are overdue, the company notifies with a grace period of 14+ days, after which the contract is terminated.",
          confidence: 0.94
        }
      ]
    }
  ],
  actions: [
    {
      id: "act_ins_1",
      task: "Obtain a general/university hospital pathology (biopsy) report",
      priority: "high",
      reason: "Required by insurers to verify cancer cell presence. General certificates without histological pathology logs cause heavy payout delays.",
      evidence: [
        {
          page: 25,
          quote: "Diagnosis must be based on tissue pathology reports by certified pathologists.",
          confidence: 0.96
        }
      ]
    },
    {
      id: "act_ins_2",
      task: "File insurance claim within 3 years of diagnosis",
      priority: "high",
      reason: "Failing to do so waives your rights under commercial law, making it impossible to receive benefits.",
      evidence: [
        {
          page: 45,
          quote: "Claims are barred by a 3-year limitation.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "act_ins_3",
      task: "Avoid booking general checkups during the first 90 days",
      priority: "medium",
      reason: "If cancer is incidentally found during minor screening tests in the exclusion window, the policy is terminated and nothing is paid.",
      evidence: [
        {
          page: 12,
          quote: "If diagnosed in the waiting period, the contract is void and only premiums are refunded.",
          confidence: 0.95
        }
      ]
    }
  ],
  personaBrief: {
    child: "This is a magic piggy bank for when you get sick. It helps your parents pay for doctor fees so they don't have to worry! But there's a catch: for the first 90 days (about three months), the piggy bank stays locked even if you get sick. And if you hurt yourself on purpose, the piggy bank won't open!",
    senior: "Dear senior, remember three things: First, no cancer benefits are paid during the first 90 days. Coverage starts on Day 91. Second, ask your doctor for a copy of the 'tissue biopsy pathology report'—you need this file to get paid easily. Third, if diagnosed in Year 1, you only get 50% of the benefit. Mark the 1-year anniversary on your calendar when the full 100% coverage unlocks.",
    general: "This is an insurance policy paying a 50M KRW diagnosis benefit for general cancer and 10M KRW for minor cancers. It enforces a 90-day waiting period and a 1-year 50% benefit reduction. Biopsy reports from hospital pathologists are mandatory for claims. Payout claims must be filed within 3 years.",
    expert: "This policy governs fixed-benefit payouts for neoplasms. Per Article 12, a 90-day exclusion period applies, during which KCD C-code malignant neoplasms render the contract void. Under Article 14, benefits are reduced by 50% in Year 1. Diagnostics must be proven via histological pathology reports (Article 25), subject to a 3-year statute of limitations (Commercial Code Art. 662)."
  },
  disclaimer: "Cerebras DocLens is an AI helper tool. It does not replace professional legal, medical, insurance, or financial advice. Always consult a professional or institution before making critical decisions."
};

export const mockLegalResultEn: FinalAnalysisResult = {
  document: {
    id: "doc_legal_sample_en",
    fileName: "Residential_Lease_Agreement.pdf",
    fileType: "pdf",
    pageCount: 6,
    uploadedAt: "2026-06-28T23:56:00Z",
    documentType: "legal",
    language: "en"
  },
  executiveSummary: [
    "Standard lease agreement for a residential property in Mapo-gu, Seoul, with a 200M KRW deposit, 500k KRW monthly rent, and a 2-year term.",
    "To protect the deposit, the tenant must register residency (moving-in report) and obtain a fixed-date stamp immediately on move-in day.",
    "The landlord can terminate the lease if rent is unpaid for 2 months (accumulated or consecutive)."
  ],
  keyPoints: [
    "20M KRW contract deposit paid on signing; 180M KRW balance paid on move-in.",
    "Monthly rent of 500,000 KRW payable in advance on the 1st of each month.",
    "Lease term is 2 years (August 1, 2026, to August 1, 2028).",
    "Special clause: contract void and deposit refunded if tenant's lease loan is rejected."
  ],
  risks: [
    {
      id: "risk_leg_1",
      title: "Ambiguity on Additional Mortgages by Landlord on Move-in Day",
      severity: "high",
      plainExplanation: "The clause preventing the landlord from taking bank loans on move-in day lacks clear penalties and specific date bounds, creating a risk.",
      whyItMatters: "Tenant's legal protection (opposing power) starts at 0:00 the day after residency registration. If the landlord takes a bank loan on move-in day, the bank's mortgage will take priority over the tenant's deposit.",
      evidence: [
        {
          page: 4,
          quote: "The landlord shall not establish new mortgage rights on the property until the day after the balance is paid. (No penalty or void conditions specified)",
          confidence: 0.92
        }
      ]
    },
    {
      id: "risk_leg_2",
      title: "Immediate Eviction Clause for 2-Month Rent Arrears",
      severity: "high",
      plainExplanation: "If rent is overdue by a total of 2 months' rent (1,000,000 KRW), the landlord can unilaterally cancel the contract and demand eviction.",
      whyItMatters: "Missing or delaying payments due to forgetfulness or temporary cash flow issues could lead to forced lease termination.",
      evidence: [
        {
          page: 2,
          quote: "If the tenant delays rent payments by 2 times or more, the landlord may terminate this agreement.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "risk_leg_3",
      title: "Tenant Obligation for Restoration to Original State",
      severity: "medium",
      plainExplanation: "Tenants are not liable for natural wear-and-tear, but must pay to repair wall damage from nails, scribbles, or pet damage before moving out.",
      whyItMatters: "Common source of disputes; landlords often deduct large repair fees from the deposit upon move-out.",
      evidence: [
        {
          page: 3,
          quote: "The tenant shall restore the property to its original condition upon termination. Tenant pays full cost for repairs of damages caused by intent or negligence.",
          confidence: 0.96
        }
      ]
    }
  ],
  moneyItems: [
    {
      id: "money_leg_1",
      amount: "200,000,000 KRW",
      type: "you_pay",
      description: "Total security deposit refunded to the tenant upon lease expiration",
      evidence: [
        {
          page: 1,
          quote: "Security deposit of 200,000,000 KRW shall be paid as follows.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "money_leg_2",
      amount: "20,000,000 KRW",
      type: "you_pay",
      description: "Contract deposit paid on the signing date (July 1, 2026)",
      evidence: [
        {
          page: 1,
          quote: "Contract deposit of 20,000,000 KRW is paid and receipted on signing.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "money_leg_3",
      amount: "180,000,000 KRW",
      type: "you_pay",
      description: "Remaining balance paid on move-in day (August 1, 2026)",
      evidence: [
        {
          page: 1,
          quote: "The balance of 180,000,000 KRW is payable on August 1, 2026.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "money_leg_4",
      amount: "500,000 KRW / Month",
      type: "you_pay",
      description: "Monthly rent payable in advance on the 1st of each month",
      evidence: [
        {
          page: 1,
          quote: "Monthly rent of 500,000 KRW is paid in advance on the 1st of each month.",
          confidence: 0.97
        }
      ]
    },
    {
      id: "money_leg_5",
      amount: "80,000 KRW / Month",
      type: "you_pay",
      description: "Fixed maintenance fee billed separately at the end of each month",
      evidence: [
        {
          page: 4,
          quote: "A fixed maintenance fee of 80,000 KRW is paid separately by the tenant.",
          confidence: 0.94
        }
      ]
    }
  ],
  timeline: [
    {
      id: "time_leg_1",
      dateText: "July 1, 2026",
      meaning: "Contract signing date. 20M KRW deposit paid.",
      urgency: "low",
      evidence: [
        {
          page: 1,
          quote: "This contract was concluded on July 1, 2026.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "time_leg_2",
      dateText: "August 1, 2026",
      meaning: "Move-in and balance payment day. Crucial day to register residency and get a fixed-date stamp.",
      urgency: "high",
      evidence: [
        {
          page: 1,
          quote: "The balance is paid and key handover occurs on August 1, 2026.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "time_leg_3",
      dateText: "1st of Every Month",
      meaning: "Monthly rent due date. Setting up automatic transfers is recommended to prevent defaults.",
      urgency: "medium",
      evidence: [
        {
          page: 1,
          quote: "Rent is payable on the 1st day of each month in advance.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "time_leg_4",
      dateText: "August 1, 2028",
      meaning: "2-year lease expiration. Day to renew the contract or receive the deposit back.",
      urgency: "medium",
      evidence: [
        {
          page: 1,
          quote: "The lease period shall run from August 1, 2026, to August 1, 2028.",
          confidence: 0.99
        }
      ]
    }
  ],
  actions: [
    {
      id: "act_leg_1",
      task: "Register residency and get a fixed-date stamp on move-in day",
      priority: "high",
      reason: "Secures your opposing power and preferential payment rights under housing protection laws. Do not delay.",
      evidence: [
        {
          page: 2,
          quote: "The tenant must complete moving-in registration and fixed-date stamping to secure priority rights.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "act_leg_2",
      task: "Verify property registry (certified copy) right before paying the balance",
      priority: "high",
      reason: "Ensure the landlord has not taken out new loans or received seizure notices between signing and moving in.",
      evidence: [
        {
          page: 4,
          quote: "Landlord is prohibited from altering registry status until the balance date.",
          confidence: 0.93
        }
      ]
    },
    {
      id: "act_leg_3",
      task: "Take photos of the property's condition on move-in day",
      priority: "medium",
      reason: "Serves as evidence for natural wear-and-tear vs tenant damages, avoiding restoration fee disputes upon moving out.",
      evidence: [
        {
          page: 3,
          quote: "Tenant shall return the property in its received state, excluding natural wear.",
          confidence: 0.95
        }
      ]
    }
  ],
  personaBrief: {
    child: "This is a letter to rent a cozy house from a landlord. We pay pocket money (rent) every month, and we shouldn't ruin the walls or doors. When we move out, the landlord returns the big deposit money we gave at first so we can find another nice home!",
    senior: "Dear senior, to protect your money: First, on moving day (Aug 1), go straight to the local community center with your lease contract. Register your move and get a 'fixed-date stamp'—this is a legal shield for your 200M KRW deposit. Second, pay your monthly rent on the 1st without fail to prevent eviction.",
    general: "This lease agreement specifies a 200M KRW deposit, 500k KRW monthly rent, and a 2-year term. Tenants must register residency and obtain a fixed-date stamp on move-in day (Aug 1, 2026) to secure priority payment rights. Lease termination applies if rent is overdue by 2 months' value.",
    expert: "This contract covers a residential tenancy with a 200M KRW security deposit and 500k KRW monthly rent. Tenants must fulfill residency registration and fixed-date stamping per the Housing Lease Protection Act to establish opposability. Rent default of 2 periods triggers landlord's right to terminate (Civ. Code Art. 640). Restitutio in integrum applies on move-out (Civ. Code Art. 615)."
  },
  disclaimer: "Cerebras DocLens is an AI helper tool. It does not replace professional legal, medical, insurance, or financial advice. Always consult a professional or institution before making critical decisions."
};

export const mockMedicalResultEn: FinalAnalysisResult = {
  document: {
    id: "doc_medical_sample_en",
    fileName: "Surgery_Consent_Form.pdf",
    fileType: "pdf",
    pageCount: 8,
    uploadedAt: "2026-06-28T23:57:00Z",
    documentType: "medical",
    language: "en"
  },
  executiveSummary: [
    "This document is a consent form for a laparoscopic appendectomy under general anesthesia.",
    "By signing, the patient acknowledges surgical risks (bleeding, infection, adhesion) and general anesthesia hazards (temporary low blood pressure/respiratory arrest).",
    "Fasting for 8+ hours (including water) before surgery is mandatory; early ambulation post-surgery is highly advised to avoid complications."
  ],
  keyPoints: [
    "Procedure: Laparoscopic appendectomy under general anesthesia.",
    "Risk factors: Adhesion, post-op infection, allergic reactions to anesthetics.",
    "Fasting rule: No food or water after 12:00 AM (midnight) prior to surgery.",
    "Uncovered cost: Consent for non-reimbursed items (adhesion barrier) costing ~400k KRW."
  ],
  risks: [
    {
      id: "risk_med_1",
      title: "General Anesthesia Side Effects and Hospital Liability Release",
      severity: "high",
      plainExplanation: "During general anesthesia, allergic reactions or specific medical conditions may cause dangerous drops in blood pressure or respiratory failure. The hospital is exempt from liability unless medical negligence is proven.",
      whyItMatters: "Though rare, this is a life-threatening risk. Patients must consult the anesthesiologist beforehand and report family medical history.",
      evidence: [
        {
          page: 3,
          quote: "Unexpected complications like anesthetic hypersensitivity or cardiovascular collapse may occur. The medical team is not liable in the absence of negligence.",
          confidence: 0.95
        }
      ]
    },
    {
      id: "risk_med_2",
      title: "Potential Transition to Open Surgery (Laparotomy)",
      severity: "medium",
      plainExplanation: "If severe inflammation, bleeding, or adhesions to other organs are found during laparoscopic surgery, the surgeon may switch to an open incision for patient safety.",
      whyItMatters: "Switching to open surgery increases scarring, hospital stay length, and medical costs.",
      evidence: [
        {
          page: 5,
          quote: "In case of anatomical variation, severe adhesion, or hemorrhage, a transition to laparotomy may occur without prior notice for patient safety.",
          confidence: 0.93
        }
      ]
    },
    {
      id: "risk_med_3",
      title: "Consent for Uncovered Medical Supplies (Non-benefit)",
      severity: "medium",
      plainExplanation: "Items like 'adhesion barriers' or 'skin glues' are not covered by national health insurance, requiring the patient to pay 100% out of pocket.",
      whyItMatters: "Can add 400k to 500k KRW to your final hospital bill. Patients can refuse these items in advance if desired.",
      evidence: [
        {
          page: 7,
          quote: "The patient agrees to bear the full cost of non-reimbursed items such as adhesion barriers and tissue adhesives used during surgery.",
          confidence: 0.94
        }
      ]
    }
  ],
  moneyItems: [
    {
      id: "money_med_1",
      amount: "approx. 400,000 KRW",
      type: "you_pay",
      description: "Cost of non-benefit surgical consumables (adhesion barrier, etc.)",
      evidence: [
        {
          page: 7,
          quote: "Estimated cost of non-reimbursed consumables is around 400,000 KRW.",
          confidence: 0.97
        }
      ]
    },
    {
      id: "money_med_2",
      amount: "approx. 1,200,000 KRW",
      type: "conditional",
      description: "Estimated out-of-pocket medical bill for surgery and a standard 3-day hospital stay",
      evidence: [
        {
          page: 8,
          quote: "Standard surgery and 3-4 day inpatient treatment cost approximately 1,200,000 KRW.",
          confidence: 0.92
        }
      ]
    }
  ],
  timeline: [
    {
      id: "time_med_1",
      dateText: "8 Hours Pre-Surgery",
      meaning: "Absolute fasting. No food, water, gum, or candy to prevent choking/pneumonia under anesthesia.",
      urgency: "high",
      evidence: [
        {
          page: 2,
          quote: "Patient must maintain strict fasting, including water, for at least 8 hours prior to anesthesia.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "time_med_2",
      dateText: "Within 12 Hours Post-Surgery",
      meaning: "Passing of gas and starting soft meals (gruel). Confirms return of normal bowel movements.",
      urgency: "medium",
      evidence: [
        {
          page: 6,
          quote: "Soft diet may resume after flatus (passing gas) is confirmed, usually within 12 hours post-surgery.",
          confidence: 0.95
        }
      ]
    },
    {
      id: "time_med_3",
      dateText: "14 Days Post-Surgery",
      meaning: "Suture removal and outpatient follow-up. Keep the wound dry before this date.",
      urgency: "medium",
      evidence: [
        {
          page: 6,
          quote: "Sutures are generally removed at the outpatient clinic 14 days after surgery.",
          confidence: 0.96
        }
      ]
    }
  ],
  actions: [
    {
      id: "act_med_1",
      task: "Maintain strict fasting starting at 12:00 AM (midnight)",
      priority: "high",
      reason: "Prevents vomiting and aspiration of stomach contents into the lungs while unconscious, which can cause fatal aspiration pneumonia.",
      evidence: [
        {
          page: 2,
          quote: "8-hour fasting is a mandatory safety precaution to prevent aspiration pneumonia.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "act_med_2",
      task: "Confirm with doctor when to stop taking blood thinners (aspirin, etc.)",
      priority: "high",
      reason: "Medications like aspirin thin the blood and prevent clotting, increasing the risk of severe surgical bleeding if not stopped 5-7 days before.",
      evidence: [
        {
          page: 2,
          quote: "Patients on antiplatelets or aspirin must coordinate drug suspension schedules in advance.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "act_med_3",
      task: "Begin walking exercises as soon as possible after surgery",
      priority: "medium",
      reason: "Helps restore bowel function, prevents internal organs from sticking together (adhesion), and lowers the risk of deep vein blood clots.",
      evidence: [
        {
          page: 6,
          quote: "Early ambulation is highly encouraged to prevent postoperative ileus and adhesion.",
          confidence: 0.96
        }
      ]
    }
  ],
  personaBrief: {
    child: "This is a letter for your parents before your tummy surgery to remove a bad appendix. Before going in, you must keep your tummy empty—no water or candy! After waking up, you must walk around the hallway like a brave little penguin, even if it hurts, so your tummy heals quickly!",
    senior: "Dear senior, keep three safety rules in mind: First, do not drink water or eat food after midnight. Food going down the wrong pipe under anesthesia is extremely dangerous. Second, tell your doctor if you take aspirin or blood thinners so they can guide you on stopping them. Third, walk around the ward corridor after surgery to prevent organ adhesion.",
    general: "This consent form details a laparoscopic appendectomy. It mandates 8-hour pre-operative fasting and medication coordination (e.g. stopping aspirin). It details risks of adhesion, hemorrhage, and transition to open surgery, alongside non-reimbursed material costs. Post-operative ambulation is advised.",
    expert: "This informed consent document details laparoscopic appendectomy procedures. Pre-anesthetic NPO (8 hours) is mandatory to prevent aspiration pneumonia. Antiplatelet agents require coordination 5-7 days prior. Risks include postoperative ileus and adhesion, mitigated by early ambulation. Acknowledges laparotomy transition risk and non-reimbursed out-of-pocket costs (~400k KRW)."
  },
  disclaimer: "Cerebras DocLens is an AI helper tool. It does not replace professional legal, medical, insurance, or financial advice. Always consult a professional or institution before making critical decisions."
};

export const mockAflacInsuranceResult: FinalAnalysisResult = {
  document: {
    id: "doc_aflac_sample_ko",
    fileName: "Aflac_Cancer_Care_Classic_Policy_Summary.pdf",
    fileType: "pdf",
    pageCount: 14,
    uploadedAt: "2026-06-28T23:59:00Z",
    documentType: "insurance",
    language: "ko"
  },
  executiveSummary: [
    "본 문서는 미국 Aflac사의 대표적인 암보험 상품의 약관 요약본(매사추세츠 주 양식)입니다.",
    "가입 후 최초 30일 이내에 진단받은 암은 보장에서 제외되는 대기 기간(Waiting Period) 조항이 있습니다.",
    "보험 계약이 평생 보장(Guaranteed Renewable)되지만, 주정부 승인을 받아 전체 요율이 변경될 경우 보험료가 인상될 수 있습니다."
  ],
  keyPoints: [
    "최초 암 진단 시 10,000달러의 일시금 지급 (평생 1회 제한).",
    "암 치료 목적으로 입원 시 1~30일까지 매일 300달러 지급.",
    "화학 요법 및 방사선 치료 비용으로 매달 500달러 보조금 지급.",
    "매년 웰니스 검진(암 스크리닝 등) 진행 시 75달러 환급 제공."
  ],
  risks: [
    {
      id: "risk_aflac_1",
      title: "가입 직후 30일 암 진단 대기 기간 (Exclusion Period)",
      severity: "high",
      plainExplanation: "보험에 가입하고 첫 30일 이내에 암 진단을 받을 경우 보험금이 전혀 지급되지 않습니다. 이 기간 동안 발견된 암은 평생 이 약관을 통해 보장받을 수 없습니다.",
      whyItMatters: "보험 가입 직후 증상이 생겨 검사를 받으실 때, 30일이 경과했는지 반드시 날짜를 계산해 보셔야 손해를 보지 않습니다.",
      evidence: [
        {
          page: 4,
          quote: "We will not pay benefits for Cancer diagnosed during the first 30 days after the Effective Date. Cancers diagnosed within this period are excluded from coverage.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "risk_aflac_2",
      title: "보험료 인상 가능성 (Class Premium Adjustments)",
      severity: "medium",
      plainExplanation: "개인별 나이 증가에 따른 보험료 인상은 없으나, 보험사가 동일한 주(State)에 가입된 같은 상품 그룹(Class)의 위험률 상승을 근거로 전체 가입자의 보험료 인상을 승인받아 청구할 수 있습니다.",
      whyItMatters: "평생 갱신이 보장(Renewable for Life)되지만, 갱신 시점에 보험료가 대폭 올라 유지에 부담이 될 수 있습니다.",
      evidence: [
        {
          page: 2,
          quote: "Aflac reserves the right to change the premium rates on a class basis. We cannot change your premium rates individually, but may change them for all policyholders in your state.",
          confidence: 0.95
        }
      ]
    },
    {
      id: "risk_aflac_3",
      title: "기존 병력 감액 및 배제 (Pre-existing Conditions)",
      severity: "high",
      plainExplanation: "보험 가입 전 12개월 동안 진료, 치료, 투약을 받았던 병력이 있는 경우, 가입 후 최초 12개월 동안 발생한 암 진단에 대해서는 보장하지 않습니다.",
      whyItMatters: "이전에 비슷한 암 관련 정기 추적 관찰이나 정밀 검사를 받으셨다면, 가입 후 최소 1년 동안은 해당 부위 보장을 기대하기 힘듭니다.",
      evidence: [
        {
          page: 5,
          quote: "A Pre-existing Condition is a sickness or physical condition for which medical advice or treatment was recommended or received within 12 months before the Effective Date. No benefits will be paid during the first 12 months.",
          confidence: 0.97
        }
      ]
    }
  ],
  moneyItems: [
    {
      id: "money_aflac_1",
      amount: "10,000 USD",
      type: "you_receive",
      description: "최초 암 확진 시 지급되는 일시 진단금 (First Occurrence Diagnosis Benefit)",
      evidence: [
        {
          page: 7,
          quote: "Aflac will pay $10,000 upon the first occurrence of a diagnosed internal Cancer.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "money_aflac_2",
      amount: "300 USD / Day",
      type: "you_receive",
      description: "암 치료를 위해 입원 시 매일 지급되는 병원 입원 수당 (Hospital Confinement Benefit)",
      evidence: [
        {
          page: 8,
          quote: "We will pay $300 per day for each day you are confined to a hospital for the treatment of Cancer, up to 30 days.",
          confidence: 0.96
        }
      ]
    },
    {
      id: "money_aflac_3",
      amount: "500 USD / Month",
      type: "you_receive",
      description: "화학/방사선 암 치료 지원 보조금 (Chemotherapy/Radiation Benefit)",
      evidence: [
        {
          page: 9,
          quote: "We will pay $500 per month for chemical or radiation therapy treatments received in that month.",
          confidence: 0.95
        }
      ]
    },
    {
      id: "money_aflac_4",
      amount: "75 USD / Year",
      type: "you_receive",
      description: "매년 웰니스 건강검진 완료 시 돌려받는 스크리닝 보조금 (Wellness Benefit)",
      evidence: [
        {
          page: 11,
          quote: "Aflac will pay $75 per calendar year for cancer screening tests per covered person.",
          confidence: 0.99
        }
      ]
    }
  ],
  timeline: [
    {
      id: "time_aflac_1",
      dateText: "가입일 이후 30일",
      meaning: "보험 대기 기간(Waiting Period) 종료. 이 시점 이후 진단받아야 진단금이 전액 정상 지급됩니다.",
      urgency: "high",
      evidence: [
        {
          page: 4,
          quote: "The coverage for Cancer begins after 30 days from the Effective Date of the policy.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "time_aflac_2",
      dateText: "가입일 이후 1년",
      meaning: "기존 병력(Pre-existing Condition) 면책 배제 기간 종료. 이전 지병과 연관된 질환 보장이 정상화됩니다.",
      urgency: "medium",
      evidence: [
        {
          page: 5,
          quote: "Exclusions for pre-existing conditions terminate after the policy has been in force for 12 months.",
          confidence: 0.97
        }
      ]
    },
    {
      id: "time_aflac_3",
      dateText: "매년 12월 31일",
      meaning: "연간 웰니스 건강검진 75달러 혜택 청구 마감 기한 (연 1회 신청 가능).",
      urgency: "low",
      evidence: [
        {
          page: 11,
          quote: "This benefit is limited to one screening test per calendar year, ending December 31st.",
          confidence: 0.94
        }
      ]
    }
  ],
  actions: [
    {
      id: "act_aflac_1",
      task: "매년 정기 건강검진(웰니스 테스트) 후 영수증 첨부하여 Aflac 앱으로 청구하기",
      priority: "medium",
      reason: "단순 혈액 검사나 정기 유방암/대장암 검사 영수증만 올려도 매년 75달러 현금을 환급해 주므로 잊지 말고 신청해야 이득입니다.",
      evidence: [
        {
          page: 11,
          quote: "To claim the Wellness Benefit, you must submit proof of a screening test.",
          confidence: 0.96
        }
      ]
    },
    {
      id: "act_aflac_2",
      task: "가입 후 최초 30일 이내에는 대증적 치료(증상 완화) 외에 확진 판정 미루기",
      priority: "high",
      reason: "30일 대기 기간 내에 전산상으로 암 확진 코드가 입력되면 보장이 평생 무효화되므로 안전하게 30일이 지난 후 확진을 받아야 합니다.",
      evidence: [
        {
          page: 4,
          quote: "Diagnoses made during the waiting period will result in claim denial.",
          confidence: 0.95
        }
      ]
    }
  ],
  personaBrief: {
    child: "이것은 우리가 아플 때 달러 동전을 꺼내 주는 미국 Aflac 오리 저금통이에요! 우리가 아파서 병원에 가면 매일 300달러를 주고, 예방 주사를 잘 맞거나 건강검진을 받으면 매년 75달러를 돌려줘요. 하지만 가입하고 처음 한 달(30일) 동안은 오리 저금통이 굳게 잠겨 있어서 아파도 동전이 나오지 않는대요!",
    senior: "어르신, 본 약관은 Aflac사의 암보험입니다. 첫째, 가입하고 첫 30일 동안은 대기 기간이라 이 시기에 확진을 받으시면 진단금을 받지 못하십니다. 둘째, 매년 웰니스 검진을 받으신 후 영수증을 제출하면 75달러(약 10만 원 상당)를 환급해 드리니 잊지 말고 꼭 청구하십시오. 셋째, 나이에 따른 보험료 인상은 없으나, 주 전체 가입자를 묶어 올릴 수 있는 권한이 있습니다.",
    general: "Aflac Cancer Care Classic 암보험 약관 요약본입니다. 최초 암 진단 시 10,000달러, 입원 시 일 300달러, 화학치료 시 월 500달러가 지급됩니다. 30일의 암 진단 대기 기간이 적용되며, 매년 웰니스 스크리닝 검사 완료 시 75달러 환급 혜택이 주어집니다. 보험료는 주별로 일괄 조정될 권한이 있습니다.",
    expert: "본 문서는 Massachusetts 주 기준 Aflac Cancer Care Classic 증권 요약서입니다. Effective Date 이후 30일간의 Cancer Waiting Period가 적용되어 동 기간 내 진단은 Exclusion 대상입니다. Guaranteed Renewable 규정을 충족하나 Premium Adjustment는 State Class 단위 조정을 예외로 둡니다. 웰니스 혜택은 Calendar Year당 1회($75) 급부 요건이 구성됩니다."
  },
  disclaimer: "Cerebras DocLens은 문서 이해를 돕는 AI 도구입니다. 법률, 의료, 보험, 금융에 대한 전문 자문을 대체하지 않습니다. 중요한 결정 전에는 반드시 전문가 또는 해당 기관에 확인하세요."
};

export const mockAflacInsuranceResultEn: FinalAnalysisResult = {
  document: {
    id: "doc_aflac_sample_en",
    fileName: "Aflac_Cancer_Care_Classic_Policy_Summary.pdf",
    fileType: "pdf",
    pageCount: 14,
    uploadedAt: "2026-06-28T23:59:00Z",
    documentType: "insurance",
    language: "en"
  },
  executiveSummary: [
    "This document is a summary of the representative Aflac Cancer Care Classic Policy (Massachusetts Form).",
    "It enforces a strict 30-day waiting period from the policy effective date, during which diagnosed cancers are not covered.",
    "The policy is guaranteed renewable for life; however, premium rates can be adjusted on a class basis by state approval."
  ],
  keyPoints: [
    "Pays $10,000 lump sum upon first occurrence of internal cancer (lifetime limit of one diagnosis).",
    "Provides $300 per day for hospital confinement during cancer treatment (up to 30 days).",
    "Offers $500 per month support benefit for chemotherapy and radiation treatments.",
    "Provides $75 annual refund/credit for undergoing a wellness cancer screening test."
  ],
  risks: [
    {
      id: "risk_aflac_1",
      title: "30-Day Waiting/Exclusion Period for Cancer Diagnosis",
      severity: "high",
      plainExplanation: "Cancers diagnosed within the first 30 days of the policy's effective date are completely excluded from coverage. No benefits will ever be paid for that specific diagnosis.",
      whyItMatters: "If you feel unwell immediately after purchasing the policy, check the calendar carefully. Seeking diagnosis before Day 31 will permanently block coverage.",
      evidence: [
        {
          page: 4,
          quote: "We will not pay benefits for Cancer diagnosed during the first 30 days after the Effective Date. Cancers diagnosed within this period are excluded from coverage.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "risk_aflac_2",
      title: "Class-Based Premium Rate Adjustments",
      severity: "medium",
      plainExplanation: "While your premiums cannot be raised individually due to age or health changes, Aflac reserves the right to increase premium rates for all policyholders within your state (class basis).",
      whyItMatters: "Renewability is guaranteed for life, but class-wide premium hikes might make the plan expensive to maintain in the long run.",
      evidence: [
        {
          page: 2,
          quote: "Aflac reserves the right to change the premium rates on a class basis. We cannot change your premium rates individually, but may change them for all policyholders in your state.",
          confidence: 0.95
        }
      ]
    },
    {
      id: "risk_aflac_3",
      title: "12-Month Pre-Existing Conditions Exclusion",
      severity: "high",
      plainExplanation: "Any cancer treatment, advice, or medication received in the 12 months prior to your policy start date is considered a pre-existing condition and will not be covered for the first 12 months of this policy.",
      whyItMatters: "If you had cancer screening follow-ups or warnings last year, you will face a coverage gap for that specific condition during your first year.",
      evidence: [
        {
          page: 5,
          quote: "A Pre-existing Condition is a sickness or physical condition for which medical advice or treatment was recommended or received within 12 months before the Effective Date. No benefits will be paid during the first 12 months.",
          confidence: 0.97
        }
      ]
    }
  ],
  moneyItems: [
    {
      id: "money_aflac_1",
      amount: "10,000 USD",
      type: "you_receive",
      description: "First Occurrence Diagnosis Benefit for internal cancer (once per lifetime)",
      evidence: [
        {
          page: 7,
          quote: "Aflac will pay $10,000 upon the first occurrence of a diagnosed internal Cancer.",
          confidence: 0.99
        }
      ]
    },
    {
      id: "money_aflac_2",
      amount: "300 USD / Day",
      type: "you_receive",
      description: "Daily Hospital Confinement Benefit for inpatient stays during cancer treatment (up to 30 days)",
      evidence: [
        {
          page: 8,
          quote: "We will pay $300 per day for each day you are confined to a hospital for the treatment of Cancer, up to 30 days.",
          confidence: 0.96
        }
      ]
    },
    {
      id: "money_aflac_3",
      amount: "500 USD / Month",
      type: "you_receive",
      description: "Chemotherapy & Radiation Therapy treatment support benefit",
      evidence: [
        {
          page: 9,
          quote: "We will pay $500 per month for chemical or radiation therapy treatments received in that month.",
          confidence: 0.95
        }
      ]
    },
    {
      id: "money_aflac_4",
      amount: "75 USD / Year",
      type: "you_receive",
      description: "Annual Wellness Benefit payout for undergoing a cancer screening test",
      evidence: [
        {
          page: 11,
          quote: "Aflac will pay $75 per calendar year for cancer screening tests per covered person.",
          confidence: 0.99
        }
      ]
    }
  ],
  timeline: [
    {
      id: "time_aflac_1",
      dateText: "30 Days Post-Effective",
      meaning: "End of cancer diagnosis waiting period. Diagnoses after Day 30 qualify for full benefits.",
      urgency: "high",
      evidence: [
        {
          page: 4,
          quote: "The coverage for Cancer begins after 30 days from the Effective Date of the policy.",
          confidence: 0.98
        }
      ]
    },
    {
      id: "time_aflac_2",
      dateText: "12 Months Post-Effective",
      meaning: "Pre-existing condition exclusion period expires. Full coverage for previous medical history starts.",
      urgency: "medium",
      evidence: [
        {
          page: 5,
          quote: "Exclusions for pre-existing conditions terminate after the policy has been in force for 12 months.",
          confidence: 0.97
        }
      ]
    },
    {
      id: "time_aflac_3",
      dateText: "December 31st (Annual)",
      meaning: "Deadline to file your annual $75 wellness screening claim per calendar year.",
      urgency: "low",
      evidence: [
        {
          page: 11,
          quote: "This benefit is limited to one screening test per calendar year, ending December 31st.",
          confidence: 0.94
        }
      ]
    }
  ],
  actions: [
    {
      id: "act_aflac_1",
      task: "Submit wellness test receipts via Aflac app annually",
      priority: "medium",
      reason: "Submitting simple receipts for annual checkups (like basic blood tests or routine pap smears) yields $75 cash back per year.",
      evidence: [
        {
          page: 11,
          quote: "To claim the Wellness Benefit, you must submit proof of a screening test.",
          confidence: 0.96
        }
      ]
    },
    {
      id: "act_aflac_2",
      task: "Avoid final diagnosis checks within the first 30 days of coverage",
      priority: "high",
      reason: "A cancer code registered in the database during the 30-day waiting window permanently voids eligibility for this diagnosis.",
      evidence: [
        {
          page: 4,
          quote: "Diagnoses made during the waiting period will result in claim denial.",
          confidence: 0.95
        }
      ]
    }
  ],
  personaBrief: {
    child: "This is a friendly duck piggy bank from Aflac that helps your parents when you get sick! If you have to stay at the hospital, it gives you $300 every day, and if you get a checkup, it gives you $75 every year! But remember: for the first 30 days (about a month), the duck piggy bank is sleeping and won't give out any coins!",
    senior: "Dear senior, here are three things to know: First, there is a 30-day waiting period, so any cancer diagnosed within the first month is not covered. Second, file your receipts for routine screenings (like colonoscopy or blood work) to claim your annual $75 cash back. Third, rates are guaranteed renewable, but premium rates can be adjusted state-wide.",
    general: "This is a summary of the Aflac Cancer Care Classic policy. It pays $10,000 on first diagnosis, $300/day for hospital stays, and $500/month for chemotherapy. A 30-day diagnosis waiting period applies. An annual $75 wellness benefit is paid for screening tests. Rates can be adjusted state-wide.",
    expert: "This document is a policy summary for the Aflac Cancer Care Classic form (MA Form). Highlights include a 30-day Waiting Period exclusion, a 12-month Pre-existing Conditions limitation, and class-based Premium rate adjustment rights. Annual Wellness Benefit is capped at $75 per calendar year."
  },
  disclaimer: "Cerebras DocLens is an AI helper tool. It does not replace professional legal, medical, insurance, or financial advice. Always consult a professional or institution before making critical decisions."
};


