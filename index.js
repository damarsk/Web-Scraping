const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "Selamat datang di Scraper Kompas.com!",
        available_endpoints: {
            "/news-game": "Mendapatkan berita terbaru seputar Games"
        }
    });
});

app.get('/news-game', async (req, res) => {
    const url = 'https://tekno.kompas.com/game';
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const news = [];
        
        $('div.wSpec-item').each((index, element) => {
            const title = $(element).find('h3.wSpec-title').text().trim();
            const image = $(element).find('div.wSpec-img > img').attr('src');
            const date = $(element).find('p.wSpec-subtitle > span').text().trim();
            const link = $(element).find('a').attr('href'); 
            news.push({ title, image, date, link });
        });

        if (news.length > 0) {
            res.json({ message: "Berita terbaru ditemukan", data: news });
        } else {
            res.status(404).json({ message: "Tidak ada berita terbaru yang ditemukan" });
        }
    } catch (error) {
        console.error("Error scraping news:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil berita" });
    }
});

app.listen(3000, () => {
    console.log("Server berjalan di http://localhost:3000");
});