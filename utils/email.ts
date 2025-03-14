import AppError from './AppError';
import dotenv from 'dotenv'
import { Resend } from 'resend';

dotenv.config();


const resend = new Resend(process.env.RESEND_API_KEY as string);

type Options = {
    from: any;
    email: string;
    subject: string;
    name: string; 
    message: string;
    otp?:any
};

const emailTemplate = (name: string, message: string, otp?: number) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aura-care Beauty</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #E3F2FD;">
        <header style="background-color: #1976D2; padding: 20px; text-align: center;">
            <img src="[Your-Logo-URL]" alt="Aura-care Logo" style="max-width: 150px; height: auto;">
            <h1 style="color: #FFFFFF; margin: 10px 0; font-size: 28px;">Aura-care Beauty</h1>
        </header>

        <main style="padding: 30px 25px;">
            <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">Dear <strong>${name}</strong>,</p>
            
            <div style="background-color: #FFFFFF; padding: 25px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p style="font-size: 15px; line-height: 1.6; color: #555555; margin: 0 0 20px 0;">${message}</p>
                
                ${otp ? `
                <div style="background-color: #BBDEFB; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <p style="font-size: 13px; color: #555555; margin: 0 0 10px 0;">Your verification code:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #0D47A1; letter-spacing: 2px;">${otp}</div>
                    <p style="font-size: 12px; color: #555555; margin: 10px 0 0 0;">This code expires in 10 minutes</p>
                </div>` : ''}
            </div>

            <p style="font-size: 14px; color: #666666; margin: 25px 0 0 0;">
                With love,<br>
                <strong>The Aura-care Team</strong><br>
                <span style="font-size: 12px; color: #999999;">Enhancing Your Natural Beauty</span>
            </p>
        </main>

        <footer style="background-color: #E3F2FD; padding: 20px; text-align: center;">
            <div style="font-size: 12px; color: #666666;">
                <p style="margin: 5px 0;">Follow us on 
                    <a href="[Instagram-URL]" style="color: #1976D2; text-decoration: none;">Instagram</a> | 
                    <a href="[Facebook-URL]" style="color: #1976D2; text-decoration: none;">Facebook</a>
                </p>
                <p style="margin: 5px 0;">123 Beauty Street, Paris, France</p>
                <p style="margin: 5px 0;">© ${
                    new Date(Date.now()).toISOString().replace("T", " ").split(".")[0]
                }Aura-care. All rights reserved</p>
            </div>
        </footer>
    </div>
</body>
</html>
`;

export const sendMail = async (options: Options) => {
    try {
        // Send the email using Resend
        const response = await resend.emails.send({
            from: options.from,
            to: options.email,
            subject: options.subject,
            html: emailTemplate(options.name, options.message, options?.otp),
        });

        return { message: 'Email sent successfully', response };
    } catch (error) {
        return new AppError(`Failed to send email: ${(error as Error).message}`, 500);
    }
};