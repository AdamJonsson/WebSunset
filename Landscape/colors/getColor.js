function getColorFromTime(time, colorData) {
    var dayLength = 60;
    var timeInDay = time % dayLength;
    var finalColor = "rgba(0, 0, 0, 1)";

    colorData.forEach(color => {
        if(timeInDay > color.start && timeInDay < color.end || (color.start > color.end && (timeInDay > color.start || timeInDay < color.end))) {
            if(color.mode == "static") {
                finalColor = "rgba("+color.red+", "+color.green+", "+color.blue+", "+color.alpha+")";
            }
            else if (color.mode = "moving") {
                if(color.start > color.end) {
                    var colorRatio = (timeInDay - color.start) / (color.end - color.start + dayLength);
                    if(colorRatio < 0) colorRatio = (timeInDay - color.start + dayLength) / (color.end - color.start + dayLength);
                }
                else {
                    var colorRatio = (timeInDay - color.start) / (color.end - color.start);
                }
                
                var green = parseInt(color.endG * colorRatio + color.startG * (1 - colorRatio));
                var blue = parseInt(color.endB * colorRatio + color.startB * (1 - colorRatio));
                var red = parseInt(color.endR * colorRatio + color.startR * (1 - colorRatio));
                var alpha = (color.endA * colorRatio + color.startA * (1 - colorRatio));

                finalColor = "rgba("+red+", "+green+", "+blue+", "+alpha+")";
            }
        }
    });

    return finalColor;
}