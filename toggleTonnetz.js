// toggleTonnetz.js
import { drawLattice } from './lattice.js';
import { getSettings, setTonnetzMode } from './script.js';

// Event listener for the Tonnetz toggle checkbox
document.getElementById('tonnetzToggle').addEventListener('change', function() {
    setTonnetzMode(this.checked);
    drawLattice(getSettings()); // Redraw the lattice when toggled
});