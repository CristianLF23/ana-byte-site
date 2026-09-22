# Ana Byte V2 • Tour pela pele

Site estático com cinco páginas: início, trabalhos, estudo visual, sobre e orçamento. Abra `index.html` para navegar diretamente, ou execute `node preview.cjs` e acesse http://127.0.0.1:4178.

As imagens fornecidas foram otimizadas para JPEG. O site não depende de instalação ou de serviços externos para renderizar. Os links do WhatsApp abrem uma mensagem que o visitante revisa antes de enviar.

## Entrega local

Direção: corpo, circuito e luz. A home foi refeita como uma experiência prioritária para celular: introdução cyberpunk, cenas de tatuagem conduzidas pela rolagem, gestos horizontais nas fotografias, pontos de leitura, ampliação e comparação arrastável. Base quase preta, magenta e ciano com falhas luminosas localizadas. Studio Byte Lab é fictício e está identificado como local demonstrativo. Não há regras de agendamento.

O telefone foi transcrito da captura fornecida: +55 11 91900 7582. Confirmar vigência antes de publicar. Sem publicação realizada.

## Validação

Chromium local: 25 combinações de rota/largura em 360, 390, 430, 768 e 1440 px; imagens, overflow, título e destino WhatsApp. Movimento normal conferido em 360×740, 375×667, 430×932, 768×1024 e 1440×900, além de 390×844. Posição fixa das cenas e transformação por rolagem medidas. Testes por toque: gesto horizontal, capítulos, hotspots, modal e slider; teclado, menu, movimento reduzido e conteúdo sem JavaScript. Relatórios atuais: qa/v2-regression-results.json e qa/mobile-experience-results.json.

## Como experimentar

1. Abra a prévia local e use uma janela estreita ou a emulação de celular.
2. A introdução aparece uma vez por sessão e pode ser pulada com Entrar agora ou Escape.
3. Role a abertura ou toque em Explorar as tatuagens. Continue rolando para aproximar cada obra.
4. Deslize horizontalmente sobre a foto para mudar de capítulo, ou use os números e Próxima obra.
5. Toque no ponto luminoso para ler a composição; toque na imagem para ampliá-la.
6. Em Da tela à pele, arraste a foto ou o controle inferior. Pausar luzes suspende o movimento ambiente.

Arquivos da revisão: index.html, assets/tour.css, assets/atmosphere.css, assets/tour.js, assets/intro.css, assets/intro.js e correção de leitura da legenda em assets/app.js. Fonte e bibliotecas locais em assets/fonts e assets/vendor. Documentação de decisões, motion, referências e linguagem gráfica em project-docs.

Não há etapa de build: são arquivos estáticos. Todo o diretório assets soma aproximadamente 1,96 MB; isso não representa uma medição de desempenho em produção. Barlow Condensed usa SIL OFL 1.1; GSAP 3.13.0 usa a licença padrão do fornecedor. As artes dos moodboards não foram incorporadas.

Limitações: o navegador integrado e o acesso autenticado ao Instagram não ficaram disponíveis; o acervo desta versão é o fornecido pelo usuário. Não houve envio de mensagens. Safari, aparelhos físicos e métricas de desempenho em produção não foram testados. A checagem de acessibilidade é funcional, não uma certificação WCAG.
