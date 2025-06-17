document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const homeTab = document.getElementById('home-tab');
    const shopTab = document.getElementById('shop-tab');
    const donateTab = document.getElementById('donate-tab');
    const cartTab = document.getElementById('cart-tab');
    const homePage = document.getElementById('home');
    const shopPage = document.getElementById('shop');
    const donatePage = document.getElementById('donate');
    const cartPage = document.getElementById('cart');
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

    // Carrinho de compras
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Inicialização
    updateCartCount();
    renderBooks();
    renderCart();

    // Navegação entre páginas
    homeTab.addEventListener('click', () => switchPage('home'));
    shopTab.addEventListener('click', () => switchPage('shop'));
    donateTab.addEventListener('click', () => switchPage('donate'));
    cartTab.addEventListener('click', () => switchPage('cart'));
    shopBtn.addEventListener('click', () => switchPage('shop'));
    donateBtn.addEventListener('click', () => switchPage('donate'));

    // Pesquisa de livros
    searchBtn.addEventListener('click', searchBooks);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchBooks();
    });

    // Doação de livros
    submitDonation.addEventListener('click', function() {
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const condition = document.getElementById('book-condition').value;
        
        if (!title || !author) {
            showModal('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        showModal('Obrigado!', `Sua doação de "${title}" foi registrada. Entraremos em contato para combinar a coleta.`);
        
        // Limpar formulário
        document.getElementById('book-title').value = '';
        document.getElementById('book-author').value = '';
        document.getElementById('book-condition').value = 'new';
        document.getElementById('book-photo').value = '';
    });

    // Finalizar compra
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showModal('Carrinho Vazio', 'Seu carrinho está vazio. Adicione itens antes de finalizar a compra.');
            return;
        }
        
        showModal('Compra Finalizada', 'Obrigado por sua compra! Seus livros serão enviados em breve.');
        
        // Limpar carrinho
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
        // Desativa todas as páginas e abas
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        
        // Ativa a página e aba selecionada
        document.getElementById(page).classList.add('active');
        document.getElementById(`${page}-tab`).classList.add('active');
        
        // Atualiza o carrinho se for a página do carrinho
        if (page === 'cart') renderCart();
    }

    function renderBooks() {
        booksContainer.innerHTML = '';
        
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            
            bookCard.innerHTML = `
                <div class="book-cover">${book.cover}</div>
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                    <div class="book-price">R$ ${book.price.toFixed(2)}</div>
                    <button class="add-to-cart" data-id="${book.id}">Adicionar ao Carrinho</button>
                </div>
            `;
            
            booksContainer.appendChild(bookCard);
        });
        
        // Adiciona eventos aos botões
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const bookId = parseInt(this.getAttribute('data-id'));
                addToCart(bookId);
            });
        });
    }

    function addToCart(bookId) {
        const book = books.find(b => b.id === bookId);
        
        // Verifica se o livro já está no carrinho
        const existingItem = cart.find(item => item.id === bookId);
        
        if (existingItem) {
            existingItem.quantity += 1;
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
        
        // Atualiza o localStorage e a interface
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showModal('Item Adicionado', `${book.title} foi adicionado ao seu carrinho.`);
    }

    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
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
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            itemElement.innerHTML = `
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
            
            cartItems.appendChild(itemElement);
        });
        
        // Calcula frete (fixo para simplificar)
        const shipping = subtotal > 100 ? 0 : 10;
        const total = subtotal + shipping;
        
        // Atualiza os totais
        subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        shippingElement.textContent = `R$ ${shipping.toFixed(2)}`;
        totalElement.textContent = `R$ ${total.toFixed(2)}`;
        
        // Adiciona eventos aos botões de quantidade
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                updateQuantity(id, -1);
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                updateQuantity(id, 1);
            });
        });
        
        // Adiciona eventos aos botões de remover
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                removeFromCart(id);
            });
        });
    }

    function updateQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        
        if (!item) return;
        
        item.quantity += change;
        
        // Remove o item se a quantidade for zero ou menos
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
        
        // Atualiza o localStorage e a interface
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        
        // Atualiza o localStorage e a interface
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
        
        showModal('Item Removido', 'O item foi removido do seu carrinho.');
    }

    function searchBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (!searchTerm) {
            renderBooks();
            return;
        }
        
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm)
        );
        
        booksContainer.innerHTML = '';
        
        if (filteredBooks.length === 0) {
            booksContainer.innerHTML = '<p class="empty-cart">Nenhum livro encontrado.</p>';
            return;
        }
        
        filteredBooks.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            
            bookCard.innerHTML = `
                <div class="book-cover">${book.cover}</div>
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                    <div class="book-price">R$ ${book.price.toFixed(2)}</div>
                    <button class="add-to-cart" data-id="${book.id}">Adicionar ao Carrinho</button>
                </div>
            `;
            
            booksContainer.appendChild(bookCard);
        });
        
        // Adiciona eventos aos botões
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
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
// No início do script.js (antes do DOMContentLoaded)
const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const registerLink = document.getElementById('register-link');

// Mostrar tela de login ao carregar
window.addEventListener('load', () => {
    loginOverlay.style.display = 'flex';
});

// Fechar login ao enviar formulário
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginOverlay.style.display = 'none';
    // Aqui você pode adicionar lógica de autenticação real
});

// Link para cadastro (exemplo)
registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Cadastro será implementado em breve!');
    // Você pode substituir por um formulário de cadastro
});
// Controle do menu do usuário
const userBtn = document.getElementById('user-btn');
const userDropdown = document.getElementById('user-dropdown');

userBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('active');
});

// Fechar ao clicar fora
document.addEventListener('click', (e) => {
    if (!userDropdown.contains(e.target) && e.target !== userBtn) {
        userDropdown.classList.remove('active');
    }
});