import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { THREEx } from "@ar-js-org/ar.js-threejs";
import { Gena } from "@/characters/gena";
import { Button } from "@/components/ui/button";
import { Volk } from "@/characters/volk";
import { Cheburashka } from "@/characters/cheburashka";
import { Shapoklyak } from "@/characters/shapoklyak";
import { EggCatchGame } from "@/components/EggCatchGame";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const [volkState, setVolkState] = useState<string>("init");
  const [cheburashkaState, setCheburashkaState] = useState<string>("init");
  const [shapoklyakState, setShapoklyakState] = useState<string>("init");
  const genaCharacter = useRef<Gena | null>(null);
  const volkCharacter = useRef<Volk | null>(null);
  const cheburashkaCharacter = useRef<Cheburashka | null>(null);
  const shapoklyakCharacter = useRef<Shapoklyak | null>(null);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const singingAudioRef = useRef<HTMLAudioElement | null>(null);

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
      "/pattern-gena_marker.patt",
      scene,
      arToolkitContext
    );

    const volkMarker = createMarker(
      "/pattern-volk_marker.patt",
      scene,
      arToolkitContext
    );

    const cheburashkaMarker = createMarker(
      "/pattern-cheburashka.patt",
      scene,
      arToolkitContext
    );

    const shapoklyakMarker = createMarker(
      "/pattern-shapoklyak_marker.patt",
      scene,
      arToolkitContext
    );

    const characters = [
      new Gena({
        scene: genaMarker.scene,
        markerController: genaMarker.controls,
        dispatchEvent: (event: string) => {
          if (event == "helloEnded") {
            setState("showReadyButton");
          }
        },
      }),
      new Volk({
        scene: volkMarker.scene,
        markerController: volkMarker.controls,
        dispatchEvent: (event: string) => {
          if (event == "helloEnded") {
            setVolkState("showReadyButton");
          }
        },
      }),
      new Cheburashka({
        scene: cheburashkaMarker.scene,
        markerController: cheburashkaMarker.controls,
        dispatchEvent: (event: string, data: any) => {
          if (event == "helloEnded") {
            setCheburashkaState("showReadyButton");
          }
        },
      }),
      new Shapoklyak({
        scene: shapoklyakMarker.scene,
        markerController: shapoklyakMarker.controls,
        dispatchEvent: (event: string) => {
          if (event == "helloEnded") {
            setShapoklyakState("showReadyButton");
          }
        },
      }),
    ];

    genaCharacter.current = characters[0] as Gena;
    volkCharacter.current = characters[1] as Volk;
    cheburashkaCharacter.current = characters[2] as Cheburashka;
    shapoklyakCharacter.current = characters[3] as Shapoklyak;

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

  const handleReadyClick = () => {
    const audio = genaCharacter.current?.playSinging();
    if (audio) {
      singingAudioRef.current = audio;
    }
    setState("singing");
  }

  const handleSongSelect = (song: string) => {
    setSelectedSong(song);

    // Only stop the singing audio if correct answer
    if (song === "Голубой вагон") {
      if (singingAudioRef.current) {
        singingAudioRef.current.pause();
        singingAudioRef.current = null;
      }

      const genaGoodbye = new Audio("/audio/gena_goodbye.mp3");
      genaGoodbye.play();

      genaGoodbye.addEventListener("ended", () => {
        setState("completed");
      });

      // Play the video behind Gena
      genaCharacter.current?.playVideo();
    }
  }

  const handleGameEnd = async (score: number) => {
    setVolkState("gameEnded");
    console.log("Game ended with score:", score);

    // Show robot and play audio sequence
    await volkCharacter.current?.showRobotWithAudio();
    setVolkState("completed");
  }

  return (
    <div className="w-screen h-screen" id="ar-container">
      {state == 'showReadyButton' && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <Button size="lg" onClick={handleReadyClick}>Я готов!</Button>
        </div>
      )}
      {volkState == 'showReadyButton' && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <Button size="lg" onClick={() => setVolkState("playing")}>Сыграем!</Button>
        </div>
      )}
      {volkState == 'playing' && (
        <EggCatchGame onGameEnd={handleGameEnd} />
      )}
      {cheburashkaState == 'showReadyButton' && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <Button size="lg" onClick={() => {
            cheburashkaCharacter.current?.showRandomBackground();
            setCheburashkaState("completed");
          }}>Поменять фон</Button>
        </div>
      )}
      {shapoklyakState == 'showReadyButton' && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <Button size="lg" onClick={() => setShapoklyakState("completed")}>Готово!</Button>
        </div>
      )}
      {state == 'singing' && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="flex flex-col gap-4 items-center bg-white/90 p-6 rounded-lg">
            <p className="text-lg font-semibold text-center">Угадай, что за песню я играю?</p>
            <Button
              size="lg"
              onClick={() => handleSongSelect("Ромашка-ромашка")}
              className={selectedSong === "Ромашка-ромашка" ? "bg-red-500 hover:bg-red-600" : ""}
            >
              Ромашка-ромашка
            </Button>
            <Button
              size="lg"
              onClick={() => handleSongSelect("Голубой вагон")}
              className={selectedSong === "Голубой вагон" ? "bg-green-500 hover:bg-green-600" : ""}
            >
              Голубой вагон
            </Button>
            <Button
              size="lg"
              onClick={() => handleSongSelect("Пусть бегут неуклюже")}
              className={selectedSong === "Пусть бегут неуклюже" ? "bg-red-500 hover:bg-red-600" : ""}
            >
              Пусть бегут неуклюже
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
