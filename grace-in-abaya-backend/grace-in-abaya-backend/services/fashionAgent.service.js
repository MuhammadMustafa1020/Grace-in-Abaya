const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product    = require('../models/Product');
const OutfitPlan = require('../models/OutfitPlan');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Step 1: Understand the goal and decide which product categories to fetch.
 */
const analyzeGoal = async (occasion, budget, preferences, season) => {
  const model  = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
  const prompt = `You are a goal-oriented modest fashion planning agent.

A user wants to plan an outfit for: "${occasion}"
Budget: PKR ${budget}
Season: ${season || 'current season'}
Color preferences: ${preferences?.colors?.join(', ') || 'none specified'}
Styles to avoid: ${preferences?.avoidColors?.join(', ') || 'none'}

Based on this occasion and budget, which product categories should I search?
Available categories: abaya-casual, abaya-designer, abaya-handmade, abaya-fashion, hijab, accessory

Return ONLY valid JSON, no markdown:
{
  "categories": ["abaya-casual", "hijab", "accessory"],
  "priceStrategy": "mid-range",
  "occasionType": "formal|casual|semi-formal|bridal",
  "priorityNote": "one sentence on what to prioritize"
}`;

  const result = await model.generateContent(prompt);
  const text   = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text);
};

/**
 * Step 2: Fetch relevant products from DB within budget.
 */
const fetchRelevantProducts = async (categories, budget) => {
  const perItemBudget = budget * 0.7; // allow up to 70% of budget on one item
  const products = await Product.find({
    category: { $in: categories },
    price:    { $lte: perItemBudget },
    stock:    { $gt: 0 },
  }).limit(30).lean();
  return products;
};

/**
 * Step 3: Use Gemini to create the full outfit plan from available products.
 */
const createOutfitPlan = async (occasion, budget, preferences, season, products, goalAnalysis) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

  const productList = products.map(p =>
    `ID:${p._id} | ${p.name} | PKR ${p.price} | ${p.category} | Colors: ${p.colors?.join(', ')} | Tags: ${p.tags?.join(', ')}`
  ).join('\n');

  const prompt = `You are a goal-oriented modest fashion stylist AI at Grace in Abaya store.

GOAL: Plan a complete outfit for "${occasion}"
BUDGET: PKR ${budget} total
SEASON: ${season || 'current season'}
COLOR PREFERENCES: ${preferences?.colors?.join(', ') || 'open to anything'}
OCCASION TYPE: ${goalAnalysis.occasionType}
PRIORITY: ${goalAnalysis.priorityNote}

AVAILABLE PRODUCTS IN STORE:
${productList || 'No products available in this range'}

Create 2 outfit options (a main pick and an alternative) using ONLY the products listed above.
Each outfit should stay within the total budget of PKR ${budget}.

Return ONLY valid JSON, no markdown:
{
  "summary": "2-3 sentences on overall planning strategy for this occasion",
  "totalEstimate": 5500,
  "outfits": [
    {
      "label": "Main Look",
      "description": "Brief description of the complete look and why it works for the occasion",
      "items": [
        {
          "role": "Abaya",
          "productId": "exact_id_from_list",
          "productName": "exact name",
          "price": 3500,
          "stylingNote": "How to wear/style this specific piece"
        }
      ]
    },
    {
      "label": "Alternative Look",
      "description": "...",
      "items": [...]
    }
  ],
  "stylingTips": [
    "Tip 1 specific to this occasion",
    "Tip 2",
    "Tip 3"
  ],
  "budgetAdvice": "One sentence on how to make the most of the budget"
}

If no suitable products exist in the catalog, still provide a helpful plan with general advice and leave productId as null.`;

  const result = await model.generateContent(prompt);
  const text   = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text);
};

/**
 * Main agent function — orchestrates all 3 steps.
 */
const runFashionAgent = async ({ userId, occasion, budget, preferences, season }) => {
  console.log(`👗 Fashion Agent: planning for "${occasion}", budget PKR ${budget}`);

  // Step 1: Analyze goal
  const goalAnalysis = await analyzeGoal(occasion, budget, preferences, season);
  console.log(`   → Categories: ${goalAnalysis.categories.join(', ')}`);

  // Step 2: Fetch products
  const products = await fetchRelevantProducts(goalAnalysis.categories, budget);
  console.log(`   → Found ${products.length} candidate products`);

  // Step 3: Generate plan
  const plan = await createOutfitPlan(occasion, budget, preferences, season, products, goalAnalysis);
  console.log(`   → Generated ${plan.outfits?.length || 0} outfit options`);

  // Save to DB
  const saved = await OutfitPlan.create({
    user: userId,
    occasion,
    budget,
    season,
    preferences,
    plan,
  });

  return saved;
};

/**
 * Get all plans for a user.
 */
const getUserPlans = async (userId) => {
  return await OutfitPlan.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('plan.outfits.items.productId', 'name images price');
};

module.exports = { runFashionAgent, getUserPlans };
