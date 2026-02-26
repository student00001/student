use vehicles

show dbs

db.createCollection("two_wheelers", { capped: true, size: 5242880, max: 5000 })
db.createCollection("four_wheelers")

db.two_wheelers.insertMany([
  { bike_name: "CBR", model: "gear", category: "200cc", colors_available: ["red", "black"], manufacturer: "Honda", performance: 9, timestamp: new Date("2023-01-01"), price: 180000 },
  { bike_name: "Activa", model: "gearless", category: "125cc", colors_available: ["blue", "white"], manufacturer: "Honda", performance: 7, timestamp: new Date("2022-05-10"), price: 85000 },
  { bike_name: "Pulsar", model: "gear", category: "150cc", colors_available: ["sport red", "blue"], manufacturer: "Bajaj", performance: 8, timestamp: new Date("2021-11-20"), price: 120000 },
  { bike_name: "Jupiter", model: "gearless", category: "110cc", colors_available: ["grey", "black"], manufacturer: "TVS", performance: 7, timestamp: new Date("2023-03-15"), price: 75000 },
  { bike_name: "Duke", model: "gear", category: "200cc", colors_available: ["orange", "white"], manufacturer: "KTM", performance: 10, timestamp: new Date("2024-01-10"), price: 200000 }
])

db.four_wheelers.insertMany([
  { vehicle_name: "Swift", model: "own", category: "car", variants: ["vxi", "petrol"], manufacturer: "Maruti", performance: 8, timestamp: new Date("2022-01-01"), price: 700000 },
  { vehicle_name: "Eicher", model: "commercial", category: "mini truck", variants: ["diesel"], manufacturer: "Eicher", performance: 7, timestamp: new Date("2021-06-15"), price: 1500000 },
  { vehicle_name: "City", model: "own", category: "car", variants: ["zxi", "petrol"], manufacturer: "Honda", performance: 9, timestamp: new Date("2023-08-20"), price: 1400000 },
  { vehicle_name: "Traveler", model: "commercial", category: "bus", variants: ["diesel"], manufacturer: "Force", performance: 6, timestamp: new Date("2020-12-01"), price: 1200000 },
  { vehicle_name: "Thar", model: "own", category: "car", variants: ["diesel", "manual"], manufacturer: "Mahindra", performance: 9, timestamp: new Date("2024-02-10"), price: 1600000 }
])

db.two_wheelers.find().pretty()
db.four_wheelers.find().pretty()

db.two_wheelers.find({}, { bike_name: 1, price: 1, _id: 0 })
db.four_wheelers.find({}, { vehicle_name: 1, price: 1, _id: 0 })

db.two_wheelers.find({ manufacturer: "Honda" })

db.four_wheelers.find({ variants: "diesel" })

db.two_wheelers.find(
  { performance: { $gt: 5 } },
  { bike_name: 1, category: 1, manufacturer: 1, _id: 0 }
)

db.four_wheelers.find(
  { performance: { $gt: 5 } },
  { vehicle_name: 1, category: 1, manufacturer: 1, _id: 0 }
)