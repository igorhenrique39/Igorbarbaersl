# Site Igor Barber

Site da barbearia Igor Barber, em Santa Luzia - MG.
No ar em **https://igorbarber.pages.dev** (Cloudflare Pages).

É um site de uma página só, feito em HTML, CSS e JavaScript puros. Não precisa instalar nada pra editar.

## Onde fica cada coisa

| Arquivo | O que tem |
|---|---|
| `index.html` | Todo o texto do site: títulos, serviços, preços, horário, endereço, links |
| `css/style.css` | Cores, fontes, tamanhos e animações |
| `js/main.js` | Abertura com a logo, carrossel de fotos, "aberto agora", botão de agendar |
| `img/` | Fotos e logo usadas no site (versões leves, em JPG) |
| `robots.txt` e `sitemap.xml` | Arquivos que ajudam o Google a encontrar o site |
| `links/` | Página de links da bio do Instagram (WhatsApp, site, Instagram), publicada à parte em **https://igorbarber-links.pages.dev** |

## Mudanças mais comuns

**Preços** — em `index.html`, procure por `R$`. Cada serviço é uma linha assim:

```html
<li><span class="menu__nome">Corte</span><span class="menu__linha"></span><span class="menu__preco">R$ 25</span></li>
```

Troque só o valor. Nos combos, o valor riscado (`<s>...</s>`) é a soma dos serviços avulsos.

**Horário** — mudar em dois lugares:
1. `index.html`, na lista com `class="horario"` (o que aparece na tela).
2. `js/main.js`, na linha `const expediente = {...}` (usado no "Aberto agora"). Os dias vão de 0 (domingo) a 6 (sábado) e os horários são em minutos: 10h = 600, 14h = 840.

**WhatsApp** — o número aparece nos links `https://wa.me/5531975749705`. Se mudar, troque em todos (use "Substituir tudo" no editor).

**Fotos** — coloque a foto nova em `img/` com o mesmo nome da antiga (ex.: `corte-1.jpg`), ou troque o nome no `index.html`. Use JPG com até ~300 KB pra o site continuar rápido.

## Como publicar uma mudança

O site fica no Cloudflare Pages, projeto `igorbarber`, na conta do Igor.

**Automático (jeito normal):** é só salvar a mudança na branch `main` aqui no GitHub — pelo site do GitHub (ícone de lápis → "Commit changes") ou com `git push`. Em cerca de 1 minuto o site no ar é atualizado. Dá pra acompanhar na aba **Actions** (bolinha verde = publicado; vermelha = deu erro, clique pra ver o motivo).

A automação está em `.github/workflows/publicar.yml` e usa o segredo `CLOUDFLARE_API_TOKEN` (Settings → Secrets and variables → Actions).

Se precisar publicar sem o GitHub:

**Pelo painel (sem instalar nada):** dash.cloudflare.com → Workers & Pages → `igorbarber` → **Create deployment** → arraste a pasta do site (só `index.html`, `robots.txt`, `sitemap.xml`, `css`, `js` e `img`).

**Pelo terminal (precisa do Node.js):**

```bash
npx wrangler login
npx wrangler pages deploy . --project-name igorbarber --branch main
```

Pra ver o site no computador antes de publicar, é só abrir o `index.html` no navegador.
