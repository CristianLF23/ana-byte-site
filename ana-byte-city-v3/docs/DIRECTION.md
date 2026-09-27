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

- Preto profundo #05070B; texto #E8F1F4; magenta #FF2996; ciano #62E5ED; verde #70FFC5; azul #58ADFF. Magenta conduz a ação principal, ciano/azul o acervo e a artista, verde o processo e os acessos ao WhatsApp.
- Rail de 120/128 px em desktop; cabeçalho compacto no tablet e mobile, com composição própria sobre o hero mobile.
- Painéis com contornos técnicos, cantos interrompidos, linhas duplas nos CTAs e brilho localizado.
- Arquivo home: a página aprovada foi transposta por inteiro para a segunda seção: cabeçalho com a fotografia real da Ana, título em duas linhas, supporting copy, ordenação e galeria. Filtros de Todos, Tatuagens, Processo e Arte digital atualizam as obras no próprio lugar.
- Portfólio único: `#trabalhos` na home. `portfolio/` é somente compatibilidade para endereços antigos, redirecionando à mesma seção com filtros e links de obras preservados. Menu e compartilhamento usam a home.
- Primeira mídia do acervo: vídeo real da Ana tatuando dentro da janela de destaque desktop; no mobile ele vem antes dos filtros e miniaturas. Reproduz em loop contínuo enquanto visível, até a pessoa selecionar uma obra ou filtro. Escolher um filtro no mobile libera a grade na composição do screenshot.
- Processo: três comparações reais entre desenho e pele, sem inventar etapas ausentes.
- Sobre: fotografia real da Ana tatuando, mais um retrato real no estúdio e conteúdo sobre os cinco anos de atuação informados, base em São Paulo, viagens, influências e produção de arte digital. A página dedicada desenvolve esses pontos e conserva os pilares com tatuagens reais.
- Contato: cinco campos, duas colunas desktop e uma no mobile. Tamanho é texto livre em centímetros, incluindo estimativas como “12,5 x 8 cm”. A pessoa revisa o rascunho no WhatsApp; o site não guarda dados nem envia mensagens sozinho.
- Rodapé: usa o mesmo arquivo de lettering do topo nas três páginas, com caminhos relativos corretos.

## Movimento e desempenho

Rolagem nativa. Sem bloqueio de roda do mouse, cenas por botão ou loader obrigatório. Parallax discreto do conjunto arquitetônico e das fotografias dentro de suas janelas; profundidade menor em telas compactas. Chuva aleatória em profundidades independentes. Camada de primeiro plano preserva a oclusão da personagem e do gato. Luzes discretas percorrem os contornos dos painéis visíveis; as fotografias de tatuagens não recebem filtros de cor.

A chuva para fora da viewport e quando a aba perde visibilidade. As luzes dos painéis também pausam fora de vista. `prefers-reduced-motion` remove chuva, parallax, tilt e scroll animado. Os controles de efeitos do menu/rodapé sincronizam pausa de luzes, chuva, parallax e início automático do vídeo.

O vídeo de 25 segundos usa reprodução inline em loop contínuo, sem som inicialmente, quando pelo menos metade do quadro entra na viewport. Por pedido de 27/09, ao terminar volta ao início sem trocar automaticamente por uma fotografia. Pausa fora da tela, em aba oculta ou ao abrir um detalhe. A pausa manual é preservada ao rolar. Em movimento reduzido ou bloqueio de autoplay, permanece o poster real com controles nativos. “Ver em movimento” toca/reinicia o vídeo na própria seção; não abre modal. Falha de vídeo não impede a exploração das obras. Políticas técnicas: [MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) e [WebKit](https://webkit.org/blog/6784/new-video-policies-for-ios/).

Os títulos com degradê conservam sua própria paleta e recebem um deslocamento lento do preenchimento, sem mover as letras. CSS anima apenas as pequenas superfícies de texto; IntersectionObserver pausa as que estão fora da tela. A pausa geral e a visibilidade da aba também interrompem esse efeito. Movimento reduzido mantém os gradientes originais estáticos. O cabeçalho do Arquivo Vivo usa a fotografia real `16-studio.jpg`, antes não exibida na V3, com enquadramento próprio em desktop/mobile.

O topo da primeira dobra apresenta “Studio em São Paulo”: entre a marca e o menu em telas compactas, e como pequena sinalização sobre a cidade em desktop. A barra de progresso fixa no topo usa verde neon, magenta e verde, atualizada pelo scroll nativo. O menu compacto abre/fecha com deslocamento e opacidade suaves, incluindo os links; categorias, ordenação e setas do acervo revelam as obras selecionadas com movimento curto. O parallax da cidade e dos retratos é mais perceptível somente no mobile. Movimento reduzido e pausa de efeitos tornam essas transições imediatas, sem impedir o uso.

Na cidade da primeira dobra, a personagem ilustrada conserva pose, rosto, escala e vestuário principal. Uma mecha platinada visível junto à orelha dialoga com as fotos reais fornecidas, e uma manga preta cobre o braço antes exposto. As variantes mobile e desktop foram compostas sobre seus fundos originais para preservar gato, fachadas, letreiros e chuva. O restante do site mantém as fotos reais, sem retratos ou tatuagens artificiais. Fontes e prompt em [CHARACTER_EDIT.md](CHARACTER_EDIT.md).

## Stack e reuso

HTML, CSS e JavaScript estáticos; GSAP e ScrollTrigger locais. Sem dependências de produção instaladas. `build.mjs`, `sections.mjs` e `archive.mjs` geram início, sobre e redirecionamento legado a partir de `data/catalog.js`. Estilo ativo: `assets/fidelity.css`. CSS/JS recebem revisão por conteúdo na URL para evitar combinação de HTML novo com lógica antiga em cache. O arquivo antigo `assets/v3.css` não é carregado.

Skills aplicadas: discovery do estúdio, free resource router, frontend design, referência visual, imagegen, PDF, GSAP e Web Design Guidelines. O catálogo UI Skills não estava acessível offline. O navegador integrado estava indisponível; a inspeção usou Chromium/Playwright local.

Fontes auxiliares técnicas, sem substituir os mockups como alvo:

- [The Spark, Codrops](https://tympanus.net/codrops/2026/01/09/the-spark-engineering-an-immersive-story-first-web-experience/): relação entre interface, narrativa e ambiente.
- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): movimento por transformações com cleanup responsivo.
- [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines): teclado, foco, formulários e navegação.

## Destino e limites

V3: https://cristianlf23.github.io/ana-byte-site/ana-byte-city-v3/

Nenhuma mudança desta entrega deve incluir arquivos fora de `ana-byte-city-v3/`. O original da V1 continua no endereço raiz. A validação é em Chromium no Windows; não equivale a inspeção em Safari/iPhone físico. Fotos pequenas do acervo preservam a resolução original, sem upscale generativo.
