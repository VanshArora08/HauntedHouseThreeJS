import './style.css'
import * as three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.hide();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new three.Scene()

//fog
const fog = new three.Fog("#262837", 1, 12)
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new three.TextureLoader()

//door textures
const doorAlphaMap = textureLoader.load('textures/door/alpha.jpg');
const doorColorMap = textureLoader.load('textures/door/color.jpg');
const doorHeightMap = textureLoader.load('textures/door/height.jpg');
const dooraoMap = textureLoader.load('textures/door/ambientOcclusion.jpg');
const doorMetalnessMap = textureLoader.load('textures/door/metalness.jpg');
const doorNormalMap = textureLoader.load('textures/door/normal.jpg');
const doorRoughnessMap = textureLoader.load('textures/door/roughness.jpg');

//walls textures
const wallRoughnessMap = textureLoader.load('textures/bricks/roughness.jpg');
const wallNormalMap = textureLoader.load('textures/bricks/normal.jpg');
const wallColorMap = textureLoader.load('textures/bricks/color.jpg');
const wallAoMap = textureLoader.load('textures/bricks/ambientOcclusion.jpg')

//grass textures
const grassRoughnessMap = textureLoader.load('textures/grass/roughness.jpg');
const grassNormalMap = textureLoader.load('textures/grass/normal.jpg');
const grassColorMap = textureLoader.load('textures/grass/color.jpg');
const grassAoMap = textureLoader.load('textures/grass/ambientOcclusion.jpg')

grassAoMap.repeat.set(8, 8)
grassNormalMap.repeat.set(8, 8)
grassColorMap.repeat.set(8, 8)
grassRoughnessMap.repeat.set(8, 8)

grassAoMap.wrapS = three.RepeatWrapping
grassAoMap.wrapT = three.RepeatWrapping

grassNormalMap.wrapS = three.RepeatWrapping
grassNormalMap.wrapT = three.RepeatWrapping

grassColorMap.wrapS = three.RepeatWrapping
grassColorMap.wrapT = three.RepeatWrapping

grassRoughnessMap.wrapS = three.RepeatWrapping
grassRoughnessMap.wrapT = three.RepeatWrapping




/**
 * House
 */
// house group
const house = new three.Group();
scene.add(house);
house.castShadow = true;

//walls
const walls = new three.Mesh(new three.BoxBufferGeometry(4, 2.5, 4),
    new three.MeshStandardMaterial({
        // color: '#ac8e82',
        aoMap: wallAoMap,
        map: wallColorMap,
        normalMap: wallNormalMap,
        roughnessMap: wallRoughnessMap,
    },),);
walls.geometry.setAttribute('uv2', new three.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
house.add(walls);
walls.castShadow = true;
walls.position.y = 1.25;

const roof = new three.Mesh(
    new three.ConeBufferGeometry(3.8, 1, 4),
    new three.MeshStandardMaterial({ color: "#b35f45" })
)
house.add(roof);
roof.position.y = 3;
roof.rotation.y = Math.PI / 4
roof.castShadow = true;

//door
const door = new three.Mesh(
    new three.PlaneBufferGeometry(2, 2, 64, 64),
    new three.MeshStandardMaterial({ aoMap: dooraoMap, map: doorColorMap, alphaMap: doorAlphaMap, transparent: true, metalnessMap: doorMetalnessMap, normalMap: doorNormalMap, roughnessMap: doorRoughnessMap, displacementMap: doorHeightMap, displacementScale: 0.1 })
)
door.geometry.setAttribute('uv2', new three.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
house.add(door);

door.position.x = 0;
door.position.y = 0.9;
door.position.z = 2.001;
gui.add(door.position, 'x')
gui.add(door.position, 'y')
gui.add(door.position, 'z')

const bushGeometry = new three.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new three.MeshStandardMaterial({ color: "#89c854" })

const bush1 = new three.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.45, 0.45, 0.45)
bush1.position.set(0.8, 0.2, 2.2)
house.add(bush1);
bush1.castShadow = true;

const bush2 = new three.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
house.add(bush2);
bush2.castShadow = true;

const bush3 = new three.Mesh(bushGeometry, bushMaterial);
const bush4 = new three.Mesh(bushGeometry, bushMaterial);
bush3.castShadow = true;
bush4.castShadow = true;
bush3.scale.set(0.4, 0.4, 0.4)
bush4.scale.set(0.13, 0.13, 0.13)
bush3.position.set(-0.8, 0.2, 2.2)
bush4.position.set(-1.2, 0.05, 2.2)
house.add(bush3);
house.add(bush4);

//graves
const graves = new three.Group();
scene.add(graves);
// graves.castShadow = true;

const graveGeometry = new three.BoxBufferGeometry(0.6, 0.6, 0.2)
const graveMaterial = new three.MeshStandardMaterial({ color: "#b2b6b1" })
for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6.5;
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    const grave = new three.Mesh(graveGeometry, graveMaterial)
    grave.rotation.y = (Math.random() - 0.5) * 0.3;
    grave.position.set(x, 0.3, z);
    grave.castShadow = true;
    graves.add(grave);
}


// Floor
const floor = new three.Mesh(
    new three.PlaneBufferGeometry(20, 20),
    new three.MeshStandardMaterial({
        map: grassColorMap,
        aoMap: grassAoMap,
        normalMap: grassNormalMap,
        roughnessMap: grassRoughnessMap
    })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.geometry.setAttribute('uv2', new three.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
scene.add(floor)
floor.receiveShadow = true;

/**
 * Lights
 */
//point light house
const houseLight = new three.PointLight("#ff0000", 1, 4)
scene.add(houseLight);
houseLight.position.x = 0;
houseLight.position.y = 2.5;
houseLight.position.z = 2.01;
gui.add(houseLight.position, 'x')
gui.add(houseLight.position, 'y')
gui.add(houseLight.position, 'z')


// Ambient light
const ambientLight = new three.AmbientLight('#b9d5ff', 0.09)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new three.DirectionalLight('#b9d5ff', 0.09)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)
moonLight.castShadow = true;

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -4
camera.position.y = 2
camera.position.z = 7
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new three.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor("#262837")
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;

/**
 * Ghosts
 */
const ghost1 = new three.PointLight("#ff0000", 2, 3)
scene.add(ghost1);
ghost1.castShadow = true;
const ghost2 = new three.PointLight("#ff3700", 2, 3)
scene.add(ghost2);
ghost2.castShadow = true;
const ghost3 = new three.PointLight("#00ff00", 2, 3)
scene.add(ghost3);
ghost3.castShadow = true;



/**
 * Lightning
 */
const Lightning = new three.DirectionalLight("#8587ff", 3);
scene.add(Lightning);
Lightning.position.set(-15, 10, -20)
Lightning.castShadow = true;

/**
 * Animate
 */
const clock = new three.Clock()
let ctr = 0;
let a = 10;
gui.add(camera.position, 'x')


/**
 * Shadows enhancement
 */
ghost1.shadow.camera.far = 7
ghost2.shadow.camera.far = 7
ghost3.shadow.camera.far = 7
// Lightning.shadow.camera.far = 70
// Lightning.shadow.camera.near = 1;

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // ghost1.position.set(Math.sin(elapsedTime) * 4, 0, Math.cos(elapsedTime) * 5) / 4
    const ghostAngle1 = elapsedTime / 4;
    ghost1.position.x = Math.sin(ghostAngle1) * 5;
    ghost1.position.z = Math.cos(ghostAngle1) * 5;
    ghost1.position.y = Math.cos(ghostAngle1 * 5) + Math.cos(ghostAngle1 * 3.1);
    const ghostAngle3 = -elapsedTime / 2;
    ghost3.position.x = Math.sin(ghostAngle3) * 4.5;
    ghost3.position.z = Math.cos(ghostAngle3) * 5.5;
    ghost3.position.y = Math.cos(ghostAngle3 * 5) + Math.cos(ghostAngle3 * 1.1);
    const ghostAngle2 = -elapsedTime / 3;
    ghost2.position.x = Math.sin(ghostAngle2) * 4;
    ghost2.position.z = Math.cos(ghostAngle2) * 7;
    ghost2.position.y = Math.cos(ghostAngle2 * 2) + Math.cos(ghostAngle2 * 6.1);

    // Lightning.intensity = (Math.random() > 0.98) ? 4 : 0;
    if (ctr > a) {
        Lightning.intensity = 0;
    }
    if (ctr > a && Math.random() > 0.99) {
        ctr = 0;
        Lightning.intensity = 4;
    }
    if (ctr >= 0 && ctr <= a) {
        Lightning.intensity = 4 - 4.0 / ctr;
    }
    ctr++;


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()