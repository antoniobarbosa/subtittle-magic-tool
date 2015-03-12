/**
 * Created by ABarbosa on 03/03/15.
 */

function parseSecondsIntoTimeFormat (seconds,format){
    var timeParsed = '';
    var hours = Math.floor(seconds/3600)
    var minutes = 0;
    if(format.indexOf('h')>=0){
        minutes = Math.floor((seconds%3600)/60)
    }else{
        minutes = Math.floor((seconds)/60)
    }
    var secondsRemaining = Math.floor(((seconds%3600)%60));

    var milli =''+ Math.round((Math.pow(10,(format.match(/f/g) || []).length))*(seconds - Math.floor(seconds)));
    var hoursRegex = /h/g;
    var minutesRegex = /m/g;
    var secondsRegex = /s/g;
    var millisecondsRegex = /f/g;
    var analyzeTime = function(time, regex){

        var str = '';
        for(var i=0;i<(format.match(regex)|| []).length;i++){
            if (time<Math.pow(10,i)){
                str+='0';
            }
        }

        if ((format.match(regex)|| []).length==0){

            return '';
        }else{
            if (time==0){
                time = '';
            }
            return str+''+time;
        }
    }

    timeParsed = format.substring(0,format.indexOf('h'))+analyzeTime(hours,hoursRegex)+format.substring(format.lastIndexOf('h')+1);
    timeParsed = timeParsed.substring(0,timeParsed.indexOf('m'))+analyzeTime(minutes,minutesRegex)+timeParsed.substring(timeParsed.lastIndexOf('m')+1);
    timeParsed = timeParsed.substring(0,timeParsed.indexOf('s'))+analyzeTime(secondsRemaining, secondsRegex)+timeParsed.substring(timeParsed.lastIndexOf('s')+1);
    timeParsed = timeParsed.substring(0,timeParsed.indexOf('f'))+analyzeTime(milli, millisecondsRegex)+timeParsed.substring(timeParsed.lastIndexOf('f')+1);
   // console.log(hours+':'+minutes+':'+secondsRemaining+','+milli);
    return timeParsed;
}

function parseTimeFormatIntoSeconds(formatedTime,format){
    var seconds = 0;
    if(format.indexOf('h')>=0)
        seconds += parseInt(formatedTime.substring(format.indexOf('h'),format.lastIndexOf('h')+1))*3600
    seconds += parseInt(formatedTime.substring(format.indexOf('m'),format.lastIndexOf('m')+1))*60
    seconds += parseInt(formatedTime.substring(format.indexOf('s'),format.lastIndexOf('s')+1))
    seconds += parseFloat(formatedTime.substring(format.indexOf('f'),format.lastIndexOf('f')+1))/(Math.pow(10,(format.match(/f/g) || []).length))
    return seconds;
}

