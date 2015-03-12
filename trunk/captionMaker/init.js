
var wavesurfer = Object.create(WaveSurfer);

wavesurfer.init({
    container: document.querySelector('#wave'),
    waveColor: 'violet',
    progressColor: 'purple'

});

var minValue = 0.015;
var minSeconds = 0.2;

//-------------------------------------------------------------------------------------------------
// findRegions() -- Controls the detection and drawing of audio regions.
//                        Invoked through button press on segmentation controls.
//-------------------------------------------------------------------------------------------------
function findRegions() {
    console.log('findRegions');
    wavesurfer.clearRegions();
    var peaks = wavesurfer.backend.getPeaks(512);
    var duration = wavesurfer.getDuration();
    var wsRegions = extractRegions(peaks, duration);
    drawRegions(wsRegions);
}
//-------------------------------------------------------------------------------------------------
// Draw regions from extractRegions function.
//-------------------------------------------------------------------------------------------------

function drawRegions(regions) {
    console.log('drawRegions');
    regions.forEach(function(region) {
        region.drag = false;
        region.resize = true;
        region.color = 'rgba(127,106,11,.5)'; //randomColor(0.2);
        wavesurfer.addRegion(region);
    });
}
//-------------------------------------------------------------------------------------------------
// Extract regions separated by silence.
//-------------------------------------------------------------------------------------------------

function extractRegions(peaks, duration) {
    console.log('extractRegions');
    var length = peaks.length;
    var coef = duration / length;
    var minLen = minSeconds / coef;
    // Gather silence indeces
    var silences = [];
    Array.prototype.forEach.call(peaks, function(val, index) {
        if (val < minValue) {
            silences.push(index);
        }
    });
    // Cluster silence values
    var clusters = [];
    silences.forEach(function(val, index) {
        if (clusters.length && val == silences[index - 1] + 1) {
            clusters[clusters.length - 1].push(val);
        } else {
            clusters.push([val]);
        }
    });
    // Filter silence clusters by minimum length
    var fClusters = clusters.filter(function(cluster) {
        return cluster.length >= minLen;
    });
    // Create regions on the edges of silences
    var regions = fClusters.map(function(cluster, index) {
        var next = fClusters[index + 1];
        return {
            start: cluster[cluster.length - 1],
            end: (next ? next[0] : length - 1)
        };
    });
    // Add an initial region if the audio doesn't start with silence
    var firstCluster = fClusters[0];
    if (firstCluster && firstCluster[0] != 0) {
        regions.unshift({
            start: 0,
            end: firstCluster[firstCluster.length - 1]
        });
    }
    // Filter regions by minimum length
    var fRegions = regions.filter(function(reg) {
        return reg.end - reg.start >= minLen;
    });
    // Return time-based regions
    return fRegions.map(function(reg) {
        return {
            start: Math.round(reg.start * coef * 10) / 10,
            end: Math.round(reg.end * coef * 10) / 10
        };
    });
}


$(document).ready(function(){
    wavesurfer.on('ready', function () {
        var peaks = wavesurfer.backend.getPeaks(512);
        wavesurfer.play();
        regions = extractRegions(peaks, wavesurfer.backend.getDuration());
        drawRegions(regions);
    });


    captionMaker.init();
    var lastTime = 0;
    var captionPosition = 0;
    (function(){
        var fileInput = document.getElementById('media-source');
        var video = document.getElementById('video');

        document.getElementById('load-video').addEventListener('click', function(){
            var fileUrl = window.URL.createObjectURL(fileInput.files[0]);
            video.src = fileUrl;
            wavesurfer.load(fileUrl);

        });
        var subtitleFormatsSelectHtml =''
        $.each(captionMaker.subtitlesFormats, function(id,obj){
            subtitleFormatsSelectHtml += "<option>"+id+"</option>";
        })
        $('#caption-types').html(subtitleFormatsSelectHtml);
        $('#load-online-source').click(function(){
            video.src = $('#online-source').val();
        })



        $('#load-transcript').click(function(){
            var transcript = $('#transcript').val();
            console.log(transcript);
            var separator = $('#subtitle-separator').val();
            captionMaker.parseTranscriptIntoArray(transcript, separator);
            $('#no-transcript a')
                .text('Yeah! =)')
                .click();
            loadSubtitlesInTable();


        });
        $('#generate-caption').click(function(){

            $('#parsed-caption').html('<pre  class="prettyprint"></pre>');
            $('.prettyprint').text(captionMaker.parseSubtitlesIntoFormat($('#caption-types').val()));
            prettyPrint();

        });
        var presentationHandler = function(that,callback){
            $('li[role="presentation"]').each(function(){
                $(this).removeClass('active');
            })
            $(that).addClass('active');
            callback();
        }
        $('#no-transcript').click(function(){
            presentationHandler(this, function(){
                $('#transcript-box').css('display','none');
                $('#caption-table').css('display','table');
                $('.table-hider').css('display','block');

            })
        });
        $('#with-transcript').click(function(){
            presentationHandler(this, function(){
                $('#caption-table').css('display','none');
                $('.table-hider').css('display','none');
                $('#transcript-box').css('display','block');
            })
        });
        $('video').click(function(e){

            captionMaker.defineTime(this.currentTime,actualPosition, currentNode)
            if(currentNode=='init'){
                if(e.shiftKey)
                    captionMaker.defineTime(captionMaker.subtitles[actualPosition-1]['end'],actualPosition, currentNode)
                currentNode = 'end';
            }else{
                currentNode = 'init';
                actualPosition++;
            }
            loadSubtitlesInTable();
            highlightCurrentNode();

        })
        var playCaptions =function(currentTime,caption){
            console.log(caption);
            if(caption != undefined){
                if( currentTime >= caption.init &&
                    currentTime <= caption.end ){
                    console.log(caption.text);
                    $('.captions p').text(caption.text);
                    $('.captions p').css('display','inline-block');

                }else if(currentTime <= caption.init){
                    $('.captions p').css('display','none');
                    console.log('waiting...')
                }else{
                    captionPosition++;
                    playCaptions(currentTime,captionMaker.subtitles[captionPosition]);

                }
            }else{
                console.log('nocaption');
            }
        }


        var trackCaption =function(currentTime, captions){
            var idx = 0;


            $.each(captions, function(index,obj){
                var initTime = obj.init;
                var endTime = obj.end;
                if(initTime<=currentTime && endTime>=currentTime){
                    return false
                    idx = index;
                }else if(initTime > currentTime ){
                    idx = index;
                    return false
                }
            });
            return idx;
        }
        console.log(parseTimeFormatIntoSeconds('01:02:03,333','hh,mm,ss,fff'))
        $('#video').on('timeupdate',function(){

            var deltaTime = lastTime - this.currentTime;
            console.log(deltaTime);
            lastTime = this.currentTime;
            if (Math.abs(deltaTime)>0.5){
                captionPosition = trackCaption(this.currentTime, captionMaker.subtitles)
            }
            playCaptions(this.currentTime,captionMaker.subtitles[captionPosition]);
        })

    })();

})