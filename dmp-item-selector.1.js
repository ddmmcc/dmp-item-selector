import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '../node_modules/dmp-btn-toggle/dmp-btn-toggle.js';


/**
 * `dmp-input`
 * custom input with polymer3
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class DmpItemSelector extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          position: relative;
          background-color: var(--fondo);
        }
        

        .item {
            border-radius: 6px;
            margin: 2px;
            display: inline-block;
            color: white;
            user-select: none;
            transition: 0.4s box-shadow;
        }
        /* child vars */
        dmp-btn-toggle{
          /*
          --backgroundColor: red;
          --backgroundDisable : green;
          --backgroundSelected : orange;
          --borderRadius : 6px;
          */
        }
        .error{
          color: red;
        }
        </style>
      


      <div>[[label]]</div>
      <div>[[info]]</div>
      <div class='items'>
        <template is="dom-repeat" items="{{items}}" >
          <dmp-btn-toggle on-click='toggleElement' ownid$='[[item.id]]' class='item' value='[[item.value]]'></dmp-btn-toggle>
        </template>
      </div>
      <template is='dom-repeat' items='{{msgError}}' filter='[[_checkErrMsgTrue]]' observe='active'>
          <div class='error'>[[item.msg]]</div>
      </template>      
      `;
  }

  static get properties() {
    return {
      /** Array width selected indexes */
      arItemsSelected : {
        type: Array,
      },
      items : {
        type: Array
      },
      /** Selected indexes string coma separated */
      value : {      
        type: String,
      },
      txtValueEmpty : {
        type: Boolean,
        value: false
      },
      label : {
        type : String
      },
      info : {
        type : String,
      },
      maxItems : {
        type : Number,
      },
      minItems : {
        type : Number,
      },
      msgError : {
        type : Array,
      },
      error : {
        type : Boolean,
        value: false
      },
      required : {
        type : Boolean
      },
      validated : {
        type: Boolean,
        value: false
      },
      itemsDisabled : {
        type: Boolean,
        value: false
      }      
    }
  }

  static get observers () {
      return [

      ]
  }


  //---------------------------------------------------------
  //---------------------------------------------------------
  //----El valor y estado de este componente se setea al hacer toggle-----------------------------------------------------
  //----Pero este ha de setearse desde fuera porque los datos pueden haber sido cargados desde una api
  //----Crear un middleware parser si fuera necesario-------------------------------------------------
  //---------------------------------------------------------
  //---------------------------------------------------------


  generateErrorMsg(){
    this.msgError =  [
      {active : false , msg : "No puedes seleccionar mas de "+this.maxItems+" opciones" },
      {active : false , msg : "Debes seleccionar almenos "+this.minItems+" opciones" },
      {active : false , msg : "Este campo es requerido" }
    ]
  }
  toggleElement(e) {
    //var filter = this.$.filterError;
    var item = e.target;

    var itemId = Number(item.ownid);
    var index = this.arItemsSelected.indexOf(itemId);
    if ( index > -1 ) {
      this.removeValue(index);
      if ( this.itemsDisabled ){
        this.unDisableItems();
      }
    }else{                                     
      //if ( !this.error ){
      if ( !this.maxItems || this.arItemsSelected.length < this.maxItems ){
        this.addvalue(itemId);
        if ( this.maxItems && this.arItemsSelected.length === this.maxItems){
          this.disableItems();
        }
      }else{
        if ( !this.itemsDisabled ){
          this.disableItems();
        }
        return;
      }
      //}
    }
    this.error = this.validation();

    //filter.render();
    this.filterRefresh();
    this.highlightSelected();
    this.value = this.arItemsSelected.join(",");
  }

  disableItems(){
    //var elements = this.$$("dmp-btn-toggle:not([selected])");
    var elements = this.shadowRoot.querySelectorAll("dmp-btn-toggle:not([selected])");
    elements.forEach((item)=>{
      item.setAttribute("disabled", "disabled");
    })
    this.itemsDisabled = true;
  }
  unDisableItems(){
    var elements = this.shadowRoot.querySelectorAll("dmp-btn-toggle[disabled]");
    elements.forEach((item)=>{
      item.removeAttribute("disabled");
    })
    this.itemsDisabled = false;
  }
  addvalue(val){
    this.arItemsSelected.push(val);
  }
  removeValue(index){
    this.arItemsSelected.splice(index, 1);
  }
  arValueChange(){
    console.log("arValueChange called")
    this.value = this.arItemsSelected.join(",");
    this.selectedItems = (this.items || []).filter( (item, index) => this.arItemsSelected.includes(index))
  }
  _checkErrMsgTrue(item){
    return item.active; 
  }
  filterRefresh () {
    this.msgError = this.msgError.slice(0);
    //this.arITems = this.arITems.slice(0);
  }

  highlightSelected() {
    var items = this.root.querySelectorAll(".item"); // root or shadowRoot
    items.forEach(function (item){
      var id = Number(item.dataset.id);
      var result = this.arItemsSelected.some(function (arItem) {
        if ( id === arItem)  { return true;}
      })
      if ( result ){
        item.classList.add("active");
      }else{
        item.classList.remove("active");
      }
    }.bind(this))
  }
  validate(){
    this.validation();
  }
  validation(){
    var error = false;
    if ( this.errorMaxItemsAllow() ) {error = true}
    if ( this.errorMinItemsAllow() ) {error = true}
    if ( this.required ){
      if ( this.errorRequired() ) {error = true}
    }
    this.validate = !error;
    return error;
  }
  errorMaxItemsAllow(){
    if ( this.arItemsSelected.length > this.maxItems ){
      this.error = true;
      this.msgError[0].active = true;
    }else{
      this.error = false;
      this.msgError[0].active = false;
    }
    return this.error;
  }
  errorMinItemsAllow(){
    if ( this.arItemsSelected.length < this.minItems ){
      this.error = true;
      this.msgError[1].active = true;
    }else{
      this.error = false;
      this.msgError[1].active = false;
    }
    return this.error;
  }
  errorRequired(){
    if ( this.arItemsSelected.length === 0 ){
      this.error = true;
      this.msgError[2].active = true;
    }else{
      this.error = false;
      this.msgError[2].active = false;
    }
    return this.error;
  }
  ready(){
    super.ready();
    this.arItemsSelected = [];
    this.validateComp();
    this.generateErrorMsg();
  }
  
  validateComp(){
    if ( this.maxItems < this.minItems ){
      console.error("maxItems < minItems in "+this.constructor.name);
    }
  }
}








window.customElements.define('dmp-item-selector', DmpItemSelector);
