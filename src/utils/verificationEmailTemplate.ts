interface VerificationEmailTemplateProps {
  userName: string;
  verificationLink: string;
}

const verificationEmailTemplate = ({ userName, verificationLink }: VerificationEmailTemplateProps): string => {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background-color: #00A7D4; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff;">歡迎您, ${userName}!</h1>
                <p style="color: #ffffff; font-size: 18px;">感謝您註冊！請完成信箱驗證以啟用您的帳號。</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; text-align: center;">
                <p style="font-size: 16px; color: #555;">請點擊下方按鈕進行驗證：</p>
                <a href="${verificationLink}" 
                  style="background-color: #00A7D4; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block; margin-top: 20px;">
                  驗證信箱
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; text-align: center;">
                <p style="font-size: 14px; color: #999;">如果按鈕無法正常運作，您可以點擊以下連結：</p>
                <p style="font-size: 14px;">
                  <a href="${verificationLink}" style="color: #00A7D4;">${verificationLink}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f5f5f5; padding: 20px; text-align: center;">
                <p style="font-size: 12px; color: #999;">此信件為系統自動發送，請勿回覆。</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; text-align: center;">
                <p style="font-size: 12px; color: #999;">
                  Powered by <strong><a href="${siteUrl}" style="color: #00A7D4; text-decoration: none;">${siteName}</a></strong>
                </p>
                <p style="font-size: 12px; color: #999;">
                  &copy; ${new Date().getFullYear()} <a href="${siteUrl}" style="color: #00A7D4; text-decoration: none;">${siteName}</a>. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </div>
      `;
};

export default verificationEmailTemplate;
