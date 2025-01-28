const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { stringify } = require('csv-stringify');

// Paths
const jsonFilePath = path.join(__dirname, 'backups', 'addresses.json');
const kmlFilePath = path.join(__dirname, 'public', 'Country Place Recall.kml');
const csvFilePath = path.join(__dirname, 'public', 'addresses.csv');

// Read JSON file
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

// Initialize CSV data
let csvData = [];
let idCounter = 1;

// Parse KML file
xml2js.parseString(fs.readFileSync(kmlFilePath, 'utf8'), (err, result) => {
  if (err) throw err;

  console.log('KML File Parsed:', result);

  if (!result.kml || !result.kml.Document || !result.kml.Document[0].Folder) {
    throw new Error('Invalid KML file structure');
  }

  const folders = result.kml.Document[0].Folder;
  console.log('Folders:', folders);

  const placemarks = folders.flatMap(folder => folder.Placemark);
  console.log('Placemarks:', placemarks);

  const kmlInfo = placemarks.map(placemark => {
    if (!placemark.Point || !placemark.Point[0] || !placemark.Point[0].coordinates) {
      console.log('Invalid Placemark:', placemark);
      return null;
    }
    const coordinates = placemark.Point[0].coordinates[0].trim().split(',').slice(0, 2).reverse().join('_');
    const address = placemark.name ? placemark.name[0] : '';
    const description = placemark.description ? placemark.description[0] : '';
    const owner = description.split(',')[0].trim();
    const rental = description.includes('RENTAL') ? 'Y' : 'N';
    return { coordinates, address, owner, rental };
  }).filter(info => info !== null);

  console.log('KML Info:', kmlInfo);

  jsonData.forEach(record => {
    const fullCoord = record.id;
    const kmlRecord = kmlInfo.find(info => info.coordinates === record.id);

    csvData.push({
      id: idCounter++,
      Address: kmlRecord ? kmlRecord.address : '',
      Owner: kmlRecord ? kmlRecord.owner : '',
      Rental: kmlRecord ? kmlRecord.rental : '',
      'Full Coord': fullCoord,
      lat: record.lat,
      lng: record.lng,
      color: record.color
    });
  });

  // Convert to CSV
  stringify(csvData, { header: true }, (err, output) => {
    if (err) throw err;
    fs.writeFileSync(csvFilePath, output);
    console.log(`CSV file created: ${csvFilePath}`);
  });
});
