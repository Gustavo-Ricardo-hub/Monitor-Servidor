//dotenv para ler variáveis de ambiente do .env
require("dotenv").config();
//Importando: AXIOS para fazer requisições HTTP e Nodemailer para enviar emails
const axios = require("axios");
//Importando o Nodemailer para enviar emails
const nodemailer = require("nodemailer");
//Importando o módulo child_process para executar comandos do sistema (ping)
const { exec } = require("child_process");

const IP = process.env.LOCALHOST;
const URL = `http://${IP}:3000/status`;

let maquinaOffline = false;
let sistemaOffline = false;

// Configuração do email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function enviarEmail(mensagem) {
    try {
        await transporter.sendMail({
            from: "malosovobinskon@gmail.com",
            to: process.env.EMAIL_TO,
            subject: "Alerta de Servidor",
            text: mensagem
        });

        console.log("📧 Email enviado!");
    } catch(error) {
        console.log("Erro ao enviar email");
    }
}

// 🔵 Verifica se a máquina está ligada (PING)
// Explicação da função: Ela executa o comando ping para verificar se a máquina responde. Se não responder, considera a máquina offline e envia um email. Se voltar a responder, considera a máquina online e envia outro email.
function verificarPingAsync() {
        return new Promise((resolve) => {
            exec(`ping -n 1 ${IP}`, (error) => {
                if (error) {
                    if (!maquinaOffline) {
                        console.log("⚫ Máquina OFFLINE (energia caiu?)");
                        enviarEmail("⚫ Máquina offline (possível queda de energia)");
                        maquinaOffline = true;
                    }
                } else {
                    if (maquinaOffline) {
                        console.log("🟣 Máquina voltou");
                        enviarEmail("🟣 Máquina voltou a responder");
                        maquinaOffline = false;
                    }
                }
                resolve();
            });
        });
    }

// 🟢 Verifica se o sistema está funcionando (HTTP)
//Explicação da função: Ela tenta acessar a URL do servidor. Se conseguir, considera o sistema online. Se não conseguir, mas a máquina estiver online, considera o sistema offline e envia um email. Se o sistema voltar a funcionar, envia outro email.
async function verificarHTTP() {

        // 🚫 Se a máquina estiver offline, nem testa HTTP
        if (maquinaOffline) return;

        try {
            await axios.get(URL);

            if (sistemaOffline) {
                console.log("🟢 Sistema voltou");
                enviarEmail("🟢 Sistema voltou ao normal");
                sistemaOffline = false;
            } else {
                console.log("Sistema OK");
            }

        } catch (err) {
            if (!sistemaOffline) {
                console.log("🔴 Sistema caiu (mas máquina ligada)");
                enviarEmail("🔴 Sistema caiu, mas servidor ainda está ligado");
                sistemaOffline = true;
            }
        }
    }

// Loop principal
// A cada 5 segundos, verifica o ping e o HTTP
setInterval(async () => {
        await verificarPingAsync();
        await verificarHTTP();
    }, 5000);



//Como testar o monitoramento:
//1. Deixe o servidor rodando normalmente e observe os logs (deve mostrar "Servidor OK").
//2. Desligue a máquina (ou desconecte da rede) e veja o log mostrar "Máquina OFFLINE" e "Sistema caiu" (se a máquina estiver ligada).
//3. Ligue a máquina novamente e veja os logs mostrarem "Máquina voltou" e "Sistema voltou" (se o sistema voltar a funcionar).