// api/src/services/emailService.js
import nodemailer from "nodemailer";

// 1. Créer un "transporteur" SMTP réutilisable
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Créer une fonction pour envoyer l'e-mail de notification
export async function sendAssignmentNotification(user, card, board) {
  const subject = `Vous avez été assigné à la carte "${card.title}"`;
  const text = `
    Bonjour ${user.name},

    Vous venez d'être assigné à la carte "${card.title}" dans le projet "${board.title}".

    Vous pouvez consulter le projet ici : ${process.env.CORS_ORIGIN}/board/${board.id}

    L'équipe EpiTrello
  `;
  const html = `
    <p>Bonjour ${user.name},</p>
    <p>Vous venez d'être assigné à la carte <strong>"${card.title}"</strong> dans le projet <strong>"${board.title}"</strong>.</p>
    <p>Cliquez sur le lien ci-dessous pour voir le projet :</p>
    <a href="${process.env.CORS_ORIGIN}/board/${board.id}">Accéder au projet</a>
    <br>
    <p>L'équipe EpiTrello</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: subject,
      text: text,
      html: html,
    });
    console.log(
      `Notification envoyée à ${user.email} pour la carte ${card.id}`,
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail de notification:", error);
  }
}
