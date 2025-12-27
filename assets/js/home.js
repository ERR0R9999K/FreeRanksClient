// Translations
const translations = {
    en: {
        // Navigation
        home: "Home",
        features: "Features",
        ranks: "Ranks",
        installation: "Installation",
        
        // Main banner
        heroTitle: "Why pay <span class='highlight'>$9</span> for Super Rank?",
        heroText: "Get Super Rank and other exclusive ranks <span class='highlight'>FOR FREE</span> with FreeRanksClient! Just install the extension and write in Discord.",
        downloadExtension: "Download Extension",
        howToGetRank: "How to get rank",
        
        // Features
        whyFreeRanksClient: "Why FreeRanksClient?",
        feature1Title: "Completely Free",
        feature1Text: "All ranks are available completely free. Why pay $9 for Super Rank when you can get it for free?",
        feature2Title: "Exclusive Ranks",
        feature2Text: "Get not only Super Rank, but also other unique ranks: Developer, Admin, YouTuber and more!",
        feature3Title: "Visible to Everyone",
        feature3Text: "All players with the extension installed will see your colored ranks and nicknames in the game.",
        feature4Title: "Easy to Get",
        feature4Text: "Just write in Discord private messages and get the rank without complicated procedures.",
        feature5Title: "Security",
        feature5Text: "The extension does not violate the game rules and works within permitted limits.",
        feature6Title: "Auto Updates",
        feature6Text: "Automatic receipt of new ranks and bug fixes.",
        
        // Ranks
        availableRanks: "Available Ranks",
        rank1Desc: "Gray nickname with wrench icon",
        rank2Desc: "Blue-gray nickname with admin icon",
        rank3Desc: "Red nickname with YouTube icon",
        rank4Desc: "Golden nickname with lightning icon",
        rankClientDesc: "Exclusive client rank with purple color",
        rankGodDesc: "Golden nickname with crown icon",
        rankBedwarsDesc: "Red nickname with cube icon",
        rankSkywarsDesc: "Light blue nickname with star icon",
        rankVortexDesc: "The rank was awarded only to GE0RGECR for assistance in working with the client.",
        rankLegendDesc: "Fiery Orange Legendary Rank",
        rankDemonicDesc: "Black skull and bloody fire.  The color is like an eternal conflagration",
        rankHotDesc: "It's as spicy as a chili pepper. It burns with endless fire",
        rankOwnerDesc: "Orange nickname with golden crown",
        free: "FREE",
        rankNote: "Official Super Rank costs <span class='highlight'>$8.99</span> and lasts only 90 days. With FreeRanksClient you get it <span class='highlight'>FOR FREE</span> and forever!",
        
        // Rank Acquisition Methods
        rankAcquisitionClient: "💜 For the client's owner only",
        rankAcquisitionHot: "🔥 A hot rank in the truest sense of the word",
        rankAcquisitionDemonic: "💀Demonic rank with a skull",
        rankAcquisitionLegend: "❤️‍🔥 The  rank of a true legend",
        rankAcquisitionVortex: "🌪️ Vortex client rank for GE0RGECR",
        rankAcquisitionSkywars: "✨️ SkyWars tournament winner",
        rankAcquisitionGod: "👑 Awarded for special contributions to the project",
        rankAcquisitionBedwars: "🎯 BedWars tournament winner",
        rankAcquisitionOwner: "⭐ Server owners and content creators",
        rankAcquisitionDeveloper: "🔧 Client developers and testers",
        rankAcquisitionAdmin: "🔒 Community administrators and moderators",
        rankAcquisitionYoutuber: "📹 Streamers and YouTube content creators",
        rankAcquisitionSuper: "⚡ Available to everyone via Discord application",
        
        // Rank Notice
		rankNoticeText: "All ranks <span class='rank-notice-highlight'>from Admin to God</span> are available through events, giveaways, and contests!",
        rankNoticeHighlight: "from Admin to God",
        rankNoticeYouTube: "Follow updates on YouTube",
        rankNoticeDiscord: "Join our Discord community",
        
		// Rank Selector Page
		rankSelectorTitle: "Rank Selection",
		rankSelectorSubtitle: "Fill in all fields to get your rank",
		nicknameLabel: "Nickname",
		nicknamePlaceholder: "For example: Player123",
		nicknameHint: "Maximum 20 characters",
		rankSelectionLabel: "Rank Selection",
		colorSelectionLabel: "Nickname Color",
		colorPickerLabel: "Choose a color:",
		hexLabel: "HEX:",
		rgbLabel: "RGB:",
		bloxdColorLabel: "Bloxd color:",
		bloxdColorPlaceholder: "Select Bloxd color",
		imageUploadLabel: "Screenshot from Bloxd.io:",
		imageUploadText: "Drag and drop an image here or click to select",
		imageUploadHint: "Recommended format: PNG, JPG. Maximum size: 5MB",
		encodedDataLabel: "Encrypted Data",
		encodedPlaceholder: "Encrypted text will appear here after filling all fields...",
		copyButton: "Copy",
		generateButton: "Generate",
		generateInfo: "Send this text in Discord to get your rank",

		// Bloxd Color Names
		bloxdColorFrost: "Frost",
		bloxdColorLemon: "Lemon", 
		bloxdColorSprout: "Sprout",
		bloxdColorNeon: "Neon",
		bloxdColorMint: "Mint",
		bloxdColorCyan: "Cyan",
		bloxdColorAzure: "Azure",
		bloxdColorOrchid: "Orchid",
		bloxdColorBubblegum: "Bubblegum",
		bloxdColorCoral: "Coral",
		bloxdColorApricot: "Apricot",
		bloxdColorAmber: "Amber",
		bloxdColorWhite: "White",
        
        // Installation Instructions
        howToGetRankTitle: "How to get rank?",
        step1Title: "Install the extension",
        step1Text: "Download and install the FreeRanksClient extension for Tampermonkey by clicking the \"Download Extension\" button.",
        step2Title: "Write in Discord",
        step2Text: "Click on the Discord icon at the bottom of the page and write to <span class='discord-username'>@ERR0R9999K</span> in private messages.",
        step3Title: "Submit rank request",
        step3Text: "The message must contain:",
        step3Req1: "Screenshot of the main page of Bloxd.io with visible nickname",
        step3Req2: "Your nickname (as text)",
        step3Req3: "Rank you want to get",
        step3Req4: "Nickname color",
        step4Title: "Get the rank",
        step4Text: "After approval of the application, you will receive a unique rank and colored nickname that all players with the extension will see.",
        
        // Footer
        footerText: "Get exclusive ranks for Bloxd.io for free!",
        copyright: "&copy; 2025 FreeRanksClient. All rights reserved. | This is a fan project, not affiliated with the official Bloxd.io developers",
        
		// Videos Page
        videosTitle: "YouTube Videos",
        videosSubtitle: "Latest videos from our YouTube channel",
        visitYouTubeChannel: "Visit Our YouTube Channel",
        videoDate: "Date",
        videoDuration: "Duration",
        wantMoreContent: "Want more content?",
        subscribeYouTube: "Subscribe to our YouTube channel for the latest updates, tutorials, and showcases!",
        subscribeButton: "Subscribe on YouTube",
        videosNav: "Videos",
        
        // DevLog Page
        devlogTitle: "Development Log",
        devlogSubtitle: "Latest updates and improvements to FreeRanksClient",
        backToHome: "Back to Home",
        
        // Update Entries
        // Update 1
        update1Title: "Version 1.5.0 / Client Release!",
        update1Change1: "Display in the main menu.",
        update1Change2: "Display in the chat.",
        update1Change3: "Display in the party.",
        update1Change4: "Display in the friends list.",
        update1Change5: "And in other little-used places...",
        update1Change6: "A good database.",
        update1Change7: "Easy rank acquisition!",
        // Update 2
        update2Title: "Version 2.7.1 / Global Client Update!",
        update2Change1: "Fixed bugs from the previous version.",
        update2Change2: "The formatting of the text in problematic places has been fixed.",
        update2Change3: "Globally rewritten code!",
        update2Change4: "Updated ad blocker.",
        update2Change5: "Added more advanced functionality!",
        // Update 3
        update3Title: "Version 3.1.2 / Global Client Update!",
        update3Change1: "Fixed errors the previous version.",
        update3Change2: "Added additional game styles.",
        update3Change3: "An advanced ad blocker.",
        update3Change4: "The visualization of the super rank has been updated.",
        update3Change5: "Displaying ranks and color nickname in it name tags!"
    },
    ru: {
        // Navigation
        home: "Главная",
        features: "Особенности",
        ranks: "Ранги",
        installation: "Установка",
        
        // Main banner
        heroTitle: "Почему платить <span class='highlight'>$9</span> за Super Rank?",
        heroText: "Получите Super Rank и другие эксклюзивные ранги <span class='highlight'>БЕСПЛАТНО</span> с FreeRanksClient! Просто установите расширение и напишите в Discord.",
        downloadExtension: "Скачать расширение",
        howToGetRank: "Как получить ранг",
        
        // Features
        whyFreeRanksClient: "Почему FreeRanksClient?",
        feature1Title: "Абсолютно бесплатно",
        feature1Text: "Все ранги доступны совершенно бесплатно. Зачем платить $9 за Super Rank, если можно получить его даром?",
        feature2Title: "Эксклюзивные ранги",
        feature2Text: "Получите не только Super Rank, но и другие уникальные ранги: Developer, Admin, YouTuber и другие!",
        feature3Title: "Видимость для всех",
        feature3Text: "Все игроки с установленным расширением увидят ваши цветные ранги и никнеймы в игре.",
        feature4Title: "Простота получения",
        feature4Text: "Просто напишите в личные сообщения Discord и получите ранг без сложных процедур.",
        feature5Title: "Безопасность",
        feature5Text: "Расширение не нарушает правила игры и работает в разрешённых рамках.",
        feature6Title: "Автообновления",
        feature6Text: "Автоматическое получение новых рангов и исправлений ошибок.",
        
        // Ranks
        availableRanks: "Доступные ранги",
        rank1Desc: "Серый никнейм с иконкой гаечного ключа",
        rank2Desc: "Сине-серый никнейм с иконкой администратора",
        rank3Desc: "Красный никнейм с иконкой YouTube",
        rank4Desc: "Золотой никнейм с иконкой молнии",
        rankClientDesc: "Эксклюзивный ранг клиента с фиолетовым цветом",
        rankGodDesc: "Золотой никнейм с иконкой короны",
        rankSkywarsDesc: "Голубой никнейм с иконкой звезды",
        rankBedwarsDesc: "Красный никнейм с иконкой куба",
        rankVortexDesc: "Ранг был присвоен только GE0RGECR за помощь в работе с клиентом",
        rankLegendDesc: "Огненно-оранжевый легендарный ранг",
        rankDemonicDesc: "Чёрный череп и кровавый огонь.  Цвет подобен вечному пожару",
        rankHotDesc: "Он острый, как перец чили. Он горит бесконечным огнем",
        rankOwnerDesc: "Оранжевый никнейм с золотой короной",
        free: "БЕСПЛАТНО",
        rankNote: "Официальный Super Rank стоит <span class='highlight'>$8.99</span> и действует всего 90 дней. С FreeRanksClient вы получаете его <span class='highlight'>БЕСПЛАТНО</span> и навсегда!",
        
        // Rank Acquisition Methods
        rankAcquisitionClient: "💜 Только для владельца клиента",
        rankAcquisitionHot: "🔥 Горячий ранг в самом прямом смысле этого слова",
        rankAcquisitionDemonic: "💀 Демонический ранг с черепом",
        rankAcquisitionLegend: "❤️‍🔥 Звание настоящей легенды",
        rankAcquisitionVortex: "🌪️ Ранг Vortex клиента для GE0RGECR",
        rankAcquisitionSkywars: "✨️ Победитель в турнире по SkyWars",
        rankAcquisitionGod: "👑 Выдается за особые заслуги перед проектом",
        rankAcquisitionBedwars: "🎯 Победитель в турнире по BedWars",
        rankAcquisitionOwner: "⭐ Владельцы серверов и создатели контента",
        rankAcquisitionDeveloper: "🔧 Разработчики и тестировщики клиента",
        rankAcquisitionAdmin: "🔒 Администраторы сообщества и модераторы",
        rankAcquisitionYoutuber: "📹 Стримеры и создатели YouTube контента",
        rankAcquisitionSuper: "⚡ Доступен всем через заявку в Discord",
        
        // Rank Notice
        rankNoticeText: "Все ранги <span class='rank-notice-highlight'>от Admin до God</span> доступны через участие в ивентах, раздачах и конкурсах!",
        rankNoticeHighlight: "от Admin до God", 
        rankNoticeYouTube: "Следите за обновлениями на YouTube",
        rankNoticeDiscord: "Присоединяйтесь к Discord сообществу",
        
		// Rank Selector Page
		rankSelectorTitle: "Выбор ранга",
		rankSelectorSubtitle: "Заполните все поля для получения ранга",
		nicknameLabel: "Никнейм",
		nicknamePlaceholder: "Например: Player123",
		nicknameHint: "Максимум 20 символов",
		rankSelectionLabel: "Выбор ранга",
		colorSelectionLabel: "Цвет никнейма",
		colorPickerLabel: "Выберите цвет:",
		hexLabel: "HEX:",
		rgbLabel: "RGB:",
		bloxdColorLabel: "Bloxd цвет:",
		bloxdColorPlaceholder: "Выберите цвет Bloxd",
		imageUploadLabel: "Скриншот из Bloxd.io:",
		imageUploadText: "Перетащите сюда изображение или нажмите для выбора",
		imageUploadHint: "Рекомендуемый формат: PNG, JPG. Максимальный размер: 5MB",
		encodedDataLabel: "Зашифрованные данные",
		encodedPlaceholder: "Здесь появится зашифрованный текст после заполнения всех полей...",
		copyButton: "Копировать",
		generateButton: "Сгенерировать",
		generateInfo: "Отправьте этот текст в Discord для получения ранга",

		// Bloxd Color Names
		bloxdColorFrost: "Frost",
		bloxdColorLemon: "Lemon", 
		bloxdColorSprout: "Sprout",
		bloxdColorNeon: "Neon",
		bloxdColorMint: "Mint",
		bloxdColorCyan: "Cyan",
		bloxdColorAzure: "Azure",
		bloxdColorOrchid: "Orchid",
		bloxdColorBubblegum: "Bubblegum",
		bloxdColorCoral: "Coral",
		bloxdColorApricot: "Apricot",
		bloxdColorAmber: "Amber",
		bloxdColorWhite: "White",
        
        // Installation Instructions
        howToGetRankTitle: "Как получить ранг?",
        step1Title: "Установите расширение",
        step1Text: "Скачайте и установите расширение FreeRanksClient для Tampermonkey, нажав кнопку \"Скачать расширение\".",
        step2Title: "Напишите в Discord",
        step2Text: "Нажмите на иконку Discord внизу страницы и напишите <span class='discord-username'>@ERR0R9999K</span> в личные сообщения.",
        step3Title: "Отправьте заявку на ранг",
        step3Text: "В сообщении должны быть:",
        step3Req1: "Скриншот главной страницы Bloxd.io с видимым никнеймом",
        step3Req2: "Ваш никнейм (как текст)",
        step3Req3: "Ранг, который хотите получить",
        step3Req4: "Цвет никнейма",
        step4Title: "Получите ранг",
        step4Text: "После одобрения заявки вы получите уникальный ранг и цветной никнейм, который будут видеть все игроки с расширением.",
        
        // Footer
        footerText: "Получите эксклюзивные ранги для Bloxd.io бесплатно!",
        copyright: "&copy; 2025 FreeRanksClient. Все права защищены. | Это фанатский проект, не связанный с официальными разработчиками Bloxd.io",
        
        // Videos Page
        videosTitle: "Видео с YouTube",
        videosSubtitle: "Последние видео с нашего YouTube канала",
        visitYouTubeChannel: "Посетить наш YouTube канал",
        videoDate: "Дата",
        videoDuration: "Длительность",
        wantMoreContent: "Хотите больше контента?",
        subscribeYouTube: "Подпишитесь на наш YouTube канал для получения последних обновлений, руководств и демонстраций!",
        subscribeButton: "Подписаться на YouTube",
        videosNav: "Видео",
        
        // DevLog Page
        devlogTitle: "Журнал обновлений",
        devlogSubtitle: "Последние обновления и улучшения FreeRanksClient",
        backToHome: "Назад на главную",
        
        // Update Entries
        // Update 1
        update1Title: "Версия 1.5.0 / Выпуск клиента!",
        update1Change1: "Отображение в главном меню.",
        update1Change2: "Отображение в чате.",
        update1Change3: "Отображение в вечеринке.",
        update1Change4: "Отображение в списке друзей.",
        update1Change5: "И в других малоиспользуемых местах...",
        update1Change6: "Хорошая база данных.",
        update1Change7: "Простое получение ранга!",
        // Update 2
        update2Title: "Версия 2.7.1 / Глобальное обновление клиента!",
        update2Change1: "Исправлены ошибки предыдущей версии.",
        update2Change2: "Исправлено форматирование текста в проблемных местах.",
        update2Change3: "Глобально переписан код!",
        update2Change4: "Обновлен блокировщик рекламы.",
        update2Change5: "Добавлен более продвинутый функционал!",
        // Update 3
        update3Title: "Версия 3.1.2 / Глобальное обновление клиента!",
        update3Change1: "Исправлены ошибки предыдущей версии.",
        update3Change2: "Добавлены дополнительные стили игры.",
        update3Change3: "Усовершенствован блокировщик рекламы.",
        update3Change4: "Обновлена визуализация суперранга.",
        update3Change5: "Отображение рангов и цветных никнеймов в тегах имен!"
    }
};

// Apply Language
function applyLanguage(lang) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
    
    // Обработка плейсхолдеров
    document.querySelectorAll('[data-placeholder-translate]').forEach(element => {
        const key = element.getAttribute('data-placeholder-translate');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    const langDisplay = document.getElementById('lang-display');
    if (langDisplay) {
        langDisplay.textContent = lang.toUpperCase();
    }
    
    localStorage.setItem('selectedLanguage', lang);
}

function switchLanguage() {
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    applyLanguage(newLang);
}

window.addEventListener('DOMContentLoaded', function() {
    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
    applyLanguage(selectedLanguage);
   
    setTimeout(() => {
        applyLanguage(selectedLanguage);
    }, 50);
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    document.getElementById('home-link').addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});