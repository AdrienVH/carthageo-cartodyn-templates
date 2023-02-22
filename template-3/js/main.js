/***************************************************************************/
/************************************************* CREATION DES CARTES *****/
/***************************************************************************/

for (const marathon of geojson_marathons.features) {

	const width = 450, height = 400;

	const map = d3.geoPath();

	const projection = d3.geoMercator()
		.center([marathon.properties.lon, marathon.properties.lat])
		.scale(100000)
		.translate([width/2, height/2]);
	
	map.projection(projection);

	const svg = d3.select("#" + marathon.properties.ville.toLowerCase() + " .carte")
		.append("svg")
		.attr("id", marathon.id)
		.attr("width", "100%")
		.attr("height", "100%");

	const group = svg.append("g");
	
	group.selectAll("path")
		// On triche car data attend un tableau de features
		.data([marathon])
		.enter()
		.append("path")
		.attr("d", map)
		.style("fill", "none")
		.style("stroke", "black")
		.style("stroke-width", 2)
		.style("stroke-dasharray", function(){ return [0, this.getTotalLength()] })
		.transition()
		.duration(10000)
		.ease(d3.easeLinear)
		.style("stroke-dasharray", function(){ return [this.getTotalLength(), 0] });
}
