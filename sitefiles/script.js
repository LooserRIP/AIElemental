let fulljson;
let totalbrowserdiv;
let elementname;
let elementnamediv;
let addcount;
let addsugg;
let addrecipe;
let refetch;
let fetchbody;






const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


(async () => {

  totalbrowserdiv = document.getElementById("makearea");

  fulljson = await fetch("/recipes.json");
  fulljson = await fulljson.json();
  
  await sleep(10);
  subloop();
  addAnims();
  

  
})();


async function subloop() {
  
  initSide();
  elementname = document.getElementById("elementname");
  elementnamediv = document.getElementById("elementnamediv");
  while(true) {
  attemptrefetch();
  await sleep(10000);
  }
  
}


async function attemptrefetch() {
  await sleep(1000);
  var fulljsontemp = await fetch("/recipes.json");
  fulljson = await fulljsontemp.json();
}

async function refetchjson () {
    if (refetch) {
    refetch = false;
    var jsonchange = await fetch("https://laugc.glitch.me/additem", {
    method: "POST",
    body: fetchbody
    }) 
    if (JSON.stringify(jsonchange).includes("A:")) {
      alert("Submission Error: " + jsonchange.slice(2));
    } else {
      fulljson = await jsonchange.json();
    }
    
    refetch=false;
  }
}

function initSide() {
  
  var gck = getCookie("collection");
  if (getCookie("collection") == "") {
    setCookie("collection", "*1**2**3**4**5**6*", 365);
    gck = "*1**2**3**4**5**6*";
  }
  
  var skip = 0;
  var buildcookie = "";
  for(let ai = 0; ai < gck.length; ai++) { //if checkmark skip if not build up text until checkmark
    if (gck[ai] == "*") {
      if (buildcookie != "") {
        addSide(parseInt(buildcookie));
        buildcookie = "";
      }
    } else {
      buildcookie = buildcookie + gck[ai];
    }
  }
  
}







function addSide(aid) {
        if (aid > fulljson.length || aid < 0) {
          return;
        }
        var item = fulljson[aid - 1];
        var div = document.createElement("DIV");
        div.setAttribute("class", "sideelement");
        var txt = document.createElement("P");
        txt.setAttribute("class", "presult");
        if (item.name.length < 20) {
          txt.innerHTML = item.name;
        } else {
          txt.innerHTML = item.name.slice(0, 35);
        }
        var btn = document.createElement("INPUT");
        btn.setAttribute("type", "image");
        btn.setAttribute("src", demat(item.material));
        btn.setAttribute("onclick", 'clickbtn("' + item.name + '");' ); //            onclick="checkbox(this);"
        btn.setAttribute("class", "resultimg");
        btn.setAttribute("draggable", "false");
        btn.innerHTML = "";
        btn.setAttribute("onmousedown", "dragElement(" + aid + ", this)");       
  
        div.appendChild(btn);
        div.appendChild(txt);
        document.getElementById("sidebar").appendChild(div);
}

function dragElement(did, bt) {
  bt.addEventListener("onmousemove", dragMoveHandler(did));
}

function dragMoveHandler(did, e) {
  if (!e) e = window.event; 
  spawnElement(did, e.clientY - 50, e.clientX - 50, true, e);
  
}
function spawnDragElement(ido, x, y, event) {
  var id = ido - 1;
  var div = document.createElement("DIV");
  div.setAttribute("class", "element");
  div.setAttribute("data-id", id);
  div.setAttribute(
    "style",
    "position: absolute; top: " + x + "px; left: " + y + "px;"
  );
  div.setAttribute("onmousedown", "drag(this, event);");
  var btn = document.createElement("IMG");
  btn.setAttribute(
    "src",
    demat(fulljson[id].material)
  );
  div.addEventListener("mouseleave", function (event) {
    btn.setAttribute("height", "100");
    btn.setAttribute("width", "100");
    //div.style.height = "125px";
    //div.style.width = "125px";
    btn.setAttribute("class", "elementimg");
    
    elementname.textContent = "";
    //console.log("false " + fulljson[id].name)
  }, false);
  div.addEventListener("mouseover", function (event) {
    btn.setAttribute("height", "110");
    btn.setAttribute("width", "110");
    elementname.textContent = fulljson[id].name;
    //div.style.height = "125px";
    //div.style.width = "125px";
    //console.log("true " + fulljson[id].name)
  }, false);
  btn.setAttribute("class", "resultimg");
  btn.setAttribute("height", "100");
  btn.setAttribute("width", "100");
    btn.setAttribute("class", "elementimg");
  btn.setAttribute("draggable", "false");
  btn.innerHTML = "";
  div.appendChild(btn);
  totalbrowserdiv = document.getElementById("makearea");
  totalbrowserdiv.appendChild(div);
  drag(div, event);
}
function spawnElement(ido, x, y, dragv, dragevent) {
  if (adduitrue) {
    return;
  }
  var id = ido - 1;
  var div = document.createElement("DIV");
  div.setAttribute("class", "element");
  div.setAttribute("data-id", id);
  div.setAttribute(
    "style",
    "position: absolute; top: " + x + "px; left: " + y + "px;"
  );
  div.setAttribute("onmousedown", "drag(this, event);");
  var btn = document.createElement("IMG");
  btn.setAttribute(
    "src",
    demat(fulljson[id].material)
  );
  div.addEventListener("mouseleave", function (event) {
    div.style.zIndex = 0;
    btn.setAttribute("height", "100");
    btn.setAttribute("width", "100");
    elementname.textContent = "";
    //div.style.height = "125px";
    //div.style.width = "125px";
    btn.setAttribute("class", "elementimg");
  }, false);
  div.addEventListener("mouseover", function (event) {
    div.style.zIndex = 3;
    btn.setAttribute("height", "110");
    btn.setAttribute("width", "110");
    elementnamediv.style.left = div.style.left;
    elementnamediv.style.top = (parseInt(div.style.top) + 80) + "px";
    elementname.textContent = fulljson[id].name;

    //div.style.height = "125px";
    //div.style.width = "125px";
    //console.log("true " + fulljson[id].name)
  }, false);
  btn.setAttribute("class", "resultimg");
  btn.setAttribute("height", "100");
  btn.setAttribute("width", "100");
    btn.setAttribute("class", "elementimg");
  btn.setAttribute("draggable", "false");
  btn.innerHTML = "";
  div.appendChild(btn);
  totalbrowserdiv = document.getElementById("makearea");
  totalbrowserdiv.appendChild(div);
  if (dragv) {
  drag(div, dragevent);
  } else {
    if (!dragevent) {
      var highlight = document.createElement("IMG");
      highlight.setAttribute("src","https://cdn.discordapp.com/attachments/837293705349038123/901047515879706694/a.png");
      highlight.setAttribute("width", "150");
      highlight.setAttribute("height", "150");
      highlight.setAttribute("class", "elementhighlight");
      highlight.setAttribute("draggable", "false");
      highlight.setAttribute("data-rotate", "0");
      highlight.style.opacity = "0.75";
      div.insertBefore(highlight,btn);
    }
  }
  
}
function drag(elementToDrag, event)
 {
   if (adduitrue) {
     return;
   }
     var parent = elementToDrag.parentNode;
     parent.insertBefore(elementToDrag, null);
     var startX = event.clientX, startY = event.clientY;

     var origX = elementToDrag.offsetLeft , origY = elementToDrag.offsetTop;

     var deltaX = startX - origX, deltaY = startY - origY;
     if (document.addEventListener) 
     {
         // Register capturing event handlers
         document.addEventListener("mousemove", moveHandler, true);
         document.addEventListener("mouseup", upHandler, true);
     }
     else if (document.attachEvent) 
     {
         elementToDrag.setCapture();
         elementToDrag.attachEvent("onmousemove", moveHandler);
         elementToDrag.attachEvent("onmouseup", upHandler);
         elementToDrag.attachEvent("onclosecapture", upHandler);
     }
     else 
     {
         var oldmovehandler = document.onmousemove; 
         var olduphandler = document.onmouseup;
         document.onmousemove = moveHandler;
         document.onmouseup = upHandler;
     }

     if (event.stopPropagation) event.stopPropagation();    
     else event.cancelBubble = true;                        


     if (event.preventDefault) event.preventDefault();     
     else event.returnValue = false;                        

      function moveHandler(e)
      {
          if (!e) e = window.event; 
          elementToDrag.style.left = (e.clientX - deltaX) + "px";
          elementToDrag.style.top = (e.clientY - deltaY) + "px";
          elementnamediv.style.left = elementToDrag.style.left;
          elementnamediv.style.top = (e.clientY - deltaY + 80) + "px";
          if (e.stopPropagation) e.stopPropagation();      
          else e.cancelBubble = true;                   
      }

       function upHandler(e)
       {
           elementToDrag.style.zIndex = 0;
            const width  = window.innerWidth || document.documentElement.clientWidth || 
            document.body.clientWidth;
            if (parseInt(elementToDrag.style.left) > (width - 400)) {
              elementToDrag.parentNode.removeChild(elementToDrag);
              elementname.textContent = "";
            }
         //Combine Detection yay!
           var getElements = document.getElementsByClassName("element");
           var overlapFound;
           overlapFound = false;
           var overlapElement;
           
           for (let i = 0; i < getElements.length; i++) {
             if (getElements[i] != elementToDrag) {
               var rect1 = getElements[i].getBoundingClientRect();
               var rect2 = elementToDrag.getBoundingClientRect();
               var overlap = !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom)
               if (overlap) {
               overlapFound = true;
               overlapElement = getElements[i];
               }
             }
           }
           if (overlapFound) {
             var getDataId1 = parseInt(elementToDrag.getAttribute("data-id"));
             var getDataId2 = parseInt(overlapElement.getAttribute("data-id"));
             var recipeCode = (getDataId1 + 1) + "-" + (getDataId2 + 1);
             if (getDataId1 > getDataId2) {
               var recipeCode = (getDataId2 + 1) + "-" + (getDataId1 + 1);
             }
             
             let queryIndex = -1;
             for (let fi = 0; fi < fulljson.length; fi++) {
               if (recipeCode != '0-0') {
                 if (recipeCode == fulljson[fi].recipe[0] + "-" + fulljson[fi].recipe[1]) {
                   queryIndex = fi + 1;
                   break;
                 }
               }
             }
             if (queryIndex != -1) {
               var checkcoll = checkCollection(queryIndex);
               if (checkcoll) {
               } else {
                 
                 addCollection(queryIndex)
                 addSide(queryIndex);
               }
               spawnElement(queryIndex, (parseInt(elementToDrag.style.top) + parseInt(overlapElement.style.top)) / 2, (parseInt(elementToDrag.style.left) + parseInt(overlapElement.style.left)) / 2, false, checkcoll);
               //spawnElement(queryIndex, parseInt(elementToDrag.style.top), parseInt(elementToDrag.style.left));

               
               elementToDrag.remove();
               overlapElement.remove();
             } else {
               addcount = 400;
               addrecipe = recipeCode;
             }
             
           }
           
         
           if (!e) e = window.event;    

           if (document.removeEventListener) 
            {
                document.removeEventListener("mouseup", upHandler, true);
                document.removeEventListener("mousemove", moveHandler, true);
            }
            else if (document.detachEvent)  
            {
                elementToDrag.detachEvent("onlosecapture", upHandler);
                elementToDrag.detachEvent("onmouseup", upHandler);
                elementToDrag.detachEvent("onmousemove", moveHandler);
                elementToDrag.releaseCapture();
            }
            else    
            {
                document.onmouseup = olduphandler;
                document.onmousemove = oldmovehandler;
            }

            if (e.stopPropagation) e.stopPropagation(); 
            else e.cancelBubble = true;              
       }
 }

 function closeMe(elementToClose)
 {
     elementToClose.innerHTML = '';
     elementToClose.style.display = 'none';
 }

 function minimizeMe(elementToMin, maxElement)
 {
     elementToMin.style.display = 'none';
 }
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


function checkCollection(cid) {
  if (getCookie("collection").includes("*" + cid + "*")) {
    return true;
  }
  return false;
}

function addCollection(cid) {
  var gc = getCookie("collection");
  setCookie("collection", gc + "*" + cid + "*");
}

function setCookie(cname, cvalue) {
  localStorage.setItem(cname, cvalue)
}

function getCookie(cname) {
  var gi = localStorage.getItem(cname);
  if (gi == null) {
    gi = "";
  }
  return(gi);
}

let addui;
let adduitrue;

async function addAnims() {
      await sleep(5);
    addsugg = document.getElementById("addsuggestion");    
    addui = document.getElementById("addui");
    addsugg.style.left = -500 + "px";
    addui.style.top = "10000px";
    while(true) {
    var height  = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var lerptarget = -600;
    if (addcount > 0) {

      addsugg.style.top = (height - 73) + "px";
      lerptarget = 0;
      addcount -= 1;
    }
    addsugg.style.left = (((parseInt(addsugg.style.left) * 9) + lerptarget) / 10)+ "px";
      
    var lerptarget2 = height * 1.15;
    if (adduitrue) {
      lerptarget2 = 150;
    }
    addui.style.left = ((width / 2) -410) + "px";
    addui.style.top = (((parseInt(addui.style.top) * 9) + lerptarget2) / 10) + "px";
    var getElls = document.getElementsByClassName("elementhighlight");
    for (let ie = 0; ie < getElls.length; ie++) {
      var ier = parseInt(getElls[ie].getAttribute("data-rotate")) + 1;
      getElls[ie].style.transform = "rotate(" + ier + "deg)";
      getElls[ie].setAttribute("data-rotate", ier);
      var fl = parseFloat(getElls[ie].style.opacity) - 0.002;
      getElls[ie].style.opacity = "" + fl;
      if (fl <= 0) {
        getElls[ie].remove();
      }
    }
      
    
      
    await sleep(10);
}
}



function demat(dec) {
  return dec;
}


function exitadd() {
  addcount = 0;
}

function openadd() {
  updateings();
  adduitrue = true;
  addcount = 0;
}

function exitaddui() {
  adduitrue = false;
}

function submit() {
  var iname = document.getElementById("auiname");
  var ilore = document.getElementById("auilore");
  var iauthor = document.getElementById("auiauthor");
  var imaterial = document.getElementById("auiref");
  var ipassword = document.getElementById("auipassword");
  
  if (iname.value == "" || iauthor.value == "") {
    alert("Put a name and an author!");
    return;
  }
  
  var stripname = strip(iname.value);
  let itemIndex = fulljson.findIndex(i => strip(i.name) == stripname);
  
  if (itemIndex != -1) {
    alert("Item name already exists");
    return;
  }

  fetchbody = joinSubmission(iname.value, ilore.value, iauthor.value, imaterial.value, ipassword.value);
  if (imaterial.value == "") {
    fetchbody = joinSubmission(iname.value, ilore.value, iauthor.value, canvas.toDataURL(), ipassword.value);
  } 
  refetch = true;
  refetchjson();
  
  attemptrefetch();
  
  
  adduitrue = false;
}

function updateings() {
  var splitRecipeText = addrecipe.split("-");
  var splitRecipe0 = parseInt(splitRecipeText[0]) - 1;
  var splitRecipe1 = parseInt(splitRecipeText[1]) - 1;
  document.getElementById("ing1img").setAttribute("src", demat(fulljson[splitRecipe0].material));
  document.getElementById("ing2img").setAttribute("src", demat(fulljson[splitRecipe1].material));
  document.getElementById("ing1txt").textContent = (fulljson[splitRecipe0].name);
  document.getElementById("ing2txt").textContent = (fulljson[splitRecipe1].name);
}
function strip(text) {
  return text.toLowerCase().replace(/[^a-z]/g, "");
}

function joinSubmission(name, lore, author, material, password) {
  let date = new Date();
  let now = date.toLocaleString('en-US');
  var splitRecipeText = addrecipe.split("-");
  var splitRecipe0 = parseInt(splitRecipeText[0]) - 1;
  var splitRecipe1 = parseInt(splitRecipeText[1]) - 1;
  var inglevel = parseInt(fulljson[splitRecipe0].inglevel) + parseInt(fulljson[splitRecipe1].inglevel);
  var intendedmaterial = material;
  
  return fixexploit(name) + "^" + addrecipe.replace("-", ":") + "^" + fixexploit(intendedmaterial) + "^" + fixexploit(lore) + "^" + fixexploit(author) + "^" + inglevel + "^" + now + "^" + fixexploit(password);
}

function fixexploit(st) {
  return st.replace("^", "").replace("{", "").replace("}","").replace('"', '');
}




var canvas;
var context;

var lastPos;
var canvascolor;
var canvasstroke;
var canvastype;
var mouseDown = false;
var fillpaints;
var actioncounter;
var undoactioncount;
var redoactioncount;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function pickcolor(elemt) {
  canvascolor = elemt.getAttribute("data-color");
  document.getElementById("customcolorpick").value = canvascolor;
}

function picksize(elemt) {
  canvasstroke = parseInt(elemt.getAttribute("data-size"));
}



//canvas shit
function init() {
  
  var ismobile = false;
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    ismobile = true;
  }
  if (ismobile) {
    window.location.replace("http://laugc.glitch.me/mobile");
  }
  
  canvascolor = "#FFFFFF";
  canvasstroke = 1;
  canvastype = 1;
  picktype(document.getElementById("brush"));
  canvas = document.getElementById("can");
  context = canvas.getContext("2d");
  undoactioncount = [];
  redoactioncount = [];
  UndoCanvas.enableUndo(context);
  
  document.body.onmousedown = function() { 
    fillpaints = [];
    mouseDown = true;
    if (canvastype == 1 || canvastype == 2) {
      actioncounter = 0; 
    }
  }
  document.body.onmouseup = function() {
    if (canvastype == 1 || canvastype == 2) {
      if (actioncounter > 0) {
        undoactioncount.push(actioncounter);
        redoactioncount = [];
        actioncounter = 0;
      }
    }
    if (adduitrue) {
      if (fillpaints.length > 0) {
        fillpaints.push(fillpaints[0]);
        context.beginPath();
        context.lineWidth = 3;
        context.lineJoin="round";
        context.lineCap="round";
        context.strokeStyle = canvascolor;
        context.fillStyle = canvascolor;
        context.moveTo(fillpaints[0].x, fillpaints[0].y);
        for(let ia = 1; ia < fillpaints.length; ia++) {
          context.lineTo(fillpaints[ia].x, fillpaints[ia].y);
        }
        actioncounter += 2;
        undoactioncount.push(actioncounter);
        redoactioncount = [];
        actioncounter = 0;
        context.fill();
        context.stroke();
      }
    }
    mouseDown = false;
  }
  document.body.onmousemove = function(event) {
    lastPos = getMousePos(canvas, event);
  }
  
  if (getCookie("colorc") == "") {
    setCookie("colorc", "#FFFFFF,#FFDD56,#FF984F,#FF2F4F,#7CFF30,#30FFA2,#30D5FF,#3041FF,#A200FF,#8E451B,#8C8C8C,#000000");
  }
  var gc = getCookie("colorc").split(",");
  for (let ie = 0; ie < gc.length; ie++) {
    addColorPick(gc[ie]);
  }
  
  var pick = document.createElement("INPUT");
  pick.setAttribute("onchange", "customcolorchange(this)");
  pick.setAttribute("type", "color");
  pick.setAttribute("id", "customcolorpick")
  pick.setAttribute("class", "customcolorpick");
  document.getElementById("colorcollection").appendChild(pick);
  document.getElementById("customcolorpick").value = canvascolor;
  
}

function addColorPick(color) {
  var pick = document.createElement("INPUT");
  pick.setAttribute("onclick", "pickcolor(this)");
  pick.setAttribute("type", "image");
  pick.setAttribute("class", "colorpick");
  pick.setAttribute("style", "background-color:" + color + ";");
  pick.setAttribute("data-color", color);
  document.getElementById("colorcollection").appendChild(pick);
}

var fillpainti = 0;

function move(evt) {
  var pos = getMousePos(canvas, evt);
  if (mouseDown) {
    if (canvastype == 1) {
      context.globalCompositeOperation="source-over";
      context.beginPath();
      context.moveTo(lastPos.x, lastPos.y);
      context.lineTo(pos.x, pos.y);
      context.strokeStyle = canvascolor;
      context.lineWidth = canvasstroke;
      context.lineJoin="round";
      context.lineCap="round";
      context.stroke();
      actioncounter++;
    }
    if (canvastype == 2) {
      context.globalCompositeOperation='destination-out';
      context.beginPath();
      context.fill();
      context.lineWidth=canvasstroke;
      context.moveTo(lastPos.x, lastPos.y);
      context.lineTo(pos.x, pos.y);
      context.lineJoin="round";
      context.lineCap="round";
      context.stroke();
      actioncounter += 2;
    }
    if (canvastype == 4) {
      fillpainti++;
      if (fillpainti % 5 == 0) {
        
      context.globalCompositeOperation="source-over";
      context.beginPath();
      context.moveTo(lastPos.x, lastPos.y);
      context.lineTo(pos.x, pos.y);
      context.strokeStyle = "#0094FF";
      context.lineWidth = 2;
      context.lineJoin="round";
      context.lineCap="round";
      context.stroke();
      actioncounter++;
      }
      fillpaints.push(pos);
    }
  }
}
//canvas click

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

async function draw(evt) {
  if (canvastype == 3) {
    actioncounter = 0;
    var posclick = roundPos(getMousePos(canvas, evt));
    var pl = [posclick];
    var epl = [];
    var p = getPixel(Math.floor(posclick.x), Math.floor(posclick.y));
    var hexcheck = hexToRgb(canvascolor);
    var canvascolorsave = canvascolor;
    
    var ic = 0;
    if (Math.abs(p[0] - hexcheck.r) < 10 && Math.abs(p[1] - hexcheck.g) < 10 && Math.abs(p[2] - hexcheck.b) < 10) {
      ic = 50001;
    }
    while(adduitrue) {
      ic++;
      var gp = pl[0];
      context.fillStyle = canvascolorsave;
      context.fillRect(gp.x, gp.y, 1, 1 );
      actioncounter++;
      check(gp.x + 1, gp.y);
      check(gp.x, gp.y + 1);
      check(gp.x - 1, gp.y);
      check(gp.x, gp.y - 1);
      
      if (pl.length == 1) {
        break;
      }
      
      pl = pl.slice(1,pl.length);
      if (ic % 500 == 0) {
        await sleep(1);
      }
      if (ic > 80000) {
        break;
      }
    }
    
      if (actioncounter > 0) {
        undoactioncount.push(actioncounter);
        redoactioncount = [];
        actioncounter = 0;
      }
    
    function check(xc, yc) {
      var ts = context.getImageData(xc, yc, 1, 1).data;
      if (Math.abs(p[0] - ts[0]) < 10 && Math.abs(p[1] - ts[1]) < 10 && Math.abs(p[2] - ts[2]) < 10) {
        if(!epl.includes(xc + "_" + yc) ) {
          if (xc < 402 && xc > -2 && yc < 402 && yc > -2) {
            pl.push(initpos(xc, yc));
            epl.push(xc + "_" + yc);
          }
        }
      }
    } 
    
    //while(true) {
      
    //}
  }
}

var undoing = false;

async function undo() {
  if (!undoing) {
    if (undoactioncount.length > 0) {
      var reps = undoactioncount.pop();
      redoactioncount.push(reps);
      undoing = true;
      for(let ie = 0; ie < reps; ie++) {
        context.undo(); 
        if (ie % 50 == 0) {
          await sleep(1);
        }
      }
      undoing = false;
    }
  }
}
async function redo() {
  if (!undoing) {
    if (redoactioncount.length > 0) {
      var reps = redoactioncount.pop();
      undoactioncount.push(reps);
      undoing = true;
      for(let ie = 0; ie < reps; ie++) {
        context.redo(); 
        if (ie % 50 == 0) {
          await sleep(1);
        }
      }
      undoing = false;
    }
  }
}

function clearR() {
  context.clearRect(0,0,400,400);
  undoactioncount.push(1);
}


function roundPos(rp) {
    return {
      x: Math.floor(rp.x),
      y: Math.floor(rp.y)
    };
  
}

function initpos(xx,yy)  {
    return {
      x: xx,
      y: yy
    };
}
function getPixel(tx, ty) {
  var ts = context.getImageData(tx, ty, 1, 1).data;
  return ts;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function customcolorchange(elemt) {
  canvascolor = elemt.value;
}


function picktype(elemt) {
  var getElls = document.getElementsByClassName("typepick");
  for (let ie = 0; ie < getElls.length; ie++) {
    if (getElls[ie] == elemt) {
      getElls[ie].style.backgroundColor = "#8CC5FF";
    } else {
      getElls[ie].style.backgroundColor = "#FFFFFF";
    }
  }
  canvastype = parseInt(elemt.getAttribute("data-type"));
}



//LZW comp

var LZW = {
    compress: function (uncompressed) {
        "use strict";
        // Build the dictionary.
        var i,
            dictionary = {},
            c,
            wc,
            w = "",
            result = [],
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[String.fromCharCode(i)] = i;
        }
 
        for (i = 0; i < uncompressed.length; i += 1) {
            c = uncompressed.charAt(i);
            wc = w + c;
            //Do not use dictionary[wc] because javascript arrays 
            //will return values for array['pop'], array['push'] etc
           // if (dictionary[wc]) {
            if (dictionary.hasOwnProperty(wc)) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                // Add wc to the dictionary.
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }
 
        // Output the code for w.
        if (w !== "") {
            result.push(dictionary[w]);
        }
        return result;
    },
 
 
    decompress: function (compressed) {
        "use strict";
        // Build the dictionary.
        var i,
            dictionary = [],
            w,
            result,
            k,
            entry = "",
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[i] = String.fromCharCode(i);
        }
 
        w = String.fromCharCode(compressed[0]);
        result = w;
        for (i = 1; i < compressed.length; i += 1) {
            k = compressed[i];
            if (dictionary[k]) {
                entry = dictionary[k];
            } else {
                if (k === dictSize) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }
 
            result += entry;
 
            // Add w+entry[0] to the dictionary.
            dictionary[dictSize++] = w + entry.charAt(0);
 
            w = entry;
        }
        return result;
    }
}

//no more canvas shit


var clearingboard = false;
var sidebar;

async function clearboard() {
  var getElls = document.getElementsByClassName("element");
  if (!clearingboard) {
    clearingboard = true;
    var lengthOld = getElls.length;
      for (var id = 0; id < lengthOld; id += 1) {
        getElls[0].remove();
      }
  }
}

async function challenge() {
  var challengecomps = [];
  for(var i = 0; i < fulljson.length; i += 1) {
    if (!checkCollection(i + 1)) {
      
      challengecomps.push(i);
    }
  }
  
  if (challengecomps.length == 0) {
    alert("Error: You have found all of the items!");
  } else {
    var ci = Math.round((Math.random() * challengecomps.length));
    var fj = fulljson[challengecomps[ci]];
    console.log(fj);
    console.log(fj.recipe[1]);
    alert("Try Finding " + fj.name + "!\nHint Ingredient: " + fulljson[fj.recipe[1] - 1].name);
  }
  
}