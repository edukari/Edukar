document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNavigation = document.getElementById('main-navigation');
    const dropdowns = document.querySelectorAll('.has-dropdown');

    // 1. ABRIR/FECHAR MENU PRINCIPAL (MOBILE)
    if (menuToggle && mainNavigation) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNavigation.classList.toggle('active');
            
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('bi-list');
                icon.classList.toggle('bi-x-lg');
            }
        });
    }

    // 2. LÓGICA EXCLUSIVA DE ACORDEÃO (MOBILE) - Apenas um aberto por vez!
    dropdowns.forEach(dropdown => {
        const triggerLink = dropdown.querySelector('a');

        triggerLink.addEventListener('click', (e) => {
            // Actua apenas em modo mobile/tablet (<= 1150px)
            if (window.innerWidth <= 1150) {
                e.preventDefault(); 
                e.stopPropagation();

                // Verifica se o menu que acabámos de clicar JÁ estava aberto
                const isCurrentlyOpen = dropdown.classList.contains('open');

                // PASSO CRÍTICO: Fecha TODOS os dropdowns primeiro
                dropdowns.forEach(d => {
                    d.classList.remove('open');
                    d.querySelector('a').setAttribute('aria-expanded', 'false');
                });

                // Se o menu clicado NÃO estava aberto, abre-o agora
                // (Se já estava aberto, o passo anterior fechou-o e ele fica fechado)
                if (!isCurrentlyOpen) {
                    dropdown.classList.add('open');
                    triggerLink.setAttribute('aria-expanded', 'true');
                }
            }
        });
    });

    // 3. FECHAR TUDO AO CLICAR FORA DA NAVEGAÇÃO
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1150) {
            if (mainNavigation && !mainNavigation.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNavigation.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('bi-list');
                    icon.classList.remove('bi-x-lg');
                }

                dropdowns.forEach(d => {
                    d.classList.remove('open');
                    d.querySelector('a').setAttribute('aria-expanded', 'false');
                });
            }
        }
    });

    // 4. RESET GERAL AO AMPLIAR O ECRÃ PARA DESKTOP
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1150) {
            if (mainNavigation) mainNavigation.classList.remove('active');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('bi-list');
                    icon.classList.remove('bi-x-lg');
                }
            }
            dropdowns.forEach(d => {
                d.classList.remove('open');
                d.querySelector('a').setAttribute('aria-expanded', 'false');
            });
        }
    });
    
        // ==========================================
    // 5. ANIMATIONS ON SCROLL (INTERSECTION OBSERVER)
    // ==========================================
    
    // Seleciona todos os elementos com a classe .reveal-up
    const revealElements = document.querySelectorAll('.reveal-up');

    // Configuração do observador
    const revealOptions = {
        threshold: 0.15, // Dispara quando 15% do elemento estiver visível
        rootMargin: "0px 0px -50px 0px" // Dispara um pouco antes do fundo do ecrã
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                // Adiciona a classe que acciona o CSS transform/opacity
                entry.target.classList.add('is-visible');
                // Deixa de observar depois de animar uma vez para performance
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Inicia a observação de cada elemento
    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

});
