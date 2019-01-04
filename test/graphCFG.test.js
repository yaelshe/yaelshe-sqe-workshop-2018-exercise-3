import assert from 'assert';
import {parseCode, tableInfo, makeArray} from '../src/js/code-analyzer';
import {startSubstitution,newLines} from '../src/js/symbolicSubstitution';
import {createGraph} from '../src/js/graphCFG';
import * as esprima from "esprima";

describe('Substitution Checks',()=>{

    // it('function with return statement', ()=>{
    //     let text=parseCode('function foo() {\n' +
    //         '    return 0;\n' +
    //         '}');
    //     makeArray(text);
    //     let expRes=[{Line:'1', Type:'function declaration', Name:'foo', Condition:'', Value:''},
    //         {Line:'2', Type:'return statement', Name:'', Condition:'', Value:'0'}];
    //     assert.deepEqual(expRes,tableInfo);
    // });
    //
    // it('Function with var assignment', ()=>{
    //     let code='function foo(a){\nlet b=a;\n}\nlet y=0;';
    //     let vars='foo(1)';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i];
    //     }
    //     assert.deepEqual('function foo(a){}',result);
    // });
    //
    // it('Array in arguments for function',()=> {
    //     let code = 'function foo(array,num){\n' +
    //         'if(array[1]=="asaf" && num==1){\n' +
    //         'return true;\n' +
    //         '}\n' +
    //         '}';
    //     let vars = 'foo([87,\'asaf\',false,7],0)';
    //     let temp = parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp, vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i]+'\n';
    //     }
    //     assert.deepEqual('function foo(array,num){\n' +
    //         'if(array [ 1 ]  == "asaf" && num == 1){\n' +
    //         'return true;\n' +
    //         '}\n' +
    //         '}\n', result);
    // });
    //
    // it('Function with local array assignment', ()=>{
    //     let code= 'function foo(x,y){\n' +
    //         'let array=[8,4];\n' +
    //         'array[x]=array[y];\n' +
    //         '}';
    //     let vars='foo(0,1)';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i]+'\n';
    //     }
    //     assert.deepEqual(result,'function foo(x,y){\n' +
    //         '}\n');
    // });
    //
    // it('Global array no arguments', ()=>{
    //     let code='let array=[true];\n' +
    //         'function foo(){\n' +
    //         'let index=0;\n' +
    //         'if(array[index]){\n' +
    //         'return true;\n' +
    //         '\n'+
    //         '}\n' +
    //         '}'+'\n   ';
    //     let vars='';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i]+'\n';
    //     }
    //     assert.deepEqual(result,'function foo(){\n' +
    //         'if(array [ 0 ] ){\n' +
    //         'return true;\n' +
    //         '}\n' +
    //         '}\n');
    // });
    //
    // it('Array in arguments with single element', ()=>{
    //     let code= 'function foo(array){\n' +
    //         'if(array[0]===\'a\'){\n' +
    //         'return true;\n' +
    //         '}\n' +
    //         '}';
    //     let vars='foo(["a"])';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i]+'\n';
    //     }
    //     assert.deepEqual(result,'function foo(array){\n' +
    //         'if(array [ 0 ]  === \'a\'){\n' +
    //         'return true;\n' +
    //         '}\n' +
    //         '}\n');
    // });
    // it('Array in arguments and Unary expression', ()=>{
    //     let code= 'function foo(array){\n' +
    //         'if(array[0]==\'eden\'){\n' +
    //         'return -1;\n' +
    //         '}\n' +
    //         '}';
    //     let vars='foo(["eden",1])';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i]+'\n';
    //     }
    //     assert.deepEqual(result,'function foo(array){\n' +
    //         'if(array [ 0 ]  == \'eden\'){\n' +
    //         'return - 1;\n' +
    //         '}\n' +
    //         '}\n');
    // });
    //
    // it('Empty function, with /n before', ()=>{
    //     let code= '\nfunction foo(x){\n}';
    //     let vars='foo(true)';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i]+'\n';
    //     }
    //     assert.deepEqual(result,'function foo(x){\n' +
    //         '}\n');
    // });
    //
    // it('Assignment for local variables', ()=>{
    //     let code= 'function foo(x,y){\n' +
    //         'let z;\n' +
    //         'let y=x;\n' +
    //         'z=y;\n' +
    //         'y=z;\n' +
    //         '}';
    //     let vars='foo("a",1)';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i]+'\n';
    //     }
    //     assert.deepEqual(result,'function foo(x,y){\n' +
    //         'y=x;\n'+
    //         '}\n');
    // });
    //
    // it('Math operation use', ()=>{
    //     let code= 'function foo(x,y){\n' +
    //         'let foo=a+b;\n' +
    //         '}';
    //     let vars='foo(2,1)';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i]+'\n';
    //     }
    //     assert.deepEqual(result,'function foo(x,y){\n' +
    //         '}\n');
    // });
    //
    // it('Solve minus', ()=>{
    //     let code= 'function foo(a,b){\n' +
    //         'let foo=a-b;\n' +
    //         '}';
    //     let vars='foo(2,1)';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i]+'\n';
    //     }
    //     assert.deepEqual(result,'function foo(a,b){\n' +
    //         '}\n');
    // });
    //
    // it('Check .length parsing', ()=>{
    //     let code= 'function foo(array){\n' +
    //         'if(array.length==0){\n' +
    //         'return \'Length Is zero\';\n' +
    //         '}\n' +
    //         '}';
    //     let vars='foo(["a",1,true])';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i]+'\n';
    //     }
    //     assert.deepEqual(result,'function foo(array){\n' +
    //         'if(array.length == 0){\n' +
    //         'return \'Length Is zero\';\n' +
    //         '}\n' +
    //         '}\n');
    // });
    //
    // it('Assignment using argument index to local index', ()=>{
    //     let code= 'function foo(array,num){\n' +
    //         'let z=0;\n' +
    //         'array[z]=array[num];\n' +
    //         'if(array[z]==3)\n' +
    //         'return true;\n' +
    //         '}';
    //     let vars='foo([1,2,3],2)';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i]+'\n';
    //     }
    //     assert.deepEqual(result,'function foo(array,num){\n' +
    //         'array [ 0 ] =3;\n' +
    //         'if(array [ 0 ]  == 3)\n' +
    //         'return true;\n' +
    //         '}\n');
    // });
    //
    // it('Solve math inside an if statement', ()=>{
    //     let code= 'function foo(num){\n' +
    //         'if(num==(100+num))\n' +
    //         'return false;\n' +
    //         '}';
    //     let vars='foo(5)';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i]+'\n';
    //     }
    //     assert.deepEqual(result,'function foo(num){\n' +
    //         'if(num == 100 + num)\n' +
    //         'return false;\n'+
    //         '}\n');
    // });
    // it('Math operations and zero handling', ()=>{
    //     let code= 'function foo(x,y){\n' +
    //         'let num=0+x;\n' +
    //         'num=x+0;\n'+
    //         'num=0+x;\n'+
    //         'num=x+y;\n'+
    //         'num=x-0;\n'+
    //         'num=x-y;\n'+
    //         'num=3-2;\n'+
    //         'num=2*3;\n'+
    //         'num=a*3;\n'+
    //         'num=2*x;\n'+
    //         'num=y*x;\n'+
    //         'num=1/3;\n'+
    //         'num=x/10;\n'+
    //         'num=5/x;\n'+
    //         'num=b/x;\n'+
    //         '}';
    //     let vars='foo(76,5)';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result=result+newLines[i]+'\n';
    //     }
    //     assert.deepEqual(result,'function foo(x,y){\n' +
    //         '}\n');
    // });
    // it('Function with if condition with strong equality', ()=>{
    //     let code= 'function foo(num){\n' +
    //         'let array= [5,65,8];\n' +
    //         'num=array[num];\n' +
    //         'if (num===1){\n' +
    //         'return num;\n' +
    //         '}' +
    //         '}';
    //     let vars='foo(2)';
    //     let temp=parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp,vars);
    //     let result='';
    //     for(let i=0;i<newLines.length;i++){
    //         result= result+ newLines[i]+'\n';
    //     }
    //     assert.deepEqual(result,'function foo(num){\n' +
    //         'num=8;\n' +
    //         'if (num === 1){\n' +
    //         'return num;\n'+
    //         '}\n' +
    //         '}\n');
    // });
    //
    // it('Function with all logic operators ', ()=> {
    //     let code = 'function foo(x, y, z){\n' +
    //         'if(x>y)\n' +
    //         'return false;\n' +
    //         'else if(x< y)\n' +
    //         'return true;\n' +
    //         'else if(x<=z)\n' +
    //         'return true;\n' +
    //         'else if((x>=z) || (y!=z))\n' +
    //         'return false;\n' +
    //         '}';
    //     let vars = 'foo(3,6,2)';
    //     let temp = parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp, vars);
    //     let result = '';
    //     for (let i = 0; i < newLines.length; i++) {
    //         result = result+  newLines[i] + '\n';
    //     }
    //     assert.deepEqual(result, 'function foo(x, y, z){\n' +
    //         'if(x > y)\n' +
    //         'return false;\n' +
    //         'else if(x < y)\n' +
    //         'return true;\n' +
    //         'else if(x <= z)\n' +
    //         'return true;\n' +
    //         'else if(x >= z || y != z)\n' +
    //         'return false;\n' +
    //         '}\n');
    // });
    //
    // it('Function with if statement with not=> !', ()=> {
    //     let code = 'function foo(value){\n' +
    //         'if(!value)\n' +
    //         'return value;\n' +
    //         '}';
    //     let vars = 'foo(false)';
    //     let temp = parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp, vars);
    //     let result = '';
    //     for (let i = 0; i < newLines.length; i++) {
    //         result = result+  newLines[i] + '\n';
    //     }
    //     assert.deepEqual(result, 'function foo(value){\n' +
    //         'if(! value)\n' +
    //         'return value;\n' +
    //         '}\n');
    // });
    //
    // it('Function with else statement', ()=> {
    //     let code = 'function foo(num){\n' +
    //         'if(num<0)\n' +
    //         'return true;\n' +
    //         'else\n'+
    //         'return false;\n'+
    //         '}';
    //     let vars = 'foo(-7)';
    //     let temp = parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp, vars);
    //     let result = '';
    //     for (let i = 0; i < newLines.length; i++) {
    //         result = result+  newLines[i] + '\n';
    //     }
    //     assert.deepEqual(result, 'function foo(num){\n' +
    //         'if(num < 0)\n' +
    //         'return true;\n' +
    //         'else\n'+
    //         'return false;\n'+
    //         '}\n');
    // });
    //
    //
    // it('Function with else statement with brackets', ()=> {
    //     let code = 'function foo(num){\n' +
    //         'if(num<0)\n' +
    //         'return true;\n' +
    //         'else{\n'+
    //         'return false;\n'+
    //         '}\n'+
    //         '}';
    //     let vars = 'foo(-7)';
    //     let temp = parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp, vars);
    //     let result = '';
    //     for (let i = 0; i < newLines.length; i++) {
    //         result = result+  newLines[i] + '\n';
    //     }
    //     assert.deepEqual(result, 'function foo(num){\n' +
    //         'if(num < 0)\n' +
    //         'return true;\n' +
    //         'else{\n'+
    //         'return false;\n'+
    //         '}\n'+
    //         '}\n');
    // });
    //
    // it('Function with while loop ', ()=> {
    //     let code = 'function foo(num){\n' +
    //         'while(-num<0){\n' +
    //         'num=num-2;\n' +
    //         '}\n'+
    //         '}';
    //     let vars = 'foo(10)';
    //     let temp = parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp, vars);
    //     let result = '';
    //     for (let i = 0; i < newLines.length; i++) {
    //         result = result+  newLines[i] + '\n';
    //     }
    //     assert.deepEqual(result, 'function foo(num){\n' +
    //         'while(- num < 0){\n' +
    //         'num=num - 2;\n' +
    //         '}\n'+
    //         '}\n');
    // });
    //
    // it('Function with update expression for argument with ++', ()=> {
    //     let code = 'function foo(num,num2){\n' +
    //         'num++;\n' +
    //         'if(num==0)\n' +
    //         'return num2;\n' +
    //         '}';
    //     let vars = 'foo(0,10)';
    //     let temp = parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp, vars);
    //     let result = '';
    //     for (let i = 0; i < newLines.length; i++) {
    //         result = result+ newLines[i] + '\n';
    //     }
    //     assert.deepEqual(result, 'function foo(num,num2){\n' +
    //         'num=num + 1;\n' +
    //         'if(num == 0)\n' +
    //         'return num2;\n' +
    //         '}\n');
    // });
    // it('Function with 2 while loops and arrays ', ()=> {
    //     let code = 'function foo (items) {\n' +
    //         'let i=1;\n' +
    //         'while (i>0) {\n' +
    //         'let value = items[i];\n' +
    //         'let j=0;\n' +
    //         'while (j>0){\n' +
    //         'items[i+1] = items[j];\n' +
    //         'items[j ] = value;\n' +
    //         '}\n' +
    //         '}\n' +
    //         'return items;\n' +
    //         '}\n';
    //     let vars = 'foo([0,10,2,56])';
    //     let temp = parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp, vars);
    //     let result = '';
    //     for (let i = 0; i < newLines.length; i++) {
    //         result = result+ newLines[i] + '\n';
    //     }
    //     assert.deepEqual(result, 'function foo (items) {\n' +
    //         'while (1 > 0) {\n' +
    //         'while (0 > 0){\n' +
    //         'items [ 2 ] =0;\n' +
    //         'items [ 0 ] =10;\n' +
    //         '}\n' +
    //         '}\n' +
    //         'return items;\n' +
    //         '}\n');
    // });
    // it('Function with unary', ()=> {
    //     let code = 'function foo(num){\n' +
    //         'if(-num<0)\n' +
    //         'return 1;\n' +
    //         '}';
    //     let vars = 'foo(1)';
    //     let temp = parseCode(code);
    //     makeArray(temp);
    //     startSubstitution(temp, vars);
    //     let result = '';
    //     for (let i = 0; i < newLines.length; i++) {
    //         result=result+ newLines[i] + '\n';
    //     }
    //     assert.deepEqual(result, 'function foo(num){\n' +
    //         'if(- num < 0)\n' +
    //         'return 1;\n' +
    //         '}\n');
    // });
    // it('test grpah function with if true result', ()=> {
    //     let code = 'function foo(x){\n'+
    //         'if (x > 0) {\n'+
    //             'x=x+1;\n'+
    //         '}\n'+
    //         'return c;\n'+
    //     '}';
    //     let vars = 'foo(1)';
    //     let temp = parseCode(code);
    //     makeArray(temp);
    //     let parsedCode2 =esprima.parseScript(code,{range:true});
    //     startSubstitution(code, vars);
    //     let result = createGraph(parsedCode2,code);
    //     let expectedResult=' shape="box"\n'+
    //     'n1 [label="(1) \n'+
    //     'x > 0" shape="diamond" value="true" fillcolor="green" style="filled"]\n'+
    //     'n2 [label="(2) \n'+
    //     'x=x+1" shape="box" fillcolor="green" style="filled"]\n'+
    //     'n3 [label="(3) \n'+
    //     'return c;" shape="box" fillcolor="green" style="filled"]\n'+
    //     'n4 [label="" shape="circle" fillcolor="green" style="filled"]\n'+
    //     ' shape="box"\n'+
    //     ' shape="box"\n'+
    //     'n1 -> n2 [label="true" shape="diamond"]\n'+
    //     'n1 -> n4 [label="false" shape="diamond"]\n'+
    //     ' shape="box"\n'+
    //     'n2 -> n4 [ shape="diamond"]\n'+
    //     ' shape="box"\n'+
    //     ' shape="box"\n'+
    //     ' shape="box"\n'+
    //     'n4 -> n3 [ shape="diamond"]';
    //     assert.deepEqual(result, expectedResult);
    // });
    //-------from here new
    it('test grpah function with the first example ', ()=> {
        let code = 'function foo(x, y, z){\n'+
        'let a = x + 1;\n'+
        'let b = a + y;\n'+
        'let c = 0;\n'+
        'if (b < z) {\n'+
            'c = c + 5;\n'+
        '} else if (b < z * 2) {\n'+
            'c = c + x + 5;\n'+
        '} else {\n'+
            'c = c + z + 5;\n'+
        '}\n'+
        'return c;\n'+
    '}';
        let vars = 'foo(1,2,3)';
        let temp = parseCode(code);
        makeArray(temp);
        let parsedCode2 =esprima.parseScript(code,{range:true});
        startSubstitution(code, vars);
        let result = createGraph(parsedCode2,code);
        let expectedResult=' shape="box"\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        'n3 [label="(1) \n'+
        'a = x + 1\n'+
        'b = a + y\n'+
        'c = 0\n'+
        '" shape="box" fillcolor="green" style="filled"]\n'+
        'n4 [label="(2) \n'+
        'b < z" shape="diamond" value="false" fillcolor="green" style="filled"]\n'+
        'n5 [label="(3) \n'+
        'c = c + 5" shape="box"]\n'+
        'n6 [label="(4) \n'+
        'return c;" shape="box" fillcolor="green" style="filled"]\n'+
        'n7 [label="(5) \n'+
        'b < z * 2" shape="diamond" value="true" fillcolor="green" style="filled"]\n'+
        'n8 [label="(6) \n'+
        'c = c + x + 5" shape="box" fillcolor="green" style="filled"]\n'+
        'n9 [label="(7) \n'+
        'c = c + z + 5" shape="box"]\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        'n3 -> n4 [ shape="diamond"]\n'+
        'n4 -> n5 [label="true" shape="diamond"]\n'+
        'n4 -> n7 [label="false" shape="diamond"]\n'+
        ' shape="box"\n'+
        'n5 -> n11 [ shape="diamond"]\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        'n7 -> n8 [label="true" shape="diamond"]\n'+
        'n7 -> n9 [label="false" shape="diamond"]\n'+
        ' shape="box"\n'+
        'n8 -> n11 [ shape="diamond"]\n'+
        ' shape="box"\n'+
        'n9 -> n11 [ shape="diamond"]\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        'n11 -> n6 []\n'+
        'n11 [label="" fillcolor="green" style="filled"]';
        assert.deepEqual(result, expectedResult);
    });
    it('test grpah if with else', ()=> {
        let code = 'function foo(x){\n'+
        'if (x < 0) {\n'+
            'x=x+1;\n'+
        '} else {\n'+
            'c = c + x + 5;\n'+
        '}\n'+
        'return c;\n'+
        '}';
        let vars = 'foo(1)';
        let temp = parseCode(code);
        makeArray(temp);
        let parsedCode2 =esprima.parseScript(code,{range:true});
        startSubstitution(code, vars);
        let result = createGraph(parsedCode2,code);
        let expectedResult=' shape="box"\n'+
        'n1 [label="(1) \n'+
        'x < 0" shape="diamond" value="false" fillcolor="green" style="filled"]\n'+
        'n2 [label="(2) \n'+
        'x=x+1" shape="box"]\n'+
        'n3 [label="(3) \n'+
        'return c;" shape="box" fillcolor="green" style="filled"]\n'+
        'n4 [label="(4) \n'+
        'c = c + x + 5" shape="box" fillcolor="green" style="filled"]\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        'n1 -> n2 [label="true" shape="diamond"]\n'+
        'n1 -> n4 [label="false" shape="diamond"]\n'+
        ' shape="box"\n'+
        'n2 -> n6 [ shape="diamond"]\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        'n4 -> n6 [ shape="diamond"]\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        'n6 -> n3 []\n'+
        'n6 [label="" fillcolor="green" style="filled"]';
        assert.deepEqual(result, expectedResult);
    });
    it('test grpah if with else and update', ()=> {
        let code = 'function foo(x){\n'+
            'if (x < 0) {\n'+
            'x++;\n'+
            '} else {\n'+
            'c = c + x + 5;\n'+
            '}\n'+
            'return c;\n'+
            '}';
        let vars = 'foo(1)';
        let temp = parseCode(code);
        makeArray(temp);
        let parsedCode2 =esprima.parseScript(code,{range:true});
        startSubstitution(code, vars);
        let result = createGraph(parsedCode2,code);
        let expectedResult=' shape="box"\n'+
            'n1 [label="(1) \n'+
            'x < 0" shape="diamond" value="false" fillcolor="green" style="filled"]\n'+
            'n2 [label="(2) \n'+
            'x++" shape="box"]\n'+
            'n3 [label="(3) \n'+
            'return c;" shape="box" fillcolor="green" style="filled"]\n'+
            'n4 [label="(4) \n'+
            'c = c + x + 5" shape="box" fillcolor="green" style="filled"]\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            'n1 -> n2 [label="true" shape="diamond"]\n'+
            'n1 -> n4 [label="false" shape="diamond"]\n'+
            ' shape="box"\n'+
            'n2 -> n6 [ shape="diamond"]\n'+
            ' shape="box"\n'+
            'n4 -> n6 [ shape="diamond"]\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            'n6 -> n3 []\n'+
            'n6 [label="" fillcolor="green" style="filled"]';
        assert.deepEqual(result, expectedResult);
    });

    it('test grpah function with first example and while inside', ()=> {
        let code = 'function foo(x, y, z){\n'+
        'let a = x + 1;\n'+
        'let b = a + y;\n'+
        'let c = 0;\n'+
        'if(c==0){\n'+
            'while(b < z) {\n'+
                'b= b + 5;\n'+
            '}if (b < z * 2) {\n'+
                'c = c + x + 5;\n'+
            '}\n'+
        '}\n'+
        'return c;\n'+
    '}';
        let vars = 'foo(1,2,3)';
        let temp = parseCode(code);
        makeArray(temp);
        let parsedCode2 =esprima.parseScript(code,{range:true});
        startSubstitution(code, vars);
        let result = createGraph(parsedCode2,code);
        let expectedResult=' shape="box"\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        'n3 [label="(1) \n'+
        'a = x + 1\n'+
        'b = a + y\n'+
        'c = 0\n'+
        '" shape="box" fillcolor="green" style="filled"]\n'+
        'n4 [label="(2) \n'+
        'c==0" shape="diamond" value="true" fillcolor="green" style="filled"]\n'+
        'n5 [label="(3) \n'+
        'b < z" shape="diamond" value="false" fillcolor="green" style="filled"]\n'+
        'n6 [label="(4) \n'+
        'b= b + 5" shape="box"]\n'+
        'n7 [label="(5) \n'+
        'b < z * 2" shape="diamond" value="true" fillcolor="green" style="filled"]\n'+
        'n8 [label="(6) \n'+
        'c = c + x + 5" shape="box" fillcolor="green" style="filled"]\n'+
        'n9 [label="(7) \n'+
        'return c;" shape="box" fillcolor="green" style="filled"]\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        'n3 -> n4 [ shape="diamond"]\n'+
        'n4 -> n11 [label="true" shape="diamond"]\n'+
        'n4 -> n12 [label="false" shape="diamond"]\n'+
        ' shape="box"\n'+
        'n5 -> n6 [label="true" shape="diamond"]\n'+
        'n5 -> n7 [label="false" shape="diamond"]\n'+
        ' shape="box"\n'+
        'n6 -> n11 [ shape="diamond"]\n'+
        ' shape="box"\n'+
        'n7 -> n8 [label="true" shape="diamond"]\n'+
        'n7 -> n12 [label="false" shape="diamond"]\n'+
        ' shape="box"\n'+
        'n8 -> n12 [ shape="diamond"]\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        ' shape="box"\n'+
        'n11 -> n5 []\n'+
        'n11 [label="" fillcolor="green" style="filled"]\n'+
        'n12 -> n9 []\n'+
        'n12 [label="" fillcolor="green" style="filled"]';
        assert.deepEqual(result, expectedResult);
    });
    it('test grpah function with first example with array', ()=> {
        let code ='function foo(x, y, z){\n'+
            'let a = x[1] + 1;\n'+
            'let b = a + y;\n'+
            'let c = 0;\n'+
            'if (b < z) {\n'+
                'c = c + 5;\n'+
            '} else if (b < z * 2) {\n'+
                'c = c + x[2] + 5;\n'+
            '} else {\n'+
                'c = c + z + 5;\n'+
            '}\n'+
            'return c;\n'+
        '}';
        let vars = 'foo([1,2],2,3)';
        let temp = parseCode(code);
        makeArray(temp);
        let parsedCode2 =esprima.parseScript(code,{range:true});
        startSubstitution(code, vars);
        let result = createGraph(parsedCode2,code);
        let expectedResult=' shape="box"\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            'n3 [label="(1) \n'+
            'a = x[1] + 1\n'+
            'b = a + y\n'+
            'c = 0\n'+
            '" shape="box" fillcolor="green" style="filled"]\n'+
            'n4 [label="(2) \n'+
            'b < z" shape="diamond" value="false" fillcolor="green" style="filled"]\n'+
            'n5 [label="(3) \n'+
            'c = c + 5" shape="box"]\n'+
            'n6 [label="(4) \n'+
            'return c;" shape="box" fillcolor="green" style="filled"]\n'+
            'n7 [label="(5) \n'+
            'b < z * 2" shape="diamond" value="true" fillcolor="green" style="filled"]\n'+
            'n8 [label="(6) \n'+
            'c = c + x[2] + 5" shape="box" fillcolor="green" style="filled"]\n'+
            'n9 [label="(7) \n'+
            'c = c + z + 5" shape="box"]\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            'n3 -> n4 [ shape="diamond"]\n'+
            'n4 -> n5 [label="true" shape="diamond"]\n'+
            'n4 -> n7 [label="false" shape="diamond"]\n'+
            ' shape="box"\n'+
            'n5 -> n11 [ shape="diamond"]\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            'n7 -> n8 [label="true" shape="diamond"]\n'+
            'n7 -> n9 [label="false" shape="diamond"]\n'+
            ' shape="box"\n'+
            'n8 -> n11 [ shape="diamond"]\n'+
            ' shape="box"\n'+
            'n9 -> n11 [ shape="diamond"]\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            'n11 -> n6 []\n'+
            'n11 [label="" fillcolor="green" style="filled"]';
        assert.deepEqual(result, expectedResult);
    });
    it('test grpah if with second while example', ()=> {
        let code = 'function foo(x, y, z){\n'+
            'let a = x + 1;\n'+
            'let b = a + y;\n'+
            'let c = 0;\n'+
            'while (a < z) {\n'+
                'c = a + b;\n'+
                'z = c * 2;\n'+
                'a++;\n'+
            '}\n'+
            'return z;\n'+
        '}';
        let vars = 'foo(1,2,3)';
        let temp = parseCode(code);
        makeArray(temp);
        let parsedCode2 =esprima.parseScript(code,{range:true});
        startSubstitution(code, vars);
        let result = createGraph(parsedCode2,code);
        let expectedResult=' shape="box"\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            'n3 [label="(1) \n'+
            'a = x + 1\n'+
            'b = a + y\n'+
            'c = 0\n'+
            '" shape="box" fillcolor="green" style="filled"]\n'+
            'n4 [label="(2) \n'+
            'a < z" shape="diamond" value="true" fillcolor="green" style="filled"]\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            'n7 [label="(3) \n'+
            'c = a + b\n'+
            'z = c * 2\n'+
            'a++\n'+
            '" shape="box" fillcolor="green" style="filled"]\n'+
            'n8 [label="(4) \n'+
            'return z;" shape="box" fillcolor="green" style="filled" fillcolor="green" style="filled"]\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            'n3 -> n10 [ shape="diamond"]\n'+
            'n4 -> n7 [label="true" shape="diamond"]\n'+
            'n4 -> n8 [label="false" shape="diamond"]\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            'n7 -> n10 [ shape="diamond"]\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            'n10 -> n4 []\n'+
            'n10 [label="" fillcolor="green" style="filled"]';
        assert.deepEqual(result, expectedResult);
    });
    it('Array in arguments for function',()=> {
        let code = 'function foo(array,num){\n' +
            'if(array[1]=="asaf" && num==1){\n' +
            'return true;\n' +
            '}\n' +
            '}';
        let vars = 'foo([87,\'asaf\',false,7],0)';
        let temp = parseCode(code);
        makeArray(temp);
        startSubstitution(temp, vars);
        let result='';
        for(let i=0;i<newLines.length;i++){
            result= result+ newLines[i]+'\n';
        }
        assert.deepEqual('function foo(array,num){\n' +
            'if(array [ 1 ]  == "asaf" && num == 1){\n' +
            'return true;\n' +
            '}\n' +
            '}\n', result);
    });
    it('Global array no arguments', ()=>{
        let code='let array=[true];\n' +
            'function foo(){\n' +
            'let index=0;\n' +
            'if(array[index]){\n' +
            'return true;\n' +
            '\n'+
            '}\n' +
            '}'+'\n   ';
        let vars='';
        let temp=parseCode(code);
        makeArray(temp);
        startSubstitution(temp,vars);
        let result='';
        for(let i=0;i<newLines.length;i++){
            result= result+ newLines[i]+'\n';
        }
        assert.deepEqual(result,'function foo(){\n' +
            'if(array [ 0 ] ){\n' +
            'return true;\n' +
            '}\n' +
            '}\n');
    });
    it('Math operations and zero handling', ()=>{
        let code= 'function foo(x,y){\n' +
            'let num=0+x;\n' +
            'num=x+0;\n'+
            'num=0+x;\n'+
            'num=x+y;\n'+
            'num=x-0;\n'+
            'num=x-y;\n'+
            'num=3-2;\n'+
            'num=2*3;\n'+
            'num=a*3;\n'+
            'num=2*x;\n'+
            'num=y*x;\n'+
            'num=1/3;\n'+
            'num=x/10;\n'+
            'num=5/x;\n'+
            'num=b/x;\n'+
            '}';
        let vars='foo(76,5)';
        let temp=parseCode(code);
        makeArray(temp);
        startSubstitution(temp,vars);
        let result='';
        for(let i=0;i<newLines.length;i++){
            result=result+newLines[i]+'\n';
        }
        assert.deepEqual(result,'function foo(x,y){\n' +
            '}\n');
    });
    it('Function with unary', ()=> {
        let code = 'function foo(num){\n' +
            'if(-num<0)\n' +
            'return 1;\n' +
            '}';
        let vars = 'foo(1)';
        let temp = parseCode(code);
        makeArray(temp);
        startSubstitution(temp, vars);
        let result = '';
        for (let i = 0; i < newLines.length; i++) {
            result=result+ newLines[i] + '\n';
        }
        assert.deepEqual(result, 'function foo(num){\n' +
            'if(- num < 0)\n' +
            'return 1;\n' +
            '}\n');
    });
    it('test grpah if with second while example', ()=> {
        let code = 'function foo(x){\n'+
            'if(x==1){\n'+
            'if(x==1){\n'+
            'x++;\n'+
            '}\n'+
            'else{\n'+
            'while (x==0) {\n'+
            'x--;\n'+
            '}\n'+
            '}}\n'+
            'return x;\n'+
            '}';
        let vars = 'foo(1,2,3)';
        let temp = parseCode(code);
        makeArray(temp);
        let parsedCode2 =esprima.parseScript(code,{range:true});
        startSubstitution(code, vars);
        let result = createGraph(parsedCode2,code);
        let expectedResult=' shape="box"\n'+
            'n1 [label="(1) \n'+
            'x==1" shape="diamond" value="true" fillcolor="green" style="filled"]\n'+
            'n2 [label="(2) \n'+
            'x==1" shape="diamond" value="true" fillcolor="green" style="filled"]\n'+
            'n3 [label="(3) \n'+
            'x++" shape="box" fillcolor="green" style="filled"]\n'+
            'n4 [label="(4) \n'+
            'x==0" shape="diamond" value="false"]\n'+
            'n5 [label="(5) \n'+
            'x--" shape="box"]\n'+
            'n6 [label="(6) \n'+
            'return x;" shape="box" fillcolor="green" style="filled"]\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            'n1 -> n2 [label="true" shape="diamond"]\n'+
            'n1 -> n9 [label="false" shape="diamond"]\n'+
            ' shape="box"\n'+
            'n2 -> n3 [label="true" shape="diamond"]\n'+
            'n2 -> n8 [label="false" shape="diamond"]\n'+
            ' shape="box"\n'+
            'n3 -> n9 [ shape="diamond"]\n'+
            'n4 -> n5 [label="true" shape="diamond"]\n'+
            'n4 -> n9 [label="false" shape="diamond"]\n'+
            ' shape="box"\n'+
            'n5 -> n8 [ shape="diamond"]\n'+
            ' shape="box"\n'+
            ' shape="box"\n'+
            'n8 -> n4 []\n'+
            'n8 [label=""]\n'+
            'n9 -> n6 []\n'+
            'n9 [label="" fillcolor="green" style="filled"]';
        assert.deepEqual(result, expectedResult);
    });
    it('Function with 2 while loops and arrays ', ()=> {
        let code = 'function foo (items) {\n' +
            'let i=1;\n' +
            'while (i>0) {\n' +
            'let value = items[i];\n' +
            'let j=0;\n' +
            'while (j>0){\n' +
            'items[i+1] = items[j];\n' +
            'items[j ] = value;\n' +
            '}\n' +
            '}\n' +
            'return items;\n' +
            '}\n';
        let vars = 'foo([0,10,2,56])';
        let temp = parseCode(code);
        makeArray(temp);
        startSubstitution(temp, vars);
        let result = '';
        for (let i = 0; i < newLines.length; i++) {
            result = result+ newLines[i] + '\n';
        }
        assert.deepEqual(result, 'function foo (items) {\n' +
            'while (1 > 0) {\n' +
            'while (0 > 0){\n' +
            'items [ 2 ] =0;\n' +
            'items [ 0 ] =10;\n' +
            '}\n' +
            '}\n' +
            'return items;\n' +
            '}\n');
    });
    it('Function with all logic operators ', ()=> {
        let code = 'function foo(x, y, z){\n' +
            'if(x>y)\n' +
            'return false;\n' +
            'else if(x< y)\n' +
            'return true;\n' +
            'else if(x<=z)\n' +
            'return true;\n' +
            'else if((x>=z) || (y!=z))\n' +
            'return false;\n' +
            '}';
        let vars = 'foo(3,6,2)';
        let temp = parseCode(code);
        makeArray(temp);
        startSubstitution(temp, vars);
        let result = '';
        for (let i = 0; i < newLines.length; i++) {
            result = result+  newLines[i] + '\n';
        }
        assert.deepEqual(result, 'function foo(x, y, z){\n' +
            'if(x > y)\n' +
            'return false;\n' +
            'else if(x < y)\n' +
            'return true;\n' +
            'else if(x <= z)\n' +
            'return true;\n' +
            'else if(x >= z || y != z)\n' +
            'return false;\n' +
            '}\n');
    });
    it('Function with if condition with strong equality', ()=>{
        let code= 'function foo(num){\n' +
            'let array= [5,65,8];\n' +
            'num=array[num];\n' +
            'if (num===1){\n' +
            'return num;\n' +
            '}' +
            '}';
        let vars='foo(2)';
        let temp=parseCode(code);
        makeArray(temp);
        startSubstitution(temp,vars);
        let result='';
        for(let i=0;i<newLines.length;i++){
            result= result+ newLines[i]+'\n';
        }
        assert.deepEqual(result,'function foo(num){\n' +
            'num=8;\n' +
            'if (num === 1){\n' +
            'return num;\n'+
            '}\n' +
            '}\n');
    });
});