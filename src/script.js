const data = [
    {
        id: 1,
        name: 'நாட்டுச்சக்கரை',
        price: 100,
        unit: 'கிலோ',
        pronunciation: ['நாட்டுச்சக்கரை'],
    },
    {
        id: 2,
        name: 'தேங்காய் எண்ணெய்',
        price: 280,
        unit: 'லிட்டர்',
        pronunciation: ['தேங்காய் எண்ணெய்'],
    },
    {
        id: 3,
        name: 'சோன்பப்படி',
        price: 25,
        unit: '',
        pronunciation: ['சோன்பப்படி'],
    },
    {
        id: 4,
        name: 'மணிலா பர்பி',
        price: 50,
        unit: '',
        pronunciation: ['மணிலா பர்பி'],
    },
    {
        id: 5,
        name: 'கடலை மிட்டாய்',
        price: 50,
        unit: '',
        pronunciation: ['கடலை மிட்டாய்'],
    },
    {
        id: 6,
        name: 'கருப்பட்டி கடலை மிட்டாய்',
        price: 70,
        unit: '',
        pronunciation: ['கருப்பட்டி கடலை மிட்டாய்'],
    },
    {
        id: 7,
        name: 'திருநெல்வேலி அல்வா',
        price: 240,
        unit: 'கிலோ',
        pronunciation: ['திருநெல்வேலி அல்வா'],
    },
    {
        id: 8,
        name: 'மஸ்கோத் அல்வா',
        price: 200,
        unit: 'கிலோ',
        pronunciation: ['மஸ்கோத் அல்வா'],
    },
    {
        id: 9,
        name: 'கருப்பட்டி அல்வா',
        price: 280,
        unit: 'கிலோ',
        pronunciation: ['கருப்பட்டி அல்வா'],
    },
    {
        id: 10,
        name: 'கத்தரிக்காய்',
        price: 50,
        unit: 'கிலோ',
        pronunciation: ['கத்தரிக்காய்'],
    },
    {
        id: 11,
        name: 'வாழைப்பழம்',
        price: 30,
        unit: 'கிலோ',
        pronunciation: ['வாழைப்பழம்'],
    },
    {
        id: 12,
        name: 'எலுமிச்சம் பழம்',
        price: 120,
        unit: 'கிலோ',
        pronunciation: ['எலுமிச்சம் பழம்'],
    },
    {
        id: 13,
        name: 'சிரட்டை கரி',
        price: 50,
        unit: 'கிலோ',
        pronunciation: ['சிரட்டை கரி'],
    },
    {
        id: 14,
        name: 'கம்பு கரி',
        price: 40,
        unit: 'கிலோ',
        pronunciation: ['கம்பு கரி'],
    },
    {
        id: 15,
        name: 'வைக்கோல்',
        price: 300,
        unit: '',
        pronunciation: ['வைக்கோல்'],
    },
    {
        id: 16,
        name: 'சிரட்டை',
        price: 8,
        unit: 'கிலோ',
        pronunciation: ['சிரட்டை'],
    },
    {
        id: 17,
        name: 'ஒன்னாம் நம்பர் கொப்பரை',
        price: 90,
        unit: 'கிலோ',
        pronunciation: ['ஒன்னாம் நம்பர் கொப்பரை'],
    },
    {
        id: 18,
        name: 'இரண்டாம் நம்பர் கொப்பரை',
        price: 70,
        unit: 'கிலோ',
        pronunciation: ['இரண்டாம் நம்பர் கொப்பரை'],
    },
    {
        id: 19,
        name: 'விடலை தேங்காய்',
        price: 24,
        unit: 'கிலோ',
        pronunciation: ['விடலை தேங்காய்'],
    },
    {
        id: 20,
        name: 'சோங்கு தேங்காய்',
        price: 8,
        unit: 'கிலோ',
        pronunciation: ['சோங்கு தேங்காய்'],
    },
]

const units = [
    'லிட்டர்',
    'மில்லி லிட்டர்',
    'மில்லிலிட்டர்',
    'மில்லி',
    'கிலோ',
    'கிராம்',
]

function FindProduct(command) {
    const FindRelatedString = (command, product, maxDistance) => {
        const matches = []
        // Example command: நான் உங்கள் கடையில் இருந்து 1 லிட்டர் மற்றும் 500 மில்லி தேங்காய் எண்ணெய் வாங்க விரும்புகிறேன்
        // Expected product: தேங்காய் எண்ணெய்
        // Expected Weight: 1.5

        const productLength = product.split(' ')?.length // 2
        const commandLength = command.split(' ')?.length // 13
        // const iteration = commandLength
        for (
            i = 0, iteration = commandLength / productLength;
            i < iteration;
            i++
        ) {
            const word = command
                ?.split(' ')
                ?.slice(i, i + productLength)
                ?.toString()
                ?.replaceAll(',', ' ')
            const distance = CalculateDamerauLevenshteinDistance(word, product)
            if (distance <= maxDistance) {
                matches.push({
                    product,
                    distance,
                })
            }
        }
        return matches
    }

    const maxDistance = 2
    const searchResult = data.map((item) => {
        const searchResults = FindRelatedString(
            command,
            item?.name,
            maxDistance
        )
        return searchResults
    })

    const filteredProducts = searchResult.filter((item) => item?.length > 0)
    if (filteredProducts?.length > 0) {
        const minimumDistance = Math.min(
            ...filteredProducts.map((item) => item[0].distance)
        )
        const finalProduct = filteredProducts.filter(
            (item) => item[0]?.distance == minimumDistance
        )[0]
        return finalProduct[0].product
    } else {
        return ''
    }
}

function FindQuantity(command) {
    const wordsInCommand = command?.split(' ')
    let kgquantity = 0.0
    let gquantity = 0.0
    let quantity = ''
    const result = DoesCommandContainsUnit(command)
    if (result?.status) {
        for (var i = 0; i < wordsInCommand.length; i++) {
            if (wordsInCommand[i] === result?.unit) {
                kgquantity = parseInt(StringToNumber(wordsInCommand[i - 1]))
            }
            if (wordsInCommand[i] === 'கிராம்') {
                gquantity = parseInt(StringToNumber(wordsInCommand[i - 1]))
            }
        }
        quantity = kgquantity + parseFloat(gquantity / 1000)
        console.log('Quantity: ', quantity)
        return quantity
    } else {
        wordsInCommand.forEach((item) => {
            console.log(parseFloat(item))
            const numberInWord = parseFloat(item)
            console.log(typeof numberInWord)
            if (typeof numberInWord === 'number') {
                console.log('The item has number and it is', parseFloat(item))
            }
        })
    }
}

function FindPrice(product) {
    console.log('Product i got to find price', product)
    if (IsValidData(product)) {
        const priceFiler = data.filter((item) => {
            return item.name == product
        })
        console.log('Price: ', priceFiler[0].price)
        return priceFiler[0].price
    } else {
        return ''
    }
}

function HandleCommand(command) {
    let product = ''
    let price = ''
    let quantity = ''

    product = FindProduct(command)
    price = FindPrice(product)
    quantity = FindQuantity(command)

    if (quantity !== '' && price !== '' && product !== '') {
        return {
            status: true,
            product: product,
            price: price,
            quantity: quantity,
            amount: parseFloat(price * quantity).toFixed(2),
        }
    } else {
        return { status: false }
    }
}

function CalculateDamerauLevenshteinDistance(word1, word2) {
    const matrix = Array(word2.length + 1)
        .fill(null)
        .map(() => Array(word1.length + 1).fill(null))

    for (let i = 0; i <= word1.length; i++) {
        matrix[0][i] = i
    }

    for (let j = 0; j <= word2.length; j++) {
        matrix[j][0] = j
    }

    for (let j = 1; j <= word2.length; j++) {
        for (let i = 1; i <= word1.length; i++) {
            const cost = word1[i - 1] === word2[j - 1] ? 0 : 1

            matrix[j][i] = Math.min(
                matrix[j - 1][i] + 1, // Deletion
                matrix[j][i - 1] + 1, // Insertion
                matrix[j - 1][i - 1] + cost // Substitution
            )

            if (
                i > 1 &&
                j > 1 &&
                word1[i - 1] === word2[j - 2] &&
                word1[i - 2] === word2[j - 1]
            ) {
                matrix[j][i] = Math.min(
                    matrix[j][i],
                    matrix[j - 2][i - 2] + cost // Transposition
                )
            }
        }
    }

    return matrix[word2.length][word1.length]
}

function StringToNumber(text) {
    var value = text
    switch (text) {
        case 'ஒன்னு': {
            value = '1'
            break
        }
        case 'ஒன்று': {
            value = '1'
            break
        }
        case 'ஒரு': {
            value = '1'
            break
        }
        case 'இரண்டு': {
            value = '2'
            break
        }
        case 'ரெண்டு': {
            value = '2'
            break
        }
        case 'மூன்று': {
            value = '3'
            break
        }
        case 'மூணு': {
            value = '3'
            break
        }
        case 'நான்கு': {
            value = '4'
            break
        }
        case 'நாலு': {
            value = '4'
            break
        }
        case 'அஞ்சு': {
            value = '5'
            break
        }
        case 'ஆறு': {
            value = '6'
            break
        }
        case 'ஏழு': {
            value = '7'
            break
        }
        case 'எட்டு': {
            value = '8'
            break
        }
        case 'ஒன்பது': {
            value = '9'
            break
        }
        case 'பத்து': {
            value = '10'
            break
        }
        default: {
            value = text
        }
    }
    return value
}

function IsValidData(data) {
    return data !== '' && data !== null && data !== undefined
}

function DoesCommandContainsUnit(command) {
    const response = {
        status: false,
        unit: '',
    }
    // How can i find the multiple units
    units.forEach((item) => {
        if (command.includes(item)) {
            response.status = true
            response.unit = item
        }
    })
    return response
}

function SpeechRecognitionService() {
    console.log('mic pressed')
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'ta-IN'
    recognition.onstart = function () {
        console.log('We are listening. Try speaking into the microphone.')
    }

    recognition.onspeechend = function () {
        // when user is done speaking
        // recognition.stop();
    }

    /* Once the SpeechRecognition ends,
  we have to start it again to get Continuous input
*/
    recognition.onend = () => {
        // recognition.start();
    }

    recognition.onresult = function (event) {
        console.log('I got some results', event)
        var voiceCommand = event.results[0][0].transcript
        document.getElementById('text').value = voiceCommand
    }
    recognition.start()
}
