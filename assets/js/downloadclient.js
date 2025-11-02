function installUserScript() {
            // URL вашего скрипта - ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ URL!
            const scriptUrl = 'assets/FreeRanksClient.user.js';
            
            // Проверяем, установлен ли Tampermonkey
            if (typeof GM_info === 'undefined') {
                // Если Tampermonkey не установлен, открываем скрипт в новой вкладке
                window.open(scriptUrl, '_blank');
                
                // Показываем сообщение с инструкцией
                alert('Tampermonkey не обнаружен! 😔\n\n' +
                      'Шаги для установки:\n' +
                      '1. Установите Tampermonkey с https://www.tampermonkey.net/\n' +
                      '2. Обновите эту страницу\n' +
                      '3. Нажмите кнопку установки снова\n\n' +
                      'Скрипт открыт в новой вкладке для ручной установки.');
            } else {
                // Если Tampermonkey установлен, перенаправляем на скрипт
                window.location.href = scriptUrl;
            }
        }
        
        // Дополнительная функция для показа статуса Tampermonkey
        function checkTampermonkey() {
            if (typeof GM_info !== 'undefined') {
                console.log('Tampermonkey обнаружен! Версия:', GM_info.version);
                // Можно добавить визуальное подтверждение
                const buttons = document.querySelectorAll('.install-button, .btn-primary');
                buttons.forEach(btn => {
                    btn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                    btn.innerHTML = '✅ ' + btn.textContent;
                });
            }
        }
        
        // Проверяем при загрузке страницы
        document.addEventListener('DOMContentLoaded', checkTampermonkey);