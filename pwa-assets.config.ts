import { defineConfig, minimal2023Preset as basePreset } from '@vite-pwa/assets-generator/config';

// A cor de fundo do "safe zone" dos ícones maskable/apple precisa bater com o
// azul sólido de public/app-icon-source.png — o padrão do preset é branco,
// o que criava bordas brancas visíveis no ícone adaptativo do Android.
const ICON_BACKGROUND = '#93B8FE';

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
