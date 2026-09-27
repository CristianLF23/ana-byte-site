# Auditoria comparativa — 26/09/2026

Alvo: mockups aprovados, desconsiderando a moldura externa do navegador/telefone e usando fotografias reais no lugar das obras ilustradas. Correções mais recentes: os dois fundos indicados pelo usuário com Ana presente, e identidade do gato conforme fotografia real.

## Comparação antes da implementação principal

| Elemento | Diferença identificada | Correção aplicada |
|---|---|---|
| Marca | Logo em fonte, com outra silhueta e escala | Lettering isolado do próprio mockup, imagem com alpha, rail ajustado |
| Tipografia | Fonte estreita, títulos altos, quebras distintas | Orbitron, peso/expansão/tracking calibrados; duas linhas desktop e três mobile |
| Fundo desktop | Arquitetura diferente e ausência da Ana | Cena escolhida pelo usuário, personagem preservada, texto HTML no plano da placa |
| Fundo mobile | Composição genérica, sem personagem, header opaco | Cena vertical escolhida, Ana acima da headline, signage à esquerda, marca sobre a cidade |
| Gato | Gato preto diferente da fotografia | Edição ambiental para marcas brancas, focinho e olhos verdes da referência |
| Profundidade | Imagem lisa com elementos sem relação espacial | Fundo, chuva, primeiro plano oclusor e placa HTML em camadas do mesmo conjunto |
| Arquivo home | Mosaico com alturas diferentes | Quatro fotos desktop e grade 2 × 2 mobile; contador, labels e expansão |
| Portfólio | Alturas/densidade divergentes e paginação inconsistente | Seis miniaturas por página, destaque lateral, filtros com contagem real, detalhe navegável |
| Artista | Foto isolada e crop ocultando a ação de tatuar | Foto real ampliada, máscaras laterais e crop exibindo rosto, mãos e ferramenta no desktop |
| Processo | Mockup mostra cinco etapas ausentes no acervo | Comparações reais mantidas; nenhum stencil, estudo ou etapa inventado |
| Contato | Tratamento desconectado e formulário apertado no mobile | Frame técnico, labels, CTA magenta, duas colunas desktop/uma mobile, confirmação do destino |

## Rodadas visuais

Cada rodada contém 54 capturas: início, arquivo, artista, contato, portfólio e sobre em **1920, 1600, 1440, 1280, 1024, 768, 430, 390 e 375 px**.

| Rodada | Resultado e correções resultantes |
|---|---|
| Baseline | Capturas da primeira implementação em 1440/390 px; divergências registradas antes da reconstrução |
| 1 | 54 capturas, zero overflow horizontal, imagens ausentes ou erros de execução. Corrigidos gradiente mobile, peso/expansão dos títulos e hierarquia do formulário |
| 2 | 54 capturas, mesmos checks sem erros. Ajustado o enquadramento da foto da Ana para mostrar o trabalho; retirados controles do Instagram da área visível por crop CSS |
| 3 | 54 capturas, mesmos checks sem erros. Conferidos fundo/gato, marca, quebras, composição mobile, pares de fotos, sobre, portfólio e contato em folhas comparativas |

Capturas e folhas por grupo estão localmente em `qa/round-1/`, `qa/round-2/` e `qa/round-3/`. Não são incluídas no pacote público para evitar dezenas de megabytes de imagens de teste. Cada relatório registra medidas, imagens ausentes e erros do navegador. Os scripts para repetir a inspeção são versionados.

Após a terceira rodada, a revisão funcional corrigiu a contenção de Tab no modal, abertura por mudança de hash, restauração de filtros/página pela URL, fallback sem JavaScript e texto de privacidade do formulário. Esses ajustes não alteram a composição dos fundos.

## Verificação funcional

`node qa/check.cjs`: **13/13 verificações aprovadas**.

- 22 arquivos reais conferidos por SHA-256 contra os originais: 19 trabalhos/processos e 3 fotografias de Ana/estúdio.
- 19 obras alcançáveis em páginas de 6, 6, 6 e 1, sem duplicação/perda.
- Filtros reais, ordenação, página e seleção restauradas por URL.
- Destaque desktop, anotações, anterior/próxima e link contextual de WhatsApp.
- Modal mobile: teclado, 15 ciclos de foco, Escape e retorno ao cartão.
- Navegação mobile, menu, pausa de atmosfera e scroll nativo.
- Formulário: validação, cinco campos no rascunho, nenhuma mensagem enviada e nenhum dado em localStorage.
- Vídeo de 25 s com reprodução por escolha e pausa ao fechar.
- Movimento reduzido: zero ScrollTriggers, chuva e scroll animado desligados.
- Sem JavaScript: conteúdo, cinco links de navegação e 19 links diretos de obras em 1440/390 px.
- Controles com rótulos, uma H1 por página e âncoras válidas.
- Carregamento progressivo: vídeo não solicitado na abertura; imagens abaixo da dobra com lazy loading.
- Nenhum erro de execução ou HTTP 4xx/5xx nos fluxos testados localmente.

Amostra local de 120 frames: mediana 16,7 ms, p95 16,7 ms; aproximadamente 1,56 MB transferidos na carga inicial desktop. Medidas em Chromium local sem limitação de rede, não uma promessa de FPS/carga em todos os dispositivos.

## Diferenças residuais documentadas

- Tipografia aproximada com Orbitron e ajustes geométricos; o arquivo tipográfico exato do mockup não foi identificado.
- Logo extraída da referência raster, não de arquivo oficial vetorial inexistente nos materiais encontrados.
- Fotos reais têm poses/resoluções diferentes das representações do mockup. Preservar a verdade do portfólio tem prioridade sobre reproduzir obras geradas.
- Etapas do processo ausentes no acervo não foram fabricadas.
- As cenas foram limpas para retirar UI rasterizada e editadas no gato; preservam a composição fornecida, mas não são cópias binárias do screenshot.
- Safari e iPhone físico não estavam disponíveis. Validação em Chromium no Windows; sem alegação de certificação WCAG completa.

## Refinamento posterior solicitado pelo usuário

Nova passagem em 26/09/2026, mantendo os fundos e a composição da abertura aprovados.

| Antes | Ajuste conferido |
|---|---|
| Rodapé exibia o nome com fonte | Mesmo arquivo de lettering do topo nas três páginas |
| Home tinha prévia de quatro obras; filtros abriam outra página | Acervo ampliado compartilhado como segunda seção padrão; filtros atuam no lugar, destaque lateral desktop e modal mobile |
| Apenas uma fotografia e apresentação curta da artista | Segunda fotografia real no estúdio, texto de trajetória, São Paulo, circulação por outras cidades e produção de arte digital; conteúdo mais extenso na página sobre |
| Tamanho limitado a faixas de seleção | Campo de texto livre com exemplo em centímetros; valor integral preservado no rascunho do WhatsApp |
| Magenta predominava em todos os elementos | Luzes ciano, verde e azul distribuídas por acervo, processo e artista; ação principal conserva magenta; fotografias não são recoloridas |
| Movimento concentrado na abertura | Parallax da cidade, fotografias e sequência do processo; menor deslocamento no mobile; pausa reversível disponível em todas as páginas |

Discovery: correção e expansão de um produto existente com materiais, objetivo e linguagem já aprovados. Nenhuma dependência externa, fotografia nova gerada, mudança comercial ou informação biográfica inventada foi necessária. O texto usa as informações enviadas pelo usuário e as fotografias já presentes no acervo.

Fontes técnicas consultadas: documentação oficial de [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) e [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/). Não houve mudança de direção visual nem importação de componentes externos.

### Verificação desta passagem

- Funcional: **16/16 verificações locais aprovadas**, incluindo filtros inline em 1440/390 px, logo idêntica por URL, texto livre com decimais e duas dimensões, parallax medido em scroll, pausa/reinício e movimento reduzido.
- Visual 1: **72 capturas**, incluindo nova seção e rodapé nos nove breakpoints do contrato. Zero overflow horizontal, imagens ausentes ou erros de execução.
- Correção após inspeção: ampliada a área do brilho lateral para não cortar o glow ao redor das linhas.
- Visual 2: **81 capturas**, acrescentando a apresentação ampliada da página sobre. Novamente sem overflow, imagens ausentes ou erros de execução. Conferidas folhas comparativas de desktop, tablet e mobile.
- Evidências locais em `qa/round-refinement-1/` e `qa/round-refinement-2/`. Scripts de QA versionados; capturas excluídas da publicação.
- Produção: **16/16 verificações funcionais aprovadas** no endereço público. Mais 12 capturas desktop/mobile, nove arquivos publicados conferidos contra os locais e zero erros. Fotografias e fontes comparadas byte a byte; CSS/JS comparados após normalizar somente as quebras de linha Windows/Git. Evidências em `qa/production/` e `qa/check-report.json`.

Arquivos principais alterados: `build.mjs` (galeria compartilhada e rodapé), `sections.mjs` (acervo padrão, biografia e campo de tamanho), `assets/fidelity.css` (composição, cores e luz), `assets/v3.js` (filtros inline, parallax e controles de movimento). Páginas geradas: `index.html`, `portfolio/index.html` e `sobre/index.html`. Scripts de verificação e documentação também foram atualizados.

Para repetir: iniciar `node server.mjs`, executar `node qa/check.cjs` e `node qa/visual-round.cjs round-recheck`. Para verificar a publicação, usar `node qa/production-check.cjs`; a suíte funcional aceita `ANA_QA_URL` com o endereço público.

Esta passagem não altera nenhum arquivo da V1. As limitações documentadas de fonte, acervo e ausência de Safari/iPhone físico continuam válidas.

## Arquivo Vivo único, com vídeo de abertura

O screenshot de 26/09 esclareceu que a transposição inclui o cabeçalho da página de portfólio. Corrigidos:

- Cabeçalho com foto real da Ana, título em duas linhas, supporting copy e filtros incorporado à home.
- Vídeo de 25 segundos no próprio quadro do acervo, como primeira mídia; foto seguinte mantém a altura no fim da reprodução.
- Removido o modal separado de vídeo. A ação “Ver em movimento” reproduz dentro da seção.
- Removida a segunda página navegável de portfólio. Links antigos redirecionam à home, preservando parâmetros e compartilhamentos.
- Ajustados os filtros mobile para a composição de três colunas mostrada no screenshot.
- Nenhuma fotografia ou trecho de vídeo gerado; poster reaproveitado do material real já fornecido.

Validação local: 16/16 verificações gerais aprovadas. `qa/archive-flow.cjs` confirma reprodução inline, pausa fora da tela, respeito à pausa manual, passagem estável para fotografia, filtros no mesmo documento, endereço legado, movimento reduzido, autoplay bloqueado e falha de mídia sem bloquear o acervo. Primeira inspeção: 6 screenshots em 1440/390 px; segunda: 81 capturas nos nove breakpoints, sem overflow horizontal, imagens ausentes ou erros de execução.

Arquivos: `archive.mjs`, `sections.mjs`, `build.mjs`, `assets/v3.js`, `assets/fidelity.css`, poster real, páginas geradas e verificadores. Evidências locais: `qa/round-archive-film-1/`, `qa/round-archive-film-2/` e `qa/round-archive-flow-final/`. O roteiro direcionado também aceita `ANA_QA_URL` para conferir a publicação. Limite: Chromium no Windows, sem iPhone físico.

Produção conferida após a publicação: roteiro direcionado aprovado em 1440 e 390 px, incluindo filtros no mesmo documento, vídeo inline, pausa manual, transição estável, redirecionamento legado e fallbacks de reprodução. Conferência adicional com 12 capturas, dez assets publicados iguais aos locais e zero erros. Evidências em `qa/round-archive-published/` e `qa/production/report.json`. O verificador aguarda apenas imagens dentro da área capturada, com limite de tempo, para respeitar o carregamento progressivo das imagens fora da tela.

## 27/09 · Degradês em movimento, retrato exclusivo e vídeo em loop

- Títulos que já possuíam degradê recebem deslocamento suave de cor, com 12 segundos por sentido. Os gradientes, fontes, textos, quebras e dimensões são preservados. Títulos de cor sólida continuam estáticos.
- Animação restrita à superfície das letras e pausada fora da tela, em painéis ocultos, ao pausar efeitos e quando a aba está oculta. Movimento reduzido restaura o degradê estático original. Sem biblioteca nova ou medição contínua de layout.
- O Arquivo Vivo usa `16-studio.jpg`, foto real da Ana no espelho, que estava no acervo mas não aparecia nas páginas da V3. Somente o recorte CSS e a sobreposição de leitura foram ajustados; a fotografia permanece intacta. Os retratos da seção Sobre continuam os anteriores.
- Por instrução adicional, o vídeo de 25 segundos repete continuamente com loop nativo. Removida a troca automática para a primeira fotografia. A seleção manual de obras e filtros continua na seção; o texto de apoio acompanha esse fluxo.
- Comparação inicial em 1440/390 px. Duas rodadas visuais nos nove breakpoints, de 375 a 1920 px, sem overflow nem imagem ausente. Na segunda rodada a nova foto ganhou enquadramento mais próximo e sobreposição mobile menos escura.
- Verificados em 1440/390 px: movimento real do preenchimento sem mudança das dimensões do texto, gradiente original inalterado, pausa e retomada manual, suspensão fora da tela e movimento reduzido. Nenhum erro de execução. Evidências em `qa/round-title-photo/`.
- `qa/archive-flow.cjs` atualizado e aprovado: duas voltas do vídeo sem eventos de pausa e sem alteração da moldura em desktop/mobile; filtros no mesmo documento, pausa manual, redirecionamento legado, movimento reduzido, autoplay bloqueado e falha de mídia também aprovados. Evidências em `qa/round-title-photo-loop/`.

Arquivos principais: `archive.mjs`, `sections.mjs`, `assets/fidelity.css`, `assets/v3.js`, `index.html` e `sobre/index.html`; inventário, contexto, direção, auditoria e verificação do vídeo atualizados. Limite: Chromium no Windows, sem iPhone físico.

## 27/09 · Menu, acervo, progresso e profundidade mobile

- “Studio em São Paulo” entrou na primeira dobra. Em 375, 390, 430 e 768 px ocupa o intervalo entre marca e menu sem sobreposição; em desktop aparece como pequena sinalização sobre a cidade.
- O menu compacto agora abre e fecha com deslocamento curto e opacidade, inclusive nos links e na camada de fundo. Escape, foco no botão, toques rápidos, mudança de breakpoint, pausa de efeitos e movimento reduzido foram verificados.
- Filtros, ordenação, setas da grade e travessia entre páginas da obra selecionada revelam os cards com entrada curta. A alteração de estado, paginação, seleção e URL continua no mesmo documento.
- Barra de progresso de leitura fixa no topo, em verde neon/magenta/verde. Verificação em início, meio e fim da página: 0%, 50% e 100% nas seis larguras testadas.
- Parallax mobile ampliado para a cidade e retratos, mantendo o desktop anterior e desligamento em movimento reduzido/pausa. Em 390 px, a cena da cidade deslocou 32 px ao percorrer pouco mais da metade da primeira dobra.
- Duas inspeções visuais em 375, 390, 430, 768, 1024 e 1440 px, com capturas de abertura, menu e acervo em `qa/round-motion-navigation/`. Sem overflow horizontal ou erro de execução. `qa/motion-navigation.cjs`, `qa/check.cjs` (16/16) e `qa/archive-flow.cjs` (vídeo em loop, filtros, fallbacks) aprovados.

Arquivos: `build.mjs`, `sections.mjs`, `assets/fidelity.css`, `assets/v3.js`, páginas geradas, roteiro de QA e documentação. A V1 não foi alterada. Limite: checagem visual em Chromium no Windows, sem Safari/iPhone físico.
