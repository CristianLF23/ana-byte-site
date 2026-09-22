# Evidências da revisão V2

Data: 22/09/2026. Ambiente: Chromium headless local, Playwright, servidor 127.0.0.1:4178. Toque emulado, sem teste em aparelho físico ou Safari. Navegador integrado indisponível nesta execução; não houve validação em produção.

- 25 combinações das cinco rotas em 360, 390, 430, 768 e 1440px: sem overflow horizontal, sem imagem quebrada, um h1 por página, destino WhatsApp preservado.
- Movimento normal em 360×740, 375×667, 390×844, 430×932, 768×1024 e desktop: posição sticky medida em 64px e escala da foto alterada pela rolagem.
- Toque e teclado: capítulos, próximo, swipe horizontal, hotspot, retorno de foco, lightbox, menu e slider aprovados.
- Introdução: Tab contido, Escape, sessão já visitada, imagens abortadas e requisições lentas. Fundo liberado corretamente.
- Luzes: pausa persistida no navegador. Alternância 390 para 1440 e volta limpa os modos de movimento correspondentes sem erros.
- Movimento reduzido: conteúdo no fluxo normal e introdução rápida. Sem JavaScript: obras e texto disponíveis sem overlay.
- 96 referências locais de arquivos verificadas. Sintaxe dos três scripts próprios verificada.
- Fotografias e páginas internas mantidas. Arte dos moodboards não incorporada. Fontes e bibliotecas servidas localmente.

Relatórios: qa/v2-regression-results.json, qa/mobile-experience-results.json, qa/v2-local-links.json. Capturas representativas com prefixo v2 em qa. A pasta de entrega separa o site das evidências.

Limitações: não é certificação WCAG, teste de aparelhos físicos, medição Core Web Vitals ou homologação em produção. Endereço de estúdio demonstrativo e telefone transcrito do material fornecido devem ser confirmados antes da publicação.
