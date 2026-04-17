require("dotenv").config();
const axios = require("axios");
const nodemailer = require("nodemailer");
const { exec } = require("child_process");

//const IP = "10.23.176.227"; // SERVIDOR
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
setInterval(async () => {
        await verificarPingAsync();
        await verificarHTTP();
    }, 5000);