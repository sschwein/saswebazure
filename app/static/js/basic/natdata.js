function displayTip(id){
	$('#'+id).css('visibility','visible');
}

function unDisplayTip(id){
	$('#'+id).css('visibility','hidden');
}

var tiphide = false;
var currenttip = '';
var curtipid = '';
displayTip2("contexttip");
function displayTip2(id){
	//$('#natcontext').css('background', '#9ff9d0')
	//$('#natsources').css('background', '#9ff9d0')
	//$('#natsocialmedia').css('background', '#9ff9d0')
	if (tiphide) {
		if (currenttip == id){
			curtipid = id
			$('#tip-wrapper').css('animation-name','change_animation3')
			$('#'+id).css('animation-name','change_animation4')
			$('#'+id).css('animation-duration','170ms')
			window.setTimeout(cancelpartB,165);
			tiphide = false;
		} else {
			//$('#nat'+id.substring(0,7)).css('background', '#0ed87d')
			$('#'+currenttip).css('display','none');
			$('#'+id).css('display','block');
			currenttip = id;
		}
	} else {
		//$('#nat'+id.substring(0,7)).css('background', '#0ed87d')
		$('#'+id).css('display','block');
		$('#tip-wrapper').css('display','block')
		$('#tip-wrapper').css('animation-name','change_animation1')
		$('#'+id).css('animation-name','change_animation2')
		$('#'+id).css('animation-duration','400ms')
		tiphide = true;
		currenttip = id;
		window.setTimeout(function(){
			$('#tip-wrapper').css('height','140px');
		}, 390);
	}
}

function cancelpartB(){
	$('#'+curtipid).css('display','none');
	$('#tip-wrapper').css('display','none');
}

var filterlist = [];
filterlist[0] = ['2-1-2'];
filterlist[1] = ['1-1-1', '1-1-2', '1-2-1', '1-2-2', '1-2-3', '2-1-1', '2-1-3', '2-3-1', '2-5-1', '2-5-2', '2-5-3', '3-1-1', '3-1-2', '3-1-3'];
filterlist[2] = ['1-2-4', '1-2-5', '2-2-1', '2-4-1', '2-4-2', '2-4-3', '2-4-4', '2-4-5', '3-2-1', '3-2-2', ];
filtersel = [false, false, false];
filternames = ['#qualolife','#acctolib','#perofhap'];
subfilternames = ['#qualolifesub','#acctolibsub','#perofhapsub'];

var idlist = [];
idlist['h1'] = false;
idlist['h2'] = false;
idlist['h3'] = false;
idlist['h4'] = false;
idlist['h5'] = false;
idlist['h6'] = false;
idlist['h7'] = false;
idlist['h8'] = false;
idlist['h9'] = false;
idlist['h10'] = false;

var datelist = [];
datelist[0] = '1961';
datelist[1] = '1963';
datelist[2] = '1969';
datelist[3] = '1974';
datelist[4] = '1977';
datelist[5] = '1981';
datelist[6] = '1989';
datelist[7] = '1993';
datelist[8] = '2001';
datelist[9] = '2009';
datelist[10] = 'now';

var start = 6;
var end = 10;
var currentid = '2-1-1'
var vis = ''
var type = 'normal'
var smooth = 0
var days = 0
var currentFilter = -1
var isStart = true;

function filterCat(num, keepFiltering){
	if (num == currentFilter && !keepFiltering) {
		currentFilter = -1;
		for (i = 0; i < 3; i++) {
			for (j = 0; j < filterlist[i].length; j++){
				$('#category-'+filterlist[i][j]).css('display','none');
			}
		}
		if (num == 0){
			$(filternames[0]).css('background','#bee29c');
		} else if (num == 1){
			$(filternames[1]).css('background','#daa4db');
		} else {
			$(filternames[2]).css('background','#ffc880');
		}
	} else {
		currentFilter = num;
		if (num == 0){
			$(filternames[0]).css('background','#5A8F29');
			$(filternames[1]).css('background','#daa4db');
			$(filternames[2]).css('background','#ffc880');
		} else if (num == 1){
			$(filternames[1]).css('background','#B64BB8');
			$(filternames[2]).css('background','#ffc880');
			$(filternames[0]).css('background','#bee29c');
		} else {
			$(filternames[2]).css('background','#FF8F00');
			$(filternames[1]).css('background','#daa4db');
			$(filternames[0]).css('background','#bee29c');
		}
	}
	for (i = 0; i < 3; i++) {
		for (j = 0; j < filterlist[i].length; j++){
			if (i == currentFilter) {
				$('#category-'+filterlist[i][j]).css('display','flex');
			} else {
				$('#category-'+filterlist[i][j]).css('display','none');
			}
		}
	}
}

function switchButton(id){
	if (window.innerWidth < 1024) {
		if (isStart){
			for (i = 10; i >= 1; i--){
				idlist[i] = false;
				$('.light'+String(i)).css('background','#fff');
			}
			start = id-1
			end = id
			$('.light'+String(id)).css('background','#fc2');
			isStart = false;
			if (type == 'avg'){
				graphSwitcherWrap('avg', vis, currentid, smooth, days, 1);
			} else if (type == 'sum'){
				graphSwitcherWrap('sum', vis, currentid, smooth, days, 1);
			} else {
				graphSwitcherWrap('2', vis, currentid, 0, 0, 1);
			}
		} else{
			if (id < start) {
				end = start
				start = id-1
				for (i = end; i >= id; i--){
					idlist[i] = true;
					$('.light'+String(i)).css('background','#fc2');
				}
				isStart = true;
			}
			else {
				for (i = id; i >= 1; i--){
					idlist[i] = false;
					$('.light'+String(i)).css('background','#fff');
				}
				start = id-1
				end = id
				for (i = 11; i < id; i--){
					idlist[i] = false;
					$('.light'+String(i)).css('background','#fff');
				}
				$('.light'+String(id)).css('background','#fc2');
				isStart = false;
			}
			if (type == 'avg'){
				graphSwitcherWrap('avg', vis, currentid, smooth, days);
			} else if (type == 'sum'){
				graphSwitcherWrap('sum', vis, currentid, smooth, days);
			} else {
				graphSwitcherWrap('2', vis, currentid, 0, 0);
			}
		}
	} else {
		if (isStart){
			for (i = 0; i < 11; i++){
				idlist[i] = false;
				$('#tlyear'+String(i)).css('background','');
			}
			start = id-1
			end = id
			$('#tlyear'+String(id)).css('background','#fc2');
			isStart = false;
			if (type == 'avg'){
				graphSwitcherWrap('avg', vis, currentid, smooth, days, 1);
			} else if (type == 'sum'){
				graphSwitcherWrap('sum', vis, currentid, smooth, days, 1);
			} else {
				graphSwitcherWrap('2', vis, currentid, 0, 0, 1);
			}
		} else{
			if (id > start) {
				end = id
				//start = id
				for (i = start+1; i <= id; i++){
					idlist[i] = true;
					$('#tlyear'+String(i)).css('background','#fc2');
				}
				isStart = true;
			}
			else if(id != start+1) {
				for (i = id; i < 11; i++){
					idlist[i] = false;
					$('#tlyear'+String(i)).css('background','');
				}
				start = id-1
				end = id
				for (i = 0; i < id; i++){
					idlist[i] = false;
					$('#tlyear'+String(i)).css('background','');
				}
				$('#tlyear'+String(id)).css('background','#fc2');
				isStart = false;
			}
			if (type == 'avg'){
				graphSwitcherWrap('avg', vis, currentid, smooth, days);
			} else if (type == 'sum'){
				graphSwitcherWrap('sum', vis, currentid, smooth, days);
			} else {
				graphSwitcherWrap('2', vis, currentid, 0, 0);
			}
		}
	}
}

function start_gdp(){
	if(window.location.pathname.split('/').length == 3){
		scrnid = window.location.pathname.split('/')[2].split('_')
		code = scrnid[1]
		code1 = code.substring(0,2)
		code2 = code.substring(2,4)
		code3 = code.substring(4,6)
		if (code1.substring(0,1) == '0'){
			code1 = code1.substring(1,2)
		}
		if (code2.substring(0,1) == '0'){
			code2 = code2.substring(1,2)
		}
		if (code3.substring(0,1) == '0'){
			code3 = code3.substring(1,2)
		}
		finalcode = code1.concat('-',code2,'-',code3)
		tempgraphCode = graphCodeToViz[finalcode].split('_')
		$("#category-2-1-1").css('width','calc(100% - 40px)');
		$("#category-2-1-1").css('left','20px');
		$("#category-2-1-1").css('font-weight','normal');
		$("#category-2-1-1").css('background','#fff');
		currentid = finalcode
		smooth = tempgraphCode[2]
		days = tempgraphCode[3]
		vis = tempgraphCode[0]
		start = parseInt(scrnid[2])
		end = parseInt(scrnid[3])
		if (tempgraphCode[1] == '2') {
			type = 'normal'
			$.post('/vishandle', {'visualization':vis, 'start':datelist[start], 'end':datelist[end]},function(data){
				chart_data = $.parseJSON(data);
				//console.log(chart_data)
				drawLineChart2(chart_data);
			});
		} else if (tempgraphCode[1] == 'avg') {
			type = 'avg'
			$.post('/vishandle', {'visualization':vis, 'start':datelist[start], 'end':datelist[end], 'smooth':tempgraphCode[2], 'days':tempgraphCode[3], 'type':'avg'},function(data){
				chart_data = $.parseJSON(data);
				//console.log(chart_data)
				drawLineChart2(chart_data);
			});
		} else if (tempgraphCode[1] == 'sum') {
			type = 'sum'
			$.post('/vishandle', {'visualization':vis, 'start':datelist[start], 'end':datelist[end], 'smooth':tempgraphCode[2], 'days':tempgraphCode[3], 'type':'sum'},function(data){
				chart_data = $.parseJSON(data);
				//console.log(chart_data)
				drawLineChart2(chart_data);
			});
		}
		expand(code1,5,5);
		expand(code1.concat('-',code2),5,0);
		$("#category-".concat(finalcode)).css('width','calc(100% - 50px)');
		$("#category-".concat(finalcode)).css('left','30px');
		$("#category-".concat(finalcode)).css('font-weight','bold');
		$("#category-".concat(finalcode)).css('background','#ddd');
		$("#contexttip").text(contexts[finalcode]);
		$("#sourcestip").text(sources[finalcode]);
		$('#center-panel').css('height', $("#center-panel").height()+60)
		if (window.innerWidth < 1024) {
			for (i = 10; i >= 1; i--){
				idlist[i] = false;
				$('.light'+String(i)).css('background','#fff');
			}
			for (i = end; i > start; i--){
				$('.light'+String(i)).css('background','#fc2');
			}
		} else {
			for (i = 0; i < 11; i++){
				idlist[i] = false;
				$('#tlyear'+String(i)).css('background','');
			}
			for (i = start+1; i <= end; i++){
				$('#tlyear'+String(i)).css('background','#fc2');
			}
		}
	} else {
		vis = 'intexecgdp'
		$.post('/vishandle', {'visualization':vis, 'start':datelist[start], 'end':datelist[end]},function(data){
			chart_data = $.parseJSON(data);
			//console.log(chart_data)
			drawLineChart2(chart_data);
		});
		expand("2",5,5);
		expand("2-1",3,0);
		$("#category-2-1-1").css('width','calc(100% - 50px)');
		$("#category-2-1-1").css('left','30px');
		$("#category-2-1-1").css('background','#ddd');
		$("#contexttip").text(contexts["2-1-1"]);
		$("#sourcestip").text(sources["2-1-1"]);
		$('#center-panel').css('height', $("#center-panel").height()+60)
	}
}

function graphSwitcherWrap(graphtype, vis2, id, smooth2, days2, skip=0){
	if (graphtype == '2') {
		vis = vis2
		type = 'normal'
		$.post('/vishandle', {'visualization':vis, 'start':datelist[start], 'end':datelist[end]},function(data){
			chart_data = $.parseJSON(data);
			//console.log(chart_data)
			drawLineChart2(chart_data);
		});
	} else if (graphtype == 'sum'){
		vis = vis2
		smooth = smooth2
		days = days2
		type = 'sum'
		$.post('/vishandle', {'visualization':vis, 'start':datelist[start], 'end':datelist[end], 'smooth':smooth, 'days':days, 'type':'sum'},function(data){
			chart_data = $.parseJSON(data);
			//console.log(chart_data)
			drawLineChart2(chart_data);
		});
	} else if (graphtype == 'avg') {
		vis = vis2
		smooth = smooth2
		days = days2
		type = 'avg'
		$.post('/vishandle', {'visualization':vis, 'start':datelist[start], 'end':datelist[end], 'smooth':smooth, 'days':days, 'type':'avg'},function(data){
			chart_data = $.parseJSON(data);
			//console.log(chart_data)
			drawLineChart2(chart_data);
		});
	}
	$("#category-"+currentid).css('width','calc(100% - 40px)');
	$("#category-"+currentid).css('left','20px');
	$("#category-"+currentid).css('font-weight','normal');
	$("#category-"+currentid).css('background','#fff');
	currentid = id;
	$("#category-"+currentid).css('width','calc(100% - 50px)');
	$("#category-"+currentid).css('left','30px');
	$("#category-"+currentid).css('font-weight','bold');
	$("#category-"+currentid).css('background','#ddd');
	$("#contexttip").text(contexts[id]);
	$("#sourcestip").text(sources[id]);
	if (skip == 0 && window.innerWidth < 1024) {
		angular.element($('#content-body')).scope().mob_menu_close()
	}
	$('#center-panel').css('height', $("#center-panel").height()+60)
	$('#tip-wrapper').css('height',parseInt($('#contexttip').css('height').split('px')[0])+35+'px');
	document.getElementById('center-panel').scrollIntoView();
}

function expand(id,num,num2){
	for (i = 0; i <= num; i++){
		for (j = 1; j <= num2; j++){
			if ($('#category-'+id+'-'+i.toString()+'-'+j.toString()).css('display') == 'block' || $('#category-'+id+'-'+i.toString()+'-'+j.toString()).css('display') == 'flex'){
				$('#category-'+id+'-'+i.toString()+'-'+j.toString()).css('display','none');
			}
		}
		if ($('#category-'+id+'-'+i.toString()).css('display') == 'none'){
			if (id.length == 3){
				$('#category-'+id+'-'+i.toString()).css('display','flex');
			} else {
				$('#category-'+id+'-'+i.toString()).css('display','block');
			}
		} else {
			$('#category-'+id+'-'+i.toString()).css('display','none');
		}
	}
	if (currentFilter != -1) {
		filterCat(currentFilter, true);
	}
}

$( document ).ready(function() {
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(start_gdp);
});

var graphCodeToViz = [];
graphCodeToViz['1-1-1'] = 'intfedfunds_2'
graphCodeToViz['1-1-2'] = 'intmoneysupply_2'
graphCodeToViz['1-2-1'] = 'intrevspend_2'
graphCodeToViz['1-2-2'] = 'intsurdef_2'
graphCodeToViz['1-2-3'] = 'intnatdebt_2'
graphCodeToViz['1-2-4'] = 'intspendcategory_2'
graphCodeToViz['1-2-5'] = 'intrevcategory_2'
graphCodeToViz['2-1-1'] = 'intexecgdp_2'
graphCodeToViz['2-1-2'] = 'intexecgdproc_avg_4_90'
graphCodeToViz['2-1-3'] = 'intexecgdpcap_2'
graphCodeToViz['2-2-1'] = 'intjobs_avg_3_30'
graphCodeToViz['2-3-1'] = 'intexeccpi_sum_12_30'
graphCodeToViz['2-4-1'] = 'intexecunemprate_2'
graphCodeToViz['2-4-2'] = 'intexeclabpartrate_2'
graphCodeToViz['2-4-3'] = 'intexecavgweekunemp_2'
graphCodeToViz['2-4-4'] = 'intexecnumunandemp_2'
graphCodeToViz['2-4-5'] = 'intexecunempbyeducation_2'
graphCodeToViz['2-5-1'] = 'intexectrade_2'
graphCodeToViz['2-5-2'] = 'intexecbalance_2'
graphCodeToViz['2-5-3'] = 'intexecbalpercent_2'
graphCodeToViz['3-1-1'] = 'intaggincome_2'
graphCodeToViz['3-1-2'] = 'intcutincome_2'
graphCodeToViz['3-1-3'] = 'intavgincome_2'
graphCodeToViz['3-2-1'] = 'inttuitpripub_2'
graphCodeToViz['3-2-2'] = 'inttuitperchng_2'

var contexts = [];
contexts['1-1-1'] = 'The Fed Funds interest rate is the base level interest rate in the U.S. economy. All other interest rates in banking is based off of this rate. It is set and controlled by the Federal Reserve, and is one method they use to influence the economy. A lower rate encourages banks to loan more money, stimulating the economy. A higher rate discourages loaning, and can be used to combat inflation.'
contexts['1-1-2'] = 'The money supply is the amount of US Dollars that exist in the economy. Control of this supply is used in conjunction with interest rates to help stimulate the economy and fight inflation. A greater money supply stimulates the economy by encouraging lending, while a smaller money supply can be used to fight inflation. Money is considered in the M1 supply if it is in the form of cash, coins, checking accounts, and demand deposits. This is the most liquid form of asset, and can be moved around the economy quickly. The M2 money supply contains everything in the M1 money supply, plus less liquid assets like savings accounts and money market accounts. Any asset that can’t be traded as currency however can be quickly converted into tradeable currency is considered a part of the M2 supply'
contexts['1-2-1'] = 'Government revenue is received from sources such as taxes levied upon individuals, private and government owned corporations, goods and services produced, exports and imports, central bank revenue and capital receipts.Government spending includes all government consumption, (the acquisition of goods and services for current use),  investment (the acquisition of goods and services for future use) and transfer payments. According to Keynesian economics, increased government spending leads to raises in aggregate demand, increased production and faster recession recovery. Classical economists believe that increased government spending worsens the economy by shifting resources to the less productive public sector. '
contexts['1-2-2'] = 'The Annual Budget Deficit is the amount by which government spending exceeds government revenue in a given year. This deficit is a major contributor to the National Debt. The United State’s recent policies focused on increased federal spending have lead to increased budget deficits. '
contexts['1-2-3'] = 'The United States national debt is the amount of money owed by the federal government. The measure of the public national debt is the amount outstanding Treasury securities at a given time. These securities are held by private investors, corporations, the Federal Reserve System, foreign, state and local governments. The national debt is increased by budget deficits, meaning that government expenditures exceed government revenue. Some effects of an increased national debt are reduced national income and living standards, reductions in spending on important government programs and higher inflation rates.  '
contexts['1-2-4'] = 'This represents the amount of money that the federal government spends on various government programs. This information can be used to help evaluate how effectively the United States Government is spending their revenue. '
contexts['1-2-5'] = 'This represents the avenues of government receipts. This graph may be used to give you a better understanding of how the government generates revenue and how that has changed over time.'
contexts['2-1-1'] = 'The GDP (Gross Domestic Product) represents the total dollar value of all goods and services produced with a period of time. GDP is used an indication of a nation’s economic health. A significant change in the GDP, up or down tends to correlate with a significant change in the stock market as well.Negative GDP growth is one of the factors considered in determining whether an economy is in recession or not. '
contexts['2-1-2'] = 'The GDP per Capita is the calculated GDP divided by the population of the country. This is done in an attempt to normalize the data to make for easier comparisons with other countries. '
contexts['2-1-3'] = 'The GDP rate of change displays the increase or decrease of the GDP per year as a percentage. This is useful for determining the general direction and magnitude of growth for an economy.  '
contexts['2-2-1'] = 'Inflation is the increase in the level of prices for various goods and services. Here it measured using the Consumer Price Index (CPI). The Bureau of Labor Statistics gathers the average prices for goods and services then compares them to the average prices from an arbitrary date. The CPI is then calculated as the difference between the two points. '
contexts['2-3-1'] = 'This is a measure of net hiring of full and part time adult workers. The index score is calculated by subtracting the percent of americans who indicate their job is  firing and those who say their employers are hiring. Job Creation can be an indication of economic health, in that a healthy economy will be likely to have a high number of jobs created. '
contexts['2-4-1'] = 'The Unemployment Rate is the percentage of people in the labor force that are not currently employed. To be counted as unemployed you need to be without a job, available to work, and actively looking for work. This rate is one way to measure the health of the economy, however it might not provide a full picture.'
contexts['2-4-2'] = 'This rate measures what percentage of the population is currently in the workforce. To be considered a part of the workforce, you either have to be employed or unemployed (looking for work). Everyone else who is not looking for work or not able to work are not considered part of the labor force. This rate is an indirect method of calculating unemployment, where people who are no longer looking for work, discouraged workers, are counted.'
contexts['2-4-3'] = 'This number measures how many weeks those unemployed stay looking for work. A higher number of weeks unemployed means that it’s harder for people who are unemployed to find work. A high number is also an indicator for a weaker economy.'
contexts['2-4-4'] = 'The number employed and unemployed are the raw numbers used to calculate the unemployment rate and related statistics. These numbers can be used to track the size of the labor force overtime.'
contexts['2-4-5'] = 'These 4 numbers show the different unemployment rates for those with different education statuses.People with different educational levels experience economic changes differently, and this chart is one way to measure it.'
contexts['2-5-1'] = 'This graph displays the United States imports and exports. An import is the purchase of foreign manufactured goods. An export is the sale of goods to foreign countries. Overseas products offer more choices to consumers and can help to manage strained budgets. However too many imports in relation to exports distorts the balance of trade and devalues the currency.'
contexts['2-5-2'] = 'Trade Balance is the difference between a country’s imports and exports. A trade deficit (imports > exports) isn’t necessarily an indication of poor economic health. In a recession countries try to export more but during an expansion countries tend to import more goods providing price competition which limits inflation and provides goods beyond the economy’s ability.'
contexts['2-5-3'] = 'The Trade Balance Percent is the percentage representation of imports over exports.If the percentage is >100% then that means the United States had more imports than exports that year.'
contexts['3-1-1'] = 'Aggregate income is the total of all incomes without adjustment for inflation and taxes. This graph depicts the aggregate income broken down for each fifth of the of United States as a percentage of the total. Wealth distribution is a major political issue, particularly as it relates to income taxes.'
contexts['3-1-2'] = 'This is a percentile representation of income levels in the United States. For example if your annual income is ~41,000 then you are making more money than 40% of Americans.'
contexts['3-1-3'] = 'Average Income per Level indicates how much money each fifth of the United States is making on average. This information can be useful in determining where in the American economy you fit it, which may influence your voting behaviors. '
contexts['3-2-1'] = 'This graph depicts the annual tuition for public and private universities. The cost of a college education is an important social issue because of the importance placed upon a degree and the debt that can be incurred.'
contexts['3-2-2'] = 'Percent Change in Tuition is simply a depiction of how the tuition is changing over a period of time. Whereas the College Tuition graph is showing the monetary representation of it.'

var sources = [];
sources['1-1-1'] = 'https://www.federalreserve.gov/releases/h15/'
sources['1-1-2'] = 'https://www.federalreserve.gov/releases/h6/current/default.htm#t1tg1link'
sources['1-2-1'] = "Sorry, we haven't entered these sources yet."
sources['1-2-2'] = "Sorry, we haven't entered these sources yet."
sources['1-2-3'] = "Sorry, we haven't entered these sources yet."
sources['1-2-4'] = "Sorry, we haven't entered these sources yet."
sources['1-2-5'] = "Sorry, we haven't entered these sources yet."
sources['2-1-1'] = 'https://fred.stlouisfed.org/categories/106'
sources['2-1-2'] = 'https://fred.stlouisfed.org/categories/106'
sources['2-1-3'] = 'https://fred.stlouisfed.org/categories/106'
sources['2-2-1'] = "http://www.bls.gov/data/#employment"
sources['2-3-1'] = "http://www.bls.gov/data/"
sources['2-4-1'] = 'http://www.bls.gov/data/#employment'
sources['2-4-2'] = 'http://www.bls.gov/data/#employment'
sources['2-4-3'] = 'http://www.bls.gov/data/#employment'
sources['2-4-4'] = 'http://www.bls.gov/data/#employment'
sources['2-4-5'] = 'http://www.bls.gov/data/#employment'
sources['2-5-1'] = 'http://www.census.gov/foreign-trade/data/index.html'
sources['2-5-2'] = 'http://www.census.gov/foreign-trade/data/index.html'
sources['2-5-3'] = 'http://www.census.gov/foreign-trade/data/index.html'
sources['3-1-1'] = 'https://www.census.gov/topics/income-poverty/income/data/tables.html'
sources['3-1-2'] = 'https://www.census.gov/topics/income-poverty/income/data/tables.html'
sources['3-1-3'] = 'https://www.census.gov/topics/income-poverty/income/data/tables.html'
sources['3-2-1'] = 'http://trends.collegeboard.org/'
sources['3-2-2'] = 'http://trends.collegeboard.org/'

var biases = [];
biases['1-1-1'] = ''
biases['1-1-2'] = ''
biases['1-2-1'] = ''
biases['1-2-2'] = ''
biases['1-2-3'] = ''
biases['1-2-4'] = ''
biases['1-2-5'] = ''
biases['2-1-1'] = ''
biases['2-1-2'] = ''
biases['2-1-3'] = ''
biases['2-2-1'] = ''
biases['2-3-1'] = ''
biases['2-4-1'] = ''
biases['2-4-2'] = ''
biases['2-4-3'] = ''
biases['2-4-4'] = ''
biases['2-4-5'] = ''
biases['2-5-1'] = ''
biases['2-5-2'] = ''
biases['2-5-3'] = ''
biases['3-1-1'] = ''
biases['3-1-2'] = ''
biases['3-1-3'] = ''
biases['3-2-1'] = ''
biases['3-2-2'] = ''