import React, { useState, useEffect } from "react";
import robot from "../assets/gifs/rbot.gif";
import baseUrl from "../components/baseUrl";
import Spinner from "../components/Spinner";
import imageBox from "../assets/imageBox.png";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import MicOffIcon from "@mui/icons-material/MicOff";
// speech
import useSpeechToText from "react-hook-speech-to-text";
// speech

import "./style.css";

const GeneratorPage = () => {
  const [inputVal, setInputVal] = useState("");
  const [img, setImg] = useState("");
  const [spin, setSpin] = useState(false);
  const handleChange = async (e) => {
    const value = e.target.value;
    setInputVal(value);
  };

  // speech started
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;
  // speech end
  const lastIndex = results.map((items) => {
    return items.transcript;
  });
  const lastItem = lastIndex[lastIndex.length - 1];

  // speech ended

  const handleClick = async () => {
    setSpin(true);
    const response = await baseUrl
      .post("/image/generator", {
        input:
          lastItem !== undefined && lastIndex !== ""
            ? lastItem || lastIndex[0]
            : inputVal,
      })
      .catch((err) => {
        console.log(err);
        alert(err.message, "please refresh and send text again");
        console.log("error");
      });
    if (response) {
      setImg(response.data.result);
      setSpin(false);
    }
  };

  const handleCollections = async () => {
    const imageURL = JSON.stringify(img);
    const response = await baseUrl
      .post("/imageCollection", {
        name:
          lastItem !== undefined && lastIndex !== ""
            ? lastItem || lastIndex[0]
            : inputVal,
        imageUrls: imageURL,
      })
      .catch((err) => {
        console.log(err);
      });
    if (response) {
      console.log(response);
      alert(response.data);
    }
  };

  return (
    <div>
      <div className="flex items-center  justify-center gap-12 mb-20 ">
        <img width={"200px"} src={robot ? robot : "robot"} alt="" />
        <h1 className="text-white text-3xl ">
          Let's create an image by Automated Text-to-Image Generator!
        </h1>
      </div>
      <div className="flex flex-col items-center justify-around">
        <div>
          <div className="formField">
            {/* speech start */}
            <ul className="text-white text-3xl text-center mt-8 mb-8">
              {lastItem || lastIndex[0]}

              {interimResult && <li>{interimResult} </li>}
            </ul>
            {/* speech end */}

            {/* we have to find the last index and put it in input then in request */}
            <TextField
              value={inputVal}
              label="Enter your text"
              variant="filled"
              style={{
                width: "89vh",
                backgroundColor: "lightBlue",
                borderRadius: "10px",
              }}
              onChange={(e) => {
                handleChange(e);
              }}
              name="input"
            />
          </div>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              onClick={handleClick}
              sx={{ width: "82vh" }}
              variant="contained"
              style={{ backgroundColor: "rgb(39, 195, 227)" }}
            >
              Generate Image
            </Button>
            {/* speech */}
            <Button
              onClick={() => {
                isRecording ? stopSpeechToText() : startSpeechToText();
              }}
              variant="contained"
              sx={{ backgroundColor: "#02091E" }}
            >
              {isRecording ? (
                <KeyboardVoiceIcon
                  onClick={() => {
                    isRecording ? stopSpeechToText() : startSpeechToText();
                  }}
                  style={{ color: "white" }}
                />
              ) : (
                <MicOffIcon
                  onClick={() => {
                    isRecording ? stopSpeechToText() : startSpeechToText();
                  }}
                  style={{ color: "white" }}
                />
              )}
            </Button>
            {/* speech end */}
          </Box>
        </div>

        <div>
          {/* mapped */}
          {img ? (
            <div className="imageBox">
              <div className="gridFour">
                {img.map((items, id) => {
                  return <img key={id} src={items.url} alt="" />;
                })}
              </div>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <div className="center">{spin ? <Spinner /> : null}</div>
              {/* <img className="logoImage" src={imageBox} alt="" /> */}
              <div className="logoImage"></div>
            </div>
          )}
          {img ? (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleCollections}
                style={{ backgroundColor: "rgb(39, 195, 227)" }}
              >
                Save in Collection
              </Button>
            </Box>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;
{
  /* {results.map((result) => (
                <li className="text-white text-3xl" key={result.timestamp}>
                  {result.transcript}
                </li>
              ))} */
}
