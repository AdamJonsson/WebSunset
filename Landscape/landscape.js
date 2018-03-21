function Tree(layer, imageSrc, xPos, yPos, width, height, maxRotation, paralax) {
    this.layer = layer;
    this.image = new Image();
    this.image.src = imageSrc;
    this.xPos = xPos; this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.maxRotation = 0.075;
    this.rotationSpeed = 0.00075 * Math.random();
    this.currentRotation = Math.random() * this.maxRotation;
    this.paralax = paralax;

    console.log(paralax)

    this.update = function() {
        this.currentRotation += this.rotationSpeed;
        if(Math.abs(this.currentRotation) > this.maxRotation) this.rotationSpeed *= -1;
    }

    this.render = function(paralax) {
        var offsetY = window.pageYOffset * paralax;

        this.layer.context.save();
        this.layer.context.translate(this.xPos + this.width/2, this.yPos + this.height);
        this.layer.context.rotate(this.currentRotation);
        this.layer.context.translate(-this.xPos - this.width/2, -this.yPos - this.height);
        this.layer.context.drawImage(this.image, this.xPos, this.yPos - offsetY, this.width, this.height);
        this.layer.context.restore();
    }
}

function Landscape(layer, image, offsetY = 0, color, paralax = 0.5, lastLayer = false, callback) {

    //Landscape other
    this.layer = layer
    this.color = color;
    this.offsetY = offsetY;
    this.paralax = paralax;
    this.lastLayer = lastLayer;

    //Landscape trees
    this.trees = [];

    //Landscape image
    this.landscapeImage = new Image();
    this.landscapeImage.src = image;

    //Loading the image
    var object = this;
    this.landscapeImage.onload = function(){
        if(object.layer.height < object.layer.width) {
            object.imageWidth =  object.layer.width;
            object.imageHeight =  object.layer.width * this.height / this.width;
        }
        else {
            object.imageHeight =  object.layer.height/2;
            object.imageWidth =  object.layer.height * this.width / this.height;
        }
        this.imageXPos = 0;
        this.imageYPos =  object.layer.height - object.imageHeight + offsetY;
        callback();
    }

    this.render = function(){

        var layerColor = getColorFromTime(globalTime, this.color)

        this.layer.context.clearRect(0, 0,  this.layer.width,  this.layer.height);

        this.layer.context.drawImage(this.landscapeImage, 0, offsetY - window.pageYOffset * this.paralax, this.imageWidth, this.imageHeight);
        this.trees.forEach(tree => {
            tree.update();
            tree.render(this.paralax);
        });
        if(this.lastLayer) {
            this.layer.context.fillStyle = layerColor;
            this.layer.context.fillRect(0, this.offsetY - window.pageYOffset * this.paralax + this.imageHeight -1, this.layer.width, this.layer.height*2);
        }

        this.layer.context.globalCompositeOperation = "source-atop";
        this.layer.context.fillStyle = layerColor;
        this.layer.context.fillRect(0, 0,  this.layer.width,  this.layer.height);
        this.layer.context.globalCompositeOperation = "source-over";
    }

    this.createTrees = function(imageSrc, amount, width, height, spawnSpawOfHeight = 1) {
        console.log("Image height: " + this.imageHeight);
            for(var i = 0; i < amount; i++) {
            var treeX = Math.random() * this.imageWidth;
            var treeY = this.offsetY*spawnSpawOfHeight - height*Math.random();
            var treeIndex = Math.floor(Math.random() * imageSrc.length);
            var treeParalax = this.paralax;
            this.trees.push(new Tree(this.layer, imageSrc[treeIndex], treeX, treeY, width, height + Math.random() * height*0.1, treeParalax));
        }
    }
}