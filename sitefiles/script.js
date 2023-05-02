 

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

let database;
let jsonLoaded = false;
let bodyLoaded = false;
let mousePosition = {x: 0, y: 0};
let currentlyDragging = null;
let dragOffset = {x: 0, y: 0}
let bringBackSidebar = null;
let currentlyHovering = null;
let combineCircle = null;
/*
(async () => {
  var request = new XMLHttpRequest();
  request.open("GET", "https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/database.json", false);
  request.send(null)
  database = JSON.parse(request.responseText);
  jsonLoaded = true;
  consolelog("Json Loaded")
  if (bodyLoaded) {
    init()
  }
})();
*/

function initbody() {
  bodyLoaded = true;
  console.log("Body Initialized")
  combineCircle = document.getElementById("combinecircle");
  if (jsonLoaded) {
    init()
  }
  var request = new XMLHttpRequest();
  request.open("GET", "https://raw.githubusercontent.com/LooserRIP/AIElemental/gh-pages/database.json", false);
  request.send(null)
  database = JSON.parse(request.responseText);
  jsonLoaded = true;
  console.log("Json Loaded")
  if (bodyLoaded) {
    init()
  }
  document.addEventListener('mousemove', function(event) {
      mousePosition.x = event.pageX;
      mousePosition.y = event.pageY;
  });
  document.addEventListener('mouseup', function(event) {
    consolelog("stopped dragging")
    stopDrag()
  });
}
function init() {
  console.log("Init");
  setInterval(loop, 5)
}
let distanceLerp = 0;
let bringBack = [];
let waitTimeCC = 0;
let combining = null;
function loop() {
  if (currentlyDragging != null) {
    let viewportWidth  = document.documentElement.clientWidth;
    let viewportHeight = document.documentElement.clientHeight;
    currentlyDragging.style.left = (parseInt(mousePosition.x - dragOffset.x)) + "px";
    currentlyDragging.style.top = (parseInt(mousePosition.y - dragOffset.y)) + "px";
    if (parseInt(mousePosition.x - dragOffset.x) > (viewportWidth) - 300) {
      if (currentlyDragging.dataset["small"] == "0") {
        currentlyDragging.dataset["small"] = "1"
      }
    } else if (currentlyDragging.dataset["small"] == "1") {
      if (bringBackSidebar != null) bringBackSidebar.dataset['disappear'] = "0";
        currentlyDragging.dataset["small"] = "0"
    }
    if (currentlyHovering != null) {
      combineCircle.dataset["show"] = "1";
      consolelog(currentlyHovering.parentNode)
      consolelog((parseInt(mousePosition.x - dragOffset.x)), parseInt(currentlyHovering.parentNode.style.left))
      var lerpGetLeft = (((parseInt(currentlyDragging.style.left) + (parseInt(currentlyHovering.parentNode.style.left)))/ 2) - 174);
      var lerpGetTop = (((parseInt(currentlyDragging.style.top) + (parseInt(currentlyHovering.parentNode.style.top)))/ 2) - 174);
      consolelog("lerps" + lerpGetLeft +  "," + lerpGetTop)
      combineCircle.style.left = ((parseInt(combineCircle.style.left) * 0.9) + (lerpGetLeft * 0.1)) + "px"
      combineCircle.style.top = ((parseInt(combineCircle.style.top) * 0.9) + (lerpGetTop * 0.1)) + "px"
      if (waitTimeCC != null && performance.now() - waitTimeCC > 350) {
        combineCircle.style.left = lerpGetLeft + "px";
        combineCircle.style.top = lerpGetTop + "px";
      }
      waitTimeCC = performance.now()
    } else {
      distanceLerp = 0;
      combineCircle.dataset["show"] = "0";
      currentlyDragging.dataset["comb"] = "0";
    }
  } else {
    distanceLerp = 0;
  }
  if (bringBack.length > 0) {
    removeId = null;
  }
}
function spawnitem(id, posx, posy, smaller) {
  let innerHtmlItem = '<div class="gamecircle"></div><div class="gameimage" style="background-image: url(\'cdn/IconsStyle/%1%.png\')"></div><div class="gamehitbox" onmouseover="hoverElement(this, true)" onmouseout="hoverElement(this, false)" onmousedown="gameElmPress(this)"></div>'
  let htmlItem = document.createElement("DIV");
  htmlItem.className = "gameelement";
  htmlItem.dataset['id'] = id;
  htmlItem.dataset['small'] = "1";
  htmlItem.style.left = posx + "px";
  htmlItem.style.top = posy + "px";
  if (smaller == true) htmlItem.dataset["small"] = "2";
  htmlItem.innerHTML = innerHtmlItem.replace("%1%", database.elements[id].stripped);
  document.getElementById("gamecontainer").appendChild(htmlItem)
  return htmlItem
}
async function hoverElement(elm, status) {
  if (combining) return;
  if (currentlyDragging != null && currentlyDragging == elm) return; 
  let circleElm = elm.parentNode;
  var rndid = Math.round(Math.random() * 1000)
  consolelog("hover", rndid)
  if (status) {
    currentlyHovering = elm;
    if (currentlyDragging == null) {
      consolelog("hover move", rndid)
      circleElm.dataset['originalpos'] = getElementPosition(elm) + "";
      consolelog("movin to last sibling")
      moveToLastSibling(circleElm);
    }
  } else {
    if (currentlyHovering == elm) {
      if (currentlyDragging != null && currentlyDragging != elm) {
        bringBack.push(elm)
      }
      currentlyHovering = null;
    }
    elm.parentNode.dataset["comb"] = "0"
    consolelog("hover move back", rndid)
    if (currentlyDragging == null) {
      moveToOriginalPosition(circleElm, parseInt(circleElm.dataset['originalpos']));
      await sleep(1)
    }
  }
  await sleep(0)
  circleElm.dataset["hovered"] = status ? 1 : 0
  if (status) {
    if (currentlyDragging != elm && currentlyDragging != null) {
      circleElm.dataset["comb"] = "1";
      currentlyDragging.dataset["comb"] = "1";
    }
  }
}
async function combineGameElements(on, below) {
  combining = true;
  combineCircle.dataset["show"] = "0";
  on.dataset["comba"] = "2";
  below.dataset["comba"] = "2";
  let id1 = parseInt(on.dataset["id"]);
  let id2 = parseInt(below.dataset["id"]);
  if (id1 > id2) {
    let temp = id1;
    id1 = id2;
    id2 = temp;
  }
  console.log("COMBINE!", id1, id2)
  let combinationResult = database['recipes'][id1 + '.' + id2];
  console.log(combinationResult);
  if (combinationResult == 4) combinationResult = undefined;
  if (combinationResult == undefined) {
    on.dataset["comba"] = "0";
    on.dataset["comb"] = "0";
    on.dataset["hovered"] = "0";
    on.dataset["failed"] = "1";
    below.dataset["comba"] = "0";
    below.dataset["comb"] = "0";
    below.dataset["hovered"] = "0";
    below.dataset["failed"] = "1";
    await sleep(200)
    on.dataset["failed"] = "0";
    below.dataset["failed"] = "0";
    combining = false;
  } else {
    hoverElement(below, false);
    currentlyHovering = null;
    let interpolated = {x: (parseInt(on.style.left) + parseInt(below.style.left))/2, y: (parseInt(on.style.top) + parseInt(below.style.top))/2};
    for (let idt = 0; idt < 75; idt++) {
      on.style.left = ((parseInt(on.style.left) * 0.85) + (interpolated.x * 0.15)) + "px";
      on.style.top = ((parseInt(on.style.top) * 0.85) + (interpolated.y * 0.15)) + "px";
      below.style.left = ((parseInt(below.style.left) * 0.85) + (interpolated.x * 0.15)) + "px";
      below.style.top = ((parseInt(below.style.top) * 0.85) + (interpolated.y * 0.15)) + "px";
      await sleep(4)
    }
    combining = false;
    let spitem = spawnitem(combinationResult, interpolated.x, interpolated.y, true);
    await sleep(100)
    spitem.dataset["small"] = "0";
    spitem.dataset["newitem"] = "1";
    currentlyHovering = null;
    
    itemIsFinal = true;
    if (itemIsFinal) {
      await sleep(1500)
      destroyElm(spitem, combinationResult)
    }
  }
}
function startDrag(elm, ignore) {
  if (currentlyDragging != null) stopDrag()
  elm.dataset['dragging'] = "1"
  hoverElement(elm.childNodes[0], false)
  currentlyDragging = elm;
  moveToLastSibling(elm)
  if (ignore != true) dragOffset = {x: mousePosition.x - parseInt(elm.style.left), y: mousePosition.y - parseInt(elm.style.top)}
}
function gameElmPress(elm) {
  consolelog("yes");
  consolelog(elm.parentNode.dataset['small'])
  if (elm.parentNode.dataset['small'] == "0") {
    startDrag(elm.parentNode, false);
  }
}
async function destroyElm(elm, final) {
  elm.dataset["small"] = "2";
  elm.childNodes[2].dataset["disable"] = "1";
  if (final != undefined) {
    elm.dataset["finalitem"] = "1";
    await sleep(200);
    party.resolvableShapes["finalItem" + final] = `<img height="50px" width="50px" src="cdn\\IconsStyle\\` + database.elements[final].stripped + `.png"/>`;
    //rectsrc = party.sources.rectSource([parseInt(elm.style.left), parseInt(elm.style.top)]);
    var partyElm = document.createElement("DIV");
    partyElm.style.position = "absolute";
    partyElm.style.left = (parseInt(elm.style.left) - 23) + "px";
    partyElm.style.top = (parseInt(elm.style.top) - 12) + "px";
    document.getElementById("gamecontainer").appendChild(partyElm)
   /* party.confetti(partyElm,{
      shapes: ["finalItem" + final],
      debug: false,
      gravity: 1800,
      zIndex: 5,
      count: 15
    }); */
    party.scene.current.createEmitter({
      emitterOptions: {
        loops: 1,
        useGravity: false,
        modules: [
          new party.ModuleBuilder()
            .drive("size")
            .by((t) => (t < 0.2 ? t * 5 : 1))
            .build(),
          new party.ModuleBuilder()
            .drive("opacity")
            .by((t) => Math.max(0, 1 - t))
            .build(),
        ],
      },
      emissionOptions: {
        rate: 0,
        bursts: [{ time: 0, count: party.variation.skew(10, 5) }],
        sourceSampler: party.sources.dynamicSource(partyElm),
        angle: party.variation.range(0, 360),
        initialSpeed: party.variation.range(50, 500), // Different speeds for each particle
        initialColor: party.variation.gradientSample(
          party.Gradient.simple(party.Color.fromHex("#ffa68d"), party.Color.fromHex("#fd3a84"))
        ),
        lifetime: 0.5,
      },
      rendererOptions: {
        count: 15,
        zIndex: 5,
        shapeFactory: "finalItem" + final,
        applyLighting: undefined,
      },
    });
    
    await sleep(100);
    elm.remove();
  } else {
    await sleep(2000);
    elm.remove();
  }
}
function stopDrag() {
  consolelog("stopped dragging")
  if (bringBackSidebar != null) bringBackSidebar.dataset['disappear'] = "0";
  if (currentlyDragging != null) {
    if (currentlyHovering != null) {
      combineGameElements(currentlyDragging, currentlyHovering.parentNode)
    }
    if (currentlyDragging.dataset["small"] == "0") currentlyDragging.dataset["small"] = "0";
    if (currentlyDragging.dataset["small"] == "1") {
      destroyElm(currentlyDragging);
    }
    currentlyDragging.dataset["comb"] = "0";
    currentlyDragging.dataset['dragging'] = "0"
  }
  currentlyDragging = null;
}

function spawnside(elm) {
  let id = parseInt(elm.parentNode.dataset.id);
  consolelog(elm.parentNode, id)
  elm.dataset['disappear'] = "1"
  bringBackSidebar = elm;
  offsetElm = getOffset(elm.parentNode);
  dragOffset = {x: mousePosition.x - offsetElm.x, y: mousePosition.y - offsetElm.y}
  consolelog(dragOffset)
  let spawnedItem = spawnitem(id, offsetElm.x, offsetElm.y);
  startDrag(spawnedItem, true);
  dragOffset = {x: mousePosition.x - offsetElm.x, y: mousePosition.y - offsetElm.y}
}
function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX + 50,
    y: rect.top + window.scrollY + 50
  };
}
function moveToLastSibling(element) {
  if (!element.parentNode) {
    return;
  }
  
  element.parentNode.appendChild(element);
}
function moveToOriginalPosition(element, originalPosition) {
  if (!element.parentNode || originalPosition < 0) {
    return;
  }
  
  const siblings = element.parentNode.children;
  
  if (originalPosition < siblings.length) {
    element.parentNode.insertBefore(element, siblings[originalPosition]);
  } else {
    element.parentNode.appendChild(element);
  }
}
function getElementPosition(element) {
  if (!element.parentNode) {
    return -1;
  }
  
  const siblings = element.parentNode.children;
  return Array.from(siblings).indexOf(element);
}
function consolelog(msg) {
  //console.log(msg)
}