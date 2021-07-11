//Author: Pedro Pablo Silva Antilef
//Description: El siguiente script obtiene el promedio anual de temperatura a partir 
//del dataset ERA5-Land de temperaturas mensuales.


// Define and filter dataset ERA5-Land by dates, ROI and selecting property "temperature_2m" or
// Air Temperature at 2 meters from de surface
var dataset = ee.ImageCollection("ECMWF/ERA5_LAND/MONTHLY")
                .filter(ee.Filter.date('1984-01-01', '2019-12-31'))
                .filterBounds(roi)
                .select("temperature_2m")
                .map(function(im){
                  return im.clip(roi);
                });


// Define list in server side of every year of the period of study 
var years = ee.List.sequence(1984, 2019);


// Define a mean of variabele tmeperature_2m to every year of period 
var byYear = ee.ImageCollection.fromImages(
  years.map(function(y){
      return dataset
        .filter(ee.Filter.calendarRange(y, y, 'year'))
        .mean()
        .set('year', y);
}).flatten());


// Print ImageColecttion with mean temperature for every year
print(byYear)


// Define visualization parameters to add the mean layer to the map
var visualization = {
  min: 250.0,
  max: 320.0,
  palette: [
    "#000080","#0000D9","#4000FF","#8000FF","#0080FF","#00FFFF",
    "#00FF80","#80FF00","#DAFF00","#FFFF00","#FFF500","#FFDA00",
    "#FFB000","#FFA400","#FF4F00","#FF2500","#FF0A00","#FF00FF",
  ]};


// Adding to map the mean values per pixel of temperature for all of the values in the ROI
Map.addLayer(byYear, visualization, "Air temperature [K] at 2m height");


// Visualizating mean values in chart
var chart =
    ui.Chart.image
        .series({
          imageCollection: byYear,
          region: roi,
          reducer: ee.Reducer.mean(),
          scale: 500,
          xProperty: 'year'
        });

print(chart);