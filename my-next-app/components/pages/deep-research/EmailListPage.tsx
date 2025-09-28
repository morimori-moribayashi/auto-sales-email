'use client';

import { useState, useEffect } from 'react';
import EmailDetailDialog from './EmailDetailDialog';
import { GmailThreadWithGrading } from '@/services/deep-research/tools';

type EmailListProps = {
  emails: GmailThreadWithGrading[] | undefined;
};

export default function EmailList({ emails }: EmailListProps) {
  const [selectedEmail, setSelectedEmail] = useState<GmailThreadWithGrading | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRowClick = (email: GmailThreadWithGrading) => {
    setSelectedEmail(email);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEmail(null);
  };

  if(!emails) return <>表示するメールがありません</>;

  return (
    <div className="container mx-auto p-4 w-[60vw] text-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-0 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  マッチ度
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  件名
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  送信者
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  受信日
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emails.map((email, index) => {
                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(email)}
                  >
                    <td className={`px-3 py-4 whitespace-nowrap text-sm`} style={{ maxWidth: '50px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {email.grade || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`} style={{ maxWidth: '800px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {email.subject || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`} style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {email.from?.replaceAll(`"`, '') || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`} style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {new Date(email.date).toLocaleDateString("ja-JP")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      {emails.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          メールが見つかりませんでした。
        </div>
      )}

      <EmailDetailDialog
        email={selectedEmail}
        open={dialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
