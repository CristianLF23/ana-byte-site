# Decisoes

1. Direcao unica: Galeria de corpo e circuito.
2. Site multipagina estatico para reduzir custo, dependencia e manutencao.
3. Sem agenda, formulário, loja, CMS ou WebGL. A revisão de 22/09 substitui a decisão inicial de evitar introdução e cenas fixadas: o usuário pediu explicitamente essas experiências.
4. CTA para WhatsApp em todas as paginas, com contexto do projeto quando aplicavel.
5. Imagens fornecidas sao a principal prova e ocupam a maior parte da composicao.
6. CSS e SVG próprios para o sistema gráfico. GSAP e ScrollTrigger 3.13.0 locais para progressão sincronizada à rolagem; sem serviços de execução externos.
7. Movimento usa opacity e transform, respeita reduced motion e nunca bloqueia conteudo.
8. Recursos selecionados: landing page para hierarquia de conversao, better typography para escala e legibilidade, fixing accessibility para controles e foco.
9. GSAP selecionado após mudança de escopo. Three.js e WebGL dispensados: fotografias e estruturas vetoriais sustentam a experiência com menos custo de renderização no celular.
10. A tentativa de leitura autenticada do Instagram nao ficou disponivel. A construcao usa os anexos fornecidos e aceita expansao posterior.
11. Introdução limitada a 3 segundos, pulável; aparece uma vez por sessão. Progresso acompanha imagens críticas e fonte; não simula uma transferência inexistente.
12. Mobile: cenas com posição sticky, rolagem vertical nativa e gesto horizontal deliberado para mudar de obra. Desktop: trilho horizontal conduzido pela rolagem. Movimento reduzido apresenta as obras no fluxo normal.
13. Fonte Barlow Condensed Bold local sob SIL OFL 1.1 para consistência entre aparelhos. Licença distribuída em assets/fonts.
14. Neon irregular localizado, circuitos originais, luzes pausáveis e animações suspensas fora da área visível. A fotografia permanece sem alterações na arte tatuada.

## Revisão posterior: cinema por destinos

As decisões 6, 11 e 12 acima foram substituídas por instruções posteriores do usuário. O loading agora espera um clique explícito em Começar experiência. A navegação usa botões: background fixo, vídeo fornecido, transição e destino. Não exige rolagem. O vídeo não é reproduzido em loop. As fachadas ilustradas enquadram os painéis interativos no mesmo plano visual. As páginas internas entram lateralmente sobre a cidade e têm retorno fixo. Especificação e limites em [CITY_CINEMA.md](CITY_CINEMA.md).

## Revisão da V1: percurso e conteúdo complementar

O pedido posterior substitui a restrição de formulário da decisão 3. O convite final abre Comece pela ideia, uma página translúcida que orienta o visitante e termina com cinco campos. O formulário apenas prepara uma mensagem para o WhatsApp existente, sem guardar dados ou enviar automaticamente. A publicação da V1 está autorizada; V2 permanece separada.

As cenas Obras e Ana têm controles laterais Voltar e Avançar; a faixa inferior é um indicador de progresso. Foram retirados os botões Pausar e Visitar o ateliê do acervo, o Vamos criar da artista e o CTA do cabeçalho nessas duas cenas. Vídeo responde ao toque; fotos respondem a deslize e toque para ampliar. As páginas A Ana, Projetos e Sua ideia funcionam como conteúdo complementar conectado, com retorno fixo à cidade e sem cabeçalhos ou rodapés repetidos.

## Correção posterior: rolagem e mídia

A rolagem vertical nativa foi restabelecida, sincronizada com os botões. A cidade ocupa quatro alturas de tela e a cena permanece fixada durante a progressão. As setas ficam nos cantos inferiores, com neon forte; a última dobra tem apenas retorno à Ana. O outdoor de obras subiu 60 px mantendo sua ampliação. A segunda dobra começa com o vídeo de portfólio e termina nas 19 obras, sem retrato fixo da artista. A capa de espera é uma tatuagem; bloqueio de autoplay oferece reprodução ao toque. Falha da fonte e tentativa de início sem resposta levam às obras, e cancelamentos internos não alteram a pausa escolhida pelo visitante.

## 23/09: alinhamento das molduras e coleção

As molduras de obras e artista compartilham o topo visual em 72 px mais a área segura. Cada imagem usa uma âncora própria para posicionar sua borda superior, independente da posição dos ornamentos. O corte no topo do gato foi autorizado. A terceira dobra mantém somente Conheça a Ana, e a foto ocupa o espaço antes reservado ao segundo botão. A coleção complementar mantém duas colunas no celular, com alturas definidas pela fotografia e legenda no fluxo, título sobre categoria. Foi removida a altura mínima herdada de 31 rem, que deixava espaços vazios e legendas estreitas. A imagem completa permanece disponível ao abrir a ampliação.

O visor de obras passa a seguir a altura proporcional da área preta interna da fachada, com limite para telas muito baixas. Isso reduz a faixa vazia sob Ver acervo sem redimensionar as duas fachadas nem alterar seu alinhamento. Recurso escolhido: CSS existente; pesquisa de referências, catálogos, motion, 3D e novas dependências não agregam a esta correção isolada.

Após a validação do visor, ambas as fachadas receberam limites de largura vinculados à tela, além de uma redução moderada de escala. Isso impede que cresçam excessivamente em celulares altos e dá respiro nas laterais e abaixo dos painéis. As âncoras das bordas superiores continuam iguais, preservando o alinhamento visual entre Obras e Ana. Nenhuma imagem foi refeita.

A cena final recebeu duas camadas leves de chuva diagonal em ciano e magenta, construídas em CSS e animadas por transformações de textura repetível. A chuva só se movimenta quando a cena final está ativa, fica atrás do convite e desaparece em movimento reduzido; não exige novos arquivos de imagem ou dependências.

## 23/09: contato persistente sem obstruir o gato

No celular, o CTA do WhatsApp usa somente o símbolo do aplicativo e fica ao lado da marca, liberando a área superior direita da cena Obras. A área de toque mede 46 × 46 px, o link mantém nome acessível e foco visível. O SVG é do Bootstrap Icons sob licença MIT incluída no projeto. A solução preserva o destino existente e não adiciona dependência de produção; catálogos de componentes, motion e 3D não agregariam a esta correção isolada.

## 23/09: referência cinematográfica na abertura

A primeira dobra exibe “como lágrimas na chuva” como detalhe tipográfico discreto abaixo do subtítulo. A frase foi fornecida pelo usuário como referência a Blade Runner. O convite principal e a instrução de navegação permanecem destacados; não há novo recurso externo ou animação.

## 23/09: idiomas na abertura

A V1 oferece Português, English e Deutsch por meio de um seletor discreto exibido somente durante o loading. O idioma escolhido é aplicado à home, aos estados dinâmicos, aos formulários e às páginas complementares, acompanhando a navegação por URL e armazenamento local. O catálogo fica no próprio projeto, sem serviço de tradução, API externa, dependência nova ou custo recorrente; o Português permanece como fallback para conteúdo sem tradução. As adaptações priorizam leitura natural em cada idioma e preservam Ana Byte, Ana, São Paulo, Brasil, Jinx, títulos próprios de obras e demais nomes que não devem ser traduzidos.

## 23/09: bordas neon nas ações

O efeito de contorno iluminado do OriginKit orienta o comportamento visual, implementado em CSS original no arquivo `assets/neon-actions.css`, sem instalar o componente. Os botões principais exibem uma passagem suave de luz pelo perímetro; controles secundários recebem destaque ao foco ou ao passar o cursor. Ciano identifica retorno, contato e envio de projeto; magenta identifica avanço e acervo. O seletor de idioma e os cartões da coleção mantêm brilho estático e discreto. A animação é desativada em `prefers-reduced-motion`, e a borda permanece visível quando a máscara animada não é suportada.

Revisão visual: os controles passam a usar dois tubos finos separados por um intervalo escuro, com núcleo claro e halo mais intenso na cor de cada ação. O traço móvel percorre a linha externa. O seletor de idioma e os cartões do acervo continuam mais discretos para não competir com os CTAs da experiência.
