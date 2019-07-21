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
          margin: 2px;
          display: inline-block;
          user-select: none;
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
          <dmp-btn-toggle ownid$='[[item.id]]' selected="{{item.selected}}" disabled="{{item.disabled}}" class='item' value='{{item.value}}'></dmp-btn-toggle>
          <!--
            <div>
              <input type="checkbox" checked="{{item.selected::change}}" />
              [[item.value]]
            </div>
          -->
          
        </template>
      </div>
      <template is='dom-repeat' items='{{errorMsgs}}' filter='[[_checkErrMsgTrue]]' observe='active'>
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
        type: Array,
        value: []
      },
      selectedItems:{
        type: Array
      },
      /** Selected indexes string coma separated */
      value : {      
        type: String,
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
      errorMsgs : {
        type : Array,
      },
      error : {
        type : Boolean,
        value: false
      },
      required : {
        type : Boolean
      },
      valid : {
        type: Boolean,
        value: false
      },
      itemsDisabled : {
        type: Boolean,
        value: false
      },
      autoValidate: {
        type: Boolean,
        value: false
      }
    }
  }

  static get observers () {
    return ['_itemsChanged(items.*)']
  }


  //---------------------------------------------------------
  //---------------------------------------------------------
  //----El valor y estado de este componente se setea al hacer toggle-----------------------------------------------------
  //----Pero este ha de setearse desde fuera porque los datos pueden haber sido cargados desde una api
  //----Crear un middleware parser si fuera necesario-------------------------------------------------
  //---------------------------------------------------------
  //---------------------------------------------------------

  reset() {
    this.items = undefined;
    this.valid = true;

  }

  isValid(){
    return this.valid;
  }

  /**
   * 
   * @param {*} index item index
   * @param {*} action true/false ( disabled )
   */
  toggleDisableItem(index, action) {
    this.set(`items.${index}.disabled`, action);
  }  

  _itemsChanged(newVal, oldVal) {
    const items = this.items;
    this.selectedItems = items.filter(item => item.selected);
    this._validateMax(items, this.maxItems, this.selectedItems );
  }

  _validateMax(items, validateMax, selectedItems) {
    this.valid = !(items && validateMax && selectedItems.length > validateMax);
    if ( items && validateMax && selectedItems.length >= validateMax ) {
      this._setItemsDisabled(items);
    }else if (items && validateMax){
      this._setItemsDisabled(items, true);
    }
  }

  _setItemsDisabled(items, all) {
    items.forEach((item, index) => {
      if ( all || item.selected ) {
        this.set(`items.${index}.disabled`, false)
      }else{
        this.set(`items.${index}.disabled`, true)
      }
    });
  }

 
}








window.customElements.define('dmp-item-selector', DmpItemSelector);
