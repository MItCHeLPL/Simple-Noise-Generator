//Scale
var scale = document.getElementById("scaleInput");

//Layers
var layers = document.getElementById("layersInput");

//Color
var bckColor = document.getElementById("bckColor");

//Resolution
var resX = document.getElementById("resX");
var resY = document.getElementById("resY");

//Checkboxes
var rEnabled = document.getElementById("rCheckbox");
var gEnabled = document.getElementById("gCheckbox");
var bEnabled = document.getElementById("bCheckbox");

//Canvas
var canvas = document.getElementById("canvas");
var newCanvas = document.getElementById("newCanvas");
var ctx;
var imgData;
var grayScale;

//Saving
var date;

//Put image into canvas and generate art
function GenerateNoise()
{
    if(scale.value != 0 && resX.value != 0 && resY.value != 0 && layers.value != 0)
    {
        //Resize canvas to fit image
        canvas.width = resX.value; 
        canvas.height = resY.value; 

        //Put image into canvas
        ctx = canvas.getContext("2d");
        
        //Fill background
        ctx.fillStyle = bckColor.value;
        ctx.fillRect(0, 0, resX.value, resY.value);

        //Layer noise
        for(var j=1; j<=layers.value; j++)
        {
            //Get image data
            imgData = ctx.getImageData(0, 0, scale.value / j, scale.value / j);

            //Generate Noise
            for(var i=0; i<imgData.data.length; i+=4)
            {
                //Generate color for pixel
                //R
                imgData.data[i] = Math.floor(Math.random() * (255 + 1));

                //G
                imgData.data[i+1] = Math.floor(Math.random() * (255 + 1));

                //B
                imgData.data[i+2] = Math.floor(Math.random() * (255 + 1));

                //A
                imgData.data[i+3] = Math.floor(255/layers.value);

                //Grayscale
                grayScale = ((0.299 * imgData.data[i]) + (0.587 * imgData.data[i+1]) + (0.114 * imgData.data[i+2]));

                //R grayscale
                if(rEnabled.checked == false)
                {
                    imgData.data[i] = grayScale;
                }

                //G grayscale
                if(gEnabled.checked == false)
                {
                    imgData.data[i+1] = grayScale;
                }

                //B grayscale
                if(bEnabled.checked == false)
                {
                    imgData.data[i+2] = grayScale;
                }
            }

            //set width and hight of new canvas to fit the scale
            newCanvas.width = imgData.width;
            newCanvas.height = imgData.height;

            //put scaled noise into new canvas
            newCanvas.getContext("2d").putImageData(imgData, 0, 0);

            //scale new canvas onto the resolution of main canvas
            ctx.drawImage(newCanvas, 0, 0, resX.value, resY.value);   
        }
        
        //Show save button
        document.getElementById("saveButton").style.display = "initial";
    }
    else
    {
        //If scale or res is 0
        alert("Scale, resolution and layer count can't equal 0");
    }
}

//Save and download
function Save()
{
    date = new Date();
    date.setMonth(date.getMonth() + 1);

	let downloadLink = document.createElement('a');
	downloadLink.setAttribute('download', 'Noise_' + date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + '_' + date.getHours() + '-' + date.getMinutes() + '.png');
    
    canvas.toBlob(function(blob) 
    {
	    let url = URL.createObjectURL(blob);
	    downloadLink.setAttribute('href', url);
	    downloadLink.click();
    });
}