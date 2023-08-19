const videobtn = document.querySelector("#video");
const createTmpbtn = document.querySelector("#createTimestamp");
const clearTmpbtn = document.querySelector("#clearTimestamp");
const viewer = document.querySelector("#viewer");
const videosource = document.createElement("video");
const timestampsArea = document.querySelector("#timestamps");
const saveFileBtn = document.querySelector("#saveFilebtn");

let timestamps_Data = {};


URL = window.URL || window.webkitURL;

videobtn.addEventListener("change", (e) => {
    let ev_file = e.target.files[0];
    let vd = createVideoBlobURL(ev_file);

    // Reset
    timestamps_Data = {};
    timestamps_Data.timestamps = [];
    timestamps_Data.filename = e.target.value.slice(12);

    timestampsArea.innerHTML = "";

    changeVideoView(vd);
});

function changeVideoView(url) {
    videosource.src = url;
    videosource.canPlayType = "video/mp4";
    videosource.controls = true;

    viewer.innerHTML = "";
    viewer.append(videosource);
}

function createVideoBlobURL(blob) {
    let url = URL.createObjectURL(blob);
    return url;
}

saveFileBtn.addEventListener("mousedown", (e) => {
    let dataToString = JSON.stringify(timestamps_Data);
    saveTimestamps("json", dataToString)
});

function saveTimestamps(type, data) {
    let blobObj = new Blob([data], {type: 'octet/stream'});
    let blobURL = window.URL.createObjectURL(blobObj);

    let simulatedLink = document.createElement("a")
    simulatedLink.href = blobURL;
    simulatedLink.download = "tstagdata.json";
    simulatedLink.click();
}

function clearTimestamps() {
    timestamps_Data.timestamps = [];
    renderTimestamps();
}

clearTmpbtn.addEventListener("click", (e) => { clearTimestamps(); });

function renderTimestamps() {
    timestampsArea.innerHTML = "";

    for (i in timestamps_Data.timestamps) {
        let span = document.createElement("span");
        span.innerHTML = timestamps_Data.timestamps[i];

        if (i % 2 == 0) { 
            span.className = "tspStart"; 
            span.title = "start time";
        } 
        else { 
            span.className = "tspEnd";
            span.title = "end time"; 
        }

        timestampsArea.appendChild(span);
    }

    let spanref = document.querySelectorAll("#timestamps > span");

    if (spanref.length > 0) {
        spanref.forEach(element => {
            element.addEventListener("click", (e) => { 
                handleVideo("currentTime", e.target.innerHTML);
            });
        });
    };
    
}

function handleVideo(option, value) {
    let viewer_video = document.querySelector("video");

    if (option == "currentTime") { 
        //viewer_video.pause();
        viewer_video.currentTime = value; 
    }
}

createTmpbtn.addEventListener("click", (e) => { createTimestamp(); });

function createTimestamp() {
    let viewer_video = document.querySelector("video");
    let currentTime = viewer_video.currentTime;
    let tspdata = timestamps_Data.timestamps;

    viewer_video.pause();

    if (!tspdata.includes(currentTime)) {
        timestamps_Data.timestamps.push(currentTime);
    }

    timestamps_Data.timestamps.sort((a, b) => { return a - b; })
    renderTimestamps();
}

