import { useEffect } from "react"
import * as THREE from 'three'
import { THREEx } from "@ar-js-org/ar.js-threejs"
import { Gena } from "@/characters/gena"
import { Lariska } from "@/characters/lariska";

function createMarkerRoot(patternUrl: string, rootScene: THREE.Scene) {
  const markerRoot = new THREE.Group();
  rootScene.add(markerRoot);

  new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'pattern',
    patternUrl: patternUrl
  });

  return markerRoot
}

export const ArPage = () => {
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

    const genaMarkerRoot = createMarkerRoot(
      'https://raw.githubusercontent.com/jeromeetienne/AR.js/master/three.js/examples/marker-training/examples/pattern-files/pattern-hiro.patt',
      scene
    )

    const lariskaMarkerRoot = createMarkerRoot(
      'https://raw.githubusercontent.com/jeromeetienne/AR.js/master/three.js/examples/marker-training/examples/pattern-files/pattern-hiro.patt',
      scene
    )

    const characters = [
      new Lariska({
        scene: lariskaMarkerRoot
      }),
      new Gena({
        scene: genaMarkerRoot
      })
    ]

    characters.forEach(x=>x.run())

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

      if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement);
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      document.getElementById('ar-container')?.removeChild(renderer.domElement);
    };
  }, [])

  return (
    <div className="w-screen h-screen" id='ar-container' />
  )
}
