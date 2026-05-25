export const traitSynergies = [
{
    name: "출혈",
    type: "keyword",
    requiredCount: 5,
    desc: "출혈 키워드 인격 5명 이상 편성 시 출혈 시너지 활성화",

    supportList: [
        10,
        21,
        31,
        51,
        60,
        81,
        89,
        108,
        118,
        135,
        149,
        163
    ],

    recommendedGifts: [
        {
            name: "피안개",
            reason: "1번 편성의 위력을 올려주는 핵심 기프트",
            img: "../ego-gift/images/bleed44.webp"
        },
        {
            name: "출혈성 쇼크",
            reason: "출혈 발동을 보조하기 좋음",
            img: "../ego-gift/images/bleed45.webp"
        }
    ],

    recommendedPacks: [
        {
            name: "출혈 테마팩",
            reason: "출혈 관련 E.G.O 기프트를 확보하기 좋음",
            img: "../Event_Ego/assets/Theme_Pack/다시열린라만차랜드.png"
        }
    ]
},
{
    name: "거미집",
    type: "traits",
    requiredCount: 4,
    desc: "거미집 소속 인격 4명 이상 편성 시 거미집 시너지 활성화",

    supportList: [
        15,
        30,
        44,
        59,
        68,
        88,
        90,
        117,
        118,
        147,
        154,
        172
    ],

    recommendedGifts: [
        {
            name: "붉게 얽힌 거미집",
            reason: "료슈 1인 클리어를 도와주는 기프트",
            img: "../ego-gift/images/nokeyword74.webp"
        },
        {
            name: "강요된 무게",
            reason: "료슈 1인 클리어를 도와주는 기프트",
            img: "../ego-gift/images/nokeyword53.webp"
        }
    ],

    recommendedPacks: [
        {
            name: "거미집 테마팩",
            reason: "붉게 얽힌 거미집을 획득할 수 있음",
            img: "../Event_Ego/assets/Theme_Pack/검과작품.png"
        }
    ]
},
{
    name: "흑수",
    type: "traits",
    requiredCount: 4,
    desc: "흑수 인격 4명 이상 편성 시 흑수 시너지 활성화",

    supportList: [
        14,
        27,
        43,
        55,
        60,
        87,
        102,
        115,
        129,
        146,
        159,
        173
    ],

    recommendedGifts: [
        {
            name: "마음을 닫는 붉은 천",
            reason: "홍원 군주 홍루를 강화하고 순환을 돕는 기프트",
            img: "../ego-gift/images/slash12.webp"
        },
        {
            name: "황홀경",
            reason: "흑수들의 파열 디버프를 유지시켜주는 합성 기프트",
            img: "../ego-gift/images/rupturee32.webp"
        }
    ],

    recommendedPacks: [
        {
            name: "절차탁춘",
            reason: "흑수들과 군주를 위한 에고 기프트의 다수 포진",
            img: "../Event_Ego/assets/Theme_Pack/절차탁춘.png"
        }
    ]
},
{
    name: "W사",
    type: "traits",
    requiredCount: 4,
    desc: "W사 인격 4명 이상 편성 시 W사 시너지 활성화",

    supportList: [
        9,
        17,
        36,
        52,
        65,
        78,
        101,
        107,
        127,
        143,
        157,
        176
    ],

    recommendedGifts: [
        {
            name: "C형 정리 요원 장비 세트",
            reason: "W사 전체를 강화하고 안정성도 주는 기프트",
            img: "../ego-gift/images/charge36.webp"
        },
        {
            name: "충전형 장갑",
            reason: "충전 횟수의 한계치를 뚫어주고 매 턴마다 충전을 지급하는 기프트",
            img: "../ego-gift/images/charge29.webp"
        }
    ],

    recommendedPacks: [
        {
            name: "워프특급 살인사건",
            reason: "W사 인격들과 충전 인격들을 위한 조합 에깊 재료 수집 가능",
            img: "../Event_Ego/assets/Theme_Pack/워프특급살인사건.png"
        }
    ]
}
];

export class Identity {
    constructor(data) {
        Object.assign(this, data);
    }
}

export class Deck {
    constructor() {
        this.mainUnits = []; // 메인 전투 인원: 최대 7명
        this.subUnits = [];  // 서포트 패시브: 자동 추천 5명
    }

    resetDeck() {
        this.mainUnits = [];
        this.subUnits = [];
    }

    updateDeck(identity, allData) {
        const sameIdentity = this.mainUnits.find(u => u.id === identity.id);

        // 이미 선택된 같은 인격을 다시 누르면 선택 해제
        if (sameIdentity) {
            this.mainUnits = this.mainUnits.filter(u => u.id !== identity.id);
            this.SubUnits = [];
            return;
        }

        const sameSinnerIndex = this.mainUnits.findIndex(u => u.sinner === identity.sinner);

        // 같은 수감자의 다른 인격이 이미 있으면 그 자리에서 교체
        if (sameSinnerIndex !== -1) {
            this.mainUnits[sameSinnerIndex] = identity;
            this.SubUnits = [];
            return;
        }

        // 메인 전투 인원은 최대 7명
        if (this.mainUnits.length < 7) {
            this.mainUnits.push(identity);
            this.SubUnits = [];
            return;
        }

    }
    generateAutoSub(allData, selectedSynergy = null) {
        // 메인 7명이 완성되지 않았거나 시너지를 선택하지 않았으면 서포트 비움
        if (this.mainUnits.length < 7 || !selectedSynergy) {
            this.subUnits = [];
            return;
        }

        const supportList = selectedSynergy.supportList || [];

        // supportList가 없으면 서포트 비움
        if (supportList.length === 0) {
            this.subUnits = [];
            return;
        }

        const usedSinners = new Set(this.mainUnits.map(unit => unit.sinner));
        const selectedSupports = [];

        supportList.forEach(supportId => {
            if (selectedSupports.length >= 5) return;

            const candidate = allData.find(identity => identity.id === supportId);

            if (!candidate) return;

            // 메인 7명 또는 이미 선택된 서포트와 같은 수감자면 제외
            if (usedSinners.has(candidate.sinner)) return;

            selectedSupports.push(candidate);
            usedSinners.add(candidate.sinner);
        });

        this.subUnits = selectedSupports;
    }

    getTraitCounts() {
        const counts = {};

        this.mainUnits.forEach(unit => {
            const traits = unit.traits || [];

            traits.forEach(trait => {
                counts[trait] = (counts[trait] || 0) + 1;
            });
        });

        return counts;
    }

    getKeywordCounts() {
        const counts = {};

        this.mainUnits.forEach(unit => {
            const keywords = unit.keywords || [];

            keywords.forEach(keyword => {
                counts[keyword] = (counts[keyword] || 0) + 1;
            });
        });

        return counts;
    }

    getActiveSynergies() {
        const traitCounts = this.getTraitCounts();
        const keywordCounts = this.getKeywordCounts();

        return traitSynergies
            .filter(synergy => {
                if (synergy.type === "keyword") {
                    return (keywordCounts[synergy.name] || 0) >= synergy.requiredCount;
                }

                return (traitCounts[synergy.name] || 0) >= synergy.requiredCount;
            })
            .map(synergy => {
                const currentCount = synergy.type === "keyword"
                    ? (keywordCounts[synergy.name] || 0)
                    : (traitCounts[synergy.name] || 0);

                return {
                    ...synergy,
                    currentCount
                };
            });
    }
}