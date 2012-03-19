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

    push.gridplot = function(selector, nrows, ncols, height, width, id){
	var table = $("<table id='" + id + "'></table>");
	$(selector).append(table);
	var row, cellid
	_.each(_.range(nrows), function(y){
	    row = $("<tr></tr>");
	    table.append(row);
	    _.each(_.range(ncols), function(x){
		cellid = id + "_" + y + "_" + x;
		var html = '<td><svg id="'+cellid+'"></svg></td>';
		row.append($(html));
		d3.select("#" + cellid).append('rect')
		    .attr("class", "frame")
		    .attr("width", width)
		    .attr("height", height);
	    });
	});
	table.find('svg').height(height);
	table.find('svg').width(width);
	return 'success'
    }

    push.scatter = function(selector, data, xfield, yfield, mark){
	svg = d3.select(selector);
	var width = $(selector).width();
	var height = $(selector).height();
	$(selector).addClass('scatter')

	var xaxis = push.linear_axis(_.map(data, function(x){return x[xfield]}),
				     width);
				     
	var yaxis = push.linear_axis(_.map(data, function(y){return y[yfield]}),
				     height);
	svg.selectAll(mark).data(data).enter().append(mark)
	    .attr('cx', function(d){
		return xaxis(d[xfield]);
	    })
	    .attr('cy', function(d){
		return yaxis(d[yfield]);
	    })
	    .attr('r', 3);
	return 'success';
    }
    d3.push = push;
})();

