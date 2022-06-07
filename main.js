const canvasHeight = 1920;
const canvasWidth = 1080;

var backgroundList;
var backgroundList2;
var bgKeyVal1;
var bgKeyVal2;

var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

$.getJSON("backgrounds.json", function(data) {      
    bgKeyVal1 = data; 
    backgroundList = Object.keys(data).sort(collator.compare);
    var select = document.getElementById("background-select-1")
    populateSelect(select, backgroundList);
});

$.getJSON("dialogue_backgrounds.json", function(data){
    bgKeyVal2 = data;
    backgroundList2 = Object.keys(data).sort(collator.compare);
    var select = document.getElementById("background-select-2")
    populateSelect(select, backgroundList2);
});

function drawBackground(){
    var ctx = document.getElementById("background-canvas").getContext("2d");
    var backgroundInput = document.getElementById("background-input");
    var backgroundSel = document.getElementById("background-select-1");
    var backgroundSel2 = document.getElementById("background-select-2");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    var backgroundImage = new Image();

    if (backgroundInput.value != ""){
        var file = backgroundInput.files[0];
        var reader = new FileReader();
        backgroundSel.selectedIndex = 0;
        backgroundSel2.selectedIndex = 0;
        drawDialogueBackground();
        reader.readAsDataURL(file);
        reader.onloadend = function(e){
            backgroundImage.src = e.target.result;
        }
    }
    else if (backgroundSel.value != ""){
        backgroundImage.src = "images/Backgrounds/" + bgKeyVal1[backgroundSel.value];
    }

    backgroundImage.onload = function(){
        var backgroundX = document.getElementById("background-x");
        var backgroundY = document.getElementById("background-y");
        this.width *= canvasHeight / this.height;
        this.height = canvasHeight;
        ctx.drawImage(backgroundImage, Number(backgroundX.value) + ((canvasWidth - this.width) / 2), Number(backgroundY.value) + ((canvasHeight - this.height) / 2), this.width, this.height);
    }
}

function drawDialogueBackground(){
    var ctx = document.getElementById("background2-canvas").getContext("2d");
    var backgroundSel = document.getElementById("background-select-2");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    var backgroundImage = new Image();

    if (backgroundSel.value != ""){
        backgroundImage.src = "images/Dialogue Backgrounds/" + bgKeyVal2[backgroundSel.value];
    }
    backgroundImage.onload = function(){
        this.width = 1625;
        this.height = 680;
        ctx.drawImage(backgroundImage, (canvasWidth - this.width) / 2, 234 , this.width, this.height);
    }
}

function drawTextBox(){
    var ctx = document.getElementById("text-box-canvas").getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if(document.getElementById("hide-checkbox").checked){
        return;
    }
    var textBox = new Image();
    textBox.onload = function(){
        ctx.drawImage(textBox, 0, 1344);
    }
    textBox.src = "images/Text box.png";
}

function drawNameBox(){
    var ctx = document.getElementById("name-box-canvas").getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if(document.getElementById("hide-checkbox").checked){
        return;
    }
    var nameBox = new Image();
    nameBox.onload = function(){
        ctx.drawImage(nameBox, 14, 1142);
    }
    nameBox.src = "images/Name box.png";
}

function drawText(){
    var textValue = document.getElementById("text-input").value;
    var ctx = document.getElementById("text-canvas").getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if(document.getElementById("hide-checkbox").checked){
        return;
    }
    ctx.font = "36pt System";
    ctx.textAlign = "left";
    ctx.strokeStyle = "rgb(15, 30, 40)";
    ctx.lineWidth = 8;
    ctx.fillStyle = "white";
    var lines = textValue.split("\n");
    var lineCount = (lines.length > 3) ? 3:lines.length;
    for (var i = 0; i < lineCount; i++){
        ctx.strokeText(lines[i], 60, 1525 + (i * 80));
        ctx.fillText(lines[i], 60, 1525 + (i * 80));
    }

    //draw name
    var nameValue = document.getElementById("name-input").value;
    ctx.font = "39pt System";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgb(50, 30, 10)";
    ctx.strokeText(nameValue, 311, 1321);
    ctx.fillText(nameValue, 311, 1321);
}

function drawPortrait(){
    var ctx = document.getElementById("portrait-canvas").getContext("2d");
    var portraitInput = document.getElementById("portrait-input");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (portraitInput.files){
        var file = portraitInput.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function(e){
            var image = new Image();
            image.src = e.target.result;
            image.onload = function(){
                var portraitX = document.getElementById("portrait-x");
                var portraitY = document.getElementById("portrait-y");
                this.width *= 1.25;
                this.height *= 1.25;
                ctx.drawImage(image, Number(portraitX.value) + ((canvasWidth - this.width) / 2), portraitY.value, this.width, this.height);
            }
        }
    }
}

function saveImage(){
    var background = document.getElementById("background-canvas");
    var darken = document.getElementById("darken-canvas");
    var dialogueBackground = document.getElementById("background2-canvas");
    var portrait = document.getElementById("portrait-canvas");
    var textBox = document.getElementById("text-box-canvas");
    var nameBox = document.getElementById("name-box-canvas");
    var text = document.getElementById("text-canvas");

    var newCanvas = document.createElement("canvas");
    var ctx = newCanvas.getContext("2d");
    newCanvas.width = canvasWidth;
    newCanvas.height = canvasHeight;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    [background, darken, dialogueBackground, portrait, textBox, nameBox, text].forEach(function(n){
        ctx.drawImage(n, 0, 0, canvasWidth, canvasHeight);
    });
    var link = document.createElement("a");
    link.download = "download.png";
    link.href = newCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    link.click();
}

function darkenBackground(){
    var ctx = document.getElementById("darken-canvas").getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (document.getElementById("darken-checkbox").checked){
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
}

function drawAll(){
    drawTextBox();
    drawNameBox();
    drawText();
}

function populateSelect(select, list){
    var fragment = document.createDocumentFragment();
    list.forEach(function(n){
        var option = document.createElement("option");
        option.innerHTML = n;
        option.value = n;
        fragment.appendChild(option);
    });
    select.appendChild(fragment);
}

window.onload = function(){
    var nameInput = document.getElementById("name-input");
    var textInput = document.getElementById("text-input");
    var portraitInput = document.getElementById("portrait-input");
    var backgroundInput = document.getElementById("background-input");
    var backgroundSel = document.getElementById("background-select-1");
    var backgroundSel2 = document.getElementById("background-select-2");
    var saveButton = document.getElementById("save-button");
    var darkenCheckbox = document.getElementById("darken-checkbox");
    var hideCheckbox = document.getElementById("hide-checkbox");
    var portraitX = document.getElementById("portrait-x");
    var portraitY = document.getElementById("portrait-y");
    var backgroundX = document.getElementById("background-x");
    var backgroundY = document.getElementById("background-y");

    window.applicationCache.addEventListener('updateready', function(e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            //New update available
            window.applicationCache.swapCache();
            window.location.reload();
        }
      });

    nameInput.addEventListener('keydown', drawText);
    textInput.addEventListener('keydown', drawText);
    portraitInput.addEventListener('change', drawPortrait);
    backgroundInput.addEventListener('change', drawBackground);
    backgroundSel.addEventListener('change', function(){
        backgroundInput.value = "";
        drawBackground();
    });
    backgroundSel2.addEventListener('change', drawDialogueBackground);
    saveButton.addEventListener('click', saveImage);
    darkenCheckbox.addEventListener('change', darkenBackground);
    hideCheckbox.addEventListener('change', drawAll);
    portraitX.addEventListener('change', drawPortrait);
    portraitY.addEventListener('change', drawPortrait);
    backgroundX.addEventListener('change', drawBackground);
    backgroundY.addEventListener('change', drawBackground);

    drawAll();
};