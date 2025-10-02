import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { THREEx } from "@ar-js-org/ar.js-threejs";
import { Gena } from "@/characters/gena";
import { Button } from "@/components/ui/button";

function createMarker(patternUrl: string, rootScene: THREE.Scene, ctx: any) {
  const markerRoot = new THREE.Group();
  rootScene.add(markerRoot);

  const controls = new THREEx.ArMarkerControls(ctx, markerRoot, {
    type: "pattern",
    patternUrl: patternUrl,
  });

  return {
    scene: markerRoot,
    controls,
  };
}

export const ArPage = () => {
  const [state, setState] = useState<string>("init");
  const genaCharacter = useRef<Gena | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    scene.add(camera);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("ar-container")?.appendChild(renderer.domElement);

    const arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: "webcam",
      sourceWidth: window.innerWidth,
      sourceHeight: window.innerHeight,
      displayWidth: window.innerWidth,
      displayHeight: window.innerHeight,
    });

    arToolkitSource.init(
      () => {
        onResize();
      },
      () => null
    );

    const arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: "/camera_para.dat",
      detectionMode: "mono",
    });

    arToolkitContext.init(() => {
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    const genaMarker = createMarker(
      "https://raw.githubusercontent.com/jeromeetienne/AR.js/master/three.js/examples/marker-training/examples/pattern-files/pattern-hiro.patt",
      scene,
      arToolkitContext
    );

    // const lariskaMarker = createMarker(
    //   'https://raw.githubusercontent.com/jeromeetienne/AR.js/master/three.js/examples/marker-training/examples/pattern-files/pattern-hiro.patt',
    //   scene,
    //   arToolkitContext
    // )

    const characters = [
      new Gena({
        scene: genaMarker.scene,
        markerController: genaMarker.controls,
        dispatchEvent: (event: string, data: any) => {
          if (event == "helloEnded") {
            setState("genaSelectButtons");
          }
        },
      }),
      // new Gena({
      //   scene: genaMarker.scene
      // })
    ];

    genaCharacter.current = characters[0];

    characters.forEach((x) => x.run());

    function onResize() {
      arToolkitSource.onResizeElement();
      arToolkitSource.copyElementSizeTo(renderer.domElement);
      if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
      }
    }

    window.addEventListener("resize", onResize);

    function animate() {
      requestAnimationFrame(animate);

      if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement);
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      document.getElementById("ar-container")?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="w-screen h-screen" id="ar-container">
      {state == "genaSelectButtons" && (
        <div>
          <Button size="lg" onClick={() => {genaCharacter.current?.playSinging()}}>
            Хочу!
          </Button>
          <Button size="lg" onClick={() => {}}>
            Не хочу :(
          </Button>
        </div>
      )}
    </div>
  );
};
