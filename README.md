# DontPushMe

[Don't Push Me](http://christophervh.github.io/DontPushMe/) is an object-oriented javascript game built using html5 and canvas.

# How do I play?

Blocks of ice will start falling from the sky, don't panic. Simply use the arrow keys to navigate your way around the stacking ice and make sure not to get pushed to the bottom or squished between any two blocks of ice.


# But How?

#### Component

All elements of the game inherit from one component class, from which each piece gets its collision logic, values such as directional speed, directions on how a piece should be rendered, and a piece's width and height.

#### Collisions

Collisions are determined by the amount of perceivable overlap between two objects, which is calculated dynamically using two different object's speeds.

When two of the ice blocks collide they simply stack, this is done by setting the speed of the top object equal to the speed of the bottom object on collision.

However, when our penguin hits an ice block, it gets pushed, this was pretty complex for corner cases (as these elements are all rendered as rectangles) therefore I had to implement  corner crash logic where the penguin would wrap to one side based on the amount of x,y overlap on a corner collision (IE if the penguin collided with the bottom right corner and had a greater x overlap and a smaller y overlap it would rap to the bottom).
On a penguin - obstacle collision I also had to push the penguin back, this was done by through the disabling of an input so the user can no longer move in said direction and a constant calculation of how far the penguin should be pushed based upon the obstacle's speed.

#### Progression

As the game has rendered more frames, certain attributes for each component are incremented. The amount of blocks rendered per cycle is increased by one every 400 frames, the maximum speed a falling block is capable of receiving is incremented every 600 frames, and the movement speed of the penguin is incremented by one every 900 frames. This coupled with the randomness of the falling blocks allows for a new and exciting game upon reset.

#### Update Game

The update game method handles processing keystrokes to allow the player to move,game over constraints, and the re-rendering all components to their new positions.
