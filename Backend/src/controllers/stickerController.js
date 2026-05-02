import axios from 'axios';

// Fallback to a common public test key if one isn't provided in .env
const GIPHY_API_KEY = process.env.GIPHY_API_KEY || 'GlVGYHqc3SyCE3sgFKPKfiQpNc24Fced';
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/stickers';

export const getStickers = async (req, res) => {
  try {
    const { search, limit = 15 } = req.query;
    
    let url;
    if (search) {
      url = `${GIPHY_BASE_URL}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(search)}&limit=${limit}&rating=g`;
    } else {
      url = `${GIPHY_BASE_URL}/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&rating=g`;
    }

    const response = await axios.get(url);
    
    // Format the response to only send what the frontend needs
    const stickers = response.data.data.map(sticker => ({
      id: sticker.id,
      title: sticker.title,
      // We use the fixed_height_small URL for the tray preview
      previewUrl: sticker.images.fixed_height_small.url,
      // We use the original url for the actual canvas placement
      url: sticker.images.original.url
    }));

    res.json({ success: true, stickers });
  } catch (error) {
    console.error('Error fetching stickers:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch stickers from Giphy' });
  }
};
