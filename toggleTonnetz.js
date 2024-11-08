// Variable to track Tonnetz mode
let isTonnetzMode = false;

// Event listener for the Tonnetz toggle checkbox
document.getElementById('tonnetzToggle').addEventListener('change', function() {
    isTonnetzMode = this.checked;
    drawLattice(); // Redraw the lattice when toggled
});
