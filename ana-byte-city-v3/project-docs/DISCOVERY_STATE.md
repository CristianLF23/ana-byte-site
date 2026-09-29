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

## 27/09 · Movimento de navegação e orientação

- CONFIRMED: pedido pontual de motion e orientação na V3 existente. Menu móvel, filtros, ordenação e paginação do acervo ganham entradas suaves; links, estados e URL continuam os mesmos.
- CONFIRMED: barra fixa e fina acompanha a rolagem nativa com as cores verde neon, magenta e verde. “Studio em São Paulo” integra a primeira dobra, ao lado da identidade, sem cobrir Ana, gato ou headline.
- CONFIRMED: parallax mobile mais perceptível, preservando texto legível e o modo de movimento reduzido. Desktop mantém sua amplitude atual.
- Recursos: GSAP e ScrollTrigger locais já presentes, HTML/CSS/JS atuais. Nenhum novo pacote, asset gerado, serviço externo ou compra. Gate aprovado, sem item crítico em aberto. Publicação no link da V3 autorizada pela conversa.
- Validação: abertura, fechamento, Escape e toque rápido no menu; filtros e setas; início, meio e fim do progresso; recortes mobile, tablet e desktop; movimento reduzido; ausência de overflow e erros de execução.

## 27/09 · Personagem ilustrada na primeira dobra

- CONFIRMED: as duas capturas do Instagram mostram a Ana com mecha branca/loira perto da orelha, em contraste com o cabelo escuro. O pedido é aplicado à personagem já pintada na cidade, sem substituir sua identidade por uma pessoa gerada.
- CONFIRMED: cobrir o braço exposto mais visível com manga preta ajustada à pose. Preservar gato frajola, cidade, letreiros, chuva, enquadramento e texto; fotos reais de trabalhos e da Ana não são alteradas.
- Classificação: correção localizada de asset visual existente, sem nova direção estética, oferta, CTA, página ou integração. Gate aprovado; nenhuma lacuna crítica. A edição com ferramenta integrada de imagem foi autorizada pelo pedido, sem ferramenta externa paga ou dependência de produção.
- Recursos: `imagegen` integrado para a edição raster; composição determinística apenas dentro da silhueta da personagem para resguardar o fundo original; variantes WebP para carregamento responsivo. Catálogos de componentes, 3D e novas referências online não acrescentam a esta correção isolada.
- Validação: comparação das regiões externas à pessoa, inspeção visual da hero em mobile e desktop, integridade dos quatro tamanhos, carregamento real no navegador e regressões de navegação.

## 29/09 · Arquivo Vivo e responsividade desktop

- CONFIRMED: substituir a foto escura do espelho no cabeçalho do Arquivo Vivo por obras reais lado a lado, sob uma máscara preta contínua. Cada recorte prioriza a tatuagem; a nova foto do gato esfinge entra como obra visual nessa composição. Os retratos pessoais enviados não entram no fundo do acervo.
- CONFIRMED: remover o parallax das fotos usadas como fundo, inclusive da primeira cidade, do retrato da seção Sobre e da pequena cena ambiental. Permanecem as revelações de títulos, o vídeo e os movimentos das obras em primeiro plano.
- CONFIRMED: inspecionar desktop de 1024 a 2560 px e corrigir a expansão excessiva das áreas de leitura em telas muito largas. A direção visual, CTA, categorias e 19 obras catalogadas permanecem.
- Ready-to-Start Gate: aprovado. Fotos reais, objetivo, público, CTA, layout alvo e hospedagem já estão definidos; nenhuma lacuna crítica.
- Recursos: referências [ERA Residence](https://www.era-residence.com/) e [Codrops Grid Item Animation Layout](https://tympanus.net/codrops/2015/04/15/grid-item-animation-layout/) consultadas apenas para princípios de ritmo e escala editorial. HTML, CSS, GSAP local e fotografias fornecidas bastam; nenhum catálogo, serviço pago ou dependência nova.
- Validação: duas rodadas de screenshots mobile, tablet e desktop; recortes e ausência de overflow; teste de fundo estático, galeria, vídeo, navegação, tradução e movimento reduzido.

## 29/09 · Retratos em Arte em Trânsito

- CONFIRMED: reunir várias fotografias reais da própria Ana em faixas lado a lado na primeira composição de Sobre a Artista, seguindo o princípio do mosaico do Arquivo Vivo.
- CONFIRMED: a alteração é exclusiva do desktop. O retrato único e o enquadramento aprovados em mobile e tablet permanecem.
- CONFIRMED: usar uma foto dela tatuando e dois retratos pessoais já enviados. O segundo retrato da seção continua como está; o novo plano fotográfico fica estático, sem parallax.
- Ready-to-Start Gate: aprovado. Imagens, identidade, seção alvo e limites responsivos definidos; não há lacuna crítica. Correção visual localizada, sem novo conceito ou dependência.
- Validação: comparar 390, 768, 1024, 1440 e 1920 px; verificar rosto, leitura do título, largura da seção e ausência de overflow.

## 29/09 · Primeira dobra mobile e entrada breve

- CONFIRMED: elevar moderadamente o bloco de título, subtítulo e ações na primeira dobra mobile para que ambos os botões fiquem claramente visíveis ao entrar. Preservar a posição e a leitura da Ana e do gato na cidade.
- CONFIRMED: posicionar “Studio em São Paulo” imediatamente abaixo de “Tattoo Artist” na marca da abertura mobile. O cabeçalho compacto após rolagem e o desktop mantêm seu comportamento.
- CONFIRMED: mostrar na primeira entrada da home uma abertura curta, próxima de dois segundos, com a logo oficial e uma barra fina; ao concluir, revelar cidade, navegação e conteúdo por opacidade. Reutilizar apenas o princípio da V1, sem copiar sua composição ou reconstruir a logo.
- Ready-to-Start Gate: aprovado. O objetivo de conversão, conteúdo, assets, limites de escopo, direção aprovada e hospedagem são conhecidos; nenhuma lacuna crítica.
- Recursos: HTML, CSS e JavaScript locais. O roteador gratuito dispensou catálogos, 3D, imagens geradas, serviços externos e dependências; trata-se de ajuste localizado, sem pesquisa de nova direção visual.
- Validação: medir botões em 375, 390 e 430 px, observar abertura e fade em navegador, evitar repetição na mesma sessão e respeitar links diretos, ausência de JavaScript e movimento reduzido.
