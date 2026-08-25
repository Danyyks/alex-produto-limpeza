import { defineConfig, minimal2023Preset as basePreset } from '@vite-pwa/assets-generator/config';

// A cor de fundo do "safe zone" dos ícones maskable/apple precisa bater com o
// fundo de public/app-icon-source.png (branco, igual ao resto da logo — ver
// CLAUDE.md) pra não criar uma borda de cor diferente ao redor do ícone.
const ICON_BACKGROUND = '#ffffff';

const preset = {
  ...basePreset,
  maskable: {
    ...basePreset.maskable,
    resizeOptions: { fit: 'contain' as const, background: ICON_BACKGROUND },
  },
  apple: {
    ...basePreset.apple,
    resizeOptions: { fit: 'contain' as const, background: ICON_BACKGROUND },
  },
};

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset,
  images: ['public/app-icon-source.png'],
});
