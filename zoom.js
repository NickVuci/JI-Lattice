// Initialize zoom factor as a global variable
window.zoomFactor = 1;

// Zoom in/out with buttons
document.getElementById('zoomIn').addEventListener('click', function() {
    zoomIn();
});

document.getElementById('zoomOut').addEventListener('click', function() {
    zoomOut();
});

// Zoom in/out with mouse scroll
canvas.addEventListener('wheel', function(event) {
    if (event.deltaY < 0) {
        zoomIn();
    } else {
        zoomOut();
    }
    event.preventDefault(); // Prevent page from scrolling
});

// Zoom in function
function zoomIn() {
    window.zoomFactor *= 1.1; // Increase zoom by 10%
    drawLattice(); // Redraw the lattice with updated zoom
}

// Zoom out function
function zoomOut() {
    window.zoomFactor /= 1.1; // Decrease zoom by 10%
    drawLattice(); // Redraw the lattice with updated zoom
}
