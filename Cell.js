function Cell(i,j) //stvaranje celija
{
	this.i = i;
	this.j = j;
	this.walls = [true, true, true, true];   //top, right, bottom, left
	this.visited = false;
	this.searchedThrough = false;
	this.col = color(255, 0, 255, 100);
	
	var isStartingPoint = false;
	var isEndingPoint = false;
	var x = this.i*w;
	var y = this.j*w;
	
	this.checkNeighbors = function()
	{
		var neighbors = [];
		
		var top = grid[index(i, j-1)];
		var right = grid[index(i+1, j)];
		var bottom = grid[index(i, j+1)];
		var left = grid[index(i-1, j)];

		if (top && !top.visited)
		{
			neighbors.push(top);
		}

		if (right && !right.visited)
		{
			neighbors.push(right);
		}

		if (bottom && !bottom.visited)
		{
			neighbors.push(bottom);
		}

		if (left && !left.visited)
		{
			neighbors.push(left);
		}

		if (neighbors.length > 0)
		{
			var r = floor (random (0, neighbors.length));
			return neighbors[r];
		}

		else
		{
			return undefined;
		}
	}

	this.checkWalls = function()
	{
		var top = grid[index(i, j-1)];
		var right = grid[index(i+1, j)];
		var bottom = grid[index(i, j+1)];
		var left = grid[index(i-1, j)];

		var neighbors = [];

		if(!this.walls[0] && top && !top.searchedThrough)
		{
			return top;
		}

		if(!this.walls[1] && right && !right.searchedThrough)
		{
			return right;
		}

		if(!this.walls[2] && bottom && !bottom.searchedThrough)
		{ 
			return bottom;
		}

		if(!this.walls[3] && left && !left.searchedThrough)
		{
			return left;
		}

		else
		{
			return undefined;
		}
	}

	this.highlight = function(colour)
	{
		noStroke();
		fill(colour);
		rect(x, y, w, w);
	}

	this.highlightSearch = function(colour)
	{
		//stroke(colour);
		fill(colour);
		rect(x, y, w, w);
	}

	this.highlightFourth = function()
	{
		noStroke;
		fill(90, 90, 90, 40);
		rect(x, y, w, w);
	}

	this.show = function()
	{
		stroke(0);
		if (this.walls[0])
		{
			line(x,   y,   x+w,  y);	
		}
		if (this.walls[1])
		{
			line(x+w, y,   x+w,  y+w);	
		}
		if (this.walls[2])
		{
			line(x+w, y+w, x,    y+w);	
		}
		if (this.walls[3])
		{
			line(x,   y+w, x,    y);	
		}
		
		if(this.visited)	//provjera posjecenosti celije
		{
			noStroke();
			//fill(125, 125, 125, 100);
			rect(x, y, w, w);
		}
	}

	this.stroke = function(color) 
	{
    	stroke(color);
    	noFill();
    	rect(this.x + 1, this.y + 1, w - 2, w - 2);
  	}

  	this.startingPointSelection = function()
  	{
  		this.isStartingPoint = true;
  		noStroke();
  		fill(COLOUR_STARTING_POINT);
  		rect(x, y, w, w);
  	}

  	this.endingPointSelection = function()
  	{
  		this.isEndingPoint = true;
  		noStroke();
  		fill(COLOUR_GOAL_POINT);
  		rect(x, y, w, w);
  	}
}