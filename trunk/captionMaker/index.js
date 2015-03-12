/**
 * Created by ABarbosa on 05/03/15.
 */
var actualPosition = 0;
var currentNode= 'init';

var highlightCurrentNode = function(){
    $('td.highlight').removeClass('highlight');
    console.log(captionMaker.subtitles.length);
    console.log(actualPosition +"pos");
    if (currentNode=='init'&&captionMaker.subtitles.length==(actualPosition)){
        $('#new-node').css('display','block')
    }else{
        $('#new-node').css('display','none')
        $('#td-'+currentNode+actualPosition).addClass('highlight');
        console.log($('.highlight').position().top+'top');
        console.log($('.table-hider')[0].scrollHeight+'')
        $('.table-hider').animate({
            scrollTop: $('.highlight').position().top -30}, 500);
    }

}
var editThisTd = function(element,idx){
    if (idx>=0){
        $(element).find('p').css('display','none')
        $('#tr-subtitle-text'+idx).css('display','table-row')
        console.log('text-'+idx);
        $('#tr-subtitle-text'+idx+' td').find('div').css('display','table')
        $('#text-'+idx).focus();
    }else{
        if ($(element).hasClass('highlight')){
            $('.editable-input').css('display','none');
            $('td p').css('display','table');
            $(element).find('p').css('display','none')
            var divWithInput = $(element).find('div');
            divWithInput.css('display','table')
            divWithInput.find('input').focus();
        }else{
            var elementId = $(element).attr('id')
            if (elementId.indexOf('init')>=0){
                console.log()
                currentNode = 'init';
                actualPosition = elementId.substring(elementId.lastIndexOf('t')+1);
            }else{
                currentNode = 'end';
                actualPosition = elementId.substring(elementId.lastIndexOf('d')+1);
            }
            highlightCurrentNode();


        }
    }
}
var createEditFieldInput =  function(idx, prefix){
    var inputText ='';

    if (prefix =='text'){
        inputText=
            '<div style="display:none" class="editable-input form-control input-group input-group-sm">' + //editField input
                '<textarea class="form-control" id="'+prefix+'-'+idx+'" >' +
                captionMaker.subtitles[idx][prefix] +
                '</textarea>' +
                '<span class="input-group-btn">' +
                '<button class="btn btn-success" type="button" onclick="updateSubtitles('+idx+',\''+prefix+'\',\'#'+prefix+'-'+idx+'\')">Ok!</button>' +
                '</span>'+

                '</div>'
    }else{
        inputText = '<div class="editable-input input-group input-group-sm">'+
            '<span class="input-group-btn">'+
            '<button type="button" class="btn btn-default btn-number" onclick="remMilliseconds(\'#'+prefix+'-'+idx+'\')" data-type="minus">'+
            '<span class="glyphicon glyphicon-minus"></span>'+
            '</button>'+
            '</span>' +
            '<form onsubmit="updateSubtitles('+idx+',\''+prefix+'\',\'#'+prefix+'-'+idx+'\'); return false;">'+
            '<input type="text" id="'+prefix+'-'+idx+'" class="form-control reduce" value="' +parseSecondsIntoTimeFormat(captionMaker.subtitles[idx][prefix],'mm:ss,fff')+'">'+
            '</form>'+
            '<span class="input-group-btn">'+
            '<button type="button" class="btn btn-default btn-number" onclick="addMilliseconds(\'#'+prefix+'-'+idx+'\')" data-type="plus">'+
            '<span class="glyphicon glyphicon-plus"></span>'+
            '</button>'+
            '</span>'+
            '</div>'
     /*   inputText = '<div style="display:none" class="editable-input input-group input-group-sm">' + //editField input
            '<input type="number" id="'+prefix+'-'+idx+'" class="form-control" value="'+captionMaker.subtitles[idx][prefix]+'">' +
            '<span class="input-group-btn">' +
            '<button class="btn btn-success" type="button" onclick="updateSubtitles('+idx+',\''+prefix+'\',\'#'+prefix+'-'+idx+'\')">Ok!</button>' +
            '</span>' +
            '</div>'*/
    }
    return  inputText;

}


var loadSubtitlesInTable = function(){
    var tableText = ''
    $.each(captionMaker.subtitles, function(idx,obj){
        console.log(JSON.stringify(obj));
        console.log(obj.text);
        tableText+=
            "<tr>" +
                '<td>'+(idx+1)+'</td>'+ //TR NUMBER
                '<td class="col-xs-3" id="td-init'+idx+'" style="cursor:pointer; max-width:30px;" onclick="editThisTd(this)"><p>'+parseSecondsIntoTimeFormat(obj.init,'mm:ss,fff')+'</p>'+        //TR INIT
                createEditFieldInput(idx, 'init')+
                '</td>'+
                '<td  class="col-xs-3" id="td-end'+idx+'" style="cursor:pointer;" onclick="editThisTd(this)"><p>'+parseSecondsIntoTimeFormat(obj.end,'mm:ss,fff')+'</p>'+
                createEditFieldInput(idx, 'end')+
                '</td>'+
                '<td class="col-xs-6" style="cursor:pointer;" onclick="editThisTd(this,'+idx+')"><p>'+(obj.text.length<60?obj.text:(obj.text.substring(0,60)+'...'))+'</p>'+
                '</td>'+
                '</tr>' +
                '<tr style="display:none">' +
                '</tr>'+
                '<tr id="tr-subtitle-text'+idx+'" style="display:none">' +
                '<td colspan="4">' +
                createEditFieldInput(idx, 'text')+
                '</td>' +
                '</tr>'
    })
    $('#caption-table tbody').html(tableText);
}
var remMilliseconds=function(id){
    var seconds = parseTimeFormatIntoSeconds($(id).val(),'mm:ss,fff');
    seconds -= 0.5;
    $(id).val(parseSecondsIntoTimeFormat(seconds,'mm:ss,fff'));
}
var addMilliseconds=function(id){
    var seconds = parseTimeFormatIntoSeconds($(id).val(),'mm:ss,fff');
    seconds += 0.5;
    $(id).val(parseSecondsIntoTimeFormat(seconds,'mm:ss,fff'));
}
var updateSubtitles=function(index, node, id){
    console.log(node);
    console.log(index);
    console.log($(id).val()+' oi?');
    if(node!='text')
        captionMaker.subtitles[index][node] = parseTimeFormatIntoSeconds($(id).val(),'mm:ss,fff');
    else
        captionMaker.subtitles[index][node] = ($(id).val());
    actualPosition = index;
    if(node =='init'){
        currentNode = 'end';
    }else{
        currentNode = 'init';
        actualPosition++;
    }

    loadSubtitlesInTable();
    highlightCurrentNode();
}
var changePlaybackRate = function (element,operation){
    if(operation == 'minus'){
        element.val(parseFloat(element.val())-0.1)
    }else{
        element.val(parseFloat(element.val())+0.1)
    }
    document.getElementById('video').playbackRate = element.val();

}