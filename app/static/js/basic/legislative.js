expanded = 0;
function expandActions(){
	if (expanded == 0){
		$('#bill-basic-info-actions').css('display','block');
		$('#expand-actions').html('&nbsp&nbsp(Close&nbspAll)');
		expanded = 1;
	} else {
		$('#bill-basic-info-actions').css('display','none');
		$('#expand-actions').html('&nbsp&nbsp(Show&nbspAll)');
		expanded = 0;
	}
}

cospon = 0;
function expandCospon(){
	if (cospon == 0){
		$('#bill-cospon-all').css('display','block');
		$('#expand-cosponsors').css('display','none');
		cospon = 1;
	} else {
		$('#bill-cospon-all').css('display','none');
		$('#expand-cosponsors').css('display','flex');
		cospon = 0;
	}
}

summary = 0;
function expandSummary(){
	if (summary == 0){
		$('#bill-summary-all').css('display','block');
		$('#expand-summary').css('display','none');
		summary = 1;
	} else {
		$('#bill-summary-all').css('display','none');
		$('#expand-summary').css('display','flex');
		summary = 0;
	}
}