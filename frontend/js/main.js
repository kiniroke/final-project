// Загрузка продуктов
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:4000/api/consoles');
        const products = await response.json();
        
        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.pricePerDay}/day</p>
                    <button onclick="addToCart('${product._id}')" class="add-to-cart">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Корзина
let cart = [];

function addToCart(productId) {
    // Добавление в корзину
}

// Модальные окна
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Обработчики событий
    document.querySelector('.cart-btn').addEventListener('click', () => showModal('cartModal'));
    document.querySelector('.profile-btn').addEventListener('click', () => showModal('profileModal'));
}); 