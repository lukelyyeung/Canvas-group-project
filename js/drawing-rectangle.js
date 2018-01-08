class DrawingRectangle extends PaintFunction {
    constructor(contextReal, contextDraft) {
        super();
        this.contextReal = contextReal;
        this.contextDraft = contextDraft;
        this.rectWidth = 0;
        this.rectHeight = 0;
        this.orig = 0;
        this.controlPointArray = [];
        this.onControlPt = null;
        this.resizeMode = null;
        this.doneSizing = false;
        this.canMove = false;
        this.dragOrigDiff = null;
        this.inAreaX = null;
        this.inAreaY = null;
    }

    onMouseDown(coord, event) {
        if (!this.doneSizing) {
            this.orig = coord;
        } else if (this.onControlPt == this.controlPointArray[6]) {
            this.resizeMode = 'right';
        } else if (this.onControlPt == this.controlPointArray[1]) {
            this.resizeMode = 'left';
            this.orig[0] += this.rectWidth;
        } else if (this.onControlPt == this.controlPointArray[3]) {
            this.resizeMode = 'top';
            this.orig[1] += this.rectHeight;
        } else if (this.onControlPt == this.controlPointArray[4]) {
            this.resizeMode = 'bottom';
        } else if (this.onControlPt == this.controlPointArray[0]) {
            this.resizeMode = 'top-left';
            this.orig[0] += this.rectWidth;
            this.orig[1] += this.rectHeight;
        } else if (this.onControlPt == this.controlPointArray[2]) {
            this.resizeMode = 'bottom-left';
            this.orig[0] += this.rectWidth;
        } else if (this.onControlPt == this.controlPointArray[5]) {
            this.resizeMode = 'top-right';
            this.orig[1] += this.rectHeight;
        } else if (this.onControlPt == this.controlPointArray[7]) {
            this.resizeMode = 'bottom-right';
        } else {
            this.dragOrigDiff = [coord[0] - this.orig[0], coord[1] - this.orig[1]];
            this.resizeMode = null;
            this.inAreaX = this.inArea(this.rectWidth, this.dragOrigDiff[0]);
            this.inAreaY = this.inArea(this.rectHeight, this.dragOrigDiff[1]);
            this.canMove = (this.inAreaX && this.inAreaY);
        }
    }

    onDragging(coord, event) {
        // console.log(this.onControlPt);
        // console.log(this.doneSizing);
        if (!this.doneSizing) {
            this.rectWidth = coord[0] - this.orig[0];
            this.rectHeight = coord[1] - this.orig[1];
            this.drawRect(this.contextDraft, this.orig, this.rectWidth, this. rectHeight)
        } else if (this.resizeMode === 'right' || this.resizeMode === 'left') {
            this.rectWidth = coord[0] - this.orig[0];
            this.drawRect(this.contextDraft, this.orig, this.rectWidth, this.rectHeight)
        } else if (this.resizeMode === 'top' || this.resizeMode === 'bottom') {
            this.rectHeight = coord[1] - this.orig[1];
            this.drawRect(this.contextDraft, this.orig, this.rectWidth, this.rectHeight)
        } else if (this.resizeMode === 'top-right' || this.resizeMode === 'top-left' || this.resizeMode === 'bottom-right' || this.resizeMode === 'bottom-left') {
            this.rectWidth = coord[0] - this.orig[0];
            this.rectHeight = coord[1] - this.orig[1];
            this.drawRect(this.contextDraft, this.orig, this.rectWidth, this.rectHeight)
        } else if (this.canMove) {
                    this.orig = [coord[0] - this.dragOrigDiff[0], coord[1] - this.dragOrigDiff[1]];
                    //this.controlPointArray = [];
                    this.drawRect(this.contextDraft, this.orig, this.rectWidth, this.rectHeight);
                }
    }
    
    onMouseMove(coord) { 
        if (this.controlPointArray.length !== 0) {
            this.onControlPt = ifOnPath(this.controlPointArray, coord);
        }
    }

    onMouseUp(coord) {
        if (!this.doneSizing) {
            this.doneSizing = true;
        } else if (this.canMove) {
            this.canMove = false;
            this.drawRect(this.contextDraft, this.orig, this.rectWidth, this.rectHeight);
        }
    }

    // onMouseLeave(coord) {
    //     if (this.doneSizing) {
    //         this.drawRect(this.contextReal, this.orig, this.rectWidth, this.rectHeight);
    //         this.rectWidth = 0;
    //         this.rectHeight = 0;
    //         this.controlPointArray = [];
    //         this.onControlPt = null;
    //         this.resizeMode = null;
    //         this.doneSizing = false;
    //         this.canMove = false;
    //         this.dragOrigDiff = null;
    //         this.inAreaX = null;
    //         this.inAreaY = null;
    //     }
    // }
    
    onMouseEnter() {}
    
    onKeyDown(key) {
        if (this.doneSizing && key == 13) {
            this.drawRect(this.contextReal, this.orig, this.rectWidth, this.rectHeight);
            this.rectWidth = 0;
            this.rectHeight = 0;
            this.controlPointArray = [];
            this.onControlPt = null;
            this.resizeMode = null;
            this.doneSizing = false;
            this.canMove = false;
            this.dragOrigDiff = null;
            this.inAreaX = null;
            this.inAreaY = null;
        }
    }

    drawRect(context, coord, width, height) {
        this.contextDraft.clearRect(0, 0, canvasDraft.width, canvasDraft.height);
        this.controlPointArray = [];
        context.fillRect(coord[0], coord[1], width, height);
        if (context != this.contextReal && !this.canMove) {
            drawControlPt(this.controlPointArray, this.orig, this.rectWidth, this.rectHeight);
        }
    }

    inArea(dimension, diff) {
        if (dimension > 0) {
            return (diff <= dimension && diff >= 0);
        } else {
            return (diff >= dimension && diff <= 0);
        }
    }
}