// ==UserScript==
// @name         Bloxd.io Free ranks client TEST! Version V3.0 Beta!
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Free Ranks client for Bloxd.io!
// @author       @ERR0R9999K
// @match        https://bloxd.io/*
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @connect      googleusercontent.com
// @require      https://kit.fontawesome.com/a076d05399.js
// @icon         https://raw.githubusercontent.com/ERR0R9999K/FreeRanksClient/refs/heads/main/assets/Super%20Rank.png
// ==/UserScript==

(function() {
    'use strict';

    // ==================== КОНФИГУРАЦИЯ ====================
    const DATABASE_URL = 'https://script.google.com/macros/s/AKfycbxg3xlezIangCRNVQbACW1s8-8yB7dDzzqM7u_yrnxyksuyOqcnJ5cLNQ6nIS7K2UEt/exec';

    // Предопределенные цвета
    const PREDEFINED_COLORS = {
        'Red': '#ff6666',
        'Purple': '#cc66ff'
    };

    // Настройки размеров
    const config = {
        settings: {
            targetIconSize: 40,
            defaultMargin: '3px'
        }
    };

    // ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
    let playerData = [];
    let rankConfigs = {};
    let currentPlayerNickname = '';

    // ==================== СИСТЕМА ЗАГРУЗКИ ДАННЫХ ====================
    function loadPlayerData() {
        console.log('[Bloxd Ranks v7.0] Загрузка данных из базы...');

        GM_xmlhttpRequest({
            method: 'GET',
            url: DATABASE_URL,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    console.log('[Bloxd Ranks v7.0] Данные успешно загружены:', data.length, 'игроков');

                    playerData = data;
                    processDatabaseData();

                } catch (error) {
                    console.error('[Bloxd Ranks v7.0] Ошибка парсинга данных:', error);
                }
            },
            onerror: function(error) {
                console.error('[Bloxd Ranks v7.0] Ошибка загрузки данных:', error);
            }
        });
    }

    function processDatabaseData() {
        rankConfigs = {};

        playerData.forEach(row => {
            // Проверяем наличие обязательных полей
            if (!row.nickname || !row.ranks) {
                console.log('[Bloxd Ranks v7.0] Пропуск строки - отсутствует nickname или ranks:', row);
                return;
            }

            const nickname = row.nickname.toString().trim();
            const ranks = row.ranks.toString().split(',').map(r => r.trim().toLowerCase());
            const nicknameColor = parseColor(row.nickname_color);
            const style = row.style || '';

            console.log('[Bloxd Ranks v7.0] Обработка игрока:', nickname, 'ранги:', ranks);

            // Обрабатываем config если он есть
            if (row.config) {
                try {
                    const config = JSON.parse(row.config);

                    // Сохраняем конфигурацию рангов
                    if (config.ranks && Array.isArray(config.ranks)) {
                        config.ranks.forEach(rank => {
                            if (rank.id) {
                                rankConfigs[rank.id.toLowerCase()] = rank;
                                console.log('[Bloxd Ranks v7.0] Добавлен конфиг ранга:', rank.id);
                            }
                        });
                    }

                } catch (error) {
                    console.error('[Bloxd Ranks v7.0] Ошибка парсинга config для игрока', nickname, error);
                }
            }

            // Сохраняем данные игрока
            const playerIndex = playerData.findIndex(p => p.nickname === row.nickname);
            if (playerIndex !== -1) {
                playerData[playerIndex].processedData = {
                    ranks: ranks,
                    nicknameColor: nicknameColor,
                    style: style,
                    config: row.config
                };
                console.log('[Bloxd Ranks v7.0] Данные игрока сохранены:', nickname);
            }
        });

        console.log('[Bloxd Ranks v7.0] Данные обработаны. Конфигов рангов:', Object.keys(rankConfigs).length);
        console.log('[Bloxd Ranks v7.0] Доступные ранги:', Object.keys(rankConfigs));
        applyMainPageRankSystem();
        applyPlayerProfileRanks();
        applyChatPlayerRanks();
        applyLeaderBoardPlayerRanks();
        addSuperRankVisuals();
    }

    function parseColor(color) {
        if (!color) return '';

        const colorStr = color.toString().trim();

        if (PREDEFINED_COLORS[colorStr]) {
            return PREDEFINED_COLORS[colorStr];
        }

        if (colorStr.startsWith('#')) {
            return colorStr;
        }

        return '';
    }

    // ==================== СИСТЕМА ОПРЕДЕЛЕНИЯ НИКА ИГРОКА ====================
    function findCurrentPlayerNickname() {
        const playerNameElements = document.querySelectorAll('.PlayerNamePreview .TextFromServerEntityName');

        for (let element of playerNameElements) {
            const text = element.textContent.trim();
            if (text && text.length > 2 && text.length < 25) {
                const foundPlayer = playerData.find(player =>
                    player.nickname && text.toLowerCase().includes(player.nickname.toString().toLowerCase())
                );
                if (foundPlayer) {
                    console.log('[Bloxd Ranks v7.0] Текущий игрок найден:', foundPlayer.nickname);
                    return foundPlayer.nickname;
                }
            }
        }

        console.log('[Bloxd Ranks v7.0] Текущий игрок не найден');
        return '';
    }

    function extractNicknameFromElement(element) {
        const nameElement = element.querySelector('.TextFromServerEntityName');
        if (nameElement) {
            const text = nameElement.textContent.trim();
            if (text && text.length > 2 && text.length < 25) {
                const foundPlayer = playerData.find(player =>
                    player.nickname && text.toLowerCase().includes(player.nickname.toString().toLowerCase())
                );
                if (foundPlayer) {
                    console.log('[Bloxd Ranks v7.0] Никнейм найден в элементе:', foundPlayer.nickname);
                    return foundPlayer.nickname;
                }
            }
        }
        return null;
    }

    // ==================== СИСТЕМА РАНГОВ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ ====================
    function applyMainPageRankSystem() {
        addMainPageRankStyles();
        processMainPagePlayerNames();

        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;

            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.querySelector && node.querySelector('.PlayerNamePreview')) {
                                shouldProcess = true;
                                break;
                            }
                            if (node.classList && node.classList.contains('PlayerNamePreview')) {
                                shouldProcess = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldProcess) break;
            }

            if (shouldProcess) {
                setTimeout(processMainPagePlayerNames, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function addMainPageRankStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .bloxd-mainpage-rank-container {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                aspect-ratio: 1/1;
                height: 100%;
                min-height: 20px;
                margin-right: ${config.settings.defaultMargin};
                border-radius: 0 !important;
                position: relative;
            }
            .bloxd-mainpage-rank-icon {
                font-size: ${config.settings.targetIconSize}px;
                width: 1em;
                height: 1em;
                position: absolute;
                transform: translate(-50%, -50%) scale(0.5);
                top: 50%;
                left: 50%;
            }
            .PlayerNamePreview, .PlayerNamePreviewNoRanks {
                display: inline-flex;
                align-items: center;
                height: 100%;
            }
            .bloxd-mainpage-custom-nickname {
                transition: color 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    function processMainPagePlayerNames() {
        currentPlayerNickname = findCurrentPlayerNickname();

        document.querySelectorAll('.PlayerNamePreview, .PlayerNamePreviewNoRanks').forEach(playerElement => {
            if (playerElement.hasAttribute('data-bloxd-mainpage-processed')) {
                return;
            }

            const playerNickname = extractNicknameFromElement(playerElement) || currentPlayerNickname;
            if (!playerNickname) {
                console.log('[Bloxd Ranks v7.0] Никнейм не найден для элемента');
                return;
            }

            const playerDataEntry = playerData.find(p => p.nickname.toString().toLowerCase() === playerNickname.toString().toLowerCase());
            if (!playerDataEntry || !playerDataEntry.processedData) {
                console.log('[Bloxd Ranks v7.0] Данные игрока не найдены:', playerNickname);
                return;
            }

            const { ranks, nicknameColor, style } = playerDataEntry.processedData;
            console.log('[Bloxd Ranks v7.0] Применяем ранги для', playerNickname, ':', ranks);

            playerElement.querySelectorAll('.bloxd-mainpage-rank-container').forEach(el => el.remove());

            const ranksContainer = document.createElement('div');
            ranksContainer.style.display = 'inline-flex';
            ranksContainer.style.alignItems = 'center';
            ranksContainer.style.height = '100%';
            ranksContainer.style.marginRight = '5px';

            let ranksAdded = 0;
            ranks.forEach(rankId => {
                const rankConfig = rankConfigs[rankId.toLowerCase()];
                if (rankConfig && rankConfig.show !== false) {
                    const rankElement = createMainPageRankElement(rankConfig);
                    if (rankElement) {
                        ranksContainer.appendChild(rankElement);
                        ranksAdded++;
                        console.log('[Bloxd Ranks v7.0] Добавлен ранг:', rankId);
                    }
                } else {
                    console.log('[Bloxd Ranks v7.0] Ранг не найден или отключен:', rankId);
                }
            });

            if (ranksAdded > 0) {
                playerElement.insertBefore(ranksContainer, playerElement.firstChild);
                console.log('[Bloxd Ranks v7.0] Добавлено рангов:', ranksAdded);
            }

            applyMainPageNicknameStyle(playerElement, nicknameColor, style);
            playerElement.setAttribute('data-bloxd-mainpage-processed', 'true');
        });
    }

    function applyMainPageNicknameStyle(playerElement, nicknameColor, style) {
        const nameElement = playerElement.querySelector('.TextFromServerEntityName');
        if (nameElement) {
            if (!nameElement.classList.contains('bloxd-mainpage-custom-nickname')) {
                nameElement.classList.add('bloxd-mainpage-custom-nickname');
            }
            if (nicknameColor) {
                nameElement.style.color = nicknameColor;
                console.log('[Bloxd Ranks v7.0] Применен цвет:', nicknameColor);
            }
            if (style) {
                nameElement.style.cssText += style;
                console.log('[Bloxd Ranks v7.0] Применены стили:', style);
            }
        }
    }

    function createMainPageRankElement(rankConfig) {
        if (!rankConfig) return null;

        const container = document.createElement('div');
        container.className = `bloxd-mainpage-rank-container ${rankConfig.customClass || ''}`;
        container.style.backgroundColor = rankConfig.bgColor || '#cccccc';
        container.style.marginRight = rankConfig.marginRight || config.settings.defaultMargin;

        const icon = document.createElement('i');
        icon.className = `${rankConfig.iconClass} bloxd-mainpage-rank-icon`;
        icon.style.color = rankConfig.iconColor || '#ffffff';

        container.appendChild(icon);

        const updateMainPageIconSize = () => {
            const containerHeight = container.offsetHeight;
            const scale = Math.min(1, containerHeight / config.settings.targetIconSize);
            icon.style.transform = `translate(-50%, -50%) scale(${scale * 0.8})`;
        };

        updateMainPageIconSize();

        const resizeObserver = new ResizeObserver(updateMainPageIconSize);
        resizeObserver.observe(container);

        return container;
    }

    // ==================== СИСТЕМА РАНГОВ ДЛЯ ПРОФИЛЯ ИГРОКА ====================
    function applyPlayerProfileRanks() {
        addPlayerProfileRankStyles();
        processPlayerProfiles();

        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;

            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.querySelector && node.querySelector('.ProfilePreviewName')) {
                                shouldProcess = true;
                                break;
                            }
                            if (node.classList && node.classList.contains('ProfilePreviewName')) {
                                shouldProcess = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldProcess) break;
            }

            if (shouldProcess) {
                setTimeout(processPlayerProfiles, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function addPlayerProfileRankStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .bloxd-profile-rank-container {
                display: inline-flex;
                align-items: center;
                gap: 3px;
                margin-right: 8px;
                height: 100%;
            }
            .bloxd-profile-rank-icon {
                font-size: 1em;
                vertical-align: middle;
                line-height: 1;
            }
            .ProfilePreviewName {
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
                height: 100%;
            }
        `;
        document.head.appendChild(style);
    }

    function processPlayerProfiles() {
        document.querySelectorAll('.ProfilePreviewName').forEach(profileNameElement => {
            if (profileNameElement.hasAttribute('data-bloxd-profile-processed')) {
                return;
            }

            const nameElement = profileNameElement.querySelector('.TextFromServerEntityName');
            if (!nameElement) {
                return;
            }

            const playerNickname = nameElement.textContent.trim();
            if (!playerNickname) {
                return;
            }

            console.log('[Bloxd Ranks v7.0] Обрабатываем профиль:', playerNickname);

            const playerDataEntry = playerData.find(p =>
                p.nickname && playerNickname.toLowerCase().includes(p.nickname.toString().toLowerCase())
            );

            if (!playerDataEntry || !playerDataEntry.processedData) {
                console.log('[Bloxd Ranks v7.0] Данные игрока не найдены:', playerNickname);
                return;
            }

            const { ranks, nicknameColor, style } = playerDataEntry.processedData;
            console.log('[Bloxd Ranks v7.0] Найдены ранги для', playerNickname, ':', ranks);

            profileNameElement.querySelectorAll('.bloxd-profile-rank-container').forEach(el => el.remove());

            const ranksContainer = document.createElement('div');
            ranksContainer.className = 'bloxd-profile-rank-container';

            let ranksAdded = 0;
            ranks.forEach(rankId => {
                const rankConfig = rankConfigs[rankId.toLowerCase()];
                if (rankConfig && rankConfig.show !== false && rankConfig.iconClass) {
                    const rankElement = createPlayerProfileRankElement(rankConfig);
                    if (rankElement) {
                        ranksContainer.appendChild(rankElement);
                        ranksAdded++;
                        console.log('[Bloxd Ranks v7.0] Добавлен ранг в профиль:', rankId);
                    }
                } else {
                    console.log('[Bloxd Ranks v7.0] Ранг не найден для профиля:', rankId);
                }
            });

            if (ranksAdded > 0) {
                profileNameElement.insertBefore(ranksContainer, profileNameElement.firstChild);
                console.log('[Bloxd Ranks v7.0] Добавлено рангов в профиль:', ranksAdded);
            }

            if (nicknameColor) {
                nameElement.style.color = nicknameColor;
            }
            if (style) {
                nameElement.style.cssText += style;
            }

            profileNameElement.setAttribute('data-bloxd-profile-processed', 'true');
            console.log('[Bloxd Ranks v7.0] Профиль успешно обработан:', playerNickname);
        });
    }

    function createPlayerProfileRankElement(rankConfig) {
        if (!rankConfig || !rankConfig.iconClass) return null;

        const icon = document.createElement('i');
        icon.className = `${rankConfig.iconClass} bloxd-profile-rank-icon`;
        icon.style.color = rankConfig.bgColor || '#cccccc';

        return icon;
    }

    // ==================== СИСТЕМА РАНГОВ ДЛЯ ЧАТА ====================
    function applyChatPlayerRanks() {
        addChatRankStyles();
        processChatMessages();

        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;

            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.querySelector && node.querySelector('.MessageWrapper')) {
                                shouldProcess = true;
                                break;
                            }
                            if (node.classList && node.classList.contains('MessageWrapper')) {
                                shouldProcess = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldProcess) break;
            }

            if (shouldProcess) {
                setTimeout(processChatMessages, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function addChatRankStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .bloxd-chat-rank {
                display: inline;
            }
            .bloxd-chat-rank-element {
                display: inline;
            }
            .bloxd-chat-custom-nickname {
                transition: color 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    function processChatMessages() {
        document.querySelectorAll('.MessageWrapper').forEach(messageWrapper => {
            if (messageWrapper.hasAttribute('data-bloxd-chat-processed')) {
                return;
            }

            const textFromServer = messageWrapper.querySelector('.TextFromServer');
            if (!textFromServer) {
                return;
            }

            // Ищем все IndividualText элементы
            const individualTexts = textFromServer.querySelectorAll('.IndividualText');
            if (individualTexts.length < 3) {
                return;
            }

            // Ищем структуру: никнейм + ":" + сообщение
            let nicknameElement = null;
            let separatorElement = null;
            let messageElement = null;

            // Проходим по всем IndividualText и ищем паттерн никнейм + ":" + сообщение
            for (let i = 0; i < individualTexts.length - 2; i++) {
                const currentElement = individualTexts[i];
                const nextElement = individualTexts[i + 1];
                const nextNextElement = individualTexts[i + 2];

                const currentText = currentElement.textContent.trim();
                const nextText = nextElement.textContent.trim();

                // Проверяем, является ли следующий элемент разделителем ":"
                if (nextText === ':' || nextText === ': ') {
                    // Проверяем, является ли текущий элемент никнеймом (не пустой и не специальный символ)
                    if (currentText && currentText.length > 2 && currentText.length < 25 &&
                        !currentText.includes('[') && !currentText.includes(']') &&
                        !currentText.includes('<') && !currentText.includes('>')) {

                        nicknameElement = currentElement;
                        separatorElement = nextElement;
                        messageElement = nextNextElement;
                        break;
                    }
                }
            }

            if (!nicknameElement || !separatorElement || !messageElement) {
                console.log('[Bloxd Ranks v7.0] Структура сообщения не распознана');
                return;
            }

            const playerNickname = nicknameElement.textContent.trim();
            if (!playerNickname) {
                return;
            }

            console.log('[Bloxd Ranks v7.0] Обрабатываем сообщение чата от:', playerNickname);

            // Ищем игрока в базе данных
            const playerDataEntry = playerData.find(p =>
                p.nickname && playerNickname.toLowerCase().includes(p.nickname.toString().toLowerCase())
            );

            if (!playerDataEntry || !playerDataEntry.processedData) {
                console.log('[Bloxd Ranks v7.0] Данные игрока не найдены для чата:', playerNickname);
                return;
            }

            const { ranks, nicknameColor, style } = playerDataEntry.processedData;
            console.log('[Bloxd Ranks v7.0] Найдены ранги для чата:', playerNickname, ':', ranks);

            // Удаляем старые ранги чата
            textFromServer.querySelectorAll('.bloxd-chat-rank').forEach(el => el.remove());

            // Собираем chatrank из всех доступных рангов игрока
            let chatRankHTML = '';
            let hasChatRank = false;

            ranks.forEach(rankId => {
                const rankConfig = rankConfigs[rankId.toLowerCase()];
                if (rankConfig && rankConfig.show !== false && rankConfig.chatrank && Array.isArray(rankConfig.chatrank)) {
                    rankConfig.chatrank.forEach(chatElement => {
                        chatRankHTML += chatElement;
                    });
                    hasChatRank = true;
                    console.log('[Bloxd Ranks v7.0] Добавлен chatrank для:', rankId);
                }
            });

            // Вставляем chatrank перед никнеймом
            if (hasChatRank && chatRankHTML) {
                const chatRankContainer = document.createElement('span');
                chatRankContainer.className = 'bloxd-chat-rank';
                chatRankContainer.innerHTML = chatRankHTML;

                textFromServer.insertBefore(chatRankContainer, nicknameElement);
                console.log('[Bloxd Ranks v7.0] Chatrank добавлен для:', playerNickname);
            }

            // Применяем цвет и стиль к нику в чате
            if (nicknameColor) {
                if (!nicknameElement.classList.contains('bloxd-chat-custom-nickname')) {
                    nicknameElement.classList.add('bloxd-chat-custom-nickname');
                }
                nicknameElement.style.color = nicknameColor;
                console.log('[Bloxd Ranks v7.0] Применен цвет ника в чате:', nicknameColor);
            }
            if (style) {
                nicknameElement.style.cssText += style;
                console.log('[Bloxd Ranks v7.0] Применены стили ника в чате:', style);
            }

            messageWrapper.setAttribute('data-bloxd-chat-processed', 'true');
            console.log('[Bloxd Ranks v7.0] Сообщение чата обработано:', playerNickname);
        });
    }

    // ==================== СИСТЕМА РАНГОВ ДЛЯ ТАБЛИЦЫ ЛИДЕРОВ ====================
    function applyLeaderBoardPlayerRanks() {
        addLeaderBoardRankStyles();
        processLeaderBoardPlayers();

        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;

            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.querySelector && node.querySelector('.PlayerPfpAndName')) {
                                shouldProcess = true;
                                break;
                            }
                            if (node.classList && node.classList.contains('PlayerPfpAndName')) {
                                shouldProcess = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldProcess) break;
            }

            if (shouldProcess) {
                setTimeout(processLeaderBoardPlayers, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function addLeaderBoardRankStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .bloxd-leaderboard-rank-container {
                display: inline-flex;
                align-items: center;
                gap: 3px;
                margin-right: 8px;
                height: 100%;
            }
            .bloxd-leaderboard-rank-icon {
                font-size: 1em;
                vertical-align: middle;
                line-height: 1;
            }
            .PlayerPfpAndName {
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
                height: 100%;
            }
        `;
        document.head.appendChild(style);
    }

    function processLeaderBoardPlayers() {
        document.querySelectorAll('.PlayerPfpAndName').forEach(playerElement => {
            if (playerElement.hasAttribute('data-bloxd-leaderboard-processed')) {
                return;
            }

            // Ищем TextFromServerEntityName в структуре (может быть вложен в разные элементы)
            const nameElement = playerElement.querySelector('.TextFromServerEntityName');
            if (!nameElement) {
                return;
            }

            const playerNickname = nameElement.textContent.trim();
            if (!playerNickname) {
                return;
            }

            console.log('[Bloxd Ranks v7.0] Обрабатываем игрока в таблице лидеров:', playerNickname);

            const playerDataEntry = playerData.find(p =>
                p.nickname && playerNickname.toLowerCase().includes(p.nickname.toString().toLowerCase())
            );

            if (!playerDataEntry || !playerDataEntry.processedData) {
                console.log('[Bloxd Ranks v7.0] Данные игрока не найдены для таблицы лидеров:', playerNickname);
                return;
            }

            const { ranks, nicknameColor, style } = playerDataEntry.processedData;
            console.log('[Bloxd Ranks v7.0] Найдены ранги для таблицы лидеров:', playerNickname, ':', ranks);

            // Находим TextFromServer контейнер для вставки рангов
            const textFromServer = playerElement.querySelector('.TextFromServer');
            if (!textFromServer) {
                console.log('[Bloxd Ranks v7.0] TextFromServer не найден в PlayerPfpAndName');
                return;
            }

            // Удаляем старые ранги
            textFromServer.querySelectorAll('.bloxd-leaderboard-rank-container').forEach(el => el.remove());

            // Создаем контейнер для рангов
            const ranksContainer = document.createElement('div');
            ranksContainer.className = 'bloxd-leaderboard-rank-container';

            // Добавляем иконки рангов
            let ranksAdded = 0;
            ranks.forEach(rankId => {
                const rankConfig = rankConfigs[rankId.toLowerCase()];
                if (rankConfig && rankConfig.show !== false && rankConfig.iconClass) {
                    const rankElement = createLeaderBoardRankElement(rankConfig);
                    if (rankElement) {
                        ranksContainer.appendChild(rankElement);
                        ranksAdded++;
                        console.log('[Bloxd Ranks v7.0] Добавлен ранг в таблицу лидеров:', rankId);
                    }
                } else {
                    console.log('[Bloxd Ranks v7.0] Ранг не найден для таблицы лидеров:', rankId);
                }
            });

            // Вставляем ранги в начало TextFromServer
            if (ranksAdded > 0) {
                textFromServer.insertBefore(ranksContainer, textFromServer.firstChild);
                console.log('[Bloxd Ranks v7.0] Добавлено рангов в таблицу лидеров:', ranksAdded);
            }

            // Применяем стили к нику
            if (nicknameColor) {
                nameElement.style.color = nicknameColor;
            }
            if (style) {
                nameElement.style.cssText += style;
            }

            playerElement.setAttribute('data-bloxd-leaderboard-processed', 'true');
            console.log('[Bloxd Ranks v7.0] Игрок в таблице лидеров обработан:', playerNickname);
        });
    }

    function createLeaderBoardRankElement(rankConfig) {
        if (!rankConfig || !rankConfig.iconClass) return null;

        const icon = document.createElement('i');
        icon.className = `${rankConfig.iconClass} bloxd-leaderboard-rank-icon`;
        icon.style.color = rankConfig.bgColor || '#cccccc';

        return icon;
    }

    // ==================== ВИЗУАЛЬНЫЕ ИЗМЕНЕНИЯ ДЛЯ SUPER RANK ====================
    function addSuperRankVisuals() {
        initSettingsMenuObserver();

        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;

            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.querySelector && (node.querySelector('.ButtonBody') || node.querySelector('.MenuBody'))) {
                                shouldProcess = true;
                                break;
                            }
                            if (node.classList && (node.classList.contains('ButtonBody') || node.classList.contains('MenuBody'))) {
                                shouldProcess = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldProcess) break;
            }

            if (shouldProcess) {
                setTimeout(() => {
                    processSettingsMenu();
                }, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function processSettingsMenu() {
        // Ищем меню настроек
        const settingsMenu = document.querySelector('.SettingsMenuRightInner.AccountSettings');
        if (!settingsMenu) {
            return;
        }

        // Проверяем, не были ли элементы уже созданы
        if (settingsMenu.querySelector('.bloxd-visual-setting')) {
            return;
        }

        // Ищем любой существующий SettingBox как точку отсчета
        const existingSettingBox = settingsMenu.querySelector('.SettingBox');
        if (!existingSettingBox) {
            console.log('[Bloxd Ranks v7.0] SettingBox не найден для вставки');
            return;
        }

        // Создаем новый SettingBox
        const visualSettingBox = document.createElement('div');
        visualSettingBox.className = 'SettingBox bloxd-visual-setting';
        visualSettingBox.innerHTML = `
            <div class="SettingBoxInner"">
                <!-- Первая строка -->
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <i class="fas fa-zap" style="color: #ffcc00; font-size: 16px;"></i>
                    <span style="color: #ffcc00; font-size: 14px;">Super Rank</span>
                    <span style="color: #838383; font-size: 14px;">(∞ days left)</span>
                </div>
                <!-- Вторая строка -->
                <div style="display: flex; justify-content: flex-start; margin-bottom: 16px;">
                    <div class="NewButton GoldButton EverythingMenuTabListResumeButton" style="cursor: pointer;">
                        <div class="ButtonBottomBorder"></div>
                        <div class="ButtonTopBorder"></div>
                        <div class="ButtonBody" style="padding: 8px 8px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-zap" style="color: #ffffff; font-size: 16px;"></i>
                            <span style="color: #ffffff; font-size: 16px;">Get 90 additional days for 8.99 USD</span>
                        </div>
                    </div>
                </div>
                <!-- Третья строка -->
                <div style="display: flex; justify-content: flex-start;">
                    <div class="NewButton GoldButton EverythingMenuTabListResumeButton" style="cursor: pointer;">
                        <div class="ButtonBottomBorder"></div>
                        <div class="ButtonTopBorder"></div>
                        <div class="ButtonBody" style="padding: 8px 8px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-zap" style="color: #ffffff; font-size: 16px;"></i>
                            <span style="color: #ffffff; font-size: 16px;">Gift Super Rank</span>
                        </div>
                    </div>
                </div>
            </div>
        `

        // Вставляем после существующего SettingBox
        existingSettingBox.parentNode.insertBefore(visualSettingBox, existingSettingBox.nextSibling);

        console.log('[Bloxd Ranks v7.0] SettingBox добавлен в меню настроек');
    }

    function createMenuSideBarTab() {
        // Ищем боковое меню
        const menuSideBarBody = document.querySelector('.MenuSideBarBody');
        if (!menuSideBarBody) {
            return;
        }

        // Проверяем, не была ли вкладка уже создана
        if (menuSideBarBody.querySelector('.bloxd-sidebar-tab')) {
            return;
        }

        // Ищем существующие вкладки
        const existingTabs = menuSideBarBody.querySelectorAll('.MenuSideBarBodyTab');
        if (existingTabs.length === 0) {
            console.log('[Bloxd Ranks v7.0] Вкладки не найдены в боковом меню');
            return;
        }

        // Берем последнюю существующую вкладку
        const lastTab = existingTabs[existingTabs.length - 1];

        // Создаем новую вкладку
        const sideBarTab = document.createElement('div');
        sideBarTab.className = 'MenuSideBarBodyTab bloxd-sidebar-tab';
        sideBarTab.innerHTML = `
            <i class="fas fa-zap" font-size: 16px;"></i>
            <span style="margin-left: 8px;">Free Ranks</span>
        `;

        // Добавляем обработчик клика
        sideBarTab.addEventListener('click', function() {
            // Открываем ссылку в новой вкладке
            window.open('https://github.com/ERR0R9999K/FreeRanksClient', '_blank');
        })

        // Вставляем ПОСЛЕ последней вкладки
        lastTab.parentNode.insertBefore(sideBarTab, lastTab.nextSibling);

        console.log('[Bloxd Ranks v7.0] Вкладка добавлена в боковое меню после последней существующей вкладки');
    }

    function initSideBarObserver() {
        function checkAndAddSideBarTab() {
            createMenuSideBarTab();
        }

        // Проверяем сразу
        checkAndAddSideBarTab();

        // Наблюдатель за изменениями DOM
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    checkAndAddSideBarTab();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Периодическая проверка
        const interval = setInterval(checkAndAddSideBarTab, 2000);
        setTimeout(() => clearInterval(interval), 10000);
    }

    // Добавляем наблюдатель как в примере
    function initSettingsMenuObserver() {
        function checkAndAddSettings() {
            processSettingsMenu();
        }

        // Проверяем сразу
        checkAndAddSettings();

        // Наблюдатель за изменениями DOM
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    checkAndAddSettings();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Периодическая проверка на случай если наблюдатель не сработал
        const interval = setInterval(checkAndAddSettings, 2000);
        setTimeout(() => clearInterval(interval), 10000);
    }

    // ==================== ИНИЦИАЛИЗАЦИЯ ====================
    function initialize() {
        console.log('[Bloxd Ranks v7.0] Инициализация клиента...');

        loadPlayerData();

        setInterval(loadPlayerData, 30000);

        if (document.readyState === 'complete') {
            setTimeout(() => {
                applyMainPageRankSystem();
                applyPlayerProfileRanks();
                applyChatPlayerRanks();
                applyLeaderBoardPlayerRanks();
                addSuperRankVisuals();
                initSettingsMenuObserver();
                initSideBarObserver();
            }, 2000);
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    applyMainPageRankSystem();
                    applyPlayerProfileRanks();
                    applyChatPlayerRanks();
                    applyLeaderBoardPlayerRanks();
                    addSuperRankVisuals();
                    initSettingsMenuObserver();
                    initSideBarObserver();
                }, 2000);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
