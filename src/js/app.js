
import $ from 'jquery';
import * as viz from 'viz.js';
import {functionCode, makeArray} from './code-analyzer';
import {createGraph} from './graphCFG'
import {parseCode} from './code-analyzer';
import {startSubstitution,newLines,colors} from './symbolicSubstitution';
import * as esprima from 'esprima';
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let parsedCode2 =esprima.parseScript(codeToParse,{range:true});
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let args=$('#argsPlaceholder').val();
        makeArray(parsedCode);
        startSubstitution(codeToParse,args);
        let cfgCode=createGraph(parsedCode2,codeToParse);
        let a=viz('digraph{'+cfgCode+'}');
        // $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        // let args=$('#argsPlaceholder').val();
        // //let lines= makeArray(parsedCode);
        // //insertToTable(lines);
        // startSubstitution(codeToParse,args);
        displayFuncWithColor(a);
    });
});


function displayFuncWithColor(a) {
    let htmlObject = document.getElementById('subsFunc');
    htmlObject.innerHTML=a;
    // let func='';
    // for(let i=0;i<newLines.length;i++){
    //     if(colors.has(i))
    //     {
    //         if(colors.get(i))
    //             func+='<span>'+'<mark style="background-color: green">'+newLines[i]+'</mark>'+'</span>'+'<br>';
    //         else
    //             func+='<span>'+'<mark style="background-color: red">'+newLines[i]+'</mark>'+'</span>'+'<br>';
    //     }
    //     else
    //         func+='<span>'+newLines[i]+'\n'+'</span>'+'<br>';
    // }
    //htmlObject.innerHTML=func;
}
// function deleteRows(){
//     var bodyTable=document.getElementById('bodyTable')
//     for(let i=0;i<bodyTable.rows.length;i++)
//     {
//         document.getElementById('bodyTable').deleteRow(i);
//     }
// }

//function that describe the table from the array


