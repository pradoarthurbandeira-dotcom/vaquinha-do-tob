// Configurações da API
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('token');
let userLogged = null;
let currentCampanhaId = null;

// =========================
// UTILITY FUNCTIONS
// =========================

const setAuthToken = (token) => {
    authToken = token;
    localStorage.setItem('token', token);
};

const getAuthHeader = () => ({
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
});

const getHeaders = () => ({
    'Content-Type': 'application/json'
});

const showNotification = (message, type = 'info') => {
    const div = document.createElement('div');
    div.className = `notification ${type}`;
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
};

// =========================
// AUTH FUNCTIONS
// =========================

const openAuthModal = () => {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('authTitle').textContent = 'Login';
    document.getElementById('authNome').style.display = 'none';
    document.getElementById('authCPF').style.display = 'none';
    document.getElementById('authPasswordConfirm').style.display = 'none';
};

const closeAuthModal = () => {
    document.getElementById('authModal').style.display = 'none';
};

const toggleAuthForm = (isRegister = false) => {
    if (isRegister) {
        document.getElementById('authTitle').textContent = 'Registre-se';
        document.getElementById('authNome').style.display = 'block';
        document.getElementById('authCPF').style.display = 'block';
        document.getElementById('authPasswordConfirm').style.display = 'block';
        document.getElementById('authToggle').innerHTML = 'Já tem conta? <a href="#">Faça login</a>';
    } else {
        document.getElementById('authTitle').textContent = 'Login';
        document.getElementById('authNome').style.display = 'none';
        document.getElementById('authCPF').style.display = 'none';
        document.getElementById('authPasswordConfirm').style.display = 'none';
        document.getElementById('authToggle').innerHTML = 'Não tem conta? <a href="#">Registre-se</a>';
    }
};

document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const isRegister = document.getElementById('authNome').style.display === 'block';
    const email = document.getElementById('authEmail').value;
    const senha = document.getElementById('authPassword').value;
    
    try {
        if (isRegister) {
            const nome = document.getElementById('authNome').value;
            const cpf = document.getElementById('authCPF').value;
            const senhaConfirm = document.getElementById('authPasswordConfirm').value;
            
            if (senha !== senhaConfirm) {
                showNotification('Senhas não conferem!', 'error');
                return;
            }
            
            const res = await fetch(`${API_URL}/auth/registro`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ nome, email, cpf, senha, senhaConfirm })
            });
            
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error);
            
            setAuthToken(data.token);
            userLogged = data.usuario;
            showNotification('Registrado com sucesso!', 'success');
        } else {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ email, senha })
            });
            
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error);
            
            setAuthToken(data.token);
            userLogged = data.usuario;
            showNotification('Login realizado com sucesso!', 'success');
        }
        
        closeAuthModal();
        updateAuthButton();
        document.getElementById('authForm').reset();
    } catch (err) {
        showNotification(err.message, 'error');
    }
});

const updateAuthButton = () => {
    const btn = document.getElementById('btnAuth');
    if (authToken) {
        btn.textContent = 'Sair';
        btn.onclick = logout;
    } else {
        btn.textContent = 'Login';
        btn.onclick = openAuthModal;
    }
};

const logout = () => {
    localStorage.removeItem('token');
    authToken = null;
    userLogged = null;
    updateAuthButton();
    showNotification('Desconectado com sucesso!', 'success');
};

// =========================
// CAMPANHAS FUNCTIONS
// =========================

const carregarCampanhas = async () => {
    try {
        const res = await fetch(`${API_URL}/campanhas`);
        const campanhas = await res.json();
        
        const grid = document.getElementById('campanhasGrid');
        grid.innerHTML = '';
        
        if (campanhas.length === 0) {
            grid.innerHTML = '<p>Nenhuma campanha disponível</p>';
            return;
        }
        
        campanhas.forEach(campanha => {
            const progresso = (campanha.valorArrecadado / campanha.metaMoney * 100).toFixed(1);
            const card = document.createElement('div');
            card.className = 'card-campanha';
            card.innerHTML = `
                <div class="campanha-imagem" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <img src="${campanha.imagem || 'https://via.placeholder.com/300x200'}" alt="${campanha.titulo}" onerror="this.style.display='none'">
                </div>
                <div class="campanha-info">
                    <h3>${campanha.titulo}</h3>
                    <p>${campanha.descricao.substring(0, 100)}...</p>
                    <div class="progresso">
                        <div class="progresso-bar" style="width: ${progresso}%"></div>
                    </div>
                    <div class="progresso-info">
                        <span>R$ ${campanha.valorArrecadado.toFixed(2)}</span>
                        <span>${progresso}%</span>
                    </div>
                    <button class="btn-apoiar" onclick="abrirCampanha('${campanha._id}')">Ver Mais</button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error('Erro ao carregar campanhas:', err);
    }
};

const abrirCampanha = async (id) => {
    try {
        currentCampanhaId = id;
        const res = await fetch(`${API_URL}/campanhas/${id}`);
        const campanha = await res.json();
        
        const progresso = (campanha.valorArrecadado / campanha.metaMoney * 100).toFixed(1);
        const dataFim = new Date(campanha.dataFim).toLocaleDateString('pt-BR');
        
        const detalhes = document.getElementById('campanhaDetalhes');
        detalhes.innerHTML = `
            <h2>${campanha.titulo}</h2>
            <p><strong>Criador:</strong> ${campanha.criador.nome}</p>
            <p><strong>Categoria:</strong> ${campanha.categoria}</p>
            <p><strong>Descrição:</strong> ${campanha.descricao}</p>
            <p><strong>Meta:</strong> R$ ${campanha.metaMoney.toFixed(2)}</p>
            <p><strong>Arrecadado:</strong> R$ ${campanha.valorArrecadado.toFixed(2)} (${progresso}%)</p>
            <p><strong>Data Fim:</strong> ${dataFim}</p>
            <div class="progresso" style="margin: 10px 0;">
                <div class="progresso-bar" style="width: ${progresso}%"></div>
            </div>
            <button class="btn-cta" onclick="abrirPixModal()">Apoiar com Pix</button>
        `;
        
        document.getElementById('campanhaModal').style.display = 'flex';
    } catch (err) {
        showNotification('Erro ao carregar campanha: ' + err.message, 'error');
    }
};

// =========================
// PIX FUNCTIONS
// =========================

const abrirPixModal = () => {
    if (!authToken) {
        showNotification('Você precisa fazer login para apoiar', 'error');
        openAuthModal();
        return;
    }
    document.getElementById('pixModal').style.display = 'flex';
};

const fecharPixModal = () => {
    document.getElementById('pixModal').style.display = 'none';
    document.getElementById('valorPix').value = '';
    document.getElementById('pixResult').style.display = 'none';
};

document.getElementById('btnGerarPix').addEventListener('click', async () => {
    const valor = parseFloat(document.getElementById('valorPix').value);
    
    if (!valor || valor < 1) {
        showNotification('Digite um valor válido', 'error');
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/pagamentos/pix`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({
                campanhaId: currentCampanhaId,
                valor
            })
        });
        
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        const paymentId = data.pagamento.id;
        localStorage.setItem('currentPaymentId', paymentId);
        
        // Mostrar resultado
        document.getElementById('pixResult').style.display = 'block';
        document.getElementById('pixKey').textContent = data.pagamento.pixKey;
        document.getElementById('pixBanco').textContent = data.pagamento.banco;
        
        showNotification('QR Code gerado! Escaneie para pagar.', 'success');
        
        // Aqui você pode integrar uma biblioteca para gerar QR Code
        // Por exemplo: qrcode.js
    } catch (err) {
        showNotification(err.message, 'error');
    }
});

document.getElementById('btnConfirmarPix').addEventListener('click', async () => {
    try {
        const paymentId = localStorage.getItem('currentPaymentId');
        
        const res = await fetch(`${API_URL}/pagamentos/confirmar/${paymentId}`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        showNotification('Pagamento confirmado com sucesso!', 'success');
        fecharPixModal();
        document.getElementById('campanhaModal').style.display = 'none';
        carregarCampanhas();
    } catch (err) {
        showNotification(err.message, 'error');
    }
});

// =========================
// EVENT LISTENERS
// =========================

document.getElementById('btnAuth').addEventListener('click', openAuthModal);
document.getElementById('closeAuth').addEventListener('click', closeAuthModal);
document.getElementById('closeCampanha').addEventListener('click', () => {
    document.getElementById('campanhaModal').style.display = 'none';
});
document.getElementById('closePix').addEventListener('click', fecharPixModal);

document.getElementById('authToggle').addEventListener('click', (e) => {
    e.preventDefault();
    const isRegister = document.getElementById('authNome').style.display === 'none';
    toggleAuthForm(isRegister);
});

document.getElementById('btnCriarVaquinha').addEventListener('click', () => {
    if (!authToken) {
        showNotification('Você precisa fazer login para criar uma campanha', 'error');
        openAuthModal();
    } else {
        alert('Funcionalidade de criar campanha em desenvolvimento!');
    }
});

document.getElementById('formContato').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    document.getElementById('formContato').reset();
});

// Modal de fundo
window.addEventListener('click', (e) => {
    const authModal = document.getElementById('authModal');
    const campanhaModal = document.getElementById('campanhaModal');
    const pixModal = document.getElementById('pixModal');
    
    if (e.target === authModal) closeAuthModal();
    if (e.target === campanhaModal) campanhaModal.style.display = 'none';
    if (e.target === pixModal) fecharPixModal();
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    updateAuthButton();
    carregarCampanhas();
});