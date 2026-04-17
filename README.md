# 🚀 Monitor de Servidores (Node.js)

Sistema simples e eficiente para monitoramento de servidores, com detecção de falhas de aplicação e queda de máquina (energia/rede), enviando alertas automáticos por email.

---

## 📌 Funcionalidades

* 🔵 Verificação de conectividade via **Ping**
* 🟢 Monitoramento de aplicação via **HTTP**
* ⚡ Detecção de queda de energia (máquina offline)
* 🔴 Detecção de falha no sistema (aplicação caiu)
* 📧 Envio de alertas automáticos por email
* 🧠 Diferenciação inteligente de falhas
* 🔒 Uso de variáveis de ambiente (.env)

---

## 🧠 Como funciona

O sistema realiza dois tipos de monitoramento:

* **Ping (ICMP)** → verifica se a máquina está ligada
* **HTTP** → verifica se o sistema está funcionando

Com isso, é possível identificar:

| Situação        | Resultado                   |
| --------------- | --------------------------- |
| Máquina OFFLINE | ⚫ Possível queda de energia |
| Sistema caiu    | 🔴 Aplicação fora do ar     |
| Tudo OK         | 🟢 Funcionando normalmente  |

---

## 📂 Estrutura do projeto

```
Monitor-Servidor/
│
├── monitor.js        # Script principal de monitoramento
├── server.js         # Servidor de teste (endpoint /status)
├── package.json
├── .env              # Variáveis de ambiente (NÃO subir)
├── .gitignore
```

---

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

---

### 2. Criar arquivo `.env`

```env
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha_app
EMAIL_TO=email_destino@gmail.com

SERVER_IP=127.0.0.1
SERVER_PORT=3000
```

---

### 3. Rodar o servidor (teste)

```bash
node server.js
```

---

### 4. Rodar o monitor

```bash
node monitor.js
```

---

## 🧪 Testes

### ✔ Sistema funcionando

* Resultado: `Sistema OK`

### 🔴 Derrubar aplicação

* Pare o server (`CTRL + C`)
* Resultado: alerta de sistema

### ⚫ Simular queda de máquina

* Alterar IP para inválido
* Resultado: alerta de máquina offline

---

## 🔒 Segurança

* Credenciais protegidas via `.env`
* `.env` ignorado pelo `.gitignore`
* Sem exposição de dados sensíveis no código

---

## 💬 Aplicação real

Este sistema pode ser utilizado para:

* Monitorar servidores internos
* Detectar quedas de energia
* Acompanhar disponibilidade de APIs
* Enviar alertas automáticos para equipes

---

## 📈 Possíveis melhorias

* Dashboard web 📊
* Histórico de uptime
* Integração com Telegram 📱
* Execução como serviço (24h)
* Monitoramento de banco de dados

---

## 👨‍💻 Autor

Projeto desenvolvido por **Gustavo Henrique Ricardo**

---

## ⚡ Observação

Para uso em ambiente corporativo, pode ser necessário liberar portas no firewall para acesso HTTP.
