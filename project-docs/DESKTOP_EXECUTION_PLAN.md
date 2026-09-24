# Ana Byte V1 — plano de execução desktop

Data: 23/09/2026. Estado: implementação desktop concluída localmente; QA e publicação registrados abaixo.
Este documento preserva o plano original e registra ao fim o que foi efetivamente implementado.
Base inspecionada: commit `93c991644c3721d7b696941a1d4cc5c6db5be545`.
Projeto: `C:\Users\crist.PC\OneDrive\Documentos\ChatGPT\Criação de sites High-End\ana-byte-site`.
Produção: https://cristianlf23.github.io/ana-byte-site/

## 1. Briefing e gate

- CONFIRMED: redesenhar a apresentação desktop da V1 com a identidade mobile já aprovada.
- CONFIRMED: produzir backgrounds próprios para telas largas, com resolução e composição adequadas.
- HISTÓRICO: o turno anterior entregou apenas o plano. O usuário autorizou sua execução neste turno, com o mobile aprovado intocado.
- CONFIRMED: portfólio e conversão para o WhatsApp existente; fotos reais, vídeo do portfólio, conteúdo e três idiomas já disponíveis.
- RECOMMENDATION: rolagem vertical nativa no desktop, com deslocamentos de câmera vinculados à posição da página.
- RECOMMENDATION: preservar a experiência compacta por botões no mobile. Usar a mesma URL responsiva; a V2 é outro projeto e está fora deste escopo.
- Gate de planejamento aprovado: nenhuma lacuna crítica de negócio, conteúdo ou escopo. A rolagem desktop e os enquadramentos abaixo são a direção recomendada, não um novo comportamento já publicado.

## 2. Diagnóstico verificado

Capturas locais em 1440 × 900: `qa/desktop-plan-city.png`, `qa/desktop-plan-works.png`, `qa/desktop-plan-artist.png`, `qa/desktop-plan-contact.png`.

Os outdoors atuais são faixas verticais sobre o cenário da primeira dobra. No desktop, ficam evidentes as bordas da composição, diferenças de iluminação e perspectivas desconectadas. A tipografia e os controles internos continuam dimensionados como mobile. O espaço lateral amplia o fundo, mas não amplia a experiência editorial.

Fontes atuais medidas:

| Asset | Resolução |
|---|---:|
| city-flight-poster.jpg | 720 × 1280 |
| gallery-facade-tuxedo.jpg | 887 × 1774 |
| atelier-facade.jpg | 887 × 1774 |
| ana-neon-tuxedo.jpg | 941 × 1672 |

O vídeo de transição é vertical. Ampliar esses materiais com `cover` para preencher um monitor produz cortes fortes e não cria detalhe real. A correção precisa começar pela direção de arte das cenas.

## 3. Referências e transformação original

1. [The Spark](https://tympanus.net/codrops/2026/01/09/the-spark-engineering-an-immersive-story-first-web-experience/): o estudo do criador descreve projeção de arte para profundidade, progressão DOM compartilhada e cenas ativadas por trecho. Transferir hierarquia espacial, progressão única e economia de renderização. Não importar seu motor ou sua arte.
2. [They Call Me Giulio](https://tympanus.net/codrops/2026/04/14/they-call-me-giulio-the-making-of-a-cinematic-cyberpunk-portfolio/): estudo de quatro cenas cinematográficas cyberpunk e integração entre conteúdo e cenário. Transferir coerência de luz e sensação de presença. Não reproduzir personagens, veículos, trilha ou composição distintiva.
3. [ERA Residence](https://www.era-residence.com/): sequência de capítulos, imagens amplas e conteúdo editorial. Transferir alternância entre contemplação e informação, sem importar estética imobiliária.
4. OriginKit Neon Border: referência anterior de componentes. A consulta atual do endereço falhou na ferramenta web; manter os contornos duplos já implementados, sem alegar nova inspeção do componente.

Foram consultados os artigos e suas imagens de apresentação; isso não equivale a uma auditoria completa dos motores das referências. Capturas de apoio em `qa/desktop-reference-spark.png` e `qa/desktop-reference-giulio.png`.

Recursos avaliados: CSS/SVG/Canvas, GSAP local, Motion, Three.js/WebGL/Blender, catálogos React Magic UI/Cult/21st e geradores gráficos. Escolha: HTML/CSS/JS + GSAP/ScrollTrigger já existentes, Canvas para chuva e arte raster original em camadas. Catálogos React não se encaixam na stack; Motion duplicaria GSAP; 3D não se justifica para este percurso limitado; Haikei não atende à arte figurativa da cidade. Sem dependência nova ou serviço pago previsto. Skills selecionadas: reference-first-design e gsap-scrolltrigger, após free-design-resource-router e consulta ao catálogo ui-skills-root.

## 4. Direção recomendada: uma cidade panorâmica habitável

Preservar ciano, magenta, pretos azulados, tipografia angular, chuva aleatória, materiais molhados, tubulações, letreiros アナ, coração mecânico e gato frajola. A cidade ocupa o monitor inteiro; a distância entre prédios, oclusões e diferenças de movimento sugerem profundidade.

Cada vista deve mostrar uma parte reconhecível do mesmo quarteirão. Fixar um mapa simples: abertura no alto, arquivo em uma fachada abaixo, ateliê à direita, letreiro final no topo do prédio. Um edifício identificável e a mesma orientação de luz conectam as cenas. As transições serão uma aproximação ilustrada em camadas, não uma promessa de câmera 3D livre.

## 5. Storyboard dos quatro capítulos

### 01 — Cidade

- Panorama elevado e profundo, com laterais ricas em arquitetura e um corredor visual central reservado ao nome ANA BYTE.
- Manter título, barra ciano, subtítulo e “como lágrimas na chuva”. Pequena marca do cabeçalho e WhatsApp permanecem ocultos.
- Após o loading e Começar experiência, liberar scroll. No desktop, adaptar o convite para “Explore meu mundo”, com indicação discreta “Role para explorar”. Clique no convite leva ao mesmo trecho de Obras.
- Primeiro deslocamento: descer entre os prédios e se aproximar do painel de trabalhos. Elementos próximos deslocam-se mais que os distantes.

### 02 — Arquivo vivo

- Fachada e moldura próprias para enquadramento horizontal; painel físico amplo, aproximadamente 65–72% da largura útil em 1440 × 900, ajustado à altura disponível.
- Não ampliar o vídeo vertical até preencher um telão horizontal. A solução é um painel arquitetônico composto: visor vertical principal para vídeo/foto e área lateral do mesmo outdoor com nome da obra, categoria e seleção visual do acervo. Ambos unidos pela mesma moldura e suportes.
- Primeira mídia é o vídeo original de Ana trabalhando. Ao terminar, entram as fotos. Autoplay bloqueado oferece reprodução manual; falha libera as obras. Nenhuma foto fixa da artista substitui essa sequência.
- Fotografias preservam proporção e composição; abrir a ampliação disponibiliza a imagem completa. Qualquer área lateral é editorial e intencional, nunca faixa preta ou cópia borrada da mídia.
- Gato frajola visível acima ou na lateral superior da estrutura, sem competição com o cabeçalho.
- Marca e WhatsApp aparecem ao estabelecer a cena Obras. Permanecem nas cenas seguintes.
- Conteúdo do portfólio não fica preso à rolagem vertical: trocar obras por clique/arraste/miniaturas. O scroll continua sendo a navegação da cidade.
- Segundo deslocamento: recuar um pouco e deslocar a perspectiva para a fachada à direita.

### 03 — A Ana

- Outdoor amplo com a foto real de Ana tatuando em aproximadamente 55–60% da área de conteúdo; título, breve apresentação e Conheça a Ana na área restante.
- Compartilhar materiais e espessuras de moldura com o arquivo, preservando coração e letreiro como ornamentos arquitetônicos próprios.
- Texto legível em notebook, sem repetir CTAs já removidos pelo usuário.
- Terceiro deslocamento: recuar e subir até o letreiro final do prédio.

### 04 — Sua ideia

- Panorama final com letreiro アナ grande, gato frajola e cidade chuvosa. Centro visual reservado para “Vamos iniciar seu projeto?”.
- CTA abre Comece pela ideia como camada complementar translúcida, com orientações e formulário já existentes. Retorno restaura exatamente o capítulo e a posição de scroll.
- A rolagem termina aqui, sem ciclo infinito. No desktop não haverá as setas laterais de avançar/voltar entre capítulos; teclado e scroll permitem retorno.

## 6. Plano dos assets desktop

Produzir primeiro um storyboard estático de quatro quadros em 1440 × 900. Revisar coerência visual antes de conectar motion. Essa revisão pode ser feita pelo agente com evidência visual; não cria uma nova exigência de aprovação do usuário.

Quatro cenas autorais: `city`, `works`, `artist`, `contact`. Reutilizar os assets aprovados como referência visual em edição/outpainting, preservando identidade das molduras e do gato. Recompor laterais, perspectiva e textura com coerência. Não deformar o painel vertical inteiro por escala horizontal.

- Master desejado: 3840 × 2160 por cena; usar essa resolução apenas se houver detalhe real na fonte. Quando a ferramenta gerar menor, registrar a resolução nativa e ampliar com revisão de detalhe, sem tratar interpolação como recuperação de detalhe.
- Entregas web por cena: variantes 1600, 2560 e 3840 px em AVIF/WebP, fallback compatível. DPR e largura definem a variante, não download universal de 4K.
- Área central segura para 16:10; extensões laterais de cenário para 21:9. Painéis, rosto, gato e CTAs não podem depender de áreas sujeitas a corte.
- Separar 3–5 planos úteis: skyline, fachadas intermediárias, estrutura do painel, poucos elementos próximos e atmosfera. Recortes precisam ser limpos; plano de fundo deve conter preenchimento real atrás deles para evitar buracos no movimento.
- Visor do outdoor quase frontal na chegada, com cantos e coordenadas documentados. Montar HTML no mesmo grupo de transformação da moldura. Fotos, vídeo, textos e botões são conteúdo real do DOM, nunca texto ou tatuagens gerados dentro da arte.
- Neon ambiental alinhado às fontes luminosas da imagem; chuva em profundidades diferentes com velocidades e opacidades variadas. Não cobrir fotografias com efeitos que prejudiquem a avaliação da tatuagem.
- Meta inicial de transferência: abertura até cerca de 2 MB de arte; cenas seguintes carregadas progressivamente. Valor é orçamento de projeto a medir, não resultado garantido.

O vídeo vertical atual continua no mobile. A transição desktop recomendada é feita com as camadas panorâmicas e acompanha o scroll nos dois sentidos. Não esticar o MP4 vertical, não simular scrub preciso com seeks aleatórios nele e não depender de Google Flow para concluir esta versão. Um vídeo horizontal futuro só entra como melhoria opcional se tiver enquadramentos compatíveis e fallback.

## 7. Arquitetura da navegação e motion

- Ativar desktop inicialmente em `(min-width: 1024px) and (min-aspect-ratio: 6/5)`. Testar 1024 × 768; janelas estreitas e tablets em retrato usam a composição compacta. Usar capacidade/layout, não identificação de navegador.
- Scroll do documento nativo, com barra acessível e suporte a roda, trackpad, PageDown, Space, Home e End. Sem listener de wheel cancelando o gesto, sem snap obrigatório e sem bloquear o visitante para concluir uma animação.
- Um palco fixado durante o percurso, timeline GSAP/ScrollTrigger com faixas de movimento e faixas estáveis de leitura. Ponto de partida: percurso total de 600–700vh, ajustado por testes; Obras recebe a maior faixa estável.
- Animar os filhos do palco, não o elemento fixado. Atualizações por transform/opacity; grandes filtros de blur e glow não devem ser recalculados a cada frame.
- Progresso de scroll é a única fonte para a câmera desktop. Criar separação clara entre estado da cena, driver mobile por botões e driver desktop por scroll. Não deixar `AnaFlight.go()` temporal disputar propriedades com o ScrollTrigger.
- Reusar a lógica de mídia/galeria, locale, formulários e aberturas internas. `activateScene` deve ser chamada somente quando a cena dominante muda, evitando reset de vídeo, retraduções ou alterações de foco a cada pixel.
- Rolagem não transfere foco automaticamente. Conteúdo fora da cena deve ter estados de interação coerentes; modais continuam com foco contido e retorno ao acionador.
- Ao abrir uma página complementar, salvar posição/progresso e suspender câmera e mídia da cidade. Ao fechar, restaurar sem salto. Scroll dentro do iframe/modal não progride a cidade.
- Em resize que cruza o breakpoint, desmontar o driver anterior, estilos temporários e listeners; preservar capítulo e idioma; não reapresentar loading nem reiniciar portfólio sem motivo.
- Movimento reduzido: capítulos em fluxo vertical, sem pin de longa duração, câmera, chuva ou parallax; ações e conteúdo continuam acessíveis.
- Sem JS: manter acesso semântico às obras, informações e links. Falha de uma imagem ou vídeo não bloqueia conteúdo.
- Interações essenciais não dependem de hover. Parallax de ponteiro, se usado, deve ser muito sutil e restrito ao cenário; nunca deslocar alvos de clique.

Documentação técnica consultada: [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) e [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/). Usar a versão local existente, verificar o header antes de implementar e não atualizar bibliotecas incidentalmente.

## 8. Arquivos e responsabilidades sugeridos

- `assets/world/desktop/`: novos materiais web e manifesto de dimensões, foco, coordenadas do visor e proveniência. Masters fora do pacote servido.
- `assets/city-desktop.css`: layout e enquadramentos largos, isolados por modo.
- `assets/city-desktop.js`: timeline e gerenciamento da rolagem desktop, com inicialização e teardown explícitos.
- `assets/city.js` e `assets/city-flight.js`: pequena separação do driver de navegação; preservar regras da galeria e mobile. Inspecionar implementação vigente antes de editar.
- `assets/contact-rain.js`: adaptar tamanho, densidade, limites de DPR e ativação por cena apenas quando necessário.
- `index.html`, `assets/city-entry.js`: seleção condicional dos assets, loading dos recursos críticos do modo ativo e hooks sem duplicar IDs.
- `assets/locale-main-data.js`: variantes de convite/instrução desktop em PT/EN/DE. Preservar nomes próprios e copy mobile.
- CSS das páginas complementares: adaptar leitura horizontal, largura de texto e galerias. Aproveitar conteúdo existente, sem criar outra árvore de páginas.
- `project-docs/`: registrar direção final, orçamento medido, asset manifest e evidências de QA.

Não criar uma segunda galeria com dados duplicados. Se houver markup específico desktop, usar o mesmo catálogo de obras e garantir IDs únicos. Evitar carregar simultaneamente backgrounds mobile e desktop; `picture`/seleção de fonte e preloads precisam corresponder ao modo ativo.

## 9. Ordem de execução para Sol

1. Verificar HEAD/status e salvar baseline mobile nos tamanhos 320 × 568 e 390 × 844. Há diversos arquivos QA não rastreados: não adicionar tudo ao commit nem apagar material do usuário.
2. Confirmar arquitetura/anchors e produzir os quatro quadros panorâmicos de referência local. Revisar mesma cidade, nitidez, gato e proporção das mídias.
3. Preparar assets finais e seus planos. Implementar primeiro os quatro estados estáticos desktop, legíveis e funcionais.
4. Separar drivers por breakpoint e conectar rolagem nativa à timeline. Ajustar as três transições e os trechos de leitura.
5. Integrar loading, mídia inicial, carrossel, páginas complementares, formulário, WhatsApp e idiomas ao fluxo desktop.
6. Otimizar imagens e ativação por cena. Apenas cena atual e próxima devem receber trabalho/preload necessário; pausar efeitos fora de vista e com a aba oculta.
7. Fazer QA funcional e visual. Corrigir primeiro recortes, costuras, alinhamento do visor e perda de leitura; depois polir glow e partículas.
8. Ao receber a instrução para executar, usar a autorização de publicação V1 já registrada. Publicar somente após verificações; confirmar build do commit e repetir o percurso no URL público. Nenhuma publicação é parte do turno de planejamento.

## 10. Critérios de conclusão

- Desktop: 1280 × 720, 1366 × 768, 1440 × 900, 1920 × 1080, 2560 × 1440 e 2560 × 1080 ultrawide. Incluir zoom de navegador a 200% e tamanho 1024 × 768.
- Mobile: baseline 320 × 568 e 390 × 844 preservada, incluindo painel baixado, gato, setas, neon e ausência de rolagem entre dobras.
- Nenhuma faixa vertical denuncia a antiga imagem retrato sobreposta. Sem fundo borrado como preenchimento, painel flutuando sem suporte ou perspectiva incompatível.
- Vídeo do portfólio primeiro, depois obras. Galeria não rouba wheel vertical. Nenhum controle muda de lugar enquanto está sendo acionado.
- Primeira cena sem marca pequena/WhatsApp; ambos disponíveis a partir das Obras. Bandeiras somente no loading, PT/EN/DE completos e nomes próprios preservados.
- Scroll rápido, reversão, Home/End, links com `?scene=`, resize, retorno de páginas internas e movimento reduzido sem travamento ou perda de estado.
- Formulário mantém cinco campos e apenas prepara mensagem para o WhatsApp, sem envio automático.
- Capturas em cada estado e pelo menos uma gravação curta do percurso nos dois sentidos; verificar desktop e mobile em produção.
- Console sem erros; zero overflow horizontal acidental. Avaliar frame pacing e memória em notebook comum; buscar movimento próximo de 60 fps, medir e documentar o equipamento, sem prometer desempenho universal.
- Fallback útil para rede lenta, vídeo bloqueado e imagem indisponível. Não aguardar o carregamento completo da cidade para liberar a primeira cena.

## 11. Entrega esperada

Site responsivo único, arte panorâmica própria, quatro capítulos por scroll no desktop, mobile aprovado preservado, screenshots/gravação de validação, manifesto dos assets e link público verificado. Limite explícito: profundidade e câmera ilustradas em camadas; movimentos livres de câmera exigiriam outro escopo 3D.

## 12. Execução da V1 desktop

- Quatro panoramas próprios foram gerados para Cidade, Obras, Ana e Contato, na mesma direção de arte da V1. A cena de Obras reserva um visor preto para vídeo e tatuagens reais; a cena de Ana reserva outro para sua fotografia real.
- Os WebP de produção têm 1672 × 941 pixels e totalizam aproximadamente 1,47 MB. O material fonte PNG está na pasta irmã `../ana-byte-desktop-masters/`, fora do pacote publicado. Proveniência e descrição visual constam em `assets/world/desktop/README.md`.
- Elementos `<picture>` selecionam os panoramas no desktop e as imagens retrato aprovadas no mobile. O loading mantém a preparação e o botão existentes. O vídeo de passagem de 2 segundos permanece exclusivo do mobile.
- Em layout a partir de 1024 px com proporção de ao menos 6:5, o documento rola verticalmente por quatro trechos. O palco fixo faz as cenas e conteúdos avançarem juntos por crossfades, deslocamentos e escala leves, sem bloquear a roda ou o teclado. O convite inicial apresenta uma instrução de rolagem somente no desktop e tem traduções PT/EN/DE.
- O painel de obras usa a primeira mídia em vídeo, seguida do catálogo real. O outdoor da Ana usa a fotografia dela tatuando. As páginas complementares de Ana e do projeto continuam abrindo sobre a cidade. A chuva Canvas aprovada também aparece de forma discreta durante os capítulos desktop.
- O modo de movimento reduzido elimina o palco fixo longo e coloca os quatro capítulos em fluxo vertical normal. Redimensionar entre desktop e mobile conserva o capítulo atual. O mobile mantém navegação por botões, artes e proporções anteriores.

Validação local: JavaScript sem erros de sintaxe; quatro cenas e CTAs verificados em 1024 × 768, 1280 × 720, 1440 × 900, 1920 × 1080 e 2560 × 1080; movimento reduzido, URL `?scene=`, retorno ao mobile e modo de galeria conferidos. A largura rolável do documento permaneceu igual à viewport; o bleed das ilustrações ocorre apenas dentro do palco recortado. Comparação pixel a pixel contra o commit V1 aprovado, servida localmente: 0 pixels diferentes nas quatro cenas em 320 × 568 e 390 × 844. O ambiente bloqueou acesso de navegador à URL pública durante a verificação local; verificar novamente após publicação.

Limite material: as imagens nativas têm 1672 px de largura e ficam mais suaves em telas 4K e ultrawide. A câmera desktop é uma progressão ilustrada entre vistas do mesmo distrito, não um movimento livre 3D ou uma tomada única contínua. A produção de masters nativos 4K e separação avançada de planos ficou fora desta entrega para não declarar como detalhe real uma ampliação interpolada.
