/***************************************************************************/
/************************************************ CREATION DE LA CARTE *****/
/***************************************************************************/

const width = 960, height = 600;

const map = d3.geoPath();

const projection = d3.geoMercator()
	.center([2.5, 46.5])
	.scale(2250)
	.translate([width/2, height/2]);

map.projection(projection);

const svg = d3.select("#carte1")
	.append("svg")
	.attr("id", "svg1")
	.attr("width", width)
	.attr("height", height);

// Pour une carte du monde, on peut changer de projection, de centre et/ou d'échelle
// Pour en savoir plus sur les projections et d3, consulter https://github.com/d3/d3-geo-projection

const map2 = d3.geoPath();

const projection2 = d3.geoConicConformal()
	.center([0, 40])
	.scale(300)
	.translate([width/2, height/2]);

map2.projection(projection2);

const svg2 = d3.select('#carte2')
	.append("svg")
	.attr("id", "svg2")
	.attr("width", width)
	.attr("height", height);

/***************************************************************************/
/************************************* AJOUT DES OBJETS SUR LES CARTES *****/
/***************************************************************************/

const pays = svg.append("g");
pays.selectAll("path")
	// La variable geojson est créée dans le fichier JS qui contient le GeoJSON
	.data(geojson_pays.features)
	.enter()
	.append("path")
	.attr("d", map)
	// Sémiologie (par défaut) des objets
	.style("fill", "#f2f0e6")
	.style("stroke-width", 0);

const pays2 = svg2.append("g");
pays2.selectAll("path")
	// On peut réutiliser la même geojson variable pour une seconde carte
	.data(geojson_pays.features)
	.enter()
	.append("path")
	.attr("d", map2)
	.style("fill", "#363636")
	// Cette fois, on met une épaisseur et une couleur de contour
	.style("stroke", "white")
	.style("stroke-width", 0.1);

const labels = svg2.append("g");
labels.selectAll("text")
	.data(geojson_pays.features)
	.enter()
	.append("text")
	.attr("transform", function(d) { return "translate(" + map2.centroid(d) + ")"; })
	.attr("fill", "white")
	.style("text-anchor", "middle")
	.style("font-size", "9px")
	.text(function(d){return d.properties.ADMIN})
	.filter(function(d){
		return ["IND","BRA","RUS","UKR","IRN","SAU","ESP","TUR","DZA","LBY","EGY"].indexOf(d.properties.ISO_A3) < 0;
	}).remove();

const depts = svg.append("g");
depts.selectAll("path")
	// La variable geojson est créée dans le fichier JS qui contient le GeoJSON
	.data(geojson_depts.features)
	.enter()
	.append("path")
	.attr("d", map)
	// Sémiologie (par défaut) des objets
	.style("fill", "#f2ebcb")
	.style("stroke", "grey")
	.style("stroke-width", 0.4);

const lgv = svg.append("g");
lgv.selectAll("path")
	.data(geojson_lgv.features)
	.enter()
	.append("path")
	.attr("d", map)
	.style("fill-opacity", 0)
	.style("stroke", "black")
	.style("stroke-width", 2)
	.style("stroke-dasharray", [2, 2])
	.style("stroke-opacity", 0);

const pts = svg.append("g");
var prefectures = [
	[0.340784, 46.580421],
	[-0.46482, 46.323867],
	[0.156153, 45.648655],
	[-1.15195, 46.159821]
];
pts.selectAll("circle")
	.data(prefectures).enter()
	.append("circle")
	.attr("cx", function (d){return projection(d)[0];})
	.attr("cy", function (d){return projection(d)[1];})
	.attr("r", "5px")
	.attr("fill", "#44659b")
	.style("stroke", "white")
	.style("stroke-width", 2);

/***************************************************************************/
/***************************************** CHANGER LE STYLE DES OBJETS *****/
/***************************************************************************/

depts.selectAll("path").filter(function(d) {
	return d.properties.CODE_REG == "11";
}).style("fill", "orange");

/***************************************************************************/
/****************** CHANGER LE STYLE DES OBJETS AU SURVOL DE LA SOURIS *****/
/***************************************************************************/

depts.selectAll("path").filter(function(d) {
	return d.properties.CODE_DEPT == "86";
}).on("mouseover", function(d) {
	d3.select(this)
		.style("fill", "orange");
}).on("mouseout", function(d) {
	d3.select(this)
		.style("fill", "#f2ebcb");
});

// Avec une transition (https://www.datavis.fr/index.php?page=transition)

depts.selectAll("path").filter(function(d) {
	return d.properties.CODE_DEPT == "16";
}).on("mouseover", function(d) {
	d3.select(this)
		.transition()
		.duration(1000) // 1000 millisecondes
		.style("fill", "orange");
}).on("mouseout", function(d) {
	d3.select(this)
		.transition()
		.duration(1000) // 1000 millisecondes
		.style("fill", "#f2ebcb");
});

/***************************************************************************/
/***************************** PREVOIR UNE ACTION AU CLIC SUR UN OBJET *****/
/***************************************************************************/

depts.selectAll("path").filter(function(d) {
	return d.properties.CODE_DEPT == "79";
}).on("mouseover", function(d) {
	d3.select(this)
		.style("cursor", "pointer");
}).on("click", function(d) {
	alert("Je suis le département " + d.properties.NOM_DEPT + " !")
});

/***************************************************************************/
/************************************************* AJOUTER UNE TOOLTIP *****/
/***************************************************************************/

var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

pts.selectAll("circle")
	.on("mouseover", function(d){
		tooltip.style("display", "block");
		tooltip.transition().duration(200).style("opacity", 0.9);
		tooltip.html("Je suis une préfecture !")
			.style("left", (d3.event.pageX + 10) + "px")
			.style("top", (d3.event.pageY - 10) + "px");
	}).on("mouseout", function(d){
		tooltip.style("left", "-500px").style("top", "-500px");
	});

/***************************************************************************/

function zoomOnFeature(feature){
	
}

/***************************************************************************/
/**************************** PREVOIR UNE ACTION AU CLIC SUR UN BOUTON *****/
/***************************************************************************/

$("#action1").click(function(){
	alert("Il y a " + pays.selectAll("path").data().length + " pays");
});

$("#action2").click(function(){
	window.setTimeout(function(){
		alert("Il y a " + depts.selectAll("path").data().length + " départements");
	}, 2000); // 2000 millisecondes
});

$("#action3").click(function(){
	$("#legende").html("Je viens d'être modifié par le bouton Action 3 !");
});

$("#action4").click(function(){
	pays.selectAll("path").filter(function(d) {
		var pays_a_cacher = ["ITA", "ESP"];
		// Si le code ISO du pays fait partie des codes ISO des pays à cacher
		if(pays_a_cacher.indexOf(d.properties.SOV_A3) >= 0){
			return true;
		}
		return false;
	}).style("visibility", "hidden");
});

$("#action5").click(function(){
	lgv.selectAll("path").style("stroke-opacity", 1);
});
