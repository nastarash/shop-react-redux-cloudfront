import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();
  const [isError, setIsError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setIsError(false);
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);
    const authorizationToken = localStorage.getItem("authorization_token");
    const authorizationErrorCodes = [401, 403];
    const name = file?.name || "";

    await axios({
      method: "GET",
      url,
      params: {
        name: encodeURIComponent(name),
      },
      headers: {
        Authorization: `Basic ${authorizationToken}`,
      },
    }).catch((error) => {
      if (authorizationErrorCodes.includes(error.response.status)) {
        setErrorMessage(
          error.response.data.Message || error.response.data.message
        );
        setIsError(true);
      }
    });
    console.log("File to upload: ", name);

    // const result = await fetch(response.data, {
    //   method: "PUT",
    //   body: file,
    // });
    // console.log("Result: ", result);
    // setFile("");
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
      <Snackbar open={isError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
