# Site Diretec Centro Automotivo

Site da Diretec Centro Automotivo, oficina em Joinville/SC especializada em direção hidráulica, elétrica e assistida, da linha leve à pesada.

O objetivo do site é levar o cliente até o WhatsApp da oficina. Todos os botões de orçamento abrem o WhatsApp com uma mensagem pronta.

Feito em HTML, CSS e JavaScript puros, sem framework e sem instalação.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | Conteúdo e estrutura das seções do site |
| `styles.css` | Cores, fontes, layout e versão para celular |
| `script.js` | Dados de contato, links, carrossel, menu do celular e formulário |
| `logo.jpg` | Logo usada no site |
| `logo diretec.jpg` | Arquivo original da logo (não é usado pelo site) |

## Como abrir

Dê dois cliques no `index.html` para abrir no navegador.

Para testar como num servidor de verdade, rode na pasta do site:

```bash
npx http-server . -p 5173
```

Depois abra `http://localhost:5173`.

## Seções da página

1. **Topo:** título, botão de orçamento, Instagram, Google e a logo em destaque
2. **Sinais de alerta:** sintomas de problema na direção
3. **Como funciona:** 3 passos e os números da oficina (21 anos, garantia, orçamento grátis)
4. **Horários:** quadro com os dias da semana
5. **Serviços:** carrossel com 11 serviços, cada um com botão de orçamento
6. **Linha pesada:** destaque para caminhões e frotas
7. **Depoimentos:** avaliações reais do Google
8. **Dúvidas:** perguntas frequentes
9. **Contato:** endereço, horário, telefones e formulário que abre o WhatsApp

## Como alterar

### Telefone, WhatsApp, Instagram, Google e mapa

Tudo fica no começo do `script.js`, no bloco `CONFIG`:

```js
const CONFIG = {
  whatsapp: "5547997521518",      // só números: 55 + DDD + número
  telefone: "554730319177",
  instagram: "diretec_centro_automotivo",
  google: "https://share.google/N3Iyr68N8iAn45In0",
  maps: "Diretec Centro Automotivo, Rua Ary Barroso 228, Floresta, Joinville SC",
};
```

Os números que aparecem escritos na tela (seção Contato) ficam no `index.html`. Se trocar o número, procure por `99752-1518` e `3031-9177` e troque lá também.

### Mensagem que cada botão manda no WhatsApp

Cada botão tem um atributo `data-wa` no `index.html` com o texto da mensagem. Exemplo:

```html
<a class="btn btn-escuro btn-sm" data-wa="Olá! Gostaria de um orçamento para os freios." href="#contato">Pedir orçamento</a>
```

Para mudar a mensagem, troque o texto dentro de `data-wa`.

### Adicionar um serviço

No `index.html`, dentro de `<div class="carrossel">`, copie um bloco `<article class="card">` inteiro e troque o título, o texto e a mensagem do `data-wa`. Para o serviço aparecer também no formulário, acrescente uma `<option>` no campo `f-servico`.

### Adicionar um depoimento

Na seção `id="depoimentos"`, copie um bloco `<figure class="depo-card">` e troque o texto, a inicial do avatar e o nome. Use só avaliações reais, com o primeiro nome e a inicial do sobrenome, e marque com `[…]` os trechos cortados.

### Cores

As cores ficam no começo do `styles.css`, no bloco `:root`:

| Variável | Cor | Uso |
|---|---|---|
| `--escuro` | `#121212` | Fundo escuro (o mesmo preto do fundo da logo) |
| `--amarelo` | `#F5B20A` | Botões e destaques |
| `--branco` | `#FFFFFF` | Textos no fundo escuro e cartões |
| `--claro` | `#F5F4F0` | Fundo das seções claras |

### Logo

O site usa `logo.jpg`. Para trocar, substitua o arquivo mantendo esse nome. Se o arquivo não existir, aparece o nome "DIRETEC" escrito no lugar.

## Fontes

Bricolage Grotesque nos títulos e Figtree nos textos, carregadas do Google Fonts.

## Publicar

O site é estático, então pode ser publicado em qualquer hospedagem de arquivos (Netlify, Vercel, GitHub Pages). No Netlify, basta arrastar a pasta `SiteDiretec` para a área de deploy. O arquivo `logo diretec.jpg` pode ficar de fora.

## Dados da oficina

- **Endereço:** Rua Ary Barroso, 228, Floresta, Joinville (SC)
- **Horário:** segunda a sexta, das 7h45 às 12h e das 13h30 às 18h
- **WhatsApp:** (47) 99752-1518
- **Telefone:** (47) 3031-9177
- **Instagram:** [@diretec_centro_automotivo](https://www.instagram.com/diretec_centro_automotivo/)
