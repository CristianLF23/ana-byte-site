# Ana Byte: cidade, passagem e destino

Revisão local de 22 de setembro de 2026. Substitui as decisões anteriores de navegação obrigatória pela rolagem e de entrada automática.

## Direção confirmada

Cidade ilustrada, chuva e arquitetura noturna, ciano e magenta. As imagens de tatuagens permanecem fotografias reais, sem alteração. Cada destino usa uma fachada pintada com suportes, cabos e moldura; o conteúdo interativo compartilha as coordenadas da tela da ilustração. O gato do arquivo é uma ilustração realista incorporada à fachada.

Referência principal: [The Spark, estudo do criador no Codrops](https://tympanus.net/codrops/2026/01/09/the-spark-engineering-an-immersive-story-first-web-experience/). Princípio transferido: narrativa espacial, continuidade entre estados, arte e interação como uma experiência. [ERA Residence](https://www.era-residence.com/) orientou o percurso por capítulos na etapa anterior; a decisão posterior do usuário prioriza botões e uma passagem em vídeo. Nenhum código ou asset dessas referências foi incorporado.

## Sequência implementada

1. Loading acompanha a resolução de imagens críticas e fontes. Aguarda sempre o botão Começar experiência. Falhas ou oito segundos de espera liberam a alternativa leve.
2. Cidade inicial mostra o primeiro frame do vídeo, título, subtítulo e Descubra meu mundo. Sem miniatura de galeria na primeira cena.
3. O clique reproduz o vídeo fornecido uma vez. Há chuva, trânsito e movimento do gato dentro do próprio material. Uma aproximação visual suave acompanha a reprodução.
4. O fim do vídeo revela a fachada do destino. Todo o cenário de chegada se acomoda junto; a foto não viaja isolada pela tela.
5. Obras reúne quinze imagens, troca automática pausável, gesto horizontal, ampliação e acervo. Ana ocupa outra fachada, com botões explícitos para artista e projetos. Contato preserva o WhatsApp existente.
6. As páginas internas entram da direita e retornam à mesma cena da cidade. Conteúdo sem JavaScript continua disponível nas páginas próprias e no acervo da home.

## Material de vídeo e limites

- Fonte: `D:\Downloads\Animate_cat_image_with_looping_20260922130801.mp4`.
- Inspeção: aproximadamente quatro segundos, 720 × 1280, 24 fps. A câmera do arquivo é fixa.
- `assets/world/city-flight.mp4` preserva o vídeo H.264 e remove o áudio. Cerca de 1,35 MB. Não recebe loop.
- `city-flight-poster.jpg` corresponde ao primeiro frame e usa o mesmo enquadramento do player.
- Esta implementação é uma sequência 2D de imagem, vídeo e fachada. A aproximação não representa reconstrução 3D da cidade. Não há continuidade geométrica perfeita entre o filme fornecido e as novas fachadas ilustradas.
- Os destinos permanecem estáticos depois da chegada, conforme a última proposta do usuário. O movimento real da cidade ocorre durante o vídeo. O gato da fachada de chegada é estático.
- Movimento reduzido troca diretamente de destino. Falha ou bloqueio do vídeo também permite chegar; existe botão Ir direto ao destino.
- Nenhuma dependência nova de produção, serviço pago ou renderização WebGL foi introduzida. GSAP já existente controla apenas transições.

## Arte produzida

Ilustrações originais produzidas com a ferramenta de imagens disponível nesta sessão, guiadas pelas referências fornecidas:

- `gallery-facade.jpg`: painel alto integrado ao edifício à direita, suportes visíveis, tubos rosa e ciano, cidade chuvosa, gato preto e placa アナ・バイト.
- `atelier-facade.jpg`: fachada diferente, painel integrado ao edifício à esquerda, coração mecânico luminoso e placa アナ.
- `ana-neon-preview.jpg`: estudo conceitual de letreiro アナ com imagens de tatuagem dentro dos traços e gato no topo. Este estudo é gerado e não documenta tatuagens reais. A galeria interativa utiliza os arquivos originais da artista.

As instruções de arte pediram perspectiva ilustrada consistente, tela central escura para sobreposição de conteúdo real, materiais molhados, luzes emitidas pelos objetos e ausência de componentes gráficos de site desenhados na imagem.

PNG do conceito entregue em `C:\Users\crist.PC\Documents\Ana Byte\Prévias do site\Setembro de 2026\Letreiro Ana Byte.png`, com cópia em ENTREGAS CODEX.

## Verificação e reprodução

Prévia local: http://127.0.0.1:4178/. Servidor estático `preview.cjs`, com suporte a requisições parciais do vídeo.

`qa/cinema-check.cjs` percorre loading, reprodução real, galeria, coleção, modal, ateliê, página interna e retorno. Inclui telas 390 × 844, 360 × 640 e 1440 × 900, movimento reduzido e JavaScript desativado. Screenshots em `qa/cinema/`. Verificação por Chromium automatizado; o navegador integrado da aplicação não disponibilizou a ponte de controle nesta sessão. Não equivale a teste em iPhone físico.

Arquivos principais: `index.html`, `assets/city.js`, `assets/city-flight.js`, `assets/city-cinema.css`, `assets/city-entry.js`, `assets/city-entry.css`, `assets/city-interior.js`, `assets/city-interior.css`, imagens em `assets/world`, quatro páginas internas e `preview.cjs`.

Status: prévia local. Sem publicação nova nesta revisão. O endereço de atendimento demonstrativo está identificado no conteúdo.
