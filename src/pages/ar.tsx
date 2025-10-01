import { useEffect } from "react"
import * as THREE from 'three'
import { THREEx } from "@ar-js-org/ar.js-threejs"
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';


function loadAnimatedModel(path: string, cb: (data: GLTF) => void) {
  const loader = new GLTFLoader();

  loader.load(path, cb)
}

export const ArPage = () => {
  // const html = `
  //   <a-scene embedded arjs>
  //     <a-marker preset="hiro">
  //       <a-entity
  //         position="0 0 0"
  //         scale="1 1 1"
  //         gltf-model="/lariska_standing.glb"
  //       ></a-entity>
  //     </a-marker>
  //     <a-entity camera></a-entity>
  //   </a-scene>
  // `
  //

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('ar-container')?.appendChild(renderer.domElement);

    const arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: 'webcam',
      sourceWidth: window.innerWidth,
      sourceHeight: window.innerHeight,
      displayWidth: window.innerWidth,
      displayHeight: window.innerHeight
    });

    arToolkitSource.init(() => {
      onResize();
    }, () => null);

    const arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: '/camera_para.dat',
      detectionMode: 'mono'
    });

    arToolkitContext.init(() => {
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    const markerRoot = new THREE.Group();
    scene.add(markerRoot);

    new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
      type: 'pattern',
      patternUrl: 'https://raw.githubusercontent.com/jeromeetienne/AR.js/master/three.js/examples/marker-training/examples/pattern-files/pattern-hiro.patt'
    });

    let mixer: any;
    const clock = new THREE.Clock();
    loadAnimatedModel('/lariska_standing.glb', (gltf) => {
      markerRoot.add(gltf.scene)

      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(gltf.scene);

        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
      }
    })

    function onResize() {
      arToolkitSource.onResizeElement();
      arToolkitSource.copyElementSizeTo(renderer.domElement);
      if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
      }
    }

    window.addEventListener('resize', onResize);

    function animate() {
      requestAnimationFrame(animate);

      if (mixer) {
        mixer.update(clock.getDelta());
      }

      if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement);
      }

      renderer.render(scene, camera);
    }

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      document.getElementById('ar-container')?.removeChild(renderer.domElement);
    };
  }, [])

  return (
    <div className="w-screen h-screen" id='ar-container' />
  )
}
