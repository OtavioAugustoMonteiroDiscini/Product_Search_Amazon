const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Função para raspar dados do Amazon
const scrapeAmazon = async (keyword) => {
    try {
        const response = await axios.get(`https://www.amazon.com/s?k=${keyword}`);
        const dom = new JSDOM(response.data);
        const document = dom.window.document;
        
        const products = [];
        const productElements = document.querySelectorAll('.s-main-slot .s-result-item');

        productElements.forEach(product => {
            const titleElement = product.querySelector('h2 a span');
            const ratingElement = product.querySelector('.a-icon-alt');
            const reviewsElement = product.querySelector('.a-size-small .a-size-base');
            const imageElement = product.querySelector('.s-image');

            if (titleElement && ratingElement && reviewsElement && imageElement) {
                const title = titleElement.textContent.trim();
                const rating = ratingElement.textContent.trim().split(' ')[0];
                const reviews = reviewsElement.textContent.trim();
                const imageUrl = imageElement.src;

                products.push({
                    title,
                    rating,
                    reviews,
                    imageUrl
                });
            }
        });

        return products;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Endpoint /api/scrape
app.get('/api/scrape', async (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    const products = await scrapeAmazon(keyword);
    res.json(products);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
