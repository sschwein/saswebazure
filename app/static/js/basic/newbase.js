"use strict"

function eleindicatorColor(i, thanks){
  $('.pfb').each(function(index){$(this).css('display','none')})
  $('#pfb-'+i).css('display','block')
  fadeIn('feedback-fs'+i)
  if (thanks == 'thanks') {
    $('#feedbackheader1').css('display','none');
    $('#feedbackheader2').css('display','block');
  } else {
    $('#feedbackheader2').css('display','none');
    $('#feedbackheader1').css('display','block');
  }
  $.post('/feedback',$('#pfb-'+(parseInt(i) - 1)).serialize(),function(data){
    console.log(data)
  })
}
function elepfbScroll(direction, newpos, total, tab, tabname, thanks){
  console.log(direction+' '+newpos+' '+total+' '+tab)
  if(newpos){
    var np = parseInt(newpos) + (total * 100)
    $(tabname).attr('value', np)
    eleindicatorColor(newpos, thanks)

  }else{
    var current = Math.abs($(tabname).attr('value'))
    console.log(current)
    if(direction == 'left'){var newd = current - 1;}
    else{newd = current + 1}
    $(tabname).attr('value', newd)
    var c = newd % total
    console.log(c)
    if (tab == 'two'){c = c + 3}
    else if (tab == 'three'){c = c + 7}
    else if (tab == 'four'){c = c + 10}
    console.log(c)
    eleindicatorColor(c, thanks)
  }
}

function graphSwitcher(functext){
  /*$('.pagenav-option').each(function(){
    $(this).css('background','#1a53ff')
    $(this).css('color','white')
  })
  $('#'+id+'-option').css('background','#CC0000')*/
  var result = FUNCTIONS[functext]()
}

  function drawBarChart(d) {
    console.log(d['data'])
      var chart1_data = new google.visualization.DataTable(d['data']);
      var chart1_options = {
          title: d['title'],
          legend: 'none',
      };

      var chart1_chart = new google.visualization.ColumnChart(document.getElementById(d['element']));
      chart1_chart.draw(chart1_data, chart1_options);
  }
  function drawBarChartOptions(d, opt) {
    console.log(d['data'])
      var chart1_data = new google.visualization.DataTable(d['data']);
      var chart1_options = {
          title: d['title'],
          legend: 'none',
          vAxis: opt['vAxis']
      };

      var chart1_chart = new google.visualization.ColumnChart(document.getElementById(d['element']));
      chart1_chart.draw(chart1_data, chart1_options);
  }
  function drawLineChart(d){
    console.log(d['data'])
      var chart1_data = new google.visualization.DataTable(d['data']);
      var chart1_options = {
          title: d['title'],
          legend: 'none',

    };

      var chart1_chart = new google.visualization.LineChart(document.getElementById(d['element']));
      chart1_chart.draw(chart1_data, chart1_options);
  }
  function drawLineChart2(d){
    console.log(d['data'])
      var chart1_data = new google.visualization.DataTable(d['data']);
      var chart1_options = {
          title: d['title'],
          //legend: 'none',
          hAxis: {slantedText: false, maxTextLines: 1, maxAlternation: 1}
    };

      var chart1_chart = new google.visualization.LineChart(document.getElementById(d['element']));
      chart1_chart.draw(chart1_data, chart1_options);
  } 
  function drawLineChartCurve(d){
    console.log(d['data'])
      var chart1_data = new google.visualization.DataTable(d['data']);
      var chart1_options = {
          title: d['title'],
          curveType: 'function'
          //legend: 'none',
    };

      var chart1_chart = new google.visualization.LineChart(document.getElementById(d['element']));
      chart1_chart.draw(chart1_data, chart1_options);
  }  
  function drawPieChart(d) {
    console.log(d['data'])
      var chart1_data = new google.visualization.DataTable();
      chart1_data.addColumn('string', d['data']['cols'][0])
      chart1_data.addColumn('number', d['data']['cols'][1])
      chart1_data.addRows(d['data']['rows'])
      var chart1_options = {
          title: d['title'],
          titleTextStyle: {fontSize: 18},
          legend: {textStyle: {fontSize: 12}}
          //legend: 'none',
      };

      var chart1_chart = new google.visualization.PieChart(document.getElementById(d['element']));
      chart1_chart.draw(chart1_data, chart1_options);
  }
  function drawPieChartOther(d) {
    console.log(d['data'])
      var chart1_data = new google.visualization.DataTable();
      chart1_data.addColumn('string', d['data']['cols'][0])
      chart1_data.addColumn('number', d['data']['cols'][1])
      chart1_data.addRows(d['data']['rows'])
      var chart1_options = {
          title: d['title'],
          titleTextStyle: {fontSize: 18},
          legend: {textStyle: {fontSize: 12}},
          sliceVisibilityThreshold: .01
          //legend: 'none',
      };

      var chart1_chart = new google.visualization.PieChart(document.getElementById(d['element']));
      chart1_chart.draw(chart1_data, chart1_options);
  }