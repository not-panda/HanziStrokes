/**
* Author Ryan Guo
* This class is used to demostrate Chinese characters by strokes
*/
function HanziStrokes(config){

    var canvas_id    = "";    
    var data         = "";    
    var color_canvas = "#ccccff";
    var color_shadow = "#ffcccc";
    var color_stroke = "#000000";
    var color_border = "#000000";

    var interval_char = 800;
    var interval_stroke = 400;
    var interval_point = 20;
    var point_batch = 2;

    var debug = false;

    var stroke_arr = [];

    //set canvas id
    if(config.canvas_id){
        this.canvas_id=config.canvas_id;
    }

    var canvas=document.getElementById(this.canvas_id);
    var ctx = canvas.getContext('2d');

    //set colors
    if(config.color_canvas){
        this.canvas_id=config.canvas_id;
    }

    if(config.color_shadow){
        this.color_shadow=config.color_shadow;
    }

    if(config.color_stroke){
        this.color_stroke=config.color_stroke;
    }

    if(config.color_border){
        this.color_border=config.color_border;
    }

    //time gap between displaying chars
    if(config.interval_char){
        this.interval_char=config.interval_char;
    }

    //time gap between displaying strokes
    if(config.interval_stroke){
        this.interval_stroke=config.interval_stroke;
    }

    //time gap between drawing points
    if(config.interval_point){
        this.interval_point=config.interval_point;
    }

    //how many points draw in every frame
    if(config.point_batch){
        this.point_batch=config.point_batch;
    }

    //if show grids and debug informations
    if(config.debug){
        this.debug=config.debug;
    }

    //set data
    if(config.data){
        this.data=config.data;
        //console.log(this.canvas_id);
        stroke_arr = [];
        var stroke_data_arr = this.data.split("#");
        for(var i = 0; i < stroke_data_arr.length; i++){
            var point_data_arr = stroke_data_arr[i].split("-");
            point_arr=[]
            for(var j = 0; j < point_data_arr.length ; j++){
                //stroke_arr.push(point_arr[j].split(","));    
                point_arr.push(point_data_arr[j].split(","));
            }
            stroke_arr.push(point_arr);
        }
    }

    //draw background
    this.draw_backround=function(){

    };

    //show
    this.show=function(){
        //console.log(canvas);
        draw_shadow();
    };

    //
    function draw_shadow(){
        for(var i = 0 ; i < stroke_arr.length; i++){
            for( var j = 0; j < stroke_arr[i].length; j++){
                var stroke = stroke_arr[i];
                var p0 = stroke[j];
                if( j < stroke.length - 2) {
                    var p1 = stroke[j + 1];
                    var p2 = stroke[j + 2];
                    draw_triangle(color_shadow,p0,p1,p2)
                } 
                if( j < stroke.length - 3) {
                    var p1 = stroke[j + 2];
                    var p2 = stroke[j + 3];
                    draw_triangle(color_shadow,p0,p1,p2)
                }
            }
        }
    }

    //
    function draw_line(color,p0,p1){        
        ctx.beginPath();
        ctx.moveTo(p0[0],p0[1]);
        ctx.lineTo(p1[0],p1[1]);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    //
    function draw_triangle(color,p0,p1,p2){
        ctx.beginPath();
        ctx.moveTo(p0[0],p0[1]);
        ctx.lineTo(p1[0],p1[1]);
        ctx.lineTo(p2[0],p2[1]);
        ctx.lineTo(p0[0],p0[1]);
        if(debug){
            ctx.strokeStyle = color_stroke;
            ctx.stroke();
        }
        ctx.fillStyle=color;
        ctx.fill();
    }

    // global variables to store current status
    var current_stroke = 0;
    var current_point = 0;
    var need_refresh = false;
    var time_to_sleep = interval_point;
    var new_stroke=false;

    //do animation
    this.animate=function(){  
        if(need_refresh){
            draw_shadow();
            need_refresh = false;
            time_to_sleep = interval_point;
        }
        if(new_stroke){
            new_stroke=false;
            time_to_sleep = interval_point;
        }
        for(var i = 0 ; i < point_batch && !new_stroke; i++){
            stroke = stroke_arr[current_stroke];
            if(current_point < stroke.length-2){
                var p0 = stroke[current_point];
                var p1 = stroke[current_point + 1];
                var p2 = stroke[current_point + 2];
                draw_triangle(color_stroke,p0,p1,p2);
            }
            if(current_point < stroke.length-3){
                var p0 = stroke[current_point];
                var p1 = stroke[current_point + 2];
                var p2 = stroke[current_point + 3];
                draw_triangle(color_stroke,p0,p1,p2);
            }
            current_point++;
            if(current_point >= stroke.length-3){
                if(current_stroke < stroke_arr.length-1){
                    //console.log("stroke:"+current_stroke);
                    current_stroke++;
                    new_stroke=true;
                    time_to_sleep=interval_stroke;
                }else{
                    current_stroke=0;
                    need_refresh=true;
                    current_point=0;
                    time_to_sleep=interval_char;
                    break;
                }
                current_point=0;
            }
        }
        var that = this;
        timer = setTimeout(function() {
                that.animate();
        }, time_to_sleep);
    }

};