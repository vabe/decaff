import { parser } from "./index.js";
//import { caff } from "./index";

function upload() {
  let photo = document.getElementById("file").files[0];
  let formData = new FormData();

  formData.append("photo", photo);
  console.log(photo);
  var reader = new FileReader();
  reader.onload = function (e) {
    // binary data
    require(["parser"], function () {
      parser.parse(e.target.result);
    });
    console.log(e.target.result);
  };
  reader.onerror = function (e) {
    // error occurred
    console.log("Error : " + e.type);
  };
  reader.readAsBinaryString(photo);
}
