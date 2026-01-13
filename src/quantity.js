/*
{ 
  startIndex: 9, 
  endIndex: 10, 
  groupedString: 'தேங்காய் எண்ணெய்', 
  productName: 'தேங்காய் எண்ணெய்', 
  distance: 0, 
  searchProduct: 'தேங்காய் எண்ணெய்', 
  unit: 'லிட்டர்', 
  price: 280, 
  status: true, 
  command: 'நான் உங்கள் கடையில் இருந்து 1 லிட்டர் மற்றும் 500 மில்லி வாங்க விரும்புகிறேன்',
} 
*/
const ConversionArray = [
    ['கிலோ', 'கிராம்'],
    ['லிட்டர்', 'மில்லி'],
]

// On the way to handle the invalid unit conversion
const productResponse = {
    startIndex: 9,
    endIndex: 10,
    groupedString: 'தேங்காய் எண்ணெய்',
    productName: 'தேங்காய் எண்ணெய்',
    distance: 0,
    searchProduct: 'தேங்காய் எண்ணெய்',
    unit: 'லிட்டர்',
    price: 280,
    status: true,
    command: 'நான் உங்கள் கடையில் இருந்து ஒரு லிட்டர் வாங்க விரும்புகிறேன்',
}
//லிட்டர் மற்றும் 500 மில்லி

const units = ['லிட்டர்', 'மில்லி', 'கிலோ', 'கிராம்']

function StringToNumber(text) {
    switch (text) {
        case 'ஒன்னு': {
            return 1
        }
        case 'ஒன்று': {
            return 1
        }
        case 'ஒரு': {
            return 1
        }
        case 'இரண்டு': {
            return 2
        }
        case 'ரெண்டு': {
            return 2
        }
        case 'மூன்று': {
            return 3
        }
        case 'மூணு': {
            return 3
        }
        case 'நான்கு': {
            return 4
        }
        case 'நாலு': {
            return 4
        }
        case 'அஞ்சு': {
            return 5
        }
        case 'ஆறு': {
            return 6
        }
        case 'ஏழு': {
            return 7
        }
        case 'எட்டு': {
            return 8
        }
        case 'ஒன்பது': {
            return 9
        }
        case 'பத்து': {
            return 10
        }
        default: {
            return text
        }
    }
}

function MultiplyByThousand(num) {
    return parseFloat(num) * 1000
}

function DivideByThousand(num) {
    return parseFloat(num) / 1000
}

function QuantityConversion(successfullFind) {
    const MakeConversion = (object) => {
        console.log(object)
        let quantity = 0
        const unit1 = object.from.unit
        const unit2 = object.to.unit

        if (unit1 === unit2) {
            quantity += parseFloat(object.from.quantity)
        } else {
            for (var j = 0; j < ConversionArray.length; j++) {
                const CurrentArray = ConversionArray[j]
                if (unit1 === CurrentArray[0] && unit2 === CurrentArray[1]) {
                    // Kilo to gram
                    const result = MultiplyByThousand(object.from.quantity)
                    console.log(result)
                    quantity += result
                } else if (
                    unit1 === CurrentArray[1] &&
                    unit2 === CurrentArray[0]
                ) {
                    // gram to kilo
                    const result = DivideByThousand(object.from.quantity)
                    console.log(result)
                    quantity += result
                } else {
                    console.log(
                        'Cannot make conversion from ',
                        unit1,
                        ' to ',
                        unit2
                    )
                }
            }
        }
        return quantity
    }
    let quantity = 0
    for (var i = 0; i < successfullFind.length; i++) {
        const object = successfullFind[i]
        const conversionResult = MakeConversion(object)
        quantity += conversionResult
    }
    return quantity
}

function QuantityAnalysis(command) {
    // console.log(command);
    const CommandArray = command.split(' ')
    // console.log(CommandArray);
    const CommandArrayLength = CommandArray.length
    // console.log(CommandArrayLength);
    const ResponseModel = {
        hasUnit: false,
        countOfUnits: 0,
        unitInCommand: [],
        actualUnit: [],
        unitIndex: [],
        hasNumber: false,
        countOfNumbers: 0,
        indexOfNumbers: [],
    }

    // First we have to find wheather the command has unit
    // We have some basic units in an array
    CommandArray.forEach((item, index) => {
        if (units.includes(item)) {
            ResponseModel.hasUnit = true
            ResponseModel.countOfUnits = ResponseModel.countOfUnits + 1
            ResponseModel.unitInCommand.push(item)
            ResponseModel.actualUnit.push(item)
            ResponseModel.unitIndex.push(index)
        }
    })

    // Now we have to find wheather the command has numbers
    CommandArray.forEach((item, index) => {
        if (parseFloat(item)) {
            ResponseModel.hasNumber = true
            ResponseModel.countOfNumbers = ResponseModel.countOfNumbers + 1
            ResponseModel.indexOfNumbers.push(index)
        }
    })
    return ResponseModel
}

function GetQuantity(productResponse, quantityAnalysisResult) {
    const response = {
        status: false,
        message: '',
        quantity: 0,
    }
    const CommandArray = productResponse.command.split(' ')
    // console.log(CommandArray);
    const CommandArrayLength = CommandArray.length
    /*
      What are the cases might occur
      Case 1:
        The string contains unit and the number is placed before unit
        for example: "1 லிட்டர்"
      Case 2: 
        The string does not contains unit and the number is next to it
     */
    if (quantityAnalysisResult.hasUnit && quantityAnalysisResult.hasNumber) {
        const { unitIndex, unitInCommand } = quantityAnalysisResult
        const successfullFind = []
        for (var i = 0; i < unitIndex.length; i++) {
            if (CommandArray[unitIndex[i]] === unitInCommand[i]) {
                /*
          The unit is placed after the number
          for example: "1 லிட்டர்"
        */
                successfullFind.push({
                    from: {
                        quantity: CommandArray[unitIndex[i] - 1],
                        unit: quantityAnalysisResult.actualUnit[i],
                    },
                    to: {
                        unit: productResponse.unit,
                    },
                })
            }
        }
        const QuantityConversionResult = QuantityConversion(successfullFind)
        console.log(QuantityConversionResult)
        response.status = true
        return QuantityConversionResult
    } else if (
        quantityAnalysisResult.hasNumber &&
        !quantityAnalysisResult.hasUnit
    ) {
        // The quantity has number and not unit
        // Might be like vaikol kattu
        if (quantityAnalysisResult.countOfNumbers === 1) {
            const result = parseFloat(
                CommandArray[quantityAnalysisResult.indexOfNumbers[0]]
            )
            console.log(result)
            return result
        }
    } else if (
        !quantityAnalysisResult.hasNumber &&
        quantityAnalysisResult.hasUnit
    ) {
        // The quantity is in string format
        console.log(quantityAnalysisResult)
        // try to convert the stirng to number of word unit in command
        const NumberBeforeUnit =
            CommandArray[quantityAnalysisResult.unitIndex[0] - 1]
        console.log(NumberBeforeUnit)
        const ConvertedNumber = StringToNumber(NumberBeforeUnit)
        console.log(ConvertedNumber)
        if (typeof ConvertedNumber === 'number') {
            return ConvertedNumber
        } else {
            console.log('Quantity not exitst')
        }
    } else {
        console.log('Quantity not exist')
        // The quantity doesn't exist
    }
}

// Start here
const QuantityAnalysisResult = QuantityAnalysis(productResponse.command)
GetQuantity(productResponse, QuantityAnalysisResult)
