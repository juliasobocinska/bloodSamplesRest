const nodemailer = require('nodemailer');

// Konfiguracja wirtualnej skrzynki deweloperskiej Mailtrap
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

const sendResultEmail = async (patientEmail, testName, interpretation) => {
    try {
        const mailOptions = {
            from: '"Laboratorium CenterLab" <system@centerlab.pl>',
            to: patientEmail,
            subject: `Nowy wynik badania: ${testName}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #2e1f15;">
                    <h2 style="color: #8b5a2b;">CenterLab - Wyniki Badań</h2>
                    <p>Witaj,</p>
                    <p>Informujemy, że w systemie pojawił się wynik badania: <strong>${testName}</strong>.</p>
                    <p>Interpretacja: <strong>${interpretation}</strong></p>
                    <p>Wiadomość wysłana na adres: ${patientEmail}</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Mailtrap] Wiadomość schowana w sandboxie dla: ${patientEmail}`);
        return true;
    } catch (error) {
        console.error("Błąd wirtualnej wysyłki Mailtrap:", error);
        return false;
    }
};

module.exports = { sendResultEmail };