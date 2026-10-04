/* =========================================================
   CONFIGURAÇÃO: altere aqui os dados da oficina.
   ========================================================= */
const CONFIG = {
  whatsapp: "5547997521518",          // só números: 55 + DDD + número
  telefone: "554730319177",
  instagram: "diretec_centro_automotivo",
  google: "https://search.google.com/local/reviews?placeid=ChIJnaYCM6Ox3pQRAgDT1E1HHM0", // abre direto as avaliações
  maps: "Diretec Centro Automotivo, Rua Ary Barroso 228, Floresta, Joinville SC",
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

/* ---------- Carrossel de serviços ---------- */
const carrossel = document.getElementById("carrossel");
const passo = () => (carrossel.querySelector(".card")?.offsetWidth || 300) + 18;
document.getElementById("voltar").addEventListener("click", () => carrossel.scrollBy({ left: -passo() }));
document.getElementById("avancar").addEventListener("click", () => carrossel.scrollBy({ left: passo() }));

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
const EXTENSOES = ["jpg", "jpeg", "webp", "png"];
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

// Cartões de serviço: fotos/direcao.jpg, pesada, suspensao, freios, alinhamento, motor, oleo, arrefecimento, scanner, revisao
document.querySelectorAll("[data-foto]").forEach(async (card) => {
  const src = await carregarFoto(card.dataset.foto);
  if (!src) return;
  const topo = card.querySelector(".card-topo");
  const img = new Image();
  img.src = src;
  img.alt = "Serviço de " + card.querySelector("h3").textContent.toLowerCase();
  img.loading = "lazy";
  img.decoding = "async";
  topo.classList.add("com-foto");
  topo.prepend(img);
});

// Galeria: fotos/oficina-1.jpg, oficina-2.jpg ... (até 12). A seção só aparece se houver foto.
(async () => {
  const achadas = (await Promise.all(Array.from({ length: 12 }, (_, i) => carregarFoto(`oficina-${i + 1}`)))).filter(Boolean);
  if (!achadas.length) return;
  const grid = document.getElementById("galeriaGrid");
  achadas.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.alt = "Foto da oficina Diretec em Joinville";
    img.loading = "lazy";
    img.decoding = "async";
    grid.appendChild(img);
  });
  document.getElementById("galeria").hidden = false;
})();

document.getElementById("ano").textContent = new Date().getFullYear();
