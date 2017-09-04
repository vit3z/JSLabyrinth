var col, row;
w = 40;
var grid = [];

const state =
{
	Default_State: 0,
	Drawing_State: 1,
	Drawing_Complete_State: 2,
	Selection_Of_Starting_Position_Substate: 3,
	Selection_Of_Ending_Position_Substate: 4,	
	Selection_Of_Positions_Complete_State: 5,
	Selection_Of_Search_Type_Selection_Complete_State: 6,
	Randomized_Search_State: 7
};
var currState;

const COLOUR_BUILDING_BLOCK = 'rgba(125, 125, 125, 0)'
const COLOUR_STARTING_POINT = 'rgba(10, 220, 250, 0.5)';
const COLOUR_GOAL_POINT = 'rgba(255, 155, 0, 0.75)';
const COLOUR_SEARCH_ROUTE = 'rgba(140, 230, 250, 0.5)';
const COLOUR_SEARCH_WRONG_ROUTE = 'rgba(230, 90, 90, 0.5)';

var current;
var searchingBlock;
var endingBlock;
var nextCellInTheSearch;

var stack = [];
var route = [];
var deadEnd = [];

var textBox;
var checkBox1;

var textBoxSX;
var textBoxSY;
var buttonS;

var textBoxEX;
var textBoxEY;
var buttonE;

var pStartingText;
var pConfirmText;
var pSelectingStartPosition;
var pSelectingEndPosition;
var pEndingText;
var textX;
var textY;


var xCoor = 0;
var yCoor = 0;

function setup() //"main funkcija"
{
	currState = state.Default_State;

	createCanvas(401, 401);

	pStartingText = createP("Enter the desired size of a Cell (sizes between 15 an 80 are allowed, decimal values are rounded to the smaller amount).");
	pStartingText.id("pStartingText");

	pConfirmText = createP("Press 'Enter' after choosing")
	pConfirmText.id("pConfirmText");

	textBox = createInput('');
	textBox.id("textBox");

	checkBox1 = createCheckbox("Start the Search", false);
	checkBox1.id("checkBox1");
	checkBox1.hide();

	pSelectingStartPosition = createP("Enter the coordiantes of the starting point");
	pSelectingStartPosition.id("pSelectingStartPosition");
	pSelectingStartPosition.hide();

	pSelectingEndPosition = createP("Enter the coordiantes of the end point");
	pSelectingEndPosition.id("pSelectingEndPosition");
	pSelectingEndPosition.hide();

	textX = createSpan("X");
	textX.id("textX");
	textX.class("coordinates");

	textBoxSX = createInput("");
	textBoxSX.id("textBoxSX");
	textBoxSX.class("startingBox");
	textBoxSX.hide();

	textBoxEX = createInput("");
	textBoxEX.id("textBoxEX");
	textBoxEX.class("endingBox");
	textBoxEX.hide();

	textY = createSpan("Y");
	textY.id("textY");
	textY.class("coordinates");

	textBoxSY = createInput("");
	textBoxSY.id("textBoxSY");
	textBoxSY.class("startingBox");
	textBoxSY.hide();

	textBoxEY = createInput("");
	textBoxEY.id("textBoxEY");
	textBoxEY.class("endingBox");
	textBoxEY.hide();

	buttonS = createButton("Select");
	buttonS.id("buttonS");
	buttonS.hide();

	textX.hide();
	textY.hide();

	buttonE = createButton("Select");
	buttonE.id("buttonE");
	buttonE.hide();

	textBox.changed(function () {
		w = int(textBox.value());

		typeOfInputVerification(w);
	});
}

function typeOfInputVerification(testingVar)
{
	int(testingVar);

	if(testingVar % 1 === 0 && testingVar >= 15 && testingVar <= 80) 	//provjera jel unos broj ili ne i jel unutar raspona
	{
		colAndRowCalculation();
		gridGeneration();

		currState = state.Drawing_State;
	}
	else
	{
		console.log("Invalid number");
		return undefined;
	}
}

function colAndRowCalculation()
{
	col = floor(width/w);
	row = floor(width/w);
}

function gridGeneration()
{
	for (var j=0; j < row; j++)
	{
		for(var i=0; i< col; i++)
		{
			var cell = new Cell(i, j);
			grid.push(cell);
		}
	}
	current = grid[0];

	console.log("gridGeneration Complete")
	textBox.hide();
}


function draw() //"glavna funkcija" za generiranje labirinta
{
	//frameRate(1);
	if(currState === state.Drawing_State)
	{
		background(255);
		for (var i=0; i<grid.length; i++)
		{
			grid[i].show();
		}

		current.visited = true;
		current.highlight(COLOUR_BUILDING_BLOCK);
		//Step 1
		var nextCell = current.checkNeighbors();
		if (nextCell)
		{
			nextCell.visited=true;
			//Step 2
			stack.push(current);
			//Step 3
			removeWalls(current, nextCell);
			//Step 4
			current = nextCell;
		}
		else if(stack.length > 0)
		{
			var cell = stack.pop();
			current = cell;
		}

		else if(stack.length == 0)
		{
			var finalCell = stack.pop();
			current = finalCell;
			highlightEveryFourthCell();
			currState = state.Drawing_Complete_State;
		}
	}

	if(currState === state.Drawing_Complete_State)			//unos u pozicija u labirint
	{
		//frameRate(5);
		currState = state.Selection_Of_Starting_Position_Substate;
		console.log("Current State after switch: " + currState);
		if(currState === state.Selection_Of_Starting_Position_Substate)
		{
			selectStartingPosition();
			console.log("Current state is " + currState);
		}
	}

	if(currState === state.Selection_Of_Positions_Complete_State)
	{
		checkBox1.show();

		noLoop();

		checkBox1.changed(randomizedSearchEnabler);
	}

	if(currState === state.Randomized_Search_State)
	{
		//frameRate(1);
		console.log("Current state is Random search state");
		if(searchingBlock != endingBlock)
		{
			searchingBlock.searchedThrough = true;
			nextCellInTheSearch = searchingBlock.checkWalls();
			if(nextCellInTheSearch)
			{
				route.push(searchingBlock);

				searchingBlock = nextCellInTheSearch;
				searchingBlock.highlightSearch(COLOUR_SEARCH_ROUTE);
			}

			else if(route.length > 0)
			{
				deadEnd.push(searchingBlock);
				searchingBlock.highlightSearch(COLOUR_SEARCH_WRONG_ROUTE);
				var deadEndCell = route.pop();
				searchingBlock = deadEndCell;
			}

			else												//zbog nacina na koji je labirint graden, ovaj uvjet se nikada nece moci ispuniti, jer zahtijeva nemogucnost pristupa nekoj celiji
			{
				console.log("There is no exit")
				noLoop();
			}
		}
		else
		{
			pEndingText = createP("End is found");
			pEndingText.id("pEndingText");
			
			console.log("Naden Kraj")
			noLoop();
		}
	}
}

function showSearchRoute() 
{  
  for (var i = 0; i < route.length; ++i) 
  {
    route[i].highlightSearch(COLOUR_SEARCH_ROUTE);
    console.log("route colouring has been called")
  }

  for (var i = 0; i < deadEnd.length; ++i) 
  {
  	console.log("deadEnd colouring has been called")
    deadEnd[i].highlightSearch(COLOUR_SEARCH_WRONG_ROUTE);
  }
}

function highlightEveryFourthCell()
{
	for(var i = 0; i<grid.length; i+=4)
	{
		grid[i].highlightFourth();
	}
}

function randomizedSearchEnabler()
{
	currState = state.Randomized_Search_State;
	removeElements();
	loop();
}

function selectStartingPosition()
{
	pStartingText.hide();
	pConfirmText.hide();

	textX.show();
	textY.show();

	pSelectingStartPosition.show();
	textBoxSX.show();
	textBoxSY.show();
	buttonS.show();

	buttonS.mousePressed(cellSelection);
}

function selectEndingPosition()
{
	pSelectingEndPosition.show();
	textBoxEX.show();
	textBoxEY.show();
	buttonE.show();

	buttonE.mousePressed(cellSelection);
}

function cellSelection()
{
	var indexOfCell;
	if(currState === state.Selection_Of_Starting_Position_Substate)
	{
		if(textBoxSX.value() <= row && textBoxSY.value() <= row)
		{
			xCoor = int(textBoxSX.value());
			xCoor = xCoor - 1;

			if(xCoor % 1 === 0)
			{
				console.log("xCoor is a number");
			}

			yCoor = int(textBoxSY.value());
			yCoor = yCoor - 1;

			console.log("yCoor = " + yCoor);
			console.log("textBoxSY = " + textBoxSY.value());

			if(yCoor % 1 === 0)
			{
				console.log("yCoor is a number");
			}
			
			if(col % 1 === 0)
			{
				console.log("col is a number");
			}

			indexOfCell = floor(yCoor*col);

			for(var i = 0; i<xCoor; i++)
			{
				indexOfCell++;
			}

			int(indexOfCell);

			if(indexOfCell <= grid.length)
			{
				grid[indexOfCell].startingPointSelection();
				searchingBlock = grid[indexOfCell];
				currState = state.Selection_Of_Ending_Position_Substate;

				pSelectingStartPosition.hide();
				textBoxSX.hide();
				textBoxSY.hide();
				buttonS.hide();	
				selectEndingPosition();	

				return;
			}
		}
		
	}

	if(currState === state.Selection_Of_Ending_Position_Substate)
	{
		if(textBoxEX.value() <= row && textBoxEY.value() <= row)
		{
			xCoor = int(textBoxEX.value());
			xCoor = xCoor - 1;

			console.log("xCoor = " + xCoor);
			console.log("textBoxSX = " + textBoxEX.value());

			if(xCoor % 1 === 0)
			{
				console.log("xCoor is a number");
			}

			yCoor = int(textBoxEY.value());
			yCoor = yCoor - 1;

			if(yCoor % 1 === 0)
			{
				console.log("yCoor is a number");
			}
			
			if(col % 1 === 0)
			{
				console.log("col is a number");
			}

			indexOfCell = floor(yCoor*col);

			for(var i = 0; i<xCoor; i++)
			{
				indexOfCell++;
			}

			int(indexOfCell);

			if(indexOfCell <= grid.length)
			{
				grid[indexOfCell].endingPointSelection();
				endingBlock = grid[indexOfCell];
				travelingImpulseCurrentCell = grid[indexOfCell];
				currState = state.Selection_Of_Positions_Complete_State;

				pSelectingEndPosition.hide();
				textBoxEX.hide();
				textBoxEY.hide();
				buttonE.hide();	

				textX.hide();
				textY.hide();

				return;
			}
		}
	}
}

function LoggingEvent1()
{
	console.log("checkBox1 has been checked");
}

function index(i,j) //indexiranje celije u nizu
{
	if (i<0 || j<0 || i>col-1 || j>row-1)
	{
		return -1;
	}
	return i+j*col;
}

function removeWalls(a, b) //unistavanje zidova izmedu celija
{
	var x = a.i - b.i;

	if(x==1)
	{
		a.walls[3] = false;
		b.walls[1] = false;
	}
	else if (x==-1)
	{
		a.walls[1] = false;
		b.walls[3] = false;
	}
	var y = a.j - b.j;
	if(y==1)
	{
		a.walls[0] = false;
		b.walls[2] = false;
	}
	else if (y==-1)
	{
		a.walls[2] = false;
		b.walls[0] = false;
	}
}