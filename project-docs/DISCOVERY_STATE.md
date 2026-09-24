# Estado de descoberta

CONFIRMED 24/09 — revisão desktop da V1. O usuário pediu rolagem vertical nativa sem botões de avanço, reunião do conteúdo complementar na mesma página, menos panoramas urbanos, foco no movimento sincronizado de imagem e tipografia observado no ERA Residence e liberdade para novas interações. A composição mobile aprovada permanece intocada. Objetivo, público, identidade, acervo real, fatos da artista, três idiomas, CTA de WhatsApp, hospedagem e limites de custo já estão documentados; o Ready-to-Start Gate não tem lacunas CRITICAL. Referências consultadas: estudo anterior `output/ana-byte-era-audit/01_ANALISE_ERA_RESIDENCE.md`, `02_ANA_BYTE_DIRECAO_E_PLANO.md`, `03_BLUEPRINT_DE_REPLICACAO.md`, o site da ERA ao vivo, The Spark e Sticky Grid Scroll. O estudo separa o princípio de continuidade visual dos recursos próprios da ERA; a solução usa composição, imagens, tipografia e geometria originais da Ana Byte.

CONFIRMED 23/09 — planejamento desktop: preservar identidade da V1 mobile e retrabalhar desktop com backgrounds próprios e maior resolução. Usuário pediu plano para execução posterior no GPT-6 Sol. RECOMMENDATION: scroll vertical nativo apenas no layout largo, com quatro cenas panorâmicas e câmera ilustrada em camadas. Escopo comercial, idiomas, fotos reais e CTA existentes confirmados. Gate de planejamento aprovado sem lacunas críticas. Implementação não iniciada; detalhes e critérios em DESKTOP_EXECUTION_PLAN.md.

CONFIRMED 23/09: a abertura não exibe a marca pequena do canto superior esquerdo nem o botão de WhatsApp; ambos surgem a partir da segunda dobra, após o vídeo. A navegação principal passa a ser feita apenas pelos botões, sem rolagem vertical ou instrução de rolagem. O botão de pular o vídeo é removido e o outdoor de Obras desce um pouco para mostrar mais do gato. Gate aprovado sem lacunas críticas.

CONFIRMED 23/09: o contato persistente do WhatsApp deve permanecer acessível sem cobrir o gato na cena Obras. Correção isolada de apresentação e posição do CTA; destino, páginas e direção visual permanecem confirmados. Gate aprovado sem lacunas críticas.

## Revisão atual: conteúdo complementar da V1

CONFIRMED 23/09: subir novamente o outdoor de obras, permitindo cortar o topo do gato; alinhar as molduras de Obras e Ana. Remover Da arte à pele da terceira dobra e dedicar o espaço à foto. Corrigir os cards da aba Projetos que herdavam altura mínima e legenda horizontal. Escopo restrito, direção preservada, sem lacunas críticas nem novas dependências. Vídeo, rolagem e setas mantidos. Gate aprovado.

CONFIRMED: correção posterior preserva vídeo inicial e trabalhos na segunda dobra, foto de Ana somente na terceira. Outdoor de obras retorna à altura anterior, 60 px acima da revisão precedente. Setas inferiores com neon ciano/magenta: Voltar e Avançar nas dobras 2/3, somente Voltar na 4. A rolagem vertical nativa também progride entre os quatro destinos. Gate aprovado sem lacunas. Recursos existentes suficientes; catálogos visuais, 3D e dependências adicionais dispensados. UI Skills fixing-accessibility orienta nomes e estados dos controles. Autoplay bloqueado deve ter convite claro para assistir; erro de mídia deve liberar os trabalhos.

CONFIRMED: refinamento de navegação solicitado nas últimas capturas: remover Pausar, Visitar o ateliê e Vamos criar dos painéis de obras e Ana. Controles laterais Voltar e Avançar conduzem as cenas 2 e 3; indicador inferior apenas informa o progresso. Vídeo pausa ao toque e obras trocam ao deslizar. O espaço liberado amplia a mídia, preservando o gato visível sob o cabeçalho.

CONFIRMED: o usuário pediu baixar o outdoor de obras para mostrar o gato sob o cabeçalho, ampliar a mídia e o retrato da Ana. O CTA final deve abrir a página Comece pela ideia, translúcida sobre o letreiro final, terminando no formulário de cinco campos já autorizado. Páginas internas devem ser descobertas por links claros e funcionar como continuação da experiência. Menos repetição de botões e texto; fotos nos blocos Estrutura, Energia e Matéria; foto da artista em destaque antes da nota discreta do studio fictício.

CONFIRMED 23/09: a V1 passa a oferecer Português, English e Deutsch. O seletor de idioma fica exclusivamente na tela de loading, em controle discreto com bandeiras, e a escolha acompanha a experiência, as páginas internas e os links de navegação. As traduções são adaptadas ao idioma para preservar naturalidade; Ana Byte, Ana, São Paulo, Brasil, Jinx e demais nomes próprios permanecem inalterados. A solução é local, sem API externa, dependência nova ou custo recorrente, com Português como fallback e persistência por URL e armazenamento local. Gate aprovado sem lacunas críticas.

CONFIRMED 23/09: o usuário pediu contornos neon inspirados no componente Neon Border do OriginKit, com cores apropriadas para cada ação. Escopo isolado: botões existentes da experiência e das páginas complementares, sem alterar jornada, textos ou imagens. Recurso escolhido após o roteamento gratuito: CSS próprio com brilho de borda e traço móvel; sem pacote externo, código copiado ou custo. Ciano para retorno, contato e projeto; magenta para avanço e acervo. Movimento reduzido preserva a borda estática. Gate aprovado sem lacunas críticas.

CONFIRMED 23/09: após ver a primeira implementação, o usuário pediu neon mais intenso e linhas duplas. A alteração fica restrita ao desenho e à luminosidade dos mesmos botões; as duas linhas mantêm um intervalo escuro entre si e o traço móvel permanece apenas nas ações principais. Sem nova dependência ou mudança na jornada. Gate permanece aprovado.

CONFIRMED: publicação da V1 no GitHub Pages já autorizada e vigente. A V2 permanece em repositório separado. Formulário prepara WhatsApp, sem armazenamento ou envio automático. Nenhuma lacuna CRITICAL. Ready-to-Start Gate aprovado. Recursos: HTML/CSS/JS e GSAP já existentes; sem nova dependência. Referências reconferidas: The Spark, UI como parte da narrativa; ERA, progressão por capítulos. Sem copiar assets ou código.

Data: 23 de setembro de 2026.

| Item | Estado | Evidencia ou decisao |
|---|---|---|
| Negocio | CONFIRMED | Tatuagem e ilustracao autoral de Ana Byte |
| Objetivo | CONFIRMED | Portfolio com pedido de orcamento |
| Publico | CONFIRMED | Afinidade com linguagem cybergoth e trabalho autoral |
| CTA primario | CONFIRMED | WhatsApp informado no material enviado |
| Marca | CONFIRMED | EARLY STAGE BRAND com linguagem visual consistente |
| Conteudo | CONFIRMED | Dezessete imagens utilizaveis alem da captura de perfil |
| Referencia | CONFIRMED | ERA Residence como referencia de experiencia, sem copia |
| Paginas | CONFIRMED | Home, trabalhos, caso, sobre e orcamento |
| Integracao | CONFIRMED | Link simples para WhatsApp, sem formulario |
| Regras de agendamento | NOT APPLICABLE | Removidas por instrucao do usuario |
| Local | CONFIRMED TEMPORARIO | Studio demonstrativo em Sao Paulo |
| Dominio e hospedagem | UNKNOWN IMPORTANT | Nao bloqueiam construcao local; necessarios para publicar |
| Imagens adicionais do Instagram | UNCERTAIN OPTIONAL | Autorizadas, mas a sessao autenticada nao ficou disponivel |

Ready to Start Gate: aprovado para construcao local. Publicacao continua fora do escopo atual.

## Execução desktop autorizada em 23 de setembro de 2026

- CONFIRMED: executar o plano desktop salvo para a V1 na mesma URL, preservando o mobile aprovado sem alterações visuais.
- IMPLEMENTED: quatro panoramas próprios, painéis arquitetônicos horizontais, progressão vertical por rolagem no desktop, páginas complementares e formulário existentes.
- VERIFIED: 0 pixels diferentes nas quatro cenas mobile em 320 × 568 e 390 × 844 contra o commit aprovado; cenas desktop e navegação funcional conferidas localmente.
- LIMIT: masters gerados em 1672 × 941; não são 4K nativos. Publicação e verificação da URL pública registradas ao final da entrega.

## Atualização confirmada em 22 de setembro de 2026

- Objetivo da home: tour guiado por tatuagens reais, com prioridade total para celular.
- Direção: mais sombria, neon ciano e magenta, linguagem biotecnológica e editorial.
- Jornada: introdução “Preparando experiência”, expansão de fotos e capítulos conduzidos pela rolagem, inspirados no ritmo de ERA Residence.
- Interação: gestos horizontais nas fotos, navegação por capítulos, pontos de leitura, ampliação e comparação arrastável.
- Conteúdo: fotos da Ana e tatuagens fornecidas pelo usuário; referências visuais novas orientam a linguagem, sem incorporação de artes externas.
- CTA WhatsApp e local demonstrativo mantidos. Nenhuma lacuna crítica para essa revisão local.

## Ajuste posterior confirmado pelo usuário

- CONFIRMED: sequência background fixo, vídeo, transição, nova dobra. Botão inicia a viagem.
- CONFIRMED: arquivo de vídeo fornecido no disco D, já inspecionado e incorporado à prévia.
- CONFIRMED: loading deve aguardar Começar experiência.
- CONFIRMED: obras reunidas em um painel e Ana em outro painel arquitetônico; conteúdo interno translúcido, entrada lateral e retorno à cidade.
- CONFIRMED: ilustração em perspectiva é preferível; 3D é autorizado somente se melhorar o resultado. A sequência escolhida não exige WebGL.
- CONFIRMED: produzir conceito de letreiro アナ com preenchimento de tatuagens.
- IMPORTANT: continuidade geométrica exata entre vídeo e destino não existe no material atual. A passagem utiliza aproximação e dissolução, documentadas como tal.
- Gate aprovado para revisão local. Nenhuma pergunta crítica pendente. Detalhes de publicação não fazem parte desta alteração.
