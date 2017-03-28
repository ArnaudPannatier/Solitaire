var GA = {
	popSize : 20,
	population: [],
	matingPool : [],

	createPopulation : function(){
		for (var i = 0; i < GA.popSize; i++) {
			this.population.push(new DNA());
		}
		console.log(GA.population);
	},
	evaluate : function(){



	},
	createMatingPool: function(){


	},
	crossOver : function(){


	},
	reproduction : function(){
		for (var i = 0; i < GA.popSize; i++) {
			var mother = matingPool[Math.floor(Math.random()*GA.popSize)];
			var father = matingPool[Math.floor(Math.random()*GA.popSize)];

			var child = this.crossOver(mother,father);
			child.mutate();

			population[i] = child;
		}
	},
	algo : function(){
		// Setup
		this.createPopulation();

		// Selection
		this.evaluate();
		this.createMatingPool();

		// Reproduction
		//this.reproduction();

	}, 


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
	t

}