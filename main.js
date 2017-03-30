var dot = document.createElement('div');
dot.className = 'dot';


function convert(str){
	return parseInt(str.substr(0, str.length-2));
};

var mapDot = new Array();
var dotPlay = new Array();
var compt = 0;
var completementBloque = false;

function last(tab, i){
	return tab[tab.length-i];
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

	},

	play : function(container){
		GA.algo();


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
			}else {
				compt++;
				mapDot[i].elem.style.backgroundColor = "#3498db";

			}

		}
	},
	playArray : function(arr){
		var k = 0;
		Solitaire.remiseAZero();
		Solitaire.actionZero();
		Solitaire.colorise();

		while(!Solitaire.is_blocked()){
			var i = Math.floor(arr[2*k]*dotPlay.length);
			var j = Math.floor(arr[2*k+1]*dotPlay[i].action.length);

			Solitaire.joue_coup(dotPlay[i], dotPlay[i].action[j]);
			k++;

		}

		return k;
	},
	playSlowArray : function(arr){
		k=0, temp=0;
		Solitaire.remiseAZero();
		Solitaire.actionZero();
		Solitaire.colorise();
		
		(function delay(){
			

			setTimeout(function(){
			
				if(Solitaire.is_blocked()){
					return;
				}
			
				var i = Math.floor(arr[2*k]*dotPlay.length);
				var j = Math.floor(arr[2*k+1]*dotPlay[i].action.length);

				Solitaire.joue_coup(dotPlay[i], dotPlay[i].action[j]);
				k++;
				delay();


			}, temp);


		})();

	},	

	is_blocked : function(){
		if(dotPlay.length == 0 || completementBloque){
			return true;
		}
		else {
			return false;
		}
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
		completementBloque = false;
		for(i=0; i<33; i++){
			if(i != 10){
				mapDot[i].stat = 1;

			}else{
				mapDot[i].stat = 0;
			}
		}
	},
	actionZero : function(){
		dotPlay = [];
		for(i=0; i<33; i++){
			mapDot[i].action = new Array();

		}
	},

};

var outils = {
	to_play : function(tab){
		var play = false;
		var dir = new Array("up", "left", "right", "down");
		
		localementBloque = true;
		for(j=0; j<dir.length; j++){
			// Playable
			if(outils.test_exist(tab, dir[j]) && tab.dotAjd[dir[j]].stat ==1 && tab.dotAjd[dir[j]].dotAjd[dir[j]].stat == 0){
				play = true;
				tab.action.push(dir[j]);
				dotPlay.push(tab);
			}
			
			// Completely isolated		
			if(tab.dotAjd[dir[j]] != undefined){
				var cur = tab.dotAjd[dir[j]];
				if(cur.stat == 0){
					for (var k = 0; k < dir.length; k++) {
						var secondNeighbourg = cur.dotAjd[dir[k]];
						if(secondNeighbourg != undefined && secondNeighbourg != tab){
							if(secondNeighbourg.stat != 0){
								localementBloque = false;
							}
						}
					}
				}else{
					localementBloque = false;
				}
			}
		}
	
		if(localementBloque){
			completementBloque = true;
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
	container.style.height = r+50+"px";
	container.style.width = r+"px";
	container.style.top = r/0.9*0.025+"px";


	Solitaire.init(container);


}