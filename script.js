document.addEventListener('DOMContentLoaded', function () {
    // Elementos da interface
    const homeTab = document.getElementById('home-tab');
    const shopTab = document.getElementById('shop-tab');
    const donateTab = document.getElementById('donate-tab');
    const cartTab = document.getElementById('cart-tab');
    const donatedBooksTab = document.getElementById('donated-tab');

    const homePage = document.getElementById('home');
    const shopPage = document.getElementById('shop');
    const donatePage = document.getElementById('donate');
    const cartPage = document.getElementById('cart');
    const donatedBooksPage = document.getElementById('donated-books');

    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const shopBtn = document.getElementById('shop-btn');
    const donateBtn = document.getElementById('donate-btn');
    const submitDonation = document.getElementById('submit-donation');

    const booksContainer = document.getElementById('books-container');
    const donatedContainer = document.getElementById('donated-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    const confirmationModal = document.getElementById('confirmation-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalOk = document.getElementById('modal-ok');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');

    // Dados dos livros
    const books = [
        { id: 1, title: 'O Pequeno Príncipe', author: 'Antoine de Saint-Exupéry', price: 29.90, cover: '📘' },
        { id: 2, title: 'Dom Casmurro', author: 'Machado de Assis', price: 24.50, cover: '📕' },
        { id: 3, title: '1984', author: 'George Orwell', price: 39.90, cover: '📗' },
        { id: 4, title: 'A Moreninha', author: 'Joaquim Manuel de Macedo', price: 19.90, cover: '📙' },
        { id: 5, title: 'O Alquimista', author: 'Paulo Coelho', price: 34.90, cover: '📓' },
        { id: 6, title: 'Cem Anos de Solidão', author: 'Gabriel García Márquez', price: 49.90, cover: '📔' },
        { id: 7, title: 'Harry Potter e a Pedra Filosofal', author: 'J.K. Rowling', price: 44.90, cover: '📒' },
        { id: 8, title: 'Orgulho e Preconceito', author: 'Jane Austen', price: 32.50, cover: '📚' }
    ];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let donatedBooks = JSON.parse(localStorage.getItem('donatedBooks')) || [];

    updateCartCount();
    renderBooks();
    renderCart();
    renderDonatedBooks();

    // Navegação
    homeTab.addEventListener('click', () => switchPage('home'));
    shopTab.addEventListener('click', () => switchPage('shop'));
    donateTab.addEventListener('click', () => switchPage('donate'));
    cartTab.addEventListener('click', () => switchPage('cart'));
    donatedBooksTab.addEventListener('click', () => switchPage('donated-books'));
    shopBtn.addEventListener('click', () => switchPage('shop'));
    donateBtn.addEventListener('click', () => switchPage('donate'));

    // Pesquisa
    searchBtn.addEventListener('click', searchBooks);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') searchBooks();
    });

    // Doação
    submitDonation.addEventListener('click', function () {
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const condition = document.getElementById('book-condition').value;
        const photoInput = document.getElementById('book-photo');
        const file = photoInput.files[0];
    
        if (!title || !author) {
            showModal('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }
    
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageUrl = e.target.result;
    
                const donatedBook = {
                    id: Date.now(),
                    title,
                    author,
                    condition,
                    price: 9.90,
                    cover: imageUrl // salva a imagem
                };
    
                donatedBooks.push(donatedBook);
                localStorage.setItem('donatedBooks', JSON.stringify(donatedBooks));
                renderDonatedBooks();
    
                showModal('Obrigado!', `Sua doação de "${title}" foi registrada com sucesso.`);
    
                document.getElementById('book-title').value = '';
                document.getElementById('book-author').value = '';
                document.getElementById('book-condition').value = 'new';
                photoInput.value = '';
            };
            reader.readAsDataURL(file);
        } else {
            showModal('Erro', 'Adicione uma imagem para o livro.');
        }
    });
    


    // Finalizar Compra
    checkoutBtn.addEventListener('click', function () {
        if (cart.length === 0) {
            showModal('Carrinho Vazio', 'Seu carrinho está vazio.');
            return;
        }

        showModal('Compra Finalizada', 'Obrigado pela compra!');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    });

    // Modal
    closeModal.addEventListener('click', () => confirmationModal.style.display = 'none');
    modalOk.addEventListener('click', () => confirmationModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === confirmationModal) confirmationModal.style.display = 'none';
    });

    // Funções
    function switchPage(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));

        document.getElementById(page).classList.add('active');
        document.getElementById(`${page}-tab`).classList.add('active');

        if (page === 'cart') renderCart();
        if (page === 'donated-books') renderDonatedBooks();
    }

    function renderBooks() {
        booksContainer.innerHTML = '';
        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <div class="book-cover">
                    <img src="${book.cover}" alt="${book.title}">
                </div>
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                    <div class="book-price">R$ ${book.price.toFixed(2)}</div>
                    <button class="add-to-cart" data-id="${book.id}">Adicionar ao Carrinho</button>
                </div>
            `;
            booksContainer.appendChild(card);
        });
    
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function () {
                const bookId = parseInt(this.getAttribute('data-id'));
                addToCart(bookId);
            });
        });
    }
    

    function renderDonatedBooks() {
        donatedContainer.innerHTML = '';
        if (donatedBooks.length === 0) {
            donatedContainer.innerHTML = '<p class="empty-cart">Nenhum livro doado disponível.</p>';
            return;
        }

        donatedBooks.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card donated';
            card.innerHTML = `
                <div class="book-cover">
                    <img src="${book.cover}" alt="${book.title}" />
                </div>

                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                    <div class="book-price">R$ ${book.price.toFixed(2)}</div>
                    <button class="add-to-cart" data-id="${book.id}" data-donated="true">Adicionar ao Carrinho</button>
                </div>
            `;
            donatedContainer.appendChild(card);
        });

        document.querySelectorAll('[data-donated="true"]').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = parseInt(this.getAttribute('data-id'));
                const book = donatedBooks.find(b => b.id === id);
                addToCart(book, true);
            });
        });
    }

    function addToCart(bookOrId, isDonated = false) {
        const book = typeof bookOrId === 'object' ? bookOrId : books.find(b => b.id === bookOrId);
        const existing = cart.find(item => item.id === book.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: book.id,
                title: book.title,
                author: book.author,
                price: book.price,
                cover: book.cover,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showModal('Item Adicionado', `${book.title} foi adicionado ao carrinho.`);
    }

    function updateCartCount() {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = total;
    }

    function renderCart() {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
            subtotalElement.textContent = 'R$ 0,00';
            shippingElement.textContent = 'R$ 0,00';
            totalElement.textContent = 'R$ 0,00';
            return;
        }

        cartItems.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <div class="cart-item-cover">${item.cover}</div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="decrease-quantity" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">Remover</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(el);
        });

        const shipping = subtotal > 100 ? 0 : 10;
        const total = subtotal + shipping;

        subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        shippingElement.textContent = `R$ ${shipping.toFixed(2)}`;
        totalElement.textContent = `R$ ${total.toFixed(2)}`;

        document.querySelectorAll('.decrease-quantity').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), -1));
        });
        document.querySelectorAll('.increase-quantity').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), 1));
        });
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
        });
    }

    function updateQuantity(id, change) {
        const item = cart.find(i => i.id === id);
        if (!item) return;

        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(i => i.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
        showModal('Item Removido', 'O item foi removido do seu carrinho.');
    }

    function searchBooks() {
        const term = searchInput.value.toLowerCase();
        const filtered = books.filter(b =>
            b.title.toLowerCase().includes(term) ||
            b.author.toLowerCase().includes(term)
        );

        booksContainer.innerHTML = '';
        if (filtered.length === 0) {
            booksContainer.innerHTML = '<p class="empty-cart">Nenhum livro encontrado.</p>';
            return;
        }

        filtered.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <div class="book-cover">${book.cover}</div>
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                    <div class="book-price">R$ ${book.price.toFixed(2)}</div>
                    <button class="add-to-cart" data-id="${book.id}">Adicionar ao Carrinho</button>
                </div>
            `;
            booksContainer.appendChild(card);
        });

        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function () {
                const bookId = parseInt(this.getAttribute('data-id'));
                addToCart(bookId);
            });
        });
    }

    function showModal(title, message) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        confirmationModal.style.display = 'flex';
    }
});

// Login
const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const registerLink = document.getElementById('register-link');

window.addEventListener('load', () => {
    loginOverlay.style.display = 'flex';
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginOverlay.style.display = 'none';
});

registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Cadastro será implementado em breve!');
});

// Menu Usuário
const userBtn = document.getElementById('user-btn');
const userDropdown = document.getElementById('user-dropdown');

userBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!userDropdown.contains(e.target) && e.target !== userBtn) {
        userDropdown.classList.remove('active');
    }
});
