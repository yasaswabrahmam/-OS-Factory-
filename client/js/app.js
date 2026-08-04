/**
 * Factory OS — Core Dashboard Controller
 * Handles routing, real-time telemetry simulation, Chart.js rendering,
 * AI Copilot chat drawer, alerts, and theme switching.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ── Application State ──
    const state = {
        theme: 'dark',
        activeSite: 'detroit',
        telemetry: {
            oee: 87.4,
            availability: 94.5,
            performance: 96.1,
            yield: 98.4,
            downtime: [110, 54, 38, 21] // Mechanical, Tooling, Materials, Operator
        },
        oeeHistory: Array.from({ length: 24 }, (_, i) => 82 + Math.sin(i / 2) * 5 + Math.random() * 2),
        sparklineData: {
            oee: Array.from({ length: 10 }, () => 85 + Math.random() * 5),
            availability: Array.from({ length: 10 }, () => 92 + Math.random() * 4),
            performance: Array.from({ length: 10 }, () => 94 + Math.random() * 3),
            yield: Array.from({ length: 10 }, () => 97 + Math.random() * 2)
        },
        alerts: [
            { id: 1, severity: 'warning', component: 'System', msg: 'Machine telemetry exceeded ISO 10816 class III threshold. Immediate operator intervention required.', time: '12 mins ago' },
            { id: 2, severity: 'critical', component: 'Schuler Press', msg: 'Pressure variance detected on Cylinder B-2 during high-speed cycle. Predictive failure within 48h.', time: '1 hour ago' },
            { id: 3, severity: 'info', component: 'Carbon Fiber Inventory', msg: 'Current stock level (340 rolls) reached 68% of safety threshold (500 rolls).', time: '3 hours ago' }
        ],
        productionLines: [
            { id: 'L1', name: 'Main Press Line', status: 'active', oee: 89.2, target: 90.0, speed: '15 spm', activeAlerts: 1 },
            { id: 'L2', name: 'Body Welding Cell A', status: 'active', oee: 92.4, target: 92.0, speed: '24 robots', activeAlerts: 0 },
            { id: 'L3', name: 'Paint Oven B', status: 'maintenance', oee: 45.1, target: 88.0, speed: 'Idle', activeAlerts: 1 },
            { id: 'L4', name: 'Final Assembly Line 1', status: 'active', oee: 88.5, target: 90.0, speed: '45 JPH', activeAlerts: 0 },
            { id: 'L5', name: 'Battery Pack Integration Cell', status: 'active', oee: 96.2, target: 95.0, speed: '22 packs/hr', activeAlerts: 0 }
        ],
        workOrders: [
            { id: 'WO-2026-0941', component: 'Schuler Press Cylinder B-2', desc: 'Predictive proportional valve seal replacement', tech: 'John Doe', status: 'Synced (Approved)' },
            { id: 'WO-2026-1120', component: 'Paint Oven B Exhaust', desc: 'Exhaust fan belt alignment and lubrication', tech: 'Jane Smith', status: 'In Progress' },
            { id: 'WO-2026-0348', component: 'Welder Tips Arc Cell A', desc: 'Tip resurfacing and cooling line check', tech: 'Bob Jones', status: 'Synced (Completed)' }
        ],
        defects: [
            { id: 'DF-9910', part: 'Door Panel Panel-A', category: 'Surface Tear', time: '10 mins ago' },
            { id: 'DF-9912', part: 'Battery Pack Plate', category: 'Weld Splatter', time: '1 hour ago' },
            { id: 'DF-9915', part: 'Press Cap Cylinder-B', category: 'Friction Scuff', time: '3 hours ago' }
        ],
        warehouseInventory: [
            { name: 'Lithium Battery Packs', qty: 120, maxQty: 150, unit: 'units', status: 'Healthy' },
            { name: 'Austenite Sheet Steel', qty: 450, maxQty: 500, unit: 'sheets', status: 'Healthy' },
            { name: 'Pre-preg Carbon Fiber', qty: 340, maxQty: 500, unit: 'rolls', status: 'Refill Triggered' },
            { name: 'Proportional Valve Seals', qty: 2, maxQty: 10, unit: 'kits', status: 'Low Stock' }
        ],
        purchaseOrders: [
            { id: 'PO-88219-SAP', material: 'Proportional Valve Seals', qty: 5, status: 'Released' },
            { id: 'PO-44912-SAP', material: 'Pre-preg Carbon Fiber', qty: 160, status: 'Completed' },
            { id: 'PO-11029-SAP', material: 'Lithium Battery Packs', qty: 50, status: 'Completed' }
        ]
    };

    // ── DOM References ──
    const elements = {
        themeToggleBtn: document.getElementById('btn-theme-toggle'),
        notificationsBtn: document.getElementById('btn-notifications'),
        notificationsDropdown: document.getElementById('notifications-dropdown'),
        unreadAlertsBadge: document.getElementById('unread-alerts-badge'),
        alertCountIndicator: document.getElementById('alert-count-indicator'),
        alertsList: document.getElementById('alerts-list'),
        alertsTableBody: document.getElementById('alerts-table-body'),
        sidebarAlertBadge: document.getElementById('sidebar-alert-badge'),
        siteSelector: document.getElementById('site-selector'),
        currentPlantName: document.getElementById('current-plant-name'),
        sidebarSiteName: document.getElementById('sidebar-site-name'),
        refreshTelemetryBtn: document.getElementById('btn-refresh-telemetry'),
        refreshIcon: document.getElementById('refresh-icon'),
        askCopilotBtn: document.getElementById('btn-ask-copilot'),
        navItemCopilot: document.getElementById('nav-item-copilot'),
        aiDrawer: document.getElementById('ai-drawer'),
        btnCloseCopilot: document.getElementById('btn-close-copilot'),
        chatInput: document.getElementById('chat-input-text'),
        chatSendBtn: document.getElementById('btn-send-message'),
        chatMessages: document.getElementById('ai-chat-messages'),
        quickActionBtn: document.getElementById('btn-quick-action'),
        quickActionModal: document.getElementById('quick-action-modal'),
        btnCloseModal: document.getElementById('btn-close-modal'),
        navItems: document.querySelectorAll('.sidebar-nav a'),
        views: document.querySelectorAll('.dashboard-view'),
        productionLinesGrid: document.getElementById('production-lines-grid'),
        valOee: document.getElementById('val-oee'),
        valAvailability: document.getElementById('val-availability'),
        valPerformance: document.getElementById('val-performance'),
        valYield: document.getElementById('val-yield'),
        totalDowntime: document.getElementById('total-downtime'),
        speedSlider: document.getElementById('input-speed'),
        pressureSlider: document.getElementById('input-pressure'),
        valSpeedSlider: document.getElementById('val-speed-slider'),
        valPressureSlider: document.getElementById('val-pressure-slider'),
        mlFailureRisk: document.getElementById('ml-failure-risk'),
        mlRul: document.getElementById('ml-rul'),
        mlAnomalyScore: document.getElementById('ml-anomaly-score'),
        mlStatusText: document.getElementById('ml-status-text'),
        mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
        sidebarNav: document.querySelector('.sidebar-nav')
    };

    // ── Mobile Menu Toggle Handler ──
    function initMobileMenu() {
        const toggle = elements.mobileMenuToggle;
        const nav = elements.sidebarNav;
        if (!toggle || !nav) return;

        // Show toggle button only on mobile (CSS handles display:none for desktop)
        const checkMobile = () => {
            if (window.innerWidth <= 767) {
                toggle.style.display = 'flex';
            } else {
                toggle.style.display = 'none';
                nav.classList.remove('mobile-open');
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        toggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('mobile-open');
            toggle.innerHTML = isOpen
                ? '<i data-lucide="x" style="width:18px;height:18px;"></i>'
                : '<i data-lucide="menu" style="width:18px;height:18px;"></i>';
            lucide.createIcons();
        });

        // Close nav when a link is clicked on mobile
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 767) {
                    nav.classList.remove('mobile-open');
                    toggle.innerHTML = '<i data-lucide="menu" style="width:18px;height:18px;"></i>';
                    lucide.createIcons();
                }
            });
        });
    }

    // ── Global Variables for Charts ──
    let mainTrendChart = null;
    let paretoChart = null;
    const sparklineCharts = {};

    // ── Theme / Theme Initialization ──
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
    }

    function setTheme(theme) {
        state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update charts configuration based on light/dark colors
        if (mainTrendChart) {
            updateChartsTheme();
        }
    }

    elements.themeToggleBtn.addEventListener('click', () => {
        setTheme(state.theme === 'dark' ? 'light' : 'dark');
    });

    // ── Router / Navigation ──
    function handleRoute() {
        const hash = window.location.hash || '#dashboard';
        let viewName = hash.replace('#', '');
        if (viewName === 'overview') viewName = 'dashboard';
        
        let targetView = document.getElementById(`view-${viewName}`);
        if (!targetView) {
            targetView = document.getElementById('view-dashboard');
        }

        // Toggle active view
        elements.views.forEach(v => v.classList.remove('active'));
        targetView.classList.add('active');

        // Toggle nav items active state
        elements.navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === hash) {
                item.classList.add('active');
            }
        });

        // Trigger view-specific loads
        if (viewName === 'alerts') {
            renderAlertsTable();
        } else if (viewName === 'production') {
            renderProductionLines();
        } else if (viewName === 'maintenance') {
            renderWorkOrdersTable();
        } else if (viewName === 'quality') {
            renderQualityView();
        } else if (viewName === 'inventory') {
            renderInventoryView();
        } else if (viewName === 'analytics') {
            renderAnalyticsView();
        } else if (viewName === 'recommendations') {
            renderRecommendationsView();
        } else if (viewName === 'upload') {
            renderUploadView();
        } else if (viewName === 'reports') {
            lucide.createIcons();
        } else if (viewName === 'knowledge') {
            lucide.createIcons();
        } else if (viewName === 'settings') {
            lucide.createIcons();
        }
    }

    window.addEventListener('hashchange', handleRoute);
    // Bind routing click events to manual view changes
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const view = item.getAttribute('data-view');
            if (view) {
                window.location.hash = `#${view}`;
            }
        });
    });

    // ── Chart.js Setup ──
    function getOEEForecast(currentOee, speed) {
        const forecast = [currentOee];
        let val = currentOee;
        for (let i = 1; i <= 6; i++) {
            if (speed > 16) {
                // High speed degrades OEE over time due to machine wear
                val -= (speed - 15) * 0.55 + Math.random() * 0.4;
            } else if (speed < 10) {
                // Low speed has low performance, so OEE stays low/flat
                val += (10 - speed) * 0.08 + Math.random() * 0.2 - 0.1;
            } else {
                // Optimal zone: OEE slightly rises/stabilizes
                val += 0.15 + Math.random() * 0.2;
            }
            forecast.push(Math.min(100, Math.max(35, val)));
        }
        return forecast;
    }

    function getChartThemeColors() {
        const isDark = state.theme === 'dark';
        return {
            grid: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            text: isDark ? '#94a3b8' : '#475569',
            border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            oeeLine: '#8b5cf6',
            oeeGradStart: 'rgba(139, 92, 246, 0.25)',
            oeeGradStop: 'rgba(139, 92, 246, 0)',
            forecastLine: '#06b6d4'
        };
    }

    function initCharts() {
        const colors = getChartThemeColors();

        // 1. OEE 24hr trend chart
        const ctxTrend = document.getElementById('chart-oee-trend').getContext('2d');
        const trendGrad = ctxTrend.createLinearGradient(0, 0, 0, 280);
        trendGrad.addColorStop(0, colors.oeeGradStart);
        trendGrad.addColorStop(1, colors.oeeGradStop);

        // Historical OEE (24h) padded with 6 nulls for the forecast range
        const historyData = state.oeeHistory.concat(Array(6).fill(null));
        // Forecast (6h) starts at 24th point (index 23)
        const forecastData = Array(23).fill(null).concat(getOEEForecast(state.telemetry.oee, 12));

        mainTrendChart = new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: Array.from({ length: 30 }, (_, i) => i < 24 ? `${i}:00` : `+${i-23}h (F)`),
                datasets: [
                    {
                        label: 'Overall OEE (Historical)',
                        data: historyData,
                        borderColor: colors.oeeLine,
                        borderWidth: 2,
                        backgroundColor: trendGrad,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: colors.oeeLine,
                        pointBorderColor: 'transparent',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'ML OEE Forecast',
                        data: forecastData,
                        borderColor: colors.forecastLine,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        backgroundColor: 'transparent',
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: colors.forecastLine,
                        pointBorderColor: 'transparent',
                        pointRadius: 0,
                        pointHoverRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: state.theme === 'dark' ? '#0f0a24' : '#ffffff',
                        titleColor: state.theme === 'dark' ? '#f1f5f9' : '#0f172a',
                        bodyColor: state.theme === 'dark' ? '#94a3b8' : '#475569',
                        borderColor: 'rgba(255, 255, 255, 0.08)',
                        borderWidth: 1,
                        padding: 10,
                        callbacks: {
                            label: (context) => `${context.dataset.label.replace('Overall ', '')}: ${context.parsed.y.toFixed(1)}%`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: colors.text, font: { family: 'Inter', size: 9 } }
                    },
                    y: {
                        grid: { color: colors.grid },
                        ticks: { color: colors.text, font: { family: 'Inter', size: 10 } },
                        min: 40,
                        max: 100
                    }
                }
            }
        });

        // 2. Unplanned Downtime Pareto Chart
        const ctxPareto = document.getElementById('chart-downtime-pareto').getContext('2d');
        paretoChart = new Chart(ctxPareto, {
            type: 'bar',
            data: {
                labels: ['Mechanical', 'Tooling', 'Materials', 'Operator'],
                datasets: [{
                    data: state.telemetry.downtime,
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.85)',  // Red
                        'rgba(245, 158, 11, 0.85)', // Amber
                        'rgba(59, 130, 246, 0.85)', // Info Blue
                        'rgba(16, 185, 129, 0.85)'  // Green
                    ],
                    borderRadius: 6,
                    borderWidth: 0,
                    barThickness: 16
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: state.theme === 'dark' ? '#0f0a24' : '#ffffff',
                        titleColor: state.theme === 'dark' ? '#f1f5f9' : '#0f172a',
                        bodyColor: state.theme === 'dark' ? '#94a3b8' : '#475569',
                        padding: 10,
                        callbacks: {
                            label: (context) => `${context.parsed.x} mins`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: colors.grid },
                        ticks: { color: colors.text, font: { family: 'Inter', size: 10 } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: colors.text, font: { family: 'Inter', size: 11, weight: '500' } }
                    }
                }
            }
        });

        // 3. Init Sparklines
        initSparkline('sparkline-oee', state.sparklineData.oee, '#8b5cf6');
        initSparkline('sparkline-availability', state.sparklineData.availability, '#10b981');
        initSparkline('sparkline-performance', state.sparklineData.performance, '#f59e0b');
        initSparkline('sparkline-yield', state.sparklineData.yield, '#06b6d4');
    }

    function initSparkline(canvasId, data, color) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 40);
        gradient.addColorStop(0, color + '30');
        gradient.addColorStop(1, color + '00');

        sparklineCharts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(data.length).fill(''),
                datasets: [{
                    data: data,
                    borderColor: color,
                    borderWidth: 1.5,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }

    function updateChartsTheme() {
        const colors = getChartThemeColors();

        // Update main trend
        mainTrendChart.options.scales.x.ticks.color = colors.text;
        mainTrendChart.options.scales.y.ticks.color = colors.text;
        mainTrendChart.options.scales.y.grid.color = colors.grid;
        mainTrendChart.options.plugins.tooltip.backgroundColor = state.theme === 'dark' ? '#0f0a24' : '#ffffff';
        mainTrendChart.options.plugins.tooltip.titleColor = state.theme === 'dark' ? '#f1f5f9' : '#0f172a';
        mainTrendChart.options.plugins.tooltip.bodyColor = state.theme === 'dark' ? '#94a3b8' : '#475569';
        
        const trendGrad = document.getElementById('chart-oee-trend').getContext('2d').createLinearGradient(0, 0, 0, 280);
        trendGrad.addColorStop(0, colors.oeeGradStart);
        trendGrad.addColorStop(1, colors.oeeGradStop);
        mainTrendChart.data.datasets[0].backgroundColor = trendGrad;
        mainTrendChart.update();

        // Update pareto
        paretoChart.options.scales.x.ticks.color = colors.text;
        paretoChart.options.scales.x.grid.color = colors.grid;
        paretoChart.options.scales.y.ticks.color = colors.text;
        paretoChart.options.plugins.tooltip.backgroundColor = state.theme === 'dark' ? '#0f0a24' : '#ffffff';
        paretoChart.options.plugins.tooltip.titleColor = state.theme === 'dark' ? '#f1f5f9' : '#0f172a';
        paretoChart.options.plugins.tooltip.bodyColor = state.theme === 'dark' ? '#94a3b8' : '#475569';
        paretoChart.update();
    }

    // ── Telemetry Simulation Engine ──
    function runTelemetrySimulation() {
        setInterval(() => {
            // Slight fluctuation
            state.telemetry.oee = Math.min(100, Math.max(50, state.telemetry.oee + (Math.random() * 0.8 - 0.4)));
            state.telemetry.availability = Math.min(100, Math.max(50, state.telemetry.availability + (Math.random() * 0.4 - 0.2)));
            state.telemetry.performance = Math.min(100, Math.max(50, state.telemetry.performance + (Math.random() * 0.6 - 0.3)));
            state.telemetry.yield = Math.min(100, Math.max(50, state.telemetry.yield + (Math.random() * 0.2 - 0.1)));

            // Update UI metrics values
            elements.valOee.textContent = `${state.telemetry.oee.toFixed(1)}%`;
            elements.valAvailability.textContent = `${state.telemetry.availability.toFixed(1)}%`;
            elements.valPerformance.textContent = `${state.telemetry.performance.toFixed(1)}%`;
            elements.valYield.textContent = `${state.telemetry.yield.toFixed(1)}%`;

            // Push values to sparklines and update
            updateSparklineData('sparkline-oee', state.telemetry.oee);
            updateSparklineData('sparkline-availability', state.telemetry.availability);
            updateSparklineData('sparkline-performance', state.telemetry.performance);
            updateSparklineData('sparkline-yield', state.telemetry.yield);

            // Dynamically append new OEE tick to main trend chart
            if (mainTrendChart) {
                const datasets = mainTrendChart.data.datasets[0];
                datasets.data.shift();
                datasets.data.push(state.telemetry.oee);
                mainTrendChart.update('none'); // silent update without animation transitions
            }
        }, 3000);
    }

    function updateSparklineData(canvasId, newValue) {
        const chart = sparklineCharts[canvasId];
        if (chart) {
            const data = chart.data.datasets[0].data;
            data.shift();
            data.push(newValue);
            chart.update('none');
        }
    }

    // ── Alerts / Notification Panel ──
    function renderAlertsDropdown() {
        elements.alertCountIndicator.textContent = state.alerts.length;
        elements.unreadAlertsBadge.textContent = `${state.alerts.length} Unread`;
        elements.sidebarAlertBadge.textContent = `${state.alerts.filter(a => a.severity === 'critical').length} CRITICAL`;

        elements.alertsList.innerHTML = '';
        state.alerts.forEach(alert => {
            const item = document.createElement('div');
            item.className = `alert-item ${alert.severity}`;
            item.innerHTML = `
                <div class="alert-icon-wrapper">
                    <i data-lucide="${alert.severity === 'critical' ? 'alert-triangle' : (alert.severity === 'warning' ? 'activity' : 'info')}"></i>
                </div>
                <div class="alert-details">
                    <span class="alert-title-text">${alert.component}</span>
                    <p class="alert-msg">${alert.msg}</p>
                    <span class="alert-time">${alert.time}</span>
                </div>
            `;
            elements.alertsList.appendChild(item);
        });
        lucide.createIcons();
    }

    function renderAlertsTable() {
        elements.alertsTableBody.innerHTML = '';
        state.alerts.forEach(alert => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <span class="severity-label ${alert.severity}">
                        <i data-lucide="${alert.severity === 'critical' ? 'alert-triangle' : (alert.severity === 'warning' ? 'activity' : 'info')}" style="width:12px; height:12px;"></i>
                        ${alert.severity.toUpperCase()}
                    </span>
                </td>
                <td><strong>${alert.component}</strong></td>
                <td>${alert.msg}</td>
                <td>${alert.time}</td>
                <td>
                    <button class="btn btn-outline btn-xs" onclick="alert('Diagnostic logs generated for ${alert.component}')">Diagnose</button>
                </td>
            `;
            elements.alertsTableBody.appendChild(tr);
        });
        lucide.createIcons();
    }

    elements.notificationsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.notificationsDropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => {
        elements.notificationsDropdown.classList.remove('open');
    });

    elements.notificationsDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // ── Backend API Integration Helpers ──
    async function loadAlerts() {
        try {
            const res = await fetch('/api/telemetry/alerts');
            const resData = await res.json();
            if (resData.success) {
                state.alerts = resData.data;
                renderAlertsDropdown();
                if (window.location.hash === '#alerts') renderAlertsTable();
            }
        } catch (e) {
            console.warn('Backend API offline, loading embedded alerts:', e);
            state.alerts = [
                { id: 1, severity: 'critical', component: 'Schuler Hydraulic Press B-2', msg: 'Hydraulic pressure decay detected (210 Bar). Seal failure risk elevated.', time: '2 mins ago' },
                { id: 2, severity: 'warning', component: 'Paint Oven B Exhaust Fan', msg: 'Vibration anomaly index reached 1.8 Z. Fan belt wear suspected.', time: '14 mins ago' },
                { id: 3, severity: 'info', component: 'Welding Robot Cell A', msg: 'Routine calibration completed. Arm joint offset within 0.02mm.', time: '1 hour ago' }
            ];
            renderAlertsDropdown();
            if (window.location.hash === '#alerts') renderAlertsTable();
        }
    }

    async function loadPlantTelemetry() {
        try {
            const res = await fetch(`/api/telemetry/history?plant=${state.activeSite}`);
            const resData = await res.json();
            if (resData.success && resData.data.length > 0) {
                const history = resData.data;
                const latest = history[history.length - 1];
                state.telemetry.oee = latest.oee;
                state.telemetry.availability = latest.availability;
                state.telemetry.performance = latest.performance;
                state.telemetry.yield = latest.yield;

                elements.valOee.textContent = `${state.telemetry.oee.toFixed(1)}%`;
                elements.valAvailability.textContent = `${state.telemetry.availability.toFixed(1)}%`;
                elements.valPerformance.textContent = `${state.telemetry.performance.toFixed(1)}%`;
                elements.valYield.textContent = `${state.telemetry.yield.toFixed(1)}%`;

                // Set 24 OEE points
                state.oeeHistory = history.slice(-24).map(h => h.oee);
                if (mainTrendChart) {
                    mainTrendChart.data.datasets[0].data = state.oeeHistory.concat(Array(6).fill(null));
                }
                
                // Refresh OEE forecast line in chart
                updateMLSimulation();
            }
        } catch (e) {
            console.warn('Backend API offline, using embedded telemetry datasets:', e);
            const baseOee = state.activeSite === 'austin' ? 94.2 : (state.activeSite === 'shanghai' ? 95.1 : (state.activeSite === 'berlin' ? 91.8 : 92.4));
            state.telemetry = {
                oee: baseOee,
                availability: 96.2,
                performance: 94.8,
                yield: 98.6
            };
            elements.valOee.textContent = `${state.telemetry.oee.toFixed(1)}%`;
            elements.valAvailability.textContent = `${state.telemetry.availability.toFixed(1)}%`;
            elements.valPerformance.textContent = `${state.telemetry.performance.toFixed(1)}%`;
            elements.valYield.textContent = `${state.telemetry.yield.toFixed(1)}%`;

            state.oeeHistory = Array.from({ length: 24 }, (_, i) => +(baseOee + Math.sin(i / 2) * 1.5).toFixed(1));
            if (mainTrendChart) {
                mainTrendChart.data.datasets[0].data = state.oeeHistory.concat(Array(6).fill(null));
            }
            updateMLSimulation();
        }
    }

    // ── Site Picker Telemetry ──
    const plantProfiles = {
        detroit: {
            name: 'Detroit Giga-Assembly Plant Alpha',
            oee: 92.4,
            availability: 96.2,
            performance: 94.8,
            yield: 98.6,
            downtime: 223,
            weather: { temp: '28°C', desc: 'Mostly cloudy' },
            spm: 12,
            pressure: 210,
            pareto: [120, 60, 30, 13],
            oeeTrend: [84, 83, 85, 85, 86, 88, 87, 89, 90, 88, 87, 88, 91, 92, 92, 93, 91, 90, 92, 92, 93, 92.4, 92, 91]
        },
        austin: {
            name: 'Austin Giga-Factory 1',
            oee: 94.2,
            availability: 96.4,
            performance: 94.8,
            yield: 98.5,
            downtime: 118,
            weather: { temp: '34°C', desc: 'Clear & sunny' },
            spm: 16,
            pressure: 205,
            pareto: [55, 35, 20, 8],
            oeeTrend: [88, 89, 90, 91, 92, 91, 93, 94, 93, 95, 94, 93, 94, 95, 96, 95, 94, 93, 94, 94, 95, 94.2, 94, 93]
        },
        berlin: {
            name: 'Berlin Giga-Factory 2',
            oee: 91.8,
            availability: 94.5,
            performance: 93.2,
            yield: 97.8,
            downtime: 310,
            weather: { temp: '18°C', desc: 'Light rain' },
            spm: 11,
            pressure: 225,
            pareto: [180, 80, 35, 15],
            oeeTrend: [81, 82, 83, 84, 85, 87, 86, 88, 89, 88, 87, 89, 90, 91, 91, 90, 89, 90, 91, 91, 92, 91.8, 91, 90]
        },
        shanghai: {
            name: 'Shanghai Megapack Plant',
            oee: 95.1,
            availability: 98.1,
            performance: 97.0,
            yield: 99.2,
            downtime: 85,
            weather: { temp: '26°C', desc: 'Humid & clear' },
            spm: 18,
            pressure: 198,
            pareto: [40, 25, 12, 8],
            oeeTrend: [90, 91, 92, 93, 92, 94, 95, 94, 96, 95, 96, 94, 95, 96, 97, 96, 95, 94, 95, 95, 96, 95.1, 95, 94]
        }
    };

    function applyPlantProfile(val) {
        const p = plantProfiles[val] || plantProfiles.detroit;
        state.telemetry = {
            oee: p.oee,
            availability: p.availability,
            performance: p.performance,
            yield: p.yield
        };

        if (elements.currentPlantName) elements.currentPlantName.textContent = p.name;
        if (elements.sidebarSiteName) elements.sidebarSiteName.textContent = p.name;

        const weatherTemp = document.getElementById('weather-temp');
        const weatherDesc = document.getElementById('weather-desc');
        if (weatherTemp && weatherDesc && p.weather) {
            weatherTemp.textContent = p.weather.temp;
            weatherDesc.textContent = p.weather.desc;
        }

        if (elements.valOee) elements.valOee.textContent = `${p.oee.toFixed(1)}%`;
        if (elements.valAvailability) elements.valAvailability.textContent = `${p.availability.toFixed(1)}%`;
        if (elements.valPerformance) elements.valPerformance.textContent = `${p.performance.toFixed(1)}%`;
        if (elements.valYield) elements.valYield.textContent = `${p.yield.toFixed(1)}%`;

        const headerScore = document.getElementById('header-benchmark-score');
        if (headerScore) headerScore.textContent = `${p.oee.toFixed(1)}%`;

        const totalDowntime = document.getElementById('total-downtime');
        if (totalDowntime) totalDowntime.textContent = `Total: ${p.downtime} mins`;

        if (elements.speedSlider) elements.speedSlider.value = p.spm;
        if (elements.pressureSlider) elements.pressureSlider.value = p.pressure;

        state.oeeHistory = p.oeeTrend;
        if (mainTrendChart) {
            mainTrendChart.data.datasets[0].data = p.oeeTrend.concat(Array(6).fill(null));
            mainTrendChart.update();
        }

        if (downtimeParetoChart) {
            downtimeParetoChart.data.datasets[0].data = p.pareto;
            downtimeParetoChart.update();
        }

        updateMLSimulation();
    }

    elements.siteSelector.addEventListener('change', (e) => {
        const val = e.target.value;
        state.activeSite = val;
        applyPlantProfile(val);
        loadPlantTelemetry();
        if (window.location.hash === '#production') renderProductionLines();
        showToast(`Active Site switched to ${plantProfiles[val].name}. All telemetry metrics updated.`, 'info');
    });

    elements.refreshTelemetryBtn.addEventListener('click', () => {
        // Spin loading icon
        elements.refreshIcon.style.transition = 'transform 0.6s ease-in-out';
        elements.refreshIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            elements.refreshIcon.style.transition = 'none';
            elements.refreshIcon.style.transform = 'rotate(0deg)';
        }, 600);

        // Fetch refreshed telemetry from API
        loadPlantTelemetry();
    });

    // ── Production Line Render ──
    async function renderProductionLines() {
        elements.productionLinesGrid.innerHTML = '<div style="grid-column: span 3; text-align: center; color: var(--text-muted); padding: var(--space-8);">Querying asset registry...</div>';
        try {
            const res = await fetch(`/api/telemetry/assets?plant=${state.activeSite}`);
            const resData = await res.json();
            if (!resData.success) return;

            elements.productionLinesGrid.innerHTML = '';
            const assets = resData.data;

            assets.forEach(machine => {
                const card = document.createElement('div');
                card.className = 'bento-card prod-line-card glow-purple';
                card.innerHTML = `
                    <div class="prod-header">
                        <span class="prod-name" style="font-size: var(--text-base); font-weight: var(--fw-bold);">${machine.name}</span>
                        <span class="prod-status-tag active" style="background: rgba(16, 185, 129, 0.08); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.15); font-size: 10px; font-weight: var(--fw-bold); padding: 2px 8px; border-radius: var(--radius-full);">ONLINE</span>
                    </div>
                    <div style="font-size: 10px; color: var(--text-muted); margin-bottom: var(--space-2);">${machine.line}</div>
                    <div class="prod-metrics-grid" style="margin-bottom: var(--space-4);">
                        <div class="prod-mini-metric">
                            <span class="mini-metric-label">TYPE</span>
                            <span class="mini-metric-value" style="font-size: var(--text-sm);">${machine.type}</span>
                        </div>
                        <div class="prod-mini-metric">
                            <span class="mini-metric-label">MANUFACTURER</span>
                            <span class="mini-metric-value" style="font-size: var(--text-sm);">${machine.manufacturer}</span>
                        </div>
                        <div class="prod-mini-metric">
                            <span class="mini-metric-label">SERIAL NUMBER</span>
                            <span class="mini-metric-value" style="font-size: var(--text-xs); font-family: var(--font-mono);">${machine.serial}</span>
                        </div>
                        <div class="prod-mini-metric">
                            <span class="mini-metric-label">INSTALL DATE</span>
                            <span class="mini-metric-value" style="font-size: var(--text-sm);">${machine.installDate}</span>
                        </div>
                    </div>
                    <button class="btn btn-outline" style="width:100%; margin-top: auto;" onclick="alert('Initiating deep diagnostic test sequence for ${machine.name}. Connection link: OK.')">
                        <i data-lucide="wrench" style="width:14px; height:14px; margin-right:4px;"></i>
                        <span>Diagnose Machine</span>
                    </button>
                `;
                elements.productionLinesGrid.appendChild(card);
            });
            lucide.createIcons();
        } catch (e) {
            console.error('Failed to render production assets:', e);
            elements.productionLinesGrid.innerHTML = '<div style="grid-column: span 3; text-align: center; color: var(--danger);">Failed to load assets.</div>';
        }
    }

    // ── AI Copilot slide drawer ──
    const toggleAI = () => elements.aiDrawer.classList.toggle('open');

    elements.askCopilotBtn.addEventListener('click', toggleAI);
    elements.navItemCopilot.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAI();
    });
    elements.btnCloseCopilot.addEventListener('click', toggleAI);

    // AI Messaging logic
    async function sendMessageToCopilot() {
        const text = elements.chatInput.value.trim();
        if (!text) return;

        // Clear input
        elements.chatInput.value = '';

        // Append User msg bubble
        appendChatBubble('user', text);

        // Fetch AI Response
        try {
            // Display typing indicator placeholder
            const placeholder = appendChatBubble('system', 'Consulting decision models...');
            const speedVal = elements.speedSlider ? parseFloat(elements.speedSlider.value) : 12;
            const pressVal = elements.pressureSlider ? parseFloat(elements.pressureSlider.value) : 210;
            const response = await fetch('/api/ai/tutor/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: text,
                    speed: speedVal,
                    pressure: pressVal
                })
            });

            const data = await response.json();
            placeholder.remove(); // Remove placeholder

            // Format markdown styling slightly
            const replyObj = data.data || data;
            let reply = replyObj.content || replyObj.reply || "Unable to retrieve recommendation log.";
            reply = reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            reply = reply.replace(/\*(.*?)\n/g, '<li>$1</li>');
            
            appendChatBubble('system', reply);
        } catch (e) {
            console.error(e);
            // Fallback response if offline
            setTimeout(() => {
                appendChatBubble('system', "I'm experiencing an offline gateway error, but monitoring logs indicate **Schuler Press Cylinder B-2** is reporting mechanical pressure decay. I recommend checking the hydraulic valves and dispatching a maintenance ticket.");
            }, 1000);
        }
    }

    function appendChatBubble(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        msgDiv.innerHTML = `
            <div class="msg-avatar">
                <i data-lucide="${sender === 'system' ? 'bot' : 'user'}"></i>
            </div>
            <div class="msg-bubble-wrapper">
                <div class="msg-bubble">${text}</div>
                <span class="msg-time">Just now</span>
            </div>
        `;
        elements.chatMessages.appendChild(msgDiv);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
        lucide.createIcons();
        return msgDiv;
    }

    elements.chatSendBtn.addEventListener('click', sendMessageToCopilot);
    elements.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageToCopilot();
        }
    });

    // ── Quick Actions Simulation Modal ──
    elements.quickActionBtn.addEventListener('click', () => {
        elements.quickActionModal.classList.add('open');
    });

    elements.btnCloseModal.addEventListener('click', () => {
        elements.quickActionModal.classList.remove('open');
    });

    document.querySelectorAll('.modal-action-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            elements.quickActionModal.classList.remove('open');

            if (action === 'sim-leak') {
                const newAlert = {
                    id: Date.now(),
                    severity: 'critical',
                    component: 'Paint Shop Robots',
                    msg: 'Cylinder seal leak detected in Paint Shop Line robot arm P-3.',
                    time: 'Just now'
                };
                state.alerts.unshift(newAlert);
                state.productionLines[2].activeAlerts += 1;
                renderAlertsDropdown();
                renderAlertsTable();
                alert('CRITICAL EVENT SIMULATED: Paint shop seal leak alert broadcasted to dashboard.');
            } else if (action === 'sim-speed') {
                if (elements.speedSlider) elements.speedSlider.value = 12;
                if (elements.pressureSlider) elements.pressureSlider.value = 210;
                updateMLSimulation();
                state.telemetry.oee = Math.min(100, state.telemetry.oee + 5.0);
                elements.valOee.textContent = `${state.telemetry.oee.toFixed(1)}%`;
                alert('SPEED OPTIMIZATION LOADED: Telemetry speed output throttled. Current OEE boosted.');
            } else if (action === 'sim-reset') {
                state.alerts = [];
                state.productionLines.forEach(l => l.activeAlerts = 0);
                if (elements.speedSlider) elements.speedSlider.value = 12;
                if (elements.pressureSlider) elements.pressureSlider.value = 210;
                updateMLSimulation();
                renderAlertsDropdown();
                renderAlertsTable();
                alert('ALERT REGISTRY FLUSHED: All active warnings cleared.');
            }
        });
    });

    // ── ML Predictive Analytics Simulation ──
    async function updateMLSimulation() {
        if (!elements.speedSlider || !elements.pressureSlider) return;

        const speedVal = parseFloat(elements.speedSlider.value);
        const pressVal = parseFloat(elements.pressureSlider.value);

        // Update slider value indicators instantly
        elements.valSpeedSlider.textContent = `${speedVal} spm`;
        elements.valPressureSlider.textContent = `${pressVal} bar`;

        try {
            const response = await fetch('/api/telemetry/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ speed: speedVal, pressure: pressVal })
            });
            const resData = await response.json();
            if (!resData.success) return;

            const { zScore, failureRisk, rul, oeeForecast, status } = resData.data;

            // Update UI elements from backend calculation
            elements.mlAnomalyScore.textContent = `${zScore.toFixed(2)} Z`;
            elements.mlFailureRisk.textContent = `${failureRisk.toFixed(1)}%`;

            // Style Risk output based on threshold
            elements.mlFailureRisk.className = 'ml-output-val';
            if (failureRisk < 30) {
                elements.mlFailureRisk.classList.add('risk-low');
            } else if (failureRisk < 65) {
                elements.mlFailureRisk.classList.add('risk-medium');
            } else {
                elements.mlFailureRisk.classList.add('risk-high');
            }

            // Update RUL
            elements.mlRul.textContent = `${rul} hrs`;

            // Check status alert
            if (status === 'ANOMALY') {
                elements.mlStatusText.textContent = 'ANOMALY ALERT';
                elements.mlStatusText.className = 'ml-output-status status-anomaly';

                // Insert predictive alert if not already logged
                let hasAlert = state.alerts.some(a => a.component === 'Predictive Anomaly');
                if (!hasAlert) {
                    state.alerts.unshift({
                        id: Date.now(),
                        severity: 'critical',
                        component: 'Predictive Anomaly',
                        msg: `ML model detected excess vibration (Z-Score: ${zScore.toFixed(2)} Z) on Schuler Press. High risk of proportional valve breakdown.`,
                        time: 'Just now'
                    });
                    state.productionLines[0].activeAlerts += 1;
                    renderAlertsDropdown();
                    if (window.location.hash === '#alerts') renderAlertsTable();
                }
            } else {
                elements.mlStatusText.textContent = 'HEALTHY';
                elements.mlStatusText.className = 'ml-output-status status-healthy';

                // Auto-clear predictive alert if speed/pressure normalized
                const initialLength = state.alerts.length;
                state.alerts = state.alerts.filter(a => a.component !== 'Predictive Anomaly');
                if (state.alerts.length !== initialLength) {
                    state.productionLines[0].activeAlerts = Math.max(0, state.productionLines[0].activeAlerts - 1);
                    renderAlertsDropdown();
                    if (window.location.hash === '#alerts') renderAlertsTable();
                }
            }
            // Dynamically update forecasted line in Chart.js
            if (mainTrendChart && oeeForecast) {
                const forecastPoints = [state.telemetry.oee].concat(oeeForecast.slice(1));
                mainTrendChart.data.datasets[1].data = Array(23).fill(null).concat(forecastPoints);
                mainTrendChart.update('none');
            }

            // Update OEE decomposition terms in equation view
            const eqOee = document.getElementById('eq-oee');
            const eqAvail = document.getElementById('eq-avail');
            const eqPerf = document.getElementById('eq-perf');
            const eqYield = document.getElementById('eq-yield');
            if (eqOee && eqAvail && eqPerf && eqYield) {
                eqOee.textContent = `${state.telemetry.oee.toFixed(1)}%`;
                eqAvail.textContent = `${state.telemetry.availability.toFixed(1)}%`;
                eqPerf.textContent = `${state.telemetry.performance.toFixed(1)}%`;
                eqYield.textContent = `${state.telemetry.yield.toFixed(1)}%`;
            }
        } catch (err) {
            console.warn('Backend API offline, running client-side ML calculation model fallback:', err);
            const speed = parseFloat(elements.speedSlider.value);
            const pressure = parseFloat(elements.pressureSlider.value);

            const zScore = Math.abs(speed - 12) * 0.42 + Math.abs(pressure - 210) * 0.022 + 0.15;
            const failureRisk = (1 / (1 + Math.exp(-(zScore - 2.5) * 1.5))) * 100;
            const rul = Math.max(12, Math.round(180 - zScore * 35));

            elements.mlRiskVal.textContent = `${failureRisk.toFixed(1)}%`;
            elements.mlRulVal.textContent = `${rul} hrs`;
            elements.mlAnomalyVal.textContent = `${zScore.toFixed(2)} Z`;

            if (failureRisk > 65 || zScore > 2.25) {
                elements.mlStatusText.textContent = 'ANOMALY ALERT';
                elements.mlStatusText.className = 'ml-output-status status-danger';
            } else {
                elements.mlStatusText.textContent = 'HEALTHY';
                elements.mlStatusText.className = 'ml-output-status status-healthy';
            }

            const eqOee = document.getElementById('eq-oee');
            const eqAvail = document.getElementById('eq-avail');
            const eqPerf = document.getElementById('eq-perf');
            const eqYield = document.getElementById('eq-yield');
            if (eqOee && eqAvail && eqPerf && eqYield) {
                eqOee.textContent = `${state.telemetry.oee.toFixed(1)}%`;
                eqAvail.textContent = `${state.telemetry.availability.toFixed(1)}%`;
                eqPerf.textContent = `${state.telemetry.performance.toFixed(1)}%`;
                eqYield.textContent = `${state.telemetry.yield.toFixed(1)}%`;
            }
        }
    }

    // Attach simulation listeners
    if (elements.speedSlider && elements.pressureSlider) {
        elements.speedSlider.addEventListener('input', updateMLSimulation);
        elements.pressureSlider.addEventListener('input', updateMLSimulation);
    }

    // ── Live Telemetry activity stream terminal ──
    function runLiveTerminalStream() {
        const consoleEl = document.getElementById('terminal-log-console');
        if (!consoleEl) return;

        const metrics = ['Strokes', 'Temperature', 'Pressure', 'Viscosity', 'Acc. Flow'];
        const systems = ['Press Line 1', 'Welding Cell A', 'Paint Oven B', 'Final Assy 1'];

        setInterval(() => {
            const time = new Date().toTimeString().split(' ')[0];
            const sys = systems[Math.floor(Math.random() * systems.length)];
            const metric = metrics[Math.floor(Math.random() * metrics.length)];

            const speed = elements.speedSlider ? parseFloat(elements.speedSlider.value) : 12;
            const pressure = elements.pressureSlider ? parseFloat(elements.pressureSlider.value) : 210;

            const isAnomaly = speed > 16 || pressure > 250;
            let logLine = '';

            if (isAnomaly && Math.random() > 0.4) {
                const zScore = Math.abs(speed - 12) * 0.42 + Math.abs(pressure - 210) * 0.022 + 0.5;
                logLine = `<div class="terminal-line" style="color: var(--danger); font-weight: bold;">[${time}] ALERT [Schuler Press]: Vibration index reached critical limit (${zScore.toFixed(2)} Z) - DEGRADED OPERATION</div>`;
            } else {
                let value = '';
                if (metric === 'Strokes') value = `${(10 + Math.random() * 8).toFixed(1)} SPM`;
                else if (metric === 'Temperature') value = `${(40 + Math.random() * 20).toFixed(1)} C`;
                else if (metric === 'Pressure') value = `${(180 + Math.random() * 40).toFixed(1)} Bar`;
                else if (metric === 'Viscosity') value = `${(80 + Math.random() * 15).toFixed(1)} cPs`;
                else value = `${(92 + Math.random() * 8).toFixed(1)} %`;

                logLine = `<div class="terminal-line">[${time}] Info [${sys}]: Real-time ${metric} output: ${value} - NORMAL</div>`;
            }

            consoleEl.insertAdjacentHTML('beforeend', logLine);
            consoleEl.scrollTop = consoleEl.scrollHeight;

            if (consoleEl.children.length > 25) {
                consoleEl.children[0].remove();
            }
        }, 1200);
    }

    // ── AI Parameter Optimizer (Heuristic Gradient Descent) ──
    let isOptimizing = false;
    async function runAIOptimizer() {
        if (isOptimizing) return;
        const btn = document.getElementById('btn-run-optimizer');
        if (!btn) return;

        isOptimizing = true;
        btn.disabled = true;
        btn.innerHTML = `<i data-lucide="refresh-cw" class="text-cyan spin" style="width:14px; height:14px; margin-right:4px; display:inline-block;"></i><span>Optimizing...</span>`;
        lucide.createIcons();

        const consoleEl = document.getElementById('terminal-log-console');
        if (consoleEl) {
            const time = new Date().toTimeString().split(' ')[0];
            consoleEl.insertAdjacentHTML('beforeend', `<div class="terminal-line" style="color: var(--accent-secondary); font-weight: bold;">[${time}] SYSTEM: Starting heuristic parameter gradient optimization...</div>`);
            consoleEl.scrollTop = consoleEl.scrollHeight;
        }

        const targetSpeed = 13;
        const targetPressure = 212;

        let currentSpeed = parseFloat(elements.speedSlider.value);
        let currentPressure = parseFloat(elements.pressureSlider.value);

        const steps = 12;
        let step = 0;

        const interval = setInterval(async () => {
            if (step >= steps) {
                clearInterval(interval);
                elements.speedSlider.value = targetSpeed;
                elements.pressureSlider.value = targetPressure;
                await updateMLSimulation();

                btn.disabled = false;
                btn.innerHTML = `<i data-lucide="cpu" class="text-cyan" style="width:14px; height:14px; margin-right:4px; display:inline-block;"></i><span>AI Parameter Optimizer</span>`;
                lucide.createIcons();
                isOptimizing = false;

                if (consoleEl) {
                    const time = new Date().toTimeString().split(' ')[0];
                    consoleEl.insertAdjacentHTML('beforeend', `<div class="terminal-line" style="color: var(--success); font-weight: bold;">[${time}] SYSTEM: Optimization locked. Speed: 13 SPM, Pressure: 212 Bar. OEE restored.</div>`);
                    consoleEl.scrollTop = consoleEl.scrollHeight;
                }
                alert('AI OPTIMIZER COMPLETED: Heuristic models stabilized Schuler Press variables at Speed: 13 SPM, Pressure: 212 Bar. Anomaly resolved, OEE forecasted to rise by 4.2%!');
                return;
            }

            // Interpolate
            currentSpeed += (targetSpeed - currentSpeed) / (steps - step);
            currentPressure += (targetPressure - currentPressure) / (steps - step);

            elements.speedSlider.value = Math.round(currentSpeed);
            elements.pressureSlider.value = Math.round(currentPressure);

            await updateMLSimulation();
            step++;
        }, 150);
    }

    const btnOptimizer = document.getElementById('btn-run-optimizer');
    if (btnOptimizer) {
        btnOptimizer.addEventListener('click', runAIOptimizer);
    }

    // ── Suggestion Prompt Chips Listener ──
    document.querySelectorAll('.chat-chip-btn').forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            if (prompt && elements.chatInput) {
                elements.chatInput.value = prompt;
                sendMessageToCopilot();
            }
        });
    });

    // ── SAP ERP Work Orders Renderer ──
    function renderWorkOrdersTable() {
        const body = document.getElementById('maintenance-wo-table-body');
        if (!body) return;
        body.innerHTML = '';

        state.workOrders.forEach(wo => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><code style="font-family: var(--font-mono); font-weight: bold; color: var(--accent-secondary);">${wo.id}</code></td>
                <td><strong>${wo.component}</strong></td>
                <td>${wo.desc}</td>
                <td>${wo.tech}</td>
                <td>
                    <span class="severity-label ${wo.status.toLowerCase().includes('progress') ? 'warning' : 'info'}" style="font-size:10px; font-weight:var(--fw-bold); padding: 2px 6px; border-radius:var(--radius-sm);">
                        ${wo.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-outline btn-xs" onclick="alert('Viewing SAP PM logs for Work Order ${wo.id}')">View ERP</button>
                </td>
            `;
            body.appendChild(tr);
        });
    }

    // SAP ERP Event Listeners
    const btnCreateWO = document.getElementById('btn-create-wo');
    if (btnCreateWO) {
        btnCreateWO.addEventListener('click', () => {
            const id = `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
            const components = ['Paint Spray Nozzle P-3', 'Austin Giga Press Accumulator', 'Shanghai Megapack Welder Tip', 'Robot arm joint R-4'];
            const descs = ['Nozzle block cleaning and purge cycle', 'Hydraulic accumulator nitrogen refill', 'Calibration offset adjustment', 'Bearing grease replenishment'];
            const techs = ['Mark Davis', 'Sarah Connor', 'Peter Parker', 'Bruce Wayne'];

            const newWO = {
                id: id,
                component: components[Math.floor(Math.random() * components.length)],
                desc: descs[Math.floor(Math.random() * descs.length)],
                tech: techs[Math.floor(Math.random() * techs.length)],
                status: 'Synced (Approved)'
            };

            state.workOrders.unshift(newWO);
            renderWorkOrdersTable();
            
            // Increment WO count
            const countEl = document.getElementById('val-erp-wo-count');
            if (countEl) {
                const count = parseInt(countEl.textContent) || 48;
                countEl.textContent = count + 1;
            }

            alert(`ERP SUCCESS: New Work Order successfully created in SAP PM database (ID: ${id})`);
        });
    }

    const btnProcureValve = document.getElementById('btn-procure-valve');
    const logValve = document.getElementById('procure-valve-log');
    if (btnProcureValve && logValve) {
        btnProcureValve.addEventListener('click', () => {
            btnProcureValve.disabled = true;
            btnProcureValve.textContent = 'Dispatching to SAP...';
            logValve.textContent = 'Contacting SAP MM Purchase Requisition Gateway...';

            setTimeout(() => {
                const prId = `PR-${Math.floor(10000 + Math.random() * 90000)}-SAP`;
                btnProcureValve.textContent = 'SAP Requisition Synced';
                logValve.innerHTML = `<span style="color: var(--success); font-weight:bold;">Requisition Synced! PO ID: ${prId}</span>`;
                
                const badge = document.getElementById('inv-valve-status');
                if (badge) {
                    badge.className = 'badge badge-info';
                    badge.textContent = '5 Ordered (PR Synced)';
                }
                alert(`ERP TRANSACTION COMPLETE: Purchase Requisition created in SAP MM Module. ID: ${prId}. Spare parts dispatched for delivery.`);
            }, 1200);
        });
    }

    const btnProcureCF = document.getElementById('btn-procure-cf');
    const logCF = document.getElementById('procure-cf-log');
    if (btnProcureCF && logCF) {
        btnProcureCF.addEventListener('click', () => {
            btnProcureCF.disabled = true;
            btnProcureCF.textContent = 'Dispatching to SAP...';
            logCF.textContent = 'Contacting SAP MM Purchase Requisition Gateway...';

            setTimeout(() => {
                const prId = `PR-${Math.floor(10000 + Math.random() * 90000)}-SAP`;
                btnProcureCF.textContent = 'SAP Requisition Synced';
                logCF.innerHTML = `<span style="color: var(--success); font-weight:bold;">Requisition Synced! PO ID: ${prId}</span>`;
                alert(`ERP TRANSACTION COMPLETE: Purchase Requisition created in SAP MM Module. ID: ${prId}. Refill rolls dispatched.`);
            }, 1200);
        });
    }

    // ── Quality QA View Renderer ──
    function renderQualityView() {
        const body = document.getElementById('quality-hold-table-body');
        if (!body) return;
        body.innerHTML = '';

        state.defects.forEach(d => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><code style="font-family: var(--font-mono); font-weight: bold; color: var(--accent-secondary);">${d.id}</code></td>
                <td><strong>${d.part}</strong></td>
                <td><span class="severity-label critical" style="font-size:10px; font-weight:var(--fw-bold);">${d.category}</span></td>
                <td>${d.time}</td>
                <td>
                    <button class="btn btn-outline btn-xs" onclick="releaseDefectHold('${d.id}')">Release Hold</button>
                </td>
            `;
            body.appendChild(tr);
        });

        runCognexScanner();
    }

    let qualityScannerInterval = null;
    function runCognexScanner() {
        const consoleEl = document.getElementById('quality-scan-console');
        if (!consoleEl) return;

        if (qualityScannerInterval) clearInterval(qualityScannerInterval);

        qualityScannerInterval = setInterval(() => {
            const time = new Date().toTimeString().split(' ')[0];
            const partNum = Math.floor(100000 + Math.random() * 900000);
            
            if (state.defects.some(d => d.id === 'DF-ACTIVE')) {
                consoleEl.insertAdjacentHTML('beforeend', `<div class="terminal-line" style="color: var(--danger); font-weight:bold;">[${time}] SCANNER ERROR: Quality Hold Active. Part quarantine lock engaged.</div>`);
            } else {
                const conf = (98.5 + Math.random() * 1.4).toFixed(2);
                consoleEl.insertAdjacentHTML('beforeend', `<div class="terminal-line">[${time}] Cognex Scan: Part #${partNum} - AI CLASSIFIER: <span style="color: var(--success); font-weight:bold;">PASSED</span> (${conf}% confidence)</div>`);
            }
            consoleEl.scrollTop = consoleEl.scrollHeight;

            if (consoleEl.children.length > 20) {
                consoleEl.children[0].remove();
            }
        }, 1500);
    }

    // Trigger QC defect simulation
    const btnTriggerDefect = document.getElementById('btn-trigger-defect');
    if (btnTriggerDefect) {
        btnTriggerDefect.addEventListener('click', () => {
            const time = new Date().toTimeString().split(' ')[0];
            const consoleEl = document.getElementById('quality-scan-console');

            const id = 'DF-ACTIVE';
            const categories = ['Weld Fracture', 'Thickness Variance', 'Thermal Deformation', 'Seam Misalignment'];
            const parts = ['Hood Sheet Hood-G', 'Pillar Frame Pilar-B', 'Underbody Rail Rail-X', 'Cylinder Cap B-2'];
            
            const selectedPart = parts[Math.floor(Math.random() * parts.length)];
            const selectedCat = categories[Math.floor(Math.random() * categories.length)];

            if (state.defects.some(d => d.id === 'DF-ACTIVE')) {
                alert('Active defect hold already engaged. Release the quarantine hold first.');
                return;
            }

            const newDefect = {
                id: id,
                part: selectedPart,
                category: selectedCat,
                time: 'Just now'
            };

            state.defects.unshift(newDefect);
            renderQualityView();

            if (consoleEl) {
                consoleEl.insertAdjacentHTML('beforeend', `<div class="terminal-line" style="color: var(--danger); font-weight:bold;">[${time}] !!! AI DETECTED DEFECT !!! ${selectedCat} on Part ${selectedPart}. Line halt triggered!</div>`);
                consoleEl.scrollTop = consoleEl.scrollHeight;
            }

            // Create alert
            state.alerts.unshift({
                id: Date.now(),
                severity: 'critical',
                component: 'Cognex Vision AI',
                msg: `Quality defect hold: ${selectedCat} detected on ${selectedPart}. Output quarantined.`,
                time: 'Just now'
            });
            state.productionLines[1].activeAlerts += 1;
            renderAlertsDropdown();

            // Adjust FPY KPIs
            const fpyEl = document.getElementById('val-fpy-metric');
            const dpmoEl = document.getElementById('val-dpmo-metric');
            if (fpyEl && dpmoEl) {
                fpyEl.textContent = '96.2%';
                dpmoEl.textContent = '240';
            }

            alert(`AI VISION CRITICAL ALARM: Cognex Vision AI scanner detected ${selectedCat} on ${selectedPart}. Automated quarantine locks engaged, shift supervisors notified.`);
        });
    }

    window.releaseDefectHold = (id) => {
        state.defects = state.defects.filter(d => d.id !== id);
        renderQualityView();

        state.alerts = state.alerts.filter(a => a.component !== 'Cognex Vision AI');
        state.productionLines[1].activeAlerts = Math.max(0, state.productionLines[1].activeAlerts - 1);
        renderAlertsDropdown();

        const fpyEl = document.getElementById('val-fpy-metric');
        const dpmoEl = document.getElementById('val-dpmo-metric');
        if (fpyEl && dpmoEl) {
            fpyEl.textContent = '98.4%';
            dpmoEl.textContent = '120';
        }

        const consoleEl = document.getElementById('quality-scan-console');
        if (consoleEl) {
            const time = new Date().toTimeString().split(' ')[0];
            consoleEl.insertAdjacentHTML('beforeend', `<div class="terminal-line" style="color: var(--success); font-weight:bold;">[${time}] SYSTEM: Hold cleared. Line production resume signal broadcasted.</div>`);
        }

        alert('QUALITY HOLD RELEASED: Quarantine clear signals dispatched to PLC line control gateways. AI scanner restarted.');
    };

    // ── Inventory Materials View Renderer ──
    function renderInventoryView() {
        const levelsContainer = document.getElementById('inventory-materials-container');
        if (levelsContainer) {
            levelsContainer.innerHTML = '';
            state.warehouseInventory.forEach(item => {
                const percentage = Math.round((item.qty / item.maxQty) * 100);
                let statusLabel = 'HEALTHY';
                let styleColor = 'var(--success)';

                if (percentage < 30) {
                    statusLabel = 'CRITICAL LOW';
                    styleColor = 'var(--danger)';
                } else if (percentage < 70) {
                    statusLabel = 'REORDER VALUE';
                    styleColor = 'var(--warning)';
                }

                const itemDiv = document.createElement('div');
                itemDiv.style.marginBottom = 'var(--space-4)';
                itemDiv.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-1); font-size:var(--text-sm);">
                        <strong>${item.name}</strong>
                        <span style="font-size:10px; color:${styleColor}; font-weight:var(--fw-bold);">${item.qty} / ${item.maxQty} ${item.unit} (${statusLabel})</span>
                    </div>
                    <div style="width:100%; height:8px; background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); border-radius:var(--radius-full); overflow:hidden;">
                        <div style="width:${percentage}%; height:100%; background:${styleColor}; border-radius:var(--radius-full); transition:width 0.5s ease-in-out;"></div>
                    </div>
                `;
                levelsContainer.appendChild(itemDiv);
            });
        }

        const poBody = document.getElementById('inventory-po-table-body');
        if (poBody) {
            poBody.innerHTML = '';
            state.purchaseOrders.forEach(po => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><code style="font-family: var(--font-mono); font-weight: bold; color: var(--accent-secondary);">${po.id}</code></td>
                    <td><strong>${po.material}</strong></td>
                    <td>${po.qty} units</td>
                    <td>
                        <span class="severity-label ${po.status.toLowerCase().includes('comp') ? 'info' : 'warning'}" style="font-size:9px; font-weight:var(--fw-bold); padding:2px 6px; border-radius:var(--radius-sm);">
                            ${po.status}
                        </span>
                    </td>
                `;
                poBody.appendChild(tr);
            });
        }
    }

    // Attach inventory update updates inside procurement hooks
    const origProcureValve = btnProcureValve.onclick;
    btnProcureValve.addEventListener('click', () => {
        // Refill logic in local state
        state.warehouseInventory[3].qty = 10;
        state.warehouseInventory[3].status = 'Healthy';
        
        const prId = `PO-${Math.floor(10000 + Math.random() * 90000)}-SAP`;
        state.purchaseOrders.unshift({
            id: prId,
            material: 'Proportional Valve Seals',
            qty: 5,
            status: 'Released'
        });
        renderInventoryView();
    });

    btnProcureCF.addEventListener('click', () => {
        state.warehouseInventory[2].qty = 500;
        state.warehouseInventory[2].status = 'Healthy';

        const prId = `PO-${Math.floor(10000 + Math.random() * 90000)}-SAP`;
        state.purchaseOrders.unshift({
            id: prId,
            material: 'Pre-preg Carbon Fiber',
            qty: 160,
            status: 'Released'
        });
        renderInventoryView();
    });

    // ── Analytics Intelligence View Renderer ──
    function renderAnalyticsView() {
        const body = document.getElementById('analytics-shift-table-body');
        if (!body) return;

        const shifts = [
            { name: 'Morning Shift (06:00 - 14:00)', lead: 'David Miller', units: '1,420 units', oee: '89.4%', downtime: '12 mins', status: 'Optimal' },
            { name: 'Afternoon Shift (14:00 - 22:00)', lead: 'Sarah Jenkins', units: '1,380 units', oee: '87.1%', downtime: '18 mins', status: 'Optimal' },
            { name: 'Night Shift (22:00 - 06:00)', lead: 'Robert Chen', units: '1,210 units', oee: '82.5%', downtime: '34 mins', status: 'Degraded' }
        ];

        body.innerHTML = '';
        shifts.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${s.name}</strong></td>
                <td>${s.lead}</td>
                <td>${s.units}</td>
                <td><span style="color:var(--success); font-weight:bold;">${s.oee}</span></td>
                <td>${s.downtime}</td>
                <td><span class="severity-label ${s.status === 'Optimal' ? 'info' : 'warning'}" style="font-size:10px; font-weight:bold;">${s.status}</span></td>
            `;
            body.appendChild(tr);
        });
    }

    const btnRunMonteCarlo = document.getElementById('btn-run-monte-carlo');
    if (btnRunMonteCarlo) {
        btnRunMonteCarlo.addEventListener('click', () => {
            const consoleEl = document.getElementById('monte-carlo-console');
            if (!consoleEl) return;

            btnRunMonteCarlo.disabled = true;
            btnRunMonteCarlo.textContent = 'Simulating 1,000 Runs...';

            let count = 0;
            const interval = setInterval(() => {
                count += 200;
                const time = new Date().toTimeString().split(' ')[0];
                const simulatedOee = (84 + Math.random() * 8).toFixed(1);
                consoleEl.insertAdjacentHTML('beforeend', `<div class="terminal-line">[${time}] Monte Carlo Iteration ${count}/1,000: Simulated OEE = ${simulatedOee}%</div>`);
                consoleEl.scrollTop = consoleEl.scrollHeight;

                if (count >= 1000) {
                    clearInterval(interval);
                    btnRunMonteCarlo.disabled = false;
                    btnRunMonteCarlo.innerHTML = `<i data-lucide="play" style="width:14px; height:14px; margin-right:4px; display:inline-block;"></i><span>Run 1,000 Iteration Risk Simulation</span>`;
                    lucide.createIcons();
                    consoleEl.insertAdjacentHTML('beforeend', `<div class="terminal-line" style="color:var(--success); font-weight:bold;">[${time}] SIMULATION COMPLETE: 94.8% probability of achieving >85% OEE threshold next shift. Variance risk: LOW.</div>`);
                    alert('MONTE CARLO SIMULATION COMPLETE: 1,000 iterations computed. 94.8% probability of achieving >85% OEE threshold on upcoming shift.');
                }
            }, 200);
        });
    }

    // ── Recommendations Intelligence View Renderer ──
    function renderRecommendationsView() {
        const container = document.getElementById('recommendations-cards-container');
        if (!container) return;

        const recs = [
            {
                id: 'REC-01',
                title: 'Heuristic SPM Speed Adjustment',
                impact: '+4.2% OEE Forecast Recovery',
                severity: 'HIGH IMPACT',
                color: 'var(--accent-secondary)',
                border: 'rgba(6,182,212,0.3)',
                desc: 'Hydraulic pressure telemetry indicates thermal expansion on Schuler Press Cylinder B-2. Reducing operating speed from 15 SPM to 13 SPM will prevent seal degradation and improve line yield.',
                actionText: 'Apply SPM Speed Adjustment',
                actionFn: () => {
                    if (elements.speedSlider) elements.speedSlider.value = 13;
                    updateMLSimulation();
                    alert('AI DIRECTIVE APPLIED: Operating speed set to 13 SPM. Failure risk reduced to 1.8%.');
                }
            },
            {
                id: 'REC-02',
                title: 'SAP MM Inventory Requisition Dispatch',
                impact: 'Prevent Line Shutdown',
                severity: 'CRITICAL',
                color: 'var(--danger)',
                border: 'rgba(239,68,68,0.3)',
                desc: 'Proportional Valve Seals stock has dropped to 2 kits (Threshold: 5). Dispatching a Purchase Requisition (PR) to SAP MM Module will ensure delivery before the next maintenance window.',
                actionText: 'Dispatch SAP Purchase Requisition',
                actionFn: () => {
                    const btnVal = document.getElementById('btn-procure-valve');
                    if (btnVal) btnVal.click();
                }
            },
            {
                id: 'REC-03',
                title: 'Paint Oven Thermal Pre-heat Protocol',
                impact: '+12 mins Production Time',
                severity: 'MEDIUM IMPACT',
                color: 'var(--warning)',
                border: 'rgba(245,158,11,0.3)',
                desc: 'Paint Oven B thermal ramp time was delayed by 4.5 mins on morning start. Scheduling automated thermal pre-heating 15 minutes before shift start will maximize first-hour throughput.',
                actionText: 'Activate Automated Pre-heat Schedule',
                actionFn: () => {
                    alert('AI DIRECTIVE APPLIED: Paint Oven B automated 15-minute thermal pre-heat schedule engaged in line PLC controller.');
                }
            }
        ];

        container.innerHTML = '';
        recs.forEach((r, idx) => {
            const card = document.createElement('div');
            card.className = 'bento-card glow-purple';
            card.style.borderColor = r.border;
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-3);">
                    <div style="display:flex; align-items:center; gap:var(--space-3);">
                        <span class="badge" style="background:rgba(255,255,255,0.05); color:${r.color}; font-weight:bold;">${r.id}</span>
                        <h3 style="font-size:var(--text-md); font-weight:var(--fw-bold); color:var(--text-primary); margin:0;">${r.title}</h3>
                    </div>
                    <span class="severity-label" style="background:${r.color}; color:#fff; font-size:10px; font-weight:bold; padding:2px 8px; border-radius:var(--radius-sm);">${r.severity}</span>
                </div>
                <p style="font-size:var(--text-sm); color:var(--text-secondary); margin-bottom:var(--space-4); line-height:1.5;">${r.desc}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--glass-border); padding-top:var(--space-3);">
                    <span style="font-size:11px; font-weight:bold; color:var(--success);"><i data-lucide="trending-up" style="width:12px; height:12px; margin-right:4px; display:inline-block;"></i>${r.impact}</span>
                    <button class="btn btn-primary btn-sm" id="btn-apply-rec-${idx}" style="background:${r.color}; border:none;">
                        <i data-lucide="check-circle" style="width:14px; height:14px; margin-right:4px; display:inline-block;"></i>${r.actionText}
                    </button>
                </div>
            `;
            container.appendChild(card);

            setTimeout(() => {
                const btn = document.getElementById(`btn-apply-rec-${idx}`);
                if (btn) btn.addEventListener('click', r.actionFn);
            }, 50);
        });
        lucide.createIcons();
    }

    // ── Non-Blocking Glassmorphic Toast Notifications ──
    window.showToast = (msg, type = 'info') => {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const iconMap = {
            success: 'check-circle',
            info: 'info',
            warning: 'alert-triangle',
            danger: 'alert-octagon'
        };
        const colorMap = {
            success: 'var(--success)',
            info: 'var(--accent-secondary)',
            warning: 'var(--warning)',
            danger: 'var(--danger)'
        };

        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.innerHTML = `
            <i data-lucide="${iconMap[type] || 'info'}" style="width:16px; height:16px; color:${colorMap[type]}; margin-top:2px; flex-shrink:0; display:inline-block;"></i>
            <div style="flex:1;">
                <span style="font-weight:bold; display:block; margin-bottom:2px; color:${colorMap[type]}; text-transform:uppercase; font-size:10px;">${type}</span>
                <span style="line-height:1.4;">${msg.replace(/\n/g, '<br>')}</span>
            </div>
        `;

        container.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(40px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    // ── Machine Core Thermal Telemetry Fluctuation Stream ──
    function runMachineThermalStream() {
        const tempPress = document.getElementById('temp-press-val');
        const tempWeld = document.getElementById('temp-weld-val');
        const tempOven = document.getElementById('temp-oven-val');
        const tempPack = document.getElementById('temp-pack-val');

        setInterval(() => {
            if (tempPress) tempPress.textContent = `${(48.0 + Math.random() * 0.8).toFixed(1)}°C`;
            if (tempWeld) tempWeld.textContent = `${(65.0 + Math.random() * 1.2).toFixed(1)}°C`;
            if (tempOven) tempOven.textContent = `${(184.8 + Math.random() * 0.6).toFixed(1)}°C`;
            if (tempPack) tempPack.textContent = `${(36.5 + Math.random() * 0.6).toFixed(1)}°C`;
        }, 1500);
    }

    // ── Data Ingestion Hub (Upload View) Handlers ──
    function renderUploadView() {
        const dropzone = document.getElementById('upload-dropzone');
        const fileInput = document.getElementById('dataset-file-input');
        const filenameDisplay = document.getElementById('dropzone-filename');
        const processBtn = document.getElementById('btn-process-upload');
        const testDbBtn = document.getElementById('btn-test-db');
        const dbLog = document.getElementById('db-conn-log');

        if (dropzone && fileInput) {
            dropzone.onclick = () => fileInput.click();
            fileInput.onchange = (e) => {
                if (e.target.files.length > 0) {
                    const file = e.target.files[0];
                    if (filenameDisplay) {
                        filenameDisplay.textContent = `✓ Selected File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
                        filenameDisplay.style.display = 'block';
                    }
                    showToast(`File selected: ${file.name}`, 'info');
                }
            };

            dropzone.ondragover = (e) => {
                e.preventDefault();
                dropzone.style.borderColor = 'var(--text-cyan)';
                dropzone.style.background = 'rgba(6,182,212,0.08)';
            };

            dropzone.ondragleave = () => {
                dropzone.style.borderColor = 'rgba(6,182,212,0.3)';
                dropzone.style.background = 'rgba(15,10,36,0.3)';
            };

            dropzone.ondrop = (e) => {
                e.preventDefault();
                dropzone.style.borderColor = 'rgba(6,182,212,0.3)';
                dropzone.style.background = 'rgba(15,10,36,0.3)';
                if (e.dataTransfer.files.length > 0) {
                    const file = e.dataTransfer.files[0];
                    fileInput.files = e.dataTransfer.files;
                    if (filenameDisplay) {
                        filenameDisplay.textContent = `✓ Selected File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
                        filenameDisplay.style.display = 'block';
                    }
                    showToast(`File uploaded: ${file.name}`, 'info');
                }
            };
        }

        if (processBtn) {
            processBtn.onclick = () => {
                const fname = fileInput && fileInput.files.length > 0 ? fileInput.files[0].name : 'telemetry_stream_batch_2026.csv';
                showToast(`INGESTION COMPLETE: 1,420 rows from ${fname} ingested into telemetry database. OEE datasets refreshed!`, 'success');
            };
        }

        if (testDbBtn && dbLog) {
            testDbBtn.onclick = () => {
                const dbType = document.getElementById('db-type-select').value;
                const time = new Date().toTimeString().split(' ')[0];
                dbLog.innerHTML += `<div class="terminal-line" style="color:var(--text-cyan);">[${time}] Initiating handshake with ${dbType.toUpperCase()} database...</div>`;
                setTimeout(() => {
                    dbLog.innerHTML += `<div class="terminal-line" style="color:var(--success);">[${time}] TLS 1.3 Handshake OK. DB Pipeline Connected!</div>`;
                    dbLog.scrollTop = dbLog.scrollHeight;
                    showToast(`DB CONNECTOR TEST SUCCESS: ${dbType.toUpperCase()} database connection established successfully.`, 'success');
                }, 600);
            };
        }
    }

    // ── Keyboard Shortcuts ──
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            const s = document.getElementById('sidebar-search-input');
            if (s) s.focus();
        }
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const g = document.getElementById('global-search');
            if (g) g.focus();
        }
        // Escape closes account modal
        if (e.key === 'Escape') {
            closeAccountModal();
        }
    });

    // ── Search Functionality (Sidebar + Global) ──
    const NAV_ITEMS_MAP = [
        { keywords: ['dashboard', 'overview', 'home', 'oee', 'kpi'], hash: '#dashboard' },
        { keywords: ['copilot', 'ai', 'chat', 'assistant', 'bot'], hash: '#copilot', fn: () => document.getElementById('ai-drawer').classList.add('open') },
        { keywords: ['production', 'line', 'output', 'units'], hash: '#production' },
        { keywords: ['maintenance', 'repair', 'work order', 'technician'], hash: '#maintenance' },
        { keywords: ['quality', 'defect', 'fpy', 'vision', 'cognex'], hash: '#quality' },
        { keywords: ['inventory', 'stock', 'carbon', 'fiber', 'battery'], hash: '#inventory' },
        { keywords: ['analytics', 'monte carlo', 'simulation'], hash: '#analytics' },
        { keywords: ['recommendations', 'suggestion', 'advice'], hash: '#recommendations' },
        { keywords: ['alerts', 'alarm', 'warning', 'critical'], hash: '#alerts' },
        { keywords: ['upload', 'data', 'import', 'dataset'], hash: '#upload' },
        { keywords: ['reports', 'pdf', 'export', 'download'], hash: '#reports' },
        { keywords: ['settings', 'account', 'profile', 'theme'], hash: '#settings' }
    ];

    function runSearch(query) {
        if (!query || query.trim().length < 1) return;
        const q = query.toLowerCase().trim();

        // First try to open AI Copilot if query is conversational
        const conversational = ['what', 'how', 'why', 'show', 'tell', 'find', 'help', 'oee', 'alert', 'error', 'risk', 'status'];
        const isQuestion = conversational.some(w => q.includes(w)) || q.length > 15;

        if (isQuestion) {
            // Route to copilot and ask
            document.getElementById('ai-drawer').classList.add('open');
            if (elements.chatInput) {
                elements.chatInput.value = query;
                setTimeout(() => sendMessageToCopilot(), 150);
            }
            return;
        }

        // Try to match a nav section
        for (const item of NAV_ITEMS_MAP) {
            if (item.keywords.some(k => q.includes(k) || k.includes(q))) {
                if (item.fn) {
                    item.fn();
                } else {
                    window.location.hash = item.hash;
                }
                showToast(`Navigating to: ${item.hash.replace('#', '').toUpperCase()}`, 'info');
                return;
            }
        }

        // Fallback — show toast
        showToast(`No match found for "${query}". Try: dashboard, alerts, maintenance, quality...`, 'warning');
    }

    // Sidebar search
    const sidebarSearchInput = document.getElementById('sidebar-search-input');
    if (sidebarSearchInput) {
        let sidebarDebounce = null;
        sidebarSearchInput.addEventListener('input', (e) => {
            clearTimeout(sidebarDebounce);
            const q = e.target.value.trim();
            // Filter sidebar nav items
            document.querySelectorAll('.sidebar-nav a').forEach(link => {
                const text = link.textContent.toLowerCase();
                link.closest('li') && (link.closest('li').style.display = (!q || text.includes(q)) ? '' : 'none');
            });
        });
        sidebarSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                runSearch(e.target.value.trim());
                e.target.value = '';
                document.querySelectorAll('.sidebar-nav a').forEach(link => {
                    if (link.closest('li')) link.closest('li').style.display = '';
                });
            }
        });
    }

    // Global header search
    const globalSearchEl = document.getElementById('global-search');
    if (globalSearchEl) {
        globalSearchEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                runSearch(e.target.value.trim());
                e.target.value = '';
            }
        });
    }

    // ── Account Switcher System ──
    const DEFAULT_ACCOUNTS = [
        { name: 'Alexander Vance', role: 'Plant Manager', color: '0D8ABC' },
        { name: 'Yasaswa Brahmam', role: 'Plant Director / Dev', color: '7C3AED' },
        { name: 'Aravind Ariv', role: 'System Engineer', color: '059669' },
        { name: 'Jithesh-26', role: 'OS Factory Member', color: 'F59E0B' },
        { name: 'Guest Operator', role: 'View Only Access', color: '64748B' }
    ];

    let accounts = JSON.parse(localStorage.getItem('fos_accounts') || 'null') || DEFAULT_ACCOUNTS;
    let activeAccountIndex = parseInt(localStorage.getItem('fos_active_account') || '0');

    function saveAccounts() {
        localStorage.setItem('fos_accounts', JSON.stringify(accounts));
        localStorage.setItem('fos_active_account', String(activeAccountIndex));
    }

    function applyAccount(index) {
        const acc = accounts[index];
        if (!acc) return;
        activeAccountIndex = index;
        saveAccounts();

        // Update sidebar
        const nameEl = document.getElementById('sidebar-user-name');
        const roleEl = document.getElementById('sidebar-user-role');
        const avatarEl = document.getElementById('sidebar-avatar');
        const headerAvatarEl = document.querySelector('.profile-avatar');

        if (nameEl) nameEl.textContent = acc.name;
        if (roleEl) roleEl.textContent = acc.role;

        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.name)}&background=${acc.color}&color=fff`;
        if (avatarEl) avatarEl.src = avatarUrl;
        if (headerAvatarEl) headerAvatarEl.src = avatarUrl;

        // Update AI copilot greeting name
        const firstName = acc.name.split(' ')[0];
        showToast(`Switched to: ${acc.name} (${acc.role})`, 'success');
        renderAccountModal();
    }

    function renderAccountModal() {
        const list = document.getElementById('account-profiles-list');
        if (!list) return;
        list.innerHTML = '';
        accounts.forEach((acc, i) => {
            const isActive = i === activeAccountIndex;
            const div = document.createElement('div');
            div.style.cssText = `display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:12px; cursor:pointer; border:1px solid ${isActive ? 'rgba(139,92,246,0.6)' : 'rgba(255,255,255,0.06)'}; background:${isActive ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.02)'}; transition:all 0.2s;`;
            div.innerHTML = `
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(acc.name)}&background=${acc.color}&color=fff" style="width:36px; height:36px; border-radius:50%; border:2px solid #${acc.color}40;">
                <div style="flex:1;">
                    <div style="font-weight:700; font-size:14px; color:${isActive ? '#c084fc' : '#f1f5f9'};">${acc.name}</div>
                    <div style="font-size:11px; color:#64748b;">${acc.role}</div>
                </div>
                ${isActive ? '<span style="font-size:11px; color:#c084fc; font-weight:700; background:rgba(139,92,246,0.15); padding:2px 8px; border-radius:6px;">ACTIVE</span>' : '<span style="font-size:11px; color:#475569; padding:2px 8px;">Switch →</span>'}
            `;
            div.onclick = () => { applyAccount(i); closeAccountModal(); };
            // Hover effect
            div.onmouseenter = () => { if (!isActive) div.style.background = 'rgba(255,255,255,0.05)'; };
            div.onmouseleave = () => { if (!isActive) div.style.background = 'rgba(255,255,255,0.02)'; };
            list.appendChild(div);
        });
    }

    window.openAccountModal = () => {
        renderAccountModal();
        const modal = document.getElementById('account-modal');
        if (modal) { modal.style.display = 'flex'; }
    };

    window.closeAccountModal = () => {
        const modal = document.getElementById('account-modal');
        if (modal) modal.style.display = 'none';
    };

    window.addCustomAccount = () => {
        const nameInput = document.getElementById('new-account-name');
        const roleInput = document.getElementById('new-account-role');
        const name = nameInput ? nameInput.value.trim() : '';
        const role = roleInput ? roleInput.value.trim() : '';

        if (!name) { showToast('Please enter a full name.', 'warning'); return; }
        const colors = ['8B5CF6', 'EF4444', 'F59E0B', '10B981', 'EC4899', '3B82F6'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        accounts.push({ name, role: role || 'Team Member', color });
        saveAccounts();
        applyAccount(accounts.length - 1);
        if (nameInput) nameInput.value = '';
        if (roleInput) roleInput.value = '';
        closeAccountModal();
    };

    // Apply saved account on load
    applyAccount(activeAccountIndex);

    // ── Initialization ──
    initTheme();
    initCharts();
    initMobileMenu();
    loadAlerts();
    loadPlantTelemetry();
    renderWorkOrdersTable();
    renderQualityView();
    renderInventoryView();
    renderAnalyticsView();
    renderRecommendationsView();
    runLiveTerminalStream();
    runMachineThermalStream();
    runTelemetrySimulation();
    handleRoute();
});
