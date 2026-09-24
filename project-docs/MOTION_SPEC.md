# Especificação de movimento — V1 atual

## Desktop: percurso editorial (24/09)

O desktop usa rolagem vertical nativa. A primeira tela mostra a cidade; a fotografia recua em escala e o título deixa o quadro em ritmo próprio. O vídeo e o painel de obras entram com o avanço da página. O acervo alterna imagens dominantes e menores, com aparições curtas, enquanto o visitante pode parar para examinar qualquer tatuagem em tamanho integral. A imagem da Ana e a seção de processo têm revelações próprias. O formulário encerra o mesmo documento.

Não há trilho horizontal, rolagem capturada, snap, pinning obrigatório nem setas de troca de capítulo no desktop. O movimento usa GSAP ScrollTrigger já presente no projeto, com transformações leves; o conteúdo mantém posição e ordem quando a animação termina. A camada de chuva desenha apenas na abertura visível e no painel final correspondente. Em `prefers-reduced-motion`, os elementos aparecem diretamente, sem parallax nem revelações.

## Mobile: preservar a V1 aprovada

O mobile continua com a introdução, a progressão por botões e as transições de câmera existentes. As regras novas do desktop só são ativadas em `(min-width: 1024px) and (min-aspect-ratio: 6/5)`. Ao mudar de orientação ou largura, o controle de cena é desmontado e as camadas de chuva migram para o contêiner correto. O formulário e o acervo seguem acessíveis pelas páginas complementares já existentes.

## Comportamento essencial

- O conteúdo principal, imagens e destinos de contato permanecem no HTML quando o JavaScript falha.
- O acervo abre uma imagem integral; teclado, Escape e retorno de foco são preservados.
- Nenhuma entrada de movimento deve manter texto ou controle oculto ao fim do trecho.
- Animações param fora do campo visual e com a aba oculta quando forem ambientais.
- Ao redimensionar, remover transformações transitórias e recalcular os pontos de ScrollTrigger.
