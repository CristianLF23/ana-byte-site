# Ana Byte V3

V3 independente: cidade ilustrada conforme os mockups aprovados, interface funcional, portfólio real e contato por WhatsApp. Não depende dos estilos ou do controlador de cenas da V1.

## Executar

Na pasta `ana-byte-city-v3`:

```sh
node build.mjs
node server.mjs
```

Abrir `http://127.0.0.1:4183/`. Páginas: `/`, `/portfolio/` e `/sobre/`.

## Editar

- `sections.mjs`: conteúdo e composição das seções.
- `build.mjs`: estrutura das páginas, navegação e componentes compartilhados.
- `data/catalog.js`: 19 trabalhos, fotografias e dados reais.
- `assets/fidelity.css`: estilo ativo e breakpoints.
- `assets/v3.js`: galeria, modal, formulário, navegação, chuva e movimento.
- `assets/backgrounds/`: versões desktop/mobile da cena aprovada, com o gato atualizado.
- `assets/ui/ana-byte-mark.png`: lettering extraído da referência.

HTML gerado pelo build. Fontes e bibliotecas locais. Sem serviço de formulário, base de dados ou envio automático: o visitante revisa a mensagem no WhatsApp.

## Verificar

```sh
node qa/check.cjs
node qa/visual-round.cjs round-final
node qa/contact-sheets.cjs round-final
```

QA usa Playwright/Chromium e Sharp do runtime local do Codex no Windows. Ajustar os caminhos no início dos scripts para outro ambiente. `ANA_QA_URL` permite verificar outro endereço. Nenhuma mensagem é enviada: o teste captura localmente o rascunho em vez de abrir o WhatsApp.

Breakpoints: 1920, 1600, 1440, 1280, 1024, 768, 430, 390 e 375 px. Capturas e relatórios temporários não entram na publicação.

Direção/limites: [DIRECTION.md](docs/DIRECTION.md). Auditoria: [FIDELITY_AUDIT.md](docs/FIDELITY_AUDIT.md). Materiais: [ASSET_INVENTORY.md](docs/ASSET_INVENTORY.md).

## Publicar

GitHub Pages serve a pasta a partir de `main`, em `https://cristianlf23.github.io/ana-byte-site/ana-byte-city-v3/`. Versionar somente esta pasta; não incluir alterações pendentes da raiz/V1. Conferir as três páginas e os assets no endereço publicado após o build do Pages.
