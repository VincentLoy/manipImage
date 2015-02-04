(function ($){
    //variables
    var canvas, ctx, img, imageData, data, hexTab, sortedHexTab, sortedRgbTab, avgTab, originalData, downloadEl;
    //btn
    var btn_invert, btn_generate_hex,btn_generate_avg, 
        restore_img, btn_grayscale, btn_wtf_1, btn_oldTv,
        saveBtn, btn_sort_hex, btn_sort_rgb, btn_sort_pixels;
    var consoleMsg = $("#consoleList");
    
    
    
    canvas = document.getElementById('picture');
    ctx = canvas.getContext('2d');
    
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = canvas.querySelector('img').src;
    
    img.onload = function() {
        draw(this);
    };
    
    function draw(img){
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
        data = imageData.data;
        saveOriginalData();
        
        //effets
        var invert = function() {
            for(var i = 0 ; i< data.length ; i += 4) {
                data[i] = 255-data[i];
                data[i+1] = 255-data[i+1];
                data[i+2] = 255-data[i+2];
            }
            var msg = "les couleurs de l'image ont été inversées";
            consoleMsg.prepend('<li class="success"> <i class="glyphicon glyphicon-thumbs-up"></i> '+msg+"</li>");
            ctx.putImageData(imageData, 0, 0);
        };
        
        var restoreImg = function(){
            for(var i = 0 ; i< data.length ; i += 4) {
                data[i] = originalData[i];
                data[i+1] = originalData[i+1];
                data[i+2] = originalData[i+2];
                data[i+3] = originalData[i+3];
            }
            var msg = "l'image a été restaurée.";
            consoleMsg.prepend('<li class="success"> <i class="glyphicon glyphicon-thumbs-up"></i> '+msg+"</li>");
            ctx.putImageData(imageData, 0, 0);
        }
        
        var grayscale = function(){
            var avg;

            for(var i = 0 ; i < data.length ; i += 4){
               avg = parseInt((data[i]+data[i+1]+data[i+2])/3);
                data[i] = avg;
                data[i+1] = avg;
                data[i+2] = avg;
            }
            var msg = "l'image est en nuances de gris";
                consoleMsg.prepend('<li class="success"> <i class="glyphicon glyphicon-info-sign"></i> '+msg+"</li>");
            
            ctx.putImageData(imageData, 0, 0);
        }
        
        //WTF
        var wtfEffect_1 = function() {
            for(var i = 0 ; i < data.length ; i += 4){
                data[i] = data[i+12+100];
                data[i+1] = data[i+13+200];
                data[i+2] = data[i+14+300];
            }
            var msg = "Vous avez appliqué un effet devastateur à l'image :O";
                consoleMsg.prepend('<li class="error"> <i class="glyphicon glyphicon-info-sign"></i> '+msg+"</li>");
            
            ctx.putImageData(imageData, 0, 0);
        }
        
        var oldTvEffect = function() {
            if(avgTab != null){
                var swap = true;
                for(var i = 0 ; i < data.length ; i += 4){
                    if(swap){
                        data[i] = avgTab[i+4];
                        data[i+1] = avgTab[i+5];
                        data[i+2] = avgTab[i+5];
                        swap = false;
                    }
                    else{
                        swap = true;
                    }
                }
                var msg = "Filtre de vieille TV appliqué";
                    consoleMsg.prepend('<li class="success"> <i class="glyphicon glyphicon-info-sign"></i> '+msg+"</li>");

                ctx.putImageData(imageData, 0, 0);
            }
            else{
               var msg = "Vous Devez générer un tableau de moyenne avant !";
                    consoleMsg.prepend('<li class="error"> <i class="glyphicon glyphicon-warning-sign"></i> '+msg+"</li>"); 
            }
        }
        
        //outils
        var buildHexTab = function(){
            hexTab = new Array();
            var j = 0;
            for(var i = 0 ; i < data.length ; i += 4){
                hexTab[j] = rgbToHex(data[i], data[i+1], data[i+2]);
                j++;
            }
            if(hexTab != null) {
                var msg = "l'image a été sauvegardée dans un tableau en valeur Hexadecimales";
                consoleMsg.prepend('<li class="success"> <i class="glyphicon glyphicon-info-sign"></i> '+msg+"</li>");
                console.log(hexTab);
            }
        };
        
        var buildAvgTab = function(){
            avgTab = [];
            var avg;

            for(var i = 0 ; i < data.length ; i += 4){
               avg = parseInt((data[i]+data[i+1]+data[i+2])/3);
                avgTab[i] = avg;
                avgTab[i+1] = avg;
                avgTab[i+2] = avg;
                avgTab[i+3] = 255;
            }
            var msg = "l'image a été sauvegardée en nuances de gris";
                consoleMsg.prepend('<li class="success"> <i class="glyphicon glyphicon-info-sign"></i> '+msg+"</li>");
        };
        
        var sortHexTab = function() {
            if(hexTab == undefined){
                buildHexTab();
            }
            sortedHexTab = hexTab.sort();
            
            /*for(var i = hexTab.length-1; i >= 0; i--){
                var tmp;
                for(var j = hexTab.length-1; j >= 0 ; i--){
                    if(hexTab[j]<hexTab[i]){
                        temp = hexTab[j];
                        sortedHexTab[j] = hexTab[i];
                        sortedHexTab[i] = tmp;
                    }
                }
            }*/
            if(hexTab.length == sortedHexTab.length){
                var msg = "le tableau d'hexa a été trié avec succès";
                consoleMsg.prepend('<li class="success"> <i class="glyphicon glyphicon-info-sign"></i> '+msg+"</li>");
                console.log(sortedHexTab);
            }
            else{
                var msg = "Une erreur s'est produite lors du tri des hexadécimales";
                consoleMsg.prepend('<li class="error"> <i class="glyphicon glyphicon-info-sign"></i> '+msg+"</li>");
            }
        };
        
        var sortRgbTab = function() {
            if(sortedHexTab == undefined){
                sortHexTab();
            }
            sortedRgbTab = [];
            var currentColor;
            var j = 0;
            for(var i = 0; i < data.length ; i += 4){
                currentColor = HexToRgb(sortedHexTab[j]);
                sortedRgbTab[i] = currentColor[0];
                sortedRgbTab[i+1] = currentColor[1];
                sortedRgbTab[i+2] = currentColor[2];
                sortedRgbTab[i+3] = 255;
                j++;
            }
            var msg = "le tableau RGB trié généré avec succès";
                consoleMsg.prepend('<li class="success"> <i class="glyphicon glyphicon-info-sign"></i> '+msg+"</li>");
            console.log(sortedRgbTab);
        };
        
        var sortImgColors = function() {
            if(sortedHexTab == undefined){
                sortRgbTab();
            }
            for(var i = 0; i<data.length ; i+=4){
                data[i] = sortedRgbTab[i];
                data[i+1] = sortedRgbTab[i+1];
                data[i+2] = sortedRgbTab[i+2];
                data[i+3] = sortedRgbTab[i+3];
            }
            ctx.putImageData(imageData, 0, 0);
        };
        
        var fireClick = function(el) {
            var evObj;
            if (el.fireEvent) {
                return el.fireEvent('onclick');
            } 
            else {
                evObj = document.createEvent('Events');
                evObj.initEvent('click', true, false);
                return el.dispatchEvent(evObj);
            }
        };
        
        //Definition des btn
        btn_invert = document.getElementById("btn_invert");
        btn_generate_hex = document.getElementById("btn_generate_hex_tab");
        btn_generate_avg = document.getElementById("btn_generate_avg_tab");
        restore_img = document.getElementById("restore");
        btn_grayscale = document.getElementById("btn_grayscale");
        btn_wtf_1 = document.getElementById("btn_wtf_1");
        btn_oldTv = document.getElementById("btn_old_tv");
        saveBtn = document.getElementById("save");
        downloadEl = document.getElementById('download'); //not a btn
        btn_sort_hex = document.getElementById("btn_sort_hex");
        btn_sort_rgb = document.getElementById("btn_sort_rgb");
        btn_sort_pixels = document.getElementById("btn_sort_pixels");
        
        //action des btn
        btn_invert.addEventListener("click", invert);
        btn_generate_hex.addEventListener("click", buildHexTab);
        btn_generate_avg.addEventListener("click", buildAvgTab);
        restore_img.addEventListener("click", restoreImg);
        btn_grayscale.addEventListener("click", grayscale);
        btn_wtf_1.addEventListener("click", wtfEffect_1);
        btn_oldTv.addEventListener("click", oldTvEffect);
        btn_sort_hex.addEventListener("click", sortHexTab);
        btn_sort_rgb.addEventListener("click", sortRgbTab);
        btn_sort_pixels.addEventListener("click", sortImgColors);
        
        saveBtn.addEventListener('click', function() {
            downloadEl.href = canvas.toDataURL('image/png');
            var msg = "l'image a été téléchargée";
            consoleMsg.prepend('<li class="success"> <i class="glyphicon glyphicon-download"></i> '+msg+"</li>");
            return fireClick(download);
        });
        
        //methodes      
        function rgbToHex(r,g,b){
            var bin = r << 16 | g << 8 | b;
            return (function(h){
                return new Array(7-h.length).join("0")+h
            })(bin.toString(16).toUpperCase());
        }
        
        function HexToRgb(hex) {
            //hex = parseInt(hex);
            var r = parseInt(hex.substring(0,2),16);
            var g = parseInt(hex.substring(2,4),16);
            var b = parseInt(hex.substring(4,6),16);
            //console.log(hex+" to "+r+" "+g+" "+b);
            return [r,g,b];
        }
        
        function saveOriginalData(){
            originalData = [];
            for(var i = 0 ; i < data.length ; i += 4){
                originalData[i] = data[i];
                originalData[i+1] = data[i+1];
                originalData[i+2] = data[i+2];
                originalData[i+3] = data[i+3];
            }
            if(originalData.length != data.length){
                console.error("Le tableau original n'a pas été sauvegardé !");
                var msg = "l'image originale n'a pas pu être sauvegardée :(";
                consoleMsg.prepend('<li class="error"> > '+msg+"</li>");
            }
            else{
                var msg = "l'image originale a bien été sauvegardée";
                consoleMsg.prepend('<li class="success"> <i class="glyphicon glyphicon-info-sign"></i> '+msg+"</li>");
            }
        }
    }
    
    
})(jQuery);