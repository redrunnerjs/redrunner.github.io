/**
 * Script to draw the little stats tables.
 * 
 * Get stats from https://github.com/krausest/js-framework-benchmark (non-keyed)
 */
var frameworkStats = [
  { framework: 'angular', createRows: 2354, size: 38.26 },
  { framework: 'inferno', createRows: 1800, size: 8.9 },
  { framework: 'react', createRows: 2886, size: 38.33 },
  { framework: 'redrunner', createRows: 1846, size: 3.8 },
  { framework: 'riot', createRows: 2263, size: 7.23 },
  { framework: 'svelte', createRows: 2167, size: 2.96 },
  { framework: 'vanillajs', createRows: 1653, size: 2.17 },
  { framework: 'vue-next', createRows: 1967, size: 20.3 }
];

// Scale is 0, 1, 2
var checkItems = [
  'Direct DOM manipulation',
  'Move DOM elements',
  'Control DOM reuse',

]
var frameworkChecks = [
  { framework: 'angular', checks: {
    'Direct DOM manipulation': 1,
    'Direct DOM manipulation': 1,

  }},
  { framework: 'inferno', createRows: 1800, size: 8.9 },
  { framework: 'react', createRows: 2886, size: 38.33 },
  { framework: 'redrunner', createRows: 1846, size: 3.8 },
  { framework: 'riot', createRows: 2263, size: 7.23 },
  { framework: 'svelte', createRows: 2167, size: 2.96 },
  { framework: 'vanillajs', createRows: 1653, size: 2.17 },
  { framework: 'vue-next', createRows: 1967, size: 20.3 }
];


function dynamicSort(property) {
  return function (a, b) {
    return a[property] < b[property] ? -1 : (a[property] > b[property] ? 1 : 0);
  }
}

function calcPercentage(partialValue, totalValue) {
  return Math.round((100 * partialValue) / totalValue);
} 

function drawChart(data, key, divId, unit) {
  var sorted = data.sort(dynamicSort(key));
  var highest = sorted[sorted.length - 1][key];
  var table = '<table class="stats-table"><tbody>';
  sorted.forEach(function(entry) {
    var percentage = calcPercentage(entry[key], highest);
    var percentageBar = '<div class="percentage-bar" style="width:' + percentage + '%;"></div>';
    var percentageBarContainer = '<div class="percentage-bar-container">' + percentageBar + '</div>';
    var frameworkTd = '<td>'  + entry.framework + '</td>';
    var percentageTd = '<td>'  + percentageBarContainer + '</td>';
    var valueTd = '<td>' + entry[key] + unit + '</td>';
    var row = '<tr class="stats-row">' + frameworkTd + percentageTd + valueTd + '</tr>';
    table += row;
  })
  table += '</tbody></table>';
  var div = document.getElementById(divId);
  div.innerHTML = table;
}



// function drawCheckTable(data, divId) {

//   var groupedData
//   var table = '<table class="stats-table"><tbody>';
//   data.forEach(function(entry) {
//     var frameworkTd = '<td>'  + entry.framework + '</td>';
//     var cells = [frameworkTd];
//     entry.checks.
//     var row = '<tr class="stats-row">' + cells + '</tr>';
//     table += row;
//   })
//   table += '</tbody></table>';
//   var div = document.getElementById(divId);
//   div.innerHTML = table;
// }