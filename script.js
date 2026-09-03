// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Botão Criar uma Vaquinha
document.querySelector('.btn-cta').addEventListener('click', function () {
    alert('Funcionalidade em desenvolvimento!');
});

// Botões Apoiar
document.querySelectorAll('.btn-apoiar').forEach(btn => {
    btn.addEventListener('click', function () {
        const campanha = this.closest('.card-campanha').querySelector('h3').textContent;
        alert(`Você está apoiando: ${campanha}`);
    });
});

// Formulário de Contato
document.querySelector('.form-contato').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    this.reset();
});

// Animação ao fazer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card-campanha, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.5s ease';
    observer.observe(el);
});
