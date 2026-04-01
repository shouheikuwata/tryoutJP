export function inquiryAdminNotificationText(data: {
  companyName: string;
  contactName: string;
  email: string;
  facilityName: string;
}): string {
  return `新しいお問い合わせがありました。

会社名: ${data.companyName}
担当者名: ${data.contactName}
メール: ${data.email}
施設名: ${data.facilityName}

管理画面から詳細を確認してください。
`;
}
