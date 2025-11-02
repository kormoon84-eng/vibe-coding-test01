// 사용자용 JavaScript (완전 보기 전용)
// lotto-data.js에서 lottoData 변수를 읽어서 표시만 함

const lottoSetsContainer = document.getElementById('lottoSets');

// 번호에 따른 색상 클래스
function getNumberColor(num) {
    if (num <= 10) return 'yellow';
    if (num <= 20) return 'blue';
    if (num <= 30) return 'red';
    if (num <= 40) return 'gray';
    return 'green';
}

// 로또 세트 렌더링 (삭제 버튼 없음)
function renderLottoSets(lottoSets) {
    if (!lottoSets || lottoSets.length === 0) {
        lottoSetsContainer.innerHTML = `
            <div class="empty-state">
                <h3>표시할 로또 번호가 없습니다</h3>
                <p>관리자에게 문의하세요</p>
            </div>
        `;
        return;
    }

    lottoSetsContainer.innerHTML = lottoSets.map((set, index) => `
        <div class="lotto-card">
            <div class="card-header">
                <h3 class="set-title">세트 ${index + 1}</h3>
            </div>

            <div class="numbers">
                ${set.numbers.map(num =>
                    `<div class="number-ball ${getNumberColor(num)}">${num}</div>`
                ).join('')}
            </div>

            <div class="info-section">
                <h4>📊 통계 근거</h4>
                <p>${set.stats}</p>
            </div>

            <div class="info-section">
                <h4>✅ 선택 이유</h4>
                <p>${set.reason}</p>
            </div>
        </div>
    `).join('');
}

// lotto-data.js에서 데이터 로드
if (typeof lottoData !== 'undefined') {
    renderLottoSets(lottoData);
} else {
    lottoSetsContainer.innerHTML = `
        <div class="empty-state">
            <h3>데이터를 불러올 수 없습니다</h3>
            <p>lotto-data.js 파일이 필요합니다</p>
        </div>
    `;
}

console.log('사용자 페이지가 로드되었습니다!');
