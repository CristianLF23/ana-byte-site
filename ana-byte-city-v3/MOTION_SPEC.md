# Motion da V3 — capítulos em movimento

## Intenção

Dar à rolagem vertical uma progressão cinematográfica sem capturar a roda do mouse ou atrasar a leitura. A cidade, os títulos e as fotografias da Ana devem parecer planos com profundidades distintas. A gravação da ERA orienta o ritmo; os recortes, as imagens e a composição permanecem próprios da Ana Byte.

## Sequência

1. Os títulos de Arquivo Vivo, Processo, Sobre e Contato surgem de baixo com um impulso curto, ultrapassam levemente sua posição e assentam. O avanço é reversível com o scroll.
2. A foto do cabeçalho do acervo se abre por recorte enquanto se aproxima. O segundo retrato real da Ana permanece estático para dar pausa à narrativa visual.
3. Nos três trabalhos de processo, a janela com a imagem sobe de dentro do frame. A cortina e o progresso existentes continuam a revelar o desenho e a tatuagem.

## Limites e validação

- GSAP e ScrollTrigger locais, sem dependências ou assets novos.
- Animar poucos planos, preferindo transform e opacity; usar clip-path apenas no retrato do acervo e nos títulos.
- Distâncias menores no celular, sem pin adicional. Rolagem e links continuam nativos.
- Em movimento reduzido, sem JavaScript ou com os efeitos pausados, todo o conteúdo permanece visível e estático.
- Verificar entrada, reversão, troca de tamanho, navegação por âncora, filtros do acervo e ausência de overflow em desktop e mobile.

Referências de princípio: [ERA Residence](https://www.era-residence.com/), [Sticky Grid Scroll](https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/) e [SVG Mask Transitions](https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/). Nenhum código ou elemento visual dessas referências é incorporado.
