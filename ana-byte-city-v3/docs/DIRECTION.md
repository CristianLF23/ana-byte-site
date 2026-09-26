# Ana Byte V3 — direção final

Atualizado em 26/09/2026. Esta direção substitui as decisões da primeira passagem da V3.

## Contrato e prioridade

V3 independente, em `ana-byte-city-v3/`. A V1 fornece fotografias, dados e soluções reutilizáveis; não fornece layout. Objetivo: apresentar o trabalho real da Ana e iniciar uma conversa sobre um projeto no WhatsApp.

1. Fotografias, trabalhos e informações reais fornecidos.
2. Mockups aprovados e correções posteriores explícitas do usuário.
3. PDF `Ana_Byte_V3_Guia_Implementacao_Codex.pdf`.
4. Implementação da V3.
5. Decisões das versões anteriores.

Discovery concluída: objetivo, público, oferta, conversão, conteúdo, identidade, destino e critérios de avaliação disponíveis. Não restou bloqueio crítico para a execução.

## Composição

A cidade e a interface formam uma única cena. No desktop, a abertura usa a perspectiva, a placa inclinada, a personagem à direita, o gato no parapeito e a sinalização da imagem enviada pelo usuário. No mobile, a personagem fica acima do título, com signage à esquerda, marca no topo e três linhas de headline.

A instrução posterior **“Quero exatamente esses backgrounds”** selecionou as duas ilustrações fornecidas com Ana. Essa decisão substituiu a proposta anterior de remover a personagem ou colocar uma fotografia sentada sobre a cidade. A ilustração de abertura foi conservada; não foi criada uma nova pessoa. Os elementos de interface rasterizados foram retirados para que textos, links e botões fossem HTML funcional. O gato ambiental foi editado segundo a fotografia posterior: olhos verdes, faixa branca na testa, focinho, peito e patas brancos. O cenário não é apresentado como fotografia documental.

Nas páginas de portfólio, processo e artista, todas as fotografias são os arquivos reais fornecidos. A imagem da Ana tatuando é a fotografia `15-ana-working.jpg`, com enquadramento CSS que retira controles do Instagram existentes no arquivo. Nenhuma fotografia real foi retocada, redesenhada ou substituída.

## Marca e tipografia

Não foi localizado um asset oficial independente da marca nas pastas e materiais consultados. A silhueta do lettering foi isolada do mockup aprovado, em `assets/ui/ana-byte-mark.png`, com transparência. Não é uma reconstrução por fonte nem um arquivo vetorial oficial.

Orbitron variável, peso 700 a 850, é a família ativa de títulos. No letreiro há calibração de largura, tracking, gradiente e quebras: duas linhas desktop e três mobile. A família é uma aproximação tipográfica medida; o lettering da logo é o asset da referência. Corpo e metadados usam sans do sistema.

## Sistema visual

- Preto profundo #05070B; texto #E8F1F4; magenta #FF2996; ciano #62E5ED.
- Rail de 120/128 px em desktop; cabeçalho compacto no tablet e mobile, com composição própria sobre o hero mobile.
- Painéis com contornos técnicos, cantos interrompidos, linhas duplas nos CTAs e brilho localizado.
- Arquivo home: uma obra dominante e três fotos de mesma altura no desktop; grade 2 × 2 no mobile.
- Portfólio: filtros, ordenação, seis miniaturas por página, destaque lateral no desktop, ampliação em modal no mobile.
- Processo: três comparações reais entre desenho e pele, sem inventar etapas ausentes.
- Sobre: fotografia documental, título sobreposto, texto, ambiente secundário e pilares com tatuagens reais.
- Contato: cinco campos, duas colunas desktop e uma no mobile. A pessoa revisa o rascunho no WhatsApp; o site não guarda dados nem envia mensagens sozinho.

## Movimento e desempenho

Rolagem nativa. Sem bloqueio de roda do mouse, cenas por botão ou loader obrigatório. Parallax discreto do conjunto arquitetônico, chuva aleatória em profundidades independentes e revelação das obras por máscara. Camada de primeiro plano preserva a oclusão da personagem e do gato.

A chuva para fora da viewport e quando a aba perde visibilidade. `prefers-reduced-motion` remove chuva, parallax, tilt e scroll animado. O controle de atmosfera permite pausar efeitos. O vídeo de 25 segundos carrega e reproduz apenas por escolha do usuário, com controles nativos, e pausa ao fechar.

## Stack e reuso

HTML, CSS e JavaScript estáticos; GSAP e ScrollTrigger locais. Sem dependências de produção instaladas. `build.mjs` + `sections.mjs` geram as três páginas a partir de `data/catalog.js`. Estilo ativo: `assets/fidelity.css`. O arquivo antigo `assets/v3.css` não é carregado.

Skills aplicadas: discovery do estúdio, free resource router, frontend design, referência visual, imagegen, PDF, GSAP e Web Design Guidelines. O catálogo UI Skills não estava acessível offline. O navegador integrado estava indisponível; a inspeção usou Chromium/Playwright local.

Fontes auxiliares técnicas, sem substituir os mockups como alvo:

- [The Spark, Codrops](https://tympanus.net/codrops/2026/01/09/the-spark-engineering-an-immersive-story-first-web-experience/): relação entre interface, narrativa e ambiente.
- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): movimento por transformações com cleanup responsivo.
- [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines): teclado, foco, formulários e navegação.

## Destino e limites

V3: https://cristianlf23.github.io/ana-byte-site/ana-byte-city-v3/

Nenhuma mudança desta entrega deve incluir arquivos fora de `ana-byte-city-v3/`. O original da V1 continua no endereço raiz. A validação é em Chromium no Windows; não equivale a inspeção em Safari/iPhone físico. Fotos pequenas do acervo preservam a resolução original, sem upscale generativo.
