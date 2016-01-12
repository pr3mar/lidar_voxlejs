# lidar_voxeljs
### An attempt to visualize lidar data w/ voxeljs
___
## How to run the demo?
visit this [link](https://pr3mar.github.io/lidar_voxlejs/) **highly recommended**

or

1. clone the repository `git clone https://github.com/pr3mar/lidar_voxlejs.git`
2. open `index.html` in the browser
3. enjoy

***

## How to continue development?

1. clone the repository `git clone https://github.com/pr3mar/lidar_voxlejs.git`
2. run `npm install`
3. install global dependencies browserify and nodejs
4. whenever you change `index.js` run the following line of code:
```browserify -t brfs index.js > bundle.js```
5. run `npm start`
6. open `localhost:8080` in your browser (Chrome is recommended)
7. `wrapper.js` is the main script file which makes calls to every major file (`readLAS.js` and `discretize.js`), which generate the terrain file in the ./terrain subfolder
8. a `.las` file is also required, which can be downloaded [here](http://gis.arso.gov.si/evode/profile.aspx?id=atlas_voda_Lidar@Arso)
(Prenos podatkov GKOT (D96TM))