// Initialize zoom factor as a global variable
window.zoomFactor = 1;

// Zoom in/out functions centered on 1/1 (canvas center)
function zoomIn() {
    window.zoomFactor *= 1.1; // Increase zoom by 10%
    drawLattice(); // Redraw the lattice with updated zoom
}

function zoomOut() {
    window.zoomFactor /= 1.1; // Decrease zoom by 10%
    drawLattice(); // Redraw the lattice with updated zoom
}

// Event listeners for zooming with buttons
document.getElementById('zoomIn').addEventListener('click', zoomIn);
document.getElementById('zoomOut').addEventListener('click', zoomOut);

// Zoom in/out with mouse scroll, centered on 1/1
canvas.addEventListener('wheel', function(event) {
    if (event.deltaY < 0) {
        zoomIn(); // Scroll up, zoom in
    } else {
        zoomOut(); // Scroll down, zoom out
    }
    event.preventDefault(); // Prevent page from scrolling
});
