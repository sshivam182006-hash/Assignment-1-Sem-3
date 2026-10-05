// Simple browser implementation mimicking Node.js EventEmitter
class EventBus {
    constructor() {
        this.listeners = {};
    }
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
}

const eventBus = new EventBus();
const logOutput = document.getElementById('log-output');

// Helper function to print beautifully to our visual log terminal
function logToScreen(eventTitle, actions = []) {
    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    
    let htmlContent = `⚡ <span class="event-name">Event Emitted: ${eventTitle}</span>`;
    actions.forEach(action => {
        htmlContent += `<span class="action-item">${action}</span>`;
    });
    
    logItem.innerHTML = htmlContent;
    logOutput.appendChild(logItem);
    logOutput.scrollTop = logOutput.scrollHeight; // Auto-scroll to bottom
}

// ==========================================
// EVENT LISTENERS (The Architecture Logic)
// ==========================================

// Chain 1: User Registration
eventBus.on('userRegistered', (user) => {
    logToScreen('userRegistered', [
        `✉️ Action: Sent Welcome Email to ${user.email}`,
        `📊 Action: Created user analytical profile entry`
    ]);
});

// Chain 2: Order Creation
eventBus.on('orderCreated', (order) => {
    logToScreen('orderCreated', [
        `📦 Action: Reserved stock items for order ID: ${order.id}`,
        `💳 Action: Issued digital payment gateway request for $${order.price}`
    ]);

    // Simulating asynchronous processing gateway processing time (1 second)
    setTimeout(() => {
        if (order.shouldSucceed) {
            eventBus.emit('paymentCompleted', { orderId: order.id, amount: order.price });
        } else {
            eventBus.emit('orderCancelled', { orderId: order.id });
        }
    }, 1000);
});

// Chain 3: Payment Completed Success Chain
eventBus.on('paymentCompleted', (payment) => {
    logToScreen('paymentCompleted', [
        `✅ Action: Confirmed order status as "PAID" for ID: ${payment.orderId}`,
        `🧾 Action: Emailed transaction invoice receipt`,
        `🚚 Action: Pushed tracking payload to fulfillment queue`
    ]);
});

// Chain 4: Order Cancelled Failure Chain
eventBus.on('orderCancelled', (cancellation) => {
    logToScreen('orderCancelled', [
        `💰 Action: Issued immediate payment transaction void/refund`,
        `🔄 Action: Restocked inventory reserves for order ID: ${cancellation.orderId}`,
        `❌ Action: Notified customer via email regarding cancellation details`
    ]);
});

// ==========================================
// UI INTERACTION TRIGGERS
// ==========================================

document.getElementById('btn-register').addEventListener('click', () => {
    eventBus.emit('userRegistered', { email: 'student@school.edu' });
});

document.getElementById('btn-order-success').addEventListener('click', () => {
    const randomId = 'ORD-' + Math.floor(Math.random() * 9000 + 1000);
    eventBus.emit('orderCreated', { id: randomId, price: 299, shouldSucceed: true });
});

document.getElementById('btn-order-fail').addEventListener('click', () => {
    const randomId = 'ORD-' + Math.floor(Math.random() * 9000 + 1000);
    eventBus.emit('orderCreated', { id: randomId, price: 45, shouldSucceed: false });
});

document.getElementById('btn-clear').addEventListener('click', () => {
    logOutput.innerHTML = '<div class="system-msg">Logs cleared. System ready...</div>';
});
