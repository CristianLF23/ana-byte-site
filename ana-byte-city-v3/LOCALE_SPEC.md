# Idioma da V3

- Na primeira visita, o site consulta apenas o código do país do IP via `ipwho.is`. Brasil abre em português; qualquer outro país abre em inglês.
- A resposta guarda somente país e data no navegador por sete dias. A API gratuita permite uso comercial e tem limite de 1.000 consultas diárias por domínio; quando indisponível ou limitada, o fuso horário do navegador define o idioma aproximado.
- O controle PT / EN no menu grava a escolha manual. Essa escolha tem prioridade sobre o país em visitas futuras.
- A localização inclui interface, formulário, mensagens preparadas para WhatsApp, descrições e textos alternativos das 19 obras. Nomes próprios e fotografias originais permanecem intactos.
- Sem JavaScript, a página continua disponível em português. A localização automática no GitHub Pages é client-side e não altera o HTML recebido por robôs de busca ou prévias de redes sociais.

## Verificação

`npm run build`, `npm test` e `node qa/locale-country.cjs`. O último teste simula Brasil, Estados Unidos, Alemanha, falha da consulta e troca manual de idioma.
