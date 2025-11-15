let selectedLanguage = null;

function selectLanguage(lang) {
    selectedLanguage = lang;
    
    document.querySelectorAll('.language-card').forEach(card => {
        card.classList.remove('selected');
    });
   
    event.currentTarget.classList.add('selected');
    
    const continueBtn = document.getElementById('continue-btn');
    const continueText = document.getElementById('continue-text');
    continueBtn.disabled = false;
   
    if (lang === 'en') {
        continueText.textContent = 'Continue to Website';
    } else {
        continueText.textContent = 'Перейти на сайт';
    }
}

function continueToHome() {
    if (selectedLanguage) {
        localStorage.setItem('selectedLanguage', selectedLanguage)
        window.location.href = 'home.html';
    }
}

window.addEventListener('DOMContentLoaded', function() {
    const userLang = navigator.language || navigator.userLanguage;
    
    if (userLang.startsWith('ru')) {
        selectLanguage('ru');
    }
});
