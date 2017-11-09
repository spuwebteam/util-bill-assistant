/* ask about hoisting waterUser() and addUser(). use as functional declaration and keep at bottom
or functional expression and add above call of addUser('Laundry', 41, 27); and 
addUser('Dishwasher', 15, 4);



CONTINUE BUTTON




*/

$(document).ready(function() {
	var i = 0;
	var j = 1;
	var DWMspinner = ['DAY', 'WEEK', 'MONTH', 'YEAR'];			// unit for spinner
	var DWMcalc = [1, 7, 30, 365];								// day conversion
	var rateInSeattle = 5.15;  									// off-peak usage rate
	var userRates = [5.15, 5.29, 6.54, 11.80];
	var grandTotalprev = 0;										// grand total gallons used??
	var grandTotalnext = 0;
	var grandTotals = [0, 0, 0, 0];								// array holding grand totals
	var billingCycle = 60;										// average billing cycle period
	var step = 0;
	var waterUses = [];
	var multiplier = 0;

	var gal = function() {
		if (waterUses[step].range) {
			return (waterUses[step].ineff * waterUses[step].high);
		} else {
			return (waterUses[step].ineff * j) / DWMcalc[i];
		}
		/* if (waterUses[step].multiple) {

		}*/
		// if range of use... implement later
		
	}
	addUser('shower', 5, 2, true);				// shower
	addUser('toilet', 5, 1, false);				// toilet
	addUser('laundry', 41, 27, false);			// create laundry object
	addUser('dishwasher', 15, 4, false);		// create dishwasher object
	addUser('car washing', 100, 0, false);		// car washing
	var galPerDay = gal();
		// This function constructs the waterUser object with four parameters being passed in.
	function waterUser(name, ineff, eff, isRange, high, low){
		this.name = name;
		this.ineff = ineff;
		this.eff = eff;
		this.isRange = isRange;
		this.high = high;
		this.low = low;
	}

	// This function creates a new object waterUser using four parameters and pushes the object
	// into an array of objects
	function addUser(name, ineff, eff, isRange, high, low){
		var w = new waterUser(name, ineff, eff, isRange, high, low);
		waterUses.push(w);
	}

	//updateSubtotals(); // shouldnt run on shower page
	$('.currWaterUser').text(waterUses[step].name);


	/*
		When the user clicks the continue button, the current step is hidden and the next appears.
	*/
	$('div button.next').click(function(e) {
		e.preventDefault();
		updateTotals();
		if (step + 1 >= waterUses.length) { // after last step, restart button appears
			$(this).parent().siblings('.step').eq(step).hide();
			$('#results').hide();
			$('div button.next').hide();
			$('div button.restart').show();
			$('#console').hide();
		} else { 							// if 
			$(this).parent().siblings('.step').eq(step).hide();
			$(this).parent().siblings('.step').eq(step + 1).show();
			step++;
			if (step + 1 === waterUses.length) { // if last step
				$('div button.next span').text("Finish");
			}
			reset();
		}
	});


	$('div button.option').click(function(e) {
		e.preventDefault();
		if (step + 1 >= waterUses.length) { // after last step, restart button appears
			$(this).parent().parent().siblings('.step').eq(step).hide();
			$('#results').hide();
			$('div button.next').hide();
			$('div button.restart').show();
			$('#console').hide();
		} else { 							// if 
			waterUses[step].low = $(this).attr("lowValue");
			waterUses[step].high = $(this).attr("highValue");
			gal();
			$(this).parent().parent().hide();
			$(this).parent().parent().siblings('.step').eq(step).show();
			if (step + 2 === waterUses.length) { // if last step
				$('div button.next span').text("Finish");
			}
			reset();
		}
		updateTotals();
		step++;
		updateSubtotals();
	});

	/*
		When the user clicks the restart button, the page reloads to start at the beginning.
		This is strictly for testing purposes.
	*/
	$('div button.restart').click(function(e) {
		e.preventDefault();
		location.reload();
	});

	/*
		When the user clicks on btn-minus or btn-plus, this function fires. Depending on which button they click, the function 
		will increment the "number of times" unit or the frequency unit. 
	*/
	$('.btn-minus, .btn-plus').click(function(e) {
		e.preventDefault();
		fieldName = $(this).attr('data-field');
		type      = $(this).attr('data-type');
		var output = $('p[id="' + fieldName + '"]');

		if (fieldName === 'times') { 	// this increments the "number of times" unit up or down by 1
			if (type === 'minus') {
				j--;
			} else {
				j++;
			}
			if (j === 0) {
				$('button[data-type="minus"][data-field="times"]').addClass('disabled'); // disables button so number doesnt go lower than 0
			} else {
				$('button[data-type="minus"][data-field="times"]').removeClass('disabled'); // enables button when number is greater than 0
			}
			$(output).text(j);
		}

		if (fieldName === 'freq') { 		// this increments the unit of measurement (days, weeks, months, years)
			if(type === 'minus') {
				i--;
			} else {
				i++;
			}
			var minusBtn = 'button[data-type="minus"][data-field="freq"]';
			var plusBtn = 'button[data-type="plus"][data-field="freq"]';
			if (i === 0) {
				$(minusBtn).addClass('disabled');
			} else if (i === DWMspinner.length - 1) {
				$(plusBtn).addClass('disabled');
			} else {
				$(plusBtn).removeClass('disabled');
				$(minusBtn).removeClass('disabled');
			}
			$(output).text(DWMspinner[i]);
		}
		updateSubtotals();
	});

	// This function resets the state and numbers displayed on spinners.
	function reset() {
		i = 0;
		j = 1;
		$('p[id="times"]').text(j);
		$('p[id="freq"]').text(DWMspinner[i]);
		$('button[data-type="plus"][data-field="times"]').removeClass('disabled');
		$('button[data-type="minus"][data-field="times"]').removeClass('disabled');
		$('button[data-type="plus"][data-field="freq"]').removeClass('disabled');
		$('button[data-type="minus"][data-field="freq"]').addClass('disabled');
		updateSubtotals();
	}

	function updateSubtotals() {
		galPerDay = gal();
		$('#gpd').text(Math.round(galPerDay)); // estimated used gallons per day
		$('#cycle').text(Math.round(galPerDay * billingCycle)); // estimated gallons used per billing cycle
		$('#ccf').text(((galPerDay / 748) * billingCycle).toFixed(2)); // estimated ccf used per billing cycle
		$('#dollars').text('$' + totalCostPerYear().toFixed(2)); // total cost per year
		$('#console').text(galPerDay); // actual gallons used per day
		$('.currWaterUser').text(waterUses[step].name);
	}

	function updateTotals() {
		galPerDay = gal();
		waterUses[step].gpd = Math.round(galPerDay);
		waterUses[step].gpc = Math.round(galPerDay * billingCycle);
		waterUses[step].cpc = ((galPerDay / 748) * billingCycle);
		waterUses[step].cpy = totalCostPerYear();
		console.log(waterUses[step].name + " gpd = " + waterUses[step].gpd);
		grandTotals[0] += waterUses[step].gpd;
		grandTotals[1] += waterUses[step].gpc;
		grandTotals[2] += waterUses[step].cpc;
		grandTotals[3] += waterUses[step].cpy;
		$('#grandGpd').text(grandTotals[0]);
		$('#grandCycle').text(grandTotals[1]);
		$('#grandCCF').text(grandTotals[2].toFixed(2));
		$('#totalDollars').text('$' + grandTotals[3].toFixed(2));
	}

	function totalCostPerYear() { 
		var ccfPerMonth = (galPerDay / 748) * 30.41; // ccf per month.. month is 30.41 days (average)
		var total = 0;
		var third = 0;
		var second = 0;
		var first = 5 * userRates[1];
		if (ccfPerMonth > 18) {
			third = (ccfPerMonth - 18) * userRates[3];
			second = 13 * userRates[2];
			total += third + second + first;
		} else if (ccfPerMonth > 5) {
			second = (ccfPerMonth - 5) * userRates[2];
			total += second + first;
		} else {
			total += ccfPerMonth * userRates[1];
		}
		total = total * 4; 							// peak rates
		total += ccfPerMonth * userRates[0] * 8;	// non-peak rates
		//console.log("total " + total.toFixed(2));
		return total;
	}
});
