let selectedLanguage = null;

function selectLanguage(lang) {
    selectedLanguage = lang;
    
    // Убираем выделение со всех карточек
    document.querySelectorAll('.language-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Выделяем выбранную карточку
    event.currentTarget.classList.add('selected');
    
    // Активируем кнопку продолжения
    const continueBtn = document.getElementById('continue-btn');
    const continueText = document.getElementById('continue-text');
    continueBtn.disabled = false;
    
    // Меняем текст кнопки в зависимости от выбранного языка
    if (lang === 'en') {
        continueText.textContent = 'Continue to Website';
    } else {
        continueText.textContent = 'Перейти на сайт';
    }
}

function continueToHome() {
    if (selectedLanguage) {
        // Сохраняем выбранный язык
        localStorage.setItem('selectedLanguage', selectedLanguage);
        // Переходим на основную страницу
        window.location.href = 'home.html';
    }
}

// Автоматическое определение языка браузера
window.addEventListener('DOMContentLoaded', function() {
    const userLang = navigator.language || navigator.userLanguage;
    
    // Если язык русский, выбираем его автоматически
    if (userLang.startsWith('ru')) {
        selectLanguage('ru');
    }
});