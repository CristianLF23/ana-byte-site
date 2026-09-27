# V3 · Arquivo Vivo no fluxo principal · 26/09/2026

Tipo: implementação do design existente; ajuste de UX, conteúdo e reprodução de mídia. Marca pronta. Não é uma nova direção visual.

## Confirmado

- Objetivo: mostrar a Ana tatuando antes das fotografias e facilitar a exploração do acervo real no próprio site.
- Público, oferta e conversão permanecem os da V3: pessoas interessadas em tatuagem autoral, processo e arte digital; contato no WhatsApp existente.
- O screenshot mais recente é o alvo da seção inteira: cabeçalho com a foto real da artista, Arquivo Vivo em duas linhas, supporting copy, filtros, ordenação e grade.
- Essa composição deve estar em `#trabalhos` na home, sem página separada de portfólio. Links antigos devem levar à mesma seção, preservando seleção e obras compartilhadas.
- O vídeo real de 25 segundos e seu poster já estão no acervo fornecido. Reprodução inline, inicialmente sem áudio, apenas quando visível; controles nativos e alternativa manual se autoplay for bloqueado.
- Decisão inicial, substituída pelo loop solicitado em 27/09: ao terminar, a fotografia ocupava a mesma janela. Filtros permanecem no documento atual. Pausar manualmente não deve ser desfeito ao rolar.
- Preservar os demais capítulos, os backgrounds aprovados, fotografias reais, informações e destino de contato. A V1 fica fora deste escopo.
- Publicação no endereço existente da V3 está autorizada pela conversa.

## Premissas e validação

- IMPORTANT: sem som no início para permitir a reprodução inline. Usuário pode ativar o som pelos controles.
- OPTIONAL: diferenças de política de autoplay entre aparelhos. Poster, controles e ação de reprodução explícita devem sempre funcionar; movimento reduzido começa pausado.
- Gate Ready-to-Start: aprovado; nenhuma lacuna crítica.

## Recursos

Free resource router e UI Skills consultados. Registro UI Skills remoto indisponível por política da ferramenta; orientação local de Web Design Guidelines suficiente. Documentação MDN/WebKit consultada para autoplay inline. HTML, CSS e JavaScript existentes resolvem a mudança. Catálogos React, geração de imagens, Blender, WebGL, novos serviços e novas dependências não são necessários.

Verificação: fluxo de vídeo e filtros em desktop/mobile, navegação por links antigos, movimento reduzido, fallback sem JavaScript, inspeção visual e validação do endereço publicado.

## 27/09 · Cores dos títulos e retrato do acervo

- CONFIRMED: pedido pontual de motion e conteúdo; manter cada degradê e mover apenas a distribuição da cor dentro das letras, lentamente.
- CONFIRMED: `16-studio.jpg` é uma fotografia real da Ana no espelho do estúdio, já fornecida e inspecionada. Constava no inventário, mas não era renderizada em nenhuma página atual da V3. Substitui exclusivamente o retrato do cabeçalho do Arquivo Vivo.
- CONFIRMED: sem alteração de arquitetura, CTA, vídeo inicial, portfólio, marca ou demais retratos. Publicação na V3 autorizada pela conversa.
- Recursos: triagem completa do inventário gratuito, UI Skills e orientações de performance consultadas. CSS com observação de visibilidade é suficiente; nenhum novo pacote, geração de imagem, serviço externo ou catálogo de componentes é necessário. Reduzir movimento mantém as cores estáticas; pausa de efeitos e aba oculta interrompem a animação.
- Gate aprovado: nenhuma lacuna crítica. QA direcionado a fidelidade das cores, estabilidade das letras, pausa, visibilidade, enquadramento e funcionamento do acervo; desktop e mobile.
- CONFIRMED, adição posterior: vídeo em loop contínuo enquanto visível. Substitui a decisão anterior de trocar automaticamente por uma foto ao terminar. A escolha de uma obra ou filtro continua disponível a qualquer momento.
