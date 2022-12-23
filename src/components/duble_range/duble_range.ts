import './duble_range.css'

type DubleRangeOptions = {
  min:number,
  max:number,
  eventName:string
}

export class DubleRange{
  parentDOM:HTMLElement
  options: DubleRangeOptions
  containerDOM:HTMLElement
  firstInputDOM:HTMLInputElement
  secondInputDOM:HTMLInputElement
  firstInfoDOM:HTMLElement
  secondInfoDOM:HTMLElement
  constructor(selector:HTMLElement,options:DubleRangeOptions){
    this.parentDOM = selector
    this.options = options
    this.render()
    this.containerDOM = this.parentDOM.querySelector('.duble-range')!
    this.firstInputDOM = this.containerDOM.querySelector('.duble-range__i1')!
    this.secondInputDOM = this.containerDOM.querySelector('.duble-range__i2')!
    this.secondInfoDOM = this.containerDOM.querySelector('.info__left')!
    this.firstInfoDOM = this.containerDOM.querySelector('.info__right')!
    this.renderInfoCurrentValue()
    this.drEventsTracker()
  }
  render(){
    this.parentDOM.innerHTML = getdubleRangeHTML(this.options)
  }
  drEventsTracker(){
    this.firstInputDOM.addEventListener('input',()=>{
      this.setBackgroundGradient()
      this.renderInfoCurrentValue()
    })
    this.secondInputDOM.addEventListener('input',()=>{
      this.setBackgroundGradient()
      this.renderInfoCurrentValue()
    })
    this.firstInputDOM.addEventListener('change', this.changeEventHadler)
    this.secondInputDOM.addEventListener('change',this.changeEventHadler)
  }
  changeEventHadler = ()=>{
    this.customEvent()
  }
  removeListeners(){
    this.firstInputDOM.removeEventListener('change', this.changeEventHadler)
    this.secondInputDOM.removeEventListener('change', this.changeEventHadler)
  }
  customEvent(){
    let dubleevent = new CustomEvent(this.options.eventName,{
      detail: {
          result: [+this.firstInputDOM.value,+this.secondInputDOM.value].sort((a,b)=>a-b)
      }
    })
    window.dispatchEvent(dubleevent)
  }
  renderInfoCurrentValue(){
    this.secondInfoDOM.style.left = `${((this.getPercent(this.firstInputDOM)/100)*this.firstInputDOM.offsetWidth)*0.9}px`
    this.secondInfoDOM.textContent = `${Math.round(Number(this.firstInputDOM.value))}`
    this.firstInfoDOM.style.left = `${((this.getPercent(this.secondInputDOM)/100)*this.secondInputDOM.offsetWidth)*0.9}px`
    this.firstInfoDOM.textContent = `${Math.round(Number(this.secondInputDOM.value))}`
  }
  setBackgroundGradient(){
    let minMaxArr = [this.getPercent(this.firstInputDOM),this.getPercent(this.secondInputDOM)].sort((a,b)=>a-b)
    this.firstInputDOM.style.background = `linear-gradient(90deg, rgb(119, 157, 179) ${minMaxArr[0]}%, rgb(174, 175, 85) ${minMaxArr[0]}%, 
    rgb(174, 175, 85) ${minMaxArr[1]}%, rgb(119, 157, 179) ${minMaxArr[1]}%)`
  }
  getPercent(elem:HTMLInputElement):number{
    return Number(elem.value)/Number(elem.max)*100
  }
  setRangeValue(min:number,max:number){
    this.firstInputDOM.value = min.toString()
    this.secondInputDOM.value = max.toString()
    this.setBackgroundGradient()
    this.renderInfoCurrentValue()
    //this.customEvent()
  }
}

function getdubleRangeHTML(options:DubleRangeOptions):string{
  return `
  <div class="duble-range">
    <input class="duble-range__input duble-range__i1" type="range" min="${options.min}" max="${options.max}" step="1" value="${options.min}">
    <input class="duble-range__input duble-range__i2" type="range" min="${options.min}" max="${options.max}" step="1" value="${options.max}">
    <div class="duble-range__info">
      <span class="info__left">L</span>
      <span class="info__right">R</span>
    </div>
  </div>
  `
}