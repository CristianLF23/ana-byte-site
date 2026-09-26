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
