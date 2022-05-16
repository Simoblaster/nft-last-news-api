const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

// news

const newspapers = [
    {
        name: 'theblockcrypto',
        address: 'https://www.theblockcrypto.com',
        base: 'https://www.theblockcrypto.com'
    },
    {
        name: 'theverge',
        address: 'https://www.theverge.com/cryptocurrency',
        base: ''
    },
    {
        name: 'cryptonewsz',
        address: 'https://www.cryptonewsz.com',
        base: 'https://www.cryptonewsz.com'
    },
    {
        name: 'techstory',
        address: 'https://techstory.in/category/crypto',
        base: 'https://techstory.in'
    },
    {
        name: 'cointelegraph',
        address: 'https://cointelegraph.com',
        base: 'https://cointelegraph.com'
    },
    {
        name: 'coinpedia',
        address: 'https://coinpedia.org/news',
        base: 'https://coinpedia.org'
    },
    {
        name: 'dailymail',
        address: 'https://www.dailymail.co.uk',
        base: 'https://www.dailymail.co.uk'
    },
    {
        name: 'cryptonews',
        address: 'https://cryptonews.com',
        base: 'https://cryptonews.com'
    },
    {
        name: 'ndtv',
        address: 'https://www.ndtv.com/business/cryptocurrency',
        base: ''
    },
    {
        name: 'marketwatch',
        address: 'https://www.marketwatch.com',
        base: ''
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        
        $('a:contains("NFT")', html).each(function () {
            let title = $(this).text()
            const url = $(this).attr('href')
            
            title = title.trim();

            if (title.length > 4) {

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            }
        })
    })
})

app.get('/', (req, res) => {
    res.json('Welcome to my NFT News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId
    
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
    
    
    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []
        
        $('a:contains("NFT")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))
})

// sales

app.get('/sales/:itemsToShow/:blockchain', (req, res) => {

    const itemsToShow = req.params.itemsToShow;
    const blockchain = req.params.blockchain;

    if (itemsToShow && !isNaN(itemsToShow)) {
        if (itemsToShow > 0 && itemsToShow <= 100) {
            
            // ethereum
            switch (blockchain) {
                case 'ethereum':

                break;
                default :
                    res.json('Blockchain not managed');
            }



        } else {
            res.json('itemsToShow parameter is out of range, insert a number between 1 and 100');
            return;
        }
    } else {
        res.json('itemsToShow parameter is not a number');
        return;
    }

});

function getData(itemsToShow, blockchain) {

    

}

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
