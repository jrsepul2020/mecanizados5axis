const header = document.querySelector('[data-header]');
const hero = document.querySelector('.hero');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) document.documentElement.classList.add('motion-ready');

if (header && hero) {
  const headerObserver = new IntersectionObserver(
    ([entry]) => header.classList.toggle('scrolled', !entry.isIntersecting),
    { threshold: 0.12 }
  );
  headerObserver.observe(hero);
}

if (menuButton && menu) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  menuButton.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menu.classList.toggle('open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}

const revealItems = document.querySelectorAll('.reveal');

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -6% 0px' }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.querySelector('[data-contact-form]');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const status = contactForm.querySelector('[data-form-status]');
    const data = new FormData(contactForm);
    const name = data.get('nombre').trim();
    const company = data.get('empresa').trim();
    const email = data.get('email').trim();
    const phone = data.get('telefono').trim();
    const message = data.get('mensaje').trim();
    const subject = `Consulta web de ${name}${company ? ` - ${company}` : ''}`;
    const body = [
      `Nombre: ${name}`,
      `Empresa: ${company || 'No indicada'}`,
      `Correo: ${email}`,
      `Teléfono: ${phone || 'No indicado'}`,
      '',
      'Proyecto:',
      message,
    ].join('\n');

    submitButton.disabled = true;
    submitButton.textContent = 'Preparando correo...';
    status.textContent = 'Su consulta está lista para enviarse desde su programa de correo.';
    window.location.href = `mailto:oficina@mecanizado5axis.es?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar consulta';
    }, 900);
  });
}
