// Rank data (из вашей базы)
const ranksData = [
    {
        id: "freeranksclient",
        name: "Free Ranks Client",
        color: "#cc66ff",
        icon: "fas fa-zap"
    },
    {
        id: "hot",
        name: "HOT",
        color: "#ff0000",
        icon: "fas fa-fire"
    },
    {
        id: "demonic",
        name: "DEMONIC",
        color: "#4F0400",
        icon: "fas fa-skull"
    },
    {
        id: "legend",
        name: "LEGEND",
        color: "#f97316",
        icon: "fas fa-meteor"
    },
    {
        id: "vortex",
        name: "VORTEX",
        color: "#050505",
        icon: "fas fa-tornado"
    },
    {
        id: "skywars",
        name: "SKYWARS",
        color: "#00ffff",
        icon: "fas fa-star"
    },
    {
        id: "god",
        name: "GOD",
        color: "#ffff00",
        icon: "fas fa-crown"
    },
    {
        id: "bedwars",
        name: "BedWars",
        color: "#e10000",
        icon: "fas fa-cube"
    },
    {
        id: "owner",
        name: "Owner",
        color: "#ffb914",
        icon: "fas fa-crown"
    },
    {
        id: "developer",
        name: "Developer",
        color: "#a4a4a4",
        icon: "fas fa-wrench"
    },
    {
        id: "admin",
        name: "Admin",
        color: "#556c7d",
        icon: "fas fa-person-military-pointing"
    },
    {
        id: "youtuber",
        name: "YouTuber",
        color: "#ff0000",
        icon: "fab fa-youtube"
    },
    {
        id: "super",
        name: "Super",
        color: "#ffcc00",
        icon: "fas fa-bolt"
    }
];

// Bloxd цвета (новый формат)
const bloxdColors = {
    'Frost': '#dff8ff',
    'Lemon': '#ffff66',
    'Sprout': '#b3ff66',
    'Neon': '#66ff66',
    'Mint': '#66ffb3',
    'Cyan': '#66ffff',
    'Azure': '#66bcff',
    'Orchid': '#cc66ff',
    'Bubblegum': '#ff80bb',
    'Coral': '#ff6666',
    'Apricot': '#ffaa66',
    'Amber': '#ffcc66',
    'White': '#ffffff' // Добавляем белый как базовый
};

// Selected data
let selectedRank = null;
let selectedColor = '#ffffff'; // Базовый цвет белый
let selectedColorType = 'hex'; // hex, rgb, или bloxd
let imageBase64 = null;

// DOM Elements
const ranksGrid = document.getElementById('ranks-grid');
const colorPicker = document.getElementById('color-picker');
const colorPreview = document.getElementById('color-preview');
const hexInput = document.getElementById('hex-color');
const rgbInput = document.getElementById('rgb-color');
const bloxdSelect = document.getElementById('bloxd-color');
const nicknameInput = document.getElementById('nickname');
const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const encodedResult = document.getElementById('encoded-result');
const copyBtn = document.getElementById('copy-btn');
const generateBtn = document.getElementById('generate-btn');

// Initialize rank selection
function initRankSelection() {
    ranksGrid.innerHTML = '';
    
    ranksData.forEach(rank => {
        const rankElement = document.createElement('div');
        rankElement.className = 'rank-option';
        rankElement.innerHTML = `
            <div class="rank-icon-small" style="color: ${rank.color}">
                <i class="${rank.icon}"></i>
            </div>
            <div class="rank-name" style="color: ${rank.color}">${rank.name}</div>
        `;
        
        rankElement.addEventListener('click', () => {
            document.querySelectorAll('.rank-option').forEach(r => r.classList.remove('selected'));
            rankElement.classList.add('selected');
            selectedRank = rank;
            updateEncodedResult();
        });
        
        ranksGrid.appendChild(rankElement);
    });
}

// Инициализация выбора Bloxd цветов
function initBloxdColors() {
    bloxdSelect.innerHTML = '<option value="">Выберите цвет Bloxd</option>';
    
    for (const [name, hex] of Object.entries(bloxdColors)) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = `${name} (${hex})`;
        option.style.color = hex;
        bloxdSelect.appendChild(option);
    }
}

// Convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Convert RGB to hex
function rgbToHex(rgb) {
    const match = rgb.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (!match) return '#ffffff';
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Update color values
function updateColorValues(color, type = 'hex') {
    selectedColorType = type;
    
    if (type === 'bloxd') {
        // Это имя цвета Bloxd, получаем hex
        selectedColor = bloxdColors[color] || '#ffffff';
        
        // Устанавливаем все поля
        colorPicker.value = selectedColor;
        hexInput.value = selectedColor;
        
        const rgb = hexToRgb(selectedColor);
        if (rgb) {
            rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        }
        
        bloxdSelect.value = color;
        
    } else if (type === 'hex') {
        // HEX цвет
        selectedColor = color;
        
        // Устанавливаем все поля
        colorPicker.value = color;
        hexInput.value = color;
        
        const rgb = hexToRgb(color);
        if (rgb) {
            rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        }
        
        // Находим ближайший Bloxd цвет
        let closestBloxd = '';
        let minDistance = Infinity;
        
        for (const [name, bloxdHex] of Object.entries(bloxdColors)) {
            const rgb1 = hexToRgb(color);
            const rgb2 = hexToRgb(bloxdHex);
            
            if (rgb1 && rgb2) {
                // Простая метрика расстояния цвета
                const distance = Math.sqrt(
                    Math.pow(rgb1.r - rgb2.r, 2) +
                    Math.pow(rgb1.g - rgb2.g, 2) +
                    Math.pow(rgb1.b - rgb2.b, 2)
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestBloxd = name;
                }
            }
        }
        
        bloxdSelect.value = closestBloxd;
        
    } else if (type === 'rgb') {
        // RGB цвет, конвертируем в HEX
        selectedColor = rgbToHex(color);
        
        // Устанавливаем все поля
        colorPicker.value = selectedColor;
        hexInput.value = selectedColor;
        rgbInput.value = color;
        
        // Находим ближайший Bloxd цвет
        let closestBloxd = '';
        let minDistance = Infinity;
        
        const rgb = hexToRgb(selectedColor);
        if (rgb) {
            for (const [name, bloxdHex] of Object.entries(bloxdColors)) {
                const rgb2 = hexToRgb(bloxdHex);
                
                if (rgb2) {
                    const distance = Math.sqrt(
                        Math.pow(rgb.r - rgb2.r, 2) +
                        Math.pow(rgb.g - rgb2.g, 2) +
                        Math.pow(rgb.b - rgb2.b, 2)
                    );
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestBloxd = name;
                    }
                }
            }
        }
        
        bloxdSelect.value = closestBloxd;
    }
    
    // Обновляем превью цвета
    colorPreview.style.background = selectedColor;
    
    updateEncodedResult();
}

// Color picker event listeners
colorPicker.addEventListener('input', (e) => {
    updateColorValues(e.target.value, 'hex');
});

hexInput.addEventListener('input', (e) => {
    const hex = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        updateColorValues(hex, 'hex');
    }
});

hexInput.addEventListener('change', (e) => {
    const hex = e.target.value;
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        hexInput.value = selectedColor;
    }
});

rgbInput.addEventListener('input', (e) => {
    const rgb = e.target.value;
    const match = rgb.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
            updateColorValues(rgb, 'rgb');
        }
    }
});

rgbInput.addEventListener('change', (e) => {
    const rgb = e.target.value;
    if (!/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(rgb)) {
        const rgbColor = hexToRgb(selectedColor);
        rgbInput.value = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
    }
});

// Bloxd цвет выбор
bloxdSelect.addEventListener('change', (e) => {
    const bloxdColor = e.target.value;
    if (bloxdColor) {
        updateColorValues(bloxdColor, 'bloxd');
    }
});

// Image upload handling
uploadArea.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            alert('Файл слишком большой. Максимальный размер: 2MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            imageBase64 = e.target.result;
            
            // Show preview
            imagePreview.innerHTML = `<img src="${imageBase64}" alt="Скриншот">`;
            imagePreview.style.display = 'block';
            
            updateEncodedResult();
        };
        reader.readAsDataURL(file);
    }
});

// Drag and drop for image upload
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#8a2be2';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'rgba(138, 43, 226, 0.3)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'rgba(138, 43, 226, 0.3)';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        imageUpload.files = e.dataTransfer.files;
        imageUpload.dispatchEvent(new Event('change'));
    }
});

// Update encoded result
function updateEncodedResult() {
    // Проверяем, все ли поля заполнены
    if (!nicknameInput.value.trim() || !selectedRank || !imageBase64) {
        encodedResult.value = '';
        return;
    }
    
    // Определяем формат цвета для сохранения
    let colorFormat = 'hex';
    let colorValue = selectedColor;
    
    if (selectedColorType === 'bloxd' && bloxdSelect.value) {
        colorFormat = 'bloxd';
        colorValue = bloxdSelect.value; // Сохраняем имя цвета
    } else if (selectedColorType === 'rgb') {
        colorFormat = 'rgb';
        colorValue = rgbInput.value; // Сохраняем RGB строку
    }
    // По умолчанию сохраняем как HEX
    
    // Создаем объект данных
    const data = {
        n: nicknameInput.value.trim(), // nickname
        r: selectedRank.id,           // rank ID
        cf: colorFormat,              // color format
        cv: colorValue,               // color value
        i: imageBase64,               // image
        t: Date.now(),                // timestamp
        v: "3"                        // version
    };
    
    try {
        // Преобразуем в JSON
        const jsonString = JSON.stringify(data);
        
        // Шифруем в Base64
        const encoded = btoa(unescape(encodeURIComponent(jsonString)));
        
        // Новый формат: FRC-RankCode {зашифрованный текст}
        encodedResult.value = `FRC-RankCode {${encoded}}`;
        
    } catch (e) {
        console.error('Ошибка кодирования:', e);
        encodedResult.value = 'Ошибка при создании зашифрованных данных.';
    }
}

// Copy to clipboard
copyBtn.addEventListener('click', () => {
    if (encodedResult.value && encodedResult.value !== '') {
        encodedResult.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    } else {
        alert('Сначала заполните все поля и нажмите "Сгенерировать"');
    }
});

// Generate encoded data
generateBtn.addEventListener('click', () => {
    if (!nicknameInput.value.trim()) {
        alert('Пожалуйста, введите ваш никнейм');
        nicknameInput.focus();
        return;
    }
    
    if (!selectedRank) {
        alert('Пожалуйста, выберите ранг');
        return;
    }
    
    if (!imageBase64) {
        alert('Пожалуйста, загрузите скриншот');
        return;
    }
    
    updateEncodedResult();
});

// Nickname input listener
nicknameInput.addEventListener('input', updateEncodedResult);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initRankSelection();
    initBloxdColors();
    
    // Apply saved language
    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    if (typeof applyLanguage === 'function') {
        applyLanguage(selectedLanguage);
    }
});