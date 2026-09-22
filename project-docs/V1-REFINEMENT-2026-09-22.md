# Refinamento da V1

Escopo autorizado pelo usuário antes de retomar a V2. Preserva direção de arte, arquitetura estática, páginas internas, número de contato e os dois repositórios separados.

## Decisões

O acervo usa a composição existente do painel, ampliada no celular, com fotografia e vídeo em object-fit: cover. Essa escolha elimina o espaço lateral de adaptação. Fotografias completas continuam acessíveis no modal. O vídeo inicia sem som e sem repetição; ao terminar entra a primeira das 19 fotografias. O arquivo recebido não possui faixa de áudio.

O loading sincroniza recursos essenciais e uma sequência visual de 2,6 segundos. O botão continua desabilitado até 100%, com pequeno intervalo antes de habilitar. Não há entrada automática. Recurso indisponível libera o modo leve após o limite de carregamento existente.

Transição de cidade: arquivo H.264 de 2 segundos, sem áudio, com metadados no início. Mantidos os arquivos originais. Outros destinos não acionam esse vídeo. Movimento reduzido dispensa a transição e a reprodução automática do acervo.

Formulário local em dialog nativo: cinco informações solicitadas, campos identificados e obrigatórios, fechamento por Escape, foco devolvido ao convite. Os valores compõem apenas a URL de uma conversa do WhatsApp; nada é persistido. O teste intercepta a abertura da janela, sem enviar mensagens.

## Materiais

19-neon-portrait, 20-dual-souls, 21-cyber-instinct, 22-neon-raven: novas fotos fornecidas pelo usuário, apenas convertidas para JPEG.

23-ana-studio: retrato adicional fornecido pelo usuário.

ana-portfolio.mp4: vídeo fornecido de 25 segundos, preservado. Poster extraído do próprio vídeo.

gallery-facade-tuxedo.jpg e ana-neon-tuxedo.jpg: edição dos cenários existentes com referência do gato fornecida. Mantidas as versões anteriores para reversão.

## Verificação

Scripts: qa/v1-refresh.cjs, qa/v1-refresh-access.cjs. Jornada e interface verificadas no Chromium em emulação mobile e desktop. A cobertura não equivale a testes em aparelho físico nem em Safari.
