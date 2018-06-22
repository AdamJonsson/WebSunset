function CelestialBody(layer, horizonStart, offsetAngel = 0, lightRaysMode = true) {
    
    this.layer = layer;
    this.size = this.layer.width * 0.025;
    this.offsetAngel = offsetAngel;
    this.y = this.layer.height / 2;
    this.x = this.layer.width / 2;
    this.startX = this.layer.width * 0.2;
    this.startY = horizonStart - this.size/2;
    this.radius = this.layer.width * 0.5 - this.startX;

    this.lightRaysMode = lightRaysMode;
    this.amountOfLaightRays = 30;
    this.lightRaysRotation = [];
    this.lightRaysRotationSpeed = [];

    for(var i = 0; i < this.amountOfLaightRays; i++) {
        this.lightRaysRotationSpeed.push(Math.random() * 30 - 15);
        this.lightRaysRotation.push(360 * (i / this.amountOfLaightRays) + Math.random() * 20);
    }

    this.update = function() {
        this.x = this.radius*Math.sin(-(globalTime*6 + this.offsetAngel)*Math.PI/180) + this.startX + this.radius;
        this.y = this.radius*Math.cos(-(globalTime*6 + this.offsetAngel)*Math.PI/180) + this.startY;
    }

    this.render = function() {
        this.layer.context.beginPath();

        this.layer.context.arc(this.x,this.y,this.size,0,2*Math.PI);
        var grd = this.layer.context.createRadialGradient(this.x,this.y,this.size * 0.5,this.x,this.y,this.size);
        grd.addColorStop(0,"rgba(255, 255, 255, 1)");
        grd.addColorStop(1,"rgba(255, 255, 255, 0.75)");
        this.layer.context.fillStyle = grd;
        this.layer.context.fill();
        
        this.layer.context.closePath();

        if(lightRaysMode) {
            this.renderLightrays();
        }
    }

    this.renderLightrays = function(){
        for(var i = 0; i < this.amountOfLaightRays; i++) {
            this.layer.context.beginPath();
            var lightRotation = new Rotation(this.layer, this.lightRaysRotation[i] + globalTime * this.lightRaysRotationSpeed[i], this.x, this.y);

            this.layer.context.moveTo(-this.size / 2, 0);
            this.layer.context.lineTo(this.size / 2, 0);
            this.layer.context.lineTo(this.size * 10, -this.layer.height*2);
            this.layer.context.lineTo(-this.size * 10, -this.layer.height*2);

            var grd = this.layer.context.createLinearGradient(0,0,0,-this.layer.height*1);
            grd.addColorStop(0,"rgba(255, 255, 175, 0.03)");
            grd.addColorStop(1,"rgba(255, 255, 0, 0)");
            this.layer.context.fillStyle = grd;
            this.layer.context.fill();

            lightRotation.undo();
            this.layer.context.closePath();
        }
    }
}




function Stars(layer) {
    this.layer = layer;
    this.amountOfStars = 225;
    this.starsPos = [];
    this.lines = [];

    for(var i = 0; i < this.amountOfStars; i++) {
        if(this.layer.width > this.layer.height) var starSpawnRange = this.layer.width;
        else var starSpawnRange = this.layer.height;
        var starX = starSpawnRange * 2 * Math.random() - starSpawnRange;
        var starY = starSpawnRange * 2 * Math.random() - starSpawnRange;
        this.starsPos.push([starX, starY]);
    }

    for(var i = 0; i < this.starsPos.length; i++) {
        for(var a = i; a < this.starsPos.length; a++) {
            if(Math.hypot(this.starsPos[i][0]-this.starsPos[a][0], this.starsPos[i][1]-this.starsPos[a][1]) < this.layer.width * 0.1){
                this.lines.push([this.starsPos[i][0], this.starsPos[i][1], this.starsPos[a][0], this.starsPos[a][1]]);
            }
        }
    }

    this.render = function() {
        var starColor = getColorFromTime(globalTime, starsColor);
        var starRotation = new Rotation(this.layer, 1*globalTime, this.layer.width/2, this.layer.height);
        for(var i = 0; i < this.amountOfStars; i++) {
            this.layer.context.beginPath();
            this.layer.context.arc(this.starsPos[i][0],this.starsPos[i][1],this.layer.width * 0.001,0,2*Math.PI);
            this.layer.context.fillStyle = starColor;
            this.layer.context.fill();
            this.layer.context.closePath();
        }
        this.renderLines();
        starRotation.undo();
    }

    this.renderLines = function() {
        var lineColor = getColorFromTime(globalTime, starLinesColor);
        for(var i = 0; i < this.lines.length; i++) {
            this.layer.context.beginPath();
            this.layer.context.strokeStyle=lineColor;
            this.layer.context.moveTo(this.lines[i][0], this.lines[i][1]);
            this.layer.context.lineTo(this.lines[i][2], this.lines[i][3]);
            this.layer.context.stroke();
            this.layer.context.closePath();
        }
    }
}


function Cloud(layer, xPos, yPos, width, maxHeight, amountOfPoints, speedX, color) {
    this.layer = layer;
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.maxHeight = maxHeight;
    this.amountOfPoints = amountOfPoints;
    this.speedX = speedX;
    this.color = color;
    
    this.pointsSpeed = [];
    this.points = [{x: this.xPos, y: this.yPos, cx: this.xPos, cy: this.yPos}];
    for(var i = 1; i < this.amountOfPoints; i++){
        this.points[i] = {x: 0, y: 0, cx: 0, cy: 0};
        this.points[i].x = this.xPos + this.width/this.amountOfPoints * Math.random() + this.width/this.amountOfPoints * i;
        this.points[i].y = this.yPos - this.maxHeight * Math.random();
        this.points[i].cx = this.points[i].x + (this.points[i-1].x - this.points[i].x) * Math.random();
        this.points[i].cy = (this.points[i].y + this.points[i-1].y) / 2 - Math.random() * this.maxHeight / 2;
        this.pointsSpeed.push(-this.maxHeight*0.0002*Math.random());
    }
    
    var endPoint = {x: this.xPos + this.width, y: this.yPos, cx: this.xPos + this.width, cy: this.yPos - this.maxHeight*Math.random()}
    this.points.push(endPoint);
    this.pointsSpeed.push(-this.maxHeight*0.01*Math.random());

    var backPoint = {x: this.xPos, y: this.yPos, cx: this.xPos, cy: this.yPos}
    this.points.push(backPoint);
    this.pointsSpeed.push(0);

    this.copyCy = new Array();
    this.points.forEach(point => {
        this.copyCy.push(point.cy);
    });

    this.update = function() {
        this.xPos += this.speedX;
        for(var i = 0; i < this.points.length; i++) {
            this.points[i].cx += this.speedX;
            this.points[i].x += this.speedX;

            if(this.points[i].cy > this.copyCy[i] || this.points[i].cy < this.copyCy[i] - this.maxHeight) {
                this.pointsSpeed[i] *= -1;
            }
            if(i != 0) this.points[i].cy += this.pointsSpeed[i];
        }

        if(this.xPos > this.layer.width) this.resetCloud();
    }

    this.render = function() {
        this.update();
        this.layer.context.beginPath();
        this.layer.context.moveTo(this.xPos, this.yPos);
        for(var i = 0; i < this.points.length; i++) {
            this.layer.context.quadraticCurveTo(this.points[i].cx, this.points[i].cy, this.points[i].x, this.points[i].y);
        }
        this.layer.context.fillStyle = "rgba(255, 255, 255, 0.025)";
        this.layer.context.fill();
        this.layer.context.closePath();
    }

    this.resetCloud = function() {
        var amountToMoveBack = -this.layer.width - this.width;
        this.xPos = this.xPos + amountToMoveBack;
        for(var i = 0; i < this.points.length; i++) {
            this.points[i].cx += amountToMoveBack;
            this.points[i].x += amountToMoveBack;
        }
    }
}

function Clouds(layer) {
    this.layer = layer;
    this.amount = 10;
    this.clouds = [];

    for(var i = 0; i < this.amount; i++) {
        var amountOfPoints = 4 + Math.floor(Math.random() * 4);
        var xPos = Math.random() * this.layer.width;
        var yPos = Math.random() * this.layer.height;
        var maxHeight = Math.random() * this.layer.height * 0.05 + this.layer.height * 0.05 ;
        var cloudSpeed = this.layer.width * 0.00025 * (Math.random() + 0.1)
        var width = this.layer.width * 0.25;

        this.clouds.push(new Cloud(this.layer, xPos, yPos, width, maxHeight, amountOfPoints, cloudSpeed, "#ffffff"));
    }


    this.update = function() {
        this.xPos += speedX;
    }

    this.render = function(){
        for(var i = 0; i < this.clouds.length; i++) {
            this.clouds[i].render();
        }
    }
}

function Sky(layer) {

    this.layer = layer;
    this.horizon = this.layer.height * 0.75;
    this.sun = new CelestialBody(this.layer, this.horizon, 90, true);
    this.moon = new CelestialBody(this.layer, this.horizon, 270, false);
    this.stars = new Stars(this.layer);
    this.clouds = new Clouds(this.layer);

    this.render = function() {
        this.renderSky();
        this.stars.render();
        this.sun.render();
        this.clouds.render();
        this.moon.render();

    }

    this.renderSky = function() {
        this.layer.context.rect(0 ,0, this.layer.width, this.layer.height);
        var grd = this.layer.context.createLinearGradient(this.layer.width / 2,0,this.layer.width / 2, this.layer.height);
        grd.addColorStop(0,getColorFromTime(globalTime, skyColor));
        grd.addColorStop(1,getColorFromTime(globalTime + 3, skyColor));
        this.layer.context.fillStyle = grd;
        this.layer.context.fill();
    }

    this.update = function() {
        this.sun.update();
        this.moon.update();
    }
}