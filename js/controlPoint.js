function ifOnPath(path, coord) {  
    let onPath = path.filter(point => {
        if (Math.sqrt(Math.pow(coord[0] - point[0], 2) + Math.pow(coord[1] - point[1], 2)) <= 30) {
            return point;
        }
    }, this);
    return onPath[0];
} 

function drawControlPt(controlPointArray, centerPt, width, height) {
    controlPointArray.push([centerPt[0], centerPt[1]]);
    controlPointArray.push([centerPt[0], centerPt[1] + height / 2]);
    controlPointArray.push([centerPt[0], centerPt[1] + height]);
    controlPointArray.push([centerPt[0] + width / 2, centerPt[1]]);
    controlPointArray.push([centerPt[0] + width / 2, centerPt[1] + height]);
    controlPointArray.push([centerPt[0] + width, centerPt[1]]);
    controlPointArray.push([centerPt[0] + width, centerPt[1] + height / 2]);
    controlPointArray.push([centerPt[0] + width, centerPt[1] + height]);
    controlPointArray.forEach(controlPt => {
    drawCircle(contextDraft, controlPt);
    });
}

function drawCircle(context, coord) {
    context.fillStyle = '#333';
    context.beginPath();
    context.arc(coord[0], coord[1], 10, 0, 2 * Math.PI);
    context.fill();
    contextDraft.fillStyle = '#' + document.getElementById('color_value').value;
}