// Abertura: a logo aparece no centro, sobe até o lugar dela no topo e a tela branca sai
(() => {
  const raiz = document.documentElement;
  const intro = document.querySelector('.intro');
  if (!raiz.classList.contains('intro-ativa') || !intro) return;

  const logoIntro = intro.querySelector('.intro__logo');
  const logoTopo = document.querySelector('.topo__logo img');
  const heroImg = document.querySelector('.hero__fundo');
  const espera = (ms) => new Promise((ok) => setTimeout(ok, ms));
  const carregou = (img) => (img.complete ? Promise.resolve() : new Promise((ok) => {
    img.addEventListener('load', ok, { once: true });
    img.addEventListener('error', ok, { once: true });
  }));
  const curva = 'cubic-bezier(0.7, 0, 0.2, 1)';

  // Segura a logo pelo menos 1,4s e espera a foto do topo carregar (no máximo 3s)
  Promise.all([
    espera(1400),
    Promise.race([Promise.all([carregou(logoIntro), carregou(heroImg)]), espera(3000)]),
  ]).then(() => {
    if (!raiz.classList.contains('intro-ativa')) return; // a segurança já liberou a página

    const ini = logoIntro.getBoundingClientRect();
    const fim = logoTopo.getBoundingClientRect();
    Object.assign(logoIntro.style, {
      left: `${ini.left}px`, top: `${ini.top}px`, width: `${ini.width}px`, translate: 'none',
    });

    const voo = logoIntro.animate(
      [{ transform: 'none' }, { transform: `translate(${fim.left - ini.left}px, ${fim.top - ini.top}px) scale(${fim.width / ini.width})` }],
      { duration: 900, easing: curva, fill: 'forwards' },
    );
    intro.querySelector('.intro__listra').animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' });
    const painel = intro.querySelector('.intro__painel').animate(
      [{ transform: 'none' }, { transform: 'translateY(-100%)' }],
      { duration: 950, delay: 300, easing: curva, fill: 'forwards' },
    );
    setTimeout(() => raiz.classList.add('intro-revelando'), 650);

    Promise.all([voo.finished, painel.finished]).then(() => {
      raiz.classList.remove('intro-ativa', 'intro-revelando');
      intro.remove();
    });
  });
})();

// Horário: destaca o dia de hoje e diz se está aberto agora (hora de Brasília)
(() => {
  const expediente = { 2: [600, 840], 3: [600, 840], 4: [600, 840], 5: [420, 960], 6: [420, 840] }; // minutos do dia
  const nomes = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const hora = (min) => `${Math.floor(min / 60)}h${min % 60 ? String(min % 60).padStart(2, '0') : ''}`;

  const partes = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(new Date()).map((p) => [p.type, p.value]));
  const hoje = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(partes.weekday);
  const agora = Number(partes.hour) * 60 + Number(partes.minute);

  document.querySelectorAll('.horario [data-dias]').forEach((linha) => {
    linha.classList.toggle('hoje', linha.dataset.dias.split(',').map(Number).includes(hoje));
  });

  const status = document.getElementById('horario-agora');
  if (!status || hoje < 0) return;
  const [abre, fecha] = expediente[hoje] || [];
  if (abre !== undefined && agora >= abre && agora < fecha) {
    status.textContent = `Aberto agora · fecha às ${hora(fecha)}`;
    status.classList.add('aberto');
  } else {
    let texto = 'Fechado agora';
    for (let d = 0; d < 7; d++) {
      const dia = (hoje + d) % 7;
      const turno = expediente[dia];
      if (!turno || (d === 0 && agora >= turno[0])) continue;
      const quando = d === 0 ? 'hoje' : d === 1 ? 'amanhã' : nomes[dia];
      texto += ` · abre ${quando} às ${hora(turno[0])}`;
      break;
    }
    status.textContent = texto;
  }
  status.hidden = false;
})();

// Borda no topo depois de rolar
const topo = document.querySelector('.topo');
const marcarRolagem = () => topo.classList.toggle('rolou', window.scrollY > 8);
marcarRolagem();
window.addEventListener('scroll', marcarRolagem, { passive: true });

// Ano no rodapé
document.querySelectorAll('[data-ano]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Botão de agendar fixo: aparece quando o topo sai da tela e some na chamada final
const hero = document.querySelector('.hero');
const cta = document.querySelector('.cta');
const visivel = new Map([[hero, true], [cta, false]]);
const atualizarAgendar = (entradas) => {
  entradas.forEach((e) => visivel.set(e.target, e.isIntersecting));
  document.body.classList.toggle('mostrar-agendar', !visivel.get(hero) && !visivel.get(cta));
};
new IntersectionObserver(atualizarAgendar, { threshold: 0 }).observe(hero);
new IntersectionObserver(atualizarAgendar, { threshold: 0.3 }).observe(cta);

// Contador do carrossel da galeria (celular)
const galeria = document.getElementById('galeria');
const itens = galeria.querySelectorAll('.galeria__item');
const atual = document.getElementById('galeria-atual');
const progresso = document.getElementById('galeria-progresso');

const atualizarGaleria = () => {
  const passo = itens[0].offsetWidth + parseFloat(getComputedStyle(galeria).columnGap || 0);
  const fim = galeria.scrollLeft + galeria.clientWidth >= galeria.scrollWidth - 4;
  const indice = fim ? itens.length - 1 : Math.round(galeria.scrollLeft / passo);
  atual.textContent = indice + 1;
  progresso.style.transform = `scaleX(${(indice + 1) / itens.length})`;
};
galeria.addEventListener('scroll', atualizarGaleria, { passive: true });

// Foto ampliada ao tocar na galeria
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('img');

galeria.addEventListener('click', (e) => {
  const img = e.target.closest('img');
  if (!img) return;
  lightboxImg.src = img.currentSrc || img.src;
  lightboxImg.alt = img.alt;
  lightbox.showModal();
});
lightbox.addEventListener('click', () => lightbox.close());
