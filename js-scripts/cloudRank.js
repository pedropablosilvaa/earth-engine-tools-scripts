//Author: Pedro Pablo Silva Antilef
//Description: Este script muestra un gráfico con los porcentajes de nube
//para cada uno de las imagenes de la colección. La colección es una que 
//ya se encuentra corregida y se encuentra a nivel de superficie para el 
//satélite Landsat 8



// Selecting Landast 8 Level 2 product and filtering by ROI
var dataL8_L2 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
                .filterBounds(roi);
print('ImagenCollection Landsat8 Level2', dataL8_L2)

var count = dataL8_L2.size();
print('Landsat 8 Level 2 images Count: ', count)


// Creating function for cloud score and date property
// https://gis.stackexchange.com/questions/220062/google-earth-engine-how-to-get-cloud-cover-score-for-each-image-in-image-collec
var getCloudScores = function(img){
    //Get the cloud cover
    var value = ee.Image(img).get('CLOUD_COVER');
    var value2 = ee.Date(img.get('system:time_start'));
    return ee.Feature(null, {
      'score': value,
      'date': value2
    })
};

// Applying fuction getCloudScore
var results = dataL8_L2.map(getCloudScores);
print('FeatrureCollection de resultados', results)

// Print chart with cloud score by date
print(ui.Chart.feature.byFeature({
  features: results,
  xProperty: 'date',
  yProperties: 'score'}).setOptions({
          title:'CloudScore by date in ROI'}));

// Filtering by cloud score
var filtered = ee.FeatureCollection(results)
                .filterMetadata('score', 'less_than', 10);

print('Filtered results',filtered)

// Printing count of results filtered
var count = filtered.size();
print('Landsat 8 Level 2 images Count: ', count);
// Printing dates of results filtered
var dates = ee.FeatureCollection(filtered).aggregate_array('date');
print('Dates', dates);

//Tratando de agregar todo al mapa de una
var printingAll = function(img){
  var imagen = ee.Feature(img)
  return Map.addLayer(imagen)
}

// printingAll(filtered)
var image = ee.ImageCollection(dataL8_L2)
            .filterDate('2017-03-31','2017-04-01');

// Visualization parameters
var visParams = {
  bands: ['SR_B4', 'SR_B3', 'SR_B2']
};

// Display the composites.
Map.addLayer(image, visParams, 'Real Color');
Map.centerObject(roi,13);
Map.addLayer(roi, false, 'Region of Interest: Puerto Eden');