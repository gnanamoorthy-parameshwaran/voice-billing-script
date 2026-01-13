// Tamil Voice Input Parser - Main Module
// Extracts product, quantity, unit, and pricing information from Tamil voice commands

// Product database with Tamil names, units, and prices
const PRODUCTS = [
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
        name: 'தக்காளி',
        price: 40,
        unit: 'கிலோ',
        pronunciation: ['தக்காளி'],
    },
    {
        id: 4,
        name: 'வெங்காயம்',
        price: 35,
        unit: 'கிலோ',
        pronunciation: ['வெங்காயம்'],
    },
    {
        id: 5,
        name: 'கத்தரிக்காய்',
        price: 50,
        unit: 'கிலோ',
        pronunciation: ['கத்தரிக்காய்'],
    },
    {
        id: 6,
        name: 'வாழைப்பழம்',
        price: 30,
        unit: 'கிலோ',
        pronunciation: ['வாழைப்பழம்'],
    },
    {
        id: 7,
        name: 'எலுமிச்சம் பழம்',
        price: 120,
        unit: 'கிலோ',
        pronunciation: ['எலுமிச்சம் பழம்'],
    },
    // Add more products as needed
]

// Tamil numbers mapping
const TAMIL_NUMBERS = {
    ஒன்று: 1,
    ஒன்னு: 1,
    ஒரு: 1,
    இரண்டு: 2,
    ரெண்டு: 2,
    மூன்று: 3,
    மூணு: 3,
    நான்கு: 4,
    நாலு: 4,
    ஐந்து: 5,
    அஞ்சு: 5,
    ஆறு: 6,
    ஏழு: 7,
    எட்டு: 8,
    ஒன்பது: 9,
    பத்து: 10,
    அரை: 0.5,
    கால்: 0.25,
}

// Supported units for conversion
const UNITS = {
    weight: {
        primary: ['கிலோ', 'கிலோகிராம்'],
        secondary: ['கிராம்', 'கிராம்கள்'],
        conversion: 1000, // 1 கிலோ = 1000 கிராம்
    },
    volume: {
        primary: ['லிட்டர்', 'லிட்டர்கள்'],
        secondary: ['மில்லி', 'மில்லிலிட்டர்'],
        conversion: 1000, // 1 லிட்டர் = 1000 மில்லி
    },
}

/**
 * Calculate Damerau-Levenshtein distance for fuzzy string matching
 */
function calculateDistance(word1, word2) {
    const matrix = Array(word2.length + 1)
        .fill(null)
        .map(() => Array(word1.length + 1).fill(null))

    for (let i = 0; i <= word1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= word2.length; j++) matrix[j][0] = j

    for (let j = 1; j <= word2.length; j++) {
        for (let i = 1; i <= word1.length; i++) {
            const cost = word1[i - 1] === word2[j - 1] ? 0 : 1

            matrix[j][i] = Math.min(
                matrix[j - 1][i] + 1, // Deletion
                matrix[j][i - 1] + 1, // Insertion
                matrix[j - 1][i - 1] + cost // Substitution
            )

            // Transposition
            if (
                i > 1 &&
                j > 1 &&
                word1[i - 1] === word2[j - 2] &&
                word1[i - 2] === word2[j - 1]
            ) {
                matrix[j][i] = Math.min(
                    matrix[j][i],
                    matrix[j - 2][i - 2] + cost
                )
            }
        }
    }

    return matrix[word2.length][word1.length]
}

/**
 * Convert Tamil number words to numeric values
 */
function tamilToNumber(text) {
    if (TAMIL_NUMBERS[text]) return TAMIL_NUMBERS[text]
    const num = parseFloat(text)
    return isNaN(num) ? null : num
}

/**
 * Find the best matching product from the products database
 */
function findProduct(command) {
    const words = command.split(' ')
    let bestMatch = null
    let minDistance = Infinity
    let matchInfo = null

    PRODUCTS.forEach((product) => {
        product.pronunciation.forEach((pronunciation) => {
            const productWords = pronunciation.split(' ')
            const productLength = productWords.length

            // Try different positions in the command
            for (let i = 0; i <= words.length - productLength; i++) {
                const candidate = words.slice(i, i + productLength).join(' ')
                const distance = calculateDistance(candidate, pronunciation)

                if (distance < minDistance && distance <= 2) {
                    // Max distance threshold
                    minDistance = distance
                    bestMatch = product
                    matchInfo = {
                        startIndex: i,
                        endIndex: i + productLength - 1,
                        matchedText: candidate,
                        distance: distance,
                    }
                }
            }
        })
    })

    return bestMatch ? { product: bestMatch, matchInfo } : null
}

/**
 * Extract quantity information from command
 */
function extractQuantity(command, excludeIndices = []) {
    const words = command.split(' ')
    const quantities = []

    for (let i = 0; i < words.length; i++) {
        // Skip words that are part of product name
        if (excludeIndices.includes(i)) continue

        const word = words[i]
        const nextWord = words[i + 1]

        // Check for number + unit pattern
        const number = tamilToNumber(word)
        if (number && nextWord) {
            // Check if next word is a unit
            const unitType = getUnitType(nextWord)
            if (unitType) {
                quantities.push({
                    value: number,
                    unit: nextWord,
                    unitType: unitType,
                    position: i,
                })
                i++ // Skip the unit word
            }
        }
    }

    return quantities
}

/**
 * Determine the type of unit (weight/volume)
 */
function getUnitType(unit) {
    if (
        UNITS.weight.primary.includes(unit) ||
        UNITS.weight.secondary.includes(unit)
    ) {
        return 'weight'
    }
    if (
        UNITS.volume.primary.includes(unit) ||
        UNITS.volume.secondary.includes(unit)
    ) {
        return 'volume'
    }
    return null
}

/**
 * Convert quantities to standard units
 */
function normalizeQuantity(quantities, targetUnit) {
    let totalQuantity = 0
    const unitType = getUnitType(targetUnit)

    if (!unitType) return totalQuantity

    quantities.forEach((qty) => {
        if (qty.unitType === unitType) {
            if (UNITS[unitType].primary.includes(qty.unit)) {
                // Primary unit (கிலோ, லிட்டர்)
                totalQuantity += qty.value
            } else if (UNITS[unitType].secondary.includes(qty.unit)) {
                // Secondary unit (கிராம், மில்லி) - convert to primary
                totalQuantity += qty.value / UNITS[unitType].conversion
            }
        }
    })

    return totalQuantity
}

/**
 * Main function to parse Tamil voice input and extract structured information
 */
function parseVoiceInput(command) {
    const result = {
        success: false,
        product: null,
        quantity: 0,
        unit: null,
        price: 0,
        totalAmount: 0,
        originalCommand: command,
        debug: {
            productMatch: null,
            quantitiesFound: [],
            processingSteps: [],
        },
    }

    try {
        result.debug.processingSteps.push('Starting voice input parsing...')

        // Step 1: Find product
        const productMatch = findProduct(command)
        if (!productMatch) {
            result.debug.processingSteps.push('No product found in command')
            return result
        }

        result.product = productMatch.product.name
        result.unit = productMatch.product.unit
        result.price = productMatch.product.price
        result.debug.productMatch = productMatch
        result.debug.processingSteps.push(`Product found: ${result.product}`)

        // Step 2: Extract quantities (excluding product name indices)
        const excludeIndices = []
        for (
            let i = productMatch.matchInfo.startIndex;
            i <= productMatch.matchInfo.endIndex;
            i++
        ) {
            excludeIndices.push(i)
        }

        const quantities = extractQuantity(command, excludeIndices)
        result.debug.quantitiesFound = quantities
        result.debug.processingSteps.push(
            `Quantities found: ${quantities.length}`
        )

        // Step 3: Calculate total quantity
        if (quantities.length > 0) {
            result.quantity = normalizeQuantity(quantities, result.unit)
        } else {
            // Default to 1 if no quantity specified
            result.quantity = 1
            result.debug.processingSteps.push(
                'No quantity found, defaulting to 1'
            )
        }

        // Step 4: Calculate total amount
        result.totalAmount = parseFloat(
            (result.quantity * result.price).toFixed(2)
        )

        result.success = true
        result.debug.processingSteps.push('Parsing completed successfully')
    } catch (error) {
        result.debug.error = error.message
        result.debug.processingSteps.push(`Error: ${error.message}`)
    }

    return result
}

/**
 * Helper function to format the result for display
 */
function formatResult(result) {
    if (!result.success) {
        return {
            status: 'error',
            message: 'Could not parse the voice command',
            debug: result.debug,
        }
    }

    return {
        status: 'success',
        data: {
            product: result.product,
            quantity: result.quantity,
            unit: result.unit,
            price: result.price,
            totalAmount: result.totalAmount,
        },
        formatted: `${result.product} - ${result.quantity} ${result.unit} - ₹${result.totalAmount}`,
        debug: result.debug,
    }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        parseVoiceInput,
        formatResult,
        PRODUCTS,
        TAMIL_NUMBERS,
    }
}

// Example usage and testing
console.log('Tamil Voice Parser loaded successfully!')

// Test examples
const testCommands = [
    'தக்காளி ஒரு கிலோ',
    'தேங்காய் எண்ணெய் இரண்டு லிட்டர்',
    'நான் உங்கள் கடையில் இருந்து ஒரு கிலோ தக்காளி வாங்க விரும்புகிறேன்',
    'வெங்காயம் அரை கிலோ',
]

if (typeof window === 'undefined') {
    testCommands.forEach((cmd) => {
        console.log('\n--- Test Command:', cmd, '---')
        const result = parseVoiceInput(cmd)
        const formatted = formatResult(result)
        console.log('Result:', formatted)
    })
}

// Browser: SpeechRecognition helper and global exports
function SpeechRecognitionService() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        console.warn('SpeechRecognitionService is only available in the browser')
        return
    }

    const startBtn = document.getElementById('startBtn')
    const textArea = document.getElementById('text')
    if (!window._srInstance) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            alert('Speech recognition not supported in this browser')
            return
        }

        const recognition = new SpeechRecognition()
        recognition.lang = 'ta-IN'
        recognition.interimResults = true
        recognition.continuous = false

        recognition.onstart = () => {
            window._srRunning = true
            if (startBtn) startBtn.innerText = 'Stop'
        }

        recognition.onresult = (event) => {
            let transcript = ''
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcript += event.results[i][0].transcript
            }
            if (textArea) textArea.value = transcript.trim()
        }

        recognition.onerror = (e) => {
            console.error('Speech recognition error', e)
        }

        recognition.onend = () => {
            window._srRunning = false
            if (startBtn) startBtn.innerText = 'Start'
        }

        window._srInstance = recognition
    }

    // Toggle start/stop
    if (window._srRunning) {
        window._srInstance.stop()
    } else {
        window._srInstance.start()
    }
}

// Expose useful functions to the window for the page
if (typeof window !== 'undefined') {
    window.parseVoiceInput = parseVoiceInput
    window.formatResult = formatResult
    window.SpeechRecognitionService = SpeechRecognitionService
    window.PRODUCTS = PRODUCTS
}
