import React, { useState } from 'react';
import { Trophy, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { AuthModal } from './AuthModal';

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuthStore();

  return (
    <>
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Floorball Hub</span>
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-300">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="btn-secondary"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="btn-primary"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}