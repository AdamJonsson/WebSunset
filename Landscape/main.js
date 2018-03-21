

function GameObjects() {
    this.sky = Sky();
}

function Rotation(layer, amount, xPos, yPos) {
    this.layer = layer;
    this.layer.context.save();
    this.layer.context.translate(xPos, yPos);
    this.layer.context.rotate(amount * Math.PI / 180);

    this.amount = amount;
    this.xPos = xPos;
    this.yPos = yPos;

    this.undo = function() {
        this.layer.context.restore();
    }
}

function Layer(canvasID, canvasClass) {
    //Creating the canvas
    this.$canvas = document.createElement('canvas');
    this.$canvas.id = canvasID; this.$canvas.className=canvasClass;
    document.getElementById('art-container').append(this.$canvas); 

    //Creating the context for the canvas.
    this.context = this.$canvas.getContext("2d");
    this.context.canvas.width  = window.innerWidth;
    this.context.canvas.height = window.innerHeight;

    //Other
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.clearContext = function() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
}


var globalTime = 47;
var skyLayer = new Layer("skyLayer", "fixed-canvas");
var sky = new Sky(skyLayer);

var landscapeLayer_1 = new Layer("layerMount_1", "fixed-canvas");
var landscape_1 = new Landscape(landscapeLayer_1, "Landscape/IMAGES/mount1.png", landscapeLayer_1.$canvas.height * 0.45, landscapeColor_1, 0.05, false, function(){});

var landscapeLayer_2 = new Layer("layerMount_2", "fixed-canvas");
var landscape_2 = new Landscape(landscapeLayer_2, "Landscape/IMAGES/mount2.png", landscapeLayer_2.$canvas.height * 0.62, landscapeColor_2, 0.2, false,  function(){});

var landscapeLayer_3 = new Layer("layerMount_3", "fixed-canvas");
var landscape_3 = new Landscape(landscapeLayer_3, "Landscape/IMAGES/mount3.png", landscapeLayer_3.$canvas.height * 0.7, landscapeColor_3, 0.4, false,  function(){
    landscape_3.createTrees(["Landscape/IMAGES/tree1.png", "Landscape/IMAGES/tree2.png"], 125, 75, 150, 1.22);
});

var landscapeLayer_4 = new Layer("layerMount_4", "fixed-canvas");
var landscape_4 = new Landscape(landscapeLayer_4, "Landscape/IMAGES/mount4.png", landscapeLayer_3.$canvas.height * 0.8, landscapeColor_4, 0.6, true,  function(){
    landscape_4.createTrees(["Landscape/IMAGES/tree1.png", "Landscape/IMAGES/tree2.png"], 20, 175, 300, 1.2);
});


var canvasSwitch = false;
var hideCanvasTimeout = null;
function loop() {

    if(window.pageYOffset < skyLayer.height * 1.75) {
        globalTime += 1/120 * 1;
    
        skyLayer.clearContext();
        sky.update();
        sky.render();
    
        landscapeLayer_1.clearContext();
        landscape_1.render();
    
        landscapeLayer_2.clearContext();
        landscape_2.render();
    
        landscapeLayer_3.clearContext();
        landscape_3.render();
    
        landscapeLayer_4.clearContext();
        landscape_4.render();
    }

    if(window.pageYOffset > skyLayer.height * 1.75) {
        if(canvasSwitch) {
            hideCanvasTimeout = setTimeout(function() {
                document.getElementById("art-container").style.display = "none";
            }, 500)
            document.getElementById("new-body").classList.add("active");
        }
        canvasSwitch = false;
    }
    else {
        if(!canvasSwitch) {
            clearTimeout(hideCanvasTimeout);
            document.getElementById("art-container").style.display = "block";
            document.getElementById("new-body").classList.remove("active");
        }
        canvasSwitch = true;
    }

    requestAnimationFrame(loop)
}
loop();
