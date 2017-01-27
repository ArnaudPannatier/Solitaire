var dot = document.createElement('div');
dot.className = 'dot';


function convert(str){
	return parseInt(str.substr(0, str.length-2));
};
var mapDot = new Array();
var dotPlay = new Array();
var compt = 0;
var memoire = {
	direction : new Array(),
	dot : new Array(),
	tabDir : new Array(),
	tabDot : new Array()
};

function last(tab, i){
	return tab[tab.length-i];
};


var record = {
	dot : new Array(),
	coup : new Array(),
	dotPossible : new Array(),
	coupPossible : new Array(),
	computedC : new Array(),
	computedD : new Array(),
	posD : 0,
	posC : 0,
	posT : 0,
	nextCoup : 0,
	nextDot : 0,
	ajoute : function(dotPos){
		
	
		if(record.posT == 0 && record.posC == 0){
			record.dot.push(new Array());
			record.coup.push(new Array());
			record.dotPossible.push(new Array());
			record.coupPossible.push(new Array());
		}
		record.dot[record.posT].push(record.nextDot);
		record.coup[record.posT].push(record.nextCoup);
		record.dotPossible[record.posT].push(dotPos);
		
	
	},
	ajoute_coupPos : function(c){

		record.coupPossible[record.posT].push(c);
	},
	plusplus : function(tab){
		t = tab;
		t[t.length-1] = t[t.length-1]+1;
		return t;
	},
	plusplusTab : function(){
		


		acheve = false;
		m=1;
		
		t = last(record.dot,2);
		t2 = last(record.coup,2);
		dP = last(record.dotPossible,2);
		

		while(!acheve){
				
				if(t[t.length-m]<dP[dP.length-m]-1){
					
					t[t.length-m] = t[t.length-m]+1;
					t2[t2.length-m] = 0;
					acheve = true;
				}		
				m++;
		}
		m--;
		for(i=1; i<m; i++){
			t[t.length-i] = 0;
			t2[t2.length-i] = 0;
		}
		record.computedD = t;
		record.computedC = t2;

	},
	pluszero : function(tab){
		t = tab;
		t[t.length-1] = 0;
		return t;

	},
	compute : function(){
		//console.log("coup possibles: "+last(last(record.coupPossible,2),1));
		/*console.log("coup possibles ");
		console.log(last(record.coupPossible,2));
		console.log("coup joués");
		console.log(last(record.coup,2));

		console.log("dot possible");
		console.log(last(record.dotPossible,2));
		console.log("dot joués");
		console.log(last(record.dot,2))*/

		if(last(last(record.coup,2),1) < last(last(record.coupPossible,2),1)-1){
			//console.log("un");
			record.computedC = record.plusplus(last(record.coup,2));
			record.computedD = last(record.dot,2);
		
		}else if(last(last(record.dot,2),1) < last(last(record.dotPossible,2),1)){
			//console.log("zéro");
			
			record.plusplusTab();


		}



	},
	modifie : function(){
		//console.log(record.computedD.length+" pos "+record.posD);
		if(record.computedD.length == 0 || record.computedD.length < record.posD+1){
			record.nextCoup = 0;
			record.nextDot = 0;

		}else{

			record.nextCoup = record.computedC[record.posC];
			record.nextDot = record.computedD[record.posD];
		}


	},
	alaligne : function(){
		record.posT++;
		record.posC = 0;
		record.posD = 0;
		
		record.dot.push(new Array());
		record.coup.push(new Array());
		record.dotPossible.push(new Array());
		record.coupPossible.push(new Array());

		record.computedD = new Array();
		record.computedC = new Array();
	},
	avance : function(dotPos){
		if(record.posT != 0){
			if(record.computedD.length == 0){
				record.compute();
			}


		}
		record.modifie();

		record.ajoute(dotPos);
		record.posD++;
		record.posC++;

	},
	choix_dot: function(dotPos){
		record.avance(dotPos);
		return record.nextDot;
	},
	choix_coup : function(coupPos){
		record.ajoute_coupPos(coupPos);
		return record.nextCoup;
	},
};



var Solitaire = {
	init : function(container){
		Solitaire.createTerrain(container);
		Solitaire.play(container);
	},
	createTerrain : function(container){
		
		
		w = convert(container.style.width);
		rdot =  w/15;
		milieuDot = w/2; 
		dot.style.width = rdot+"px";
		dot.style.height = rdot+"px";
		dot.style.borderRadius = rdot+"px";

		for(i=0; i<33; i++){
			mapDot[i] = {
				stat : 1,
				dotAdjTab : undefined,
				dotAjd : undefined,
				id : 0,
				elem : undefined,
				action : new Array()

			}
		}


		for (i = 0; i < 21; i++) {
			d = dot.cloneNode();
			d.style.top = rdot*(1+Math.floor(i/3)*2)+"px";
			d.style.left = milieuDot-rdot*(2.5-(i%3)*2)+"px";

			mapDot[i].elem = d;
			mapDot[i].id = i;

			if(i==10){
				mapDot[i].stat = 0;
				d.style.backgroundColor = "#2c3e50";
			}


			container.appendChild(d);

		}


		for(i=0; i<6; ++i){
			for(j=0; j<2; ++j){
				d = dot.cloneNode();
				d.style.top = milieuDot-rdot*(2.5-(i%3)*2)+"px";
				if(i>2)
					d.style.left = milieuDot+rdot*3.5+j*2*rdot+"px";
				else
					d.style.left = rdot+j*rdot*2+"px";


				k=21+i*2+j;

				mapDot[k].elem = d;
				mapDot[k].id = k;

				container.appendChild(d);

			}
		}

		for(i=0; i<33; i++){
			mapDot[i].elem.title = mapDot[i].id+'dot';

			if(i<21){
				if(i%3==0){
					mapDot[i].dotAjd = {
						up : (i==0) ? undefined : mapDot[i-3],
						left : (i<6 || i>12)? undefined : mapDot[(((i/3)-1)*2)+20],
						right : mapDot[i+1],
						down : (i==18)? undefined : mapDot[i+3]


					}

				}else if(i%3==1){
					mapDot[i].dotAjd = {
						up : (i==1)? undefined : mapDot[i-3],
						left : mapDot[i-1],
						right : mapDot[i+1],
						down : (i==19)? undefined : mapDot[i+3]

					}


				}else{
					mapDot[i].dotAjd = {
						up : (i==2)? undefined : mapDot[i-3],
						left : mapDot[i-1],
						right : (i<6 || i>14)? undefined : mapDot[((((i-2)/3)-1)*2)+25],
						down : (i==20)? undefined : mapDot[i+3]

					}

				}
				

			}else if(i<27){
				if(i%2==1){
					mapDot[i].dotAjd = {
						up : (i==21) ? undefined : mapDot[i-2],
						left : undefined,
						right : mapDot[i+1],
						down : (i==25)? undefined : mapDot[i+2]


					}

				}else{
					mapDot[i].dotAjd = {
						up : (i==22) ? undefined : mapDot[i-2],
						left : mapDot[i-1],
						right : mapDot[((((i-20)/2)+1)*3)],
						down : (i==26)? undefined : mapDot[i+2]


					}


				}
			}else{
				if(i%2==1){
					mapDot[i].dotAjd = {
						up : (i==27) ? undefined : mapDot[i-2],
						left : mapDot[(((((i-25)/2)+1)*3)+2)],
						right : mapDot[i+1],
						down : (i==31)? undefined : mapDot[i+2]


					}

				}else{
					mapDot[i].dotAjd = {
						up : (i==28) ? undefined : mapDot[i-2],
						left : mapDot[i-1],
						right : undefined,
						down : (i==32)? undefined : mapDot[i+2]


					}


				}


			}
			mapDot[i].dotAdjTab = $.map(mapDot[i].dotAjd, function(l, v) { if(l != undefined) return l;  });


		}


		/*for(i=0; i<33;i++){
			if(mapDot[i].stat){
				switch(mapDot[i].dotAdjTab.length){
					case 2:
					mapDot[i].elem.style.backgroundColor = "#f1c40f";
					break;
					case 3:
					mapDot[i].elem.style.backgroundColor = "#2ecc71";
					break;
					case 4:
					mapDot[i].elem.style.backgroundColor = "#3498db";
					break;




				}


			}
		}*/
	},

	play : function(container){
		Solitaire.algo();


	},
	joue_coup : function(d1,dir){
		var couleur1 = d1.elem;
		var couleur2 = d1.dotAjd[dir].dotAjd[dir].elem;
		d1.stat = 0;
		d1.dotAjd[dir].stat = 0;
		d1.dotAjd[dir].dotAjd[dir].stat = 1;
		
		dotPlay = new Array();
		Solitaire.colorise();
	
		couleur1.style.backgroundColor = "#2ecc71";
		couleur2.style.backgroundColor = "#e74c3c";

	},
	colorise : function(){
		Solitaire.actionZero();
		compt = 0;
		
		for(i=0; i<33; i++){
			if(mapDot[i].stat == 0){
				mapDot[i].elem.style.backgroundColor = "#2c3e50";
			}else if(outils.to_play(mapDot[i])){
				compt++;
				mapDot[i].elem.style.backgroundColor = "#f1c40f";
			}else{
				compt++;
				mapDot[i].elem.style.backgroundColor = "#3498db";

			}

		}
	},
	/*
	algo : function(d){
		k=0;
		l=0;
		pi =1;
		lastDot = {};
		lastDot2 = {};
		Solitaire.colorise();
		memoire.direction.push(new Array());
		memoire.dot.push(new Array());
		(function delay(){

			if(Solitaire.is_blocked()){
				var s = Solitaire.is_winning(); 
				
				if(s == 1) return;
				else{
					Solitaire.afficheMem();
					
					if(s<3){
						alert(s);
					}
					console.log(s);

					Solitaire.remiseAZero();
					Solitaire.colorise();


					memoire.direction.push(new Array());
					memoire.dot.push(new Array());
					//Solitaire.actionZero();

					l=0;
					k++;
					memoire.tabDir = lastDot; 
					memoire.tabDot = lastDot2;
					
				}
			}

			setTimeout(function(){
				
				var i =0;
				var j = 0;

				if(k==0){
					i = 0; 
					j = 0;
				}else{
					if(memoire.direction[k-1][l] == memoire.tabDir.length && memoire.dot[k-1][l]==memoire.tabDot.length-1){
						pi++;
						console.log("allons y !");
					}


					if(l==memoire.direction[k-1].length-pi){
						
						if(memoire.direction[k-1][l] < memoire.tabDir.length){ 		
				
							j = memoire.direction[k-1][l]+1; 
							i = memoire.dot[k-1][l];

						}else{
							console.log(memoire.direction[k-1][l]+" - "+memoire.tabDir.length+" : "+memoire.tabDot.length+" - "+(memoire.dot[k-1][l]+1));	
							

							if((memoire.dot[k-1][l]+1) < memoire.tabDot.length){
								Solitaire.afficheMem();
								console.log('2-t');	
								j = 0;	
								i = memoire.dot[k-1][l]+1;
								
							}

						}
					}else if(l>memoire.direction[k-1].length-pi){
						console.log('boucle pas');
						i = 0; 
						j = 0;

					}else{
						i = memoire.dot[k-1][l];
						j = memoire.direction[k-1][l];
					}
				}
				console.log(dotPlay.length+" "+memoire.tabDot.length);
				console.log("j : "+j+" i :"+i+" l: "+l+" . "+pi);

				


				if(k!= 0 && l<=memoire.direction[k-1].length-pi+1){

					lastDot = dotPlay[i].action[j];
					lastDot2 = dotPlay;
				}
				l++;
				memoire.direction[k].push(j);
				memoire.dot[k].push(i);

				Solitaire.joue_coup(dotPlay[i], dotPlay[i].action[j]);
				
				delay();


			}, 0);


		})();

	},*/
	
	algo : function(d){
		k=0, l=0, temp=0;
		Solitaire.colorise();
		
		(function delay(){

			if(Solitaire.is_blocked()){
				var s = Solitaire.is_winning(); 
				
				if(s == 1) return;
				else{
					if(s<3){
						alert(s);
					}
					console.log("k: "+k+" dot restants : "+s);
					record.alaligne();
					Solitaire.remiseAZero();
					Solitaire.actionZero();
					Solitaire.colorise();				
					k++;
					l=0;	
					temp = (k%100 == 0) ? 100 : 0;
					if(k%100 == 0)
					console.log(last(record.dot,2));
				}
			}

			setTimeout(function(){
				
				
				var i = record.choix_dot(dotPlay.length);
				var j = record.choix_coup(dotPlay[i].action.length);
				
				Solitaire.joue_coup(dotPlay[i], dotPlay[i].action[j]);
				l++;
				delay();


			}, temp);


		})();


		
	},


	algo_bogo : function(d){
		k=0;
		Solitaire.colorise();
		(function delay(){

			if(Solitaire.is_blocked()){
				var s = Solitaire.is_winning(); 
				
				if(s == 1) return;
				else{
					if(s<3){
						alert(s);
					}
					console.log(s);

					Solitaire.remiseAZero();
					Solitaire.colorise();


					

					k++;
					
				}
			}

			setTimeout(function(){
				
				var i = Math.floor(Math.random()*dotPlay.length); 
				var j = Math.floor(Math.random()*dotPlay[i].action.length);
				Solitaire.joue_coup(dotPlay[i], dotPlay[i].action[j]);
				delay();


			}, 0);


		})();
		


	},
	is_blocked : function(){
			/*blocked = false;
			

			for(i=0; i<33; i++){
				if(mapDot[i].stat == 1 && Solitaire.round_o(mapDot[i])){
					blocked = true;
					
				}

			}*/

			if(dotPlay.length == 0)
				return true;
			else 
				return false;
		},
		round_o : function(d){


			if(d.dotAjd.up != undefined){
				if(d.dotAjd.up.stat == 1)
					return false;

				if(d.dotAjd.up.dotAjd.left != undefined && d.dotAjd.up.dotAjd.left.stat == 1)
					return false;
				if(d.dotAjd.up.dotAjd.right != undefined && d.dotAjd.up.dotAjd.right.stat == 1)
					return false;

			}
			if(d.dotAjd.left != undefined){
				if(d.dotAjd.left.stat == 1)
					return false;

				if(d.dotAjd.left.dotAjd.down != undefined && d.dotAjd.left.dotAjd.down.stat == 1)
					return false;

			}
			if(d.dotAjd.right != undefined){
				if(d.dotAjd.right.stat == 1)
					return false;

				if(d.dotAjd.right.dotAjd.down != undefined && d.dotAjd.right.dotAjd.down.stat == 1)
					return false;

			}
			if(d.dotAjd.down != undefined && d.dotAjd.down.stat ==1){
				return false;
			}
			return true;
		},

		is_winning : function(){
			if(Solitaire.is_blocked()){
				stat = 0;
				for(i=0; i<33; i++){
					if(mapDot[i].stat == 1){
						stat++;

					}

				}

				return stat;
			}
			return 1000;

		},
		remiseAZero : function(){
			for(i=0; i<33; i++){
				if(i != 10){
					mapDot[i].stat = 1;
					
				}else{
					mapDot[i].stat = 0;
				}

			}



		},
		actionZero : function(){
			for(i=0; i<33; i++){
				mapDot[i].action = new Array();

			}

		},
		afficheMem : function(){
			console.log(memoire.dot[memoire.dot.length-1].toString()+"-  -"+memoire.direction[memoire.direction.length-1].toString());

		}

	};

	var outils = {
		to_play : function(tab){
			var play = false;
			var dir = new Array("up", "left", "right", "down");

			for(j=0; j<dir.length; j++){
				if(outils.test_exist(tab, dir[j]) && tab.dotAjd[dir[j]].stat ==1 && tab.dotAjd[dir[j]].dotAjd[dir[j]].stat == 0){
					play = true;
					tab.action.push(dir[j]);
					dotPlay.push(tab);
				}
			}
			return play;

		},
		test_exist : function(t, dir){
			return (t.dotAjd[dir] != undefined && t.dotAjd[dir].dotAjd[dir] != undefined) ? true : false;

		}


	};



	window.onload = function(){
		var container = document.getElementById("container");
		r = document.body.clientHeight*0.9;
		container.style.height = r+"px";
		container.style.width = r+"px";
		container.style.top = r/0.9*0.025+"px";


		Solitaire.init(container);


	}