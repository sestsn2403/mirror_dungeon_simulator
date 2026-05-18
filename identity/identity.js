async function loadIdentityData() {
    try {
        // data.json 파일을 불러옵니다 (파일 경로는 실제 파일 위치에 맞게 수정 가능)
        const response = await fetch('./data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        identityData = await response.json(); // 데이터를 배열로 변환하여 저장
        renderCards(identityData); // 카드 렌더링 실행

    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

const cardContainer = document.getElementById('card-container');
const searchInput = document.getElementById('search-input');
const backBtn = document.getElementById('back-btn');
    
// 모달 관련 요소들
const modal = document.getElementById('info-modal');
const closeModalBtn = document.getElementById('close-modal');

// 카드 렌더링 함수
function renderCards(dataList) {
    cardContainer.innerHTML = ''; 

    dataList.forEach(data => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        
        // 카드 클릭 시 모달 열기 이벤트
        cardDiv.addEventListener('click', () => {
            openModal(data);
        });


        cardDiv.innerHTML = `
            <img src="${data.img}" alt="${data.name}"">
            <div class="name">${data.name}</div>
        `;

        cardContainer.appendChild(cardDiv);
    });
}


// 모달 열기 함수
function openModal(data) {
    // 헤더 정보 채우기
    document.getElementById('modal-img').src = data.img;
    
    document.getElementById('modal-name').innerText = data.name;
    document.getElementById('modal-affil').innerText = `소속: ${data.affiliation}`;
    
    // 키워드 태그 생성
    const keywordContainer = document.getElementById('modal-keywords');
    keywordContainer.innerHTML = '';
    if(data.keywords) {
        data.keywords.forEach(kw => {
            keywordContainer.innerHTML += `<span class="tag">${kw}</span>`;
        });
    }

    // 스킬 세부 정보 HTML 생성
    const detailsContainer = document.getElementById('modal-details');
    let detailsHTML = '';

    // 데이터에 스킬 정보가 있을 경우에만 렌더링
    if (data.skill) {
        // 1. 액티브 스킬
        if (data.skill.skill && data.skill.skill.length > 0) {
            detailsHTML += `<div class="skill-section"><h3>액티브 스킬</h3>`;
            data.skill.skill.forEach((s, index) => {
                detailsHTML += `
                    <div class="skill-box">
                        <div class="skill-header">
                            <span>[스킬 ${index + 1}] ${s.name}</span>
                            <span class="skill-type">${s.type} / ${s.crime}</span>
                        </div>
                        <div class="skill-stats">
                            기본 위력: ${s.default_power} | 코인 위력: ${s.coin_power} (코인: ${s.coin}개)
                        </div>
                    </div>`;
            });
            detailsHTML += `</div>`;
        }

        // 2. 수비 스킬
        if (data.skill.guard_skill) {
            const g = data.skill.guard_skill;
            detailsHTML += `
                <div class="skill-section">
                    <h3>수비 스킬</h3>
                    <div class="skill-box">
                        <div class="skill-header">
                            <span>${g.name}</span><span class="skill-type">${g.type} / ${g.crime}</span>
                        </div>
                        <div class="skill-stats">위력: ${g.default_power} ${g.coin_power}</div>
                    </div>
                </div>`;
        }

        // 3. 패시브 스킬
        if (data.skill.passive_skill || data.skill.support_passive) {
            detailsHTML += `<div class="skill-section"><h3>패시브 & 서포트</h3>`;
            if(data.skill.passive_skill) {
                const p = data.skill.passive_skill;
                detailsHTML += `
                    <div class="skill-box">
                        <div class="skill-header"><span>[패시브] ${p.name}</span></div>
                        <div class="skill-type">발동 조건: ${p.resources_type}</div>
                    </div>`;
            }
            
            if(data.skill.support_passive) {
                const sp = data.skill.support_passive;
                detailsHTML += `
                    <div class="skill-box">
                        <div class="skill-header"><span>[서포트] ${sp.name}</span></div>
                        <div class="skill-type">
                        `
                for (let i = 0; i < sp.resources.length; i++) {
                    detailsHTML += sp.resources[i].name + "x" + sp.resources[i].count + " "
                }
                detailsHTML +=`</div>
                </div>`;
            }
            detailsHTML += `</div>`;
        }
    } else {
        detailsHTML = `<p style="text-align:center; color:#aaa; margin-top:20px;">상세 정보가 없습니다.</p>`;
    }

    detailsContainer.innerHTML = detailsHTML;
    
    // 모달 표시
    modal.style.display = 'flex';
}


// 모달 닫기 이벤트
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 모달창 바깥(어두운 배경) 클릭 시 닫기
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// 검색 및 뒤로가기
searchInput.addEventListener('input', (event) => {
    const keyword = event.target.value.toLowerCase();
    const filteredData = identityData.filter(data => 
        data.name.toLowerCase().includes(keyword) || 
        (data.sinner && data.sinner.toLowerCase().includes(keyword))
    );
    renderCards(filteredData);
});

backBtn.addEventListener('click', () => { window.history.back(); });

// 초기 화면 그리기
loadIdentityData()