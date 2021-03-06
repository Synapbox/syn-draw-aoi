var tableRows = '';
var Paper = can.Control(
    {
        defaults: {
            rect: {
                minWidth: 10,
                minHeight: 10
            }
        }
    },
    {
        init: function() {
            this.element.on('mousedown.paper', $.proxy(this.startDrawRect, this));
        },
        startDrawRect: function(e) {
            // Get canvas offset
            var offset = this.element.offset();
            this.canvasOffsetLeft = offset.left;
            this.canvasOffsetTop = offset.top;

            // Save start positions
            this.drawStartX = e.pageX - this.canvasOffsetLeft;
            this.drawStartY = e.pageY - this.canvasOffsetTop;

            // Create the rectangle
            this.drawingRect = this.createRect(this.drawStartX, this.drawStartY, 0, 0);

            // Bind event handlers
            this.element.on('mousemove.paper', $.proxy(this.drawRect, this));
            this.element.on('mouseup.paper', $.proxy(this.endDrawRect, this));
        },
        createRect: function(x, y, w, h) {
            return $('<div/>').addClass('rect').css({
                left: x,
                top: y,
                width: w,
                height: h
            }).appendTo(this.element);
        },
        drawRect: function(e) {

            var currentX = e.pageX - this.canvasOffsetLeft;
            var currentY = e.pageY - this.canvasOffsetTop;

            // Calculate the position and size of the rectangle we are drawing
            var position = this.calculateRectPos(this.drawStartX, this.drawStartY, currentX, currentY);

            // Set position and size
            this.drawingRect.css(position);
            
        },
        endDrawRect: function(e) {
            var currentX = e.pageX - this.canvasOffsetLeft;
            var currentY = e.pageY - this.canvasOffsetTop;

            // Calculate the position and size of the rectangle we are drawing
            var position = this.calculateRectPos(this.drawStartX, this.drawStartY, currentX, currentY);

            if (position.width < this.options.rect.minWidth || 
                position.height < this.options.rect.minHeight || 
                (currentX-this.drawStartX) < 0 || 
                (currentY-this.drawStartY) < 0) 
            {

                // The drawn rectangle is too small, remove it
                this.drawingRect.remove();
            }
            else {
                
                // Set position and size
                this.drawingRect.css(position);

                //table
                tableRows = tableRows + 
                    '<tr>' + 
                        '<td>' + Math.round(this.drawStartX) + '</td>' +  
                        '<td>' + Math.round(this.drawStartY) + '</td>' +  
                        '<td>' + (currentX-this.drawStartX) + '</td>' + 
                        '<td>' + (currentY-this.drawStartY) + '</td>' + 
                    '</tr>'; 

                $('#table').html('<table>' + tableRows + '</table>');
            }

            // Unbind event handlers
            this.element.off('mousemove.paper');
            this.element.off('mouseup.paper');

            //alert(this.drawStartX + ',' +  this.drawStartY + ',' + (currentX-this.drawStartX) + ',' +  (currentY-this.drawStartY));
        },
        calculateRectPos: function(startX, startY, endX, endY) {

            var width = endX - startX;
            var height = endY - startY;
            var posX = startX;
            var posY = startY;

            //wrong measure
            if (width < 0) {
                width = Math.abs(width);
                posX -= width;
            }

            //wrong measure
            if (height < 0) {
                height = Math.abs(height);
                posY -= height;
            }

            return {
                left: posX,
                top: posY,
                width: width,
                height: height
            };
        }
    }
);

$(function() {
    var paper = new Paper('#canvas', {});
});

$(document).mousemove(function(e){
    e.pageY = e.pageY - 8;
    e.pageX = e.pageX - 8;
    $('#coordinates').html('x: ' + e.pageX + ' y : ' + e.pageY);
});