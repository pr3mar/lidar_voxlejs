# lidar_voxeljs
### An attempt to visualize lidar data w/ voxeljs
___
## How to run the demo?
1. clone the repository `git clone https://github.com/pr3mar/lidar_voxlejs`
2. open `index.html` in the browser
3. enjoy

or

visit this [link](pr3mar.github.io/lidar_voxlejs)

***

## How to continue development?

1. clone the repository `git clone https://github.com/pr3mar/lidar_voxlejs`
2. run `npm install`
3. install global dependencies browserify and nodejs
4. whenever you change `index.js` run the following line of code:
```browserify -t brfs index.js > bundle.js```
5. run `npm start`
6. a `.las` file is also required, which can be downloaded [here](http://gis.arso.gov.si/evode/profile.aspx?id=atlas_voda_Lidar@Arso)
(Prenos podatkov GKOT (D96TM))