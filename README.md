# Ana Byte V1

Experiência estática para celular, com quatro destinos: cidade, obras, Ana e contato. A V2 experimental pertence a outro repositório.

Publicado em https://cristianlf23.github.io/ana-byte-site/

## Revisão de 22 de setembro de 2026

- Preparação visual de pelo menos 2,6 segundos, barra progressiva e entrada somente após o toque no botão habilitado.
- Identidade ANA BYTE sem emojis, barra azul neon e convite inicial com fundo.
- Vídeo de deslocamento cortado fisicamente para 2 segundos e usado apenas de Cidade para Obras. Outros destinos têm dissolução curta.
- Outdoor de obras ampliado e mais alto, retrato da artista na terceira dobra. A rolagem vertical conduz os quatro destinos, sincronizada com as setas neon dos cantos inferiores. Obras e Ana têm Voltar e Avançar; a última dobra tem somente Voltar. A faixa inferior indica a etapa atual.
- Vídeo fornecido pelo usuário de 25 segundos como primeira mídia do acervo. Depois entram 19 imagens. Toque no vídeo pausa ou retoma; deslize sobre a mídia muda a obra; toque na fotografia abre a ampliação. Ver acervo mostra a coleção completa. Os antigos botões Pausar, Visitar o ateliê e Vamos criar foram removidos dos painéis.
- A capa de espera do vídeo é uma tatuagem. Bloqueio de reprodução automática mostra Assistir ao vídeo; erro de carregamento libera o acervo. As verificações adicionais v1-video-recovery.cjs e v1-native-scroll.cjs cobrem falha de mídia, bloqueio de autoplay, cancelamento interno, rolagem vertical por roda/toque e retorno das páginas complementares.
- Vídeo e imagens preenchem o visor sem faixas laterais. O enquadramento usa recorte central; a ampliação mantém a fotografia completa.
- Nova foto de Ana no painel da artista. Gatos dos painéis de obras e contato adaptados à referência de pelagem preta e branca.
- Convite final abre a página complementar Comece pela ideia com entrada lateral, fundo translúcido sobre o letreiro final, orientações curtas e formulário ao fim: nome, idade, ideia, região do corpo e tamanho. A mensagem é preparada no WhatsApp para revisão pelo visitante. Nenhum dado é armazenado ou enviado automaticamente.
- Páginas complementares compartilham navegação A Ana, Projetos e Sua ideia, além de retorno fixo à cidade. A página da artista mostra obras em Estrutura, Energia e Matéria, depois seu retrato em destaque e a nota secundária de local demonstrativo.

## Executar e verificar

Sem instalação ou build. Execute node preview.cjs e abra http://127.0.0.1:4178/.

Os scripts qa/v1-navigation.cjs, qa/v1-complement.cjs e qa/v1-complement-routes.cjs verificam jornada, preparação inicial, vídeo, galeria, formulário, retorno interno, movimento reduzido e conteúdo sem JavaScript. Os antigos pontos de entrada v1-refresh.cjs e v1-refresh-access.cjs encaminham para as verificações atuais. Usam a instalação local de Playwright identificada no início de cada arquivo. QA_URL permite testar a publicação.

Validação visual e funcional em Chromium, com telas de 390×844, 360×640 e 1440×900. Capturas locais em qa/v1-navigation/ e qa/v1-complement/. Aparelhos físicos e Safari não foram testados.

## Conteúdo e recursos

Fotos e vídeos fornecidos pelo usuário. As versões JPG são somente otimizações de formato; as fotos das tatuagens e da artista não foram retocadas. Cenários dos letreiros reaproveitam a direção da V1; a alteração dos gatos foi feita com geração de imagem e revisada visualmente.

Fontes e bibliotecas são locais. Barlow Condensed usa SIL OFL 1.1; GSAP 3.13.0 permanece na instalação existente. O WhatsApp usa o mesmo destino aprovado da V1: +55 11 91900 7582. Studio Byte Lab é fictício e aparece como local demonstrativo. Não há regras de agendamento.
