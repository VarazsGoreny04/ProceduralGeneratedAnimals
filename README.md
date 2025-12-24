# ProceduralGeneratedAnimals
This is a library that generates simple 2D procedurally generated animals in an HTML Canvas using JavaScript using the ***p5.js*** library.
The library also provides an example HTML document named ***index.html*** and an example JS file named ***simulator.js*** with 3 pre-generated animals:
- Snake
- Fish
- Lizard
The user can switch between the 3 animals using the number keys. Each key corresponds to a position in the ***animals*** array where the program stores its animals,
so it is possible to add more custom animals.<br><br>

Once the page loads, the user is presented with a frozen screen with the selected animal in the center. The user can start the animation by pressing the "**F**" key.
This will restart the program. Pressing the key repeatedly will pause and restart the animation.<br><br>

If the simulation is running, the animal will always follow the direction of the mouse, but restricted by the maximum rotation angle.
