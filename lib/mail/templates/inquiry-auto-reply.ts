export function inquiryAutoReplyText(contactName: string, materialUrl: string): string {
  return `${contactName} 様

この度はBeauty Spotへお問い合わせいただき、誠にありがとうございます。

以下のリンクより資料をダウンロードいただけます。
${materialUrl}

担当者より改めてご連絡いたします。
今しばらくお待ちくださいませ。

---
Beauty Spot 運営事務局
`;
}

export function inquiryAutoReplyHtml(contactName: string, materialUrl: string): string {
  return `
<div style="font-family: 'Hiragino Kaku Gothic ProN', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
  <h2 style="color: #7c2d3e; font-size: 18px;">お問い合わせありがとうございます</h2>
  <p>${contactName} 様</p>
  <p>この度はBeauty Spotへお問い合わせいただき、誠にありがとうございます。</p>
  <p>以下のリンクより資料をダウンロードいただけます。</p>
  <p><a href="${materialUrl}" style="color: #7c2d3e; text-decoration: underline;">資料ダウンロード</a></p>
  <p>担当者より改めてご連絡いたします。<br>今しばらくお待ちくださいませ。</p>
  <hr style="border: none; border-top: 1px solid #e5e0dc; margin: 24px 0;">
  <p style="color: #6b6b6b; font-size: 12px;">Beauty Spot 運営事務局</p>
</div>`;
}
