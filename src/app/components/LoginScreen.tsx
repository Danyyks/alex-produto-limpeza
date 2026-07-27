import { useState } from 'react';
import { motion } from 'motion/react';
import { BrandMark } from './BrandMark';
import { Button } from './Button';
import { BRAND_NAME, BRAND_SUBTITLE, BRAND_TEXT } from '../config/brand';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            className="mx-auto mb-6"
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BrandMark className="w-24 h-24 mx-auto" />
          </motion.div>
          <h1 className="text-3xl font-semibold mb-1">{BRAND_NAME}</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-3">
            {BRAND_SUBTITLE}
          </p>
          <p className="text-muted-foreground">{BRAND_TEXT.loginWelcome}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Qual é o seu nome?
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome..."
              autoFocus
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
              required
            />
          </div>

          <Button
            type="submit"
            variant="hero"
            className="w-full text-lg"
          >
            Entrar na Loja
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">{BRAND_TEXT.loginTagline}</p>
        </div>
      </motion.div>
    </div>
  );
}
