# Tikiguy Adventures
This is a 2D Metroidvania game, focused on the main character, "Tikiguy".

## Storyline
In the sprawling Aztec village of "Aztec" (creatively titled), a tragedy has occurred. Aliens have invaded the landscape and have taken over. The master of the alien tribe has established himself the cruel new king of Aztec. The master of the alien tribe has established several generals in his superterrestrial domain, and has set them each over an Aztec pyramid. The master alien himself gains power from each of CRSTLS in the pyramids, and thus cannot be defeated until each of his generals have been defeated and the CRSTLS captured. Unfortunately, the whole Aztec tribe has been captured, except for one member, Tikiguy. It is up to Tikiguy to defeat the generals and the master alien before it is too late. Armed with merely a blowpipe and his ingenius, unperturbed spirit, he must conquer the aliens and restore peace to the Aztec village.

## Game Mechanics
Quick facts:

1. 2D Metroidvania game, focused on different "areas". Some areas are unreachable until other areas have been completed.
2. The player's main weapon is a blowpipe that fires darts (the darts are slightly affected by gravity)
3. There are several power-ups available to the player throughout the game.
4. The general graphic theme of the game is focused on a jungle-pyramid-dusty-lush idea, although there are other regions, such as "Volcan", a place of lava and dark rock.

## Development
Quick facts:

1. Runs in the browser
2. React + Vite + CSS Modules framework
3. Progress is stored client-side
4. The actual game is played on an HTML5 canvas
5. Python Flask server (only for game creators, to be able to create areas in the browser and save them to the filesystem).

## Values
This is extremely important.

1. **MODULAR**: The entire code base is to be extremely modular. If the code is not modular, things will most assuredly go wrong. Since we are constantly adding to and editing this game, if it is not modular, we will not be able to trade out and add functionalities with ease, instantly making our development suffer. The code must err on the side of too modular. If a file has more than 300 lines of code, there may be a problem.
2. **CODE ETIQUETTE**: The code must be readable. There will be no spaghetti code. There will be no confusing code. All code is to be easily readable and editable.
3. **FUTURE-PROOF**: The game development will start off extremely simple and rudimentary. Let that fool no one --- the game must be developed to be future-proof. It may start of small, but the start we build is the FOUNDATION for the entire rest of the game. It must be seamless and scalable.

## Front-End
There are two front-end interaction points.

1. **CREATOR DEV**: This is where the game creators go. Game creators choose from blocks in the UI, and place them to create and save new areas.
    - Asset upload portal: To upload assets into the game and give them hitboxes and properties.
    - Area creator portal: The larger portal for assembling assets into a playable arena.
2. **GAME**: The actual game portal where the players play.

## Explanation Files
Within each folder that requires one, an `explanation.md` file is to be made, explaining the functionality of the code files in the folder. These explanation files are to be kept up-to-date.
