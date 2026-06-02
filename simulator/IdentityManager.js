export class IdentityManager {
    constructor() {
        this.all = [];
        this.sinners = ["이상", "파우스트", "돈키호테", "료슈", "뫼르소", "홍루", "히스클리프", "이스마엘", "로쟈", "싱클레어", "오티스", "그레고르"];
    }

    async load() {
        const dataBasePath = '../identity/';
        const res = await fetch(`${dataBasePath}data.json`);
        const data = await res.json();

        this.all = data.map(d => ({
            ...d,

            traits: this.normalizeTraits(d),

            img: this.resolveImagePath(d.img, dataBasePath)
        }));
    }

    normalizeTraits(data) {
        // 이미 traits가 있으면 traits 우선 사용
        if (Array.isArray(data.traits)) {
            return data.traits;
        }

        // affiliation이 배열이면 그대로 사용
        if (Array.isArray(data.affiliation)) {
            return data.affiliation;
        }

        // affiliation이 문자열이면 배열로 변환
        if (typeof data.affiliation === 'string') {
        return [data.affiliation];
    }

    // 아무것도 없으면 빈 배열
    return [];
    }

    resolveImagePath(imgPath, dataBasePath) {
        if (!imgPath) return '';

        if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
            return imgPath;
        }

        if (imgPath.startsWith('./')) {
            return dataBasePath + imgPath.slice(2);
        }

        return dataBasePath + imgPath;
    }

    filter(sinnerFilter, searchText) {
        return this.all.filter(id => {
            const matchSinner = sinnerFilter ? id.sinner === sinnerFilter : true;
            const search = searchText.trim();

            const matchSearch = search
                ? id.name.includes(search)
                  || id.sinner.includes(search)
                  || (id.keywords || []).some(k => k.includes(search))
                  || (id.traits || []).some(t => t.includes(search))
                : true;

            return matchSinner && matchSearch;
        });
    }
}