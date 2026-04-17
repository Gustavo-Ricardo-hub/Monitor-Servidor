////SHITF+ALT+F

//Importando: AXIOS para fazer requisições HTTP e Nodemailer para enviar emails
const axios = require("axios");
//Importando o Nodemailer para enviar emails
const nodemailer = require("nodemailer");



//Define a URL do servidor a ser monitorado, usando uma variável de ambiente ou um valor padrão
const URL = process.env.URL || "http://localhost:3000/status";

let offline = false;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "malosovobinskon@gmail.com",
        pass: "woxm amcy misc mhds"
    }
});

async function enviarEmail(mensagem) {
    try {
        await transporter.sendMail({
            from: "malosovobinskon@gmail.com",
            to: "gustavoricardo3dev@gmail.com",
            subject: "Alerta de Servidor",
            text: mensagem
        });

        console.log("📧 Email enviado!");
    } catch (error) {
        console.log("⚠️ Falha ao enviar email, tentando novamente depois...");
    }
}

setInterval(async () => {
    try {
        await axios.get(URL);

        if (offline) {
            console.log("🟢 Voltou!");
            enviarEmail("🟢 Servidor voltou ao normal!");
            offline = false;
        } else {
            console.log("Servidor OK");
        }

    } catch (err) {
        if (!offline) {
            console.log("🔴 Caiu!");
            offline = true;
            enviarEmail("🚨 ALERTA: Servidor caiu!");
        }
    }
}, 3000);