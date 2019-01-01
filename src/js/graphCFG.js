const esgraph = require('esgraph');
import {colors} from './symbolicSubstitution';
export {createGraph};
var returnIndex='';
var indexExit='';
function createGraph(parsedCode,codeToParse) {
    const cfg = esgraph(parsedCode.body[0].body);
    const cfgObject = esgraph.dot(cfg, {counter:0, source: codeToParse});
    indexExit='';
    let cfgLines=cfgObject.split('\n');
    cfgLines=removeFirst(cfgLines);
    cfgLines=removeExit(cfgLines);
    cfgLines=removeException(cfgLines);
    cfgLines= combineDec(cfgLines);
    cfgLines=combineReturn(cfgLines);
    cfgLines= changeShapes(cfgLines);
    cfgLines= colorGraph(cfgLines,cfg);
    cfgLines= colorRealGraph(cfgLines,cfg);
    cfgLines=addNumbers(cfgLines);
    let result= getString(cfgLines);
    return result;
}


function removeFirst(cfgLines){
    if(cfgLines[0].includes('entry')) {
        cfgLines[0] = '';
        for (let i = 0; i < cfgLines.length; i++) {
            let check = cfgLines[i];
            if(check.includes('n0'))
                cfgLines[i]='';
        }
    }
    else
        return cfgLines;
    return cfgLines;
}
function removeExit(cfgLines){
    let stringIndex='n';
    for(let i = 0; i < cfgLines.length; i++){
        if(cfgLines[i].includes('exit')){
            indexExit=i;
            stringIndex=stringIndex+indexExit;
            cfgLines[i]='';
        }
        cfgLines=continueRemoveExit(cfgLines,i,stringIndex);
    }
    return cfgLines;
}

function continueRemoveExit(cfgLines,i,stringIndex){
    if(indexExit!==''&&cfgLines[i].includes(stringIndex))
        cfgLines[i]='';
    if(cfgLines[i].includes('return')) {
        returnIndex = i;
    }
    return cfgLines;
}
function getString(cfgLines){
    let string=cfgLines.join('\n');
    return string;
}
function changeArrow(cfgLines){
    for(let i=0;i<cfgLines.length;i++) {
        if (cfgLines[i].includes('-> n' + returnIndex))
            cfgLines[i] = cfgLines[i].replace('-> n' + returnIndex, '-> n' + (indexExit));
    }
    return cfgLines;

}

function removeConn(cfgLines,indexStart,indexFinish){
    for(let j=indexStart;j<indexFinish;j++ ) {
        let index = j;
        let string = 'n' + index;
        for (let i = 0; i < cfgLines.length; i++) {
            conRemove(cfgLines,i,string,indexFinish);
        }
    }
    return cfgLines;

}
function conRemove(cfgLines,i,string,indexFinish) {
    let curr = cfgLines[i];
    if (!curr.includes('->'))
        return cfgLines;
    if(curr.includes('-> '+string+' '))
        cfgLines[i] = cfgLines[i].replace('-> ' + string, '-> n' + (indexFinish));
    else if (curr.includes(string+' ->')) {
        cfgLines[i] = '';
    }

}
function combineReturn(cfgLines)
{
    let string='n'+(indexExit)+ ' [label=""]';
    cfgLines.splice(indexExit, 0, string);
    cfgLines=changeArrow(cfgLines);
    cfgLines.push('n'+(indexExit)+' -> n'+returnIndex +' []');
    return cfgLines;
}

function removeException(cfgLines){
    for(let i = 0; i < cfgLines.length; i++){
        let check=cfgLines[i];
        if(check.includes('exception'))
            cfgLines.splice(i,1);
    }
    return cfgLines;
}
function changeShapes(cfgLines){
    for(let i = 0; i < cfgLines.length; i++) {
        if(checkForShapes(cfgLines,i)) {
            let index=cfgLines[i].lastIndexOf(']');
            let replace = cfgLines[i].slice(0, index) + ' shape="diamond"' + cfgLines[i].slice(index);
            cfgLines[i] = replace;
        }
        else cfgLines=conChangeShapes(cfgLines,i);
    }
    return cfgLines;
}
function checkForShapes(cfgLines,i)
{
    if(cfgLines[i].includes('!')||cfgLines[i].includes('==')||cfgLines[i].includes('>')||cfgLines[i].includes('<'))
        return true;
    else
        return false;
}
function conChangeShapes(cfgLines,i){
    if(cfgLines[i].includes('label=""')){
        let index=cfgLines[i].lastIndexOf(']');
        let replace = cfgLines[i].slice(0, index) + ' shape="circle"' +' fillcolor="green" style="filled"'+ cfgLines[i].slice(index);
        cfgLines[i] = replace;
    }
    else if(!cfgLines[i].includes('->')){
        let index=cfgLines[i].lastIndexOf(']');
        let replace = cfgLines[i].slice(0, index) + ' shape="box"' + cfgLines[i].slice(index);
        cfgLines[i] = replace;
    }
    return cfgLines;
}
function combineDec(cfgLines){
    let indexFirst='';
    let finishIndex=1;
    for(let i = 0; i < cfgLines.length; i=i+finishIndex){
        let index=i;
        while(checkWhileCon(cfgLines,index))
        {
            if(indexFirst==='')
                indexFirst=index;
            finishIndex=index+1;
            index++;
        }
        if(indexFirst!=='') {
            cfgLines=combineDecIndex(cfgLines,indexFirst, finishIndex);
            indexFirst = '';
        } else
            finishIndex=1;
    }
    return cfgLines;
}
function checkWhileCon(cfgLines,index){
    if(checkIfDeclare(cfgLines[index])!==''&&checkIfDeclare(cfgLines[index+1])!==''&&checkCon(cfgLines,index))
        return true;
    return false;
}
function combineDecIndex(cfgLines,indexFirst, finishIndex) {
    let joinLabel='';
    for(let i=indexFirst;i<finishIndex+1;i++)
    {
        joinLabel=joinLabel+checkIfDeclare(cfgLines[i]);
        cfgLines[i] = '';
    }
    cfgLines[finishIndex]='n'+finishIndex+ ' [label="'+joinLabel+'"]';
    cfgLines=removeConn(cfgLines,indexFirst,finishIndex);
    return cfgLines;
}


function checkIfDeclare(string)
{
    let result ='';
    if(string.includes('let')) {
        result= string.substring(string.indexOf('let ') + 4, string.indexOf(';')) + '\n';
        return result;
    }
    if(string.includes('++')||string.includes('--')) {
        result= string.substring(string.indexOf('label=') + 7, string.lastIndexOf(']')-1) + '\n';
        return result;
    }
    if(string.includes(' = ')) {
        result= string.substring(string.indexOf('label=') + 7, string.lastIndexOf(']')-1) + '\n';
        return result;
    }
    return result;
}
function colorGraph(cfgLines,cfg)
{
    let IfStatement=[];
    for(let i=1;i< cfg[2].length-1;i++)
    {
        if(checkIfCond(cfg,i)){
            IfStatement.push(i);
        }
        if(cfg[2][i].parent.type!==undefined &&cfg[2][i].parent.type==='WhileStatement'){
            IfStatement.push(i);
        }
    }
    cfgLines=changeToColor(cfgLines,IfStatement);
    return cfgLines;
}
function checkIfCond(cfg,i){
    if(cfg[2][i].parent.type!==undefined &&cfg[2][i].parent.type==='IfStatement')
        return true;
    return false;
}

function checkCon(cfgLines,index)
{
    if(cfgLines.includes('n'+index+' -> n'+(index+1)+' []'))
        return true;
    return false;
}
function changeToColor(cfgLines,IfStatement){
    for(let i=0;i<IfStatement.length;i++)
    {
        let color=getToColor(i);
        let index=cfgLines[i].lastIndexOf(']');
        //let replace = cfgLines[IfStatement[i]].slice(0, index) + ' fillcolor="'+color+'" style="filled"' +cfgLines[IfStatement[i]].slice(index);
        let replace = cfgLines[IfStatement[i]].slice(0, index) + ' value="'+color+'"'+cfgLines[IfStatement[i]].slice(index);
        cfgLines[IfStatement[i]]=replace;
    }
    return cfgLines;
}
function getToColor(index) {
    let color='';
    let counter=0;
    for (let value of colors.values()) {
        if(counter==index) {
            color=value;
            break;
        }
        counter++;
    }
    if(color)
        return 'true';
    else
        return 'false';
}

function colorRealGraph(cfgLines,cfg) {
    let nodesToColor=[];
    let current=cfg[2][1];
    let counter=1;
    while(checkWhile(current)){
        if(current.astNode.type==='ReturnStatement') {
            nodesToColor.push(cfg[2].indexOf(current));break;
        }if(checkIf(current)) {
            nodesToColor.push(counter);
            counter++;
            current=getCurrent(current);
        } else {let value=getBool(cfgLines,counter);
            if(value) {nodesToColor.push(counter);
                counter=cfg[2].indexOf(current.true);
                current=current.true;
            } else {nodesToColor.push(counter);
                counter=(cfg[2].indexOf(current.false));
                current=current.false;}
        }}cfgLines=getNodeColor(cfgLines,nodesToColor);
    return cfgLines;}

function checkIf(current){
    return current.parent.type !== 'WhileStatement' && current.parent.type !== 'IfStatement';

}
function checkWhile(current){
    if(current||current.astNode)
        return true;
    else return false;
}
function getBool(cfgLines,counter) {
    if(cfgLines[counter].includes('true'))
        return true;
    else return false;
}
function getNodeColor(cfgLines,nodesToColor){
    for(let i = 0; i < nodesToColor.length; i++) {
        let index = nodesToColor[i];
        if (cfgLines[index].includes('[')) {
            let indexBrack = cfgLines[index].lastIndexOf(']');
            cfgLines[index] = cfgLines[index].slice(0, indexBrack) + ' fillcolor="green" style="filled"' + cfgLines[index].slice(indexBrack);
        }
        else continue;
    }
    return cfgLines;
}

function getCurrent(current)
{
    let result=current.next;
    if(result.length==1)
        return current.next[0];
    else if(result.length>1)
        return current.next[1];
    else return false;
}
function addNumbers(cfgLines) {
    let counter=1;
    for(let i = 0; i < cfgLines.length; i++) {
        if(cfgLines[i].includes('->'))
            break;
        if(cfgLines[i].includes('label')&&!cfgLines[i].includes('shape="circle"')){
            let index=cfgLines[i].indexOf('label="')+7;
            let replace = cfgLines[i].slice(0, index) + '('+counter+') \n'+cfgLines[i].slice(index);
            cfgLines[i]=replace;
            counter++;
        }
    }
    return cfgLines;
}