(function(){
    var root = this;
    var push = {};
    root.push = push
    push.linear_axis = function(data, display_size, reverse){
	var domain, range
	domain = [d3.min(data), d3.max(data)];
	if (!reverse){
	    range = [0, display_size];
	}else{
	    range = [display_size, 0];
	}
	return d3.scale.linear().domain(domain).range(range);
    }
    push.scatter = function(elem, data, xfield, yfield, mark){
	var svg = d3.select(elem).append('svg');
	console.log([$(elem).width(), $(elem).height()]);
	var xaxis = push.linear_axis(_.map(data, function(x){return x[xfield]}),
				     $(elem).width());
	var yaxis = push.linear_axis(_.map(data, function(y){return y[yfield]}),
				     $(elem).height());
	svg.selectAll(mark).data(data).enter().append(mark)
	    .attr('fill', '#00007f')
	    .attr('cx', function(d){
		return xaxis(d[xfield]);
	    })
	    .attr('cy', function(d){
		return yaxis(d[yfield]);
	    })
	    .attr('r', 3);
	return svg;
    }
    d3.push = push;
})();

