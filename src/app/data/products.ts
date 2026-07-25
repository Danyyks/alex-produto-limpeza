import type { MenuItem } from '../types/menu';
import type { Category } from '../config/categories';

/**
 * Catálogo fixo no código (temporário).
 *
 * Enquanto não integramos o Firebase, os produtos ficam aqui como dados
 * de exemplo — sem admin, sem banco de dados. Para adicionar/editar/remover
 * produtos, edite este arquivo diretamente.
 *
 * Fotos: Unsplash (licença livre, uso comercial permitido, sem necessidade
 * de atribuição) — trocar pelas fotos reais dos produtos quando disponíveis.
 */

const unsplash = (id: string) => `https://images.unsplash.com/${id}?q=80&w=800&auto=format&fit=crop`;

export const PRODUCTS: Record<Category, MenuItem[]> = {
  geral: [
    {
      id: 'geral-1',
      name: 'Desinfetante Multiuso 1L',
      description: 'Elimina 99,9% dos germes. Fragrância lavanda.',
      price: 9.9,
      image: unsplash('photo-1587937533577-0ba337fbd436'),
      active: true,
    },
    {
      id: 'geral-2',
      name: 'Detergente Neutro 500ml',
      description: 'Remove gordura sem agredir as mãos.',
      price: 3.5,
      image: unsplash('photo-1550963295-019d8a8a61c5'),
      active: true,
    },
    {
      id: 'geral-3',
      name: 'Água Sanitária 1L',
      description: 'Alvejante e desinfetante multiuso.',
      price: 6.9,
      image: unsplash('photo-1584813470613-5b1c1cad3d69'),
      active: true,
    },
    {
      id: 'geral-4',
      name: 'Limpador Multiuso 500ml',
      description: 'Uso geral em pisos, azulejos e superfícies.',
      price: 7.5,
      image: unsplash('photo-1716625300720-b34970a2d890'),
      active: true,
    },
  ],
  lavanderia: [
    {
      id: 'lav-1',
      name: 'Sabão em Pó 1kg',
      description: 'Remove manchas difíceis, ação prolongada.',
      price: 14.9,
      image: unsplash('photo-1749214317455-efbdd57df844'),
      active: true,
    },
    {
      id: 'lav-2',
      name: 'Amaciante Concentrado 2L',
      description: 'Perfume duradouro, rende até 40 lavagens.',
      price: 12.5,
      image: unsplash('photo-1550963295-019d8a8a61c5'),
      active: true,
    },
    {
      id: 'lav-3',
      name: 'Sabão em Barra (pacote c/5)',
      description: 'Ideal para pré-lavagem e tira-manchas.',
      price: 8.9,
      image: unsplash('photo-1542038335240-86aea625b913'),
      active: true,
    },
  ],
  higiene: [
    {
      id: 'hig-1',
      name: 'Papel Toalha (pacote c/2)',
      description: 'Alta absorção, folha dupla.',
      price: 8.5,
      image: unsplash('photo-1625480860583-b007013905b9'),
      active: true,
    },
    {
      id: 'hig-2',
      name: 'Luvas de Látex (par)',
      description: 'Proteção para limpeza pesada, tamanho M.',
      price: 4.9,
      image: unsplash('photo-1716625300720-b34970a2d890'),
      active: true,
    },
    {
      id: 'hig-3',
      name: 'Álcool 70% 1L',
      description: 'Higienização de superfícies.',
      price: 11.9,
      image: unsplash('photo-1583947581279-4eec08383c38'),
      active: true,
    },
    {
      id: 'hig-4',
      name: 'Sacos de Lixo 30L (pacote c/20)',
      description: 'Reforçado, resistente a vazamentos.',
      price: 9.9,
      image: unsplash('photo-1587937533577-0ba337fbd436'),
      active: true,
    },
    {
      id: 'hig-5',
      name: 'Álcool Gel 70%',
      description: 'Higienização prática das mãos e superfícies, em gel spray.',
      price: 10.0,
      image: '/products/alcool-gel-70.jpeg',
      active: true,
    },
  ],
  kits: [
    {
      id: 'kit-1',
      name: 'Kit Limpeza Banheiro',
      description: 'Desinfetante + limpador de vaso + pano multiuso.',
      price: 24.9,
      image: unsplash('photo-1716625300720-b34970a2d890'),
      active: true,
    },
    {
      id: 'kit-2',
      name: 'Kit Limpeza Cozinha',
      description: 'Detergente + desengordurante + esponjas (3un).',
      price: 19.9,
      image: unsplash('photo-1550963295-019d8a8a61c5'),
      active: true,
    },
    {
      id: 'kit-3',
      name: 'Kit Lavanderia Completo',
      description: 'Sabão em pó 1kg + amaciante 2L.',
      price: 26.9,
      image: unsplash('photo-1749214317455-efbdd57df844'),
      active: true,
    },
  ],
};
