const data = [
  {
    id: 1,
    name: "நாட்டுச்சக்கரை",
    price: 100,
    unit: "கிலோ",
    pronunciation: ["நாட்டுச்சக்கரை"],
  },
  {
    id: 2,
    name: "தேங்காய் எண்ணெய்",
    unit: "லிட்டர்",
    price: 280,
    pronunciation: ["தேங்காய் எண்ணெய்"],
  },
  {
    id: 3,
    name: "சோன்பப்படி",
    price: 25,
    unit: "",
    pronunciation: ["சோன்பப்படி"],
  },
  {
    id: 4,
    name: "மணிலா பர்பி",
    unit: "",
    price: 50,
    pronunciation: ["மணிலா பர்பி"],
  },
  {
    id: 5,
    name: "கடலை மிட்டாய்",
    price: 50,
    unit: "",
    pronunciation: ["கடலை மிட்டாய்"],
  },
  {
    id: 6,
    name: "கருப்பட்டி கடலை மிட்டாய்",
    price: 70,
    unit: "",
    pronunciation: ["கருப்பட்டி கடலை மிட்டாய்"],
  },
  {
    id: 7,
    name: "திருநெல்வேலி அல்வா",
    price: 240,
    unit: "கிலோ",
    pronunciation: ["திருநெல்வேலி அல்வா"],
  },
  {
    id: 8,
    name: "மஸ்கோத் அல்வா",
    price: 200,
    unit: "கிலோ",
    pronunciation: ["மஸ்கோத் அல்வா"],
  },
  {
    id: 9,
    name: "கருப்பட்டி அல்வா",
    price: 280,
    unit: "கிலோ",
    pronunciation: ["கருப்பட்டி அல்வா"],
  },
  {
    id: 10,
    name: "கத்தரிக்காய்",
    price: 50,
    unit: "கிலோ",
    pronunciation: ["கத்தரிக்காய்"],
  },
  {
    id: 11,
    name: "வாழைப்பழம்",
    price: 30,
    unit: "கிலோ",
    pronunciation: ["வாழைப்பழம்"],
  },
  {
    id: 12,
    name: "எலுமிச்சம் பழம்",
    price: 120,
    unit: "கிலோ",
    pronunciation: ["எலுமிச்சம் பழம்"],
  },
  {
    id: 13,
    name: "சிரட்டை கரி",
    price: 50,
    unit: "கிலோ",
    pronunciation: ["சிரட்டை கரி"],
  },
  {
    id: 14,
    name: "கம்பு கரி",
    price: 40,
    unit: "கிலோ",
    pronunciation: ["கம்பு கரி"],
  },
  {
    id: 15,
    name: "வைக்கோல்",
    unit: "",
    price: 300,
    pronunciation: ["வைக்கோல்"],
  },
  {
    id: 16,
    name: "சிரட்டை",
    price: 8,
    unit: "கிலோ",
    pronunciation: ["சிரட்டை"],
  },
  {
    id: 17,
    name: "ஒன்னாம் நம்பர் கொப்பரை",
    price: 90,
    unit: "கிலோ",
    pronunciation: ["ஒன்னாம் நம்பர் கொப்பரை"],
  },
  {
    id: 18,
    name: "இரண்டாம் நம்பர் கொப்பரை",
    price: 70,
    unit: "கிலோ",
    pronunciation: ["இரண்டாம் நம்பர் கொப்பரை"],
  },
  {
    id: 19,
    name: "விடலை தேங்காய்",
    price: 24,
    unit: "கிலோ",
    pronunciation: ["விடலை தேங்காய்"],
  },
  {
    id: 20,
    name: "சோங்கு தேங்காய்",
    price: 8,
    unit: "கிலோ",
    pronunciation: ["சோங்கு தேங்காய்"],
  },
];

const CalculateDamerauLevenshteinDistance = (word1, word2) => {
  const matrix = Array(word2.length + 1)
    .fill(null)
    .map(() => Array(word1.length + 1).fill(null));

  for (let i = 0; i <= word1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= word2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= word2.length; j++) {
    for (let i = 1; i <= word1.length; i++) {
      const cost = word1[i - 1] === word2[j - 1] ? 0 : 1;

      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1, // Deletion
        matrix[j][i - 1] + 1, // Insertion
        matrix[j - 1][i - 1] + cost // Substitution
      );

      if (
        i > 1 &&
        j > 1 &&
        word1[i - 1] === word2[j - 2] &&
        word1[i - 2] === word2[j - 1]
      ) {
        matrix[j][i] = Math.min(
          matrix[j][i],
          matrix[j - 2][i - 2] + cost // Transposition
        );
      }
    }
  }

  return matrix[word2.length][word1.length];
};

// convert the string into array
const actualCommand =
  "நான் உங்கள் கடையில் இருந்து 1 லிட்டர் மற்றும் 500 மில்லி தேங்காய் எண்ணெய் வாங்க விரும்புகிறேன்";
const commandArray = actualCommand.split(" ");
const BestMatchedProduct = [];
for (var j = 0, count = data.length; j < count; j++) {
  const BestMatchedPronunciation = [];
  for (var k = 0, kcount = data[j].pronunciation.length; k < kcount; k++) {
    const searchProduct = data[j].pronunciation[k];

    const searchProductArray = searchProduct.split(" ");
    // console.log(commandArray);
    const CommandLength = commandArray.length;
    // console.log(CommandLength);
    const SearchProductLength = searchProductArray.length;
    // console.log(SearchProductLength);

    // Now we have to group the words to match the lenght of the product
    const GroupedArray = [];
    for (
      let i = 0, iteration = CommandLength - SearchProductLength;
      i <= iteration;
      i++
    ) {
      const endIndex = i + SearchProductLength;
      GroupedArray.push({
        startIndex: i,
        endIndex: endIndex - 1,
        groupedString: commandArray
          .slice(i, endIndex)
          .toString()
          .replaceAll(",", " "),
      });
    }
    // console.log(GroupedArray);

    // Now i want to compare the string grouped string with the product
    const GroupedArrayWithCalculatedDistance = [];
    let LeastDistance = 100;
    GroupedArray.forEach((item) => {
      // console.log(item.groupedString);
      const distance = CalculateDamerauLevenshteinDistance(
        item.groupedString,
        searchProduct
      );
      const result = {
        ...item,
        productName: data[j].name,
        distance: distance,
        searchProduct: searchProduct,
        unit: data[j].unit,
        price: data[j].price,
      };
      if (distance < LeastDistance) {
        LeastDistance = distance;
      }
      GroupedArrayWithCalculatedDistance.push(result);
    });

    // console.log(LeastDistance);

    // console.log(GroupedArrayWithCalculatedDistance);
    const SelectedGroupedArray = GroupedArrayWithCalculatedDistance.filter(
      (item) => item.distance === LeastDistance
    )[0];

    // console.log(SelectedGroupedArray);
    BestMatchedPronunciation.push(SelectedGroupedArray);
  }
  const BestMatchedPronunciationLeastDistance = Math.min(
    ...BestMatchedPronunciation.map((item) => item.distance)
  );
  const BestMatchedProductLeastDistance = BestMatchedPronunciation.filter(
    (item) => item.distance === BestMatchedPronunciationLeastDistance
  )[0];
  BestMatchedProduct.push(BestMatchedProductLeastDistance);
}
// console.log(BestMatchedProduct);

// The result the Find product should product is as follows
const BestMatchedProductLeastDistance = Math.min(
  ...BestMatchedProduct.map((item) => {
    return item.distance;
  })
);
const BestMatchedProductLeast = BestMatchedProduct.filter(
  (item) => item.distance === BestMatchedProductLeastDistance
)[0];

if (BestMatchedProductLeast.distance <= 2) {
  // console.log(commandArray);
  commandArray.splice(
    BestMatchedProductLeast.startIndex,
    BestMatchedProductLeast.endIndex + 1 - BestMatchedProductLeast.startIndex
  );
  const RemainingCommand = commandArray.toString().replaceAll(",", " ");
  console.log("Product: ", {
    ...BestMatchedProductLeast,
    status: true,
    command: RemainingCommand,
  });
} else {
  console.log({
    status: false,
    message: "Product not found",
  });
}
