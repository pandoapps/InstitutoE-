export interface CnaeItem {
  code: string;
  description: string;
  sector: string; // Corresponds to INDUSTRIAL_SECTORS or general categories
}

export const CNAE_100_LIST: CnaeItem[] = [
  // Alimentos e Bebidas (Sectors 10 & 11)
  { code: "10.11-2", description: "Abate de reses, exceto suínos", sector: "Alimentos e Bebidas" },
  { code: "10.12-1", description: "Abate de suínos, aves e outros pequenos animais", sector: "Alimentos e Bebidas" },
  { code: "10.13-9", description: "Resfriamento, congelamento e preparação de carne", sector: "Alimentos e Bebidas" },
  { code: "10.31-7", description: "Fabricação de conservas de frutas", sector: "Alimentos e Bebidas" },
  { code: "10.32-5", description: "Fabricação de conservas de legumes e outros vegetais", sector: "Alimentos e Bebidas" },
  { code: "10.33-3", description: "Fabricação de sucos de frutas, hortaliças e legumes", sector: "Alimentos e Bebidas" },
  { code: "10.41-4", description: "Fabricação de óleos vegetais em bruto, exceto óleo de milho", sector: "Alimentos e Bebidas" },
  { code: "10.42-2", description: "Fabricação de óleos vegetais refinados, exceto óleo de milho", sector: "Alimentos e Bebidas" },
  { code: "10.51-1", description: "Preparação do leite e fabricação de produtos de laticínios", sector: "Alimentos e Bebidas" },
  { code: "10.52-0", description: "Fabricação de laticínios (queijos, manteiga, iogurte)", sector: "Alimentos e Bebidas" },
  { code: "10.61-9", description: "Moagem de trigo e fabricação de derivados", sector: "Alimentos e Bebidas" },
  { code: "10.62-7", description: "Moagem de milho e fabricação de derivados", sector: "Alimentos e Bebidas" },
  { code: "10.65-1", description: "Fabricação de amidos e féculas de vegetais", sector: "Alimentos e Bebidas" },
  { code: "10.71-6", description: "Fabricação de açúcar em bruto", sector: "Alimentos e Bebidas" },
  { code: "10.72-4", description: "Fabricação de açúcar refinado", sector: "Alimentos e Bebidas" },
  { code: "10.81-3", description: "Torrefação e moagem de café", sector: "Alimentos e Bebidas" },
  { code: "10.82-1", description: "Fabricação de produtos de cacau e chocolates", sector: "Alimentos e Bebidas" },
  { code: "10.91-1", description: "Fabricação de produtos de panificação e confeitaria", sector: "Alimentos e Bebidas" },
  { code: "10.92-9", description: "Fabricação de biscoitos, bolachas e massas alimentícias", sector: "Alimentos e Bebidas" },
  { code: "10.96-1", description: "Fabricação de alimentos e pratos prontos congelados", sector: "Alimentos e Bebidas" },
  { code: "11.11-9", description: "Fabricação de aguardentes e outras bebidas destiladas", sector: "Alimentos e Bebidas" },
  { code: "11.12-7", description: "Fabricação de vinho e derivados de uva", sector: "Alimentos e Bebidas" },
  { code: "11.13-5", description: "Fabricação de malte, cervejas e chopes", sector: "Alimentos e Bebidas" },
  { code: "11.22-4", description: "Fabricação de refrigerantes e outras bebidas não alcoólicas", sector: "Alimentos e Bebidas" },

  // Têxtil e Calçados (Sectors 13, 14 & 15)
  { code: "13.11-1", description: "Preparação e fiação de fibras de algodão", sector: "Têxtil e Calçados" },
  { code: "13.21-9", description: "Tecelagem de fios de algodão", sector: "Têxtil e Calçados" },
  { code: "13.22-7", description: "Tecelagem de fios de fibras têxteis naturais e sintéticas", sector: "Têxtil e Calçados" },
  { code: "13.30-8", description: "Fabricação de tecidos de malha e artigos de malharia", sector: "Têxtil e Calçados" },
  { code: "13.40-5", description: "Acabamento de fios, tecidos e artigos têxteis", sector: "Têxtil e Calçados" },
  { code: "13.51-1", description: "Fabricação de artefatos têxteis para uso doméstico", sector: "Têxtil e Calçados" },
  { code: "14.11-8", description: "Confecção de roupas íntimas e vestuário de baixo", sector: "Têxtil e Calçados" },
  { code: "14.12-6", description: "Confecção de peças de vestuário, exceto roupas íntimas", sector: "Têxtil e Calçados" },
  { code: "14.13-4", description: "Confecção de roupas profissionais e uniformes", sector: "Têxtil e Calçados" },
  { code: "15.21-1", description: "Fabricação de bolsas, malas e artefatos de couro", sector: "Têxtil e Calçados" },
  { code: "15.31-9", description: "Fabricação de calçados de couro para todos os fins", sector: "Têxtil e Calçados" },
  { code: "15.33-5", description: "Fabricação de calçados de material sintético ou lona", sector: "Têxtil e Calçados" },
  { code: "15.39-4", description: "Fabricação de calçados de segurança e ortopédicos", sector: "Têxtil e Calçados" },

  // Celulose e Papel (Sector 17)
  { code: "17.10-9", description: "Fabricação de celulose e outras pastas de madeira", sector: "Celulose e Papel" },
  { code: "17.21-4", description: "Fabricação de papel e papelão ondulado", sector: "Celulose e Papel" },
  { code: "17.31-1", description: "Fabricação de embalagens de papel e cartolina", sector: "Celulose e Papel" },
  { code: "17.41-9", description: "Fabricação de produtos de papel e higiene e escritório", sector: "Celulose e Papel" },

  // Química e Petroquímica (Sector 20 & 21)
  { code: "20.11-8", description: "Fabricação de cloro e álcalis", sector: "Química e Petroquímica" },
  { code: "20.12-6", description: "Fabricação de gases industriais comprimidos ou liquefeitos", sector: "Química e Petroquímica" },
  { code: "20.13-4", description: "Fabricação de adubos e fertilizantes organo-minerais", sector: "Química e Petroquímica" },
  { code: "20.19-3", description: "Fabricação de produtos químicos inorgânicos básicos", sector: "Química e Petroquímica" },
  { code: "20.21-5", description: "Fabricação de tintas, vernizes, esmaltes e lacas", sector: "Química e Petroquímica" },
  { code: "20.22-3", description: "Fabricação de adesivos e selantes industriais", sector: "Química e Petroquímica" },
  { code: "20.29-1", description: "Fabricação de catalisadores e aditivos químicos", sector: "Química e Petroquímica" },
  { code: "20.31-2", description: "Fabricação de resinas termoplásticas e elastômeros", sector: "Química e Petroquímica" },
  { code: "20.61-4", description: "Fabricação de sabões, detergentes e produtos de limpeza", sector: "Química e Petroquímica" },
  { code: "20.62-2", description: "Fabricação de cosméticos, produtos de perfumaria e higiene", sector: "Química e Petroquímica" },
  { code: "20.91-6", description: "Fabricação de defensivos agrícolas e praguicidas", sector: "Química e Petroquímica" },
  { code: "20.93-2", description: "Fabricação de aditivos de uso industrial e impermeabilizantes", sector: "Química e Petroquímica" },
  { code: "21.10-6", description: "Fabricação de produtos farmoquímicos e princípios ativos", sector: "Química e Petroquímica" },
  { code: "21.21-1", description: "Fabricação de medicamentos e remédios para uso humano", sector: "Química e Petroquímica" },

  // Metalurgia e Siderurgia (Sector 24 & 25)
  { code: "24.11-3", description: "Produção de gusa e ferro-ligas em altos-fornos", sector: "Metalurgia e Siderurgia" },
  { code: "24.21-1", description: "Produção de semi-acabados de aço nas usinas integradas", sector: "Metalurgia e Siderurgia" },
  { code: "24.22-9", description: "Produção de laminados planos de aço e bobinas", sector: "Metalurgia e Siderurgia" },
  { code: "24.23-7", description: "Produção de tubos de aço sem costura e conexões", sector: "Metalurgia e Siderurgia" },
  { code: "24.41-5", description: "Metalurgia do alumínio e suas ligas em bruto", sector: "Metalurgia e Siderurgia" },
  { code: "24.43-1", description: "Metalurgia dos metais preciosos e semipreciosos", sector: "Metalurgia e Siderurgia" },
  { code: "24.51-2", description: "Fundição de ferro, aço e ligas ferrosas", sector: "Metalurgia e Siderurgia" },
  { code: "24.52-1", description: "Fundição de metais não-ferrosos e suas ligas", sector: "Metalurgia e Siderurgia" },
  { code: "25.11-0", description: "Fabricação de estruturas metálicas para a construção", sector: "Metalurgia e Siderurgia" },
  { code: "25.12-8", description: "Fabricação de esquadrias de metal e portões", sector: "Metalurgia e Siderurgia" },
  { code: "25.21-7", description: "Fabricação de tanques, reservatórios metálicos e caldeiras", sector: "Metalurgia e Siderurgia" },
  { code: "25.31-4", description: "Produção de forjados de aço e estampados de metal", sector: "Metalurgia e Siderurgia" },
  { code: "25.32-2", description: "Serviços de usinagem, solda e tratamentos em metais", sector: "Metalurgia e Siderurgia" },
  { code: "25.41-1", description: "Fabricação de ferramentas manuais e artigos de cutelaria", sector: "Metalurgia e Siderurgia" },
  { code: "25.91-8", description: "Fabricação de embalagens metálicas e latas", sector: "Metalurgia e Siderurgia" },

  // Automotivo (Sector 29)
  { code: "29.10-7", description: "Fabricação de automóveis, camionetas e utilitários", sector: "Automotivo" },
  { code: "29.20-4", description: "Fabricação de caminhões, tratores e ônibus", sector: "Automotivo" },
  { code: "29.30-1", description: "Fabricação de cabines, carrocerias e reboques", sector: "Automotivo" },
  { code: "29.41-7", description: "Fabricação de peças e acessórios para o motor", sector: "Automotivo" },
  { code: "29.42-5", description: "Fabricação de peças e acessórios para transmissão", sector: "Automotivo" },
  { code: "29.45-0", description: "Fabricação de sistemas de freios e suspensão para veículos", sector: "Automotivo" },
  { code: "29.49-2", description: "Fabricação de outras peças e autopeças não especificadas", sector: "Automotivo" },

  // Eletroeletrônicos (Sector 26 & 27)
  { code: "26.10-8", description: "Fabricação de componentes eletrônicos e semicondutores", sector: "Eletroeletrônicos" },
  { code: "26.21-3", description: "Fabricação de computadores e equipamentos periféricos", sector: "Eletroeletrônicos" },
  { code: "26.30-0", description: "Fabricação de equipamentos de telefonia e comunicação", sector: "Eletroeletrônicos" },
  { code: "26.51-5", description: "Fabricação de aparelhos eletrônicos de medição e teste", sector: "Eletroeletrônicos" },
  { code: "27.10-4", description: "Fabricação de geradores, transformadores e motores elétricos", sector: "Eletroeletrônicos" },
  { code: "27.31-7", description: "Fabricação de aparelhos de interrupção e painéis elétricos", sector: "Eletroeletrônicos" },
  { code: "27.40-6", description: "Fabricação de lâmpadas e equipamentos de iluminação", sector: "Eletroeletrônicos" },
  { code: "27.51-1", description: "Fabricação de fogões, geladeiras e eletrodomésticos", sector: "Eletroeletrônicos" },
  { code: "27.90-2", description: "Fabricação de acumuladores, baterias de lítio e pilhas", sector: "Eletroeletrônicos" },

  // Mineração (Extrativa) (Sector 05, 07 & 08)
  { code: "05.00-3", description: "Extração de carvão mineral", sector: "Mineração (Extrativa)" },
  { code: "07.10-3", description: "Extração de minério de ferro em alta escala", sector: "Mineração (Extrativa)" },
  { code: "07.22-7", description: "Extração de minério de estanho e metais leves", sector: "Mineração (Extrativa)" },
  { code: "07.24-3", description: "Extração de minério de cobre e ligas associadas", sector: "Mineração (Extrativa)" },
  { code: "08.10-0", description: "Extração de pedra, areia, argila e cascalho", sector: "Mineração (Extrativa)" },
  { code: "08.91-6", description: "Extração de minerais para fabricação de adubos", sector: "Mineração (Extrativa)" },

  // Construção Civil (Sector 23)
  { code: "23.20-6", description: "Fabricação de cimento e clínquer portland", sector: "Construção Civil" },
  { code: "23.30-3", description: "Fabricação de artefatos de concreto para construção", sector: "Construção Civil" },
  { code: "23.42-7", description: "Fabricação de azulejos, pisos cerâmicos e porcelanato", sector: "Construção Civil" },
  { code: "23.91-5", description: "Aparelhamento de pedras e mármores para construção", sector: "Construção Civil" },
  { code: "23.94-0", description: "Fabricação de cal, gesso e argamassa de revestimento", sector: "Construção Civil" }
];
