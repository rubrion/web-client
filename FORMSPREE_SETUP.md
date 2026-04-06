# Configuração do EmailJS para Formulário de Contato

## Passos para Configurar o EmailJS

### 1. Criar Conta no EmailJS
1. Acesse [emailjs.com](https://www.emailjs.com)
2. Crie uma conta gratuita
3. Faça login na sua conta

### 2. Configurar Serviço de Email
1. No dashboard, vá para "Email Services"
2. Clique em "Add New Service"
3. Escolha seu provedor de email (Gmail, Outlook, etc.)
4. Configure as credenciais:
   - **Service ID**: Anote este ID (ex: `service_rubrion`)
   - **Email**: Seu email para receber mensagens
   - **Configurações SMTP**: Siga as instruções específicas do provedor

### 3. Criar Template de Email
1. Vá para "Email Templates"
2. Clique em "Create New Template"
3. Configure o template:
   - **Template ID**: Anote este ID (ex: `template_contact`)
   - **Subject**: `Nova mensagem do site Rubrion - {{name}}`
   - **Content**: 
     ```
     Nova mensagem recebida do site:
     
     Nome: {{name}}
     Email: {{email}}
     Empresa: {{company}}
     
     Mensagem:
     {{message}}
     ```

### 4. Obter Chave Pública
1. Vá para "Account" > "General"
2. Copie sua **Public Key** (ex: `your_public_key`)

### 5. Atualizar o Código
1. Abra o arquivo `src/pages/Home.tsx`
2. Encontre as linhas:
   ```typescript
   const result = await emailjs.sendForm(
     'service_rubrion', // Service ID - replace with your EmailJS service ID
     'template_contact', // Template ID - replace with your EmailJS template ID
     formRef.current!,
     'your_public_key' // Public Key - replace with your EmailJS public key
   );
   ```
3. Substitua pelos seus valores reais:
   - `'service_rubrion'` → Seu Service ID
   - `'template_contact'` → Seu Template ID
   - `'your_public_key'` → Sua Public Key

### 6. Configurações de Segurança (Recomendado)
1. No dashboard, vá para "Account" > "Security"
2. Configure **Domain Whitelist**:
   - Adicione `localhost` para desenvolvimento
   - Adicione seu domínio de produção
3. Configure **Rate Limiting** para prevenir spam

### 7. Testar o Formulário
1. Execute o projeto: `npm run dev`
2. Navegue até a seção de contato
3. Preencha e envie o formulário
4. Verifique se recebeu o email

## Recursos do EmailJS Gratuito
- 200 emails por mês
- Múltiplos serviços de email
- Templates personalizáveis
- Proteção contra spam básica

## Recursos Premium
- Emails ilimitados
- Remoção da marca EmailJS
- Webhooks
- Analytics avançados
- Suporte prioritário

## Configuração Avançada

### Auto-resposta para o Usuário
1. Crie um segundo template para auto-resposta
2. Configure no código para enviar dois emails:
   ```typescript
   // Email para você
   await emailjs.sendForm('service_id', 'template_admin', form, 'public_key');
   
   // Auto-resposta para o usuário
   await emailjs.send('service_id', 'template_autoresponse', {
     to_email: formData.email,
     to_name: formData.name
   }, 'public_key');
   ```

### Integração com Google Analytics
```typescript
// Rastrear envios de formulário
gtag('event', 'form_submit', {
  event_category: 'Contact',
  event_label: 'Contact Form'
});
```

## Alternativas ao EmailJS
Se precisar de mais recursos, considere:
- **Formspree** (formulários estáticos)
- **Netlify Forms** (se hospedar na Netlify)
- **Getform.io** (similar ao EmailJS)
- **Web3Forms** (sem cadastro necessário)

## Segurança
- Configure domain whitelist para prevenir uso não autorizado
- Use rate limiting para prevenir spam
- Nunca exponha credenciais sensíveis no frontend
- Configure CAPTCHA se necessário

## Troubleshooting

### Formulário não envia
1. Verifique se os IDs estão corretos (Service, Template, Public Key)
2. Confirme que os nomes dos campos no template coincidem com os do formulário
3. Verifique o console do navegador para erros
4. Teste a configuração no dashboard do EmailJS

### Não recebo emails
1. Verifique a pasta de spam
2. Confirme a configuração do serviço de email
3. Teste o template no dashboard do EmailJS
4. Verifique se o domínio está na whitelist

### Erro de CORS
- O EmailJS resolve CORS automaticamente
- Se houver problemas, verifique se está usando HTTPS em produção
- Confirme que o domínio está na whitelist

### Rate Limit Exceeded
- Aguarde alguns minutos antes de tentar novamente
- Configure rate limiting adequado no dashboard
- Considere upgrade para plano premium se necessário
