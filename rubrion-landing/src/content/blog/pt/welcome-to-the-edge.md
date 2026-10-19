---
title: "Bem-vindo à borda: publicar sem o imposto do sucesso"
excerpt: "Por que criamos o EdgeLetter: sua publicação e sua lista são suas, em uma infraestrutura que custa centavos para rodar."
date: 2026-04-30
category: product
minutes: 3
cover: /work/edgeletter-1600.webp
---

Se você está lendo isto, está vendo o primeiro post publicado com o **EdgeLetter**, o motor de publicação criado pela Rubrion.

Há anos, quem escreve, funda empresas ou constrói uma audiência precisa fazer uma escolha frustrante:

1. **O monólito (WordPress):** administrar plugins sem fim, pagar por hospedagem pesada e lutar contra páginas lentas só para publicar um artigo.
2. **O "imposto do sucesso" (Substack):** uma interface bonita e simples, em troca de **10% da sua receita** para sempre e nenhum controle sobre o código ou a reputação do seu domínio.

Criamos esta plataforma porque você não deveria ter que escolher entre ser dono da sua plataforma e publicar sem atrito.

## Code-free, cloud-fee

A plataforma segue uma filosofia simples: **máximo desempenho, zero manutenção e propriedade total.**

Ela roda em infraestrutura serverless na borda da Cloudflare, sem servidores para cuidar. O resultado é uma plataforma que custa centavos para rodar, cresce junto com a sua audiência e não exige nenhum conhecimento de DevOps.

### O que a torna diferente

- **Sem hidratação no navegador:** as páginas são renderizadas no servidor antes de chegar ao navegador. Sem carregamentos, sem scripts pesados, só HTML rápido que os buscadores adoram.
- **Uma única fonte:** escreva uma vez. Ao publicar, o post vai para a web e o mesmo HTML vai para a caixa de entrada dos assinantes.
- **Entrega inteligente:** APIs de e-mail via HTTP para grandes envios, ou SMTP comum, tudo em segundo plano.
- **Totalmente white-label:** sem selos de "Powered by" e sem recomendações forçadas. Seu logo, seu domínio, sua marca.

> Sua audiência é o seu ativo mais valioso. Alugar as ferramentas para alcançá-la é um risco; ser dono da infraestrutura é uma vantagem.

## Por baixo do capô

- **Frontend e API:** Astro na Cloudflare.
- **Banco de dados:** Cloudflare D1, SQLite distribuído na borda.
- **Estilo:** Tailwind CSS com variáveis CSS por cliente.
- **Entrega:** APIs de e-mail via REST ao lado de serviços SMTP isolados.

## Sua vez

Este post é um exemplo vivo de como a publicação da sua marca pode ser: tipografia limpa, entrega confiável e controle total.

Se você cansou de alugar sua audiência e pagar o imposto do sucesso, [vamos conversar](/#contact).
