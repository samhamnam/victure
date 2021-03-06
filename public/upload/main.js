/*jshint esversion: 6 */
var fileToUpload;

function sendFile() {
    var formContent = new FormData();
    formContent.append("image", fileToUpload);
    formContent.append("name", "file");

    //formContent.append("password", document.getElementById("upload-after-buttons-password").value);

    var selectedTime = 0;
    var timeoutRange = document.getElementById("timeout-range").value;
    if (timeoutRange == 1) {
        selectedTime = 5;
    } else {
        selectedTime = timeoutRange * 5;
    }
    formContent.append("deleteTime", selectedTime);

    var request = new XMLHttpRequest();
    request.open("POST", "/file_upload", true);
    request.setRequestHeader("file", "image");
    request.send(formContent);

    request.onreadystatechange = function () {
        if (request.readyState == XMLHttpRequest.DONE) {
            window.open(request.responseText, "_blank");
            var tempIframe = document.createElement("iframe");
            tempIframe.style.display = "none";
            tempIframe.src = request.responseText;
            document.body.appendChild(tempIframe);
        }
    };
}

function fileUpload() {
    document.getElementById("file-input").click();
}

function dropHandler(ev) {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        for (i = 0; i < ev.dataTransfer.items.length; i++) {
            if (ev.dataTransfer.items[i].kind === "file") {
                //document.getElementById("test-image-inside").src = URL.createObjectURL(ev.dataTransfer.files[i]);
                setImage(ev.dataTransfer.files[i]);
                fileToUpload = ev.dataTransfer.files[i];
                uploadFinished();
            }
        }
    }
    removeDragData(ev);
}

function setImage(file) {
    if (file.type.includes("image")) {
        document.getElementById("test-image-inside").src = URL.createObjectURL(file);
    } else if (file.type.includes("video")) {
        var videoParent = getParentAndRemoveImage();
        var videoPlayer = document.createElement("video");
        var videoPlayerSource = document.createElement("source");
        videoPlayerSource.src = URL.createObjectURL(file);
        videoPlayerSource.type = file.type;
        videoPlayer.controls = true;
        videoPlayer.classList.add("videoPlayer");
        videoPlayer.appendChild(videoPlayerSource);
        videoParent.appendChild(videoPlayer);
    } else {
        var fileParent = document.getElementById("test-image-inside").parentElement;
        document.getElementById("test-image-inside").src = "/upload/file.svg";

        var fileNameElement = document.createElement("p");
        fileNameElement.innerHTML = file.name;
        fileParent.appendChild(fileNameElement);
    }
    console.log(file.type);

    function getParentAndRemoveImage() {
        var imageParent = document.getElementById("test-image-inside").parentElement;
        imageParent.removeChild(document.getElementById("test-image-inside"));
        return imageParent;
    }
}

function fileUploadButton(file) {
    setImage(file[0]);
    fileToUpload = file[0];
    uploadFinished();
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

function removeDragData(ev) {
    if (ev.dataTransfer.items) {
        ev.dataTransfer.items.clear();
    } else {
        ev.dataTransfer.clearData();
    }
}

function uploadFinished() {
    document.getElementById("upload-div").style.display = "none";
    document.getElementById("upload-after-container").style.display = "block";
}

function updateDeleteTimer() {
    var selectedTime = 0;
    var timeoutRange = document.getElementById("timeout-range").value;

    if (timeoutRange == 1) {
        selectedTime = 5;
    } else {
        selectedTime = timeoutRange * 5;
    }

    document.getElementById("timeout-time-a").innerHTML = "Automatically deletes after " + selectedTime + " minutes.";
}
updateDeleteTimer();

function reloadPage() {
    location.reload();
}

function openLink(link) {
    window.open(link, "_self");
}