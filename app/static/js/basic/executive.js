function displayTip(id){
	$('#'+id).css('visibility','visible');
}

function unDisplayTip(id){
	$('#'+id).css('visibility','hidden');
}

var tiphide = false;
var currenttip = '';
var curtipid = '';
function displayTip2(id){
	if (tiphide) {
		if (currenttip == id){
			curtipid = id
			$('#tip-wrapper').css('animation-name','change_animation3')
			$('#'+id).css('animation-name','change_animation4')
			$('#'+id).css('animation-duration','170ms')
			window.setTimeout(cancelpartB,170);
			tiphide = false;
		} else {
			$('#'+currenttip).css('display','none');
			$('#'+id).css('display','block');
			currenttip = id;
		}
	} else {
		$('#'+id).css('display','block');
		$('#tip-wrapper').css('display','block')
		$('#tip-wrapper').css('animation-name','change_animation1')
		$('#'+id).css('animation-name','change_animation2')
		$('#'+id).css('animation-duration','400ms')
		tiphide = true;
		currenttip = id;
	}
}

function cancelpartB(){
	$('#'+curtipid).css('display','none');
	window.setTimeout(cancelpartC,30);
}

function cancelpartC(){
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

var start = 6
var end = 10
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
		$(filternames[0]).css('box-shadow','0px 0px 3px rgba(0,0,0,1)');
		$(filternames[0]).css('border','solid 1px #012');
		$(filternames[0]).css('height','54px');
		$(subfilternames[0]).css('right','-160px');
		$(filternames[0]).css('width','198px');
		$(filternames[0]).css('padding-top','10px');
		$(filternames[1]).css('box-shadow','0px 0px 3px rgba(0,0,0,1)');
		$(filternames[1]).css('border','solid 1px #012');
		$(filternames[1]).css('height','54px');
		$(subfilternames[1]).css('right','-160px');
		$(filternames[1]).css('width','198px');
		$(filternames[1]).css('padding-top','10px');
		$(filternames[2]).css('box-shadow','0px 0px 3px rgba(0,0,0,1)');
		$(filternames[2]).css('border','solid 1px #012');
		$(filternames[2]).css('height','54px');
		$(subfilternames[2]).css('right','-160px');
		$(filternames[2]).css('width','198px');
		$(filternames[2]).css('padding-top','10px');
	} else {
		currentFilter = num;
		$(filternames[currentFilter]).css('box-shadow','0px 0px 20px rgba(0,0,0,1)');
		$(filternames[currentFilter]).css('border','solid 3px #012');
		$(filternames[currentFilter]).css('height','52px');
		$(filternames[currentFilter]).css('width','194px');
		$(subfilternames[currentFilter]).css('right','-158px');
		$(filternames[currentFilter]).css('padding-top','8px');
		$(filternames[(currentFilter+1)%3]).css('box-shadow','0px 0px 3px rgba(0,0,0,1)');
		$(filternames[(currentFilter+1)%3]).css('border','solid 1px #012');
		$(filternames[(currentFilter+1)%3]).css('height','54px');
		$(filternames[(currentFilter+1)%3]).css('width','198px');
		$(subfilternames[(currentFilter+1)%3]).css('right','-160px');
		$(filternames[(currentFilter+1)%3]).css('padding-top','10px');
		$(filternames[(currentFilter+2)%3]).css('box-shadow','0px 0px 3px rgba(0,0,0,1)');
		$(filternames[(currentFilter+2)%3]).css('border','solid 1px #012');
		$(filternames[(currentFilter+2)%3]).css('height','54px');
		$(filternames[(currentFilter+2)%3]).css('width','198px');
		$(subfilternames[(currentFilter+2)%3]).css('right','-160px');
		$(filternames[(currentFilter+2)%3]).css('padding-top','10px');
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
	if (isStart){
		for (i = 1; i < id; i++){
			idlist[i] = false;
			$('.light'+String(i)).css('background','#fff');
		}
		start = id-1
		end = id
		for (i = id; i < 11; i++){
			idlist[i] = false;
			$('.light'+String(i)).css('background','#fff');
		}
		$('.light'+String(id)).css('background','#fc2');
		isStart = false;
	} else{
		if (id > start) {
			end = id
			for (i = start+1; i < id+1; i++){
				idlist[i] = true;
				$('.light'+String(i)).css('background','#fc2');
			}
			isStart = true;
		}
		else {
			for (i = 1; i < id; i++){
				idlist[i] = false;
				$('.light'+String(i)).css('background','#fff');
			}
			start = id-1
			end = id
			for (i = id; i < 11; i++){
				idlist[i] = false;
				$('.light'+String(i)).css('background','#fff');
			}
			$('.light'+String(id)).css('background','#fc2');
			isStart = false;
		}
	}
	if (type == 'avg'){
		graphSwitcherAvg(vis, currentid, smooth, days);
	} else if (type == 'sum'){
		graphSwitcherSum(vis, currentid, smooth, days);
	} else {
		graphSwitcher2(vis, currentid);
	}
}

function start_gdp(){
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
}

function graphSwitcher2(vis2, id){
	vis = vis2
	type = 'normal'
	$.post('/vishandle', {'visualization':vis, 'start':datelist[start], 'end':datelist[end]},function(data){
		chart_data = $.parseJSON(data);
		//console.log(chart_data)
		drawLineChart2(chart_data);
	});
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
}

function graphSwitcherSum(vis2, id, smooth2, days2){
	vis = vis2
	smooth = smooth2
	days = days2
	type = 'sum'
	$.post('/vishandle', {'visualization':vis, 'start':datelist[start], 'end':datelist[end], 'smooth':smooth, 'days':days, 'type':'sum'},function(data){
		chart_data = $.parseJSON(data);
		//console.log(chart_data)
		drawLineChart2(chart_data);
	});
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
}

function graphSwitcherAvg(vis2, id, smooth2, days2){
	vis = vis2
	smooth = smooth2
	days = days2
	type = 'avg'
	$.post('/vishandle', {'visualization':vis, 'start':datelist[start], 'end':datelist[end], 'smooth':smooth, 'days':days, 'type':'avg'},function(data){
		chart_data = $.parseJSON(data);
		//console.log(chart_data)
		drawLineChart2(chart_data);
	});
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
sources['1-1-1'] = ''
sources['1-1-2'] = ''
sources['1-2-1'] = ''
sources['1-2-2'] = ''
sources['1-2-3'] = ''
sources['1-2-4'] = ''
sources['1-2-5'] = ''
sources['2-1-1'] = ''
sources['2-1-2'] = ''
sources['2-1-3'] = ''
sources['2-2-1'] = ''
sources['2-3-1'] = ''
sources['2-4-1'] = ''
sources['2-4-2'] = ''
sources['2-4-3'] = ''
sources['2-4-5'] = ''
sources['2-5-1'] = ''
sources['2-5-2'] = ''
sources['2-5-3'] = ''
sources['3-1-1'] = ''
sources['3-1-2'] = ''
sources['3-1-3'] = ''
sources['3-2-1'] = ''
sources['3-2-2'] = ''

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
biases['2-4-5'] = ''
biases['2-5-1'] = ''
biases['2-5-2'] = ''
biases['2-5-3'] = ''
biases['3-1-1'] = ''
biases['3-1-2'] = ''
biases['3-1-3'] = ''
biases['3-2-1'] = ''
biases['3-2-2'] = ''