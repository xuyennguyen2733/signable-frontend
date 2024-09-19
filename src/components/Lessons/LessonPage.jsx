import { useQuery } from "react-query";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { AiFillCloseCircle } from "react-icons/ai";
import { TbConfetti } from "react-icons/tb";
import { GrTrophy } from "react-icons/gr";
import { PiTargetBold } from "react-icons/pi";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

import Webcam from "react-webcam";
import {
  GestureRecognizer,
  PoseLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { FilesetResolver } from "@mediapipe/tasks-text";
import * as tf from "@tensorflow/tfjs";

import { api_url } from "../../data/Data";
import { useApi } from "../../hooks";
import "./LessonPage.css";

// Maps question types to API question type IDs
const questionTypeEnums = {
  CAMERA: 0,
  MULTIPLE_CHOICE: 1,
  MATCHING: 2,
  FILL_IN_THE_BLANK: 3,
  WATCH_TO_LEARN: 4,
};

const BUCKET_NAME = ${{env.BUCKET_NAME}};
const BUCKET_REGION = ${{env.BUCKET_REGION}};
const ACCESS_KEY = ${{env.ACCESS_KEY}};
const SECRET_ACCESS_KEY = ${{env.SECRET_ACCESS_KEY}};

const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: BUCKET_REGION,
});

const s3BaseUrl = "https://signable-alphabet-media.s3.us-west-1.amazonaws.com";

const generateUrl = async (key, extension = "webp") => {
  const getObjectParams = {
    Bucket: BUCKET_NAME,
    Key: `${key}.${extension}`,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
};

const createRecognizers = async (urls) => {
  const {
    motionRecognizerJsonUrl = `${s3BaseUrl}/alphabet_motion_detector.json`,
    gestureRecognizerUrl = `${s3BaseUrl}/alphabet_recognizer.task`,
  } = urls;

  const poseLandmarkerUrl =
    "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

  // Load the model using tf.io.browserFiles
  const motionRecognizer = await tf.loadLayersModel(motionRecognizerJsonUrl);

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  const gestureRecognizerForImage = await GestureRecognizer.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath: gestureRecognizerUrl,
        delegate: "GPU",
      },
      runningMode: "IMAGE",
      numHands: 2,
    }
  );
  const gestureRecognizerForVideo = await GestureRecognizer.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath: gestureRecognizerUrl,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
    }
  );
  const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: poseLandmarkerUrl,
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numPoses: 1,
  });
  cachedRecognizers.current = {
    gestureRecognizerForImage: gestureRecognizerForImage,
    gestureRecognizerForVideo: gestureRecognizerForVideo,
    poseLandmarker: poseLandmarker,
    motionRecognizer: motionRecognizer,
  };
};

const cachedRecognizers = {};

const frameCount = 61;
const videoScale = 0.95;
const videoWidth = 1280;
const videoHeight = 720;
const classLabels = ["!none", "j", "z"];
let watchToLearnCanvasCtx = null;
let signToCameraCanvasCtx = null;

/**
 * Renders a Lesson-Complete page.
 *
 * @param {object} props - The props object containing the navigate function.
 * @param {function} props.navigate - The function to navigate to another url.
 *
 * @returns {JSX.Element} The JSX element representing the Lesson-Complete page.
 */

function LessonCompletePage({ unitId, lessonIndex }) {
  const api = useApi();
  const navigate = useNavigate();

  const finishLesson = async (e) => {
    try {
      api
        .put(`/users/progress`, {
          lesson_index: lessonIndex,
          unit_progress: unitId,
        })
        .then((response) => {
          if (response.ok) {
            navigate("/learn");
          } else {
            navigate("/error/404");
          }
        });
    } catch (e) {
      console.error("Error when updating:", e.message);
    }
  };

  const iconStyle = { color: "#EBAB33" };
  const iconSize = 30;

  return (
    <>
      <div className="wrapper">
        <div className="modal modal--congratulations">
          <div className="modal-top">
            <TbConfetti style={iconStyle} size={100} />
            <div className="modal-header">Congratulations!</div>
            <div className="modal-subheader">
              {`You have successfully completed Unit ${unitId}, Lesson ${lessonIndex}!`}
            </div>
            <p className="congrats-stats">
              <GrTrophy size={iconSize} /> + {10} XP{" "}
            </p>
            {/* <p className="congrats-stats"><PiTargetBold size={iconSize} /> {}% </p> */}
          </div>
          <div className="congrats-bottom">
            <button
              onClick={() => finishLesson()}
              className="congrats-btn congrats-btn congrats-btn--share"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <div>
        <h1>Congrats!</h1>
        <button onClick={() => navigate("/learn")}>Return</button>
      </div>
    </>
  );
}

/**
 * Renders a sign-to-camera question card.
 *
 * @param {object} props - The props object containing the setAnswer, setIsCorrect, and setChecked functions.
 * @param {function} props.webcamRef - The reference to the webcam.
 * @param {function} props.canvasRef - The reference to the canvas.
 * @param {function} props.question - The question object with information specific to sign-to-camera questions.
 * @param {function} props.setIsCorrect - The function to set whether the user's answer is correct or not.
 * @param {function} props.setChecked - The function to mark that the answer has been evaluated
 *
 * @returns {JSX.Element} The JSX element representing the sign-to-camera question card.
 */
function WatchToLearnPractice({
  webcamRef,
  canvasRef,
  question,
  setIsCorrect,
  setChecked,
  zIndex,
}) {
  const [frameInvoker, setFrameInvoker] = useState(false);
  const gestureRecognizer = useRef(null);
  const poseLandmarker = useRef(null);
  const motionRecognizer = useRef(null);
  const glowBorderDiv = useRef(null);
  const rawLandmarkSequence = useRef([]);
  const evaluationTimer = useRef(null);
  const [image, setImage] = useState(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    return img;
  });

  const [evaluating, setEvaluating] = useState(false);
  const [evaluated, setEvaluated] = useState(false);

  const borderStyle = {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 0,
  };

  const cameraPlaceholder = {
    width: videoWidth,
    height: videoHeight,
  };

  /**
   * Initialize functions
   */
  const extractKeyframes = () => {
    const interval = Math.floor(rawLandmarkSequence.current.length / 15);
    //console.log("interval", interval);
    const keyframes = rawLandmarkSequence.current.filter(
      (frame, index) => index % interval === 0
    );
    //console.log("extracted", keyframes);
    return keyframes;
  };
  const detectSign = () => {
    setFrameInvoker(!frameInvoker);
    if (
      webcamRef?.current &&
      canvasRef?.current &&
      watchToLearnCanvasCtx &&
      gestureRecognizer?.current
    ) {
      let userInput = "";
      let gestureResults = null;
      let poseResults = null;

      const video = webcamRef.current.video;
      const canvas = canvasRef.current;

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      if (video.videoWidth > 0 && video.videoHeight > 0) {
        gestureResults = gestureRecognizer.current.recognizeForVideo(
          video,
          performance.now()
        );
        watchToLearnCanvasCtx.save();
        watchToLearnCanvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        const drawingUtils = new DrawingUtils(watchToLearnCanvasCtx);
        if (gestureResults && gestureResults.landmarks.length > 0) {
          let connectorColor = "#808080";
          let landmarkColor = "white";

          if (question.motion && evaluating) {
            connectorColor = "#509af3";
            landmarkColor = "#ff7f00";
          }

          // draw landmarks and connectors
          for (
            let i = 0;
            i < Math.min(question.num_hands, gestureResults.landmarks.length);
            i++
          ) {
            const landmarks = gestureResults.landmarks[i];
            userInput = gestureResults.gestures[i][0].categoryName;
            if (
              userInput.toLowerCase() === question.sign ||
              userInput.toLowerCase() === question.starting_position
            ) {
              // check user's answer and provide feedback
              connectorColor = "#509af3";
              landmarkColor = "#ff7f00";
              if (!evaluating && !evaluated) {
                setEvaluating(true);
              }
            } else if (!question.motion) {
              connectorColor = "#808080";
              landmarkColor = "white";
              if (!evaluated) setEvaluating(false);
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
              radius: 2,
            });
          }

          watchToLearnCanvasCtx.restore();
        }
        // Starts collecting frames for signs with motions
        if (
          evaluating &&
          rawLandmarkSequence.current.length <= frameCount &&
          question.motion
        ) {
          let poseLandmarks, leftHandLandmarks, rightHandLandmarks;
          poseLandmarks =
            poseResults?.landmarks.length > 0
              ? poseResults.landmarks[0].flatMap((res) => [res.x, res.y, res.z])
              : Array(33 * 3).fill(0);

          rightHandLandmarks = Array(21 * 3).fill(0);
          leftHandLandmarks = Array(21 * 3).fill(0);
          if (gestureResults?.landmarks.length > 0) {
            for (let i = 0; i < gestureResults.landmarks.length; i++) {
              if (gestureResults.handedness[i][0]?.displayName === "Left") {
                rightHandLandmarks = gestureResults.landmarks[i].flatMap(
                  (res) => [res.x, res.y, res.z]
                );
              } else if (
                gestureResults.handedness[i][0]?.displayName === "Right"
              ) {
                leftHandLandmarks = gestureResults.landmarks[i].flatMap(
                  (res) => [res.x, res.y, res.z]
                );
              }
            }
          }
          const newDataSet = [
            ...poseLandmarks,
            ...leftHandLandmarks,
            ...rightHandLandmarks,
          ];
          rawLandmarkSequence.current.push(newDataSet);
          if (rawLandmarkSequence.current.length === frameCount) {
            glowBorderDiv.current.className = "animated-border-box";
            evaluationTimer.current = setTimeout(evaluateMotion, 2000);
          }
        }
      }
    }
  };

  const evaluateMotion = async () => {
    setEvaluated(true);
    setEvaluating(false);
    rawLandmarkSequence.current = extractKeyframes();
    //console.log("returned extracted", rawLandmarkSequence.current);
    let processedLandmarkSequence = [];

    // Input format must be a 15 x 225 array of difference between consecutive landmarks
    // rawLandmarkSequence is a 16 x 225 array of landmarks detected in each video frame
    for (let i = 0; i < rawLandmarkSequence.current.length - 1; i++) {
      const nextLandmarks = rawLandmarkSequence.current[i + 1];
      const currentLandmarks = rawLandmarkSequence.current[i];
      processedLandmarkSequence.push(
        nextLandmarks.map(
          (nextLandmarkValue, landmarkIndex) =>
            nextLandmarkValue - currentLandmarks[landmarkIndex]
        )
      );
    }

    //console.log("proccessed", processedLandmarkSequence);

    // Reformat proccessedLandmarkSequence from [15, 255] into the shape [1, 15, 225]
    // To line up with the model's required input format
    const tensorInput = tf
      .tensor(processedLandmarkSequence)
      .reshape([1, 15, 225]);
    const resultArray = motionRecognizer.current
      .predict(tensorInput)
      .arraySync()[0]; // Predict, then convert predictions tensor to a JavaScript array
    const maxProbIndex = resultArray.indexOf(Math.max(...resultArray)); // Find the index of the class with the highest probability
    const userInput = classLabels[maxProbIndex];

    if (userInput === question.sign) {
      allowContinue();
    } else {
      glowBorderDiv.current.className = "border-box-incorrect";
      queueQuestion();
    }
  };

  const allowContinue = () => {
    glowBorderDiv.current.className = "border-box-correct";
    skipQuestion();
  };

  const cancelEvaluate = () => {
    clearTimeout(evaluationTimer.current);
    evaluationTimer.current = null;
    glowBorderDiv.current.className = "";
  };

  const skipQuestion = () => {
    setEvaluated(true);
    setChecked(true);
    setIsCorrect(true);
  };

  const queueQuestion = () => {
    setIsCorrect(false);
    setChecked(true);
  };

  const initQuestion = () => {
    setEvaluated(false);
    setEvaluating(false);
    setChecked(false);
    setIsCorrect(false);
    cancelEvaluate();
    rawLandmarkSequence.current = [];
  };

  useEffect(() => {
    if (cachedRecognizers.current) {
      gestureRecognizer.current =
        cachedRecognizers.current.gestureRecognizerForVideo;
      poseLandmarker.current = cachedRecognizers.current.poseLandmarker;
      motionRecognizer.current = cachedRecognizers.current.motionRecognizer;
    }
  }, [cachedRecognizers.current]);

  useEffect(() => {
    watchToLearnCanvasCtx = canvasRef.current?.getContext("2d", {
      willReadFrequently: true,
    });
  }, [canvasRef?.current]);

  useEffect(() => {
    initQuestion();
  }, [question]);

  /**
   * Detect Signs and Draw Hand Landmarks At Animation Frame Rate (~60 FPS)
   */
  window.requestAnimationFrame(detectSign);

  /**
   * Runs When the Variable 'Evaluating' Is Changed
   * Activate or Cancel Evaluation
   */
  useEffect(() => {
    if (evaluating) {
      // initiate evaluation
      if (!question.motion) {
        evaluationTimer.current = setTimeout(allowContinue, 2000);
        glowBorderDiv.current.className = "animated-border-box";
      }
    } else if (!evaluated) cancelEvaluate();
  }, [evaluating]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "end",
        width: '95%',
        height: '95%',
      }}
    >
      <>
        <Webcam
          ref={webcamRef}
          mirrored={true}
          videoConstraints={{
          }}
          style={{ zIndex: zIndex, width: '100%' }}
        />

        <>
          <canvas
            ref={canvasRef}
            className="canvas"
            style={{
              width: '100%'
            }}
          ></canvas>
        </>
      </>
      <div className="glowing-border" ref={glowBorderDiv} style={borderStyle}></div>
      <div
        className="skip-button-container"
        style={{
          justifyContent: "center",
          width: videoWidth / 2,
          alignItems: "center",
        }}
      >
        {!evaluated && (
          <button
            className="skip-button"
            disabled={!(gestureRecognizer.current && poseLandmarker.current)}
            onClick={skipQuestion}
          >
            Can't Sign Now?<br></br>
            {/* <div>Skip</div> */}
          </button>
        )}
      </div>
    </div>
  );
}

function WatchToLearnInstruction({ zIndex, sign }) {
  const videoRef = useRef();
  useEffect(() => {
    if (videoRef?.current?.style?.display) {
      videoRef.current.style.display = "none";
    }
  }, [sign]);
  return (
    <div
      className="watch-to-learn-video"
      style={{ width: "50%", height: "100%", zIndex: zIndex }}
    >
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        className="video-instruction"
        src={sessionStorage.getItem(sign)}
        style={{ display: "none" }}
        onCanPlay={() => {
          videoRef.current.style.display = "block";
        }}
      ></video>
    </div>
  );
}

function WatchToLearnCard({
  webcamRef,
  canvasRef,
  question,
  setIsCorrect,
  setChecked,
}) {
  const zIndex = 10;
  return (
    <div
      className="watch-to-learn-content"
      style={{ width: '60%', height: '100%' }}
    >
      <div className="watch-to-learn-practice">
        <WatchToLearnPractice
          webcamRef={webcamRef}
          canvasRef={canvasRef}
          question={question}
          setIsCorrect={setIsCorrect}
          setChecked={setChecked}
          zIndex={zIndex - 1}
        />
      </div>
      <WatchToLearnInstruction zIndex={zIndex} sign={question.sign} />
    </div>
  );
}

/**
 * Renders a fill-in-the-blank question card.
 *
 * @param {object} props - The props object containing the setAnswer function.
 * @param {boolean} props.checked - The boolean variable the specified whether the answer has been evaluated or not.
 * @param {function} props.setAnswer - The function to record the user's answer.
 * @param {fucntion} prop.checkAnswer - The function to check the user's answer.
 *
 * @returns {JSX.Element} The JSX element representing the fill-in-the-blank question card.
 */
function FillInTheBlankCard({ checked, setAnswer, checkAnswer, visualCue }) {
  const onSubmit = (e) => {
    e.preventDefault();
    checkAnswer();
  };

  return (
    <div className="fill-in-the-blank-content question-content">
      <div className="visual-cue-holder">
        <img src={sessionStorage.getItem(visualCue)} className="visual-cue" />
      </div>
      <form className="fill-in-the-blank-form" onSubmit={onSubmit}>
        <input
          onChange={(e) => setAnswer(e.target.value.toUpperCase())}
          name="answer"
          type="text"
          placeholder="Your answer"
          disabled={checked}
        />
      </form>
    </div>
  );
}

/**
 * Renders a matching question card.
 *
 * @param {object} props - The props object containing the leftList, rightList, unitId, lessonId, questionId, setIsCorrect, and setChecked variables and functions.
 * @param {array} props.visualList - The list of matching items displayed as images
 * @param {array} props.textList - The list of matching items displayed as text
 * @param {int} props.questionId - The ID of the question.
 * @param {function} props.setIsCorrect - The function to set whether the answer is correct or not.or not.
 * @param {function} props.setChecked - The function to mark that the user's answer has been evaluated.
 *
 * @returns {JSX.Element} The JSX element representing the matching question card.
 */
function MatchingCard({
  visualList,
  textList,
  questionId,
  setIsCorrect,
  setChecked,
}) {
  /** Initialize Hooks */
  const [pairItem1, setPairItem1] = useState(null);
  const [pairItem2, setPairItem2] = useState(null);
  const [disabledList, setdisabledList] = useState([]);

  /** Initialize Functions */
  const setFirstSelection = (newItem) => {
    if (pairItem1 == newItem) {
      setPairItem1(null);
    } else {
      setPairItem1(newItem);
    }
  };

  const setSecondSelection = (newItem) => {
    if (pairItem2 === newItem) {
      setPairItem2(null);
    } else {
      setPairItem2(newItem);
    }
  };

  const checkPair = async (item1, item2) => {
    const response = await fetch(
      `${api_url}/units/check-answer/${questionTypeEnums["MATCHING"]}/${questionId}/${item1}.${item2}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      response.json().then((data) => {
        if (data.is_correct) {
          setdisabledList([...disabledList, item1, item2]);
        }
      });
    }
    setPairItem1(null);
    setPairItem2(null);
  };

  /** Functionality Implementations */
  useEffect(() => {
    if (disabledList.length === visualList.length + textList.length) {
      setIsCorrect(true);
      setChecked(true);
    }
  }, [disabledList]);

  useEffect(() => {
    if (pairItem1 && pairItem2) {
      checkPair(pairItem1, pairItem2);
    }
  }, [pairItem1, pairItem2]);

  return (
    <div className="matching-content question-content">
      <div className="matching-visual">
        {visualList.map((option) => (
          <button
            disabled={disabledList.includes(option)}
            key={option}
            onClick={() => setFirstSelection(option)}
          >
            <img
              src={sessionStorage.getItem(option)}
              className="option-visual"
            />
          </button>
        ))}
      </div>
      <div className="matching-text">
        {textList.map((item) => (
          <button
            disabled={disabledList.includes(item)}
            key={item}
            onClick={() => setSecondSelection(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders a sign-to-camera question card.
 *
 * @param {object} props - The props object containing the setAnswer, setIsCorrect, and setChecked functions.
 * @param {function} props.webcamRef - The reference to the webcam.
 * @param {function} props.canvasRef - The reference to the canvas.
 * @param {function} props.question - The question object with information specific to sign-to-camera questions.
 * @param {function} props.setIsCorrect - The function to set whether the user's answer is correct or not.
 * @param {function} props.setChecked - The function to mark that the answer has been evaluated
 *
 * @returns {JSX.Element} The JSX element representing the sign-to-camera question card.
 */
function SignToCameraCard({
  webcamRef,
  canvasRef,
  question,
  setIsCorrect,
  setChecked,
}) {
  const [frameInvoker, setFrameInvoker] = useState(false);
  const gestureRecognizer = useRef(null);
  const poseLandmarker = useRef(null);
  const motionRecognizer = useRef(null);
  const glowBorderDiv = useRef(null);
  const rawLandmarkSequence = useRef([]);
  const evaluationTimer = useRef(null);

  const [evaluating, setEvaluating] = useState(false);
  const [evaluated, setEvaluated] = useState(false);

  const borderStyle = {
    width: "100%",
    height: videoHeight * 0.98,
    position: "absolute",
    zIndex: 0,
  };

  const cameraPlaceholder = {
    width: videoWidth,
    height: videoHeight,
  };

  /**
   * Initialize functions
   */

  const extractKeyframes = () => {
    const interval = Math.floor(rawLandmarkSequence.current.length / 15);
    //console.log("interval", interval);
    const keyframes = rawLandmarkSequence.current.filter(
      (frame, index) => index % interval === 0
    );
    //console.log("extracted", keyframes);
    return keyframes;
  };

  const detectSigns = () => {
    setFrameInvoker(!frameInvoker);
    if (
      !gestureRecognizer.current ||
      !poseLandmarker.current ||
      !signToCameraCanvasCtx
    )
      return;
    let userInput = "";
    const video = webcamRef.current?.video;
    let gestureResults = null;
    let poseResults = null;
    if (video) {
      const startTimeInMs = performance.now();
      gestureResults = gestureRecognizer.current.recognizeForVideo(
        video,
        startTimeInMs
      );
      // poseResults = poseLandmarker.current.detectForVideo(video, startTimeInMs);
    }
    signToCameraCanvasCtx.save();
    signToCameraCanvasCtx.clearRect(0, 0, videoWidth, videoHeight);
    const drawingUtils = new DrawingUtils(signToCameraCanvasCtx);
    if (gestureResults && gestureResults.landmarks.length !== 0) {
      let connectorColor = "#808080";
      let landmarkColor = "#4F4F4F";

      if (question.motion && evaluating) {
        connectorColor = "#509af3";
        landmarkColor = "#ff7f00";
      }

      // draw landmarks and connectors
      for (
        let i = 0;
        i < Math.min(question.num_hands, gestureResults.landmarks.length);
        i++
      ) {
        const landmarks = gestureResults.landmarks[i];
        userInput = gestureResults.gestures[i][0].categoryName;
        if (
          userInput.toLowerCase() === question.sign ||
          userInput.toLowerCase() === question.starting_position
        ) {
          // check user's answer and provide feedback
          connectorColor = "#509af3";
          landmarkColor = "#ff7f00";
          if (!evaluating && !evaluated) {
            setEvaluating(true);
          }
        } else if (!question.motion) {
          connectorColor = "#808080";
          landmarkColor = "#4F4F4F";
          if (!evaluated) setEvaluating(false);
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
      if (!question.motion) setEvaluating(false);
    }
    signToCameraCanvasCtx.restore();

    // Starts collecting frames for signs with motions
    if (
      evaluating &&
      rawLandmarkSequence.current.length <= frameCount &&
      question.motion
    ) {
      let poseLandmarks, leftHandLandmarks, rightHandLandmarks;
      poseLandmarks =
        poseResults?.landmarks.length > 0
          ? poseResults.landmarks[0].flatMap((res) => [res.x, res.y, res.z])
          : Array(33 * 3).fill(0);

      rightHandLandmarks = Array(21 * 3).fill(0);
      leftHandLandmarks = Array(21 * 3).fill(0);
      if (gestureResults?.landmarks.length > 0) {
        for (let i = 0; i < gestureResults.landmarks.length; i++) {
          if (gestureResults.handedness[i][0]?.displayName === "Left") {
            rightHandLandmarks = gestureResults.landmarks[i].flatMap((res) => [
              res.x,
              res.y,
              res.z,
            ]);
          } else if (gestureResults.handedness[i][0]?.displayName === "Right") {
            leftHandLandmarks = gestureResults.landmarks[i].flatMap((res) => [
              res.x,
              res.y,
              res.z,
            ]);
          }
        }
      }
      const newDataSet = [
        ...poseLandmarks,
        ...leftHandLandmarks,
        ...rightHandLandmarks,
      ];
      rawLandmarkSequence.current.push(newDataSet);
      if (rawLandmarkSequence.current.length === frameCount) {
        glowBorderDiv.current.className = "animated-border-box";
        evaluationTimer.current = setTimeout(evaluateMotion, 2000);
      }
    }
  };

  const evaluateMotion = async () => {
    setEvaluated(true);
    setEvaluating(false);
    rawLandmarkSequence.current = extractKeyframes();
    let processedLandmarkSequence = [];

    // Input format must be a 15 x 225 array of difference between consecutive landmarks
    // rawLandmarkSequence is a 16 x 225 array of landmarks detected in each video frame
    for (let i = 0; i < rawLandmarkSequence.current.length - 1; i++) {
      const nextLandmarks = rawLandmarkSequence.current[i + 1];
      const currentLandmarks = rawLandmarkSequence.current[i];
      processedLandmarkSequence.push(
        nextLandmarks.map(
          (nextLandmarkValue, landmarkIndex) =>
            nextLandmarkValue - currentLandmarks[landmarkIndex]
        )
      );
    }

    // Reformat proccessedLandmarkSequence from [15, 255] into the shape [1, 15, 225]
    // To line up with the model's required input format
    const tensorInput = tf
      .tensor(processedLandmarkSequence)
      .reshape([1, 15, 225]);
    const resultArray = motionRecognizer.current
      .predict(tensorInput)
      .arraySync()[0]; // Predict, then convert predictions tensor to a JavaScript array
    const maxProbIndex = resultArray.indexOf(Math.max(...resultArray)); // Find the index of the class with the highest probability
    const userInput = classLabels[maxProbIndex];

    if (userInput === question.sign) {
      allowContinue();
    } else {
      glowBorderDiv.current.className = "border-box-incorrect";
      queueQuestion();
    }
  };

  const allowContinue = () => {
    glowBorderDiv.current.className = "border-box-correct";
    skipQuestion();
  };

  const cancelEvaluate = () => {
    clearTimeout(evaluationTimer.current);
    evaluationTimer.current = null;
    glowBorderDiv.current.className = "";
  };

  const skipQuestion = () => {
    setEvaluated(true);
    setChecked(true);
    setIsCorrect(true);
  };

  const queueQuestion = () => {
    setIsCorrect(false);
    setChecked(true);
  };

  const initQuestion = () => {
    setEvaluated(false);
    setEvaluating(false);
    setChecked(false);
    setIsCorrect(false);
    cancelEvaluate();
    rawLandmarkSequence.current = [];
  };

  /**
   * One-time Initializations
   */

  useEffect(() => {
    if (cachedRecognizers.current) {
      gestureRecognizer.current =
        cachedRecognizers.current.gestureRecognizerForVideo;
      poseLandmarker.current = cachedRecognizers.current.poseLandmarker;
      motionRecognizer.current = cachedRecognizers.current.motionRecognizer;
    }
  }, [cachedRecognizers.current]);

  useEffect(() => {
    signToCameraCanvasCtx = canvasRef.current?.getContext("2d", {
      willReadFrequently: true,
    });
  }, [canvasRef?.current]);

  useEffect(() => {
    initQuestion();
  }, [question]);

  /**
   * Detect Signs and Draw Hand Landmarks At Animation Frame Rate (~60 FPS)
   */
  window.requestAnimationFrame(detectSigns);

  /**
   * Runs When the Variable 'Evaluating' Is Changed
   * Activate or Cancel Evaluation
   */
  useEffect(() => {
    if (evaluating) {
      // initiate evaluation
      if (!question.motion) {
        evaluationTimer.current = setTimeout(allowContinue, 2000);
        glowBorderDiv.current.className = "animated-border-box";
      }
    } else if (!evaluated) cancelEvaluate();
  }, [evaluating]);

  return (
    <>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "end",
          width: '100%',
          height: "100%",
        }}
      >
        {gestureRecognizer.current && poseLandmarker.current ? (
          <>
            <Webcam
              width={videoWidth}
              height={videoHeight}
              videoConstraints={{
                aspectRatio: 16 / 9,
              }}
              mirrored={true}
              ref={webcamRef}
              className="webcam"
            />

            <>
              <canvas
                width={videoWidth}
                height={videoHeight}
                ref={canvasRef}
                className="canvas"
              ></canvas>
            </>
          </>
        ) : (
          <div style={cameraPlaceholder}>
            <h1>loading...</h1>
          </div>
        )}
        <div ref={glowBorderDiv} style={borderStyle}></div>
      </div>
      <div className="sign-to-camera-skip-button-container">
        {!evaluated && (
          <button
            className="skip-button"
            disabled={!(gestureRecognizer.current && poseLandmarker.current)}
            onClick={skipQuestion}
          >
            Can't Sign Now?
          </button>
        )}
      </div>
    </>
  );
}

/**
 * Renders a matching question card.
 *
 * @param {object} props - The props object containing the options array and the setAnswer functions.
 * @param {int} props.options - The displayed options
 * @param {function} props.setAnswer - The function to record the user's answer.
 *
 * @returns {JSX.Element} The JSX element representing the multiple-option question card.
 */
function MultipleChoiceCard({ options, setAnswer, checked }) {
  return (
    <div className="question-content">
      {options.map((option) => (
        <button
          className="visual-card"
          key={option}
          onClick={() => setAnswer(option)}
          disabled={checked}
        >
          <img src={sessionStorage.getItem(option)} className="option-visual" />
        </button>
      ))}
    </div>
  );
}

/**
 * Renders the content of an individual question, tailored to each question type.
 *
 * @param {object} props - The props object containing the unitId, lessonId, question, setAnswer, setIsCorrect, setChecked, and setShowCheckButton variables and functions.
 * @param {int} props.unitId - The ID of the unit the lesson belongs to.
 * @param {int} props.lessonId - The ID of the lesson.
 * @param {object} props.question - The question object with general information.
 * @param {function} props.setAnswer - The function to set the answer from the user.
 * @param {function} props.setIsCorrect - The function to set whether the answer is correct or not.
 * @param {function} props.setChecked - The function to mark that the user's answer has been evaluated.
 * @param {function} props.showCheckButton - The function to set whether to show the 'Check' button.
 *
 * @returns {JSX.Element} The JSX element representing the content of the question.
 */
function QuestionContent({
  question,
  checked,
  setAnswer,
  setIsCorrect,
  setChecked,
  setShowCheckButton,
  checkAnswer,
  webcamRef,
  signToCameraCanvasRef,
  watchToLearnCanvasRef,
}) {
  useEffect(() => {
    if (
      question.question_type == questionTypeEnums["MULTIPLE_CHOICE"] ||
      question.question_type == questionTypeEnums["FILL_IN_THE_BLANK"]
    ) {
      setShowCheckButton(true);
    } else {
      setShowCheckButton(false);
    }
  }, [question.question_type]);

  switch (question.question_type) {
    case questionTypeEnums["MULTIPLE_CHOICE"]:
      return (
        <MultipleChoiceCard
          checked={checked}
          options={question.options}
          setAnswer={setAnswer}
        />
      );
    case questionTypeEnums["CAMERA"]:
      return (
        <SignToCameraCard
          webcamRef={webcamRef}
          canvasRef={signToCameraCanvasRef}
          question={question}
          setIsCorrect={setIsCorrect}
          setChecked={setChecked}
        />
      );
    case questionTypeEnums["MATCHING"]:
      return (
        <MatchingCard
          visualList={question.image_options}
          textList={question.text_options}
          questionId={question.question_id}
          setIsCorrect={setIsCorrect}
          setChecked={setChecked}
        />
      );
    case questionTypeEnums["FILL_IN_THE_BLANK"]:
      return (
        <FillInTheBlankCard
          checked={checked}
          setAnswer={setAnswer}
          checkAnswer={checkAnswer}
          visualCue={question.image_path}
        />
      );
    case questionTypeEnums["WATCH_TO_LEARN"]:
      return (
        <WatchToLearnCard
          webcamRef={webcamRef}
          canvasRef={watchToLearnCanvasRef}
          question={question}
          setIsCorrect={setIsCorrect}
          setChecked={setChecked}
        />
      );
  }

  return <h2>loading...</h2>;
}

/**
 * Renders a question card component for a lesson where all questions are presented, one by one.
 *
 * @param {object} props - The props object containing the unitId, lessonId, questions, and setComplete function.
 * @param {int} props.unitId - The ID of the unit the lesson belongs to.
 * @param {int} props.lessonId - The ID of the lesson.
 * @param {Array} props.questions - An array of question objects for the lesson.
 * @param {function} props.setComplete - A function to mark the lesson as complete.
 *
 * @returns {JSX.Element|null} The JSX element representing the question card, or null if the lesson is complete.
 */
function QuestionCard({ questions, setComplete, increaseNumAnswered }) {
  const { unitId } = useParams();
  const [answer, setAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionQueue, setQuestionQueue] = useState(
    Array(questions.length).fill(null)
  );
  const [isCorrect, setIsCorrect] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showCheckButton, setShowCheckButton] = useState(false);
  const webcamRef = useRef(null);
  const signToCameraCanvasRef = useRef(null);
  const watchToLearnCanvasRef = useRef(null);

  useEffect(() => {
    questions.map((question, index) => {
      questionQueue[index] = question;
    });
    setCurrentQuestion(questionQueue[0]);
  }, []);

  useEffect(() => {
    if (isCorrect) {
      increaseNumAnswered();
    }
  }, [isCorrect]);

  // callback function to move to the next question
  // or mark the lesson as complete if there's no more questions
  const nextQuestion = () => {
    // go to congrats page if this is the last question
    // and answered correctly
    const oldQuestion = questionQueue.shift();
    // queue up incorrect question
    if (!isCorrect || unitId == 4) {
      questionQueue.push({ ...oldQuestion });
    }

    if (questionQueue.length === 0) {
      setComplete(true);
      setCurrentQuestion(null);
      if (webcamRef?.current?.video && webcamRef.current.video.srcObject) {
        webcamRef.current.video.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    } else {
      // reset variables for the next question
      setCurrentQuestion(questionQueue[0]);
      setAnswer("");
      setIsCorrect(false);
      setChecked(false);
    }
  };

  // callback function to send the answer to the back end for evaluation
  // and set the value of 'isCorrect' as well as 'checked'
  const checkAnswer = async () => {
    const response = await fetch(
      `${api_url}/units/check-answer/${currentQuestion.question_type}/${currentQuestion.question_id}/${answer}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      response.json().then((data) => {
        setIsCorrect(data["is_correct"]);
      });
    }
    setChecked(true);
  };

  // currentQuestion set to null when
  // lesson is complete
  if (currentQuestion === null) {
    // return here when lesson is complete
    // to avoid rendering unecessary content
    return;
  }

  return (
    <div className="lesson-body">
      <div className="question-text">{currentQuestion.text}</div>
      <QuestionContent
        question={currentQuestion}
        checked={checked}
        setAnswer={setAnswer}
        setIsCorrect={setIsCorrect}
        setChecked={setChecked}
        setShowCheckButton={setShowCheckButton}
        checkAnswer={checkAnswer}
        webcamRef={webcamRef}
        signToCameraCanvasRef={signToCameraCanvasRef}
        watchToLearnCanvasRef={watchToLearnCanvasRef}
      />
      {/*<h2>Answer: {answer}</h2>*/}
      {showCheckButton && !checked && (
        <div className="check-button-container">
          <button
            className="check-button"
            disabled={answer == ""}
            onClick={checkAnswer}
          >
            Check
          </button>
        </div>
      )}

      {/* If the "Check" button is hit, show the "Next" buttoon */}
      {checked && (
        <div className={isCorrect ? "result-correct" : "result-incorrect"}>
          <div className="result-text">
            {isCorrect ? "Good Job!" : "Uh oh! Please Try Again!"}
          </div>
          <button className="next-button" onClick={nextQuestion}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Renders the body of the lesson page.
 *
 * @param {object} props - The props object containing the unitId, lessonId, and setComplete function.
 * @param {int} props.unitId - The ID of the unit the lesson belongs to.
 * @param {int} props.lessonId - The ID of the lesson.
 * @param {function} props.setComplete - A function to mark the lesson as complete.
 *
 * @returns {JSX.Element} The JSX element representing the body of the lesson page.
 */
function LessonBody({ lessonId, setComplete, increaseNumAnswered }) {
  const { data } = useQuery({
    queryKey: ["questions", lessonId],
    queryFn: () =>
      fetch(`${api_url}/units/${lessonId}/questions`).then((response) =>
        response.json()
      ),
  });

  useEffect(() => {
    const questions = data?.questions;
    questions?.map((question) => {
      switch (question.question_type) {
        case questionTypeEnums["WATCH_TO_LEARN"]: {
          if (!!!sessionStorage.getItem(question.sign))
            sessionStorage.setItem(
              question.sign,
              `${s3BaseUrl}/${question.sign}.webm`
            );
          break;
        }
        case questionTypeEnums["MULTIPLE_CHOICE"]:
          for (const option of question.options) {
            if (!!!sessionStorage.getItem(option)) {
              sessionStorage.setItem(option, `${s3BaseUrl}/${option}.webp`);
            }
          }

          break;
        case questionTypeEnums["MATCHING"]: {
          for (const option of question.image_options) {
            if (!!!sessionStorage.getItem(option)) {
              sessionStorage.setItem(option, `${s3BaseUrl}/${option}.webp`);
            }
          }
          break;
        }
        case questionTypeEnums["FILL_IN_THE_BLANK"]: {
          if (!!!sessionStorage.getItem(question.image_path)) {
            sessionStorage.setItem(
              question.image_path,
              `${s3BaseUrl}/${question.image_path}.webp`
            );
          }
          break;
        }
      }
    });
  }, [data?.questions]);

  if (data?.questions) {
    return (
      <QuestionCard
        questions={data.questions}
        setComplete={setComplete}
        increaseNumAnswered={increaseNumAnswered}
      />
    );
  }

  return <h2>loading...</h2>;
}

/**
 * Renders the information of the lesson.
 *
 * @param {object} props - The props object containing the lesson object.
 * @param {object} props.lesson - the lesson object
 *
 * @returns {JSX.Element} The JSX element representing the information of the lesson presented in the lesson header.
 */
function LessonInformation({ lesson, numAnswered, numTotal }) {
  const navigate = useNavigate();
  return (
    <div className="lesson-header">
      <div className="lesson-info">
        <div className="lesson-title">Lesson {lesson.lesson_id}</div>
        <div className="lesson-subtitle">{lesson.title}</div>
      </div>
      <progress
        className="progress-bar"
        max="100"
        value={`${(numAnswered / numTotal) * 100}`}
      ></progress>
      <div className="lesson-info">
        <AiFillCloseCircle
          className="close-lesson-button"
          onClick={() => navigate("/learn")}
        />
      </div>
    </div>
  );
}

/**
 * Renders the header of the lesson page.
 *
 * @param {object} props - The props object containing the unitId and lessonId parameters.
 * @param {int} props.unitId - The ID of the unit the lesson belongs to.
 * @param {int} props.lessonId - The ID of the lesson.
 *
 * @returns {JSX.Element|null} The JSX element representing the header.
 */
function LessonHeader({
  unitId,
  lessonId,
  numAnswered,
  numTotal,
  setNumTotal,
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["lessons", lessonId],
    queryFn: () =>
      fetch(`${api_url}/units/${unitId}/lessons/${lessonId}`).then((response) =>
        response.json()
      ),
  });

  useEffect(() => {
    if (data?.lesson) {
      setNumTotal(data.lesson.question_count);
      localStorage.setItem("lessonTitle", data.lesson.title);
    }
  }, [isLoading]);

  if (data?.lesson) {
    return (
      <LessonInformation
        lesson={data.lesson}
        numAnswered={numAnswered}
        numTotal={numTotal}
      />
    );
  }

  return <h2>loading...</h2>;
}

/**
 * Renders the lesson page component - a lesson container.
 *
 * @returns {JSX.Element} The JSX element representing the lesson page.
 */
function LessonPage() {
  const { unitId, lessonIndex, lessonId } = useParams();
  const [isComplete, setIsComplete] = useState(false);
  const [numAnswered, setNumAnswered] = useState(0);
  const [numQuestions, setNumQuestions] = useState(0);
  //const [motionRecognizerUrl, setMotionRecognizerUrl] = useState("");
  const [userExp, setUserExp] = useState(0);

  const increaseNumAnswered = () => {
    if (numAnswered + 1 == numQuestions) {
      setNumAnswered(numQuestions);
    } else {
      setNumAnswered(numAnswered + 1);
    }
  };

  useEffect(() => {
    createRecognizers({});
  }, []);

  useEffect(() => {
    if (isComplete) {
      // Increase experience points when the lesson is complete
      const totalExp = parseInt(localStorage.getItem("totalExp") || "0");
      localStorage.setItem("totalExp", totalExp + 100); // Add 100 exp for each completed lesson
      setUserExp(totalExp + 100);
    }
  }, [isComplete]);

  return (
    <div className="HomePage">
      <div className="HomeGlass">
        <div className="lesson-page">
          {isComplete ? (
            <LessonCompletePage unitId={unitId} lessonIndex={lessonIndex} />
          ) : (
            <>
              <LessonHeader
                unitId={unitId}
                lessonId={lessonId}
                numAnswered={numAnswered}
                numTotal={numQuestions}
                setNumTotal={setNumQuestions}
              />
              <LessonBody
                lessonId={lessonId}
                setComplete={setIsComplete}
                increaseNumAnswered={increaseNumAnswered}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
