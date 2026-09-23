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
