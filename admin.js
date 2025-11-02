// 관리자용 JavaScript
let lottoSets = [];

const lottoSetsContainer = document.getElementById('lottoSets');
const lottoForm = document.getElementById('lottoForm');
const clearAllBtn = document.getElementById('clearAll');
const downloadJsonBtn = document.getElementById('downloadJson');

// 페이지 로드 시 localStorage에서 데이터 불러오기
function loadFromLocalStorage() {
    const saved = localStorage.getItem('adminLottoSets');
    if (saved) {
        lottoSets = JSON.parse(saved);
    } else {
        // 초기 예시 데이터
        lottoSets = [
            {
                numbers: [3, 14, 22, 29, 34, 41],
                stats: '홀짝 3:3, 고/저 3:3, 합계 143',
                reason: '22, 34는 상위 출현 번호 / 29, 14는 최근 미출현 / 끝자리 중복 없음'
            },
            {
                numbers: [5, 11, 19, 28, 33, 44],
                stats: '홀짝 2:4, 고/저 3:3, 합계 140',
                reason: '33·44는 최근 20주 내 출현 빈도 상위 / 끝자리 다양화 / 연속번호 없음'
            }
        ];
        saveToLocalStorage();
    }
    renderLottoSets();
}

function saveToLocalStorage() {
    localStorage.setItem('adminLottoSets', JSON.stringify(lottoSets));
}

function getNumberColor(num) {
    if (num <= 10) return 'yellow';
    if (num <= 20) return 'blue';
    if (num <= 30) return 'red';
    if (num <= 40) return 'gray';
    return 'green';
}

function renderLottoSets() {
    if (lottoSets.length === 0) {
        lottoSetsContainer.innerHTML = `
            <div class="empty-state">
                <h3>등록된 로또 번호가 없습니다</h3>
                <p>아래 폼에서 새로운 세트를 추가해보세요!</p>
            </div>
        `;
        return;
    }

    lottoSetsContainer.innerHTML = lottoSets.map((set, index) => `
        <div class="lotto-card">
            <div class="card-header">
                <h3 class="set-title">세트 ${index + 1}</h3>
                <button class="delete-btn" onclick="deleteSet(${index})">×</button>
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

// 세트 추가
lottoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const numbersInput = document.getElementById('numbers').value;
    const statsInput = document.getElementById('stats').value;
    const reasonInput = document.getElementById('reason').value;

    const numbers = numbersInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

    if (numbers.length !== 6) {
        alert('정확히 6개의 번호를 입력해주세요!');
        return;
    }

    if (numbers.some(n => n < 1 || n > 45)) {
        alert('번호는 1부터 45 사이여야 합니다!');
        return;
    }

    if (new Set(numbers).size !== 6) {
        alert('중복된 번호가 있습니다!');
        return;
    }

    numbers.sort((a, b) => a - b);

    lottoSets.push({
        numbers,
        stats: statsInput,
        reason: reasonInput
    });

    saveToLocalStorage();
    renderLottoSets();
    lottoForm.reset();

    setTimeout(() => {
        const cards = document.querySelectorAll('.lotto-card');
        if (cards.length > 0) {
            cards[cards.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
});

// 세트 삭제
function deleteSet(index) {
    if (confirm('이 세트를 삭제하시겠습니까?')) {
        lottoSets.splice(index, 1);
        saveToLocalStorage();
        renderLottoSets();
    }
}

// 전체 삭제
clearAllBtn.addEventListener('click', () => {
    if (confirm('모든 세트를 삭제하시겠습니까?')) {
        lottoSets = [];
        saveToLocalStorage();
        renderLottoSets();
    }
});

// JSON 다운로드 (JavaScript 파일로)
downloadJsonBtn.addEventListener('click', () => {
    if (lottoSets.length === 0) {
        alert('저장할 데이터가 없습니다!');
        return;
    }

    const jsContent = `// 로또 데이터\nconst lottoData = ${JSON.stringify(lottoSets, null, 2)};\n`;
    const dataBlob = new Blob([jsContent], { type: 'text/javascript' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lotto-data.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('lotto-data.js 파일이 다운로드되었습니다!\n\n이 파일을 사용자 페이지 폴더에 넣어주세요.');
});

// JSON 업로드
const uploadJsonInput = document.getElementById('uploadJson');
uploadJsonInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const uploadedData = JSON.parse(event.target.result);

            if (!Array.isArray(uploadedData)) {
                throw new Error('올바른 형식이 아닙니다.');
            }

            const overwrite = confirm('기존 데이터를 유지하고 추가하시겠습니까?\n\n확인: 추가\n취소: 덮어쓰기');

            if (overwrite) {
                lottoSets = [...lottoSets, ...uploadedData];
            } else {
                lottoSets = uploadedData;
            }

            saveToLocalStorage();
            renderLottoSets();
            alert('데이터를 성공적으로 불러왔습니다!');

        } catch (error) {
            alert('파일을 읽는 중 오류가 발생했습니다: ' + error.message);
        }
    };

    reader.readAsText(file);
    e.target.value = '';
});

loadFromLocalStorage();
console.log('관리자 페이지가 로드되었습니다!');
