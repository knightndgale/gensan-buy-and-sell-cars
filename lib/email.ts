import { Resend } from "resend";

function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const SENDER = "Gensan Car Buy & Sell <onboarding@resend.dev>";

export async function sendSellerWelcomeEmail(
  to: string,
  password: string,
  dealershipName: string
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not set; skipping seller welcome email");
    return false;
  }

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gensancars.com").replace(/\/$/, "");
  const loginUrl = `${baseUrl}/seller/login`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #1a1a1a;">Your Gensan Car Buy & Sell Seller Account</h2>
  <p>Hi${dealershipName && dealershipName !== "New Dealer" ? ` ${dealershipName}` : ""},</p>
  <p>Your seller account for Gensan Car Buy & Sell has been created.</p>
  <p><strong>Email:</strong> ${to}</p>
  <p><strong>Temporary password:</strong> <code style="background: #f4f4f4; padding: 4px 8px; border-radius: 4px;">${password}</code></p>
  <p><a href="${loginUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Log in</a></p>
  <p style="color: #666; font-size: 14px;">Please change your password after your first login.</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="color: #888; font-size: 12px;">General Santos City&apos;s trusted platform for buying and selling cars.</p>
</body>
</html>
`.trim();

  try {
    const { error } = await resend.emails.send({
      from: SENDER,
      to,
      subject: "Your Gensan Car Buy & Sell Seller Account",
      html,
    });
    if (error) {
      console.error("Resend send error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to send seller welcome email:", err);
    return false;
  }
}
