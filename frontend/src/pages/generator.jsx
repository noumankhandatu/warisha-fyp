import React, { useState } from "react";
import robot from "../assets/gifs/rbot.gif";
import baseUrl from "../components/baseUrl";
import Spinner from "../components/Spinner";
import imageBox from "../assets/imageBox.png";
import TextField from "@mui/material/TextField";
import "./style.css";
import { Button } from "@mui/material";
import { Box } from "@mui/system";

const GeneratorPage = () => {
  const [inputVal, setInputVal] = useState("");
  const [img, setImg] = useState("");
  const [spin, setSpin] = useState(false);

  const handleChange = async (e) => {
    setInputVal(e.target.value);
    const name = e.target.name;
    const value = e.target.value;
    setInputVal({ ...inputVal, [name]: value });
  };
  const handleClick = async () => {
    setSpin(true);
    const response = await baseUrl
      .post("/image/generator", inputVal)
      .catch((err) => {
        console.log(err);
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
        name: inputVal.input,
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
            <TextField
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
          <Button
            onClick={handleClick}
            sx={{width: "89vh" , mb: 2}}
            variant="contained"
            style={{ backgroundColor: "rgb(39, 195, 227)" }}
          >
            Generate Image
          </Button>
        </div>
        <div>
          {/* mapped */}
          {img ? (
            <div className="imageBox">
              <div className="gridTwo">
                {img.map((items, id) => {
                  return <img key={id} src={items.url} alt="" />;
                })}
              </div>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <div className="center">{spin ? <Spinner /> : null}</div>
              <img className="logoImage" src={imageBox} alt="" />
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
