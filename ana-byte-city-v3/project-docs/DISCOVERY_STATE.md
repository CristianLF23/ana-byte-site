# V3 · Arquivo Vivo no fluxo principal · 26/09/2026

Tipo: implementação do design existente; ajuste de UX, conteúdo e reprodução de mídia. Marca pronta. Não é uma nova direção visual.

## Confirmado

- Objetivo: mostrar a Ana tatuando antes das fotografias e facilitar a exploração do acervo real no próprio site.
- Público, oferta e conversão permanecem os da V3: pessoas interessadas em tatuagem autoral, processo e arte digital; contato no WhatsApp existente.
- O screenshot mais recente é o alvo da seção inteira: cabeçalho com a foto real da artista, Arquivo Vivo em duas linhas, supporting copy, filtros, ordenação e grade.
- Essa composição deve estar em `#trabalhos` na home, sem página separada de portfólio. Links antigos devem levar à mesma seção, preservando seleção e obras compartilhadas.
- O vídeo real de 25 segundos e seu poster já estão no acervo fornecido. Reprodução inline, inicialmente sem áudio, apenas quando visível; controles nativos e alternativa manual se autoplay for bloqueado.
- Ao terminar, a fotografia ocupa a mesma janela. Filtros permanecem no documento atual. Pausar manualmente não deve ser desfeito ao rolar.
- Preservar os demais capítulos, os backgrounds aprovados, fotografias reais, informações e destino de contato. A V1 fica fora deste escopo.
- Publicação no endereço existente da V3 está autorizada pela conversa.

## Premissas e validação

- IMPORTANT: sem som no início para permitir a reprodução inline. Usuário pode ativar o som pelos controles.
- OPTIONAL: diferenças de política de autoplay entre aparelhos. Poster, controles e ação de reprodução explícita devem sempre funcionar; movimento reduzido começa pausado.
- Gate Ready-to-Start: aprovado; nenhuma lacuna crítica.

## Recursos

Free resource router e UI Skills consultados. Registro UI Skills remoto indisponível por política da ferramenta; orientação local de Web Design Guidelines suficiente. Documentação MDN/WebKit consultada para autoplay inline. HTML, CSS e JavaScript existentes resolvem a mudança. Catálogos React, geração de imagens, Blender, WebGL, novos serviços e novas dependências não são necessários.

Verificação: fluxo de vídeo e filtros em desktop/mobile, navegação por links antigos, movimento reduzido, fallback sem JavaScript, inspeção visual e validação do endereço publicado.
