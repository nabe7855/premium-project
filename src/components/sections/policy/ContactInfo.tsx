'use client';
import React from 'react';
import { Phone, Mail, MessageCircle, User } from 'lucide-react';

export const ContactInfo: React.FC = () => {
  return (
    <section className="bg-pink-50 px-4 py-8">
      <div className="mx-auto max-w-sm sm:max-w-2xl lg:max-w-4xl">
        <h2 className="mb-6 text-center font-sans text-xl font-bold text-gray-800 sm:text-2xl">
          責任者・お問い合わせ情報
        </h2>

        <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
          <div className="space-y-6 sm:grid sm:grid-cols-1 sm:gap-6 lg:grid-cols-2 lg:space-y-0">
            <div>
              <div className="mb-3 flex items-center">
                <User className="mr-3 flex-shrink-0 text-red-600" size={20} />
                <h3 className="font-sans text-base font-bold text-gray-800 sm:text-lg">
                  個人情報取扱責任者
                </h3>
              </div>
              <p className="ml-8 font-serif text-sm text-gray-700 sm:text-base">
                個人情報保護管理者
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-sans text-base font-bold text-gray-800 sm:text-lg">
                お問い合わせ先
              </h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="mr-3 flex-shrink-0 text-red-600" size={18} />
                  <span className="font-serif text-sm text-gray-700 sm:text-base">
                    050-5212-5818
                  </span>
                </div>

                <div className="flex items-start">
                  <Mail className="mr-3 mt-0.5 flex-shrink-0 text-red-600" size={18} />
                  <span className="break-all font-serif text-sm text-gray-700 sm:text-base">
                    sutoroberrys@gmail.com
                  </span>
                </div>

                <div className="flex items-center">
                  <MessageCircle className="mr-3 flex-shrink-0 text-red-600" size={18} />
                  <a
                    href="/contact"
                    className="font-serif text-sm text-red-600 underline hover:text-red-700 sm:text-base"
                  >
                    お問い合わせフォーム
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
