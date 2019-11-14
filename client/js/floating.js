const nearDist = 0.1;
const farDist = 4000;
const card = 12;

var container;
var cam, scene, raycaster, renderer;
var thingieTransform;

var radius = 100, theta = 0;

init();
animate();

function init() {

  scene = new THREE.Scene();
  cam = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, nearDist, farDist );
  cam.position.x = farDist * -2;
  cam.position.z = farDist / 10;

  renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild(renderer.domElement);

  window.addEventListener( 'resize', onWindowResize, false );

  //CREATE GEOMETRIES
  const cubeSize = 120;
  const glob = new THREE.SphereBufferGeometry(cubeSize, cubeSize/3, cubeSize/3);
  const field = new THREE.PlaneBufferGeometry(cubeSize*2, cubeSize*2);

  //CREATE THINGIES
  const skinFiles = [];
  const skinPaths = [
    'http://3e-pr0cess-s33dbank.com/thingies/claybowl.png',
    'http://3e-pr0cess-s33dbank.com/thingies/beblm.png',
    'http://3e-pr0cess-s33dbank.com/thingies/sponges.png',
    'http://3e-pr0cess-s33dbank.com/thingies/wiggli.png',
    'http://3e-pr0cess-s33dbank.com/thingies/thingyyyypurpllle.png',
    'http://3e-pr0cess-s33dbank.com/thingies/grog.png',
    'http://3e-pr0cess-s33dbank.com/thingies/compost.png',
    'http://3e-pr0cess-s33dbank.com/thingies/cephskin.png',
    'http://3e-pr0cess-s33dbank.com/thingies/chairshark.png'
  ];
  const skins = [];
  for(i=0; i<skinPaths.length; i++){
    skinFiles[i] = new THREE.TextureLoader();
    skins[i] = new THREE.MeshBasicMaterial({ map: skinFiles[i].load(skinPaths[i]), transparent: true });
  }
  thingieTransform = new THREE.Object3D();

  for ( var i = 0; i < (card*3); i ++ ) {
    var object;
    var chooseSkin;
    if(Math.random()<0.5){
      chooseSkin = skins[Math.floor(Math.random()*skins.length)];
      object = new THREE.Mesh(glob, chooseSkin );
    } else {
      chooseSkin = skins[Math.floor(Math.random()*skins.length)];
      object = new THREE.Mesh(field, chooseSkin );
    }
    const dist = farDist / 4;
    const distDouble = dist * 2;
    const tau = 2 * Math.PI;
    const size = (2.5*Math.random()) + 0.5;

    object.position.x = Math.random() * distDouble - dist;
    object.position.y = Math.random() * distDouble - dist;
    object.position.z = Math.random() * distDouble - dist;
    object.rotation.x = Math.random() * tau;
    object.rotation.y = Math.random() * tau;
    object.rotation.z = Math.random() * tau;
    object.scale.x = size;
    object.scale.y = size;
    object.scale.z = size;

    thingieTransform.add( object );
  }
  scene.add( thingieTransform );
}

function onWindowResize() {
  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {

  cam.lookAt( scene.position );
  cam.updateMatrixWorld();

  for(var i=0; i<card; i++) {
    thingieTransform.children[i].rotation.y = 2*Math.PI*Math.sin( THREE.Math.degToRad( theta ));
    thingieTransform.children[i+card].rotation.y = 2*Math.PI*Math.sin( THREE.Math.degToRad( 90 + theta ));
    thingieTransform.children[i+(card*2)].rotation.y = 2*Math.PI*Math.sin( THREE.Math.degToRad( 180 + theta ));

    thingieTransform.children[i].position.x = THREE.Math.euclideanModulo(thingieTransform.children[i].position.x + 3, farDist/2);
    thingieTransform.children[i+card].position.y = THREE.Math.euclideanModulo(thingieTransform.children[i+card].position.y + 5, farDist/2);
    thingieTransform.children[i+(card*2)].position.z = THREE.Math.euclideanModulo(thingieTransform.children[i+(card*2)].position.z + 2, farDist/2);
  }

  theta += 0.1;

  renderer.render( scene, cam );
}
