const { GoogleGenerativeAI } = require('@google/generative-ai');
const TrendReport = require('../models/TrendReport');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Determines the current fashion season based on month.
 */
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1; // 1-12
  const year  = new Date().getFullYear();
  let season;
  if (month >= 3 && month <= 5)       season = 'Spring';
  else if (month >= 6 && month <= 8)  season = 'Summer';
  else if (month >= 9 && month <= 11) season = 'Autumn';
  else                                season = 'Winter';
  return { season, year, label: `${season} ${year}` };
};

/**
 * Uses Gemini to generate a modest fashion trend report.
 * Returns a parsed array of trend objects.
 */
const generateTrendReport = async () => {
  const { season, year, label } = getCurrentSeason();
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

  const prompt = `You are an expert fashion trend analyst specializing in modest fashion — abayas, hijabs, and accessories — popular in Pakistan, South Asia, and the Middle East.

Generate a detailed trend report for ${label} modest fashion. Focus on what Pakistani and South Asian Muslim women are wearing right now.

Return ONLY a valid JSON object in this exact format, no markdown, no extra text:
{
  "trends": [
    {
      "title": "Trend name (short, catchy)",
      "description": "2-3 sentences describing the trend, fabrics, styling, where it's worn",
      "categories": ["abaya-casual", "hijab"],
      "tags": ["keyword1", "keyword2", "keyword3"],
      "popularity": 8,
      "emoji": "🌿"
    }
  ]
}

Include 7 distinct trends. Categories must be from: abaya-casual, abaya-designer, abaya-handmade, abaya-fashion, hijab, accessory.
Popularity is 1-10. Emojis should match the trend vibe.`;

  const result = await model.generateContent(prompt);
  const text   = result.response.text().trim();

  // Strip any accidental markdown fences
  const clean  = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);

  return { season, year, label, trends: parsed.trends };
};

/**
 * Mines trends and saves to DB.
 * Replaces the existing report for the same season/year.
 */
const mineTrends = async () => {
  console.log('🔍 Trend Miner: starting...');
  try {
    const { season, year, trends } = await generateTrendReport();

    // Upsert: one report per season per year
    await TrendReport.findOneAndUpdate(
      { season, year },
      { season, year, trends, generatedAt: new Date() },
      { upsert: true, new: true }
    );

    console.log(`✅ Trend Miner: saved ${trends.length} trends for ${season} ${year}`);
    return { success: true, count: trends.length };
  } catch (err) {
    console.error('❌ Trend Miner error:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Fetch the most recent trend report from DB.
 */
const getLatestTrends = async () => {
  return await TrendReport.findOne().sort({ generatedAt: -1 });
};

module.exports = { mineTrends, getLatestTrends, getCurrentSeason };
