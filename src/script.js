import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import VertexMedusa from './shaders/medusa/vertex.glsl'
import fragmentMedusa from './shaders/medusa/fragment.glsl'
import VertexParticles from './shaders/particles/vertex.glsl'
import fragmentParticles from './shaders/particles/fragment.glsl'

/**
 * Base
 */
const gui = new dat.GUI({
    width: 400
})
const debugObject = {}

//canvas
const canvas = document.querySelector('canvas.webgl')
debugObject.colorStart = '#0b4e69'
debugObject.colorEnd = '#000000'

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Medusa
 */
//Geometry
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 32, 20),
    new THREE.ShaderMaterial({
        vertexShader: VertexMedusa,
        fragmentShader: fragmentMedusa,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
            uTime: {value: 0},
            uWidth: {value: 1.7},
            uSpeed: {value: 0.75},
            uElevation: {value: 0.2},
            uIteration: {value: 0.3},
            uSmallfrequency: {value: 0.3},
            uColorStart: {value: new THREE.Color(debugObject.colorStart)},
            uColorEnd: {value: new THREE.Color(debugObject.colorEnd)}
        }
    })
)
scene.add(sphere)
gui.add(sphere.material.uniforms.uWidth, 'value').min(1.0).max(1.9).step(0.001).name('MedusaWidth')
gui
    .addColor(debugObject, 'colorStart')
    .onChange(() => {
        sphere.material.uniforms.uColorStart.value.set(debugObject.colorStart)
    })
gui
    .addColor(debugObject, 'colorEnd')
    .onChange(() => {
        sphere.material.uniforms.uColorEnd.value.set(debugObject.colorEnd)
    })

/**
 * Particles
*/
//Geometry

debugObject.particlesstart =  '#7b0b8a'

const geoParticles = new THREE.BufferGeometry()
const countArray = 1000
const positionArray = new Float32Array(countArray * 3)

for(let i = 0; i <= countArray; i++)
{
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 10
    positionArray[i * 3 + 1] =  (Math.random() - 0.1) * 10.5
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 10
}
geoParticles.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))

const matParticles = new THREE.ShaderMaterial(
{
    vertexShader: VertexParticles,
    fragmentShader: fragmentParticles,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    uniforms: 
    {
        uPixelRatio: {value: Math.min(window.devicePixelRatio, 2)},
        uSize: {value: 100},
        uTime: {value: 0},
        uColorStart: {value: new THREE.Color(debugObject.particlesstart)}
    } 
})
const particles = new THREE.Points(geoParticles, matParticles)
scene.add(particles)

const scaleArray = new Float32Array(countArray)
for(let i = 0; i < countArray; i++){
    scaleArray[i] = Math.random()
}

geoParticles.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

gui.add(matParticles.uniforms.uSize, 'value').min(50).max(500).step(1).name('particlesSizes')
gui
    .addColor(debugObject, 'particlesstart')
    .onChange(() => {
        matParticles.uniforms.uColorStart.value.set(debugObject.particlesstart)
    })

/**
 * sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //update Particles
    matParticles.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

/**
 * camera
 */
//base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-3, 5, 3)
scene.add(camera) 


//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true 


//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

debugObject.clearColor = '#201919'
renderer.setClearColor(debugObject.clearColor)
gui
    .addColor(debugObject, 'clearColor')
    .onChange(() => {
        renderer.setClearColor(debugObject.clearColor)
    })


const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    sphere.material.uniforms.uTime.value = elapsedTime

    matParticles.uniforms.uTime.value = elapsedTime

    //update controls
    controls.update()

    //renderer
    renderer.render(scene, camera)

    //call tick again on the next frame

    window.requestAnimationFrame(tick)

}

tick()
