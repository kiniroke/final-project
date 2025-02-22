const API_URL = 'http://localhost:4000/api';
let currentUser = JSON.parse(localStorage.getItem('user'));

const elements = {
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    searchInput: document.getElementById('search-input'),
    consolesList: document.getElementById('consoles-list'),
    rentalsList: document.getElementById('rentals-list')
};

const loaders = {
    show: (container) => {
        const loaderHTML = `
            <div class="loader">
                <div class="spinner"></div>
                <p>Loading next-gen consoles...</p>
            </div>
        `;
        document.querySelector(container).innerHTML = loaderHTML;
    },
    hide: (container) => {
        document.querySelector(container).innerHTML = '';
    }
};

const renderConsole = (console) => `
    <article class="console-card">
        <div class="console-image">
            ${console.image ? `<img src="${console.image}" alt="${console.name}">` : ''}
            <span class="console-tag">${console.brand}</span>
        </div>
        <div class="console-details">
            <h3>${console.name}</h3>
            <div class="console-meta">
                <span class="console-stock ${console.available ? 'in-stock' : 'out-of-stock'}">
                    ${console.available ? 'Available Now' : 'Out of Stock'}
                </span>
                <div class="console-rating">
                    ${Array(5).fill().map((_, i) => `
                        <i class="fas fa-star ${i < console.rating ? 'active' : ''}"></i>
                    `).join('')}
                </div>
            </div>
            <p class="console-price">$${console.pricePerDay}/day</p>
            <button class="btn-rent" 
                data-id="${console._id}" 
                ${!console.available ? 'disabled' : ''}>
                ${console.available ? 'Rent Now' : 'Unavailable'}
            </button>
        </div>
    </article>
`;

const rental = {
    init() {
        document.querySelectorAll('.btn-rent').forEach(button => {
            button.addEventListener('click', (e) => {
                const consoleId = e.target.dataset.id;
                this.showRentalModal(consoleId);
            });
        });
    },

    showRentalModal(consoleId) {
        const console = this.findConsole(consoleId);
        if (!console) return;

        const modal = document.createElement('div');
        modal.className = 'modal rental-modal';
        modal.innerHTML = `
            <h2>Rent ${console.name}</h2>
            <div class="rental-details">
                <div class="rental-period">
                    <label>Rental Period:</label>
                    <select id="rental-days">
                        <option value="1">1 day</option>
                        <option value="3">3 days</option>
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                    </select>
                </div>
                <div class="rental-total">
                    Total: $<span id="rental-price">${console.pricePerDay}</span>
                </div>
            </div>
            <div class="rental-actions">
                <button class="btn btn-outline" id="cancel-rental">Cancel</button>
                <button class="btn btn-primary" id="confirm-rental">Confirm Rental</button>
            </div>
        `;

        document.body.appendChild(modal);
        document.getElementById('overlay').classList.remove('hidden');

        const daysSelect = document.getElementById('rental-days');
        daysSelect.addEventListener('change', () => {
            const total = console.pricePerDay * daysSelect.value;
            document.getElementById('rental-price').textContent = total;
        });

        document.getElementById('cancel-rental').addEventListener('click', () => {
            modal.remove();
            document.getElementById('overlay').classList.add('hidden');
        });

        document.getElementById('confirm-rental').addEventListener('click', () => {
            this.processRental(console, daysSelect.value);
            modal.remove();
            document.getElementById('overlay').classList.add('hidden');
        });
    },

    async processRental(console, days) {
        try {
            const response = await fetch(`${API_URL}/rentals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({
                    consoleId: console._id,
                    days: parseInt(days)
                })
            });

            if (response.ok) {
                showToast('🎮 Console rental confirmed!', 'success');
                loadRentals();
            } else {
                const error = await response.json();
                showToast('⚠️ ' + error.message, 'error');
            }
        } catch (error) {
            showToast('⚠️ Error processing rental', 'error');
        }
    },

    findConsole(id) {
        return consoles.find(c => c._id === id);
    }
};

let searchTimeout;
elements.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        const searchTerm = e.target.value;
        if (searchTerm.length > 2) {
            loaders.show('#consoles-list');
            const response = await fetch(`${API_URL}/consoles?search=${searchTerm}`);
            const results = await response.json();
            elements.consolesList.innerHTML = results.map(renderConsole).join('');
        }
    }, 500);
});

const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
        ${message}
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => toast.remove(), 3000);
};

const auth = {
    init() {
        document.getElementById('show-login').addEventListener('click', () => {
            document.getElementById('login-modal').classList.remove('hidden');
            document.getElementById('overlay').classList.remove('hidden');
        });

        document.getElementById('show-register').addEventListener('click', () => {
            document.getElementById('register-modal').classList.remove('hidden');
            document.getElementById('overlay').classList.remove('hidden');
        });

        document.getElementById('overlay').addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.add('hidden');
            });
            document.getElementById('overlay').classList.add('hidden');
        });

        elements.loginForm.addEventListener('submit', this.handleLogin);
        elements.registerForm.addEventListener('submit', this.handleRegister);
    },

    async handleLogin(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: document.getElementById('login-email').value,
                    password: document.getElementById('login-password').value
                })
            });

            const data = await response.json();
            if (response.ok) {
                currentUser = data;
                localStorage.setItem('user', JSON.stringify(data));
                showToast('🎉 Welcome back!', 'success');
                location.reload();
            } else {
                showToast('⚠️ ' + data.message, 'error');
            }
        } catch (error) {
            showToast('⚠️ Login failed', 'error');
        }
    },

    async handleRegister(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: document.getElementById('register-name').value,
                    email: document.getElementById('register-email').value,
                    password: document.getElementById('register-password').value
                })
            });

            const data = await response.json();
            if (response.ok) {
                showToast('✨ Account created! Please sign in', 'success');
                document.getElementById('show-login').click();
            } else {
                showToast('⚠️ ' + data.message, 'error');
            }
        } catch (error) {
            showToast('⚠️ Registration failed', 'error');
        }
    }
};

// Initialize Auth
auth.init();

// Check Auth State
function checkAuth() {
    const authButtons = document.querySelector('.auth-buttons');
    const rentalsSection = document.querySelector('.rentals-section');
    
    if (currentUser) {
        authButtons.querySelector('#show-login').classList.add('hidden');
        authButtons.querySelector('#show-register').classList.add('hidden');
        authButtons.querySelector('#logout').classList.remove('hidden');
        rentalsSection.classList.remove('hidden');
        loadRentals();
    } else {
        authButtons.querySelector('#show-login').classList.remove('hidden');
        authButtons.querySelector('#show-register').classList.remove('hidden');
        authButtons.querySelector('#logout').classList.add('hidden');
        rentalsSection.classList.add('hidden');
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadConsoles();
    rental.init();
});

// Render Rental History
const renderRental = (rental) => `
    <div class="rental-card ${rental.status}">
        <div class="rental-header">
            <h3>${rental.consoleId.name}</h3>
            <span class="rental-status">${rental.status}</span>
        </div>
        <div class="rental-info">
            <div class="rental-dates">
                <p>Start: ${new Date(rental.createdAt).toLocaleDateString()}</p>
                <p>Days: ${rental.rentalDays}</p>
            </div>
            <div class="rental-price">
                <p>Total: $${rental.totalPrice}</p>
            </div>
        </div>
        ${rental.status === 'active' ? `
            <button class="btn btn-primary" onclick="completeRental('${rental._id}')">
                Return Console
            </button>
        ` : ''}
    </div>
`;

// Load Rentals
async function loadRentals() {
    try {
        const response = await fetch(`${API_URL}/rentals/my-rentals`, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        });
        
        const rentals = await response.json();
        document.getElementById('rentals-list').innerHTML = 
            rentals.map(renderRental).join('') || 
            '<p class="no-rentals">No rentals yet</p>';
            
        document.getElementById('active-rentals').textContent = 
            rentals.filter(r => r.status === 'active').length;
    } catch (error) {
        showToast('⚠️ Error loading rentals', 'error');
    }
}

// Complete Rental
async function completeRental(rentalId) {
    try {
        const response = await fetch(`${API_URL}/rentals/${rentalId}/complete`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        });

        if (response.ok) {
            showToast('✅ Console returned successfully', 'success');
            loadRentals();
            loadConsoles();
        }
    } catch (error) {
        showToast('⚠️ Error returning console', 'error');
    }
}

// Render Game Card
const renderGame = (game) => `
    <div class="game-card">
        <div class="game-image">
            <img src="${game.image}" alt="${game.title}">
            <span class="game-rating">${game.rating}</span>
        </div>
        <div class="game-details">
            <h3>${game.title}</h3>
            <p class="game-genre">${game.genre}</p>
            <p class="game-price">$${game.price}/day</p>
            <button class="btn btn-primary" onclick="addGameToRental('${game._id}')">
                Add to Rental
            </button>
        </div>
    </div>
`;

// Load Games
async function loadGames(consoleId) {
    try {
        const response = await fetch(`${API_URL}/games?console=${consoleId}`);
        const games = await response.json();
        document.getElementById('games-list').innerHTML = 
            games.map(renderGame).join('');
    } catch (error) {
        showToast('⚠️ Error loading games', 'error');
    }
}