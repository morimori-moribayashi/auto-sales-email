import React from "react";
import { Send } from "lucide-react";

export const MailEditor = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-3rem)]">
          {/* 案件内容 */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">案件内容</h2>
            </div>
            <div className="p-4">
              <textarea
                className="w-full h-80 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="案件の詳細内容を入力してください..."
              />
            </div>
          </div>

          {/* メール本文 + 修正指示 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">メール本文</h2>
            </div>
            <div className="p-4">
              <textarea
                className="w-full h-48 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="メール本文を入力してください..."
              />
            </div>

            {/* 修正指示 */}
            <div className="border-t">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">修正指示</h2>
              </div>
              <div className="p-4">
                <div className="relative">
                  <textarea
                    className="w-full h-20 border border-gray-300 rounded-lg p-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="修正内容を入力してください..."
                  />
                  <button className="absolute right-3 bottom-3 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
