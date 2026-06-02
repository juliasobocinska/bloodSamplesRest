const { Resend } = require('resend');

// Wstaw swój klucz API tutaj (lub najlepiej do pliku .env!)
const resend = new Resend('re_hWVkNqdY_w58EKVBbuTbBvEwMDiFQGQuP');

const sendResultEmail = async (patientEmail, testName, interpretation) => {
    try {
        const data = await resend.emails.send({
            from: 'Laboratorium <onboarding@resend.dev>', // W Resend na darmowym planie używasz ich domeny
            to: patientEmail,
            subject: `Nowy wynik badania: ${testName}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #2e1f15;">
                    <h2 style="color: #8b5a2b;">CenterLab - Wyniki Badań</h2>
                    <p>Witaj,</p>
                    <p>Informujemy, że w systemie pojawił się wynik Twojego badania: <strong>${testName}</strong>.</p>
                    <p>Interpretacja: <strong>${interpretation}</strong></p>
                    <p>Zaloguj się do swojego panelu, aby sprawdzić szczegóły.</p>
                </div>
            `
        });

        console.log('E-mail wysłany przez Resend!', data);
        return true;
    } catch (error) {
        console.error('Błąd Resend:', error);
        return false;
    }
};

module.exports = { sendResultEmail };