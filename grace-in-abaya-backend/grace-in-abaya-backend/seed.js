const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const User    = require('./models/User');

const products = [
  {
    name: 'Classic Black Everyday Abaya',
    description: 'A timeless full-length black abaya crafted from premium nida fabric. Flowing silhouette with subtle satin trim. Perfect for daily wear — modest, elegant, and effortlessly comfortable.',
    price: 3500,
    category: 'abaya-casual',
    images: ['https://placehold.co/500x667/1a1a1a/ffffff?text=Black+Abaya'],
    colors: ['Black', 'Navy', 'Charcoal'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['everyday', 'classic', 'nida', 'minimal'],
    stock: 25,
    isFeatured: true,
  },
  {
    name: 'Dusty Rose Casual Abaya',
    description: 'A soft dusty rose abaya in lightweight crepe fabric. Open-front design with tie closure. Ideal for spring outings, casual gatherings, and everyday elegance.',
    price: 3200,
    category: 'abaya-casual',
    images: ['https://placehold.co/500x667/c9a0a0/ffffff?text=Rose+Abaya'],
    colors: ['Dusty Rose', 'Blush', 'Mauve'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['casual', 'spring', 'crepe', 'pastel'],
    stock: 18,
    isFeatured: false,
  },
  {
    name: 'Sage Green Linen Abaya',
    description: 'Breathable linen blend abaya in a calming sage green. Relaxed fit with wide sleeves and a minimalist aesthetic. Great for summer and warm-weather days.',
    price: 3800,
    category: 'abaya-casual',
    images: ['https://placehold.co/500x667/8fae88/ffffff?text=Sage+Abaya'],
    colors: ['Sage', 'Olive', 'Cream'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['summer', 'linen', 'breathable', 'casual'],
    stock: 12,
    isFeatured: false,
  },
  {
    name: 'Midnight Velvet Designer Abaya',
    description: 'A statement designer abaya in rich midnight blue velvet with delicate gold thread embroidery along the neckline and cuffs. Structured, regal, and unforgettable. For special occasions that call for grandeur.',
    price: 12500,
    category: 'abaya-designer',
    images: ['https://placehold.co/500x667/1a1a40/d4af37?text=Velvet+Designer'],
    colors: ['Midnight Blue', 'Emerald', 'Burgundy'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['designer', 'velvet', 'embroidery', 'formal', 'wedding'],
    stock: 8,
    isFeatured: true,
  },
  {
    name: 'Ivory Pearl Designer Abaya',
    description: 'Luxurious ivory abaya with hand-placed pearl detailing and chiffon overlay. A bridal favourite — radiant, modest, and deeply elegant. Comes with a matching inner slip.',
    price: 18000,
    category: 'abaya-designer',
    images: ['https://placehold.co/500x667/f5f0e8/8B3252?text=Pearl+Abaya'],
    colors: ['Ivory', 'Off-White', 'Champagne'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['designer', 'bridal', 'pearl', 'luxury', 'wedding'],
    stock: 5,
    isFeatured: true,
  },
  {
    name: 'Burnt Orange Embroidered Abaya',
    description: 'Bold yet modest, this burnt orange open abaya features hand-embroidered geometric patterns on the sleeves. Pairs beautifully with a cream or white inner dress.',
    price: 15000,
    category: 'abaya-designer',
    images: ['https://placehold.co/500x667/c65b30/ffffff?text=Burnt+Orange'],
    colors: ['Burnt Orange', 'Terracotta', 'Rust'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['designer', 'embroidered', 'bold', 'statement'],
    stock: 7,
    isFeatured: false,
  },
  {
    name: 'Artisan Hand-Embroidered Black Abaya',
    description: 'Each piece is individually hand-embroidered by local artisans in Peshawar using traditional Pashtun motifs in gold thread. No two are exactly alike. A wearable piece of cultural heritage.',
    price: 9500,
    category: 'abaya-handmade',
    images: ['https://placehold.co/500x667/2a2a2a/d4af37?text=Artisan+Abaya'],
    colors: ['Black with Gold', 'Black with Silver'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['handmade', 'artisan', 'pashtun', 'heritage', 'embroidered'],
    stock: 10,
    isFeatured: true,
  },
  {
    name: 'Hand-Smocked Cream Abaya',
    description: 'Delicately smocked by hand at the sleeves and waist, this cream abaya is a labour of love. Made from soft cotton muslin, it\'s perfect for summer Eid or casual gatherings.',
    price: 7800,
    category: 'abaya-handmade',
    images: ['https://placehold.co/500x667/f0ebe3/8B3252?text=Smocked+Abaya'],
    colors: ['Cream', 'White', 'Pale Yellow'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['handmade', 'smocked', 'summer', 'eid', 'cotton'],
    stock: 9,
    isFeatured: false,
  },
  {
    name: 'Floral Patchwork Fashion Abaya',
    description: 'A trendy fashion abaya with floral patchwork panels in contrasting fabrics. Open-kimono style, perfect layered over wide-leg trousers or a maxi skirt. Modern, expressive, modest.',
    price: 5500,
    category: 'abaya-fashion',
    images: ['https://placehold.co/500x667/d4a5c9/ffffff?text=Floral+Fashion'],
    colors: ['Floral Mix', 'Pastel', 'Monochrome'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['fashion', 'floral', 'trendy', 'kimono', 'modern'],
    stock: 15,
    isFeatured: false,
  },
  {
    name: 'Co-ord Set Abaya — Camel Beige',
    description: 'A matching set abaya and wide-leg pants in warm camel beige. Minimalist and fashion-forward. Wear as a set or mix separately. A wardrobe investment piece.',
    price: 6800,
    category: 'abaya-fashion',
    images: ['https://placehold.co/500x667/c4a882/ffffff?text=Co-ord+Abaya'],
    colors: ['Camel', 'Stone', 'Taupe'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['fashion', 'co-ord', 'set', 'minimal', 'modern'],
    stock: 13,
    isFeatured: true,
  },
  {
    name: 'Turkish Chiffon Shayla — Black',
    description: 'Lightweight, breathable Turkish chiffon shayla in classic black. 185cm x 70cm. Stays in place all day, drapes beautifully. A wardrobe essential for every modest woman.',
    price: 850,
    category: 'hijab',
    images: ['https://placehold.co/500x500/1a1a1a/ffffff?text=Black+Shayla'],
    colors: ['Black', 'Navy', 'Dark Grey', 'Charcoal'],
    sizes: ['One Size'],
    tags: ['hijab', 'shayla', 'chiffon', 'everyday', 'classic'],
    stock: 50,
    isFeatured: false,
  },
  {
    name: 'Silk-Blend Wrap Hijab — Ivory',
    description: 'A silky smooth wrap hijab in warm ivory. Luxurious fall, minimal frizz, and a polished finish. Works as a shayla, Turkish wrap, or layered style.',
    price: 1200,
    category: 'hijab',
    images: ['https://placehold.co/500x500/f5f0e8/8B3252?text=Ivory+Hijab'],
    colors: ['Ivory', 'Blush', 'Lilac', 'Sky Blue', 'Sage'],
    sizes: ['One Size'],
    tags: ['hijab', 'silk', 'wrap', 'luxury', 'wedding'],
    stock: 35,
    isFeatured: false,
  },
  {
    name: 'Jersey Undercap — Multipack (3)',
    description: 'Pack of 3 jersey underscarves in essential colours. Stretchy, breathable, and non-slip. The foundation of every good hijab look.',
    price: 650,
    category: 'hijab',
    images: ['https://placehold.co/500x500/e8e8e8/444444?text=Undercap+Pack'],
    colors: ['Black + White + Beige', 'Black + Navy + Grey'],
    sizes: ['One Size'],
    tags: ['hijab', 'undercap', 'jersey', 'basic', 'essential'],
    stock: 60,
    isFeatured: false,
  },
  {
    name: 'Gold Crescent & Star Pin Set',
    description: 'A set of 3 elegant hijab pins featuring crescent moon and star motifs in brushed gold. Nickel-free, safe for all skin types. Comes in a velvet pouch.',
    price: 550,
    category: 'accessory',
    images: ['https://placehold.co/500x500/d4af37/ffffff?text=Gold+Pins'],
    colors: ['Gold', 'Silver', 'Rose Gold'],
    sizes: ['One Size'],
    tags: ['accessory', 'pin', 'gold', 'crescent', 'gift'],
    stock: 40,
    isFeatured: true,
  },
  {
    name: 'Pearl Drop Hijab Brooch',
    description: 'A single oversized freshwater pearl drop brooch on a gold base. Adds an instant touch of elegance to any abaya or hijab look. A perfect gift.',
    price: 1100,
    category: 'accessory',
    images: ['https://placehold.co/500x500/f5f0e8/8B3252?text=Pearl+Brooch'],
    colors: ['Gold/Pearl', 'Silver/Pearl'],
    sizes: ['One Size'],
    tags: ['accessory', 'brooch', 'pearl', 'luxury', 'gift', 'wedding'],
    stock: 22,
    isFeatured: false,
  },
  {
    name: 'Braided Leather Mini Bag — Tan',
    description: 'A compact braided leather crossbody bag in warm tan. Fits your phone, keys, and essentials. Gold-toned hardware. Pairs perfectly with any abaya look.',
    price: 3200,
    category: 'accessory',
    images: ['https://placehold.co/500x500/c4a882/ffffff?text=Braided+Bag'],
    colors: ['Tan', 'Black', 'Burgundy'],
    sizes: ['One Size'],
    tags: ['accessory', 'bag', 'leather', 'crossbody', 'everyday'],
    stock: 14,
    isFeatured: false,
  },
];

const adminUser = {
  name:     'Admin',
  email:    'admin@graceinabaya.com',
  password: 'Admin@123',
  role:     'admin',
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({ email: adminUser.email });
    console.log('🗑️  Cleared existing products and admin user');

    // Seed admin
    const admin = await User.create(adminUser);
    console.log(`👤 Admin created: ${admin.email} / password: Admin@123`);

    // Seed products
    const inserted = await Product.insertMany(products);
    console.log(`🛍️  ${inserted.length} products seeded successfully`);

    console.log('\n🎉 Database seeded! You can now run: npm run dev');
    console.log('   Admin login → admin@graceinabaya.com / Admin@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

run();
