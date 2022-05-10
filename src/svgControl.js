SvgControl = (function(d){

  // イベントライブラリ
  function Event(target, mode, func){
		if (typeof target.addEventListener !== "undefined"){
      target.addEventListener(mode, func, false)
      return true
    }
    if(typeof target.attachEvent !== "undefined"){
      target.attachEvent('on' + mode, function(){func.call(target , window.event)})
      return true
    }
    return false
  }

  const setting = {
    exclusion_style_tag : false,
  }
  
  // svgLoad
  function MAIN(options){
    this.options = this.setOptions(options)
    this.load()
  }

  MAIN.prototype.setOptions = function(options){
    if(!options){return {}}
    const newOptions = JSON.parse(JSON.stringify(setting))
    for(let i in options){
      newOptions[i] = options[i]
    }
    return newOptions
  }

  MAIN.prototype.load = function(){
    switch(d.readyState){
      case "complete":
        this.start()
        break
      case "interactive":
        Event(window , "DOMContentLoaded" , (function(e){
          this.start(e)
        }).bind(this))
        break
      default:
        Event(window , "load" , (function(e){
          this.start(e)
        }).bind(this))
        break
    }
  }
  MAIN.prototype.start = function(){
    this.initImg2Svg()
    this.initSvg2Svg()
  };

  // ページ内のIMGタグをsvgタグに変更
  MAIN.prototype.initImg2Svg = function(){
    var imgTags = d.images
    for(let i=0; i<imgTags.length; i++){
      if(this.getExt(imgTags[i].src) !== 'svg'){continue}
      const src = imgTags[i].src
      const ext = this.getExt(src)
      if(!ext || ext.toLowerCase() !== "svg"){continue}
      const req = new XMLHttpRequest()
      req.open('GET' , src , true)
      req.setRequestHeader('Content-Type', 'text/plane');
      req.onreadystatechange = this.setImg2Svg.bind(this , imgTags[i])
      req.send()
    }
  }
  MAIN.prototype.setImg2Svg = function(target , e){
    if(e.target.readyState !== 4 || e.target.status !== 200){return}
    const svgElement = this.vertualSvg(e.target.response)
    if(!svgElement){return}
    let svg = this.makeSvg()
    svg.innerHTML = svgElement.innerHTML
    svg = this.cutStyle(svg)
    this.setSameAttributes(svgElement , svg)
    target.parentNode.insertBefore(svg , target)
    target.parentNode.removeChild(target)
  }

  // 指定SVGタグに情報追記
  MAIN.prototype.initSvg2Svg = function(){
    var svgFiles = d.getElementsByTagName("svg")
    for(let i=0; i<svgFiles.length; i++){
      const url = svgFiles[i].getAttribute("src")
      if(!url){continue}
      const req = new XMLHttpRequest()
      req.open('GET' , url , true)
      req.setRequestHeader('Content-Type', 'text/plane');
      req.onreadystatechange = this.setSvg2Svg.bind(this , svgFiles[i])
      req.send()
    }
  }

  MAIN.prototype.setSvg2Svg = function(target , e){
    if(e.target.readyState !== 4 || e.target.status !== 200){return}
    const svgElement = this.vertualSvg(e.target.response)
    if(!svgElement){return}
    let svg = target
    svg.innerHTML = svgElement.innerHTML
    svg = this.cutStyle(svg)
    svg.removeAttribute("src")
    this.setSameAttributes(svgElement , svg)
  }

  MAIN.prototype.makeSvg = function(){
    return d.createElementNS("http://www.w3.org/2000/svg" , "svg")
  }

  MAIN.prototype.setSameAttributes = function(baseElm , targetElm){
    if(!baseElm || !targetElm){return}
    const attributes = baseElm.attributes
    if(!attributes || !attributes.length){return}
    for(let attr of attributes){
      targetElm.setAttribute(attr.nodeName , attr.nodeValue)
    }
  }

  MAIN.prototype.getExt = function(path){
    if(!path){return}
    const sp1 = path.split("#")
    const sp2 = sp1[0].split("?")
    const sp3 = sp2[0].split(".")
    return sp3[sp3.length-1]
  }

  MAIN.prototype.cutStyle = function(elm){
    if(this.options.exclusion_style_tag){
      var styles = elm.getElementsByTagName("style");
      for(var i=styles.length-1; i>=0; i--){
        styles[i].parentNode.removeChild(styles[i]);
      }
    }
    return elm
  }

  MAIN.prototype.vertualSvg = function(html){
    const div = d.createElement("div")
    div.innerHTML = html
    const elms = div.getElementsByTagName("svg")
    return elms.length ? elms[0] : null
  }

  return MAIN
})(document)