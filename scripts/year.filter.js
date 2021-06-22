/*
 * Filter function to leave only unique values in an array
 * Courtesy https://stackoverflow.com/a/14438954/4361039
 */
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function getCheckedYears() {
  var arr = [];
  $('#year-filter input:checked').each( function() {
    arr.push( $(this).attr('year'));
  });
  return arr;
}

/*
 * Function to add filter checkboxes to the legend
 */
var addYearFilter = function(markers, layers, mcs) { // mcs = multilayer cluster support

  // Get a list of unique years
  var years = markers.map(function(x) { return x.options.Year })
    .filter(onlyUnique)
    .sort()
    .reverse();

  $('#points-legend').prepend('<div id="year-filter"></div>');
  $('#year-filter').append('<h6 class="pointer">\
    <i class="fas fa-calendar-check" style="color: #bbb"></i> Year</h6>');

  // For each unique year, add a checkbox
  for (var i in years) {
    $('#year-filter').append('<label><input type="checkbox" year="' +
      years[i] + '">' + years[i] + '</label>');
  }

  // When checkbox (both year and group) is checked or unchecked, update markers
  $('#year-filter input, .leaflet-control-layers-overlays').on('change', function() {

    // Create a list of all checked years
    var checkedYears = getCheckedYears();

    // Remove markers (layers) whose year not in list
    mcs.removeLayers(
      markers.filter(function(x) { return checkedYears.indexOf(x.options.Year) < 0 })
    )

    // Generate a list of markers who are eligible (whose Group is dispalyed and year selected)
    var eligibleMarkers = markers.filter(function(x) {
      return checkedYears.indexOf(x.options.Year) >= 0
        && map.hasLayer(layers[x.options.Group])
    });
    
    // Add eligible markers
    mcs.addLayers(eligibleMarkers);

  })

  // Check most recent year (first in list)
  $('#year-filter label:first-of-type input')
    .attr('checked', 'checked')
    .trigger('change');

  // Toggle legend visibility on "Year" title click
  $('#year-filter h6').append('<span class="legend-arrow"><i class="fas fa-chevron-down"></i></span>');

  $('#year-filter h6').on('click', function() {
    $('#year-filter label').toggle();
    $('#year-filter').siblings().toggle();
    $('.legend-arrow i').toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
  });

}
