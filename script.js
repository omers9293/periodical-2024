import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { PDBLoader } from 'three/addons/loaders/PDBLoader.js';

class HydrogenAtom
{   constructor()
    {   this.mesh = new THREE.Mesh
        (   new THREE.SphereGeometry(1.25, 32, 32),
            new THREE.MeshPhongMaterial
            (   {   color: 0x0000FF,
                    shininess: 3,
                    specular: 0xffffff,
                    opacity: 0.8,
                    transparent: true
                }
            )
        )
    }
}

class WaterMolecule
{   constructor()
    {   this.mesh = new THREE.Group;
        this.mesh.add(new HydrogenAtom().mesh);
        this.mesh.children[0].position.set(-2, -0.75, 0);
        this.mesh.add(new HydrogenAtom().mesh);
        this.mesh.children[1].position.set(2, -0.75, 0);
        this.mesh.add
        (   new THREE.Mesh
            (   new THREE.SphereGeometry(2, 32, 32),
                new THREE.MeshPhongMaterial
                (   {   color: 0xFF0000,
                        shininess: 3,
                        specular: 0xffffff,
                        opacity: 0.8,
                        transparent: true
                    }
                )
            )
        )
        this.mesh.children[2].position.set(0, 0, 0);

        this.mesh.position.set( Math.random() * (25 - (-25)) + (-25), Math.random() * (25 - (-25)) + (-25), Math.random() * (25 - (-25)) + (-25) )
        this.mesh.rotation.x = Math.random() * Math.PI * 2;
        this.mesh.rotation.y = Math.random() * Math.PI * 2;
        this.mesh.rotation.z = Math.random() * Math.PI * 2;
    }
}

class App
{
    constructor()
    {
        this.camera = new THREE.PerspectiveCamera
        (
             45, window.innerWidth / window.innerHeight, 1, 1000
        );
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.onWindowResize = this.onWindowResize.bind(this);
        this.animate = this.animate.bind(this);
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.loader = new GLTFLoader();
    }

    init()
    {   this.camera.position.z = 50;
        this.camera.position.y = 5;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.controls.autoRotate = true;
        this.controls.enabled = false;

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        let container = document.getElementById('canvas');
        container.appendChild( this.renderer.domElement );
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = 0;
        this.renderer.domElement.style.zIndex = 0;
        this.renderer.domElement.style.maxWidth = '100%';

        const ambientLight = new THREE.AmbientLight( 0xffffff );
        this.scene.add(ambientLight);

        const spotLight = new THREE.SpotLight( 0xffffff,  1500 );
        spotLight.position.set( 10, 25, 0 );
        spotLight.angle = Math.PI / 3;
        spotLight.penumbra = 1;
        spotLight.decay = 2;
	    spotLight.distance = 0;
        this.scene.add( spotLight );

        // const spotLightHelper = new THREE.SpotLightHelper( spotLight );
        // this.scene.add( spotLightHelper );

        this.scene.background = new THREE.Color( 0x0D0D3D );

        window.addEventListener( 'resize', this.onWindowResize, false );
        this.animate();

        for (let i = 0; i < 15; i++)
        {   let molecule = new WaterMolecule();
            this.scene.add(molecule.mesh);
        }
    }

    onWindowResize()
    {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls.update();
    }

    animate() {

        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }
}

const app = new App();
app.init();
