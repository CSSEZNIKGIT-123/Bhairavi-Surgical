const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Yugan Ayurved & Panchkarma Products database...');

  // 1. Hash default password
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@123456', salt);
  const customerPassword = await bcrypt.hash('Customer@123456', salt);

  // 2. Create Users
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@yuganayurved.com' },
    update: {},
    create: {
      email: 'admin@yuganayurved.com',
      name: 'Dr. Vaidya Yugan Sharma',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
      phone: '+91 98765 43210',
    },
  });

  const salesManager = await prisma.user.upsert({
    where: { email: 'sales@yuganayurved.com' },
    update: {},
    create: {
      email: 'sales@yuganayurved.com',
      name: 'Rajesh Kulkarni',
      passwordHash: adminPassword,
      role: 'SALES_MANAGER',
      phone: '+91 98765 11223',
    },
  });

  const b2bCustomer = await prisma.user.upsert({
    where: { email: 'procurement@ayushpanchkarma.demo' },
    update: {},
    create: {
      email: 'procurement@ayushpanchkarma.demo',
      name: 'Dr. Sudhir Varma (Ayush Panchkarma Hospitals)',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      phone: '+91 99887 76655',
      businessProfile: {
        create: {
          companyName: 'Ayush Panchkarma & Wellness Hospitals',
          contactPerson: 'Dr. Sudhir Varma',
          businessType: 'Panchkarma Center & Hospital Network',
          taxGstNumber: '27AAAAA0000A1Z5',
          industry: 'Ayurvedic Healthcare & Wellness',
          companyAddress: 'Plot 108, Veda Health Park, Baner, Pune, Maharashtra',
          creditLimit: 3000000,
          accountStatus: 'VERIFIED',
        },
      },
    },
  });

  const b2cCustomer = await prisma.user.upsert({
    where: { email: 'ananya.roy@wellnessdemo.com' },
    update: {},
    create: {
      email: 'ananya.roy@wellnessdemo.com',
      name: 'Ananya Roy',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      phone: '+91 91234 56789',
      customerProfile: {
        create: {
          firstName: 'Ananya',
          lastName: 'Roy',
          preferences: 'Ayurvedic Massage Oils & Radiant Herbal Care',
        },
      },
    },
  });

  // 3. Brands
  const brand1 = await prisma.brand.upsert({
    where: { slug: 'yugan-classical' },
    update: {},
    create: {
      name: 'Yugan Classical Ayurveda',
      slug: 'yugan-classical',
      description: 'Authentic Ayurvedic formulations prepared according to classical texts (Charaka Samhita, Ashtanga Hridaya, Sahasrayogam).',
    },
  });

  const brand2 = await prisma.brand.upsert({
    where: { slug: 'yugan-panchkarma' },
    update: {},
    create: {
      name: 'Yugan Panchkarma Essentials',
      slug: 'yugan-panchkarma',
      description: 'Professional-grade therapy oils, brass shirodhara apparatus, and treatment preparations for Panchkarma centers.',
    },
  });

  const brand3 = await prisma.brand.upsert({
    where: { slug: 'yugan-sovereign' },
    update: {},
    create: {
      name: 'Yugan Sovereign Atelier',
      slug: 'yugan-sovereign',
      description: 'Handcrafted bronze kansa sets, pure brass shirodhara vessels, and master-formulated rare botanical preparations.',
    },
  });

  // 4. Categories
  const categoriesData = [
    {
      name: 'Ayurvedic Classical Oils',
      slug: 'herbal-oils',
      subtitle: 'Classical Medicated Tailas',
      description: 'Traditional sesame and coconut based medicated oils prepared with classical decoctions for Abhyanga and therapy.',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
      mode: 'ALL',
      sortOrder: 1,
    },
    {
      name: 'Herbal Powders & Churnas',
      slug: 'herbal-powders',
      subtitle: 'Pure Single Herbs & Classical Blends',
      description: 'Wildcrafted organic herbal churnas, micro-pulverized for optimal bioavailability and traditional usage.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
      mode: 'ALL',
      sortOrder: 2,
    },
    {
      name: 'Panchkarma Therapy Essentials',
      slug: 'panchkarma-essentials',
      subtitle: 'Clinical Panchkarma Supplies',
      description: 'Authentic treatment supplies, steam herbs, kansa massage tools, and specialized therapy accessories.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
      mode: 'B2B',
      sortOrder: 3,
    },
    {
      name: 'Medicated Ghrits & Preparations',
      slug: 'ghrits-asavas',
      subtitle: 'Traditional Herbal Ghee Preparations',
      description: 'Grass-fed A2 cow ghee infused with potent medicinal herbs for classical dietary and therapeutic support.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
      mode: 'B2B',
      sortOrder: 4,
    },
    {
      name: 'Daily Wellness & Herbal Care',
      slug: 'wellness-essentials',
      subtitle: 'Traditional Self-Care & Glow',
      description: 'Pure saffron oils, herbal hair elixirs, ubtan body scrubs, and wellness tonics for everyday vitality.',
      image: 'https://images.unsplash.com/photo-1512290900672-1f486431e784?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
      mode: 'B2C',
      sortOrder: 5,
    },
    {
      name: 'Signature Shirodhara & Therapy Suites',
      slug: 'shirodhara-suites',
      subtitle: 'Handcrafted Brass & Bronze Apparatus',
      description: 'Bespoke hand-hammered pure brass Shirodhara pots with flow control valves, stands, and bronze kansa sets.',
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
      mode: 'SPECIAL',
      sortOrder: 6,
    },
  ];

  const createdCategories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        subtitle: cat.subtitle,
        description: cat.description,
        image: cat.image,
      },
      create: cat,
    });
    createdCategories[cat.slug] = created;
  }

  // 5. Products Data
  const productsData = [
    {
      title: 'Mahanarayan Classical Medicated Massage Oil',
      slug: 'mahanarayan-classical-massage-oil',
      sku: 'YUG-OIL-MN01',
      subtitle: 'Classical Formula with 30+ Wildcrafted Herbs (Bhaishajya Ratnavali)',
      description: 'Mahanarayan Taila is a revered classical Ayurvedic medicated oil crafted with Bilva, Ashwagandha, Bala, and Shatavari in pure cold-pressed sesame oil. Traditionally used in Abhyanga for soothing muscles, joint flexibility, and calming Vata dosha.',
      retailPrice: 850,
      b2bBasePrice: 520,
      specialBasePrice: 1200,
      stock: 450,
      moq: 5,
      isFeatured: true,
      isB2B: true,
      isB2C: true,
      isSpecial: false,
      badge: 'BEST SELLER',
      categorySlug: 'herbal-oils',
      brandSlug: 'yugan-classical',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      ]),
      specifications: JSON.stringify({
        'Classical Reference': 'Bhaishajya Ratnavali - Vatavyadhi Chikitsa',
        'Base Oil': 'Organic Virgin Black Sesame Oil (Tila Taila)',
        'Key Botanicals': 'Ashwagandha, Bala, Shatavari, Dashamula, Rasna',
        'Processing Method': 'Classical Taila Paka Vidhi (Slow 72-hour simmering)',
        'Available Packaging': '500ml Retail Bottle / 5L Bulk Container / 25L Drum',
        'Certifications': 'GMP Certified Unit, AYUSH Standard, ISO 9001:2015',
      }),
      tiers: [
        { minQty: 5, maxQty: 19, unitPrice: 520, label: 'Clinic Standard Tier (5-19 units)' },
        { minQty: 20, maxQty: 49, unitPrice: 460, label: 'Panchkarma Center Tier (20-49 units)' },
        { minQty: 50, maxQty: 99, unitPrice: 410, label: 'Wholesale Tier (50-99 units)' },
        { minQty: 100, maxQty: null, unitPrice: 360, label: 'Bulk Institutional Tier (100+ units)' },
      ],
    },
    {
      title: 'Ksheerabala 101 Classical Medicated Taila',
      slug: 'ksheerabala-101-medicated-taila',
      sku: 'YUG-OIL-KB101',
      subtitle: '101-Times Potentiated with Bala Decoction & Organic Cow Milk',
      description: 'An exquisite formulation prepared by boiling Bala root decoction, pure cow milk, and sesame oil repeated 101 times. Traditionally used in Ayurvedic Panchkarma practices for Shirodhara, Nasya, and deep neuromuscular rejuvenation.',
      retailPrice: 1650,
      b2bBasePrice: 1100,
      specialBasePrice: 2200,
      stock: 180,
      moq: 3,
      isFeatured: true,
      isB2B: true,
      isB2C: true,
      isSpecial: true,
      badge: 'POTENTIATED 101x',
      categorySlug: 'herbal-oils',
      brandSlug: 'yugan-classical',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1512290900672-1f486431e784?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      ]),
      specifications: JSON.stringify({
        'Classical Reference': 'Sahasrayogam - Taila Prakarana',
        'Potentiation Cycle': 'Avarti 101 (Processed 101 continuous cycles)',
        'Key Ingredients': 'Sida cordifolia (Bala Root), A2 Cow Milk, Tila Taila',
        'Therapeutic Application': 'Shirodhara, Matra Basti, Nasya, Abhyanga',
        'Packaging': '100ml Glass Dropper / 1L Clinic Flacon / 5L Jar',
        'Quality Standard': 'Heavy Metal Tested (< 0.1 ppm), 100% Solvent Free',
      }),
      tiers: [
        { minQty: 3, maxQty: 9, unitPrice: 1100, label: 'Practitioner Tier (3-9 units)' },
        { minQty: 10, maxQty: 29, unitPrice: 980, label: 'Clinic Tier (10-29 units)' },
        { minQty: 30, maxQty: null, unitPrice: 850, label: 'Hospital Bulk Tier (30+ units)' },
      ],
    },
    {
      title: 'Authentic Pure Brass Shirodhara Vessel with Flow Control Valve',
      slug: 'authentic-brass-shirodhara-vessel-set',
      sku: 'YUG-APP-SD01',
      subtitle: 'Hand-Hammered Solid Brass Vessel with Brass Chains & Precision Control Tap',
      description: 'Masterfully crafted heavy-gauge solid brass Shirodhara pot (2.5L capacity) featuring a hand-machined oil flow control valve and hanging brass chains. Engineered for smooth, uninterrupted laminar oil stream onto the forehead in classical Panchkarma therapy.',
      retailPrice: 4800,
      b2bBasePrice: 3200,
      specialBasePrice: 6500,
      stock: 65,
      moq: 1,
      isFeatured: true,
      isB2B: true,
      isB2C: false,
      isSpecial: true,
      badge: 'HANDCRAFTED BRASS',
      categorySlug: 'shirodhara-suites',
      brandSlug: 'yugan-panchkarma',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      ]),
      specifications: JSON.stringify({
        'Material': '100% Virgin Heavy-Gauge Brass (Pital)',
        'Capacity': '2.5 Litres with interior calibration markings',
        'Flow Control': 'Precision Machined Brass Needle Valve (Smooth stream control)',
        'Hanging Mechanism': 'Hand-forged 3-point heavy brass suspension chain',
        'Finish': 'Traditional Mirror Polish with tarnish-resistant coating',
        'Included': 'Shirodhara Pot, Brass Valve, Hanging Chains & Wick Adapter',
      }),
      tiers: [
        { minQty: 1, maxQty: 4, unitPrice: 3200, label: 'Single Center Tier (1-4 units)' },
        { minQty: 5, maxQty: 9, unitPrice: 2800, label: 'Panchkarma Hospital Tier (5-9 units)' },
        { minQty: 10, maxQty: null, unitPrice: 2400, label: 'Distributor / Chain Tier (10+ units)' },
      ],
    },
    {
      title: 'Triphala Churna Organic Wildcrafted Blend',
      slug: 'triphala-churna-organic-blend',
      sku: 'YUG-PWD-TP01',
      subtitle: 'Equal Proportions of Haritaki, Bibhitaki & Amalaki (AFT Certified)',
      description: 'Pure micro-pulverized powder of organic Haritaki, Bibhitaki, and Amalaki fruits. Free from preservatives, fillers, and pesticide residue. Traditionally celebrated in Ayurveda for digestive harmony, natural cleansing, and Tridoshic balance.',
      retailPrice: 360,
      b2bBasePrice: 210,
      specialBasePrice: 500,
      stock: 800,
      moq: 10,
      isFeatured: true,
      isB2B: true,
      isB2C: true,
      isSpecial: false,
      badge: '100% ORGANIC',
      categorySlug: 'herbal-powders',
      brandSlug: 'yugan-classical',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512290900672-1f486431e784?auto=format&fit=crop&w=800&q=80',
      ]),
      specifications: JSON.stringify({
        'Classical Reference': 'Charaka Samhita - Sutrasthana',
        'Composition': 'Emblica officinalis, Terminalia bellirica, Terminalia chebula (1:1:1)',
        'Mesh Size': '80-100 Mesh Ultra-Fine Powder',
        'Tannin Content': 'Standardized to min. 35% natural tannins',
        'Packaging': '250g Glass Jar / 1kg Airtight Pouch / 25kg Bulk Bag',
        'Shelf Life': '24 Months from manufacturing date',
      }),
      tiers: [
        { minQty: 10, maxQty: 49, unitPrice: 210, label: 'Practitioner Tier (10-49 units)' },
        { minQty: 50, maxQty: 99, unitPrice: 175, label: 'Clinic Tier (50-99 units)' },
        { minQty: 100, maxQty: null, unitPrice: 145, label: 'Wholesale Bulk Tier (100+ units)' },
      ],
    },
    {
      title: 'Kumkumadi Radiant Saffron Beauty Tailam',
      slug: 'kumkumadi-radiant-saffron-tailam',
      sku: 'YUG-OIL-KK01',
      subtitle: 'Infused with Pure Kashmiri Mogra Saffron & 26 Classical Herbs',
      description: 'An iconic Ayurvedic beauty elixir formulated with authentic Grade A Kashmiri Saffron, Red Sandalwood, Manjistha, and goat milk. Traditionally used for evening skin texture, natural radiance, and diminishing blemishes.',
      retailPrice: 1850,
      b2bBasePrice: 1250,
      specialBasePrice: 2800,
      stock: 220,
      moq: 5,
      isFeatured: true,
      isB2B: true,
      isB2C: true,
      isSpecial: true,
      badge: 'KASHMIRI SAFFRON',
      categorySlug: 'wellness-essentials',
      brandSlug: 'yugan-sovereign',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512290900672-1f486431e784?auto=format&fit=crop&w=800&q=80',
      ]),
      specifications: JSON.stringify({
        'Classical Reference': 'Ashtanga Hridaya - Kshudra Roga Pratishedha',
        'Saffron Grade': '100% Pure Kashmiri Mogra Kesar (Crocus sativus)',
        'Key Actives': 'Rakta Chandana, Manjistha, Padmaka, Ushira, Aja Ksheera',
        'Base': 'Cold-Pressed Sesame Oil & Pure Rose Infusion',
        'Packaging': '30ml Luxury Dropper with 24K Gold Stamped Box',
        'Purity Assurance': 'Free from Mineral Oil, Artificial Fragrance & Parabens',
      }),
      tiers: [
        { minQty: 5, maxQty: 19, unitPrice: 1250, label: 'Spa & Salon Tier (5-19 units)' },
        { minQty: 20, maxQty: 49, unitPrice: 1050, label: 'Wellness Boutique Tier (20-49 units)' },
        { minQty: 50, maxQty: null, unitPrice: 900, label: 'Master Distributor Tier (50+ units)' },
      ],
    },
    {
      title: 'Traditional Bronze Kansa Vataki Therapy Bowl & Wand Set',
      slug: 'bronze-kansa-vataki-therapy-set',
      sku: 'YUG-APP-KB01',
      subtitle: 'Hand-Cast 79% Copper + 21% Tin Healing Metal Alloy (Padabhyanga Set)',
      description: 'Handcrafted traditional bronze (Kansa) bowl with solid Sheesham wood ergonomic handle. In classical Ayurvedic Padabhyanga foot massage and facial treatments, Kansa is revered for drawing out excess Pitta heat and revitalizing vital marma energy points.',
      retailPrice: 1450,
      b2bBasePrice: 920,
      specialBasePrice: 1950,
      stock: 140,
      moq: 2,
      isFeatured: true,
      isB2B: true,
      isB2C: true,
      isSpecial: true,
      badge: 'GENUINE KANSA ALLOY',
      categorySlug: 'panchkarma-essentials',
      brandSlug: 'yugan-panchkarma',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
      ]),
      specifications: JSON.stringify({
        'Metal Composition': '79% Pure Copper + 21% Tin (Traditional Bronze Alloy)',
        'Handle Material': 'Seasoned Indian Rosewood (Sheesham) with brass sleeve',
        'Craft Technique': 'Hand-cast, lathe-spun, and mirror-buffed by hereditary bell-metal artisans',
        'Applications': 'Kansa Padabhyanga (Foot massage), Mukha Abhyanga (Facial marma massage)',
        'Included': '1x Foot Kansa Wand, 1x Facial Marma Wand, Velvet Pouch & Organic Care Wax',
      }),
      tiers: [
        { minQty: 2, maxQty: 9, unitPrice: 920, label: 'Practitioner Tier (2-9 units)' },
        { minQty: 10, maxQty: 29, unitPrice: 790, label: 'Clinic Tier (10-29 units)' },
        { minQty: 30, maxQty: null, unitPrice: 680, label: 'Wholesale Tier (30+ units)' },
      ],
    },
    {
      title: 'Dashamula Classical Decoction Churna (Bulk Kwatha)',
      slug: 'dashamula-classical-decoction-churna',
      sku: 'YUG-PWD-DM01',
      subtitle: 'Coarse Ten-Root Herbal Blend for Kashaya Dhara & Basti Preparations',
      description: 'Authentic formulation of ten powerful medicinal roots (Bilva, Agnimantha, Shyonaka, Patala, Gambhari, Brihati, Kantakari, Gokshura, Shalaparni, Prishniparni). Coarsely crushed for optimal decoction preparation in Panchkarma clinics.',
      retailPrice: 680,
      b2bBasePrice: 420,
      specialBasePrice: 850,
      stock: 550,
      moq: 5,
      isFeatured: false,
      isB2B: true,
      isB2C: false,
      isSpecial: false,
      badge: 'CLINICAL GRADE',
      categorySlug: 'herbal-powders',
      brandSlug: 'yugan-classical',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512290900672-1f486431e784?auto=format&fit=crop&w=800&q=80',
      ]),
      specifications: JSON.stringify({
        'Classical Reference': 'Sarangadhara Samhita - Kwatha Kalpana',
        'Form': 'Yavakuta (Coarse Decoction Grade Powder)',
        'Key Roots': 'Dashamula (5 Brihat Panchamula + 5 Laghu Panchamula)',
        'Clinical Use': 'Nadi Sweda, Kashaya Basti, Dhara, Herbal Steam Baths',
        'Packaging': '1kg Resealable Foil Pouch / 5kg Bag / 25kg HDPE Drum',
      }),
      tiers: [
        { minQty: 5, maxQty: 19, unitPrice: 420, label: 'Clinic Tier (5-19 units)' },
        { minQty: 20, maxQty: 49, unitPrice: 360, label: 'Hospital Tier (20-49 units)' },
        { minQty: 50, maxQty: null, unitPrice: 310, label: 'Bulk Supply Tier (50+ units)' },
      ],
    },
    {
      title: 'The Sovereign Panchkarma Sanctuary Suite (Turnkey Brass & Teak Setup)',
      slug: 'the-sovereign-panchkarma-sanctuary-suite',
      sku: 'YUG-SPEC-SANCTUARY',
      subtitle: 'Bespoke Hand-Carved Teak Droni, Carved Brass Shirodhara Stand & 50L Oil Allocation',
      description: 'The pinnacle of luxury Ayurvedic craftsmanship. An heirloom solid Burmese Teak therapy table (Droni) carved from a single log, accompanied by an ornate hand-forged solid brass Shirodhara arch stand, temperature-controlled oil collection basin, and master therapist orientation.',
      retailPrice: 285000,
      b2bBasePrice: 220000,
      specialBasePrice: 320000,
      stock: 5,
      moq: 1,
      isFeatured: true,
      isB2B: false,
      isB2C: false,
      isSpecial: true,
      badge: 'ATELIER BESPOKE',
      categorySlug: 'shirodhara-suites',
      brandSlug: 'yugan-sovereign',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      ]),
      specifications: JSON.stringify({
        'Droni Table': '8.5 ft Hand-Carved Seasoned Teak Wood with Ayurvedic oil-proof botanical finish',
        'Shirodhara Stand': 'Solid Cast Brass with lotus finial, counterweight balance, and micro-tap',
        'Oil Allocation': '50 Litres of Grade-A Classical Medicated Oils customized to client climate',
        'Customization': 'Personalized clinic brass crest engraving, bespoke wood stain finish',
        'Included Services': 'On-site white-glove installation, master therapist calibration & 5-year warranty',
      }),
      tiers: [
        { minQty: 1, maxQty: null, unitPrice: 220000, label: 'Bespoke Commission Tier' },
      ],
    },
  ];

  for (const prod of productsData) {
    const category = createdCategories[prod.categorySlug];
    const brand = await prisma.brand.findUnique({ where: { slug: prod.brandSlug } });

    const createdProd = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        title: prod.title,
        subtitle: prod.subtitle,
        description: prod.description,
        retailPrice: prod.retailPrice,
        b2bBasePrice: prod.b2bBasePrice,
        specialBasePrice: prod.specialBasePrice,
        stock: prod.stock,
        moq: prod.moq,
        isFeatured: prod.isFeatured,
        isB2B: prod.isB2B,
        isB2C: prod.isB2C,
        isSpecial: prod.isSpecial,
        badge: prod.badge,
        images: prod.images,
        specifications: prod.specifications,
        categoryId: category ? category.id : null,
        brandId: brand ? brand.id : null,
      },
      create: {
        title: prod.title,
        slug: prod.slug,
        sku: prod.sku,
        subtitle: prod.subtitle,
        description: prod.description,
        retailPrice: prod.retailPrice,
        b2bBasePrice: prod.b2bBasePrice,
        specialBasePrice: prod.specialBasePrice,
        stock: prod.stock,
        moq: prod.moq,
        isFeatured: prod.isFeatured,
        isB2B: prod.isB2B,
        isB2C: prod.isB2C,
        isSpecial: prod.isSpecial,
        badge: prod.badge,
        images: prod.images,
        specifications: prod.specifications,
        categoryId: category ? category.id : null,
        brandId: brand ? brand.id : null,
      },
    });

    // Delete existing tiers and recreate
    await prisma.priceTier.deleteMany({ where: { productId: createdProd.id } });
    for (const tier of prod.tiers) {
      await prisma.priceTier.create({
        data: {
          productId: createdProd.id,
          minQty: tier.minQty,
          maxQty: tier.maxQty,
          unitPrice: tier.unitPrice,
          label: tier.label,
        },
      });
    }
  }

  // 6. Sample B2B Quote
  const mahanarayan = await prisma.product.findUnique({ where: { slug: 'mahanarayan-classical-massage-oil' } });
  const shirodharaPot = await prisma.product.findUnique({ where: { slug: 'authentic-brass-shirodhara-vessel-set' } });

  await prisma.quote.upsert({
    where: { quoteNumber: 'YUG-RFQ-2026-001' },
    update: {},
    create: {
      quoteNumber: 'YUG-RFQ-2026-001',
      userId: b2bCustomer.id,
      companyName: 'Ayush Panchkarma & Wellness Hospitals',
      contactPerson: 'Dr. Sudhir Varma',
      email: 'procurement@ayushpanchkarma.demo',
      phone: '+91 99887 76655',
      taxId: '27AAAAA0000A1Z5',
      estimatedBudget: '₹2,50,000 - ₹5,00,000',
      deliveryTimeline: 'Within 2 Weeks',
      notes: 'Initial monthly supply for 3 Panchkarma treatment centers. Require batch test certificates.',
      status: 'SUBMITTED',
      items: {
        create: [
          {
            productId: mahanarayan.id,
            quantity: 50,
            targetPrice: 390,
          },
          {
            productId: shirodharaPot.id,
            quantity: 6,
            targetPrice: 2600,
          },
        ],
      },
    },
  });

  // 7. Sample Special Inquiry
  await prisma.specialInquiry.upsert({
    where: { inquiryNumber: 'YUG-INQ-2026-001' },
    update: {},
    create: {
      inquiryNumber: 'YUG-INQ-2026-001',
      name: 'Dr. Meenakshi Sundaram',
      organization: 'Ananda Vedic Heritage Sanctuary',
      email: 'dr.meenakshi@anandavedic.demo',
      phone: '+91 98111 22334',
      requirementType: 'Turnkey Teak Droni & Custom Shirodhara Suite',
      urgency: 'IMMEDIATE',
      description: 'Designing two luxury presidential Panchkarma treatment suites in Rishikesh. Require custom carved teak droni with royal brass vessels and private therapist training.',
      status: 'NEW',
    },
  });

  console.log('Database seeded successfully with Yugan Ayurved & Panchkarma data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
