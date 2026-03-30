/**
 * VIDAL ONTIVEROS - MAIN FRONTEND CONTROLLER
 * Uso de IntersectionObserver para optimizar eventos de scroll.
 * Conexión con API Backend preparada.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de módulos
    App.init();
});

const App = {
    init() {
        this.initNavbar();
        this.initMobileMenu();
        this.initScrollReveal();
        this.initActiveLinksObserver();
        this.initContactForm();
        this.setDynamicYear();
    },

    /* NAVBAR: Sombra al hacer scroll */
    initNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        // Usamos un observer en el header en lugar de scroll event para rendimiento
        const hero = document.getElementById('inicio');
        if (!hero) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Si el hero NO es visible (hemos hecho scroll hacia abajo), añadimos clase
                navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting);
            });
        }, { threshold: 0.1, rootMargin: '-80px 0px 0px 0px' }); // Se activa un poco antes

        observer.observe(hero);
    },

    /* MOBILE MENU: Accesibilidad y Toggle */
    initMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const isOpen = toggle.classList.toggle('active');
            menu.classList.toggle('nav-menu--active', isOpen);
            
            // Accesibilidad: Actualiza aria-expanded
            toggle.setAttribute('aria-expanded', isOpen);
            
            // Prevenir scroll del body cuando el menú está abierto
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Cerrar menú al hacer click en un enlace
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('nav-menu--active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    },

    /* SCROLL REVEAL: Animación de secciones al entrar al viewport */
    initScrollReveal() {
        const sections = document.querySelectorAll('.section');
        if (!sections.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target); // Deja de observar una vez revelado
                }
            });
        }, { threshold: 0.15 });

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    },

    /* ACTIVE LINKS: Marcar enlace activo en navegación basado en scroll */
    initActiveLinksObserver() {
        const sections = document.querySelectorAll('section[id], header[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('nav-link--active');
                        // Verifica si el href coincide con el ID de la sección visible
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('nav-link--active');
                        }
                    });
                }
            });
        }, { threshold: 0.5 }); // 50% visible

        sections.forEach(section => observer.observe(section));
    },

    /* CONTACT FORM: Validación y envío asíncrono */
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('button[type="submit"]');
            const btnText = btn.querySelector('.btn-text');
            const statusDiv = document.getElementById('form-status');
            
            // Validación básica Frontend
            const name = form.querySelector('#name').value.trim();
            const email = form.querySelector('#email').value.trim();
            const message = form.querySelector('#message').value.trim();

            if (!name || !email || !message) {
                this.showFormStatus(statusDiv, 'Por favor completa todos los campos.', 'error');
                return;
            }

            // Estado de carga
            btn.disabled = true;
            btn.classList.add('btn--loading');
            btnText.textContent = 'Enviando...';

            try {
                // Llamada al Backend
                // NOTA: Cambiar URL en producción
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await response.json();

                if (response.ok) {
                    this.showFormStatus(statusDiv, 'Mensaje enviado con éxito. ¡Gracias!', 'success');
                    form.reset();
                } else {
                    throw new Error(result.message || 'Error en el servidor');
                }

            } catch (error) {
                console.error('Error:', error);
                this.showFormStatus(statusDiv, 'Hubo un error al enviar. Intenta de nuevo.', 'error');
            } finally {
                btn.disabled = false;
                btn.classList.remove('btn--loading');
                btnText.textContent = 'Enviar mensaje';
            }
        });
    },

    showFormStatus(element, message, type) {
        if (!element) return;
        element.textContent = message;
        element.style.color = type === 'success' ? 'var(--color-success)' : 'var(--color-error)';
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => { element.textContent = ''; }, 5000);
    },

    setDynamicYear() {
        const yearSpan = document.getElementById('year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    }
};