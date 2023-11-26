function FourInARow() {
}

FourInARow.prototype.newBoard = function () {
    var colsArray = [null,null,null,null,null,null,null,null,null];

    var board = [
                  { index: 0, cols: colsArray }, { index: 1, cols: colsArray }, { index: 2, cols: colsArray }
                  , { index: 3, cols: colsArray },
                  { index: 4, cols: colsArray }, { index: 5, cols: colsArray }, { index: 6, cols: colsArray },
                  { index: 7, cols: colsArray }, { index: 8, cols: colsArray }
    ];

    return (board);
}

FourInARow.prototype.checkItemsFree = function (dashboard) {
    for (var row = 0; row <= (dashboard.length - 1) ; row++) {
        for (var col = 0; col <= (dashboard[row].cols.length - 1) ; col++) {
            if (dashboard[row].cols[col] == null) {
                return (true);
            }
        }
    }

    return (false);
}

FourInARow.prototype.getLastRowFree = function (dashboard, column) {
    var lastRowFree = -1;

    for (var i = 0; i <= (dashboard.length - 1) ; i++) {
        if (dashboard[i].cols[column] == null) {
            lastRowFree = i;
        }
    }

    return (lastRowFree);
}


FourInARow.prototype.nextComputerThrow = function (dashboard) {
    //check winner throw
    var threeInRow = false;
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        rowFree = this.getLastRowFree(dashboard, col);
        if (rowFree != -1) {
            //match if it's a wineer throw: check if there are three in a row: column, left, or right
            threeInRow = (Math.max(this.getNumberInColumn(dashboard, col, rowFree+1, "X"), this.getNumberOnRight(dashboard, col, rowFree, "X"), this.getNumberOnLeft(dashboard, col, rowFree, "X")) >= 3);
            if (threeInRow) {
                return (col);
            };
        }
    }

    var randNumber = (Math.floor(Math.random() * 10));

    //check to no lose

    //defende column: If (randNumber>1) ==> 90% of times (10-1)
    if (randNumber > 1) {
        for (var col = 0; col <= (dashboard.length - 1) ; col++) {
            rowFree = this.getLastRowFree(dashboard, col);
            if (rowFree != -1) {
                //defende column
                var numInColumn = this.getNumberInColumn(dashboard, col, rowFree + 1, "O");
                if (numInColumn >= 3) {
                    //console.log("defensa column");
                    return (col);
                }
            }
        }
    }

    //defende hollow in row: If (randNumber>2) ==> 80% of times
    if (randNumber > 2) { 
        for (var col = 0; col <= (dashboard.length - 1) ; col++) {
            rowFree = this.getLastRowFree(dashboard, col);
            if (rowFree != -1) {
                if (this.isAHollowInRow(dashboard, col, rowFree, "O")) { return (col) };
            }
        }
    }


    //defende diagonal
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        rowFree = this.getLastRowFree(dashboard, col);
        if (rowFree != -1) {
            if (this.getNumberInDiagonalUpRight(dashboard, col, rowFree, "O") >= 3) { return (col) };
            if (this.getNumberInDiagonalDownRight(dashboard, col, rowFree, "O") >= 3) { return (col) };
            if (this.getNumberInDiagonalUpLeft(dashboard, col, rowFree, "O") >= 3) { return (col) };
            if (this.getNumberInDiagonalDownLeft(dashboard, col, rowFree, "O") >= 3) { return (col) };
			
			if (this.getNumberInDiagonalUpRight(dashboard, col, rowFree, "O")>=1 && this.getNumberInDiagonalDownLeft(dashboard, col, rowFree, "O")>=1){
				return (col);
			}
			
			if (this.getNumberInDiagonalUpLeft(dashboard, col, rowFree, "O")>=1 && this.getNumberInDiagonalDownRight(dashboard, col, rowFree, "O")>=1){
				return (col);
			}
        }
    }

    //defende row
    for (var col = 0; col <= (dashboard.length - 1) ; col++) {
        rowFree = this.getLastRowFree(dashboard, col);
        if (rowFree != -1) {
            //defense row
            var numOnRight = this.getNumberOnRight(dashboard, col, rowFree, "O");
            if (numOnRight >= 2) {
                if (numOnRight == 2 && randNumber > 4) return (col);
                if (numOnRight == 3 && randNumber > 1) return (col);

            }

            var numOnLeft = this.getNumberOnLeft(dashboard, col, rowFree, "O");
            if (numOnLeft >= 2) {
                //console.log("defensa row left");
                return (col);
            }
        }
    }

    //console.log("attack");

    //match better throw
    var betterCol = -1;
	
	if (randNumber > 3) { 
		var bestInRow = 0;
		var numInRow = 0;
		var bestInRow = 0;
		for (var col = 0; col <= (dashboard.length - 1) ; col++) {
			rowFree = this.getLastRowFree(dashboard, col);
			if (rowFree != -1) {
				//match better column
				numInRow = Math.max(this.getNumberInColumn(dashboard, col, rowFree+1, "X"), this.getNumberOnRight(dashboard, col, rowFree, "X"));
				if (numInRow >= 1 && numInRow > bestInRow) {
					betterCol = col;
					bestInRow = numInRow;
				};
			}
		}
	}

    return (betterCol >= 0 ? betterCol : (Math.floor(Math.random() * (dashboard.length - 1))));
}

FourInARow.prototype.getNumberInColumn = function (dashboard, col, row, ficha) {
    var numInColumn = 0;

    for (var rowOffset = Math.min(row+3,dashboard.length-1); rowOffset>=row; rowOffset--) {
        if (dashboard[rowOffset].cols[col] == ficha) {
            numInColumn += 1;
        } else {
            if (dashboard[rowOffset].cols[col] != ficha) {
                numInColumn = 0;
            }
        }
    }

    return (numInColumn);
}

FourInARow.prototype.getNumberInRow = function (dashboard, row, ficha) {
    var numInRow = 0;
    var maxNumInRow = 0;
    for (var colOffset = 0; colOffset <= (dashboard.length - 1) ; colOffset++) {
        if (dashboard[row].cols[colOffset] == ficha) {
            numInRow += 1;
        } else {
            numInRow = 0;
        }

        maxNumInRow = Math.max(maxNumInRow, numInRow);
    }

    return (maxNumInRow);
}

FourInARow.prototype.isAHollowInRow = function (dashboard, col, row, ficha) {
    if(col==0 || col==(dashboard.length-1)) return (false);
    if(dashboard[row].cols[col] == null) {
        if ((dashboard[row].cols[col-1] == ficha) && (dashboard[row].cols[col+1] == ficha)) return (true);
    }

    return (false);
}

FourInARow.prototype.getNumberOnRight = function (dashboard, col, row, ficha) {
    var numInRow = 0;
    var maxNumInRow = 0;
    for (var colOffset = col; colOffset <= Math.min(col + 3, dashboard.length - 1) ; colOffset++) {
        if (dashboard[row].cols[colOffset] == ficha) {
            numInRow += 1;
        } else {
            numInRow = 0;
        }

        maxNumInRow = Math.max(maxNumInRow, numInRow);
    }

    return (maxNumInRow);
}

FourInARow.prototype.getNumberOnLeft = function (dashboard, col, row, ficha) {
    var numInRow = 0;
    var maxNumInRow = 0;
    for (var colOffset = col; colOffset >= Math.max(col - 3, 0) ; colOffset--) {
        if (dashboard[row].cols[colOffset] == ficha) {
            numInRow += 1;
        } else {
            numInRow = 0;
        }

        maxNumInRow = Math.max(maxNumInRow, numInRow);
    }

    return (maxNumInRow);
}

FourInARow.prototype.getNumberInDiagonalUpRight = function (dashboard, col, row, ficha) {
    var numInRow = 0;
    var maxNumInRow = 0;
    for (var colOffset = col; colOffset <= Math.min(col + 3, dashboard.length - 1) ; colOffset++) {
        if (dashboard[row].cols[colOffset] == ficha) {
            numInRow += 1;
        } else {
            numInRow = 0;
        }
        maxNumInRow = Math.max(maxNumInRow, numInRow);
        row--;
        if (row < 0) return (maxNumInRow);
    }

    return (maxNumInRow);
}

FourInARow.prototype.getNumberInDiagonalDownRight = function (dashboard, col, row, ficha) {
    var numInRow = 0;
    var maxNumInRow = 0;
    for (var colOffset = col; colOffset <= Math.min(col + 3, dashboard.length - 1) ; colOffset++) {
        if (dashboard[row].cols[colOffset] == ficha) {
            numInRow += 1;
        } else {
            numInRow = 0;
        }
        maxNumInRow = Math.max(maxNumInRow, numInRow);
        row++;
        if (row >= (dashboard.length)) return (maxNumInRow);
    }

    return (maxNumInRow);
}

FourInARow.prototype.getNumberInDiagonalUpLeft = function (dashboard, col, row, ficha) {
    var numInRow = 0;
    var maxNumInRow = 0;
    for (var colOffset = col; colOffset >= Math.max(col - 3, 0) ; colOffset--) {
        if (dashboard[row].cols[colOffset] == ficha) {
            numInRow += 1;
        } else {
            numInRow = 0;
        }
        maxNumInRow = Math.max(maxNumInRow, numInRow);
        row--;
        if (row < 0) return (maxNumInRow);
    }

    return (maxNumInRow);
}

FourInARow.prototype.getNumberInDiagonalDownLeft = function (dashboard, col, row, ficha) {
    var numInRow = 0;
    var maxNumInRow = 0;
    for (var colOffset = col; colOffset >= Math.max(col - 3, 0) ; colOffset--) {
        if (dashboard[row].cols[colOffset] == ficha) {
            numInRow += 1;
        } else {
            numInRow = 0;
        }
        maxNumInRow = Math.max(maxNumInRow, numInRow);
        row++;
        if (row >= (dashboard.length)) return (maxNumInRow);
    }

    return (maxNumInRow);
}

FourInARow.prototype.checkThrowWinner = function (dashboard, col, row, ficha) {
    if (this.getNumberInColumn(dashboard, col, row, ficha) == 4) { return (true) };
    if (this.getNumberInRow(dashboard, row, ficha) >= 4) { return (true) };

    //Diagonals
    if ((this.getNumberInDiagonalUpRight(dashboard, col, row, ficha) + this.getNumberInDiagonalDownLeft(dashboard, col, row, ficha)) >= 5) { return (true) };
    if ((this.getNumberInDiagonalUpLeft(dashboard, col, row, ficha) + this.getNumberInDiagonalDownRight(dashboard, col, row, ficha)) >= 5) { return (true) };

    return (false);
}