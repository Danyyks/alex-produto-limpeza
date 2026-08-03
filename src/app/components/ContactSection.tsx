import { Instagram, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { BRAND_CONTACT, buildWhatsappLink } from '../config/brand';

export function ContactSection() {
  const hasInstagram = Boolean(BRAND_CONTACT.instagramUrl);

  const openWhatsapp = () => {
    if (!BRAND_CONTACT.whatsappNumber) {
      alert(
        'Número de WhatsApp da loja não está configurado neste ambiente. Avise o responsável pelo site.',
      );
      return;
    }
    // Navegação direta (sem nova aba): em PWA instalado no Android, abrir em
    // nova aba/janela falha por não existir "aba" pra abrir. Ver CLAUDE.md.
    window.location.href = buildWhatsappLink(
      'Olá! Gostaria de saber mais sobre os produtos da RB Clean.',
    );
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs md:text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Contato:
      </span>

      <div className="flex items-center gap-2.5">
        <motion.button
          type="button"
          onClick={openWhatsapp}
          aria-label="Falar no WhatsApp"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-sm hover:shadow-md transition-colors duration-200"
        >
          <WhatsAppIcon className="w-4 h-4" />
        </motion.button>

        <motion.a
          href={hasInstagram ? BRAND_CONTACT.instagramUrl : undefined}
          aria-label={hasInstagram ? 'Abrir Instagram' : 'Instagram em breve'}
          aria-disabled={!hasInstagram}
          whileHover={hasInstagram ? { scale: 1.1 } : undefined}
          whileTap={hasInstagram ? { scale: 0.92 } : undefined}
          className={`w-9 h-9 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white flex items-center justify-center shadow-sm transition-shadow duration-200 ${
            hasInstagram ? 'hover:shadow-md' : 'opacity-45 cursor-default'
          }`}
        >
          <Instagram className="w-4 h-4" />
        </motion.a>

        <motion.a
          href={`mailto:${BRAND_CONTACT.email}`}
          aria-label="Enviar e-mail"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <Mail className="w-4 h-4" />
        </motion.a>
      </div>
    </div>
  );
}
