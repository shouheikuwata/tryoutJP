export function passwordResetText(resetUrl: string): string {
  return `パスワード再設定のリクエストを受け付けました。

以下のリンクからパスワードを再設定してください。
${resetUrl}

このリンクは15分間有効です。
心当たりがない場合は、本メールを無視してください。

---
Beauty Spot 運営事務局
`;
}

export function passwordResetHtml(resetUrl: string): string {
  return `
<div style="font-family: 'Hiragino Kaku Gothic ProN', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
  <h2 style="color: #7c2d3e; font-size: 18px;">パスワード再設定</h2>
  <p>パスワード再設定のリクエストを受け付けました。</p>
  <p>以下のリンクからパスワードを再設定してください。</p>
  <p><a href="${resetUrl}" style="color: #7c2d3e; text-decoration: underline;">パスワードを再設定する</a></p>
  <p style="color: #6b6b6b; font-size: 13px;">このリンクは15分間有効です。<br>心当たりがない場合は、本メールを無視してください。</p>
  <hr style="border: none; border-top: 1px solid #e5e0dc; margin: 24px 0;">
  <p style="color: #6b6b6b; font-size: 12px;">Beauty Spot 運営事務局</p>
</div>`;
}
