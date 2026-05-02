import Template from '../models/Template.js';

// @desc    Get templates (Live from Unsplash API)
// @route   GET /api/templates
export const getTemplates = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = search || category || 'background';
    
    // Fetch live images from Unsplash
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=15&client_id=${process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_KEY'}`
    );
    
    const data = await response.json();
    
    if (data.results) {
      // Map Unsplash results to our Template format
      const liveTemplates = data.results.map(img => ({
        _id: img.id,
        name: img.alt_description || 'Custom Template',
        category: category || 'Search Results',
        imageUrl: img.urls.regular,
        isPremium: Math.random() > 0.7, // Randomly assign premium for demo
      }));
      
      return res.json(liveTemplates);
    }

    // Fallback if API fails or limit is reached
    const localTemplates = await Template.find(category && category !== 'All' ? { category } : {});
    res.json(localTemplates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed initial templates (Optional backup)
export const seedTemplates = async (req, res) => {
  try {
    // We can keep this as a backup if Unsplash is down
    res.status(200).json({ message: "Templates are now live via API!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
