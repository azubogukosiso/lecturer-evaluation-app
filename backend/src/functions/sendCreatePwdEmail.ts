import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

export const sendCreatePwdEmail = async (
  emailAddress: string,
  userId: string,
  role: string,
) => {
  const isProduction = process.env.NODE_ENV === "production";

  try {
    console.log(
      "Sending create password email to:",
      emailAddress,
      "with userId:",
      userId,
    );

    let emailAPI = new TransactionalEmailsApi();

    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not defined");
    }

    (emailAPI as any).authentications.apiKey.apiKey = process.env.BREVO_API_KEY;

    let message = new SendSmtpEmail();
    message.subject = `${role.charAt(0).toUpperCase() + role.slice(1)} Account Verification`;
    message.htmlContent = `<html><head></head><body style="font-size: 16px;"><p>Click the link below to verify your ${role} account.</p><p>You will be redirected to a page to create your password.</p><a style="background-color: red; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;" href="${process.env.CLIENT_URL}/create-password?role=${role}&id=${userId}">Verify your Account</a></p><p style="font-weight: bold;">Note: If you didn't request this, please ignore this email.</p></body></html>`;
    message.sender = {
      name: "ESUT Lecturers' Evaluation App",
      email: "azuboguko@gmail.com",
    };
    message.to = [
      {
        email: isProduction
          ? "directorictc@esut.edu.ng"
          : "azuboguko@gmail.com",
        name: "Name of Director",
      },
    ];
    // message.to = [{ email: emailAddress, name: "User" }];

    const response = await emailAPI.sendTransacEmail(message);

    if (response) {
      return "Email sent successfully!";
    }
  } catch (error) {
    console.log("Error sending email with PDF:", error);
    throw error;
  }
};
