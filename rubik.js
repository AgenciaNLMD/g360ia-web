import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import * as TWEEN from "https://unpkg.com/@tweenjs/tween.js@20.0.3/dist/tween.esm.js";

// Mount inside #cube-mount (or body fallback)
var mount = document.getElementById( 'cube-mount' ) || document.body;
function W() { return mount.clientWidth  || innerWidth; }
function H() { return mount.clientHeight || innerHeight; }

// Pre-create canvas + try to acquire a WebGL context ourselves.
// If the host (sandboxed iframe, no GPU, etc.) refuses, bail silently
// instead of letting THREE log a WebGLRenderer error.
var preCanvas = document.createElement( 'canvas' );
var preCtx = null;
try {
    preCtx = preCanvas.getContext( 'webgl2', { alpha: true, antialias: true, premultipliedAlpha: true } )
          || preCanvas.getContext( 'webgl',  { alpha: true, antialias: true, premultipliedAlpha: true } );
} catch ( e ) { preCtx = null; }

if ( !preCtx ) {
    mount.innerHTML = '<div style="width:100%;height:100%;display:grid;place-items:center;color:rgba(244,243,238,.4);font:500 11px/1.4 \'JetBrains Mono\',monospace;letter-spacing:.06em;text-align:center;">[ cubo 3D ·<br/>vista previa ]</div>';
} else {

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 30, W()/H() );
    camera.position.set( 5, 8, 25 );
    camera.lookAt( scene.position );

var renderer = new THREE.WebGLRenderer( { canvas: preCanvas, context: preCtx, antialias: true, alpha: true } );
renderer.setPixelRatio( Math.min( window.devicePixelRatio || 1, 2 ) );
renderer.setClearColor( 0x000000, 0 );
renderer.setSize( W(), H() );
renderer.setAnimationLoop( animationLoop );
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.display = 'block';
mount.appendChild( renderer.domElement );

window.addEventListener( "resize", () => {
    camera.aspect = W()/H();
    camera.updateProjectionMatrix();
    renderer.setSize( W(), H() );
});

var ambientLight = new THREE.AmbientLight( 'white', 1.2 );
    scene.add( ambientLight );
var light = new THREE.DirectionalLight( 'white', 0.7 );
    light.position.set( -3, 6, 4 );
    scene.add( light );
var light2 = new THREE.DirectionalLight( 'white', 0.3 );
    light2.position.set( 2, -2, -2 );
    scene.add( light2 );

var bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0x111111,
    shininess: 120,
    specular: new THREE.Color( 0xaabbcc ),
});

function stickerMat( hex ) {
    return new THREE.MeshPhongMaterial({
        color: new THREE.Color( hex ),
        shininess: 120,
        specular: new THREE.Color( 0xaabbcc ),
    });
}

var GOLD      = stickerMat( 0xc9a227 );
var BLUE      = stickerMat( 0x5b7ec5 );
var BLUE_DARK = stickerMat( 0x2e4a8a );
var DARK      = stickerMat( 0x1a2744 );

function isF( col, row ) {
    if ( row ===  1 ) return true;
    if ( col === -1 ) return true;
    if ( row ===  0 && col === 0 ) return true;
    return false;
}

function getFColor( col, row ) {
    if ( row === 1 && col === -1 ) return BLUE_DARK;
    if ( row === 1 && col ===  1 ) return GOLD;
    if ( isF( col, row ) ) return BLUE;
    return DARK;
}

function getFaceSticker( key, x, y, z ) {
    switch( key ) {
        case 'pz': return getFColor( x,  y );
        case 'nz': return getFColor( -x, y );
        case 'px': return getFColor( -z, y );
        case 'nx': return getFColor( z,  y );
        case 'py': return getFColor( x,  -z );
        case 'ny': return getFColor( x,  z );
    }
}

var stickerGeo = new THREE.PlaneGeometry( 0.8, 0.8 );
var faceNormals = [
    { key: 'px', norm: new THREE.Vector3(  1,  0,  0 ) },
    { key: 'nx', norm: new THREE.Vector3( -1,  0,  0 ) },
    { key: 'py', norm: new THREE.Vector3(  0,  1,  0 ) },
    { key: 'ny', norm: new THREE.Vector3(  0, -1,  0 ) },
    { key: 'pz', norm: new THREE.Vector3(  0,  0,  1 ) },
    { key: 'nz', norm: new THREE.Vector3(  0,  0, -1 ) },
];

// ── Cubo principal (siempre centrado) ────────────────────────────
var SCALE_NORMAL = 0.95;

var rubikGroup = new THREE.Group();
rubikGroup.scale.setScalar( SCALE_NORMAL );
scene.add( rubikGroup );

var cubeData = [];
for( var x=-1; x<=1; x++ )
for( var y=-1; y<=1; y++ )
for( var z=-1; z<=1; z++ )
{
    var cube = new THREE.Mesh( new RoundedBoxGeometry(), bodyMaterial );
    cube.geometry = new RoundedBoxGeometry();
    cube.geometry.translate( x, y, z );

    faceNormals.forEach( ({ key, norm }) => {
        const isOuter =
            ( key==='px' && x=== 1 ) || ( key==='nx' && x===-1 ) ||
            ( key==='py' && y=== 1 ) || ( key==='ny' && y===-1 ) ||
            ( key==='pz' && z=== 1 ) || ( key==='nz' && z===-1 );
        if ( !isOuter ) return;

        var stickerColor = getFaceSticker( key, x, y, z );
        var sticker = new THREE.Mesh( stickerGeo, stickerColor );
        sticker.position.set(
            x + norm.x * 0.51,
            y + norm.y * 0.51,
            z + norm.z * 0.51
        );
        sticker.quaternion.setFromUnitVectors(
            new THREE.Vector3( 0, 0, 1 ), norm
        );
        cube.add( sticker );
    });

    rubikGroup.add( cube );

    var spread = 1.2 + Math.random() * 0.8;
    cubeData.push({
        mesh: cube,
        dirX: x * spread + (Math.random() - 0.5) * 1.5,
        dirY: y * spread + (Math.random() - 0.5) * 1.5,
        dirZ: z * spread + (Math.random() - 0.5) * 1.5,
        rotX: (Math.random() - 0.5) * Math.PI * 3,
        rotY: (Math.random() - 0.5) * Math.PI * 3,
        rotZ: (Math.random() - 0.5) * Math.PI * 3,
    });
}

// ── Desarme/rearme ──────────────────────────────────────────────
var explodeState = { t: 0 };

function updatePositions() {
    var t = explodeState.t;
    cubeData.forEach( function( d ) {
        d.mesh.position.x = d.dirX * t;
        d.mesh.position.y = d.dirY * t;
        d.mesh.position.z = d.dirZ * t;
        d.mesh.rotation.x = d.rotX * t;
        d.mesh.rotation.y = d.rotY * t;
        d.mesh.rotation.z = d.rotZ * t;
    });
}

// ── Secuencia: shake → estallido → rearme ───────────────────────
var shakeActive     = false;
var shakeStart      = 0;
var SHAKE_INTENSITY = 0.06;
var cycleRunning    = false;

function runCycle() {
    if ( cycleRunning ) return;
    cycleRunning = true;

    setTimeout( function() {
        shakeActive = true;
        shakeStart  = performance.now();

        setTimeout( function() {
            shakeActive = false;
            rubikGroup.position.x = 0;
            rubikGroup.position.y = 0;

            new TWEEN.Tween( explodeState )
                .to( { t: 1 }, 1000 )
                .easing( TWEEN.Easing.Cubic.Out )
                .onUpdate( updatePositions )
                .onComplete( function() {
                    new TWEEN.Tween( explodeState )
                        .to( { t: 0 }, 1000 )
                        .easing( TWEEN.Easing.Cubic.InOut )
                        .onUpdate( updatePositions )
                        .onComplete( function() {
                            cycleRunning = false;
                            setTimeout( runCycle, 5000 );
                        })
                        .start();
                })
                .start();

        }, 1000 );

    }, 2000 );
}

runCycle();

// ── Loop principal ──────────────────────────────────────────────
var angle = 0;

function animationLoop( t ) {
    TWEEN.update( t );

    angle += 0.005;
    rubikGroup.rotation.y = angle;
    rubikGroup.rotation.x = -0.4;

    if ( shakeActive ) {
        var elapsed   = performance.now() - shakeStart;
        var intensity = Math.min( elapsed / 150, 1 ) * SHAKE_INTENSITY;
        rubikGroup.position.x = ( Math.random() * 2 - 1 ) * intensity;
        rubikGroup.position.y = ( Math.random() * 2 - 1 ) * intensity;
    }

    renderer.render( scene, camera );
}

} // end WebGL guard
