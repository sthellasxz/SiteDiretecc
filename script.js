/* =========================================================
   CONFIGURAÇÃO: altere aqui os dados da oficina.
   ========================================================= */
const CONFIG = {
  whatsapp: "5547997521518",          // só números: 55 + DDD + número
  telefone: "554730319177",
  instagram: "diretec_centro_automotivo",
  google: "https://search.google.com/local/reviews?placeid=ChIJnaYCM6Ox3pQRAgDT1E1HHM0", // abre direto as avaliações
  maps: "Diretec Centro Automotivo, Rua Ary Barroso 228, Floresta, Joinville SC",
  // Horário de atendimento (segunda = 1 ... sexta = 5), usado no selo "Aberto agora"
  dias: [1, 2, 3, 4, 5],
  turnos: [["07:45", "12:00"], ["13:30", "18:00"]],
};

const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

/* ---------- Links ---------- */
const links = {
  instagram: `https://www.instagram.com/${CONFIG.instagram}/`,
  google: CONFIG.google,
  maps: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.maps),
  tel: `tel:+${CONFIG.telefone}`,
};
document.querySelectorAll("[data-link]").forEach((el) => { el.href = links[el.dataset.link]; });

// Botões com data-wa abrem o WhatsApp com a mensagem já escrita
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.href = waLink(el.dataset.wa);
  el.target = "_blank";
  el.rel = "noopener";
});

/* ---------- Logo: usa logo.jpg se existir na pasta ---------- */
const teste = new Image();
teste.onload = () => {
  document.querySelectorAll("[data-logo]").forEach((img) => { img.hidden = false; });
  document.querySelectorAll("[data-logo-texto]").forEach((t) => { t.hidden = true; });
};
teste.src = "logo.jpg";

/* ---------- Selo "Aberto agora" (horário de Joinville) ---------- */
(function status() {
  const el = document.querySelector("[data-status]");
  if (!el) return;
  const txt = el.querySelector("[data-status-texto]");
  const det = el.querySelector("[data-status-detalhe]");
  // No celular só a primeira parte aparece ("Aberto agora"); no computador aparece tudo
  const mostrar = (principal, detalhe) => { txt.textContent = principal; det.textContent = detalhe ? ` · ${detalhe}` : ""; };
  const min = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const fmt = (hhmm) => { const [h, m] = hhmm.split(":"); return `${Number(h)}h${m === "00" ? "" : m}`; };
  const NOMES = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

  function atualizar() {
    const partes = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const p = Object.fromEntries(partes.map((x) => [x.type, x.value]));
    const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
    const agora = Number(p.hour) * 60 + Number(p.minute);
    const diaUtil = CONFIG.dias.includes(dia);

    if (diaUtil) {
      const turno = CONFIG.turnos.find(([a, f]) => agora >= min(a) && agora < min(f));
      if (turno) {
        el.classList.add("aberto");
        mostrar("Aberto agora", `até ${fmt(turno[1])}`);
        return;
      }
      const proximo = CONFIG.turnos.find(([a]) => agora < min(a));
      if (proximo) {
        el.classList.remove("aberto");
        if (agora >= min(CONFIG.turnos[0][1])) mostrar("Almoço", `volta às ${fmt(proximo[0])}`);
        else mostrar(`Abre hoje às ${fmt(proximo[0])}`);
        return;
      }
    }
    // Fechado: procura o próximo dia útil
    let d = dia, n = 0;
    do { d = (d + 1) % 7; n++; } while (!CONFIG.dias.includes(d) && n < 7);
    el.classList.remove("aberto");
    mostrar("Fechado", `abre ${n === 1 ? "amanhã" : NOMES[d]} ${fmt(CONFIG.turnos[0][0])}`);
  }
  atualizar();
  setInterval(atualizar, 60 * 1000);
})();

/* ---------- Menu no celular ---------- */
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const aberto = nav.classList.toggle("aberto");
  menuBtn.setAttribute("aria-expanded", aberto);
  menuBtn.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
  nav.classList.remove("aberto");
  menuBtn.setAttribute("aria-expanded", "false");
}));

/* ---------- Formulário: abre o WhatsApp com a mensagem pronta ---------- */
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("f-nome").value.trim();
  const veiculo = document.getElementById("f-veiculo").value.trim();
  const servico = document.getElementById("f-servico").value;
  const msg = document.getElementById("f-msg").value.trim();

  let texto = `Olá! Meu nome é ${nome}.`;
  if (veiculo) texto += `\nVeículo: ${veiculo}`;
  if (servico !== "Ainda não sei") texto += `\nServiço: ${servico}`;
  if (msg) texto += `\n${msg}`;

  window.open(waLink(texto), "_blank", "noopener");
});

/* ---------- Fotos: usa as imagens da pasta "fotos" se existirem ---------- */
const EXTENSOES = ["jpg", "jpeg", "webp", "avif", "png"];
function carregarFoto(nome) {
  return new Promise((resolve) => {
    let i = 0;
    (function tentar() {
      if (i >= EXTENSOES.length) return resolve(null);
      const src = `fotos/${nome}.${EXTENSOES[i++]}`;
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = tentar;
      img.src = src;
    })();
  });
}

function colocarFoto(caixa, src, alt, eager) {
  const img = new Image();
  img.src = src;
  img.alt = alt;
  img.decoding = "async";
  if (!eager) img.loading = "lazy";
  caixa.classList.add("com-foto");
  caixa.prepend(img);
  return img;
}

// Foto principal do topo: fotos/hero.jpg
carregarFoto("hero").then((src) => {
  if (!src) return;
  const img = colocarFoto(document.getElementById("heroFoto"), src, "Equipe da Diretec trabalhando na oficina em Joinville", true);
  img.className = "hero-img";
  document.querySelector(".hero-visual").classList.remove("sem-foto");
});

// Fotos dos serviços do carrossel: fotos/servico-direcao.jpg, fotos/servico-freios.jpg ... (nome no data-foto)
document.querySelectorAll("[data-foto]").forEach(async (caixa) => {
  const src = await carregarFoto(caixa.dataset.foto);
  if (src) colocarFoto(caixa, src, caixa.dataset.alt || "");
});

/* ---------- Carrossel de serviços ---------- */
document.querySelectorAll("[data-carrossel]").forEach((carrossel) => {
  const trilho = carrossel.querySelector(".carrossel-trilho");
  const slides = [...trilho.children];
  const pontos = carrossel.querySelector("[data-pontos]");
  const anterior = carrossel.querySelector("[data-anterior]");
  const proximo = carrossel.querySelector("[data-proximo]");
  const semAnimacao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const passo = () => slides[1].offsetLeft - slides[0].offsetLeft;
  const fim = () => trilho.scrollLeft >= trilho.scrollWidth - trilho.clientWidth - 4;
  // Último cartão que ainda pode ficar encostado na esquerda (no computador aparecem 3 por vez, então não é o último da lista)
  const ultimoInicio = () => Math.round((trilho.scrollWidth - trilho.clientWidth) / passo());
  const posicao = () => Math.min(Math.round(trilho.scrollLeft / passo()), ultimoInicio());
  // Ponto aceso: no fim do trilho acende o último, mesmo com 3 cartões na tela
  const atual = () => (fim() ? slides.length - 1 : posicao());
  const irPara = (i) => trilho.scrollTo({ left: Math.max(0, Math.min(i, ultimoInicio())) * passo() });

  // Um ponto por serviço
  const botoes = slides.map((slide, i) => {
    slide.setAttribute("aria-label", `${i + 1} de ${slides.length}`);
    slide.style.setProperty("--i", i);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "carrossel-ponto";
    b.setAttribute("aria-label", `Ver ${slide.querySelector("h3").textContent}`);
    b.addEventListener("click", () => { irPara(i); reiniciar(); });
    pontos.appendChild(b);
    return b;
  });

  function marcar() {
    const i = atual();
    botoes.forEach((b, n) => b.setAttribute("aria-current", n === i ? "true" : "false"));
    anterior.disabled = trilho.scrollLeft <= 4;
    proximo.disabled = fim();
  }
  let espera;
  trilho.addEventListener("scroll", () => { cancelAnimationFrame(espera); espera = requestAnimationFrame(marcar); }, { passive: true });
  window.addEventListener("resize", marcar);
  anterior.addEventListener("click", () => { irPara(posicao() - 1); reiniciar(); });
  proximo.addEventListener("click", () => { irPara(posicao() + 1); reiniciar(); });
  trilho.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); irPara(posicao() + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); irPara(posicao() - 1); }
  });
  marcar();

  if (semAnimacao) return;

  // Entrada animada quando a seção aparece na tela
  carrossel.classList.add("anima");
  const olho = new IntersectionObserver((itens) => {
    if (!itens[0].isIntersecting) return;
    carrossel.classList.add("visivel");
    olho.disconnect();
    // Depois da entrada, tira as classes para o efeito de passar o mouse responder sem atraso
    setTimeout(() => carrossel.classList.remove("anima", "visivel"), slides.length * 90 + 700);
  }, { threshold: 0.2 });
  olho.observe(carrossel);

  // Troca sozinho a cada 5 s; para quando a pessoa está mexendo nele
  let timer, pausado = false, visivel = false;
  const avancar = () => { if (!pausado && visivel && !document.hidden) irPara(fim() ? 0 : posicao() + 1); };
  function reiniciar() { if (semAnimacao) return; clearInterval(timer); timer = setInterval(avancar, 5000); }
  carrossel.addEventListener("mouseenter", () => { pausado = true; });
  carrossel.addEventListener("mouseleave", () => { pausado = false; });
  carrossel.addEventListener("focusin", () => { pausado = true; });
  carrossel.addEventListener("focusout", () => { pausado = false; });
  trilho.addEventListener("touchstart", () => { pausado = true; }, { passive: true });
  trilho.addEventListener("touchend", () => { pausado = false; reiniciar(); }, { passive: true });
  new IntersectionObserver((itens) => { visivel = itens[0].isIntersecting; }, { threshold: 0.4 }).observe(carrossel);
  reiniciar();
});

// Galeria: fotos/oficina-1.jpg, oficina-2.jpg ... (até 12). A seção só aparece se houver foto.
(async () => {
  const achadas = (await Promise.all(Array.from({ length: 12 }, (_, i) => carregarFoto(`oficina-${i + 1}`)))).filter(Boolean);
  if (!achadas.length) return;
  const grid = document.getElementById("galeriaGrid");
  achadas.forEach((src, i) => {
    const img = new Image();
    img.src = src;
    img.alt = `Oficina Diretec em Joinville, foto ${i + 1}`;
    img.loading = "lazy";
    img.decoding = "async";
    grid.appendChild(img);
  });
  document.getElementById("galeria").hidden = false;
})();

document.getElementById("ano").textContent = new Date().getFullYear();
