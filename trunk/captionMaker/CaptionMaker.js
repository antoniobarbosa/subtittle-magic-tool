/**
 * Created by ABarbosa on 03/03/15.
 */

var captionMaker = {
    transcriptPosition: 0,
    isInitialTime:true,
    mediaElement:{},
    transcriptArray:[],
    subtitles:[],
    subtitlesFormats:{
        'srt':function(subtitles){

            var srt=""
            $.each(subtitles,function(idx,obj){
                srt +=idx+1+'\n'+parseSecondsIntoTimeFormat(obj.init,'hh:mm:ss,fff')+' --> '+parseSecondsIntoTimeFormat(obj.end,'hh:mm:ss,fff')+'\n'+obj.text.trim()+'\n\n';
            })
            return srt;
        },
        'sm':function(subtitles){
            var SMcaption=
                'var legendas =[\n' +
                    '{\n' +
                    'idioma:"português",\n' +
                    'legendas:[\n'
            $.each(subtitles,function(idx,obj){
                SMcaption +='{\n' +
                    '\ttempoInicial:"'+parseSecondsIntoTimeFormat(obj.init,'mm:ss,ff')+'",\n' +
                    '\ttempoFinal:"'+parseSecondsIntoTimeFormat(obj.end,'mm:ss,ff')+'",\n' +
                    '\ttexto:"'+obj.text.trim()+'"\n' +
                    '}\n';
                if(idx < (subtitles.length-1))
                    SMcaption +=',\n';
            })
            SMcaption +=']}\n]'
            return SMcaption;
        }
    },
    parseTranscriptIntoArray:function(transcript, separator){
        if(separator ==''|| separator == undefined){
            separator = /\n/;
        }
        this.transcriptArray = transcript.split(separator);
        this.subtitles = [];
        var that = this;
        $.each(this.transcriptArray, function(idx,obj){
            that.subtitles.push(
                {
                    init:'',
                    end:'',
                    text:obj
                }
            )
        })
    },
    parseSubtitlesIntoFormat:function(format){
        console.log(format);
        return this.subtitlesFormats[format](this.subtitles);
    },
    defineTime:function(time, position, node){
        if (this.subtitles.length<=position){
            this.subtitles.push(
                {
                    init:'',
                    end:'',
                    text:''
                }
            );
            this.subtitles[position][node] = time;

        }
        this.subtitles[position][node] = time;
    },
    init:function(){


    }

}
