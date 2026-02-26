use animal

show dbs

db.createCollection("wild_animals", { capped: true, size: 5242880, max: 5000 })
db.createCollection("domestic_animals")

db.wild_animals.insertMany([
  { animal_name: "Lion", nature: "harm", favorite_foods: ["meat", "deer"], care_taker_name: "John", life_span: 15, timestamp: new Date("2024-01-01"), expenses: 5000 },
  { animal_name: "Tiger", nature: "harm", favorite_foods: ["meat"], care_taker_name: "Alice", life_span: 12, timestamp: new Date("2024-01-02"), expenses: 4500 },
  { animal_name: "Elephant", nature: "harmless", favorite_foods: ["grass"], care_taker_name: "John", life_span: 60, timestamp: new Date("2024-01-03"), expenses: 7000 },
  { animal_name: "Wolf", nature: "harm", favorite_foods: ["meat", "rabbits"], care_taker_name: "Bob", life_span: 8, timestamp: new Date("2024-01-04"), expenses: 3000 },
  { animal_name: "Giraffe", nature: "harmless", favorite_foods: ["leaves"], care_taker_name: "Alice", life_span: 25, timestamp: new Date("2024-01-05"), expenses: 4000 }
])

db.domestic_animals.insertMany([
  { animal_name: "Dog", gender: "male", favorite_foods: ["meat"], animal_petname: "Rocky", life_span: 13, timestamp: new Date("2024-01-06"), expenses: 1500 },
  { animal_name: "Cat", gender: "female", favorite_foods: ["fish"], animal_petname: "Kitty", life_span: 15, timestamp: new Date("2024-01-07"), expenses: 1000 },
  { animal_name: "Cow", gender: "female", favorite_foods: ["grass"], animal_petname: "Gauri", life_span: 20, timestamp: new Date("2024-01-08"), expenses: 2000 },
  { animal_name: "Rabbit", gender: "male", favorite_foods: ["carrots"], animal_petname: "Bunny", life_span: 8, timestamp: new Date("2024-01-09"), expenses: 500 },
  { animal_name: "Goat", gender: "female", favorite_foods: ["leaves"], animal_petname: "Champa", life_span: 12, timestamp: new Date("2024-01-10"), expenses: 800 }
])

db.wild_animals.find().pretty()
db.domestic_animals.find().pretty()

db.wild_animals.find({}, { animal_name: 1, expenses: 1, _id: 0 })
db.domestic_animals.find({}, { animal_name: 1, expenses: 1, _id: 0 })

db.domestic_animals.find({ life_span: 20 })

db.wild_animals.find({ care_taker_name: "John" })

db.wild_animals.find(
  { life_span: { $gt: 5 } },
  { animal_name: 1, favorite_foods: 1, expenses: 1, _id: 0 }
)

db.domestic_animals.find(
  { life_span: { $gt: 5 } },
  { animal_name: 1, favorite_foods: 1, expenses: 1, _id: 0 }
)