// Unloaded PFP
const UnloadedPFP = "assets/images/pfp_skin_unloaded_preview.png";

const DATABASE_URL = 'https://script.google.com/macros/s/AKfycbxBbj28o3llFuUN0HCdirAd6dEBO326qusx_7E5mxA9LQnNGokB_G2ZAQGUzza41Lyq/exec';

// Bloxd Colors mapping
const BloxdColors = {
    'Default': '#dff8ff',
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
    'Amber': '#ffcc66'
};

// Cape configuration
const CapeConfig = {
    "super": { name: "Super", color: "#ffd020", source: "assets/images/cape/cape_super_preview.png" },
    "super_inverted": { name: "Super Inverted", color: "#ececec", source: "assets/images/cape/cape_super_inverted_preview.png" },
    "youtuber": { name: "Youtuber", color: "#b02c25", source: "assets/images/cape/cape_youtuber_preview.png" },
    "pig": { name: "Pig", color: "#ecbcc4", source: "assets/images/cape/cape_pig_preview.png" },
    "cow_normal": { name: "Cow", color: "#88664f", source: "assets/images/cape/cape_cow_normal_preview.png" },
    "cow_cream": { name: "Cow Cream", color: "#f4e6d5", source: "assets/images/cape/cape_cow_cream_preview.png" },
    "sheep": { name: "Sheep", color: "#fafafa", source: "assets/images/cape/cape_sheep_preview.png" },
    "frc": { name: "FRC", color: "#545454", source: "assets/images/cape/cape_frc_preview.png" },
    "verified": { name: "VERIFIED", color: "#1360c8", source: "assets/images/cape/cape_verifidRank_preview.png" }
};

// Player type configuration
const PlayerType = {
    "owner": { name: "Owner", color: "#cc66ff" },
    "verified": { name: "Verified", color: "#1360c8" },
    "normal": { name: "Normal", color: "#bababa" }
};

// Global ranks config (will be set from the first player)
let globalRanksConfig = null;

// Store all players for URL lookups
let allPlayersData = [];

// Current preview element and timeout
let previewTimeout = null;
let currentPreview = null;

// Helper function to get color from BloxdColors or return hex value
function getColorFromBloxd(colorValue) {
    if (!colorValue) return null;
    if (BloxdColors[colorValue]) {
        return BloxdColors[colorValue];
    }
    if (colorValue.startsWith('#')) {
        return colorValue;
    }
    return null;
}

// Get URL parameter
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Update URL without reload
function updateURLParameter(param, value) {
    const url = new URL(window.location);
    if (value) {
        url.searchParams.set(param, value);
    } else {
        url.searchParams.delete(param);
    }
    window.history.pushState({}, '', url);
}

// Encode player data to base64
function encodePlayerData(player) {
    try {
        const playerForModal = {
            nickname: player.nickname,
            ranks: player.ranks,
            nickname_color: player.nickname_color,
            style: player.style,
            PlayerSkin: player.PlayerSkin,
            Cape: player.Cape,
            NameTagBG: player.NameTagBG,
            typePlayer: player.typePlayer
        };
        
        const jsonString = JSON.stringify(playerForModal);
        return btoa(unescape(encodeURIComponent(jsonString)));
    } catch (e) {
        console.error('Error encoding player data:', e);
        return '';
    }
}

// Decode player data from base64
function decodePlayerData(encodedData) {
    try {
        const jsonString = decodeURIComponent(escape(atob(encodedData)));
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('Error decoding player data:', e);
        return null;
    }
}

// Open modal with encoded data
function _0x32b0(encodedData) {
    const player = decodePlayerData(encodedData);
    if (player) {
        openPlayerModal(player);
        
        if (player.nickname) {
            updateURLParameter('FRC-Profile', encodeURIComponent(player.nickname));
        }
    }
}

// Find player by nickname
function findPlayerByNickname(nickname) {
    if (!allPlayersData.length) return null;
    
    const decodedNickname = decodeURIComponent(nickname);
    
    return allPlayersData.find(player => 
        player.nickname && player.nickname.toLowerCase() === decodedNickname.toLowerCase()
    );
}

// Check URL for profile parameter and open modal
async function checkURLForProfile() {
    const profileNickname = getURLParameter('FRC-Profile');
    
    if (profileNickname && allPlayersData.length) {
        const player = findPlayerByNickname(profileNickname);
        if (player) {
            setTimeout(() => {
                openPlayerModal(player);
            }, 500);
        } else {
            console.log('Player not found:', profileNickname);
            showNotification('Player not found!', 'error');
        }
    }
}

// Show notification
function showNotification(message, type) {
    // Simple alert for now
    console.log(message);
}

// Fetch players from Google Apps Script
async function fetchPlayers() {
    const playerGrid = document.getElementById('player-grid');
    const totalPlayersLoading = document.getElementById('total-players-loading');
    const totalPlayers = document.getElementById('total-players');
    const playerCount = document.getElementById('player-count');
    
    try {
        totalPlayersLoading.style.display = 'inline-block';
        totalPlayers.style.display = 'none';
        
        playerGrid.innerHTML = `
            <div style="text-align: center; padding: 50px; grid-column: 1/-1;">
                <i class="fas fa-spinner fa-spin fa-3x" style="color: #8a2be2;"></i>
                <p style="margin-top: 20px;">Loading player list...</p>
            </div>
        `;
        
        const response = await fetch(DATABASE_URL);
        const players = await response.json();
        
        allPlayersData = players;
        
        const firstPlayerWithConfig = players.find(p => p.config && p.config.trim() !== '');
        if (firstPlayerWithConfig) {
            try {
                globalRanksConfig = JSON.parse(firstPlayerWithConfig.config);
            } catch (e) {
                console.error('Error parsing global config:', e);
            }
        }
        
        const validPlayers = players.filter(player => player.nickname && player.nickname.trim() !== '');
        
        playerCount.textContent = validPlayers.length;
        
        totalPlayersLoading.style.display = 'none';
        totalPlayers.style.display = 'inline-block';
        
        renderPlayers(validPlayers);
        
        checkURLForProfile();
        
    } catch (error) {
        console.error('Error fetching players:', error);
        
        playerCount.textContent = '0';
        
        totalPlayersLoading.style.display = 'none';
        totalPlayers.style.display = 'inline-block';
        
        playerGrid.innerHTML = `
            <div style="text-align: center; padding: 50px; grid-column: 1/-1; color: #ff6b6b;">
                <i class="fas fa-exclamation-triangle fa-3x"></i>
                <p style="margin-top: 20px;">Error loading players. Please try again later.</p>
            </div>
        `;
    }
}

// Parse player skin from JSON string
function getPlayerSkins(skinString) {
    if (!skinString) {
        return {
            skin: UnloadedPFP,
            eyes: UnloadedPFP,
            eyebrows: UnloadedPFP,
            head: UnloadedPFP,
            hat: UnloadedPFP
        };
    }
    
    try {
        const skinData = JSON.parse(skinString);
        return {
            skin: "https://bloxd.io" + skinData.skin || UnloadedPFP,
            eyes: "https://bloxd.io" + skinData.eyes || UnloadedPFP,
            eyebrows: "https://bloxd.io" + skinData.eyebrows || UnloadedPFP,
            head: "https://bloxd.io" + skinData.head || UnloadedPFP,
            hat: "https://bloxd.io" + skinData.hat || UnloadedPFP
        };
    } catch (e) {
        console.error('Error parsing skin data:', e);
        return {
            skin: UnloadedPFP,
            eyes: UnloadedPFP,
            eyebrows: UnloadedPFP,
            head: UnloadedPFP,
            hat: UnloadedPFP
        };
    }
}

// Get nickname color with BloxdColors support
function getNicknameColor(colorValue) {
    const color = getColorFromBloxd(colorValue);
    if (color) return color;
    if (colorValue && !colorValue.startsWith('#')) return '#ffffff';
    return colorValue || '#ffffff';
}

// Get all name rank icons from global config
function getNameRankIcons(ranksList) {
    if (!globalRanksConfig || !globalRanksConfig.ranks || !ranksList) return '';
    
    try {
        const playerRanks = ranksList.split(',').map(r => r.trim());
        let icons = [];
        
        playerRanks.forEach(rankId => {
            const rankConfig = globalRanksConfig.ranks.find(r => r.id === rankId);
            if (rankConfig && rankConfig.namerank && rankConfig.namerank.length > 0) {
                rankConfig.namerank.forEach(item => {
                    icons.push(item);
                });
            }
        });
        
        return icons.join(' ');
    } catch (e) {
        console.error('Error getting name rank icons:', e);
        return '';
    }
}

// Get chat rank HTML for a specific rank
function getChatRank(rankId) {
    if (!globalRanksConfig || !globalRanksConfig.ranks) return '';
    
    try {
        const rankConfig = globalRanksConfig.ranks.find(r => r.id === rankId);
        if (rankConfig && rankConfig.chatrank && rankConfig.chatrank.length > 0) {
            return rankConfig.chatrank.join('');
        }
    } catch (e) {
        console.error('Error getting chat rank:', e);
    }
    return '';
}

// Show rank preview
function showRankPreview(event, rankId, bgColor) {
    if (previewTimeout) {
        clearTimeout(previewTimeout);
    }
    
    if (currentPreview) {
        currentPreview.remove();
    }
    
    if (!globalRanksConfig || !globalRanksConfig.ranks) return;
    
    const rankConfig = globalRanksConfig.ranks.find(r => r.id === rankId);
    if (!rankConfig || !rankConfig.menurank || rankConfig.menurank.length === 0) return;
    
    const preview = document.createElement('div');
    preview.className = 'preview-tooltip rank-preview';
    
    preview.style.background = bgColor || '#2d1b4e';
    preview.style.padding = '15px';
    preview.style.borderRadius = '12px';
    preview.style.display = 'flex';
    preview.style.alignItems = 'center';
    preview.style.justifyContent = 'center';
    preview.style.minWidth = '80px';
    preview.style.minHeight = '80px';
    
    preview.innerHTML = rankConfig.menurank.join('');
    
    document.body.appendChild(preview);
    currentPreview = preview;
    
    function movePreview(e) {
        const x = e.clientX + 15;
        const y = e.clientY + 15;
        
        const previewRect = preview.getBoundingClientRect();
        const maxX = window.innerWidth - previewRect.width - 10;
        const maxY = window.innerHeight - previewRect.height - 10;
        
        preview.style.left = Math.min(x, maxX) + 'px';
        preview.style.top = Math.min(y, maxY) + 'px';
    }
    
    movePreview(event);
    document.addEventListener('mousemove', movePreview);
    
    preview._moveListener = movePreview;
}

// Show cape preview
function showCapePreview(event, capeId) {
    if (previewTimeout) {
        clearTimeout(previewTimeout);
    }
    
    if (currentPreview) {
        currentPreview.remove();
    }
    
    const capeInfo = CapeConfig[capeId];
    if (!capeInfo) return;
    
    const preview = document.createElement('div');
    preview.className = 'preview-tooltip cape-preview';
    
    preview.innerHTML = `
        <div style="text-align: center;">
            <img src="${capeInfo.source}" alt="${capeInfo.name}" style="width: 150px; height: 150px; object-fit: contain; border-radius: 8px; margin-bottom: 8px; image-rendering: pixelated;">
            <div style="color: ${capeInfo.color}; font-weight: bold; font-size: 1.1rem;">${capeInfo.name}</div>
        </div>
    `;
    
    document.body.appendChild(preview);
    currentPreview = preview;
    
    function movePreview(e) {
        const x = e.clientX + 15;
        const y = e.clientY + 15;
        
        const previewRect = preview.getBoundingClientRect();
        const maxX = window.innerWidth - previewRect.width - 10;
        const maxY = window.innerHeight - previewRect.height - 10;
        
        preview.style.left = Math.min(x, maxX) + 'px';
        preview.style.top = Math.min(y, maxY) + 'px';
    }
    
    movePreview(event);
    document.addEventListener('mousemove', movePreview);
    
    preview._moveListener = movePreview;
}

// Show NameTagBG preview
function showNameTagBGPreview(event, bgColor) {
    if (previewTimeout) {
        clearTimeout(previewTimeout);
    }
    
    if (currentPreview) {
        currentPreview.remove();
    }
    
    const color = getColorFromBloxd(bgColor) || bgColor;
    if (!color) return;
    
    const preview = document.createElement('div');
    preview.className = 'preview-tooltip nametag-preview';
    
    preview.innerHTML = `
        <div style="text-align: center;">
            <div style="background: ${color}; padding: 12px 20px; border-radius: 12px; margin-bottom: 8px; box-shadow: 0 0 15px ${color};">
                <span style="color: white; font-weight: bold; text-shadow: 1px 1px 2px black; letter-spacing: 1px;">NAMETAG BACKGROUND</span>
            </div>
            <div style="color: ${color}; font-weight: bold; font-size: 0.9rem; margin-top: 5px;">${color.toUpperCase()}</div>
        </div>
    `;
    
    document.body.appendChild(preview);
    currentPreview = preview;
    
    function movePreview(e) {
        const x = e.clientX + 15;
        const y = e.clientY + 15;
        
        const previewRect = preview.getBoundingClientRect();
        const maxX = window.innerWidth - previewRect.width - 10;
        const maxY = window.innerHeight - previewRect.height - 10;
        
        preview.style.left = Math.min(x, maxX) + 'px';
        preview.style.top = Math.min(y, maxY) + 'px';
    }
    
    movePreview(event);
    document.addEventListener('mousemove', movePreview);
    
    preview._moveListener = movePreview;
}

// Hide preview
function hidePreview() {
    if (previewTimeout) {
        clearTimeout(previewTimeout);
    }
    
    previewTimeout = setTimeout(() => {
        if (currentPreview) {
            document.removeEventListener('mousemove', currentPreview._moveListener);
            currentPreview.remove();
            currentPreview = null;
        }
        previewTimeout = null;
    }, 100);
}

// Open modal with player info
function openPlayerModal(player) {
    const modal = document.getElementById('player-modal');
    const modalContent = document.getElementById('modal-content');
    
    const skins = getPlayerSkins(player.PlayerSkin);
    
    const playerRanks = player.ranks ? player.ranks.split(',').map(r => r.trim()) : [];
    
    const capeInfo = player.Cape && CapeConfig[player.Cape] ? CapeConfig[player.Cape] : null;
    
    const typeInfo = player.typePlayer && PlayerType[player.typePlayer] ? PlayerType[player.typePlayer] : null;
    
    const nameTagBGColor = getColorFromBloxd(player.NameTagBG) || player.NameTagBG;
    
    const nicknameColor = getNicknameColor(player.nickname_color);
    
    let chatRanksHtml = '';
    playerRanks.forEach(rankId => {
        const chatRank = getChatRank(rankId);
        if (chatRank) {
            const rankConfig = globalRanksConfig?.ranks?.find(r => r.id === rankId);
            const bgColor = rankConfig?.bgColor || '#2d1b4e';
            
            chatRanksHtml += `
                <div class="rank-item" 
                     onmouseenter="showRankPreview(event, '${rankId}', '${bgColor}')"
                     onmouseleave="hidePreview()">
                    ${chatRank}
                </div>
            `;
        }
    });
    
    modalContent.innerHTML = `
        <div class="modal-layout">
            <!-- Left part - Visualization -->
            <div class="modal-left">
                <h3 class="modal-section-title">Visualization</h3>
                <div class="modal-visualization">
                    <div class="modal-player-head-large">
                        <div class="ProfilePictureLarge">
                            <img alt="skin" class="ProfilePictureComponent ProfilePictureComponentSkin" src="${skins.skin}">
                            <img alt="eyes" class="ProfilePictureComponent ProfilePictureComponentEyes" src="${skins.eyes}">
                            <img alt="eyebrows" class="ProfilePictureComponent ProfilePictureComponentEyebrows" src="${skins.eyebrows}">
                            <img alt="head" class="ProfilePictureComponent ProfilePictureComponentHead" src="${skins.head}">
                            <img alt="hat" class="ProfilePictureComponent ProfilePictureComponentHat" src="${skins.hat}">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Right part - Information -->
            <div class="modal-right">
                <h3 class="modal-section-title">Information</h3>
                
                <div class="modal-info-grid">
                    <!-- Nickname -->
                    <div class="modal-info-row">
                        <span class="modal-info-label">Nickname:</span>
                        <div class="modal-info-value">
                            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                                <span class="rank-icons">${getNameRankIcons(player.ranks)}
                                    <span style="color: ${nicknameColor}; ${player.style || ''}">
                                        ${player.nickname}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Ranks -->
                    <div class="modal-info-row">
                        <span class="modal-info-label">Ranks:</span>
                        <div class="modal-info-value ranks-container">
                            ${chatRanksHtml || '<span class="modal-info-value">None</span>'}
                        </div>
                    </div>
                    
                    <!-- Cape -->
                    <div class="modal-info-row">
                        <span class="modal-info-label">Cape:</span>
                        <div class="modal-info-value">
                            ${capeInfo ? 
                                `<span class="cape-name" 
                                      onmouseenter="showCapePreview(event, '${player.Cape}')"
                                      onmouseleave="hidePreview()"
                                      style="color: ${capeInfo.color}; font-weight: bold; cursor: help; border-bottom: 1px dashed ${capeInfo.color};">${capeInfo.name}</span>` 
                                : '<span class="modal-info-value">None</span>'
                            }
                        </div>
                    </div>
                    
                    <!-- NameTag Background -->
                    <div class="modal-info-row">
                        <span class="modal-info-label">NameTag Background:</span>
                        <div class="modal-info-value">
                            ${nameTagBGColor ? 
                                `<span class="has-bg" 
                                      onmouseenter="showNameTagBGPreview(event, '${player.NameTagBG}')"
                                      onmouseleave="hidePreview()"
                                      style="color: ${nameTagBGColor}; cursor: help; border-bottom: 1px dashed ${nameTagBGColor};">${typeof player.NameTagBG === 'string' && player.NameTagBG.startsWith('#') ? player.NameTagBG.toUpperCase() : player.NameTagBG}</span>` 
                                : '<span class="modal-info-value">None</span>'
                            }
                        </div>
                    </div>
                    
                    <!-- Player Type -->
                    <div class="modal-info-row">
                        <span class="modal-info-label">Player Type:</span>
                        <div class="modal-info-value">
                            ${typeInfo ? 
                                `<span style="color: ${typeInfo.color}; font-weight: bold;">${typeInfo.name}</span>` 
                                : '<span class="modal-info-value">Normal</span>'
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Close modal and clear URL parameter
function closePlayerModal() {
    const modal = document.getElementById('player-modal');
    modal.style.display = 'none';
    
    updateURLParameter('FRC-Profile', null);
    
    if (currentPreview) {
        document.removeEventListener('mousemove', currentPreview._moveListener);
        currentPreview.remove();
        currentPreview = null;
    }
}

// Render players grid
function renderPlayers(players) {
    const playerGrid = document.getElementById('player-grid');
    
    if (!players || players.length === 0) {
        playerGrid.innerHTML = `
            <div style="text-align: center; padding: 50px; grid-column: 1/-1;">
                <i class="fas fa-user-slash fa-3x" style="color: #8a2be2;"></i>
                <p style="margin-top: 20px;">No players found</p>
            </div>
        `;
        return;
    }
    
    const validPlayers = players.filter(player => player.nickname && player.nickname.trim() !== '');
    
    const verifiedPlayers = validPlayers.filter(player => player.typePlayer === 'owner' || player.typePlayer === 'verified');
    const normalPlayers = validPlayers.filter(player => !player.typePlayer || player.typePlayer === 'normal');
    
    let html = '';
    
    function generatePlayerCard(player) {
        const skins = getPlayerSkins(player.PlayerSkin);
        const nameRankIcons = getNameRankIcons(player.ranks);
        const nicknameColor = getNicknameColor(player.nickname_color);
        const nicknameStyle = `color: ${nicknameColor}; ${player.style || ''}`;
        
        const playerForEncoding = {
            nickname: player.nickname,
            ranks: player.ranks,
            nickname_color: player.nickname_color,
            style: player.style,
            PlayerSkin: player.PlayerSkin,
            Cape: player.Cape,
            NameTagBG: player.NameTagBG,
            typePlayer: player.typePlayer
        };
        
        const encodedData = encodePlayerData(playerForEncoding);
        
        let shadowStyle = '';
        if (player.typePlayer === 'owner' || player.typePlayer === 'verified') {
            const typeColor = PlayerType[player.typePlayer]?.color || '#cc66ff';
            shadowStyle = `box-shadow: 0 0 20px ${typeColor};`;
        }
        
        return `
            <div class="player-card" onclick='_0x32b0("${encodedData}")' style="${shadowStyle}">
                <div class="player-row">
                    <div class="player-head">
                        <div class="ProfilePicture">
                            <img alt="skin" class="ProfilePictureComponent ProfilePictureComponentSkin" src="${skins.skin}" loading="lazy">
                            <img alt="eyes" class="ProfilePictureComponent ProfilePictureComponentEyes" src="${skins.eyes}" loading="lazy">
                            <img alt="eyebrows" class="ProfilePictureComponent ProfilePictureComponentEyebrows" src="${skins.eyebrows}" loading="lazy">
                            <img alt="head" class="ProfilePictureComponent ProfilePictureComponentHead" src="${skins.head}" loading="lazy">
                            <img alt="hat" class="ProfilePictureComponent ProfilePictureComponentHat" src="${skins.hat}" loading="lazy">
                        </div>
                    </div>
                    
                    <div class="player-info">
                        <div class="player-name-container">
                            <span class="rank-icons">${nameRankIcons}</span>
                            <span class="player-name" style="${nicknameStyle}">${player.nickname}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (verifiedPlayers.length > 0) {
        html += `
            <div class="player-section-header">
                <h2 class="player-section-title verified-title">
                    <i class="fas fa-crown"></i> 
                    <span>Verified Players</span>
                    <span class="player-section-count">${verifiedPlayers.length}</span>
                </h2>
            </div>
        `;
        
        verifiedPlayers.forEach(player => {
            html += generatePlayerCard(player);
        });
    }
    
    if (normalPlayers.length > 0) {
        html += `
            <div class="player-section-header">
                <h2 class="player-section-title normal-title">
                    <i class="fas fa-users"></i> 
                    <span>Players</span>
                    <span class="player-section-count">${normalPlayers.length}</span>
                </h2>
            </div>
        `;
        
        normalPlayers.forEach(player => {
            html += generatePlayerCard(player);
        });
    }
    
    playerGrid.innerHTML = html;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    fetchPlayers();
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('player-modal');
        if (event.target === modal) {
            closePlayerModal();
        }
    });
    
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closePlayerModal();
        }
    });
    
    window.addEventListener('popstate', function() {
        const profileNickname = getURLParameter('FRC-Profile');
        if (!profileNickname) {
            const modal = document.getElementById('player-modal');
            if (modal.style.display === 'flex') {
                closePlayerModal();
            }
        } else {
            const player = findPlayerByNickname(profileNickname);
            if (player) {
                openPlayerModal(player);
            }
        }
    });
});