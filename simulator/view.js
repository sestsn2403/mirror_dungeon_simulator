export class AppView {
    constructor() {
        this.filters = document.getElementById('sinner-filters');
        this.picker = document.getElementById('picker-grid');
        this.teamGrid = document.getElementById('team-image-grid');
        this.synergyList = document.getElementById('synergy-list');
        this.recommendedGiftList = document.getElementById('recommended-gift-list');
        this.recommendedPackList = document.getElementById('recommended-pack-list');
    }

    render(identities, deck, activeSinner, sinners, selectedSynergyName) {
        this.renderSinnerFilters(sinners, activeSinner);
        this.renderPicker(identities, deck);
        this.renderTeam(deck);
        this.renderSynergies(deck, selectedSynergyName);
        this.renderRecommendedGifts(deck, selectedSynergyName);
        this.renderRecommendedPacks(deck, selectedSynergyName);
    }

    renderSinnerFilters(sinners, activeSinner) {
        this.filters.innerHTML = sinners.map(s => `
            <button class="sinner-btn ${activeSinner === s ? 'active' : ''}" data-sinner="${s}">
                ${s}
            </button>
        `).join('');
    }

    renderPicker(identities, deck) {
        this.picker.innerHTML = identities.map(id => {
            const inMain = deck.mainUnits.some(m => m.id === id.id);

            return `
                <div class="card ${inMain ? 'selected' : ''}" data-id="${id.id}">
                    <img src="${id.img}" alt="${id.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                    <div class="name">${id.name}</div>
                    <div class="meta">${id.sinner}</div>
                    <div class="tags">${(id.traits || []).join(' · ')}</div>
                </div>
            `;
        }).join('');
    }

    renderTeam(deck) {
        const teamUnits = [...deck.mainUnits, ...deck.subUnits];
        const slots = [];

        for (let i = 0; i < 12; i++) {
            const unit = teamUnits[i];

            if (unit) {
                slots.push(`
                    <div class="team-slot ${i < 7 ? 'main-slot' : 'support-slot'}" title="${i < 7 ? '메인' : '서포트'} | ${unit.sinner} | ${unit.name}">
                        <img src="${unit.img}" alt="${unit.name}" onerror="this.src='https://via.placeholder.com/100?text=No+Image'">
                    </div>
                `);
            } else {
                slots.push(`
                    <div class="team-slot empty">
                        EMPTY
                    </div>
                `);
            }
        }

        this.teamGrid.innerHTML = slots.join('');
    }

    renderSynergies(deck, selectedSynergyName) {
        const activeSynergies = deck.getActiveSynergies
            ? deck.getActiveSynergies()
            : [];

        this.synergyList.innerHTML = activeSynergies.length > 0
            ? activeSynergies.map(s => `
                <button class="synergy-btn ${selectedSynergyName === s.name ? 'active' : ''}"
                        data-synergy="${s.name}">
                    <strong>${s.name}</strong>
                    <span>${s.currentCount}/${s.requiredCount}</span>
                    <p>${s.desc}</p>
                </button>
            `).join('')
            : `<div class="empty-synergy">활성화 가능한 시너지가 없습니다.</div>`;
    }

    renderRecommendedGifts(deck, selectedSynergyName) {
        const selectedSynergy = deck.getActiveSynergies()
            .find(s => s.name === selectedSynergyName);

        if (!selectedSynergy) {
            this.recommendedGiftList.innerHTML = `
                <div class="empty-synergy">시너지를 선택하면 추천 E.G.O 기프트가 표시됩니다.</div>
            `;
            return;
        }

        const gifts = selectedSynergy.recommendedGifts || [];

        this.recommendedGiftList.innerHTML = gifts.length > 0
            ? gifts.map(gift => `
                <div class="recommended-gift">
                    ${gift.img ? `
                        <img class="recommended-gift-img"
                            src="${gift.img}"
                            alt="${gift.name}"
                            onerror="this.style.display='none'">
                    ` : ''}

                    <div class="recommended-gift-text">
                        <strong>${gift.name}</strong>
                        <div>${gift.reason}</div>
                    </div>
                </div>
            `).join('')
            : `<div class="empty-synergy">추천 E.G.O 기프트가 없습니다.</div>`;
    }

    renderRecommendedPacks(deck, selectedSynergyName) {
        const selectedSynergy = deck.getActiveSynergies()
            .find(s => s.name === selectedSynergyName);

        if (!selectedSynergy) {
            this.recommendedPackList.innerHTML = `
                <div class="empty-synergy">시너지를 선택하면 추천 테마팩이 표시됩니다.</div>
            `;
            return;
        }

        const packs = selectedSynergy.recommendedPacks || [];

        this.recommendedPackList.innerHTML = packs.length > 0
            ? packs.map(pack => `
                <div class="recommended-pack">
                    <strong>${pack.name}</strong>
                    <div>${pack.reason}</div>
                </div>
            `).join('')
            : `<div class="empty-synergy">추천 테마팩이 없습니다.</div>`;
    }

    uniqueByName(items) {
        const map = new Map();

        items.forEach(item => {
            if (!map.has(item.name)) {
                map.set(item.name, item);
            }
        });

        return [...map.values()];
    }
}
