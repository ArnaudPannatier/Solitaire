var GA = {
	popSize : 100,
	population: [],
	matingPool : [],
	bestFit : {value : 0, index : 0},
	mutationRate : 0.01,
	etrangers : 0.1,
	CrossOverOffset : 10,
	bestSelected : 5,
	TheorethicalBestFit : 31,
	historicalBestFit : 0,



	createPopulation : function(){
		for (var i = 0; i < GA.popSize; i++) {
			this.population.push(new DNA());
		}
	},
	evaluate : function(){
		this.bestFit = {value : 0, index : 0};
		var moyenne = 0;
		for (var i = 0; i < GA.popSize; i++) {
			GA.population[i].fitness = Solitaire.playArray(GA.population[i].code);
			moyenne += GA.population[i].fitness/GA.popSize;
			if(this.bestFit.value <  GA.population[i].fitness){
				this.bestFit.value = GA.population[i].fitness;
				this.bestFit.index = i;
			}
		}

		if(this.bestFit.value > this.historicalBestFit){
			this.historicalBestFit = this.bestFit.value;
		}

		$('#BestFit').text(this.bestFit.value);
		$('#Average').text(Math.floor(moyenne*100)/100);
		$('#Historical').text(this.historicalBestFit);

		Solitaire.playArray(GA.population[this.bestFit.index].code);


	},
	createMatingPool: function(){
		//for (var i = 0; i < GA.popSize; i++) {
		//	var n = Math.round(GA.population[i].fitness/GA.bestFit.value*100);
		//	for (var j = 0; j < n; j++) {
		//		GA.matingPool.push(GA.population[i]);
		//	}
		//}
		// Three best
		GA.population.sort(function(a,b){return b.fitness-a.fitness});

		var n = GA.bestSelected;
		for(i=0; i<n; i++){
			for(j=0; j<n-i; j++){
				GA.matingPool.push(GA.population[i]);
			}
			
		}


	},
	crossOver : function(mother, father){
		var child = new DNA();

		//traditionnal
		var randomIndex = Math.floor(Math.random()*child.code.length);

		//my style
		var randomNum = Math.floor(Math.pow(Math.random(),5)*10)+GA.CrossOverOffset;

		randomIndex = 2*(mother.fitness-randomNum);

		
		for (var i = 0; i < child.code.length; i++) {
			if(i < randomIndex){
				child.code[i] = mother.code[i];
			}else{
				child.code[i] = father.code[i];
			}
		}





		return child;
	},
	reproduction : function(){
		for (var i = 0; i < GA.popSize; i++) {
			if(i < (1-GA.etrangers)*GA.popSize){
				var mother = GA.matingPool[Math.floor(Math.random()*GA.matingPool.length)];
				var father = GA.matingPool[Math.floor(Math.random()*GA.matingPool.length)];

				var child = this.crossOver(mother,father);
				child.mutate();

				GA.population[i] = child;
			}else {
				GA.population[i] = new DNA();
			}


		}
	},
	algo : function(){
		var gen = 1, temp = 20;
		// Setup
		this.createPopulation();


		(function delay(){
			
			if(GA.bestFit.value == GA.TheorethicalBestFit){
				alert('DARWIN ROCKS !');
				return;
			}

			setTimeout(function(){
				// Selection
				GA.evaluate();
				GA.createMatingPool();

				// Reproduction
				GA.reproduction();
				$("#Gen").text(gen);
				gen++;
				delay();
		}, temp);


		})();
	}



};

function DNA() {
	this.fitness = 0;
	this.length = 62;
	var code = [];
	for (var i = 0; i < this.length; i++) {
		code.push(Math.random());
	}
	this.code = code;
};
DNA.prototype.mutate = function(){
	for (var i =0; i < this.code.length; i++) {
		if(Math.random < GA.mutationRate){
			this.code[i] = Math.random();
		}
	}
};