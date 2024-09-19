import {
    GestureRecognizer,
    FilesetResolver,
    DrawingUtils,
  } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
  
  let gestureRecognizer = GestureRecognizer;
  let runningMode = "IMAGE";
  let numHands = 2;
  let enableWebcamButton;
  let webcamRunning = false;
  
  let timer = null;
  let evaluated = false;
  
  const scoreThreshold = 0.75; // minimum confidence required to detect classifier
  const qAnswer = sign; // 'sign' comes from html (not ideal)
  
  // video needs to be 3:4 for landmarks to draw correctly (will look into that)
  const videoWidth = "640px";
  const videoHeight = "480px";
  
  /*
      Load and wait for gesture recognition model
  */
  const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "static/mp_models/alphabet_recognizer.task",
        delegate: "GPU",
      },
      runningMode: runningMode,
      numHands: numHands,
    });
  };
  createGestureRecognizer();
  
  /* 
      Begin streaming webcam feed to model
  */
  
  const webCam = document.getElementById("webcam");
  const canvasElement = document.getElementById("output_canvas");
  const canvasCtx = canvasElement.getContext("2d");
  
  const glowingBorder = document.getElementById("border-glow");
  const nonGlowingBorder = document.getElementById("border-non-glow");
  
  const continueButton = document.getElementById("continueBtn");
  continueButton.addEventListener("click", () =>
    document.getElementById("signToCamForm").submit()
  );
  
  // Check if webcam access is supported.
  function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
  
  // If webcam supported, add event listener to button for when user
  // wants to activate it.
  if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("cameraButton");
    enableWebcamButton.addEventListener("click", toggleCam);
  } else {
    console.warn("getUserMedia() is not supported by your browser");
  }
  
  // Toggle webcam on/off
  function toggleCam(event) {
    if (!gestureRecognizer) {
      alert("Please wait for gestureRecognizer to load");
      return;
    }
  
    if (webcamRunning === false) {
      // toggle on
      webcamRunning = true;
      enableWebcamButton.innerText = "Disable Camera";
  
      // getUsermedia parameters.
      const constraints = {
        video: true,
      };
  
      // Activate the webcam stream.
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        webCam.srcObject = stream;
  
        webCam.addEventListener("loadeddata", predictWebcam);
      });
    } else if (webcamRunning === true) {
      // toggle off
      webcamRunning = false;
      enableWebcamButton.innerText = "Enable Camera";
  
      let stream = webCam.srcObject;
      let tracks = stream.getTracks();
  
      tracks.forEach(function (track) {
        track.stop();
      });
  
      webCam.srcObject = null;
      webCam.removeEventListener("loadeddata", predictWebcam);
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
  }
  
  let lastVideoTime = -1;
  let results = undefined;
  async function predictWebcam() {
    const webcamElement = document.getElementById("webcam");
  
    if (runningMode === "IMAGE") {
      runningMode = "VIDEO";
      await gestureRecognizer.setOptions({
        runningMode: "VIDEO",
        numHands: numHands,
        customGesturesClassifierOptions: { scoreThreshold: scoreThreshold },
      });
    }
  
    let nowInMs = Date.now();
    if (webCam.currentTime !== lastVideoTime) {
      lastVideoTime = webCam.currentTime;
  
      if (webCam.srcObject === null) {
        return;
      } else {
        results = gestureRecognizer.recognizeForVideo(webCam, nowInMs);
      }
    }
  
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const drawingUtils = new DrawingUtils(canvasCtx);
  
    canvasElement.style.height = videoHeight;
    webcamElement.style.height = videoHeight;
    canvasElement.style.width = videoWidth;
    webcamElement.style.width = videoWidth;
  
    // drawing landmarks
    if (results.landmarks.length !== 0) {
      let connectorColor = "#808080";
      let landmarkColor = "#4F4F4F";
  
      // draw landmarks and connectors
      for (let i = 0; i < results.landmarks.length; i++) {
        const landmarks = results.landmarks[i];
        const categoryName = results.gestures[i][0].categoryName;
  
        // check for correct answer and provide feedback
        if (categoryName == qAnswer) {
          connectorColor = "#509af3";
          landmarkColor = "#ff7f00";
          if (timer == null && !evaluated) {
            timer = setTimeout(allowContinue, 2000);
            glowingBorder.classList.add("animated-border-box", "glow");
          }
        } else {
          connectorColor = "#808080";
          landmarkColor = "#4F4F4F";
          cancelEvaluate();
        }
  
        // draw detected landmarks to canvas
        drawingUtils.drawConnectors(
          landmarks,
          GestureRecognizer.HAND_CONNECTIONS,
          {
            color: connectorColor,
            lineWidth: 3,
          }
        );
        drawingUtils.drawLandmarks(landmarks, {
          color: landmarkColor,
          lineWidth: 1,
        });
      }
    } else {
      cancelEvaluate();
    }
    canvasCtx.restore();
  
    if (webcamRunning === true) {
      window.requestAnimationFrame(predictWebcam);
    }
  }
  
  // allow the user to progress to the next question
  function allowContinue() {
    document.getElementById("result").innerHTML = "Correct!";
    continueButton.style.visibility = "visible";
    glowingBorder.classList.remove("animated-border-box", "glow");
    glowingBorder.classList.add("border-box-glow");
    evaluated = true;
  }
  
  function cancelEvaluate() {
    clearTimeout(timer);
    timer = null;
    glowingBorder.classList.remove("animated-border-box", "glow");
  }
    