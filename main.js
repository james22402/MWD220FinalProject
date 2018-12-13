var camera, scene, renderer, mesh, controls, gamesAndViewersDict={}, sum = 0, emptyWidth = 1500, emptyHeight = 1000, totalWidth = 1500, totalHeight = 1000, blpx=-totalWidth/2, blpy=-totalHeight/2, trpx=totalWidth/2, trpy=totalHeight/2, items;

function init() {
    camera = new THREE.PerspectiveCamera(120, window.innerWidth/window.innerHeight,1,100000 );
    camera.position.set(0,0,800);
    scene = new THREE.Scene();
    //var texture = new THREE.TextureLoader().load( 'textures/anderson.jpg' );

    /* add some lights*/
    var light = new THREE.PointLight(0xffffff,1,0);
    light.position.set(0,900,0);
    scene.add(light);

    //Draw the Unused Space
    var BigBoymesh = drawBox(emptyWidth, emptyHeight, 1, 0xffffff);
    BigBoymesh.position.set(0, 0, 0);
    scene.add(BigBoymesh);

    //Load data
    data();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    controls = new THREE.OrbitControls( camera );
    controls.target.set(0,0,0);
    controls.update();
    window.addEventListener( 'resize', onWindowResize, false );
    renderer.render( scene, camera );
}

function drawBox(x, y, z, boxColor) {
    var geometry = new THREE.BoxGeometry( x, y, z );
    var material = new THREE.MeshBasicMaterial( {color: boxColor} );
    mesh = new THREE.Mesh( geometry, material );
    return mesh;
}

function data() {
    d3.json("data.json").then(function(data) {
        for(var gameKey in data)
        {
            var game = data[gameKey].name;
            var viewers = +data[gameKey].value;
            if(game in gamesAndViewersDict){
                gamesAndViewersDict[game] += viewers;
                sum += viewers;
            }
            else {
                gamesAndViewersDict[game] = viewers;
                sum += viewers;
            }
        }

        items = Object.keys(gamesAndViewersDict).map(function(key) {
            return [key, gamesAndViewersDict[key]];
        });

        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        console.log(items);
        var colors = [0xe6194b, 0x3cb44b, 0xffe119, 0x4363d8, 0xf58231, 0x911eb4, 0x46f0f0, 0xf032e6, 0xbcf60c, 0xfabebe, 0x008080, 0xe6beff, 0x9a6324, 0xfffac8, 0x800000, 0xaaffc3, 0x808000, 0xffd8b1, 0x000075, 0x808080];
        createTreeMap(0, true, emptyWidth, emptyHeight, trpx, trpy, blpx, blpy, colors, sum);
    });
}

function createTreeMap(numGame, X, emptyW, emptyH, TRPX, TRPY, BLPX, BLPY, COLOR, realSum)
{
    if (numGame === 0) {
        var boxWidth = (items[numGame][1] / realSum) * emptyW;
        var realerSum = realSum - items[numGame][1];
        mesh = drawBox(boxWidth, emptyH, 10*(items.length-numGame), COLOR[numGame]);
        mesh.position.set(TRPX - boxWidth / 2, 0, 10*(19-numGame)/2);
        scene.add(mesh);
        renderer.render( scene, camera );
        createTreeMap(++numGame, false, emptyW - boxWidth, emptyH, TRPX - boxWidth, TRPY, BLPX, BLPY, COLOR, realerSum);
    }
    else if (!X && numGame !== 18) {
        var boxHeight = (items[numGame][1] / realSum) * emptyH;
        realerSum = realSum - items[numGame][1];
        mesh = drawBox(emptyW, boxHeight, 10*(items.length-numGame), COLOR[numGame]);
        mesh.position.set(BLPX + (emptyW / 2), BLPY + (boxHeight / 2), 10*(19-numGame)/2);
        scene.add(mesh);
        renderer.render( scene, camera );
        createTreeMap(++numGame, true, emptyW, emptyH - boxHeight, TRPX, TRPY, BLPX, BLPY + boxHeight, COLOR, realerSum);
    }
    else if (X && numGame !== 18) {
        boxWidth = (items[numGame][1] / realSum) * emptyW;
        realerSum = realSum - items[numGame][1];
        mesh = drawBox(boxWidth, emptyH, 10*(items.length-numGame), COLOR[numGame]);
        mesh.position.set(TRPX - boxWidth / 2, TRPY - emptyH / 2, 10*(19-numGame)/2);
        scene.add(mesh);
        renderer.render( scene, camera );
        createTreeMap(++numGame, false, emptyW - boxWidth, emptyH, TRPX - boxWidth, TRPY, BLPX, BLPY, COLOR, realerSum);
    }
    else {
        boxWidth = (items[numGame][1] / realSum) * emptyW;
        realerSum = realSum - items[numGame][1];
        mesh = drawBox(boxWidth, emptyH, 10*(items.length-numGame), COLOR[numGame]);
        mesh.position.set(TRPX - boxWidth / 2, TRPY - emptyH / 2, 10*(19-numGame)/2);
        scene.add(mesh);
        renderer.render( scene, camera );
        return true;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
}

function animate() {
    requestAnimationFrame( animate );
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render( scene, camera );
}

init();
animate();
