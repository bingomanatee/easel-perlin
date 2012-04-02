This is a library that I use to create a custom version of Perlin noise. The browsable version of the code can be
used to tweak your settings.

## PerlinSet(h, w, octaves, opacity_base)

PerlinSet is an extension of the Bitmap class; it uses a compound set of PerlinLayers to produce the classic
Perlin cloudy noise.

The two key fields for "tuning" your noise:

octaves - the number of PerlinLayer s added. Each layer is a "larger" blurrier input to the total noise.
opacity base - influences the amount of influence that each successive layer has on the total output. It should range
from 1 ... 3. at 1, the lower, granier layers have more influence. At 3, the larger, blurrier layers
have greater influence.