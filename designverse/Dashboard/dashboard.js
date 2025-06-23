// GameHub Dashboard JavaScript
// Main application state and functionality

class GameHubDashboard {
    constructor() {
        this.charts = {};
        this.currentTheme = 'dark';
        this.notifications = [];
        this.friends = [];
        this.tournaments = [];
        this.matches = [];
        this.leaderboard = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeData();
        this.createCharts();
        this.startAnimations();
        this.hideLoadingOverlay();
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        // Navigation menu
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e));
        });

        // Profile menu toggle
        document.querySelector('.profile-menu')?.addEventListener('click', () => {
            this.toggleProfileMenu();
        });

        // Stat items click
        document.querySelectorAll('.stat-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const statType = e.currentTarget.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.showStatDetail(statType);
            });
        });

        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());

        // Close notifications when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notifications-panel') && !e.target.closest('.notification-btn')) {
                this.closeNotifications();
            }
        });
    }

    initializeData() {
        // Initialize sample data
        this.friends = [
            { name: 'ShadowKnight', avatar: 'SK', status: 'online', game: 'Playing Valorant', action: 'invite' },
            { name: 'NovaX', avatar: 'NX', status: 'tournament', game: 'In Tournament', action: 'spectate' },
            { name: 'CyberZ', avatar: 'CZ', status: 'away', game: 'Away - 5m', action: 'message' },
            { name: 'ProGamer', avatar: 'PG', status: 'online', game: 'Available', action: 'invite' },
            { name: 'QuantumZ', avatar: 'QZ', status: 'online', game: 'Playing CS2', action: 'invite' },
            { name: 'NeonFlash', avatar: 'NF', status: 'away', game: 'Away - 12m', action: 'message' },
            { name: 'CyberNinja', avatar: 'CN', status: 'online', game: 'Playing LoL', action: 'invite' },
            { name: 'StormRider', avatar: 'SR', status: 'tournament', game: 'In Tournament', action: 'spectate' }
        ];

        this.matches = [
            { game: 'Valorant', result: 'Victory', score: '13-8', rank: '+24 RR', time: '2 hours ago', map: 'Ascent' },
            { game: 'CS2', result: 'Victory', score: '16-12', rank: '+18 ELO', time: '4 hours ago', map: 'Dust2' },
            { game: 'League of Legends', result: 'Defeat', score: '24-31', rank: '-15 LP', time: '6 hours ago', map: 'Summoner\'s Rift' },
            { game: 'Valorant', result: 'Victory', score: '13-5', rank: '+26 RR', time: '1 day ago', map: 'Haven' },
            { game: 'CS2', result: 'Victory', score: '16-9', rank: '+21 ELO', time: '1 day ago', map: 'Mirage' }
        ];

        this.leaderboard = [
            { rank: 1, name: 'ProMaster', points: 3847, change: '+12' },
            { rank: 2, name: 'EliteGamer', points: 3821, change: '+8' },
            { rank: 3, name: 'GameMaster Pro', points: 3798, change: '+15' },
            { rank: 4, name: 'ShadowLord', points: 3776, change: '-3' },
            { rank: 5, name: 'CyberAce', points: 3754, change: '+5' },
            { rank: 6, name: 'NovaStrike', points: 3732, change: '+9' },
            { rank: 7, name: 'QuantumRage', points: 3698, change: '-8' },
            { rank: 8, name: 'StormBreaker', points: 3654, change: '+2' }
        ];

        this.tournaments = [
            { name: 'Valorant Champions', status: 'Live', players: '128/128', prize: '$50,000', time: 'Finals Now' },
            { name: 'CS2 Major League', status: 'Upcoming', players: '64/64', prize: '$25,000', time: '2 hours' },
            { name: 'LoL Weekly Cup', status: 'Registration', players: '32/64', prize: '$10,000', time: '1 day' },
            { name: 'Apex Legends Pro', status: 'Live', players: '60/60', prize: '$15,000', time: 'Semifinals' }
        ];

        this.news = [
            { title: 'New Valorant Agent Revealed', time: '2 hours ago', category: 'News' },
            { title: 'CS2 Major Update Released', time: '5 hours ago', category: 'Update' },
            { title: 'Community Tournament Winners', time: '1 day ago', category: 'Community' },
            { title: 'Server Maintenance Scheduled', time: '2 days ago', category: 'Maintenance' }
        ];

        this.populateContent();
    }

    populateContent() {
        this.populateMatches();
        this.populateLeaderboard();
        this.populateTournaments();
        this.populateNews();
    }

    populateMatches() {
        const container = document.getElementById('matches-container');
        if (!container) return;

        container.innerHTML = this.matches.map(match => `
            <div class="match-item ${match.result.toLowerCase()}">
                <div class="match-game">
                    <div class="game-icon">${this.getGameIcon(match.game)}</div>
                    <div class="match-info">
                        <div class="match-title">${match.game}</div>
                        <div class="match-map">${match.map}</div>
                    </div>
                </div>
                <div class="match-result">
                    <div class="result-badge ${match.result.toLowerCase()}">${match.result}</div>
                    <div class="match-score">${match.score}</div>
                </div>
                <div class="match-rank">
                    <div class="rank-change ${match.rank.includes('+') ? 'positive' : 'negative'}">${match.rank}</div>
                    <div class="match-time">${match.time}</div>
                </div>
            </div>
        `).join('');
    }

    populateLeaderboard() {
        const container = document.getElementById('leaderboard-container');
        if (!container) return;

        container.innerHTML = this.leaderboard.map(player => `
            <div class="leaderboard-item ${player.rank <= 3 ? 'top-rank' : ''}">
                <div class="rank-number">${player.rank}</div>
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    <div class="player-points">${player.points} pts</div>
                </div>
                <div class="rank-change ${player.change.includes('+') ? 'positive' : 'negative'}">
                    ${player.change}
                </div>
            </div>
        `).join('');
    }

    populateTournaments() {
        const container = document.getElementById('tournament-container');
        if (!container) return;

        container.innerHTML = this.tournaments.map(tournament => `
            <div class="tournament-item" onclick="viewTournament('${tournament.name}')">
                <div class="tournament-header">
                    <div class="tournament-name">${tournament.name}</div>
                    <div class="tournament-status ${tournament.status.toLowerCase()}">${tournament.status}</div>
                </div>
                <div class="tournament-details">
                    <div class="tournament-players">👥 ${tournament.players}</div>
                    <div class="tournament-prize">💰 ${tournament.prize}</div>
                </div>
                <div class="tournament-time">${tournament.time}</div>
            </div>
        `).join('');
    }

    populateNews() {
        const container = document.getElementById('news-container');
        if (!container) return;

        container.innerHTML = this.news.map(item => `
            <div class="news-item" onclick="readNews('${item.title}')">
                <div class="news-header">
                    <div class="news-title">${item.title}</div>
                    <div class="news-category">${item.category}</div>
                </div>
                <div class="news-time">${item.time}</div>
            </div>
        `).join('');
    }

    createCharts() {
        this.createMainPerformanceChart();
        this.createGameSpecificCharts();
    }

    createMainPerformanceChart() {
        const ctx = document.getElementById('mainPerformanceChart');
        if (!ctx) return;

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0.1)');

        this.charts.mainPerformance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Performance Score',
                    data: [85, 89, 92, 88, 94, 96, 91],
                    borderColor: '#00ffff',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00ffff',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createGameSpecificCharts() {
        // Valorant Chart
        this.createMiniChart('valorantChart', [78, 82, 85, 89, 92, 88, 91], '#ff6b6b');
        
        // CS2 Chart
        this.createMiniChart('cs2Chart', [92, 89, 94, 91, 96, 93, 95], '#4ecdc4');
        
        // League of Legends Chart
        this.createMiniChart('lolChart', [73, 76, 82, 79, 84, 81, 87], '#ffe66d');
    }

    createMiniChart(canvasId, data, color) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 100);
        gradient.addColorStop(0, color + '80');
        gradient.addColorStop(1, color + '20');

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['', '', '', '', '', '', ''],
                datasets: [{
                    data: data,
                    borderColor: color,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                animation: {
                    duration: 1500,
                    delay: 500
                }
            }
        });
    }

    startAnimations() {
        // Counter animations
        this.animateCounters();
        
        // XP bar animation
        this.animateXPBar();
        
        // Particle effects
        this.createParticleEffects();
        
        // Pulsing effects
        this.startPulsingEffects();
    }

    animateCounters() {
        document.querySelectorAll('.counter').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Delay animation for staggered effect
            setTimeout(updateCounter, Math.random() * 1000);
        });
    }

    animateXPBar() {
        const xpFill = document.querySelector('.xp-fill');
        if (xpFill) {
            xpFill.style.width = '0%';
            setTimeout(() => {
                xpFill.style.transition = 'width 2s ease-out';
                xpFill.style.width = '68%';
            }, 500);
        }
    }

    createParticleEffects() {
        const particleContainer = document.querySelector('.xp-particles');
        if (!particleContainer) return;

        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #00ffff;
                border-radius: 50%;
                animation: float ${2 + Math.random() * 3}s infinite ease-in-out;
                animation-delay: ${Math.random() * 2}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            particleContainer.appendChild(particle);
        }
    }

    startPulsingEffects() {
        const pulsingElements = document.querySelectorAll('.pulsing');
        pulsingElements.forEach(element => {
            element.style.animation = 'pulse 2s infinite ease-in-out';
        });
    }

    startRealTimeUpdates() {
        // Update stats every 30 seconds
        setInterval(() => {
            this.updateRealTimeStats();
        }, 30000);

        // Update charts every minute
        setInterval(() => {
            this.updateChartData();
        }, 60000);

        // Update server status every 10 seconds
        setInterval(() => {
            this.updateServerStatus();
        }, 10000);
    }

    updateRealTimeStats() {
        // Simulate real-time stat updates
        const footerPlayers = document.getElementById('footer-players');
        const footerMatches = document.getElementById('footer-matches');
        
        if (footerPlayers) {
            const currentPlayers = parseFloat(footerPlayers.textContent) + (Math.random() * 0.1 - 0.05);
            footerPlayers.textContent = currentPlayers.toFixed(1) + 'M';
        }
        
        if (footerMatches) {
            const currentMatches = parseInt(footerMatches.textContent) + Math.floor(Math.random() * 1000);
            footerMatches.textContent = currentMatches + 'K';
        }
    }

    updateChartData() {
        // Update main performance chart with new data point
        if (this.charts.mainPerformance) {
            const newValue = 85 + Math.random() * 15;
            this.charts.mainPerformance.data.datasets[0].data.shift();
            this.charts.mainPerformance.data.datasets[0].data.push(Math.floor(newValue));
            this.charts.mainPerformance.update('none');
        }
    }

    updateServerStatus() {
        const serverPings = document.querySelectorAll('.server-ping');
        serverPings.forEach(ping => {
            const baseValue = parseInt(ping.textContent);
            const variation = Math.floor(Math.random() * 10 - 5);
            const newPing = Math.max(5, baseValue + variation);
            
            ping.textContent = newPing + 'ms';
            ping.className = 'server-ping ' + (newPing < 30 ? 'good' : newPing < 60 ? 'warning' : 'poor');
        });
    }

    handleNavigation(e) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        e.target.closest('.nav-item').classList.add('active');
        
        const section = e.target.closest('.nav-item').getAttribute('data-section');
        this.switchSection(section);
    }

    switchSection(section) {
        // Hide all sections
        document.querySelectorAll('.main-content > *').forEach(element => {
            element.style.display = 'none';
        });
        
        // Show relevant content based on section
        switch(section) {
            case 'dashboard':
                document.querySelectorAll('.main-content > *').forEach(element => {
                    element.style.display = 'block';
                });
                break;
            case 'tournaments':
                this.showTournamentsSection();
                break;
            case 'community':
                this.showCommunitySection();
                break;
            case 'achievements':
                this.showAchievementsSection();
                break;
        }
    }

    handleFilterChange(e) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        const period = e.target.getAttribute('data-period');
        this.updateChartForPeriod(period);
    }

    updateChartForPeriod(period) {
        if (!this.charts.mainPerformance) return;
        
        let newData, newLabels;
        
        switch(period) {
            case 'today':
                newLabels = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'];
                newData = [82, 85, 89, 92, 88, 94, 91];
                break;
            case 'week':
                newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                newData = [85, 89, 92, 88, 94, 96, 91];
                break;
            case 'month':
                newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                newData = [87, 91, 89, 93];
                break;
        }
        
        this.charts.mainPerformance.data.labels = newLabels;
        this.charts.mainPerformance.data.datasets[0].data = newData;
        this.charts.mainPerformance.update();
    }

    getGameIcon(game) {
        const icons = {
            'Valorant': '🎯',
            'CS2': '🔫',
            'League of Legends': '⚔️',
            'Apex Legends': '🏆'
        };
        return icons[game] || '🎮';
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 500);
            }, 2000);
        }
    }

    handleResize() {
        // Redraw charts on window resize
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    // Notification system
    toggleNotifications() {
        const panel = document.getElementById('notifications-panel');
        if (panel) {
            panel.classList.toggle('show');
        }
    }

    closeNotifications() {
        const panel = document.getElementById('notifications-panel');
        if (panel) {
            panel.classList.remove('show');
        }
    }

    // Theme toggle
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.currentTheme);
        
        // Update chart colors based on theme
        this.updateChartTheme();
    }

    updateChartTheme() {
        const textColor = this.currentTheme === 'dark' ? '#ffffff' : '#333333';
        const gridColor = this.currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                if (chart.options.scales) {
                    chart.options.scales.x.ticks.color = textColor;
                    chart.options.scales.x.grid.color = gridColor;
                    chart.options.scales.y.ticks.color = textColor;
                    chart.options.scales.y.grid.color = gridColor;
                }
                chart.update();
            }
        });
    }

    // Profile menu
    toggleProfileMenu() {
        const menu = document.querySelector('.profile-dropdown');
        if (menu) {
            menu.classList.toggle('show');
        }
    }

    // Friend list functionality
    toggleFriends() {
        const container = document.getElementById('friends-container');
        const toggle = document.getElementById('friends-toggle');
        
        if (container && toggle) {
            container.classList.toggle('collapsed');
            toggle.textContent = container.classList.contains('collapsed') ? '▶' : '▼';
        }
    }

    inviteFriend(friendName) {
        this.showNotification(`Invited ${friendName} to join your game!`, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--card-bg);
            color: var(--text-primary);
            padding: 12px 24px;
            border-radius: 8px;
            border: 1px solid var(--neon-cyan);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Stat detail views
    showStatDetail(statType) {
        const details = {
            wins: 'Total Wins: 156\nRanked Wins: 142\nCasual Wins: 14\nWin Streak: 8',
            winrate: 'Overall Win Rate: 89%\nRanked Win Rate: 91%\nLast 10 Games: 8W-2L',
            achievements: 'Total Badges: 24\nRare Badges: 6\nEpic Badges: 3\nLegendary Badges: 1',
            hours: 'Total Hours: 2,847\nThis Month: 124h\nDaily Average: 4.2h'
        };
        
        alert(details[statType] || 'Stat details not available');
    }

    // Additional section handlers
    showTournamentsSection() {
        console.log('Switching to tournaments section');
    }

    showCommunitySection() {
        console.log('Switching to community section');
    }

    showAchievementsSection() {
        console.log('Switching to achievements section');
    }

    // Utility functions
    refreshLeaderboard() {
        this.showNotification('Leaderboard refreshed!', 'success');
        this.populateLeaderboard();
    }

    viewAllMatches() {
        this.showNotification('Opening detailed match history...', 'info');
    }

    viewTournament(tournamentName) {
        this.showNotification(`Opening ${tournamentName} details...`, 'info');
    }

    readNews(newsTitle) {
        this.showNotification(`Opening: ${newsTitle}`, 'info');
    }

    editProfile() {
        this.showNotification('Profile editor coming soon!', 'info');
    }
}

// Global functions for HTML onclick handlers
function toggleNotifications() {
    window.gameHub.toggleNotifications();
}

function toggleTheme() {
    window.gameHub.toggleTheme();
}

function toggleProfileMenu() {
    window.gameHub.toggleProfileMenu();
}

function toggleFriends() {
    window.gameHub.toggleFriends();
}

function inviteFriend(name) {
    window.gameHub.inviteFriend(name);
}

function showStatDetail(type) {
    window.gameHub.showStatDetail(type);
}

function refreshLeaderboard() {
    window.gameHub.refreshLeaderboard();
}

function viewAllMatches() {
    window.gameHub.viewAllMatches();
}

function viewTournament(name) {
    window.gameHub.viewTournament(name);
}

function readNews(title) {
    window.gameHub.readNews(title);
}

function editProfile() {
    window.gameHub.editProfile();
}

// CSS animations to be injected
const animations = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideInLeft {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideInUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slideInDown {
    from {
        transform: translateY(-100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes pulse {
    0%, 100% { 
        transform: scale(1);
        opacity: 1;
    }
    50% { 
        transform: scale(1.05);
        opacity: 0.8;
    }
}

@keyframes pulseGlow {
    0%, 100% { 
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
    }
    50% { 
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
    }
}

@keyframes float {
    0%, 100% { 
        transform: translateY(0px) rotate(0deg);
        opacity: 0.7;
    }
    33% { 
        transform: translateY(-10px) rotate(120deg);
        opacity: 1;
    }
    66% { 
        transform: translateY(5px) rotate(240deg);
        opacity: 0.8;
    }
}

@keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        transform: translate3d(0,0,0);
    }
    40%, 43% {
        animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        transform: translate3d(0, -30px, 0);
    }
    70% {
        animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        transform: translate3d(0, -15px, 0);
    }
    90% {
        transform: translate3d(0,-4px,0);
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes neonPulse {
    0%, 100% {
        text-shadow: 
            0 0 5px #00ffff,
            0 0 10px #00ffff,
            0 0 15px #00ffff,
            0 0 20px #00ffff;
    }
    50% {
        text-shadow: 
            0 0 2px #00ffff,
            0 0 5px #00ffff,
            0 0 8px #00ffff,
            0 0 12px #00ffff;
    }
}

@keyframes progressFill {
    from { width: 0%; }
    to { width: var(--progress-width, 0%); }
}

@keyframes countUp {
    from { 
        transform: translateY(20px);
        opacity: 0;
    }
    to { 
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes wiggle {
    0%, 7% { transform: rotateZ(0); }
    15% { transform: rotateZ(-15deg); }
    20% { transform: rotateZ(10deg); }
    25% { transform: rotateZ(-10deg); }
    30% { transform: rotateZ(6deg); }
    35% { transform: rotateZ(-4deg); }
    40%, 100% { transform: rotateZ(0); }
}

@keyframes heartbeat {
    0% { transform: scale(1); }
    14% { transform: scale(1.3); }
    28% { transform: scale(1); }
    42% { transform: scale(1.3); }
    70% { transform: scale(1); }
}

@keyframes glitch {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
}

/* Animation Classes */
.notification {
    animation: slideInRight 0.3s ease-out;
}

.card {
    animation: fadeInScale 0.6s ease-out;
}

.match-item {
    animation: slideInUp 0.5s ease-out;
}

.friend-item {
    animation: slideInLeft 0.4s ease-out;
}

.leaderboard-item {
    animation: fadeIn 0.5s ease-out;
}

.tournament-item {
    animation: slideInDown 0.4s ease-out;
}

.news-item {
    animation: fadeIn 0.6s ease-out;
}

.pulsing {
    animation: pulse 2s infinite ease-in-out;
}

.pulse-glow {
    animation: pulseGlow 2s infinite ease-in-out;
}

.particle {
    animation: float 3s infinite ease-in-out;
}

.loading-spinner {
    animation: rotate 1s linear infinite;
}

.neon-text {
    animation: neonPulse 2s infinite ease-in-out;
}

.bounce-effect {
    animation: bounce 1s ease-out;
}

.shake-effect {
    animation: shake 0.5s ease-in-out;
}

.wiggle-effect {
    animation: wiggle 1s ease-in-out;
}

.heartbeat-effect {
    animation: heartbeat 1.5s infinite ease-in-out;
}

.glitch-effect {
    animation: glitch 0.3s ease-in-out;
}

.count-up {
    animation: countUp 0.5s ease-out;
}

.progress-animate {
    animation: progressFill 2s ease-out;
}

/* Stagger animations for lists */
.match-item:nth-child(1) { animation-delay: 0.1s; }
.match-item:nth-child(2) { animation-delay: 0.2s; }
.match-item:nth-child(3) { animation-delay: 0.3s; }
.match-item:nth-child(4) { animation-delay: 0.4s; }
.match-item:nth-child(5) { animation-delay: 0.5s; }

.friend-item:nth-child(1) { animation-delay: 0.1s; }
.friend-item:nth-child(2) { animation-delay: 0.2s; }
.friend-item:nth-child(3) { animation-delay: 0.3s; }
.friend-item:nth-child(4) { animation-delay: 0.4s; }
.friend-item:nth-child(5) { animation-delay: 0.5s; }
.friend-item:nth-child(6) { animation-delay: 0.6s; }
.friend-item:nth-child(7) { animation-delay: 0.7s; }
.friend-item:nth-child(8) { animation-delay: 0.8s; }

.leaderboard-item:nth-child(1) { animation-delay: 0.1s; }
.leaderboard-item:nth-child(2) { animation-delay: 0.2s; }
.leaderboard-item:nth-child(3) { animation-delay: 0.3s; }
.leaderboard-item:nth-child(4) { animation-delay: 0.4s; }
.leaderboard-item:nth-child(5) { animation-delay: 0.5s; }
.leaderboard-item:nth-child(6) { animation-delay: 0.6s; }
.leaderboard-item:nth-child(7) { animation-delay: 0.7s; }
.leaderboard-item:nth-child(8) { animation-delay: 0.8s; }

.tournament-item:nth-child(1) { animation-delay: 0.1s; }
.tournament-item:nth-child(2) { animation-delay: 0.2s; }
.tournament-item:nth-child(3) { animation-delay: 0.3s; }
.tournament-item:nth-child(4) { animation-delay: 0.4s; }

.news-item:nth-child(1) { animation-delay: 0.2s; }
.news-item:nth-child(2) { animation-delay: 0.4s; }
.news-item:nth-child(3) { animation-delay: 0.6s; }
.news-item:nth-child(4) { animation-delay: 0.8s; }

/* Hover animations */
.card:hover {
    animation: none;
    transform: translateY(-5px);
    transition: transform 0.3s ease;
}

.stat-item:hover {
    animation: pulseGlow 0.5s ease-out;
}

.nav-item:hover {
    animation: wiggle 0.5s ease-out;
}

.friend-item:hover,
.match-item:hover,
.tournament-item:hover,
.news-item:hover,
.leaderboard-item:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .pulsing,
    .pulse-glow,
    .particle,
    .neon-text,
    .heartbeat-effect {
        animation: none !important;
    }
}
`;

// Inject animations
const style = document.createElement('style');
style.textContent = animations;
document.head.appendChild(style);

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gameHub = new GameHubDashboard();
});

// Handle page visibility for performance optimization
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        Object.values(window.gameHub?.charts || {}).forEach(chart => {
            if (chart && chart.stop) chart.stop();
        });
    } else {
        // Resume animations when tab becomes visible
        Object.values(window.gameHub?.charts || {}).forEach(chart => {
            if (chart && chart.render) chart.render();
        });
    }
});