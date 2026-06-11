/**
 * Edukar – Script Principal
 *
 * Módulos:
 *  1. Navegação mobile (menu hambúrguer + acordeão de submenus)
 *  2. Fecho ao clicar fora / tecla Escape
 *  3. Reset ao redimensionar para desktop
 *  4. Animações de revelação ao fazer scroll (Intersection Observer)
 *  5. Pesquisa no Hero (placeholder para integração futura)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     REFERÊNCIAS DOM
     ============================================================ */
  const menuToggle    = document.querySelector('.menu-toggle');
  const mainNav       = document.getElementById('main-navigation');
  const dropdowns     = document.querySelectorAll('.has-dropdown');
  const BREAKPOINT    = 1151; // px — corresponde ao breakpoint do CSS

  /* ============================================================
     1. MENU HAMBURGER (MOBILE)
     ============================================================ */
  function openMenu() {
    mainNav.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    swapIcon(menuToggle, 'bi-list', 'bi-x-lg');
  }

  function closeMenu() {
    mainNav.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    swapIcon(menuToggle, 'bi-x-lg', 'bi-list');
    closeAllDropdowns();
  }

  function toggleMenu() {
    const isOpen = mainNav.classList.contains('active');
    isOpen ? closeMenu() : openMenu();
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  /* ============================================================
     2. ACORDEÃO DE SUBMENUS (MOBILE ONLY)
     ============================================================ */
  function closeAllDropdowns() {
    dropdowns.forEach((d) => {
      d.classList.remove('open');
      d.querySelector('a').setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach((dropdown) => {
    const triggerLink = dropdown.querySelector(':scope > a');

    triggerLink.addEventListener('click', (e) => {
      if (window.innerWidth < BREAKPOINT) {
        e.preventDefault();
        e.stopPropagation();

        const alreadyOpen = dropdown.classList.contains('open');

        // Fecha todos antes de abrir o seleccionado
        closeAllDropdowns();

        if (!alreadyOpen) {
          dropdown.classList.add('open');
          triggerLink.setAttribute('aria-expanded', 'true');
        }
      }
    });
  });

  /* ============================================================
     3. FECHO AO CLICAR FORA OU COM TECLA ESCAPE
     ============================================================ */
  document.addEventListener('click', (e) => {
    if (window.innerWidth >= BREAKPOINT) return;

    const clickedInsideNav    = mainNav && mainNav.contains(e.target);
    const clickedOnToggle     = menuToggle && menuToggle.contains(e.target);

    if (!clickedInsideNav && !clickedOnToggle) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (window.innerWidth < BREAKPOINT) {
        closeMenu();
      } else {
        // Desktop: fecha qualquer dropdown focado
        closeAllDropdowns();
      }
    }
  });

  /* ============================================================
     4. RESET AO AMPLIAR PARA DESKTOP
     ============================================================ */
  let resizeTimer;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= BREAKPOINT) {
        if (mainNav) mainNav.classList.remove('active');
        if (menuToggle) {
          menuToggle.setAttribute('aria-expanded', 'false');
          swapIcon(menuToggle, 'bi-x-lg', 'bi-list');
        }
        closeAllDropdowns();
      }
    }, 100); // debounce de 100ms
  });

  /* ============================================================
     5. ANIMAÇÕES DE REVELAÇÃO AO SCROLL (Intersection Observer)
     ============================================================ */
  const revealElements = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // Observa apenas uma vez
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback para browsers sem suporte: mostra tudo imediatamente
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  /* ============================================================
     6. PESQUISA NO HERO
     ============================================================ */
  const searchInput  = document.getElementById('hero-search');
  const searchButton = document.querySelector('.hero-search-box .btn-primary');

  function handleSearch() {
    if (!searchInput) return;

    const query = searchInput.value.trim();

    if (!query) {
      searchInput.focus();
      return;
    }

    // Redireccionamento para a página de resultados
    const url = `/pesquisa?q=${encodeURIComponent(query)}`;
    window.location.href = url;
  }

  if (searchButton) {
    searchButton.addEventListener('click', handleSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  /* ============================================================
     UTILITÁRIO – trocar ícones Bootstrap Icons
     ============================================================ */
  function swapIcon(button, remove, add) {
    const icon = button.querySelector('i');
    if (!icon) return;
    icon.classList.remove(remove);
    icon.classList.add(add);
  }

});
