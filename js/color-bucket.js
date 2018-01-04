class ColorBucket extends PaintFunction {
    constructor(canvasReal, contextReal) {
        super();
        this.context = contextReal;
        this.canvas = canvasReal;
        this.imgDataArray = contextReal.getImageData(0, 0, canvasReal.width, canvasReal.height);
        let oldR, oldG, oldB, OldA;
    }
    
    onMouseDown(coord, event) {
        let pixelStack = [coord];
        let pixelStart = (coord[1] * this.canvas.width + coord[0] ) * 4;
        let x,y;
        // this.context.fillStyle = '#345678';
        let hex = this.context.fillStyle;
        let fillR = parseInt(hex.slice(1, 3), 16);
        let fillG = parseInt(hex.slice(3, 5), 16);
        let fillB = parseInt(hex.slice(5, 7), 16);
        
        // console.log(hex);
        // console.log(fillR);
        // console.log(fillG);
        this.oldR = this.imgDataArray.data[pixelStart];
        this.oldG = this.imgDataArray.data[pixelStart + 1];
        this.oldB = this.imgDataArray.data[pixelStart + 2];
        this.oldAlpha = this.imgDataArray.data[pixelStart +3];

        // console.log(this.oldR);
        // console.log(this.oldG);
        // console.log(this.oldB);

        if (!(this.oldR == fillR && this.oldG == fillG && this.oldB == fillB)) {
            while(pixelStack.length) {
                let newPixel = pixelStack.pop();
                x = newPixel[0];
                y = newPixel[1];
                let pixelPos = (y * this.canvas.width + x) * 4;
                
                while (y >= 0 && this.matchStartColor(pixelPos)) {
                    pixelPos -= this.canvas.width * 4;
                    y--;
                }
    
                pixelPos += this.canvas.width * 4;
                ++y;
                let leftDone = false;
                let rightDone = false;
                
                while (y <= this.canvas.height-1 && this.matchStartColor(pixelPos)) {
                    this.colorPixel(pixelPos, fillR, fillG, fillB);
    
                    if (x > 0) {
                        if (this.matchStartColor(pixelPos - 4)){
                            if (!leftDone) {
                                pixelStack.push([x-1, y]);
                                leftDone = true;
                            }
                        }else if (leftDone) {
                            leftDone = false;
                        }
                    }
    
                    if (x <= this.canvas.width - 1) {
                        if (this.matchStartColor(pixelPos + 4)) {
                            if (!rightDone) {
                                pixelStack.push([x + 1, y]);
                                rightDone = true;
                            }
                        } else if (rightDone) {
                            rightDone = false;
                        }
                    }
                    y++;
                    pixelPos += this.canvas.width * 4;
    
                }
            }

        }
        this.context.putImageData(this.imgDataArray, 0, 0);
        
    }

    matchStartColor(pos) { 
        let NewR = this.imgDataArray.data[pos];
        let NewG = this.imgDataArray.data[pos+1];
        let NewB = this.imgDataArray.data[pos+2];
        return (NewR == this.oldR && NewG == this.oldG && NewB == this.oldB);       
    }

   colorPixel(pos,colorR, colorG, colorB) {
        this.imgDataArray.data[pos] = colorR;
        this.imgDataArray.data[pos+1] = colorG;
        this.imgDataArray.data[pos+2] = colorB;
        this.imgDataArray.data[pos+3] = 255;
    }

    

    onDragging() { }
    onMouseMove() { }
    onMouseUp() {}
    onMouseLeave() { }
    onMouseEnter() { }
}