/**
 * Distributed Event Streaming Bus #5066
 * A comprehensive event streaming system simulator and management tool
 */

class DistributedEventStreamingBus {
    constructor() {
        this.isConnected = false;
        this.brokers = [];
        this.producers = [];
        this.consumers = [];
        this.topics = [];
        this.partitions = [];
        this.metrics = {
            messagesPerSecond: 0,
            throughput: 0,
            activeProducers: 0,
            activeConsumers: 0,
            totalMessages: 0,
            errors: 0
        };
        this.settings = this.loadSettings();
        this.charts = {};
        this.intervals = {};
        this.messageFlow = [];

        this.init();
    }

    init() {
        this.initEventListeners();
        this.initCharts();
        this.loadSampleData();
        this.updateUI();
        this.startMetricsCollection();
    }

    initEventListeners() {
        // Navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(e.target.getAttribute('href').substring(1));
            });
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Connection
        document.getElementById('connect-btn').addEventListener('click', () => {
            this.toggleConnection();
        });

        // Export
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportData();
        });

        // Producer controls
        document.getElementById('add-producer').addEventListener('click', () => {
            this.showProducerModal();
        });

        document.getElementById('start-all-producers').addEventListener('click', () => {
            this.startAllProducers();
        });

        document.getElementById('stop-all-producers').addEventListener('click', () => {
            this.stopAllProducers();
        });

        document.getElementById('export-producers').addEventListener('click', () => {
            this.exportProducers();
        });

        // Consumer controls
        document.getElementById('add-consumer').addEventListener('click', () => {
            this.showConsumerModal();
        });

        document.getElementById('start-all-consumers').addEventListener('click', () => {
            this.startAllConsumers();
        });

        document.getElementById('stop-all-consumers').addEventListener('click', () => {
            this.stopAllConsumers();
        });

        document.getElementById('export-consumers').addEventListener('click', () => {
            this.exportConsumers();
        });

        // Topic controls
        document.getElementById('create-topic').addEventListener('click', () => {
            this.showTopicModal();
        });

        document.getElementById('refresh-topics').addEventListener('click', () => {
            this.refreshTopics();
        });

        document.getElementById('export-topics').addEventListener('click', () => {
            this.exportTopics();
        });

        // Partition controls
        document.getElementById('rebalance-partitions').addEventListener('click', () => {
            this.rebalancePartitions();
        });

        document.getElementById('export-partitions').addEventListener('click', () => {
            this.exportPartitions();
        });

        // Monitoring controls
        document.getElementById('refresh-monitoring').addEventListener('click', () => {
            this.refreshMonitoring();
        });

        document.getElementById('export-metrics').addEventListener('click', () => {
            this.exportMetrics();
        });

        // Message flow controls
        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetMessageFlowView();
        });

        document.getElementById('export-flow').addEventListener('click', () => {
            this.exportMessageFlow();
        });

        // Settings
        this.initSettingsListeners();

        // Modals
        this.initModalListeners();
    }

    initSettingsListeners() {
        // Connection settings
        document.getElementById('bootstrap-servers').addEventListener('change', (e) => {
            this.settings.bootstrapServers = e.target.value;
            this.saveSettings();
        });

        document.getElementById('client-id').addEventListener('change', (e) => {
            this.settings.clientId = e.target.value;
            this.saveSettings();
        });

        document.getElementById('connection-timeout').addEventListener('change', (e) => {
            this.settings.connectionTimeout = parseInt(e.target.value);
            this.saveSettings();
        });

        document.getElementById('request-timeout').addEventListener('change', (e) => {
            this.settings.requestTimeout = parseInt(e.target.value);
            this.saveSettings();
        });

        // Producer settings
        document.getElementById('acks').addEventListener('change', (e) => {
            this.settings.acks = e.target.value;
            this.saveSettings();
        });

        document.getElementById('retries').addEventListener('change', (e) => {
            this.settings.retries = parseInt(e.target.value);
            this.saveSettings();
        });

        document.getElementById('batch-size').addEventListener('change', (e) => {
            this.settings.batchSize = parseInt(e.target.value);
            this.saveSettings();
        });

        document.getElementById('linger-ms').addEventListener('change', (e) => {
            this.settings.lingerMs = parseInt(e.target.value);
            this.saveSettings();
        });

        // Consumer settings
        document.getElementById('group-id').addEventListener('change', (e) => {
            this.settings.groupId = e.target.value;
            this.saveSettings();
        });

        document.getElementById('auto-offset-reset').addEventListener('change', (e) => {
            this.settings.autoOffsetReset = e.target.value;
            this.saveSettings();
        });

        document.getElementById('enable-auto-commit').addEventListener('change', (e) => {
            this.settings.enableAutoCommit = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('auto-commit-interval').addEventListener('change', (e) => {
            this.settings.autoCommitInterval = parseInt(e.target.value);
            this.saveSettings();
        });

        // Monitoring settings
        document.getElementById('metrics-interval').addEventListener('change', (e) => {
            this.settings.metricsInterval = parseInt(e.target.value);
            this.saveSettings();
            this.restartMetricsCollection();
        });

        document.getElementById('retention-days').addEventListener('change', (e) => {
            this.settings.retentionDays = parseInt(e.target.value);
            this.saveSettings();
        });

        document.getElementById('enable-alerts').addEventListener('change', (e) => {
            this.settings.enableAlerts = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('alert-threshold').addEventListener('change', (e) => {
            this.settings.alertThreshold = parseInt(e.target.value);
            this.saveSettings();
        });

        // Data management
        document.getElementById('load-sample-config').addEventListener('click', () => {
            this.loadSampleConfig();
        });

        document.getElementById('export-config').addEventListener('click', () => {
            this.exportConfig();
        });

        document.getElementById('import-config').addEventListener('click', () => {
            document.getElementById('config-file').click();
        });

        document.getElementById('config-file').addEventListener('change', (e) => {
            this.importConfig(e.target.files[0]);
        });

        document.getElementById('reset-config').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all settings to default?')) {
                this.resetConfig();
            }
        });

        document.getElementById('clear-all-data').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                this.clearAllData();
            }
        });
    }

    initModalListeners() {
        // Producer modal
        document.getElementById('close-producer-modal').addEventListener('click', () => {
            this.hideProducerModal();
        });

        document.getElementById('cancel-producer').addEventListener('click', () => {
            this.hideProducerModal();
        });

        document.getElementById('producer-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProducer();
        });

        // Consumer modal
        document.getElementById('close-consumer-modal').addEventListener('click', () => {
            this.hideConsumerModal();
        });

        document.getElementById('cancel-consumer').addEventListener('click', () => {
            this.hideConsumerModal();
        });

        document.getElementById('consumer-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveConsumer();
        });

        // Topic modal
        document.getElementById('close-topic-modal').addEventListener('click', () => {
            this.hideTopicModal();
        });

        document.getElementById('cancel-topic').addEventListener('click', () => {
            this.hideTopicModal();
        });

        document.getElementById('topic-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTopic();
        });
    }

    initCharts() {
        // Performance chart
        this.charts.performance = new Chart(document.getElementById('performance-chart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Accuracy',
                    data: [],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });

        // Health chart
        this.charts.health = new Chart(document.getElementById('health-chart'), {
            type: 'doughnut',
            data: {
                labels: ['Healthy', 'Warning', 'Critical'],
                datasets: [{
                    data: [75, 20, 5],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                }]
            },
            options: {
                responsive: true
            }
        });

        // Message flow chart
        this.charts.messageFlow = new Chart(document.getElementById('message-flow-chart'), {
            type: 'bar',
            data: {
                labels: ['Producers', 'Topics', 'Consumers'],
                datasets: [{
                    label: 'Message Count',
                    data: [0, 0, 0],
                    backgroundColor: ['#2563eb', '#10b981', '#f59e0b']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Throughput chart
        this.charts.throughput = new Chart(document.getElementById('throughput-chart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Messages/sec',
                    data: [],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Lag chart
        this.charts.lag = new Chart(document.getElementById('lag-chart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Consumer Lag',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Broker performance chart
        this.charts.brokerPerformance = new Chart(document.getElementById('broker-performance-chart'), {
            type: 'radar',
            data: {
                labels: ['CPU', 'Memory', 'Disk I/O', 'Network I/O', 'Latency'],
                datasets: [{
                    label: 'Broker 1',
                    data: [65, 59, 90, 81, 56],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.2)'
                }]
            },
            options: {
                responsive: true
            }
        });

        // Error rate chart
        this.charts.errorRate = new Chart(document.getElementById('error-rate-chart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Error Rate (%)',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });

        // Network I/O chart
        this.charts.networkIO = new Chart(document.getElementById('network-io-chart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'In (MB/s)',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Out (MB/s)',
                    data: [],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Disk usage chart
        this.charts.diskUsage = new Chart(document.getElementById('disk-usage-chart'), {
            type: 'doughnut',
            data: {
                labels: ['Used', 'Free'],
                datasets: [{
                    data: [75, 25],
                    backgroundColor: ['#ef4444', '#10b981']
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    switchSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });

        document.getElementById(sectionId).classList.add('active');
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');

        // Update section-specific content
        switch (sectionId) {
            case 'producers':
                this.updateProducersDisplay();
                break;
            case 'consumers':
                this.updateConsumersDisplay();
                break;
            case 'topics':
                this.updateTopicsDisplay();
                break;
            case 'partitions':
                this.updatePartitionsDisplay();
                break;
            case 'monitoring':
                this.refreshMonitoring();
                break;
            case 'message-flow':
                this.updateMessageFlowVisualization();
                break;
        }
    }

    toggleConnection() {
        if (this.isConnected) {
            this.disconnect();
        } else {
            this.connect();
        }
    }

    async connect() {
        this.showLoading('Connecting to event streaming bus...');
        try {
            // Simulate connection
            await this.delay(2000);
            this.isConnected = true;
            this.updateConnectionStatus();
            this.startMessageSimulation();
            this.hideLoading();
            this.showNotification('Successfully connected to event streaming bus');
        } catch (error) {
            this.hideLoading();
            this.showNotification('Failed to connect: ' + error.message, 'error');
        }
    }

    disconnect() {
        this.isConnected = false;
        this.stopMessageSimulation();
        this.updateConnectionStatus();
        this.showNotification('Disconnected from event streaming bus');
    }

    updateConnectionStatus() {
        const btn = document.getElementById('connect-btn');
        const status = document.getElementById('cluster-status');

        if (this.isConnected) {
            btn.textContent = '🔌 Disconnect';
            btn.classList.add('danger-btn');
            btn.classList.remove('primary-btn');
            status.textContent = 'Connected';
            status.className = 'status-connected';
        } else {
            btn.textContent = '🔗 Connect';
            btn.classList.add('primary-btn');
            btn.classList.remove('danger-btn');
            status.textContent = 'Disconnected';
            status.className = 'status-disconnected';
        }
    }

    startMessageSimulation() {
        this.intervals.messageSimulation = setInterval(() => {
            this.simulateMessages();
        }, 1000);
    }

    stopMessageSimulation() {
        if (this.intervals.messageSimulation) {
            clearInterval(this.intervals.messageSimulation);
            this.intervals.messageSimulation = null;
        }
    }

    simulateMessages() {
        if (!this.isConnected) return;

        const activeProducers = this.producers.filter(p => p.status === 'running');
        const activeConsumers = this.consumers.filter(c => c.status === 'running');

        // Simulate message production
        activeProducers.forEach(producer => {
            const messages = Math.floor(Math.random() * producer.rate) + 1;
            producer.messagesProduced += messages;
            this.metrics.totalMessages += messages;
        });

        // Simulate message consumption
        activeConsumers.forEach(consumer => {
            const messages = Math.floor(Math.random() * 50) + 1;
            consumer.messagesConsumed += messages;
            consumer.lag = Math.max(0, consumer.lag - messages + Math.floor(Math.random() * 10));
        });

        // Update metrics
        this.metrics.messagesPerSecond = activeProducers.reduce((sum, p) => sum + p.rate, 0);
        this.metrics.throughput = this.metrics.messagesPerSecond * 1024; // Simulate 1KB messages
        this.metrics.activeProducers = activeProducers.length;
        this.metrics.activeConsumers = activeConsumers.length;

        this.updateMetricsDisplay();
        this.updateCharts();
        this.addActivityLog(`Processed ${this.metrics.messagesPerSecond} messages/sec`);
    }

    startMetricsCollection() {
        this.intervals.metrics = setInterval(() => {
            this.collectMetrics();
        }, this.settings.metricsInterval);
    }

    restartMetricsCollection() {
        if (this.intervals.metrics) {
            clearInterval(this.intervals.metrics);
        }
        this.startMetricsCollection();
    }

    collectMetrics() {
        // Update chart data with new metrics
        const now = new Date().toLocaleTimeString();

        // Throughput chart
        this.charts.throughput.data.labels.push(now);
        this.charts.throughput.data.datasets[0].data.push(this.metrics.messagesPerSecond);
        if (this.charts.throughput.data.labels.length > 20) {
            this.charts.throughput.data.labels.shift();
            this.charts.throughput.data.datasets[0].data.shift();
        }
        this.charts.throughput.update();

        // Lag chart
        const avgLag = this.consumers.reduce((sum, c) => sum + c.lag, 0) / Math.max(1, this.consumers.length);
        this.charts.lag.data.labels.push(now);
        this.charts.lag.data.datasets[0].data.push(avgLag);
        if (this.charts.lag.data.labels.length > 20) {
            this.charts.lag.data.labels.shift();
            this.charts.lag.data.datasets[0].data.shift();
        }
        this.charts.lag.update();

        // Error rate chart
        const errorRate = Math.random() * 5; // Simulate 0-5% error rate
        this.charts.errorRate.data.labels.push(now);
        this.charts.errorRate.data.datasets[0].data.push(errorRate);
        if (this.charts.errorRate.data.labels.length > 20) {
            this.charts.errorRate.data.labels.shift();
            this.charts.errorRate.data.datasets[0].data.shift();
        }
        this.charts.errorRate.update();

        // Network I/O chart
        const networkIn = Math.random() * 100 + 50;
        const networkOut = Math.random() * 80 + 30;
        this.charts.networkIO.data.labels.push(now);
        this.charts.networkIO.data.datasets[0].data.push(networkIn);
        this.charts.networkIO.data.datasets[1].data.push(networkOut);
        if (this.charts.networkIO.data.labels.length > 20) {
            this.charts.networkIO.data.labels.shift();
            this.charts.networkIO.data.datasets[0].data.shift();
            this.charts.networkIO.data.datasets[1].data.shift();
        }
        this.charts.networkIO.update();
    }

    updateMetricsDisplay() {
        document.getElementById('active-brokers').textContent = this.brokers.length;
        document.getElementById('total-topics').textContent = this.topics.length;
        document.getElementById('active-producers').textContent = this.metrics.activeProducers;
        document.getElementById('active-consumers').textContent = this.metrics.activeConsumers;
        document.getElementById('messages-per-second').textContent = this.metrics.messagesPerSecond;
        document.getElementById('throughput').textContent = `${(this.metrics.throughput / 1024 / 1024).toFixed(2)} MB/s`;
    }

    updateCharts() {
        // Update message flow chart
        this.charts.messageFlow.data.datasets[0].data = [
            this.metrics.activeProducers,
            this.topics.length,
            this.metrics.activeConsumers
        ];
        this.charts.messageFlow.update();
    }

    addActivityLog(message) {
        const log = document.getElementById('activity-log');
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div>${message}</div>
            <div class="activity-timestamp">${new Date().toLocaleTimeString()}</div>
        `;
        log.insertBefore(item, log.firstChild);

        // Keep only last 50 items
        while (log.children.length > 50) {
            log.removeChild(log.lastChild);
        }
    }

    // Producer Management
    showProducerModal(producer = null) {
        const modal = document.getElementById('producer-modal');
        const form = document.getElementById('producer-form');
        const title = document.getElementById('producer-modal-title');

        if (producer) {
            title.textContent = 'Edit Producer';
            document.getElementById('producer-name').value = producer.name;
            document.getElementById('producer-topic').value = producer.topic;
            document.getElementById('producer-rate').value = producer.rate;
            document.getElementById('producer-payload-size').value = producer.payloadSize;
            document.getElementById('producer-compression').checked = producer.compression;
        } else {
            title.textContent = 'Add Producer';
            form.reset();
        }

        this.updateTopicSelects();
        modal.classList.add('active');
    }

    hideProducerModal() {
        document.getElementById('producer-modal').classList.remove('active');
    }

    saveProducer() {
        const name = document.getElementById('producer-name').value;
        const topic = document.getElementById('producer-topic').value;
        const rate = parseInt(document.getElementById('producer-rate').value);
        const payloadSize = parseInt(document.getElementById('producer-payload-size').value);
        const compression = document.getElementById('producer-compression').checked;

        const producer = {
            id: uuidv4(),
            name: name,
            topic: topic,
            rate: rate,
            payloadSize: payloadSize,
            compression: compression,
            status: 'stopped',
            messagesProduced: 0,
            created: new Date().toISOString()
        };

        this.producers.push(producer);
        this.saveData();
        this.updateProducersDisplay();
        this.hideProducerModal();
        this.showNotification('Producer created successfully');
    }

    updateProducersDisplay() {
        const grid = document.getElementById('producers-grid');
        grid.innerHTML = '';

        this.producers.forEach(producer => {
            const card = document.createElement('div');
            card.className = 'producer-card';
            card.innerHTML = `
                <div class="producer-header">
                    <h4>${producer.name}</h4>
                    <span class="producer-status status-${producer.status}">${producer.status}</span>
                </div>
                <div class="producer-metrics">
                    <div>Topic: ${producer.topic}</div>
                    <div>Rate: ${producer.rate} msg/sec</div>
                    <div>Produced: ${producer.messagesProduced}</div>
                    <div>Payload: ${producer.payloadSize} bytes</div>
                </div>
                <div class="producer-actions">
                    <button onclick="app.toggleProducer('${producer.id}')" class="secondary-btn">
                        ${producer.status === 'running' ? '⏹️ Stop' : '▶️ Start'}
                    </button>
                    <button onclick="app.editProducer('${producer.id}')" class="secondary-btn">✏️ Edit</button>
                    <button onclick="app.deleteProducer('${producer.id}')" class="danger-btn">🗑️ Delete</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    toggleProducer(id) {
        const producer = this.producers.find(p => p.id === id);
        if (producer) {
            producer.status = producer.status === 'running' ? 'stopped' : 'running';
            this.saveData();
            this.updateProducersDisplay();
        }
    }

    editProducer(id) {
        const producer = this.producers.find(p => p.id === id);
        if (producer) {
            this.showProducerModal(producer);
        }
    }

    deleteProducer(id) {
        if (confirm('Are you sure you want to delete this producer?')) {
            this.producers = this.producers.filter(p => p.id !== id);
            this.saveData();
            this.updateProducersDisplay();
            this.showNotification('Producer deleted');
        }
    }

    startAllProducers() {
        this.producers.forEach(p => p.status = 'running');
        this.saveData();
        this.updateProducersDisplay();
        this.showNotification('All producers started');
    }

    stopAllProducers() {
        this.producers.forEach(p => p.status = 'stopped');
        this.saveData();
        this.updateProducersDisplay();
        this.showNotification('All producers stopped');
    }

    // Consumer Management
    showConsumerModal(consumer = null) {
        const modal = document.getElementById('consumer-modal');
        const form = document.getElementById('consumer-form');
        const title = document.getElementById('consumer-modal-title');

        if (consumer) {
            title.textContent = 'Edit Consumer';
            document.getElementById('consumer-name').value = consumer.name;
            document.getElementById('consumer-topic').value = consumer.topic;
            document.getElementById('consumer-group').value = consumer.group;
            document.getElementById('consumer-processing-time').value = consumer.processingTime;
            document.getElementById('consumer-auto-commit').checked = consumer.autoCommit;
        } else {
            title.textContent = 'Add Consumer';
            form.reset();
        }

        this.updateTopicSelects();
        modal.classList.add('active');
    }

    hideConsumerModal() {
        document.getElementById('consumer-modal').classList.remove('active');
    }

    saveConsumer() {
        const name = document.getElementById('consumer-name').value;
        const topic = document.getElementById('consumer-topic').value;
        const group = document.getElementById('consumer-group').value;
        const processingTime = parseInt(document.getElementById('consumer-processing-time').value);
        const autoCommit = document.getElementById('consumer-auto-commit').checked;

        const consumer = {
            id: uuidv4(),
            name: name,
            topic: topic,
            group: group,
            processingTime: processingTime,
            autoCommit: autoCommit,
            status: 'stopped',
            messagesConsumed: 0,
            lag: 0,
            created: new Date().toISOString()
        };

        this.consumers.push(consumer);
        this.saveData();
        this.updateConsumersDisplay();
        this.hideConsumerModal();
        this.showNotification('Consumer created successfully');
    }

    updateConsumersDisplay() {
        const grid = document.getElementById('consumers-grid');
        grid.innerHTML = '';

        this.consumers.forEach(consumer => {
            const card = document.createElement('div');
            card.className = 'consumer-card';
            card.innerHTML = `
                <div class="consumer-header">
                    <h4>${consumer.name}</h4>
                    <span class="consumer-status status-${consumer.status}">${consumer.status}</span>
                </div>
                <div class="consumer-metrics">
                    <div>Topic: ${consumer.topic}</div>
                    <div>Group: ${consumer.group}</div>
                    <div>Consumed: ${consumer.messagesConsumed}</div>
                    <div>Lag: ${consumer.lag}</div>
                </div>
                <div class="consumer-actions">
                    <button onclick="app.toggleConsumer('${consumer.id}')" class="secondary-btn">
                        ${consumer.status === 'running' ? '⏹️ Stop' : '▶️ Start'}
                    </button>
                    <button onclick="app.editConsumer('${consumer.id}')" class="secondary-btn">✏️ Edit</button>
                    <button onclick="app.deleteConsumer('${consumer.id}')" class="danger-btn">🗑️ Delete</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    toggleConsumer(id) {
        const consumer = this.consumers.find(c => c.id === id);
        if (consumer) {
            consumer.status = consumer.status === 'running' ? 'stopped' : 'running';
            this.saveData();
            this.updateConsumersDisplay();
        }
    }

    editConsumer(id) {
        const consumer = this.consumers.find(c => c.id === id);
        if (consumer) {
            this.showConsumerModal(consumer);
        }
    }

    deleteConsumer(id) {
        if (confirm('Are you sure you want to delete this consumer?')) {
            this.consumers = this.consumers.filter(c => c.id !== id);
            this.saveData();
            this.updateConsumersDisplay();
            this.showNotification('Consumer deleted');
        }
    }

    startAllConsumers() {
        this.consumers.forEach(c => c.status = 'running');
        this.saveData();
        this.updateConsumersDisplay();
        this.showNotification('All consumers started');
    }

    stopAllConsumers() {
        this.consumers.forEach(c => c.status = 'stopped');
        this.saveData();
        this.updateConsumersDisplay();
        this.showNotification('All consumers stopped');
    }

    // Topic Management
    showTopicModal() {
        document.getElementById('topic-modal').classList.add('active');
    }

    hideTopicModal() {
        document.getElementById('topic-modal').classList.remove('active');
    }

    createTopic() {
        const name = document.getElementById('topic-name').value;
        const partitions = parseInt(document.getElementById('topic-partitions').value);
        const replication = parseInt(document.getElementById('topic-replication').value);
        const retention = parseInt(document.getElementById('topic-retention').value);

        const topic = {
            id: uuidv4(),
            name: name,
            partitions: partitions,
            replicationFactor: replication,
            retentionHours: retention,
            messages: 0,
            size: 0,
            created: new Date().toISOString()
        };

        this.topics.push(topic);
        this.createPartitionsForTopic(topic);
        this.saveData();
        this.updateTopicsDisplay();
        this.hideTopicModal();
        this.showNotification('Topic created successfully');
    }

    createPartitionsForTopic(topic) {
        for (let i = 0; i < topic.partitions; i++) {
            const partition = {
                id: uuidv4(),
                topicId: topic.id,
                topicName: topic.name,
                partitionId: i,
                leader: `broker-${Math.floor(Math.random() * this.brokers.length) + 1}`,
                replicas: [`broker-${Math.floor(Math.random() * this.brokers.length) + 1}`],
                isr: [`broker-${Math.floor(Math.random() * this.brokers.length) + 1}`],
                offset: Math.floor(Math.random() * 10000),
                lag: Math.floor(Math.random() * 100)
            };
            this.partitions.push(partition);
        }
    }

    updateTopicsDisplay() {
        const tbody = document.getElementById('topics-body');
        tbody.innerHTML = '';

        this.topics.forEach(topic => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${topic.name}</td>
                <td>${topic.partitions}</td>
                <td>${topic.replicationFactor}</td>
                <td>${topic.messages.toLocaleString()}</td>
                <td>${(topic.size / 1024 / 1024).toFixed(2)} MB</td>
                <td>
                    <button onclick="app.deleteTopic('${topic.id}')" class="danger-btn">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.updateTopicSelects();
    }

    deleteTopic(id) {
        if (confirm('Are you sure you want to delete this topic?')) {
            this.topics = this.topics.filter(t => t.id !== id);
            this.partitions = this.partitions.filter(p => p.topicId !== id);
            this.saveData();
            this.updateTopicsDisplay();
            this.updatePartitionsDisplay();
            this.showNotification('Topic deleted');
        }
    }

    updatePartitionsDisplay() {
        const tbody = document.getElementById('partitions-body');
        tbody.innerHTML = '';

        this.partitions.forEach(partition => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${partition.topicName}</td>
                <td>${partition.partitionId}</td>
                <td>${partition.leader}</td>
                <td>${partition.replicas.join(', ')}</td>
                <td>${partition.isr.join(', ')}</td>
                <td>${partition.offset.toLocaleString()}</td>
                <td>${partition.lag.toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });
    }

    rebalancePartitions() {
        this.showLoading('Rebalancing partitions...');
        setTimeout(() => {
            this.partitions.forEach(partition => {
                partition.leader = `broker-${Math.floor(Math.random() * this.brokers.length) + 1}`;
                partition.replicas = [`broker-${Math.floor(Math.random() * this.brokers.length) + 1}`];
                partition.isr = [`broker-${Math.floor(Math.random() * this.brokers.length) + 1}`];
            });
            this.saveData();
            this.updatePartitionsDisplay();
            this.hideLoading();
            this.showNotification('Partitions rebalanced successfully');
        }, 2000);
    }

    updateTopicSelects() {
        const selects = ['producer-topic', 'consumer-topic'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.innerHTML = '<option value="">Select Topic</option>';
                this.topics.forEach(topic => {
                    const option = document.createElement('option');
                    option.value = topic.name;
                    option.textContent = topic.name;
                    select.appendChild(option);
                });
            }
        });
    }

    updateMessageFlowVisualization() {
        // Simple D3.js visualization for message flow
        const svg = d3.select('#message-flow-diagram')
            .html('')
            .append('svg')
            .attr('width', '100%')
            .attr('height', 400);

        // Create nodes for producers, topics, and consumers
        const nodes = [];
        const links = [];

        // Add producers
        this.producers.forEach((producer, i) => {
            nodes.push({
                id: `producer-${i}`,
                name: producer.name,
                type: 'producer',
                x: 100,
                y: 50 + i * 60
            });
            links.push({
                source: `producer-${i}`,
                target: `topic-${producer.topic}`,
                value: producer.rate
            });
        });

        // Add topics
        this.topics.forEach((topic, i) => {
            nodes.push({
                id: `topic-${topic.name}`,
                name: topic.name,
                type: 'topic',
                x: 400,
                y: 50 + i * 80
            });
        });

        // Add consumers
        this.consumers.forEach((consumer, i) => {
            nodes.push({
                id: `consumer-${i}`,
                name: consumer.name,
                type: 'consumer',
                x: 700,
                y: 50 + i * 60
            });
            links.push({
                source: `topic-${consumer.topic}`,
                target: `consumer-${i}`,
                value: 10
            });
        });

        // Create force simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(400, 200));

        // Draw links
        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => Math.sqrt(d.value));

        // Draw nodes
        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', 20)
            .attr('fill', d => {
                switch (d.type) {
                    case 'producer': return '#2563eb';
                    case 'topic': return '#10b981';
                    case 'consumer': return '#f59e0b';
                    default: return '#6b7280';
                }
            })
            .call(d3.drag()
                .on('start', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on('drag', (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on('end', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }));

        // Add labels
        const label = svg.append('g')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .text(d => d.name)
            .attr('font-size', '12px')
            .attr('text-anchor', 'middle')
            .attr('dy', 30);

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            label
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });
    }

    // Data Management
    loadSampleData() {
        // Create sample brokers
        this.brokers = [
            { id: 'broker-1', host: 'localhost:9092', status: 'online' },
            { id: 'broker-2', host: 'localhost:9093', status: 'online' },
            { id: 'broker-3', host: 'localhost:9094', status: 'online' }
        ];

        // Create sample topics
        this.topics = [
            {
                id: uuidv4(),
                name: 'user-events',
                partitions: 3,
                replicationFactor: 2,
                retentionHours: 168,
                messages: 125000,
                size: 52428800,
                created: new Date().toISOString()
            },
            {
                id: uuidv4(),
                name: 'order-events',
                partitions: 6,
                replicationFactor: 3,
                retentionHours: 720,
                messages: 500000,
                size: 209715200,
                created: new Date().toISOString()
            }
        ];

        // Create partitions for topics
        this.topics.forEach(topic => {
            this.createPartitionsForTopic(topic);
        });

        // Create sample producers and consumers
        this.producers = [
            {
                id: uuidv4(),
                name: 'User Event Producer',
                topic: 'user-events',
                rate: 50,
                payloadSize: 1024,
                compression: true,
                status: 'stopped',
                messagesProduced: 0,
                created: new Date().toISOString()
            }
        ];

        this.consumers = [
            {
                id: uuidv4(),
                name: 'User Event Consumer',
                topic: 'user-events',
                group: 'analytics-group',
                processingTime: 50,
                autoCommit: true,
                status: 'stopped',
                messagesConsumed: 0,
                lag: 0,
                created: new Date().toISOString()
            }
        ];

        this.saveData();
    }

    loadSettings() {
        const defaultSettings = {
            theme: 'light',
            bootstrapServers: 'localhost:9092',
            clientId: 'event-streaming-bus',
            connectionTimeout: 10000,
            requestTimeout: 30000,
            acks: '1',
            retries: 3,
            batchSize: 16384,
            lingerMs: 5,
            groupId: 'consumer-group-1',
            autoOffsetReset: 'latest',
            enableAutoCommit: true,
            autoCommitInterval: 5000,
            metricsInterval: 5000,
            retentionDays: 7,
            enableAlerts: false,
            alertThreshold: 80
        };

        try {
            const saved = localStorage.getItem('event-streaming-settings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (e) {
            return defaultSettings;
        }
    }

    saveSettings() {
        localStorage.setItem('event-streaming-settings', JSON.stringify(this.settings));
    }

    saveData() {
        const data = {
            brokers: this.brokers,
            topics: this.topics,
            partitions: this.partitions,
            producers: this.producers,
            consumers: this.consumers,
            metrics: this.metrics
        };
        localStorage.setItem('event-streaming-data', JSON.stringify(data));
    }

    loadData() {
        try {
            const saved = localStorage.getItem('event-streaming-data');
            if (saved) {
                const data = JSON.parse(saved);
                this.brokers = data.brokers || [];
                this.topics = data.topics || [];
                this.partitions = data.partitions || [];
                this.producers = data.producers || [];
                this.consumers = data.consumers || [];
                this.metrics = data.metrics || this.metrics;
            }
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }

    updateUI() {
        this.updateConnectionStatus();
        this.updateMetricsDisplay();
        this.updateProducersDisplay();
        this.updateConsumersDisplay();
        this.updateTopicsDisplay();
        this.updatePartitionsDisplay();
        this.applySettings();
    }

    applySettings() {
        this.applyTheme();

        // Apply settings to form elements
        Object.keys(this.settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings[key];
                } else {
                    element.value = this.settings[key];
                }
            }
        });
    }

    toggleTheme() {
        this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light';
        this.saveSettings();
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        document.getElementById('theme-toggle').textContent = this.settings.theme === 'dark' ? '☀️' : '🌙';
    }

    exportData() {
        const data = {
            settings: this.settings,
            brokers: this.brokers,
            topics: this.topics,
            partitions: this.partitions,
            producers: this.producers,
            consumers: this.consumers,
            metrics: this.metrics,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadBlob(blob, 'event-streaming-data.json');
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showLoading(message = 'Processing...') {
        document.getElementById('loading-text').textContent = message;
        document.getElementById('loading-modal').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loading-modal').classList.remove('active');
    }

    showNotification(message, type = 'success') {
        // Simple notification - could be enhanced
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Additional methods would go here...
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DistributedEventStreamingBus();
});